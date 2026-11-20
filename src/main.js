import { PORTFOLIO_CONTENT } from "./content.js";

const REDUCED_MOTION =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER =
  window.matchMedia &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPortraitMarkup({
  src,
  alt,
  fallbackInitials,
  width,
  height,
  lazy
}) {
  const loadingAttr = lazy ? 'loading="lazy"' : 'fetchpriority="high"';
  return `
    <img
      src="${escapeHtml(src)}"
      alt="${escapeHtml(alt)}"
      width="${Number(width) || 960}"
      height="${Number(height) || 1280}"
      class="portrait-img js-portrait-img"
      ${loadingAttr}
      decoding="async"
    />
    <div class="portrait-fallback js-portrait-fallback" hidden>
      <span class="portrait-fallback-initials" aria-hidden="true">${escapeHtml(
        fallbackInitials
      )}</span>
      <span class="portrait-fallback-caption">${escapeHtml(
        PORTFOLIO_CONTENT.hero.fullName
      )}</span>
    </div>
  `;
}

function renderPhotoGallery(photos, galleryId, surfaceVariant = "dark") {
  if (!photos || !photos.length) return "";
  const gridModifier = photos.length === 3 ? "photo-gallery--3" : "";
  const btnModifier =
    surfaceVariant === "light" ? "gallery-thumb-btn--light" : "";

  return `
    <div class="photo-gallery ${gridModifier}" role="list">
      ${photos
        .map(
          (photo, idx) => `
        <button
          type="button"
          role="listitem"
          class="gallery-thumb-btn ${btnModifier} js-gallery-trigger"
          data-gallery="${escapeHtml(galleryId)}"
          data-index="${idx}"
          aria-label="View photo: ${escapeHtml(photo.caption || photo.alt)}"
        >
          <img
            src="${escapeHtml(photo.src)}"
            alt="${escapeHtml(photo.alt)}"
            width="${Number(photo.width) || 1200}"
            height="${Number(photo.height) || 900}"
            loading="lazy"
            decoding="async"
            class="gallery-thumb-img js-gallery-img"
          />
          <div class="gallery-fallback js-gallery-fallback" hidden>${escapeHtml(
            photo.caption || photo.alt
          )}</div>
          <span class="gallery-thumb-cap">${escapeHtml(
            photo.caption || photo.alt
          )}</span>
        </button>
      `
        )
        .join("")}
    </div>
  `;
}

function wireImageStates() {
  document.querySelectorAll(".js-portrait-img").forEach((img) => {
    const fallback = img.parentElement?.querySelector(".js-portrait-fallback");
    if (!fallback) return;

    const showFallback = () => {
      img.hidden = true;
      fallback.hidden = false;
    };

    const showImage = () => {
      img.hidden = false;
      img.classList.add("is-loaded");
      fallback.hidden = true;
    };

    img.addEventListener("error", showFallback, { once: true });
    img.addEventListener("load", showImage, { once: true });

    if (img.complete) {
      if (img.naturalWidth === 0) showFallback();
      else showImage();
    }
  });

  document.querySelectorAll(".js-gallery-img").forEach((img) => {
    const fallback = img.parentElement?.querySelector(".js-gallery-fallback");

    const onLoad = () => img.classList.add("is-loaded");
    const onError = () => {
      img.hidden = true;
      if (fallback) fallback.hidden = false;
    };

    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onError, { once: true });

    if (img.complete) {
      if (img.naturalWidth === 0) onError();
      else onLoad();
    }
  });
}

function renderNavigation() {
  const { nav } = PORTFOLIO_CONTENT;
  const brandEl = document.getElementById("nav-brand");
  const linksEl = document.getElementById("nav-links");
  const ctaEl = document.getElementById("nav-cta");
  const drawerLinksEl = document.getElementById("mobile-drawer-links");

  if (brandEl) brandEl.textContent = nav.brand;
  if (ctaEl) {
    ctaEl.textContent = nav.primaryCta.label;
    ctaEl.setAttribute("href", nav.primaryCta.href);
  }

  if (linksEl) {
    linksEl.innerHTML = nav.links
      .map(
        (link) =>
          `<a href="${escapeHtml(link.href)}" class="nav-link">${escapeHtml(
            link.label
          )}</a>`
      )
      .join("");
  }

  if (drawerLinksEl) {
    const allMobileLinks = [...nav.links, nav.primaryCta];
    drawerLinksEl.innerHTML = allMobileLinks
      .map(
        (link) =>
          `<a href="${escapeHtml(
            link.href
          )}" class="mobile-drawer-link js-drawer-link">${escapeHtml(
            link.label
          )}</a>`
      )
      .join("");
  }
}

function renderHero() {
  const { hero } = PORTFOLIO_CONTENT;
  const container = document.getElementById("hero-container");
  if (!container) return;

  const titleWordsHtml = hero.nameParts
    .map((part) => {
      const cls =
        part.style === "outline"
          ? "word-outline"
          : part.style === "gradient"
            ? "word-gradient"
            : "";
      return `<span class="hero-title-word ${cls} js-hero-anim">${escapeHtml(
        part.text
      )}</span>`;
    })
    .join("");

  const chipsHtml = hero.floatingChips
    .map(
      (chip, idx) =>
        `<div class="hero-chip hero-chip--${idx}" data-parallax="${
          idx === 1 ? -14 : 14
        }">${escapeHtml(chip)}</div>`
    )
    .join("");

  container.innerHTML = `
    <div class="hero-copy">
      <div class="hero-kicker-row mono-label js-hero-anim">
        <span class="hero-location-dot" aria-hidden="true"></span>
        <span>${escapeHtml(hero.location)}</span>
      </div>
      <h1 class="hero-title">${titleWordsHtml}</h1>
      <p class="hero-headline js-hero-anim">${escapeHtml(hero.headline)}</p>
      <div class="hero-actions js-hero-anim">
        <a href="${escapeHtml(
          hero.ctas.primary.href
        )}" class="btn btn-primary magnetic">${escapeHtml(
          hero.ctas.primary.label
        )}</a>
        <a
          href="${escapeHtml(hero.ctas.secondary.href)}"
          download="${escapeHtml(hero.ctas.secondary.download)}"
          class="btn btn-outline magnetic"
        >${escapeHtml(hero.ctas.secondary.label)}</a>
      </div>
    </div>

    <div class="hero-visual js-hero-anim">
      <div class="rotating-badge" aria-hidden="true">
        <svg viewBox="0 0 120 120" class="rotating-badge-svg">
          <defs>
            <path
              id="badgeCirclePath"
              d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
            />
          </defs>
          <text>
            <textPath href="#badgeCirclePath" startOffset="0%">
              ${escapeHtml(hero.badgeText)}
            </textPath>
          </text>
        </svg>
        <span class="rotating-badge-core">AG</span>
      </div>

      <div class="portrait-ring">
        <div class="portrait-arch">
          ${renderPortraitMarkup({
            src: hero.portrait.src,
            alt: hero.portrait.alt,
            fallbackInitials: hero.portrait.fallbackInitials,
            width: hero.portrait.width,
            height: hero.portrait.height,
            lazy: false
          })}
        </div>
      </div>

      ${chipsHtml}
    </div>
  `;
}

