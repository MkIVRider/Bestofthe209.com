const fs = require('fs');
const path = require('path');
const API_KEY = 'AIzaSyCSBgPLKmFr0Iu90IQ0QJ-tV3ItP2wvnQw';
const OUTPUT_DIR = path.join(__dirname, 'images', 'hotels');
const MAX_PHOTOS = 3;

const hotels = [
    { slug: "wine-roses", query: "Wine and Roses Resort Spa Lodi CA" },
    { slug: "hotel-bayit", query: "Hotel Bayit Salida Modesto CA" },
    { slug: "university-plaza", query: "University Plaza Waterfront Hotel Stockton CA" },
    { slug: "inn-locke-house", query: "The Inn at Locke House Lockeford CA" },
    { slug: "greenhorn-creek", query: "Greenhorn Creek Resort Angels Camp CA" },
    { slug: "angels-camp-rv", query: "Angels Camp RV Camping Resort CA" },
    { slug: "lake-tulloch", query: "Lake Tulloch RV Campground Marina Copperopolis CA" },
    { slug: "saddle-creek", query: "Saddle Creek Resort Copperopolis CA" },
    { slug: "murphys-inn", query: "Murphys Historic Hotel Murphys CA" },
    { slug: "dunbar-house", query: "Dunbar House 1880 Murphys CA" },
    { slug: "best-western-stockton", query: "Best Western Plus Heritage Inn Stockton CA" },
    { slug: "springhill-modesto", query: "SpringHill Suites Modesto CA" },
];

async function fetchPhotos(item) {
    const { slug, query } = item;
    const dir = path.join(OUTPUT_DIR, slug);
    if (fs.existsSync(dir) && fs.readdirSync(dir).length >= MAX_PHOTOS) {
        console.log(`✓ ${slug} — exists`); return;
    }
    fs.mkdirSync(dir, { recursive: true });
    try {
        const res = await fetch(`https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Goog-FieldMask': 'places.photos,places.displayName' },
            body: JSON.stringify({ textQuery: query, maxResultCount: 1 })
        });
        if (!res.ok) { console.log(`✗ ${slug} — ${res.status}`); return; }
        const data = await res.json();
        const place = data.places?.[0];
        if (!place?.photos?.length) { console.log(`✗ ${slug} — no photos`); return; }
        for (let i = 0; i < Math.min(MAX_PHOTOS, place.photos.length); i++) {
            const url = `https://places.googleapis.com/v1/${place.photos[i].name}/media?maxWidthPx=800&key=${API_KEY}`;
            const img = await fetch(url);
            if (img.ok) {
                fs.writeFileSync(path.join(dir, `${i+1}.jpg`), Buffer.from(await img.arrayBuffer()));
                console.log(`  ✓ ${slug} photo ${i+1}`);
            }
        }
        console.log(`✓ ${slug} — done`);
    } catch(e) { console.log(`✗ ${slug} — ${e.message}`); }
    await new Promise(r => setTimeout(r, 250));
}

async function main() {
    console.log(`Fetching photos for ${hotels.length} hotels...\n`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (const h of hotels) await fetchPhotos(h);
    console.log('\nDone!');
}
main();
