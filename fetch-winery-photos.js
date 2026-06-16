/**
 * Fetch winery photos for the wineries page.
 * Usage: node fetch-winery-photos.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyCSBgPLKmFr0Iu90IQ0QJ-tV3ItP2wvnQw';
const OUTPUT_DIR = path.join(__dirname, 'images', 'wineries');
const MAX_PHOTOS = 3;

const wineries = [
    { slug: "michael-david", query: "Michael David Winery Lodi CA" },
    { slug: "klinker-brick", query: "Klinker Brick Winery Lodi CA" },
    { slug: "acquiesce", query: "Acquiesce Winery Lodi CA" },
    { slug: "bokisch", query: "Bokisch Vineyards Lodi CA" },
    { slug: "m2-wines", query: "m2 Wines Acampo Lodi CA" },
    { slug: "fields-family", query: "Fields Family Wines Lodi CA" },
    { slug: "harney-lane", query: "Harney Lane Winery Lodi CA" },
    { slug: "mettler-family", query: "Mettler Family Vineyards Lodi CA" },
    { slug: "lucas-winery", query: "The Lucas Winery Lodi CA" },
    { slug: "dancing-fox-winery", query: "Dancing Fox Winery Lodi CA" },
    { slug: "estate-crush", query: "Estate Crush Winery Lodi CA" },
    { slug: "oak-ridge", query: "Oak Ridge Winery Lodi CA" },
    { slug: "delicato", query: "Delicato Family Wines Manteca CA" },
    { slug: "ironstone", query: "Ironstone Vineyards Murphys CA" },
    { slug: "hovey-winery", query: "Hovey Winery Murphys CA" },
    { slug: "hatcher-winery", query: "Hatcher Winery Murphys CA" },
    { slug: "lavender-ridge", query: "Lavender Ridge Vineyard Murphys CA" },
    { slug: "copper-cellar", query: "The Copper Cellar Wine Bar Copperopolis CA" },
    { slug: "oak-farm", query: "Oak Farm Vineyards Lodi CA" },
    { slug: "jeremy-wine", query: "Jeremy Wine Co Lodi CA" },
];

async function fetchPhotos(winery) {
    const { slug, query } = winery;
    const dir = path.join(OUTPUT_DIR, slug);

    if (fs.existsSync(dir) && fs.readdirSync(dir).length >= MAX_PHOTOS) {
        console.log(`✓ ${slug} — already has photos, skipping`);
        return;
    }

    fs.mkdirSync(dir, { recursive: true });

    try {
        const searchRes = await fetch(
            `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Goog-FieldMask': 'places.photos,places.displayName' },
                body: JSON.stringify({ textQuery: query, maxResultCount: 1 })
            }
        );

        if (!searchRes.ok) { console.log(`✗ ${slug} — API error ${searchRes.status}`); return; }

        const data = await searchRes.json();
        const place = data.places && data.places[0];
        if (!place || !place.photos || place.photos.length === 0) { console.log(`✗ ${slug} — no photos`); return; }

        const photos = place.photos.slice(0, MAX_PHOTOS);
        for (let i = 0; i < photos.length; i++) {
            const photoUrl = `https://places.googleapis.com/v1/${photos[i].name}/media?maxWidthPx=800&key=${API_KEY}`;
            const imgRes = await fetch(photoUrl);
            if (!imgRes.ok) { console.log(`  ✗ ${slug} photo ${i+1} failed`); continue; }
            fs.writeFileSync(path.join(dir, `${i+1}.jpg`), Buffer.from(await imgRes.arrayBuffer()));
            console.log(`  ✓ ${slug} photo ${i+1} saved`);
        }
        console.log(`✓ ${slug} — done`);
    } catch (e) { console.log(`✗ ${slug} — ${e.message}`); }

    await new Promise(r => setTimeout(r, 250));
}

async function main() {
    console.log(`Fetching photos for ${wineries.length} wineries...\n`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (const w of wineries) await fetchPhotos(w);
    console.log('\nDone!');
}

main();
