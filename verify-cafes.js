const fs = require('fs');
const K = 'AIzaSyDlWKSpWK38vSSw2mYV-N3SOZaXKga2qSg';

const html = fs.readFileSync('cafes.html', 'utf-8');
const re = /name:"([^"]+)",city:"([^"]+)"[^}]*placeId:"([^"]*)",query:"([^"]+)"/g;
const entries = [];
let m;
while ((m = re.exec(html)) !== null) {
    entries.push({ name: m[1], city: m[2], placeId: m[3], query: m[4] });
}

async function verify() {
    console.log(`Verifying ${entries.length} cafes...\n`);
    const issues = [];
    
    for (const e of entries) {
        if (!e.placeId) {
            console.log(`⚠️  NO ID: ${e.name} (${e.city})`);
            issues.push(e);
            continue;
        }
        try {
            const r = await fetch(`https://places.googleapis.com/v1/places/${e.placeId}?key=${K}&fields=displayName,formattedAddress`);
            if (!r.ok) { console.log(`❌ API ERR: ${e.name}`); issues.push(e); continue; }
            const d = await r.json();
            const actualName = d.displayName.text;
            const actualAddr = d.formattedAddress;
            const inCA = actualAddr.includes(', CA ');
            const inCity = actualAddr.toLowerCase().includes(e.city.toLowerCase());
            
            if (!inCA) {
                console.log(`❌ WRONG STATE: ${e.name} (${e.city}) -> ${actualName} @ ${actualAddr}`);
                issues.push(e);
            } else if (!inCity) {
                console.log(`⚠️  WRONG CITY: ${e.name} (${e.city}) -> ${actualName} @ ${actualAddr}`);
                issues.push(e);
            } else {
                console.log(`✅ ${e.name} (${e.city}) -> ${actualName} @ ${actualAddr}`);
            }
        } catch (err) {
            console.log(`❌ ERROR: ${e.name} - ${err.message}`);
            issues.push(e);
        }
        await new Promise(r => setTimeout(r, 100));
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Total: ${entries.length} | OK: ${entries.length - issues.length} | Issues: ${issues.length}`);
    if (issues.length > 0) {
        console.log(`\nProblems:`);
        issues.forEach(e => console.log(`  - ${e.name} (${e.city})`));
    }
}

verify();
