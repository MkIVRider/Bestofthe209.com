const fs = require('fs');
const ids = JSON.parse(fs.readFileSync('cafe-place-ids.json', 'utf-8'));
let html = fs.readFileSync('cafes.html', 'utf-8');

for (const [slug, placeId] of Object.entries(ids)) {
    html = html.replace(`slug:"${slug}",query:`, `slug:"${slug}",placeId:"${placeId}",query:`);
}

fs.writeFileSync('cafes.html', html);
console.log(`Done - injected ${Object.keys(ids).length} place IDs into cafes.html`);
