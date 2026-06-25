/**
 * Add <noscript> crawlable content to all category pages.
 * Extracts listing data from JS and generates plain HTML for Google to index.
 */
const fs = require('fs');

const pages = [
    { file: 'dining.html', arrayName: 'restaurants', fields: ['name','cuisine','desc','city'] },
    { file: 'wineries.html', arrayName: 'wineries', fields: ['name','type','desc','region'] },
    { file: 'hotels.html', arrayName: 'hotels', fields: ['name','style','desc','city'] },
    { file: 'camping.html', arrayName: 'spots', fields: ['name','style','desc','area'] },
    { file: 'real-estate.html', arrayName: 'offices', fields: ['name','style','desc','city'] },
    { file: 'fishing.html', arrayName: 'spots', fields: ['name','style','desc','area'] },
    { file: 'hiking.html', arrayName: 'trails', fields: ['name','style','desc','area'] },
    { file: 'boating.html', arrayName: 'spots', fields: ['name','style','desc','area'] },
    { file: 'car-service.html', arrayName: 'shops', fields: ['name','style','desc','city'] },
    { file: 'events.html', arrayName: 'spots', fields: ['name','style','desc','city'] },
    { file: 'haircuts.html', arrayName: 'shops', fields: ['name','style','desc','city'] },
];

function extractListings(html, fields) {
    // Extract all objects from the JS array using regex for each entry
    const listings = [];
    // Match name:"..." patterns for each entry
    const nameRegex = /name:"([^"]+)"/g;
    const names = [];
    let m;
    while ((m = nameRegex.exec(html)) !== null) names.push(m[1]);

    // For each field, extract all values
    const fieldValues = {};
    fields.forEach(f => {
        fieldValues[f] = [];
        const re = new RegExp(f + ':"([^"]+)"', 'g');
        let match;
        while ((match = re.exec(html)) !== null) fieldValues[f].push(match[1]);
    });

    // Build listing objects
    for (let i = 0; i < fieldValues['name'].length; i++) {
        const item = {};
        fields.forEach(f => { item[f] = fieldValues[f][i] || ''; });
        listings.push(item);
    }
    return listings;
}

function buildNoscript(listings, fields, pageTitle) {
    let html = `\n<noscript>\n<div style="max-width:800px;margin:0 auto;padding:40px 20px">\n`;
    html += `<h2>${pageTitle}</h2>\n<ul>\n`;
    listings.forEach(item => {
        const location = item[fields[3]] || '';
        html += `<li><strong>${item.name}</strong>`;
        if (item[fields[1]]) html += ` — ${item[fields[1]]}`;
        if (location) html += ` (${location})`;
        html += `<br>${item.desc}</li>\n`;
    });
    html += `</ul>\n</div>\n</noscript>\n`;
    return html;
}

const titles = {
    'dining.html': 'Best Restaurants in the 209',
    'wineries.html': 'Best Wineries in the 209',
    'hotels.html': 'Best Hotels & Lodging in the 209',
    'camping.html': 'Best Camping in the 209',
    'real-estate.html': 'Best Real Estate in the 209',
    'fishing.html': 'Best Fishing in the 209',
    'hiking.html': 'Best Hiking & Trails in the 209',
    'boating.html': 'Best Boating & Water in the 209',
    'car-service.html': 'Best Car Service in the 209',
    'events.html': 'Best Events & Nightlife in the 209',
    'haircuts.html': 'Best Haircuts & Salons in the 209',
};

let count = 0;
pages.forEach(page => {
    let html = fs.readFileSync(page.file, 'utf-8');
    
    // Skip if already has noscript
    if (html.includes('<noscript>')) {
        console.log(`skip: ${page.file} (already has noscript)`);
        return;
    }

    const listings = extractListings(html, page.fields);
    if (listings.length === 0) {
        console.log(`skip: ${page.file} (no listings found)`);
        return;
    }

    const noscript = buildNoscript(listings, page.fields, titles[page.file]);
    
    // Insert before closing </body>
    html = html.replace('</body>', noscript + '</body>');
    fs.writeFileSync(page.file, html);
    count++;
    console.log(`done: ${page.file} (${listings.length} listings)`);
});

console.log(`\nAdded noscript to ${count} pages`);