function renderMarquees() {
  const { marquees } = PORTFOLIO_CONTENT;
  const renderTrack = (items) => {
    const group = `
      <div class="marquee-group">
        ${items
          .map(
            (word) =>
              `<span class="marquee-item">${escapeHtml(
                word
              )}</span><span class="marquee-sep" aria-hidden="true"></span>`
          )
          .join("")}
      </div>
    `;
    return group + group;
  };

  const topEl = document.getElementById("marquee-top");
  const bottomEl = document.getElementById("marquee-bottom");
  if (topEl) topEl.innerHTML = renderTrack(marquees.top);
  if (bottomEl) bottomEl.innerHTML = renderTrack(marquees.bottom);
}

function renderAbout() {
  const { about, hero } = PORTFOLIO_CONTENT;
  const container = document.getElementById("about-container");
  if (!container) return;

  const statementHtml = about.statementParts
    .map((part) => {
      if (part.type === "gradient") {
        return `<span class="kw-gradient">${escapeHtml(part.text)}</span>`;
      }
      if (part.type === "underline") {
        return `<span class="kw-underline">${escapeHtml(
          part.text
        )}<svg class="kw-underline-svg" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 Q 60 2, 110 7 T 198 5" fill="none" stroke="url(#aboutUnderlineGrad)" stroke-width="4" stroke-linecap="round"/></svg></span>`;
      }
      return escapeHtml(part.text);
    })
    .join("");

  const { bento } = about;
  const aboutPhoto = about.photos[0] || hero.portrait;

  container.innerHTML = `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <linearGradient id="aboutUnderlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3A5BFF"/>
          <stop offset="50%" stop-color="#FF2E93"/>
          <stop offset="100%" stop-color="#FF8A00"/>
        </linearGradient>
      </defs>
    </svg>
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(about.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="about-heading">${escapeHtml(
          about.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">01</span>
    </header>

    <p class="about-statement" data-reveal>${statementHtml}</p>
    <p class="about-summary" data-reveal>${escapeHtml(about.bio)}</p>
    <p class="about-goal" data-reveal>${escapeHtml(about.goal)}</p>

    <div class="bento-grid">
      <article class="glass-card bento-tile bento-tile--portrait" data-reveal>
        <div class="bento-portrait-wrap">
          ${renderPortraitMarkup({
            src: aboutPhoto.src,
            alt: aboutPhoto.alt,
            fallbackInitials: hero.portrait.fallbackInitials,
            width: aboutPhoto.width,
            height: aboutPhoto.height,
            lazy: true
          })}
          <div class="bento-portrait-caption">
            <div class="mono-label">${escapeHtml(aboutPhoto.caption)}</div>
          </div>
        </div>
      </article>

      <article class="glass-card bento-tile tilt-card" data-reveal>
        <div class="mono-label">Mentorship</div>
        <div
          class="bento-metric tabular-nums js-counter"
          data-target="${bento.studentsCounter.target}"
          data-suffix="${escapeHtml(bento.studentsCounter.suffix)}"
        >${bento.studentsCounter.target}${escapeHtml(
          bento.studentsCounter.suffix
        )}</div>
        <div>
          <h3 class="bento-title">${escapeHtml(
            bento.studentsCounter.label
          )}</h3>
          <p class="bento-detail">${escapeHtml(
            bento.studentsCounter.detail
          )}</p>
        </div>
      </article>

      <article class="glass-card bento-tile tilt-card" data-reveal>
        <div class="mono-label">Market Sphere X</div>
        <div
          class="bento-metric tabular-nums js-counter"
          data-target="${bento.clientsCounter.target}"
          data-suffix="${escapeHtml(bento.clientsCounter.suffix)}"
        >${bento.clientsCounter.target}${escapeHtml(
          bento.clientsCounter.suffix
        )}</div>
        <div>
          <h3 class="bento-title">${escapeHtml(
            bento.clientsCounter.label
          )}</h3>
          <p class="bento-detail">${escapeHtml(
            bento.clientsCounter.detail
          )}</p>
        </div>
      </article>

      <article class="glass-card bento-tile tilt-card" data-reveal>
        <div class="mono-label">${escapeHtml(bento.innovetTile.badge)}</div>
        <div
          class="bento-metric tabular-nums js-counter"
          data-target="${bento.innovetTile.target}"
          data-suffix="${escapeHtml(bento.innovetTile.suffix)}"
        >${bento.innovetTile.target}${escapeHtml(
          bento.innovetTile.suffix
        )}</div>
        <div>
          <h3 class="bento-title">${escapeHtml(bento.innovetTile.label)}</h3>
          <p class="bento-detail">${escapeHtml(bento.innovetTile.detail)}</p>
        </div>
      </article>

      <article class="glass-card bento-tile bento-tile--cairo tilt-card" data-reveal>
        <div class="mono-label">${escapeHtml(bento.locationTile.city)}</div>
        <div class="cairo-clock-readout tabular-nums js-cairo-clock">--:--:--</div>
        <div>
          <h3 class="bento-title">${escapeHtml(
            bento.locationTile.clockLabel
          )} TIME</h3>
          <p class="bento-detail">Live local time in Giza / Cairo, Egypt</p>
        </div>
      </article>

      <article class="glass-card bento-tile tilt-card" data-reveal>
        <div class="mono-label">${escapeHtml(
          bento.techSkillsTile.badge
        )}</div>
        <div>
          <h3 class="bento-title">${escapeHtml(
            bento.techSkillsTile.label
          )}</h3>
          <p class="bento-detail">${escapeHtml(
            bento.techSkillsTile.detail
          )}</p>
        </div>
      </article>

      <article class="glass-card bento-tile bento-tile--wide tilt-card" data-reveal>
        <div class="mono-label">${escapeHtml(bento.focusTile.label)}</div>
        <ul class="focus-list">
          ${bento.focusTile.items
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
      </article>
    </div>
  `;
}

