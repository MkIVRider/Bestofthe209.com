const fs = require('fs');

// Events
let events = fs.readFileSync('events.html', 'utf-8');
const eventIds = {
    'First and Main bar Turlock CA': 'ChIJDR4d634HkYARqptkIeKspAQ',
    'Twin Rivers Saloon Oakdale CA': 'ChIJg86HM2JOkIARDuuJTMMnBJI',
    'Grand Theatre Center for the Arts Tracy CA': 'ChIJvQVOIiM9kIARXxWdp7a2w2o',
};
for (const [q, id] of Object.entries(eventIds)) {
    events = events.replace(`query:"${q}"`, `query:"${q}",placeId:"${id}"`);
}
fs.writeFileSync('events.html', events);

// Wineries
let wineries = fs.readFileSync('wineries.html', 'utf-8');
const wineryIds = {
    'Newsome Harlow Wines Murphys CA': 'ChIJm8qBH229kIARXFMS38nYYUM',
    'Twisted Oak Winery Murphys CA': 'ChIJLU0qgRegmoARVQSFZwlTSeg',
    'Ironstone Vineyards Murphys CA': 'ChIJF1gAg52-kIARKS4eDEfvRLs',
};
for (const [q, id] of Object.entries(wineryIds)) {
    wineries = wineries.replace(`query:"${q}"`, `query:"${q}",placeId:"${id}"`);
}
fs.writeFileSync('wineries.html', wineries);

console.log('Done - place IDs added to events and wineries');
