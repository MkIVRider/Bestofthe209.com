const fs = require('fs');
const path = require('path');
const API_KEY = 'AIzaSyCSBgPLKmFr0Iu90IQ0QJ-tV3ItP2wvnQw';
const OUTPUT_DIR = path.join(__dirname, 'images', 'camping');

const camps = [
    { slug: "new-hogan-lake", query: "New Hogan Lake Acorn Campground Valley Springs CA" },
    { slug: "frank-raines", query: "Frank Raines Regional Park OHV camping CA" },
    { slug: "mcconnell-state", query: "McConnell State Recreation Area camping Delhi CA" },
    { slug: "pardee-lake", query: "Pardee Lake camping Amador County CA" },
];

async function fetchPhotos(item) {
    const dir = path.join(OUTPUT_DIR, item.slug);
    if (fs.existsSync(dir) && fs.readdirSync(dir).length >= 3) { console.log(`✓ ${item.slug} — exists`); return; }
    fs.mkdirSync(dir, { recursive: true });
    try {
        const res = await fetch(`https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-FieldMask': 'places.photos' },
            body: JSON.stringify({ textQuery: item.query, maxResultCount: 1 })
        });
        if (!res.ok) { console.log(`✗ ${item.slug} — ${res.status}`); return; }
        const data = await res.json();
        const photos = data.places?.[0]?.photos;
        if (!photos?.length) { console.log(`✗ ${item.slug} — no photos`); return; }
        for (let i = 0; i < Math.min(3, photos.length); i++) {
            const img = await fetch(`https://places.googleapis.com/v1/${photos[i].name}/media?maxWidthPx=800&key=${API_KEY}`);
            if (img.ok) fs.writeFileSync(path.join(dir, `${i+1}.jpg`), Buffer.from(await img.arrayBuffer()));
            console.log(`  ✓ ${item.slug} photo ${i+1}`);
        }
        console.log(`✓ ${item.slug} — done`);
    } catch(e) { console.log(`✗ ${item.slug} — ${e.message}`); }
    await new Promise(r => setTimeout(r, 250));
}

async function main() { for (const c of camps) await fetchPhotos(c); console.log('Done!'); }
main();
