const fs = require('fs');
let html = fs.readFileSync('haircuts.html', 'utf-8');
const ids = {
    'Locals Only Barbershop Oakdale CA': 'ChIJT6OggZ35kIARnW_YYWEr3Ik',
    'Backroads Barber Oakdale CA': 'ChIJk8ymLNT5kIARFzDJHcAbDYE',
    'Babylon Cuts barber shop Ceres CA': 'ChIJPRJFjCyrkYARVV-fOPpgZog',
    'The Salon Boutique Angels Camp CA': 'ChIJy7c51ISVkIAR6eidRY-Spcg',
    'barber shop Escalon CA McHenry Avenue': 'ChIJ661-bNlZkIARkLxKFpq8KvI',
};
for (const [q, id] of Object.entries(ids)) {
    html = html.replace(`query:"${q}"`, `query:"${q}",placeId:"${id}"`);
}
fs.writeFileSync('haircuts.html', html);
console.log('Done');