function renderAchievements() {
  const { achievements } = PORTFOLIO_CONTENT;
  const container = document.getElementById("achievements-container");
  if (!container) return;

  const { spotlight, secondary } = achievements;

  container.innerHTML = `
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(achievements.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="achievements-heading">${escapeHtml(
          achievements.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">02</span>
    </header>

    <div class="awards-stack">
      <article class="innovet-spotlight" id="innovet-spotlight" data-reveal>
        <div class="innovet-shine" aria-hidden="true"></div>
        <div class="innovet-burst-layer" id="innovet-burst" aria-hidden="true"></div>
        <div class="innovet-inner">
          <div class="innovet-top">
            <span class="sticker-badge">${escapeHtml(spotlight.sticker)}</span>
            <span class="innovet-date">${escapeHtml(spotlight.date)}</span>
          </div>
          <h3 class="innovet-title">${escapeHtml(spotlight.title)}</h3>
          <p class="innovet-event">${escapeHtml(spotlight.outcomes)}</p>
          <p class="innovet-organizers">${escapeHtml(spotlight.organizers)}</p>
          <p class="innovet-organizers">${escapeHtml(spotlight.description)}</p>

          ${renderPhotoGallery(spotlight.photos, "innovet", "dark")}

          <div class="innovet-footer">
            <div class="innovet-team">
              <span class="mono-label">Team:</span>
              ${spotlight.team
                .map(
                  (member) =>
                    `<span class="tag-chip">${escapeHtml(member)}</span>`
                )
                .join("")}
            </div>
            <button
              type="button"
              class="btn-card-expand js-open-modal"
              data-modal-id="innovet"
            >
              Read full case details
            </button>
          </div>
        </div>
      </article>

      <article class="glass-card award-secondary tilt-card" data-reveal>
        <div class="award-secondary-head">
          <span class="mono-label">${escapeHtml(secondary.badge)}</span>
          ${
            secondary.date
              ? `<span class="mono-label">${escapeHtml(secondary.date)}</span>`
              : ""
          }
        </div>
        <h3 class="award-secondary-title">${escapeHtml(secondary.title)}</h3>
        <div class="meta-line">
          <span>${escapeHtml(secondary.organizers)}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtml(secondary.location)}</span>
        </div>
        <p class="bento-detail">${escapeHtml(secondary.description)}</p>
        ${renderPhotoGallery(secondary.photos, "techskills", "light")}
        <div class="card-actions-row">
          <button
            type="button"
            class="btn-card-expand btn-card-expand--surface js-open-modal"
            data-modal-id="techskills"
          >
            Read full challenge details
          </button>
        </div>
      </article>
    </div>
  `;
}

function renderProjects() {
  const { projects } = PORTFOLIO_CONTENT;
  const container = document.getElementById("projects-container");
  if (!container) return;

  const cardsHtml = projects.items
    .map((project, idx) => {
      const flowHtml = project.flowSteps
        ? `
          <div class="flow-diagram" aria-label="AI Lead Qualification Pipeline Flow">
            ${project.flowSteps
              .map(
                (step, sIdx) =>
                  `<span class="flow-step" style="--step-index: ${sIdx}">${escapeHtml(
                    step
                  )}</span>${
                    sIdx < project.flowSteps.length - 1
                      ? '<span class="flow-arrow" aria-hidden="true">→</span>'
                      : ""
                  }`
              )
              .join("")}
          </div>
        `
        : "";

      const statsHtml = project.stats
        ? `
          <div class="project-stats-row">
            ${project.stats
              .map(
                (st) => `
              <div class="project-stat-box">
                <span class="project-stat-val tabular-nums">${escapeHtml(
                  st.value
                )}</span>
                <span class="project-stat-lbl">${escapeHtml(st.label)}</span>
              </div>
            `
              )
              .join("")}
          </div>
        `
        : "";

      const servicesHtml = project.services
        ? `
          <div class="services-grid">
            ${project.services
              .map((srv) => `<div class="service-pill">${escapeHtml(srv)}</div>`)
              .join("")}
          </div>
        `
        : "";

      const brandSwatchesHtml = project.brandColors
        ? `
          <div class="sakan-swatches" aria-label="SAKAN Brand Palette">
            ${project.brandColors
              .map(
                (hex) => `
              <span class="sakan-swatch">
                <span class="sakan-swatch-dot" style="background:${escapeHtml(
                  hex
                )}"></span>
                ${escapeHtml(hex)}
              </span>
            `
              )
              .join("")}
          </div>
        `
        : "";

      const roleBlock = project.myRole
        ? `
          <div class="role-highlight">
            <span class="role-highlight-label">My Role</span>
            <div>${escapeHtml(project.myRole)}</div>
          </div>
        `
        : "";

      const galleryHtml = project.photos?.length
        ? renderPhotoGallery(project.photos, project.id, "dark")
        : "";

      const expandBtn = !project.isPlaceholder
        ? `
          <div class="card-actions-row">
            <button
              type="button"
              class="btn-card-expand js-open-modal"
              data-modal-id="${escapeHtml(project.id)}"
            >
              View Case Study
            </button>
          </div>
        `
        : "";

      return `
        <article
          class="project-card project-card--${escapeHtml(project.mood)}"
          style="--stack-index: ${idx}"
          data-reveal
        >
          <div class="project-layout">
            <div class="project-number tabular-nums">${escapeHtml(
              project.number
            )}</div>
            <div>
              <div class="project-category">${escapeHtml(
                project.category
              )}</div>
              <h3 class="project-title">${escapeHtml(project.title)}</h3>
              ${
                project.tagline
                  ? `<p class="project-tagline ${
                      project.id === "sakan" ? "sakan-accent" : ""
                    }">${escapeHtml(project.tagline)}</p>`
                  : ""
              }
              ${brandSwatchesHtml}
              <p class="project-desc">${escapeHtml(project.description)}</p>
              ${statsHtml}
              ${roleBlock}
              ${servicesHtml}
              ${flowHtml}
              <div class="tag-row">
                ${project.tools
                  .map(
                    (tool) =>
                      `<span class="tag-chip">${escapeHtml(tool)}</span>`
                  )
                  .join("")}
              </div>
              ${galleryHtml}
              ${expandBtn}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  container.innerHTML = `
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(projects.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="projects-heading">${escapeHtml(
          projects.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">03</span>
    </header>
    <div class="projects-stack">${cardsHtml}</div>
  `;
}

