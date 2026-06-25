# Best of the 209 — Developer & Operations Guide

## Overview

**bestofthe209.com** is a static directory website showcasing the best businesses, outdoor spots, and hidden gems across California's 209 area code (Central Valley + Gold Country foothills). It's hosted on GitHub Pages from the repo `MkIVRider/Bestofthe209.com` and served via the custom domain `bestofthe209.com`.

---

## Tech Stack

- **Hosting:** GitHub Pages (static HTML, auto-deploys on push to `main`)
- **Domain:** bestofthe209.com (CNAME configured)
- **Framework:** None — vanilla HTML/CSS/JS, no build step
- **Design:** Dark theme with gold (#d9b15b) accent, Playfair Display + Inter fonts
- **Images:** Google Places API photos stored in `/images/` subdirectories
- **Maps Links:** Google Maps with `query_place_id` format for mobile compatibility
- **Monetization:** Google AdSense (pub-5658205454534021)
- **API Key:** Stored locally in `config.js` (gitignored, never committed)

---

## Repository Structure

```
Bestofthe209.com/
├── index.html              # Landing page (carousel, category cards, blog preview)
├── dining.html             # 78 restaurants
├── wineries.html           # 23 wineries/tasting rooms
├── hotels.html             # 15 hotels/lodging
├── camping.html            # 18 campgrounds
├── real-estate.html        # 17 brokerages/agents
├── fishing.html            # 27 fishing spots/guides/bait shops
├── hiking.html             # 11 trails
├── boating.html            # 15 lakes/marinas/rentals
├── car-service.html        # 21 mechanics/body shops
├── events.html             # 21 venues/bars/clubs
├── haircuts.html           # 17 barbers/salons
├── cafes.html              # 22 coffee shops/roasters
├── blog.html               # Blog index page
├── blog/                   # Blog articles (5 currently)
│   ├── delta-fishing-spots.html
│   ├── lodi-wine-weekend.html
│   ├── small-town-restaurants.html
│   ├── knights-ferry-hike.html
│   └── murphys-tasting-rooms.html
├── about.html              # About page
├── privacy.html            # Privacy policy (required for AdSense)
├── ads.txt                 # AdSense verification
├── sitemap.xml             # All pages listed for SEO
├── robots.txt              # Crawler instructions
├── CNAME                   # GitHub Pages custom domain
├── favicon.png             # Browser tab icon
├── config.js               # API key (GITIGNORED - local only)
├── .gitignore              # Ignores config.js, fetch-*.js, node_modules, etc.
├── images/
│   ├── scenic/             # 41 landing page carousel photos
│   ├── blog/               # 5 blog hero images
│   ├── dining/             # Restaurant photos (3 per entry in slug folders)
│   ├── wineries/           # Winery photos
│   ├── hotels/             # Hotel photos
│   ├── camping/            # Camping photos
│   ├── realestate/         # Real estate photos
│   ├── fishing/            # Fishing photos
│   ├── hiking/             # Hiking photos
│   ├── boating/            # Boating photos
│   ├── carservice/         # Car service photos
│   ├── events/             # Events/nightlife photos
│   ├── haircuts/           # Haircuts/salon photos
│   ├── cafes/              # Cafe photos
│   └── logo.png            # Site logo
└── video/                  # (unused currently)
```

---

## How Category Pages Work

Every category page (dining, fishing, cafes, etc.) follows the same architecture:

### 1. HTML Structure
```html
<nav>           <!-- Fixed top nav with brand + back link -->
<header>        <!-- Hero section with animated background + title -->
<div.filters>   <!-- Sticky filter buttons (city, type) -->
<section.grid>  <!-- Empty grid — JS fills this -->
<section.cta>   <!-- "Get Featured" email CTA -->
<noscript>      <!-- Crawlable HTML for Google (SEO) -->
<script>        <!-- Data array + rendering logic -->
```

### 2. Data Array (inside `<script>`)
Each listing is a JS object in an array:
```javascript
const spots = [
    {
        name: "Trail Coffee Roasters",
        city: "Stockton",           // Used for city filter
        type: "roaster",            // Used for type filter
        style: "Fresh Roasted — Gorgeous Old Pharmacy",  // Gold subheading
        desc: "The best independent cafe in Stockton...", // Description text
        slug: "trail-coffee",       // Image folder name
        query: "Trail Coffee Roasters Stockton CA",       // Fallback Maps search
        placeId: "ChIJ...",         // Google Maps place ID (primary link)
        highlight: "Old Pharmacy • Fresh Roast • Work Space"  // Meta tag
    },
    // ... more entries
];
```

### 3. Rendering Logic
```javascript
// Shuffle on load (randomized order every visit)
for(let i=spots.length-1;i>0;i--){...Fisher-Yates shuffle...}

// Build cards and append to grid
spots.forEach(o => {
    const card = document.createElement('a');
    card.href = getMapsLink(o.query, o.placeId);
    card.innerHTML = `slideshow + body + meta + CTA`;
    grid.appendChild(card);
});
```

### 4. Maps Link Format (mobile-friendly)
```javascript
function getMapsLink(q, pid) {
    return pid
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}&query_place_id=${pid}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
```

### 5. Image Slideshows
Each entry has up to 3 photos at:
```
images/{category}/{slug}/1.jpg
images/{category}/{slug}/2.jpg
images/{category}/{slug}/3.jpg
```
The slideshow auto-rotates with `onerror="this.remove()"` on images 2 and 3 as fallback.

### 6. Noscript SEO Content
A `<noscript>` block before `</body>` contains a plain HTML `<ul>` with all listings rendered as `<li>` elements. This is invisible to users but crawlable by Google for indexing.

---

## How to Add a New Listing to an Existing Category

### Step 1: Get the Place ID
```javascript
// Use config.js for the API key
const { GOOGLE_API_KEY } = require('./config');

const res = await fetch(`https://places.googleapis.com/v1/places:searchText?key=${GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos' },
    body: JSON.stringify({ textQuery: "Business Name City CA", maxResultCount: 1 })
});
const data = await res.json();
// data.places[0].id = the placeId
// data.places[0].photos = array of photo references
```

### Step 2: Fetch Photos (3 per listing)
```javascript
const photos = data.places[0].photos;
for (let i = 0; i < Math.min(3, photos.length); i++) {
    const img = await fetch(`https://places.googleapis.com/v1/${photos[i].name}/media?maxWidthPx=800&key=${GOOGLE_API_KEY}`);
    fs.writeFileSync(`images/{category}/{slug}/${i+1}.jpg`, Buffer.from(await img.arrayBuffer()));
}
```

### Step 3: Add to the JS Array
Add the entry object to the array in the category HTML file. Place it anywhere — the shuffle randomizes order on load.

### Step 4: Add to Noscript
Add a `<li>` to the `<noscript>` section matching the format of existing entries.

### Step 5: Add City to Filter (if new)
If the city doesn't exist in the filter buttons, add:
```html
<button class="filter-btn" data-city="NewCity">NewCity</button>
```

### Step 6: Verify the Place ID
```javascript
const verify = await fetch(`https://places.googleapis.com/v1/places/${placeId}?key=${KEY}&fields=displayName,formattedAddress`);
// Confirm name and address match what you expect
```

### Step 7: Commit and Push
```bash
git add {category}.html images/{category}/{slug}/
git commit -m "feat: Add {Business Name} ({City}) to {category} page"
git push origin main
```
Site auto-deploys in ~1 minute.

---

## How to Create a New Category Page

1. **Copy an existing page** (e.g., `cafes.html`) as your template
2. **Update:**
   - `<title>` and `<meta description>`
   - Hero badge, h1, subtitle text
   - Hero animation (each page has a unique one)
   - Filter buttons (city list and type list)
   - The data array variable name and entries
   - Image folder path (`images/{newcategory}/`)
   - Noscript content
3. **Activate the card on `index.html`:**
   - Change `class="cat-card disabled"` to `class="cat-card"`
   - Change `href="#"` to `href="newcategory.html"`
   - Remove the `<span class="coming-badge">Coming Soon</span>`
4. **Add to `sitemap.xml`**
5. **Update `about.html`** stats and category list

---

## How to Add a New Blog Post

1. Create `blog/your-slug.html` using the template from any existing blog post
2. Key elements:
   - Full-bleed hero image (stored in `images/blog/`)
   - `hero-tag` (category badge)
   - `hero h1` (title)
   - `hero-meta` (date, read time, category emoji)
   - Article body with `<p>`, `<h2>`, `.pull-quote`, `.spot` cards
   - `.article-cta` linking to relevant category page
3. Add a card to `blog.html` (the blog index)
4. Update the "FROM THE 209" section on `index.html` if it should be featured (shows 3 latest)
5. Add to `sitemap.xml`

---

## Landing Page Carousel (Scenic Photos)

- 41 photos in `images/scenic/` — at least 2 per 209 town
- Carousel shuffles on every page load (JS Fisher-Yates)
- Each `<img>` has a `data-caption` attribute shown in the progress bar
- Auto-advances every 7 seconds

To add a scenic photo:
1. Fetch via Places API or download from a source
2. Save as `images/scenic/{city-descriptor}.jpg` (1600px wide)
3. Add an `<img>` tag to the carousel `<div id="carousel">` in `index.html`

---

## Key Design Tokens

```css
--gold: #d9b15b;
--gold-dim: rgba(217,177,91,.15);
--gold-glow: rgba(217,177,91,.3);
--dark: #060606;
--card-bg: rgba(255,255,255,.03);
--card-border: rgba(255,255,255,.06);
--text: #f0f0f0;
--text-dim: #999;
--radius: 16px;
```

Fonts: `Playfair Display` (headings, 700/900), `Inter` (body, 300-600)

---

## Google AdSense Setup

- Publisher ID: `ca-pub-5658205454534021`
- `ads.txt` is in the repo root
- AdSense script tag is in the `<head>` of every page
- Privacy policy at `/privacy.html` covers cookies, personalized ads, CCPA
- Noscript content ensures Google can crawl all listings

---

## Important Rules

1. **Never commit the API key.** It lives in `config.js` which is gitignored.
2. **Always verify place IDs** before adding. The Places API sometimes returns wrong businesses (different state, wrong category). Use the verify pattern:
   ```
   GET https://places.googleapis.com/v1/places/{placeId}?key={KEY}&fields=displayName,formattedAddress
   ```
3. **Images go in slug-named folders** with files named `1.jpg`, `2.jpg`, `3.jpg`.
4. **Update the noscript section** whenever adding/removing listings.
5. **Update `about.html` stats** when totals change significantly.
6. **Push to `main` branch** — GitHub Pages deploys automatically.
7. **Maps links use `query_place_id` format** — NOT `place/?q=place_id:` (that breaks on mobile).

---

## Common Operations Cheat Sheet

| Task | Steps |
|------|-------|
| Add 1 listing | Get placeId → fetch 3 photos → add to array → add to noscript → commit/push |
| Add new city filter | Add `<button>` to filter row, set `data-city="CityName"` |
| Fix wrong listing | Verify placeId → replace name/desc/photos if needed → commit/push |
| Add scenic photo | Download/fetch image → save to `images/scenic/` → add `<img>` to carousel |
| Add blog post | Create HTML in `blog/` → add card to `blog.html` → update index featured section |
| Verify all listings | Run `verify-all.js` (local script, uses config.js) |
| Update stats | Count entries per page → update `about.html` stats section |

---

## File Naming Conventions

- Category pages: `{category}.html` (lowercase, hyphens)
- Image folders: `images/{category}/{slug}/` 
- Slugs: lowercase, hyphens, descriptive (e.g., `backwoods-burgers`, `trail-coffee`)
- Scenic: `images/scenic/{city}-{descriptor}.jpg` (e.g., `lodi-arch.jpg`)
- Blog: `blog/{descriptive-slug}.html`, hero images at `images/blog/{name}.jpg`

---

## Current Coverage (as of June 2026)

| Category | Entries | Cities Covered |
|----------|---------|----------------|
| Dining | 78 | 15+ cities |
| Wineries | 23 | Lodi, Murphys, Copperopolis |
| Hotels | 15 | 8 cities |
| Camping | 18 | Foothills + Valley |
| Real Estate | 17 | 10 cities |
| Fishing | 27 | Delta, Foothills, Valley |
| Hiking | 11 | 6 areas |
| Boating | 15 | Delta, Foothills, Oakdale |
| Car Service | 21 | 10 cities |
| Events | 21 | 6 cities |
| Haircuts | 17 | 12 cities |
| Cafes | 22 | 10 cities |
| **Total** | **285** | **20+ towns** |

---

## Troubleshooting

- **Maps links open wrong place on mobile:** Check that `getMapsLink` uses `query_place_id` format, not `place/?q=place_id:`
- **Images showing wrong business:** The Places API returned photos for a different business. Verify the placeId resolves to the correct address.
- **GitHub Pages not updating:** Push was successful but cached. Wait 1-2 minutes or hard refresh.
- **AdSense "low value content":** Ensure noscript content exists on all pages, about page and privacy policy are present, blog posts provide editorial depth.
- **GitGuardian alerts:** API key was committed. The key is now in `config.js` (gitignored). If leaked, rotate immediately in Google Cloud Console.
