const fs = require('fs');
const path = require('path');
const API_KEY = 'AIzaSyCSBgPLKmFr0Iu90IQ0QJ-tV3ItP2wvnQw';
const OUTPUT_DIR = path.join(__dirname, 'images', 'camping');

const camps = [
    { slug: "calaveras-big-trees", query: "Calaveras Big Trees State Park campground CA" },
    { slug: "new-melones-glory", query: "Glory Hole Recreation Area New Melones Lake CA" },
    { slug: "don-pedro", query: "Don Pedro Lake camping Fleming Meadows CA" },
    { slug: "pinecrest-lake", query: "Pinecrest Lake campground CA" },
    { slug: "angels-camp-rv", query: "Angels Camp RV Camping Resort CA" },
    { slug: "lake-camanche", query: "Lake Camanche camping CA" },
    { slug: "caswell-state-park", query: "Caswell Memorial State Park campground CA" },
    { slug: "turlock-lake", query: "Turlock Lake State Recreation Area camping" },
    { slug: "woodward-reservoir", query: "Woodward Reservoir camping Oakdale CA" },
    { slug: "modesto-reservoir", query: "Modesto Reservoir camping CA" },
    { slug: "knights-ferry", query: "Knights Ferry recreation area Stanislaus River CA" },
    { slug: "lake-tulloch", query: "Lake Tulloch camping Copperopolis CA" },
    { slug: "two-rivers-rv", query: "Two Rivers RV Park Manteca CA" },
    { slug: "westgate-landing", query: "Westgate Landing Regional Park camping Stockton CA" },
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

async function main() {
    console.log(`Fetching photos for ${camps.length} camping spots...\n`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (const c of camps) await fetchPhotos(c);
    console.log('\nDone!');
}
main();
