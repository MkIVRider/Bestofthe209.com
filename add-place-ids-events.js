const fs = require('fs');
let html = fs.readFileSync('events.html', 'utf-8');

const ids = {
    'Gallo Center for the Arts Modesto CA': 'ChIJxUSiYY1TkIARyoqJVsMY_N4',
    'Fruit Yard Amphitheater Modesto CA': 'ChIJ8dhLlZf_kIARMKLOLlODTUU',
    'Bob Hope Theatre Stockton CA': 'ChIJkbwYDZ0SkIARDZ1v1u9g7pw',
    'Stockton Memorial Civic Auditorium CA': 'ChIJ9SlGjZ0SkIAR_bPwT_KcoHY',
    'Weber Point Event Center Stockton CA': 'ChIJ3V0pTJwSkIARwoQyAeSZIt0',
    'Ironstone Amphitheatre Murphys CA': 'ChIJXam35Ce8kIARqupq7Bk9rEk',
    'State Theatre Modesto CA': 'ChIJ0Ysm7PJTkIAR_HLJawFsAlo',
    'Cast Iron Trading Co Stockton CA': 'ChIJw_5qxJgSkIAR9KvBfyyj8dI',
    'Taps Barrel House Stockton CA': 'ChIJ8Tf8j3ENkIARleFSpTIyY_E',
    'AVE on the Mile Stockton CA': 'ChIJc9EJo3MNkIARh-UPrSYZybo',
    'The Fox Pub Modesto CA': 'ChIJgbziTo1TkIARoL6zrLfQZy4',
    'Contentment Brewing Company Modesto CA': 'ChIJAQBw5-dTkIAR_LkdBdXtJDQ',
    'Ollies Irish Pub Lodi CA downtown': 'ChIJGbJdIhigmoARQyahzfIzLvc',
    'Dancing Fox Winery Brewery Lodi CA': 'ChIJpUWOABqgmoAR7fD2KQxVqOI',
    'Vault Nightclub Modesto CA': 'ChIJ2aE2O9pTkIARdaLGdXofmVU',
    'Paradise Nightclub Stockton CA': 'ChIJ-V9-CJgLkIARsmYI0T9LPvg',
};

for (const [q, id] of Object.entries(ids)) {
    html = html.replace(`query:"${q}"`, `query:"${q}",placeId:"${id}"`);
}

fs.writeFileSync('events.html', html);
console.log('Place IDs added to events.html');
