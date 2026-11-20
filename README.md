# Amir Girgis Mofid — Personal Portfolio

A vibrant, mobile-first personal portfolio website built with plain HTML, CSS, and vanilla JavaScript (with GSAP + ScrollTrigger loaded via CDN). All copy, metrics, photo paths, alt texts, captions, and editable placeholders are centralized in `src/content.js`.

## File Structure

```text
.
├── index.html                        # Semantic HTML5, SEO/OG tags, JSON-LD Person schema, Google Fonts, GSAP CDN
├── README.md
├── package.json                      # Local dev & static build scripts (Vite)
├── public/
│   ├── Amir_Girgis_CV.pdf            # CV PDF linked by DOWNLOAD CV (/Amir_Girgis_CV.pdf)
│   ├── og-image.png                  # 1200x630 Open Graph / Twitter share image
│   └── assets/
│       ├── amir.jpg                  # Main portrait (Hero & fallback)
│       ├── me/                       # Portrait photo for About
│       ├── innovet/                  # INNOVET III photos
│       ├── techskills/               # TechSkills Forum 2026 photos
│       ├── sakan/                    # SAKAN concept branding & social campaign visuals
│       └── gef-2026/                 # Global Entrepreneurship Festival 2026 & Volunteer Certificate
└── src/
    ├── content.js                    # Single source of truth for ALL text & media
    ├── styles.css                    # "Sunset Pop" design system (light default + dark toggle)
    └── main.js                       # Renderer, expandable modals, swipe/keyboard lightbox, Cairo clock, GSAP
```

## Optional Fields in `src/content.js`

Configure `EDITABLE_PLACEHOLDERS` at the top of `src/content.js` (empty strings `""` are hidden automatically in the UI):
- `TEAM_SIZE` (currently `"8"`)
- `TECHSKILLS_DATES` (optional event dates)
- `MARKET_SPHERE_WORK` (optional selected client work details)
- `INNOVET_EVENT_DAY` (optional event-day notes)
- `TECHSKILLS_CHALLENGE` (optional challenge details)
- `GEF_COUNTS` (optional investor/project counts)

## Local Run

### Using Vite
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

### Plain Static Server (without Vite)
Copy `public/Amir_Girgis_CV.pdf` and `public/assets/` to the root directory and run:
```bash
npx serve .
```

## Free Deployment

### Deploy on Vercel
1. Push this repository to GitHub.
2. Import the repository on [vercel.com](https://vercel.com), keep the Vite preset (`npm run build`, output directory `dist`), and deploy.

### Deploy on GitHub Pages
1. Run `npm run build` to generate the static `dist/` folder (or use GitHub Actions to run `npm run build` and upload `dist/`).
2. Enable GitHub Pages under **Settings → Pages**.
