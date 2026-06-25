const fs = require('fs');
let html = fs.readFileSync('haircuts.html', 'utf-8');
const ids = {
    'Speakeasy Hair Co Stockton CA': 'ChIJS1M2MWwNkIARjxWNd-a107k',
    'Craft Barber Co Stockton CA': 'ChIJ5_t3VSYNkIAR_w5IIV0gyc8',
    'True Culture Barber Lounge Stockton CA': 'ChIJA_arR4ETkIARlMPba2NV84c',
    'The Magic Shop hair salon Stockton CA': 'ChIJtS8_aiENkIARb9n0-rhsID8',
    'Fredrick\'s Barber Style Modesto CA': 'ChIJO67w3QBRkIARCjxrHJwPP1U',
    'Golden State Barber Shop Tracy CA': 'ChIJOSY1QDw9kIARwSdYbQkatJ4',
    'Bambi Salon Tracy CA Grant Line Road': 'ChIJ66pV93YYkIARZZLwGnP4nNA',
    'Redefined Hair Studio Tracy CA': 'ChIJjyINrQo9kIARdDi6mXkfta8',
    'Noemi hair salon Manteca CA': 'ChIJC4gAYDM9kIARQSNhCaOPNCw',
    'Johni hair stylist blonde specialist Ripon CA': 'ChIJT6fy_01EkIARMG7MlQuKqss',
    'Christine salon hair Turlock CA': 'ChIJGdchwk4GkYARa4GJJGq4qFs',
    'Lodi Barber Shop Lodi CA': 'ChIJg36oKhigmoAR53FTJlvtfIs',
};
for (const [q, id] of Object.entries(ids)) {
    html = html.replace(`query:"${q}"`, `query:"${q}",placeId:"${id}"`);
}
fs.writeFileSync('haircuts.html', html);
console.log('Done - place IDs added');