function renderExperience() {
  const { experience } = PORTFOLIO_CONTENT;
  const container = document.getElementById("experience-container");
  if (!container) return;

  const itemsHtml = experience.items
    .map(
      (item) => `
      <article class="glass-card timeline-item" data-reveal>
        <span class="timeline-node" aria-hidden="true"></span>
        <div class="timeline-top">
          <h3 class="timeline-role">${escapeHtml(item.role)}</h3>
          <span class="timeline-period">${escapeHtml(item.period)}</span>
        </div>
        <p class="timeline-org">${escapeHtml(item.organization)}</p>
        <div class="meta-line">
          ${item.meta
            .map((m) => `<span>${escapeHtml(m)}</span>`)
            .join('<span aria-hidden="true">·</span>')}
        </div>
        <ul class="timeline-points">
          ${item.points.map((pt) => `<li>${escapeHtml(pt)}</li>`).join("")}
        </ul>
      </article>
    `
    )
    .join("");

  container.innerHTML = `
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(experience.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="experience-heading">${escapeHtml(
          experience.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">04</span>
    </header>
    <div class="timeline">${itemsHtml}</div>
  `;
}

function renderVolunteering() {
  const { volunteering } = PORTFOLIO_CONTENT;
  const container = document.getElementById("volunteering-container");
  if (!container) return;

  container.innerHTML = `
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(volunteering.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="volunteering-heading">${escapeHtml(
          volunteering.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">05</span>
    </header>

    <div class="timeline">
      <article class="glass-card volunteer-card" data-reveal>
        <span class="timeline-node" aria-hidden="true"></span>
        <div class="timeline-top">
          <h3 class="timeline-role">${escapeHtml(volunteering.role)}</h3>
          <span class="timeline-period">${escapeHtml(volunteering.date)}</span>
        </div>
        <p class="timeline-org">${escapeHtml(volunteering.event)} · ${escapeHtml(
          volunteering.location
        )}</p>
        <ul class="volunteer-highlights">
          ${volunteering.highlights
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
        <div class="certificate-callout">${escapeHtml(
          volunteering.certificate
        )}</div>
        ${renderPhotoGallery(volunteering.photos, "gef-2026", "light")}
        <div class="card-actions-row">
          <button
            type="button"
            class="btn-card-expand btn-card-expand--surface js-open-modal"
            data-modal-id="volunteering"
          >
            View full volunteering details
          </button>
        </div>
      </article>
    </div>
  `;
}

function renderSkills() {
  const { skills } = PORTFOLIO_CONTENT;
  const container = document.getElementById("skills-container");
  if (!container) return;

  const groupsHtml = skills.groups
    .map(
      (group) => `
      <article class="glass-card skill-group" data-reveal>
        <h3 class="skill-group-title">${escapeHtml(group.category)}</h3>
        <div class="skill-chips">
          ${group.items
            .map((item) => `<span class="skill-chip">${escapeHtml(item)}</span>`)
            .join("")}
        </div>
      </article>
    `
    )
    .join("");

  container.innerHTML = `
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(skills.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="skills-heading">${escapeHtml(
          skills.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">06</span>
    </header>
    <div class="skills-grid">${groupsHtml}</div>
  `;
}

function renderEducation() {
  const { education } = PORTFOLIO_CONTENT;
  const container = document.getElementById("education-container");
  if (!container) return;

  container.innerHTML = `
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(education.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="education-heading">${escapeHtml(
          education.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">07</span>
    </header>

    <article class="glass-card education-card" data-reveal>
      <div>
        <h3 class="education-degree">${escapeHtml(education.degree)}</h3>
        <p class="education-inst">${escapeHtml(education.institution)}</p>
        <p class="education-note">${escapeHtml(education.scholarship)}</p>
      </div>
      <span class="education-year">${escapeHtml(education.timeline)}</span>
      <div class="coursework-wrap">
        <span class="mono-label coursework-label">Relevant Coursework</span>
        <div class="skill-chips">
          ${education.coursework
            .map((course) => `<span class="skill-chip">${escapeHtml(course)}</span>`)
            .join("")}
        </div>
      </div>
    </article>
  `;
}

function renderJobFit() {
  const { jobFit } = PORTFOLIO_CONTENT;
  const container = document.getElementById("job-fit-container");
  if (!container || !jobFit) return;

  container.innerHTML = `
    <header class="section-header" data-reveal>
      <div>
        <div class="section-eyebrow">
          <span class="section-eyebrow-line" aria-hidden="true"></span>
          <span>${escapeHtml(jobFit.eyebrow)}</span>
        </div>
        <h2 class="section-title" id="job-fit-heading">${escapeHtml(
          jobFit.heading
        )}</h2>
      </div>
      <span class="section-index-outline" aria-hidden="true">08</span>
    </header>

    <article class="glass-card job-fit-card" data-reveal>
      <p class="job-fit-subtitle">${escapeHtml(jobFit.subtitle)}</p>

      <div class="job-fit-samples" aria-label="Example job descriptions">
        ${(jobFit.samples || [])
          .map(
            (sample, idx) =>
              `<button type="button" class="ask-chip js-job-sample" data-sample-index="${idx}">${escapeHtml(
                sample.label
              )}</button>`
          )
          .join("")}
      </div>

      <form id="job-fit-form" class="job-fit-form">
        <label class="sr-only" for="job-fit-input">Paste a job description</label>
        <textarea
          id="job-fit-input"
          class="job-fit-textarea"
          rows="5"
          placeholder="${escapeHtml(jobFit.placeholder)}"
        ></textarea>
        <div class="job-fit-actions">
          <button type="submit" class="btn btn-primary magnetic">${escapeHtml(
            jobFit.analyzeLabel
          )}</button>
          <button type="button" id="job-fit-clear" class="btn btn-outline">${escapeHtml(
            jobFit.clearLabel
          )}</button>
        </div>
      </form>

      <div
        id="job-fit-results"
        class="job-fit-results"
        aria-live="polite"
        hidden
      ></div>
    </article>
  `;
}

