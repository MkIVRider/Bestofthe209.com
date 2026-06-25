const fs = require('fs');
const path = require('path');
const API_KEY = 'AIzaSyDlWKSpWK38vSSw2mYV-N3SOZaXKga2qSg';
const OUTPUT_DIR = path.join(__dirname, 'images', 'cafes');

const shops = [
    { slug: "trail-coffee", query: "Trail Coffee Roasters Stockton CA" },
    { slug: "empresso", query: "Empresso Coffeehouse Stockton CA" },
    { slug: "house-of-shaw", query: "House of Shaw Espresso Cafe Stockton CA" },
    { slug: "reds-espresso", query: "Reds Espresso Bar Stockton CA" },
    { slug: "legendary-coffee", query: "Legendary Coffee and Books Stockton CA" },
    { slug: "preservation-coffee", query: "Preservation Coffee and Tea Modesto CA" },
    { slug: "queen-bean", query: "Queen Bean Coffee House Modesto CA" },
    { slug: "roth-social", query: "Roth Social House Modesto CA" },
    { slug: "lodi-coffee-roasting", query: "Lodi Coffee Roasting Co Lodi CA" },
    { slug: "dancing-fox-coffee", query: "Dancing Fox Winery and Brewery Lodi CA" },
    { slug: "cahoots-lodi", query: "Cahoots Corner Cafe Lodi CA" },
    { slug: "central-coffee", query: "Central Coffee Co Tracy CA" },
    { slug: "world-coffee", query: "World Coffee House Tracy CA" },
    { slug: "sierra-coffee-tracy", query: "Sierra Coffee Co Tracy CA" },
    { slug: "manteca-coffee", query: "Manteca Coffee House Manteca CA" },
    { slug: "common-grounds", query: "Common Grounds Coffee Manteca CA" },
    { slug: "la-mo-cafe", query: "La Mo Cafe Turlock CA" },
    { slug: "roth-turlock", query: "Roth Social House Market Turlock CA" },
    { slug: "blakers-coffee", query: "Blakers Coffee House Turlock CA" },
    { slug: "cahoots-oakdale", query: "Cahoots Corner Cafe Oakdale CA" },
    { slug: "cowboy-coffee", query: "Cowboy Coffee Oakdale CA" },
    { slug: "cafecito-spot", query: "The Cafecito Spot Ceres CA" },
    { slug: "drip-coffee", query: "The Drip Coffee Bar Ceres CA" },
    { slug: "ripon-coffee", query: "Ripon Coffee Company Ripon CA" },
    { slug: "scm-coffee", query: "SCM Coffee Roasters Hughson CA" },
    { slug: "cahoots-escalon", query: "Cahoots Corner Cafe Escalon CA" },
    { slug: "gold-country-coffee", query: "Gold Country Coffee Angels Camp CA" },
    { slug: "legends-coffee-sonora", query: "Legends Coffee Company Sonora CA" },
];

const placeIds = {};

async function fetchPhotos(item) {
    const dir = path.join(OUTPUT_DIR, item.slug);
    if (fs.existsSync(dir) && fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).length >= 3) {
        console.log(`skip ${item.slug} — already has 3+ photos`);
        return;
    }
    fs.mkdirSync(dir, { recursive: true });
    try {
        const res = await fetch(`https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Goog-FieldMask': 'places.id,places.photos' },
            body: JSON.stringify({ textQuery: item.query, maxResultCount: 1 })
        });
        if (!res.ok) { console.log(`FAIL ${item.slug} — ${res.status}`); return; }
        const data = await res.json();
        const place = data.places?.[0];
        if (place?.id) {
            placeIds[item.slug] = place.id;
            console.log(`  placeId: ${item.slug} => ${place.id}`);
        }
        const photos = place?.photos;
        if (!photos?.length) { console.log(`FAIL ${item.slug} — no photos found`); return; }
        for (let i = 0; i < Math.min(3, photos.length); i++) {
            const img = await fetch(`https://places.googleapis.com/v1/${photos[i].name}/media?maxWidthPx=800&key=${API_KEY}`);
            if (img.ok) {
                fs.writeFileSync(path.join(dir, `${i + 1}.jpg`), Buffer.from(await img.arrayBuffer()));
                console.log(`  photo ${item.slug}/${i + 1}.jpg`);
            }
        }
        console.log(`done ${item.slug}`);
    } catch (e) { console.log(`FAIL ${item.slug} — ${e.message}`); }
    await new Promise(r => setTimeout(r, 300));
}

async function main() {
    console.log(`Fetching photos for ${shops.length} cafes...\n`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (const s of shops) await fetchPhotos(s);
    console.log('\n=== PLACE IDs ===');
    console.log(JSON.stringify(placeIds, null, 2));
    fs.writeFileSync(path.join(__dirname, 'cafe-place-ids.json'), JSON.stringify(placeIds, null, 2));
    console.log('\nSaved to cafe-place-ids.json');
}
main();
