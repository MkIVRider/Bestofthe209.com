const fs = require('fs');
let html = fs.readFileSync('dining.html', 'utf-8');
const ids = {
    'Agave Azul Kitchen Tequila Bar Hughson CA': 'ChIJKRrbpUMAkYARqUqKAo0cPpw',
    'Slick Fork BBQ Hughson CA': 'ChIJq6rG40MAkYARhT_5zJrcEig',
    'El Ranchito Restaurant Riverbank CA': 'ChIJB51qTZ5XkIAR6Ebu3sm4Dzw',
    'Frida Bar Newman CA': 'ChIJ50keCJOjkYAR7kr_Y4rcvoQ',
    'Woods Creek Cafe Jamestown CA': 'ChIJ-dk_xXHEkIARHcm6YNcOJDQ',
    'Senor Taco Seafood Waterford CA': 'ChIJs3BHwPkCkYARljAGBOKU6Cs',
};
for (const [q, id] of Object.entries(ids)) {
    html = html.replace(`query:"${q}"`, `query:"${q}",placeId:"${id}"`);
}
fs.writeFileSync('dining.html', html);
console.log('Done - 6 place IDs added');