function renderContact() {
  const { contact } = PORTFOLIO_CONTENT;
  const container = document.getElementById("contact-container");
  if (!container) return;

  container.innerHTML = `
    <div class="section-eyebrow" data-reveal>
      <span class="section-eyebrow-line" aria-hidden="true"></span>
      <span>${escapeHtml(contact.eyebrow)}</span>
    </div>
    <h2 class="contact-headline" id="contact-heading" data-reveal>
      LET'S BUILD <span class="word-outline">SOMETHING</span>
      <span class="word-gradient">IMPACTFUL</span>
    </h2>

    <div class="contact-grid">
      <div class="contact-pills" data-reveal>
        <button
          type="button"
          class="contact-pill contact-pill--primary js-copy-btn magnetic"
          data-copy="${escapeHtml(contact.email)}"
          data-default-label="${escapeHtml(contact.email)} · Copy"
          aria-label="Copy email address ${escapeHtml(contact.email)}"
        >${escapeHtml(contact.email)} · Copy</button>
        <a
          href="mailto:${escapeHtml(contact.email)}"
          class="contact-pill magnetic"
        >Email App</a>
        <a
          href="${escapeHtml(contact.linkedin)}"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-pill magnetic"
        >${escapeHtml(contact.linkedinLabel)}</a>
        <a
          href="${escapeHtml(contact.github)}"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-pill magnetic"
        >${escapeHtml(contact.githubLabel)}</a>
        <button
          type="button"
          class="contact-pill js-copy-btn magnetic"
          data-copy="${escapeHtml(contact.phone)}"
          data-default-label="${escapeHtml(contact.phone)} · Copy"
          aria-label="Copy phone number ${escapeHtml(contact.phone)}"
        >${escapeHtml(contact.phone)} · Copy</button>
        <a
          href="${escapeHtml(contact.cvHref)}"
          download="Amir_Girgis_Mofid_CV.pdf"
          class="contact-pill magnetic"
        >${escapeHtml(contact.cvLabel)}</a>
      </div>

      <form class="glass-card contact-form" id="contact-form" data-reveal>
        <div class="form-row">
          <div class="form-field">
            <label for="cf-name">${escapeHtml(contact.form.nameLabel)}</label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              placeholder="${escapeHtml(contact.form.namePlaceholder)}"
            />
          </div>
          <div class="form-field">
            <label for="cf-email">${escapeHtml(contact.form.emailLabel)}</label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              placeholder="${escapeHtml(contact.form.emailPlaceholder)}"
            />
          </div>
        </div>
        <div class="form-field">
          <label for="cf-subject">${escapeHtml(
            contact.form.subjectLabel
          )}</label>
          <input
            id="cf-subject"
            name="subject"
            type="text"
            required
            placeholder="${escapeHtml(contact.form.subjectPlaceholder)}"
          />
        </div>
        <div class="form-field">
          <label for="cf-message">${escapeHtml(
            contact.form.messageLabel
          )}</label>
          <textarea
            id="cf-message"
            name="message"
            required
            placeholder="${escapeHtml(contact.form.messagePlaceholder)}"
          ></textarea>
        </div>
        <div
          id="smart-contact-insight"
          class="smart-contact-insight"
          aria-live="polite"
          hidden
        ></div>
        <div>
          <button type="submit" class="btn btn-primary magnetic">
            ${escapeHtml(contact.form.submitLabel)}
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderFooter() {
  const { footer } = PORTFOLIO_CONTENT;
  const container = document.getElementById("footer-container");
  if (!container) return;

  container.innerHTML = `
    <div class="container">
      <div class="footer-giant-name">${escapeHtml(footer.outlinedName)}</div>
      <div class="footer-bar">
        <div class="footer-clock">
          <span>${escapeHtml(footer.clockLabel)}</span>
          <span aria-hidden="true">·</span>
          <span class="tabular-nums js-cairo-clock">--:--:--</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtml(footer.location)}</span>
        </div>
        <button type="button" class="back-to-top" id="back-to-top">
          ${escapeHtml(footer.backToTop)}
        </button>
      </div>
    </div>
  `;
}

function buildModalContent(modalId) {
  const { achievements, projects, volunteering } = PORTFOLIO_CONTENT;

  if (modalId === "innovet") {
    const s = achievements.spotlight;
    return {
      eyebrow: `${s.sticker} · ${s.date}`,
      html: `
        <h3 class="modal-title" id="detail-modal-title">${escapeHtml(
          s.title
        )}</h3>
        <p>${escapeHtml(s.summitFocus)}</p>
        <div class="modal-section-block">
          <span class="mono-label">Organizers &amp; Partners</span>
          <p>${escapeHtml(s.organizers)}</p>
        </div>
        <div class="modal-section-block">
          <span class="mono-label">Our Achievement</span>
          <p>${escapeHtml(s.description)}</p>
          <p><strong>Team:</strong> ${escapeHtml(s.team.join(", "))}</p>
        </div>
        ${
          s.myRole
            ? `<div class="modal-section-block"><span class="mono-label">My Specific Part &amp; Event Day</span><p>${escapeHtml(
                s.myRole
              )}</p></div>`
            : ""
        }
      `
    };
  }

  if (modalId === "techskills") {
    const sec = achievements.secondary;
    return {
      eyebrow: sec.date ? `${sec.badge} · ${sec.date}` : sec.badge,
      html: `
        <h3 class="modal-title" id="detail-modal-title">${escapeHtml(
          sec.title
        )}</h3>
        <p><strong>Location:</strong> ${escapeHtml(sec.location)}</p>
        <p>${escapeHtml(sec.organizers)}</p>
        <div class="modal-section-block">
          <span class="mono-label">Outcome &amp; Skills</span>
          <p>${escapeHtml(sec.description)}</p>
          <p>${escapeHtml(sec.outcomes)}</p>
        </div>
        ${
          sec.myRole
            ? `<div class="modal-section-block"><span class="mono-label">Challenge &amp; Contribution</span><p>${escapeHtml(
                sec.myRole
              )}</p></div>`
            : ""
        }
      `
    };
  }

  if (modalId === "volunteering") {
    return {
      eyebrow: `${volunteering.date} · ${volunteering.location}`,
      html: `
        <h3 class="modal-title" id="detail-modal-title">${escapeHtml(
          volunteering.event
        )}</h3>
        <p><strong>${escapeHtml(volunteering.role)}</strong></p>
        <div class="modal-section-block">
          <span class="mono-label">Contributions &amp; Deals Room</span>
          <ul class="modal-list">
            ${volunteering.highlights
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}
          </ul>
        </div>
        ${
          volunteering.countsPlaceholder
            ? `<div class="modal-section-block"><span class="mono-label">Event Counts</span><p>${escapeHtml(
                volunteering.countsPlaceholder
              )}</p></div>`
            : ""
        }
      `
    };
  }

  const project = projects.items.find((p) => p.id === modalId);
  if (!project) return null;

  return {
    eyebrow: `${project.number} · ${project.category}`,
    html: `
      <h3 class="modal-title" id="detail-modal-title">${escapeHtml(
        project.title
      )}</h3>
      ${
        project.tagline
          ? `<p><strong>"${escapeHtml(project.tagline)}"</strong></p>`
          : ""
      }
      ${
        project.date || project.location
          ? `<div class="meta-line">${
              project.date ? `<span>${escapeHtml(project.date)}</span>` : ""
            }${
              project.date && project.location
                ? '<span aria-hidden="true">·</span>'
                : ""
            }${
              project.location
                ? `<span>${escapeHtml(project.location)}</span>`
                : ""
            }</div>`
          : ""
      }
      <p>${escapeHtml(project.description)}</p>
      ${
        project.development
          ? `<div class="modal-section-block"><span class="mono-label">Development &amp; Execution</span><p>${escapeHtml(
              project.development
            )}</p></div>`
          : ""
      }
      ${
        project.outcome
          ? `<div class="modal-section-block"><span class="mono-label">Outcome &amp; Impact</span><p>${escapeHtml(
              project.outcome
            )}</p></div>`
          : ""
      }
      ${
        project.myRole
          ? `<div class="modal-section-block"><span class="mono-label">My Role</span><p>${escapeHtml(
              project.myRole
            )}</p></div>`
          : ""
      }
      ${
        project.flowSteps
          ? `<div class="modal-section-block"><span class="mono-label">Pipeline Workflow</span><p>${escapeHtml(
              project.flowSteps.join(" → ")
            )}</p></div>`
          : ""
      }
      ${
        project.coreFeatures
          ? `<div class="modal-section-block"><span class="mono-label">Core Concept Features</span><ul class="modal-list">${project.coreFeatures
              .map((f) => `<li>${escapeHtml(f)}</li>`)
              .join("")}</ul></div>`
          : ""
      }
      ${
        project.services
          ? `<div class="modal-section-block"><span class="mono-label">Services</span><ul class="modal-list">${project.services
              .map((s) => `<li>${escapeHtml(s)}</li>`)
              .join("")}</ul></div>`
          : ""
      }
      ${
        project.selectedWorkDetail
          ? `<div class="modal-section-block"><span class="mono-label">Selected Client Work</span><p>${escapeHtml(
              project.selectedWorkDetail
            )}</p></div>`
          : ""
      }
      ${
        project.tools?.length
          ? `<div class="modal-section-block"><span class="mono-label">Stack &amp; Tools</span><div class="skill-chips modal-chips">${project.tools
              .map((t) => `<span class="skill-chip">${escapeHtml(t)}</span>`)
              .join("")}</div></div>`
          : ""
      }
      ${
        project.team
          ? `<div class="modal-section-block"><span class="mono-label">Team</span><p>${escapeHtml(
              project.team.join(", ")
            )}</p></div>`
          : ""
      }
    `
  };
}

function initDetailModal() {
  const modal = document.getElementById("detail-modal");
  const eyebrowEl = document.getElementById("detail-modal-eyebrow");
  const bodyEl = document.getElementById("detail-modal-body");
  const closeBtn = document.getElementById("detail-modal-close");
  if (!modal || !bodyEl || !eyebrowEl) return;

  let lastTrigger = null;

  const closeModal = () => {
    modal.hidden = true;
    lastTrigger?.focus();
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".js-open-modal");
    if (!trigger) return;
    const modalId = trigger.getAttribute("data-modal-id");
    const content = buildModalContent(modalId);
    if (!content) return;
    lastTrigger = trigger;
    eyebrowEl.textContent = content.eyebrow;
    bodyEl.innerHTML = content.html;
    modal.hidden = false;
    closeBtn?.focus();
  });

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const stage = document.getElementById("lightbox-stage");
  const imgEl = document.getElementById("lightbox-img");
  const capEl = document.getElementById("lightbox-caption");
  const counterEl = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  if (!lightbox || !imgEl || !capEl || !counterEl) return;

  const galleries = {
    innovet: PORTFOLIO_CONTENT.achievements.spotlight.photos,
    techskills: PORTFOLIO_CONTENT.achievements.secondary.photos,
    sakan:
      PORTFOLIO_CONTENT.projects.items.find((p) => p.id === "sakan")?.photos ||
      [],
    "gef-2026": PORTFOLIO_CONTENT.volunteering.photos
  };

  let currentList = [];
  let currentIndex = 0;
  let lastTrigger = null;
  let touchStartX = 0;

  const renderSlide = () => {
    const item = currentList[currentIndex];
    if (!item) return;
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    capEl.textContent = item.caption || item.alt;
    counterEl.textContent = `${currentIndex + 1} / ${currentList.length}`;
  };

  const open = (galleryId, index, trigger) => {
    const list = galleries[galleryId];
    if (!list || !list.length) return;
    currentList = list;
    currentIndex = Math.max(0, Math.min(index, list.length - 1));
    lastTrigger = trigger;
    renderSlide();
    lightbox.hidden = false;
    closeBtn?.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    imgEl.src = "";
    lastTrigger?.focus();
  };

  const step = (delta) => {
    if (!currentList.length) return;
    currentIndex =
      (currentIndex + delta + currentList.length) % currentList.length;
    renderSlide();
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".js-gallery-trigger");
    if (!trigger) return;
    const galleryId = trigger.getAttribute("data-gallery");
    const index = Number(trigger.getAttribute("data-index") || 0);
    open(galleryId, index, trigger);
  });

  prevBtn?.addEventListener("click", () => step(-1));
  nextBtn?.addEventListener("click", () => step(1));
  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === stage) close();
  });

  stage?.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0]?.clientX || 0;
    },
    { passive: true }
  );

  stage?.addEventListener(
    "touchend",
    (e) => {
      const dx = (e.changedTouches[0]?.clientX || 0) - touchStartX;
      if (Math.abs(dx) > 45) {
        step(dx > 0 ? -1 : 1);
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

function initLoader() {
  const loader = document.getElementById("page-loader");
  const skipBtn = document.getElementById("loader-skip");
  if (!loader) return;

  const firstEl = document.getElementById("loader-first");
  const lastEl = document.getElementById("loader-last");
  if (firstEl) firstEl.textContent = PORTFOLIO_CONTENT.loader.firstName;
  if (lastEl) lastEl.textContent = PORTFOLIO_CONTENT.loader.lastName;
  if (skipBtn) skipBtn.textContent = PORTFOLIO_CONTENT.loader.skipLabel;

  const dismiss = () => {
    if (loader.classList.contains("is-done")) return;
    loader.classList.add("is-done");
    loader.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      loader.style.display = "none";
    }, 480);
  };

  if (REDUCED_MOTION) {
    loader.style.display = "none";
    return;
  }

  const autoTimer = window.setTimeout(dismiss, 950);

  skipBtn?.addEventListener("click", () => {
    window.clearTimeout(autoTimer);
    dismiss();
  });

  loader.addEventListener("click", (e) => {
    if (e.target === loader) {
      window.clearTimeout(autoTimer);
      dismiss();
    }
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && !loader.classList.contains("is-done")) {
        window.clearTimeout(autoTimer);
        dismiss();
      }
    },
    { once: true }
  );
}

function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const labelEl = document.getElementById("theme-label");
  const metaTheme = document.getElementById("meta-theme-color");

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
    if (labelEl) {
      labelEl.textContent = theme === "dark" ? "Light" : "Dark";
    }
    if (metaTheme) {
      metaTheme.setAttribute(
        "content",
        theme === "dark" ? "#0E0B22" : "#FFF8F2"
      );
    }
    try {
      localStorage.setItem("amir-portfolio-theme", theme);
    } catch {
      // ignore storage failure
    }
  };

  const initial =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  applyTheme(initial);

  toggleBtn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function initMobileDrawer() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const drawer = document.getElementById("mobile-drawer");
  const closeBtn = document.getElementById("mobile-drawer-close");
  if (!menuBtn || !drawer) return;

  const setOpen = (open) => {
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      closeBtn?.focus();
    } else {
      menuBtn.focus();
    }
  };

  menuBtn.addEventListener("click", () => setOpen(drawer.hidden));
  closeBtn?.addEventListener("click", () => setOpen(false));
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) setOpen(false);
  });
  drawer.querySelectorAll(".js-drawer-link").forEach((link) => {
    link.addEventListener("click", () => {
      drawer.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) {
      setOpen(false);
    }
  });
}

function initCairoClock() {
  const clockEls = document.querySelectorAll(".js-cairo-clock");
  if (!clockEls.length) return;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const update = () => {
    const timeStr = formatter.format(new Date());
    clockEls.forEach((el) => {
      el.textContent = timeStr;
    });
  };

  update();
  window.setInterval(update, 1000);
}

function initInteractions() {
  document.getElementById("back-to-top")?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: REDUCED_MOTION ? "auto" : "smooth"
    });
  });

  document.querySelectorAll(".js-copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      const defaultLabel = btn.getAttribute("data-default-label") || value;
      if (!value) return;

      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          copied = true;
        }
      } catch {
        copied = false;
      }

      if (!copied) {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        }
        document.body.removeChild(helper);
      }

      if (copied) {
        showToast(`Copied ${value}`);
        btn.textContent = `${value} · Copied!`;
        window.clearTimeout(btn._copyTimer);
        btn._copyTimer = window.setTimeout(() => {
          btn.textContent = defaultLabel;
        }, 1800);
      } else {
        showToast(value);
      }
    });
  });

  const form = document.getElementById("contact-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const bodyText = `Hi Amir,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`;
    const mailtoUrl = `mailto:${encodeURIComponent(
      PORTFOLIO_CONTENT.contact.email
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      bodyText
    )}`;
    window.location.href = mailtoUrl;
  });

  const sections = Array.from(document.querySelectorAll("main > section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((sec) => observer.observe(sec));
  }
}

function triggerInnovetBurst() {
  if (REDUCED_MOTION) return;
  const burstLayer = document.getElementById("innovet-burst");
  if (!burstLayer || burstLayer.dataset.fired === "true") return;
  burstLayer.dataset.fired = "true";

  const colors = ["#FFD23F", "#FF2E93", "#3A5BFF", "#FF8A00", "#FFF8F2"];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = (Math.PI * 2 * i) / count;
    const distance = 90 + Math.random() * 160;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--ty", `${Math.sin(angle) * distance - 40}px`);
    piece.style.setProperty("--rot", `${Math.round(Math.random() * 360)}deg`);
    burstLayer.appendChild(piece);
  }

  window.setTimeout(() => {
    burstLayer.innerHTML = "";
  }, 1900);
}

function initCustomCursor() {
  if (!FINE_POINTER || REDUCED_MOTION) return;
  const cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  window.addEventListener("pointermove", (e) => {
    cursor.classList.add("is-visible");
    cursor.style.transform = `translate3d(${e.clientX - 10}px, ${
      e.clientY - 10
    }px, 0)`;
  });

  document.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-visible");
  });

  document
    .querySelectorAll("a, button, input, textarea, .project-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("is-active")
      );
    });
}

function initDesktopMicroInteractions() {
  if (!FINE_POINTER || REDUCED_MOTION) return;

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.16;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.18;
      btn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -5;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  document.querySelectorAll(".project-card").forEach((card) => {
    let rafId = 0;

    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || reducedMotionQuery?.matches) return;
      if (rafId) window.cancelAnimationFrame(rafId);

      const clientX = e.clientX;
      const clientY = e.clientY;
      rafId = window.requestAnimationFrame(() => {
        card.classList.add("is-tilting");
        const rect = card.getBoundingClientRect();
        const nx = (clientX - rect.left) / rect.width - 0.5;
        const ny = (clientY - rect.top) / rect.height - 0.5;
        const rx = ny * -4.2;
        const ry = nx * 4.2;
        const tx = nx * 7;
        const ty = ny * 6 - 6;

        card.style.setProperty("--glow-x", `${((nx + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty("--glow-y", `${((ny + 0.5) * 100).toFixed(1)}%`);
        card.style.transform = `perspective(1100px) translate3d(${tx.toFixed(
          2
        )}px, ${ty.toFixed(2)}px, 0) rotateX(${rx.toFixed(
          2
        )}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
    });

    card.addEventListener("pointerleave", () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      card.classList.remove("is-tilting");
      card.style.transform = "";
      card.style.removeProperty("--glow-x");
      card.style.removeProperty("--glow-y");
    });
  });

  const heroSection = document.getElementById("hero");
  const parallaxChips = document.querySelectorAll("[data-parallax]");
  if (heroSection && parallaxChips.length) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      parallaxChips.forEach((chip) => {
        const depth = Number(chip.getAttribute("data-parallax") || 12);
        chip.style.transform = `translate3d(${nx * depth}px, ${
          ny * depth
        }px, 0)`;
      });
    });
  }
}

function initMotion() {
  const innovetEl = document.getElementById("innovet-spotlight");
  if (innovetEl && "IntersectionObserver" in window) {
    const burstObs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          triggerInnovetBurst();
          burstObs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    burstObs.observe(innovetEl);
  }

  if (REDUCED_MOTION) return;

  const gsapLib = window.gsap;
  const scrollTriggerLib = window.ScrollTrigger;

  if (gsapLib && scrollTriggerLib) {
    gsapLib.registerPlugin(scrollTriggerLib);

    gsapLib.from(".js-hero-anim", {
      y: 26,
      opacity: 0,
      duration: 0.72,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.25,
      clearProps: "transform,opacity"
    });

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsapLib.from(el, {
        y: 28,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      });
    });

    document.querySelectorAll(".js-counter").forEach((counterEl) => {
      const target = Number(counterEl.getAttribute("data-target") || 0);
      const suffix = counterEl.getAttribute("data-suffix") || "";
      const state = { val: 0 };
      gsapLib.to(state, {
        val: target,
        duration: 1.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counterEl,
          start: "top 90%",
          once: true
        },
        onUpdate: () => {
          counterEl.textContent = `${Math.floor(state.val)}${suffix}`;
        },
        onComplete: () => {
          counterEl.textContent = `${target}${suffix}`;
        }
      });
    });

    window.addEventListener(
      "load",
      () => {
        scrollTriggerLib.refresh();
      },
      { once: true }
    );
  }
}

function renderAskAmirTrigger() {
  const root = document.getElementById("ask-amir-root");
  if (!root) return;
  const label = PORTFOLIO_CONTENT.assistant?.title || "Ask Amir";

  root.innerHTML = `
    <button
      type="button"
      id="ask-amir-fab"
      class="ask-fab"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="ask-amir-panel"
    >
      <span class="ask-fab-dot" aria-hidden="true"></span>
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}

function initLazySmartTools() {
  let smartToolsPromise = null;
  const loadSmartTools = () => {
    if (!smartToolsPromise) {
      smartToolsPromise = import("./smart-tools.js");
    }
    return smartToolsPromise;
  };

  const fab = document.getElementById("ask-amir-fab");
  if (fab) {
    let assistantOpened = false;
    const bootAssistant = async (openImmediately) => {
      const mod = await loadSmartTools();
      mod.initAskAmir(PORTFOLIO_CONTENT, {
        openImmediately: openImmediately && !assistantOpened
      });
      if (openImmediately) assistantOpened = true;
    };

    fab.addEventListener("pointerenter", () => loadSmartTools(), { once: true });
    fab.addEventListener("focus", () => loadSmartTools(), { once: true });
    fab.addEventListener(
      "click",
      () => {
        if (!document.getElementById("ask-amir-panel")) {
          bootAssistant(true);
        }
      },
      { once: true }
    );
  }

  const jobFitSection = document.getElementById("job-fit");
  const contactSection = document.getElementById("contact");

  const bootSections = async () => {
    const mod = await loadSmartTools();
    mod.initJobFitChecker(PORTFOLIO_CONTENT);
    mod.initSmartContactForm(PORTFOLIO_CONTENT);
  };

  if (jobFitSection || contactSection) {
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            obs.disconnect();
            bootSections();
          }
        },
        { rootMargin: "260px 0px" }
      );
      if (jobFitSection) obs.observe(jobFitSection);
      if (contactSection) obs.observe(contactSection);
    } else {
      bootSections();
    }

    jobFitSection?.addEventListener("focusin", bootSections, { once: true });
    jobFitSection?.addEventListener("click", bootSections, { once: true });
    contactSection?.addEventListener("focusin", bootSections, { once: true });
  }
}

function bootstrap() {
  renderNavigation();
  renderHero();
  renderMarquees();
  renderAbout();
  renderAchievements();
  renderProjects();
  renderExperience();
  renderVolunteering();
  renderSkills();
  renderEducation();
  renderJobFit();
  renderContact();
  renderFooter();
  renderAskAmirTrigger();

  wireImageStates();
  initLoader();
  initThemeToggle();
  initMobileDrawer();
  initCairoClock();
  initDetailModal();
  initLightbox();
  initInteractions();
  initCustomCursor();
  initDesktopMicroInteractions();
  initMotion();
  initLazySmartTools();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
