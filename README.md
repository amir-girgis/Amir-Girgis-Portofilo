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
│   └── assets/
│       ├── amir.jpg                  # Main portrait (Hero & fallback)
│       ├── me/                       # Portrait photo for About
│       ├── innovet/                  # INNOVET III photos
│       ├── techskills/               # TechSkills Forum 2026 photos
│       ├── sakan/                    # SAKAN concept branding & social campaign visuals
│       └── gef-2026/                 # Global Entrepreneurship Festival 2026 & Volunteer Certificate
└── src/
    ├── content.js                    # Single source of truth for ALL text, media & placeholders
    ├── styles.css                    # "Sunset Pop" design system (light default + dark toggle)
    └── main.js                       # Renderer, expandable modals, swipe/keyboard lightbox, Cairo clock, GSAP
```

## Editable Placeholders in `src/content.js`

Update `EDITABLE_PLACEHOLDERS` at the top of `src/content.js`:
- `TEAM_SIZE` (`[TEAM_SIZE]`)
- `TECHSKILLS_DATES` (`[TECHSKILLS_DATES]`)
- `MARKET_SPHERE_WORK` (`[ADD DETAIL: selected client work, only if provided]`)
- `INNOVET_EVENT_DAY` (`[ADD DETAIL: my specific part in the competition and the event day]`)
- `TECHSKILLS_CHALLENGE` (`[ADD DETAIL: what the challenge involved and my contribution]`)
- `GEF_COUNTS` (`[ADD DETAIL: number of investors/projects only if provided]`)

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
