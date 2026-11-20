/**
 * ============================================================================
 * LAZY-LOADED CLIENT-SIDE SMART TOOLS (100% LOCAL, ZERO APIS, ZERO STORAGE)
 * ============================================================================
 * 1) "Ask Amir" Assistant (bilingual EN/AR normalization, synonyms, fuzzy match)
 * 2) Job Fit Checker (local JD keyword matching + honest gaps)
 * 3) Smart Contact Form Classifier (keyword routing + subject pre-fill)
 * ============================================================================
 */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Normalize English and Arabic text while preserving meaningful symbols like C# and .NET.
 */
function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/c#/g, " csharp ")
    .replace(/\.net/g, " dotnet ")
    .replace(/asp\.net/g, " aspnet ")
    .replace(/[\u064B-\u065F\u0670]/g, "") // Arabic diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}\s+#.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const rawTokens = normalized.split(" ").filter((t) => t.length > 0);
  const tokens = [];
  for (const tok of rawTokens) {
    tokens.push(tok);
    // Lightweight Arabic definite-article normalization (ال -> stem)
    if (/^[\u0600-\u06FF]+$/.test(tok) && tok.startsWith("ال") && tok.length >= 5) {
      tokens.push(tok.slice(2));
    }
  }
  return tokens;
}

/**
 * Bounded Damerau-Levenshtein distance for lightweight typo tolerance.
 */
function damerauLevenshtein(a, b, maxDist = 2) {
  const lenA = a.length;
  const lenB = b.length;
  if (Math.abs(lenA - lenB) > maxDist) return maxDist + 1;
  if (a === b) return 0;

  const dp = Array.from({ length: lenA + 1 }, () => new Array(lenB + 1).fill(0));
  for (let i = 0; i <= lenA; i++) dp[i][0] = i;
  for (let j = 0; j <= lenB; j++) dp[0][j] = j;

  for (let i = 1; i <= lenA; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, dp[i - 2][j - 2] + cost);
      }
      dp[i][j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist) return maxDist + 1;
  }

  return dp[lenA][lenB];
}

function isFuzzyMatch(queryToken, targetToken) {
  if (queryToken === targetToken) return true;
  // Restrict fuzzy edit-distance to Latin/ASCII words to avoid false Arabic template collisions
  if (!/^[a-z0-9+.#-]+$/.test(queryToken) || !/^[a-z0-9+.#-]+$/.test(targetToken)) {
    return false;
  }
  const minLen = Math.min(queryToken.length, targetToken.length);
  if (minLen < 4) return false;
  const allowedDist = minLen >= 8 ? 2 : 1;
  return damerauLevenshtein(queryToken, targetToken, allowedDist) <= allowedDist;
}

/**
 * Build an inverted synonym group lookup from content.assistant.synonyms.
 */
export function buildSynonymGroups(synonymsMap) {
  const groups = [];
  for (const [canonical, list] of Object.entries(synonymsMap || {})) {
    const terms = new Set([normalizeText(canonical)]);
    for (const item of list || []) {
      const norm = normalizeText(item);
      if (norm) terms.add(norm);
    }
    groups.push(Array.from(terms));
  }
  return groups;
}

function expandQueryTokens(rawQuery, synonymGroups) {
  const normalizedQuery = normalizeText(rawQuery);
  const tokens = tokenize(rawQuery);
  const expanded = new Set(tokens);

  for (const group of synonymGroups) {
    let hit = false;
    for (const term of group) {
      if (term.includes(" ")) {
        if (normalizedQuery.includes(term)) {
          hit = true;
          break;
        }
      } else {
        for (const tok of tokens) {
          if (tok === term || isFuzzyMatch(tok, term)) {
            hit = true;
            break;
          }
        }
      }
      if (hit) break;
    }
    if (hit) {
      for (const term of group) {
        if (!term.includes(" ")) expanded.add(term);
        else term.split(" ").forEach((part) => expanded.add(part));
      }
    }
  }

  return {
    normalizedQuery,
    directTokens: tokens,
    expandedTokens: Array.from(expanded)
  };
}

/**
 * Score a single Q&A entry against the user's normalized + synonym-expanded query.
 */
function scoreQaEntry(entry, queryData) {
  const { normalizedQuery, directTokens, expandedTokens } = queryData;
  if (!normalizedQuery) return 0;

  let score = 0;
  const normQuestion = normalizeText(entry.question);

  // Exact or near-exact question match
  if (normalizedQuery === normQuestion) {
    score += 10;
  }

  // Keyword & phrase scoring
  for (const rawKw of entry.keywords || []) {
    const kw = normalizeText(rawKw);
    if (!kw) continue;

    if (kw.includes(" ")) {
      if (normalizedQuery.includes(kw)) {
        score += 3.2;
      }
    } else {
      if (directTokens.includes(kw)) {
        score += 2.2;
      } else if (expandedTokens.includes(kw)) {
        score += 1.2;
      } else if (directTokens.some((tok) => isFuzzyMatch(tok, kw))) {
        score += 1.5;
      }
    }
  }

  // Question token overlap bonus
  const questionTokens = tokenize(entry.question).filter((t) => t.length > 2);
  for (const qt of questionTokens) {
    if (directTokens.includes(qt)) {
      score += 0.65;
    } else if (expandedTokens.includes(qt)) {
      score += 0.35;
    } else if (directTokens.some((tok) => isFuzzyMatch(tok, qt))) {
      score += 0.45;
    }
  }

  return score;
}

export function answerPortfolioQuery(rawQuery, assistantConfig, synonymGroups) {
  const queryData = expandQueryTokens(rawQuery, synonymGroups);
  if (!queryData.directTokens.length) {
    return { matched: false, entry: null, related: [] };
  }

  let bestEntry = null;
  let bestScore = 0;

  for (const entry of assistantConfig.qaEntries || []) {
    const score = scoreQaEntry(entry, queryData);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  const THRESHOLD = 1.45;
  if (!bestEntry || bestScore < THRESHOLD) {
    return { matched: false, entry: null, related: [] };
  }

  const byId = new Map(
    (assistantConfig.qaEntries || []).map((item) => [item.id, item])
  );
  const related = (bestEntry.relatedIds || [])
    .map((id) => byId.get(id))
    .filter(Boolean)
    .slice(0, 2);

  return { matched: true, entry: bestEntry, related };
}

/* ==========================================================================
   1) "ASK AMIR" FLOATING ASSISTANT
   ========================================================================== */
export function initAskAmir(content, options = {}) {
  const root = document.getElementById("ask-amir-root");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const assistant = content.assistant;
  const contact = content.contact;
  const synonymGroups = buildSynonymGroups(assistant.synonyms);

  const fab = document.getElementById("ask-amir-fab");
  const panelHtml = `
    <section
      id="ask-amir-panel"
      class="ask-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="ask-amir-title"
      hidden
    >
      <header class="ask-panel-head">
        <div>
          <h2 class="ask-panel-title" id="ask-amir-title">${escapeHtml(
            assistant.title
          )}</h2>
          <p class="ask-panel-sub">${escapeHtml(assistant.subtitle)}</p>
        </div>
        <button
          type="button"
          id="ask-amir-close"
          class="ask-close-btn"
          aria-label="Close Ask Amir assistant"
        >✕</button>
      </header>

      <div
        id="ask-amir-messages"
        class="ask-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        tabindex="0"
      >
        <div class="ask-msg ask-msg--bot">
          <p>${escapeHtml(assistant.welcomeMessage)}</p>
        </div>
      </div>

      <div class="ask-suggestions" aria-label="Suggested questions">
        ${(assistant.suggestedQuestions || [])
          .map(
            (q) =>
              `<button type="button" class="ask-chip js-ask-suggestion">${escapeHtml(
                q
              )}</button>`
          )
          .join("")}
      </div>

      <form id="ask-amir-form" class="ask-form">
        <label class="sr-only" for="ask-amir-input">Ask a question about Amir</label>
        <input
          id="ask-amir-input"
          type="text"
          class="ask-input"
          autocomplete="off"
          placeholder="${escapeHtml(assistant.inputPlaceholder)}"
        />
        <button type="submit" class="ask-send-btn">${escapeHtml(
          assistant.sendLabel
        )}</button>
      </form>
    </section>
  `;

  root.insertAdjacentHTML("beforeend", panelHtml);

  const panel = document.getElementById("ask-amir-panel");
  const closeBtn = document.getElementById("ask-amir-close");
  const messagesEl = document.getElementById("ask-amir-messages");
  const form = document.getElementById("ask-amir-form");
  const input = document.getElementById("ask-amir-input");

  if (!panel || !fab || !messagesEl || !form || !input) return;

  const setOpen = (open) => {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      window.requestAnimationFrame(() => input.focus());
    } else {
      fab.focus();
    }
  };

  const appendUserMessage = (text) => {
    const bubble = document.createElement("div");
    bubble.className = "ask-msg ask-msg--user";
    const p = document.createElement("p");
    p.textContent = text;
    bubble.appendChild(p);
    messagesEl.appendChild(bubble);
  };

  const appendBotResponse = (result) => {
    const bubble = document.createElement("div");
    bubble.className = "ask-msg ask-msg--bot";

    const p = document.createElement("p");
    p.textContent = result.matched
      ? result.entry.answer
      : assistant.fallbackMessage;
    bubble.appendChild(p);

    if (result.matched && result.related.length) {
      const relWrap = document.createElement("div");
      relWrap.className = "ask-followup-wrap";

      const label = document.createElement("span");
      label.className = "ask-followup-label";
      label.textContent = "Related follow-ups:";
      relWrap.appendChild(label);

      const btnRow = document.createElement("div");
      btnRow.className = "ask-followup-row";
      for (const rel of result.related) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ask-chip ask-chip--followup js-ask-suggestion";
        btn.textContent = rel.question;
        btnRow.appendChild(btn);
      }
      relWrap.appendChild(btnRow);
      bubble.appendChild(relWrap);
    }

    if (!result.matched) {
      const actions = document.createElement("div");
      actions.className = "ask-fallback-actions";
      actions.innerHTML = `
        <a href="mailto:${escapeHtml(
          contact.email
        )}" class="ask-action-btn">Email</a>
        <a href="${escapeHtml(
          contact.linkedin
        )}" target="_blank" rel="noopener noreferrer" class="ask-action-btn">LinkedIn</a>
        <a href="${escapeHtml(
          contact.github
        )}" target="_blank" rel="noopener noreferrer" class="ask-action-btn">GitHub</a>
      `;
      bubble.appendChild(actions);
    }

    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const handleQuestion = (questionText) => {
    const trimmed = String(questionText || "").trim();
    if (!trimmed) return;
    appendUserMessage(trimmed);
    const result = answerPortfolioQuery(trimmed, assistant, synonymGroups);
    appendBotResponse(result);
    input.value = "";
  };

  fab.addEventListener("click", () => setOpen(panel.hidden));
  closeBtn?.addEventListener("click", () => setOpen(false));

  root.addEventListener("click", (e) => {
    const chip = e.target.closest(".js-ask-suggestion");
    if (!chip) return;
    handleQuestion(chip.textContent);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleQuestion(input.value);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      setOpen(false);
    }
  });

  if (options.openImmediately) {
    setOpen(true);
  }
}

/* ==========================================================================
   2) LOCAL JOB FIT CHECKER (NO FAKE PRECISION, HONEST GAPS, NO STORAGE)
   ========================================================================== */
function containsPhrase(haystackNorm, haystackTokens, aliasRaw) {
  const aliasNorm = normalizeText(aliasRaw);
  if (!aliasNorm) return false;

  if (aliasNorm.includes(" ")) {
    return haystackNorm.includes(aliasNorm);
  }

  // Exact token match (handles short tokens like "ai", "vs", "c#", "ef", "qa")
  if (haystackTokens.includes(aliasNorm)) return true;

  // Bounded fuzzy match for >= 5 char single tokens
  if (aliasNorm.length >= 5) {
    return haystackTokens.some((t) => isFuzzyMatch(t, aliasNorm));
  }
  return false;
}

export function analyzeJobDescription(jdText, jobFitConfig) {
  const jdNorm = normalizeText(jdText);
  const jdTokens = tokenize(jdText);

  const matchedSkills = [];
  for (const skill of jobFitConfig.verifiedSkills || []) {
    const hit = (skill.aliases || []).some((alias) =>
      containsPhrase(jdNorm, jdTokens, alias)
    );
    if (hit) matchedSkills.push(skill.name);
  }

  const matchedExperiences = [];
  for (const exp of jobFitConfig.verifiedExperiences || []) {
    const hit = (exp.triggers || []).some((trigger) =>
      containsPhrase(jdNorm, jdTokens, trigger)
    );
    if (hit) matchedExperiences.push(exp);
  }

  const gaps = [];
  for (const gap of jobFitConfig.gapCatalog || []) {
    const hit = (gap.aliases || []).some((alias) =>
      containsPhrase(jdNorm, jdTokens, alias)
    );
    if (hit) gaps.push(gap.name);
  }

  const totalRecognized = matchedSkills.length + gaps.length;
  let summaryLabel = "Needs More Detail";
  let summaryText =
    "Paste a fuller job description with technical or marketing requirements to see specific skill matches and gaps.";

  if (totalRecognized > 0 || matchedExperiences.length > 0) {
    if (matchedSkills.length >= 5 && gaps.length <= 2) {
      summaryLabel = "Strong Overlap";
    } else if (matchedSkills.length >= 3 || (matchedSkills.length >= 2 && matchedExperiences.length >= 2)) {
      summaryLabel = "Moderate Overlap";
    } else if (matchedSkills.length >= 1 || matchedExperiences.length >= 1) {
      summaryLabel = "Partial Overlap";
    } else {
      summaryLabel = "Limited Overlap — Key Gaps Identified";
    }

    summaryText = `Detected ${matchedSkills.length} matched skill${
      matchedSkills.length === 1 ? "" : "s"
    }, ${matchedExperiences.length} relevant experience item${
      matchedExperiences.length === 1 ? "" : "s"
    }, and ${gaps.length} requirement${
      gaps.length === 1 ? "" : "s"
    } not listed in Amir's portfolio.`;
  }

  return {
    summaryLabel,
    summaryText,
    matchedSkills,
    matchedExperiences,
    gaps
  };
}

export function initJobFitChecker(content) {
  const form = document.getElementById("job-fit-form");
  const input = document.getElementById("job-fit-input");
  const clearBtn = document.getElementById("job-fit-clear");
  const resultsEl = document.getElementById("job-fit-results");
  if (!form || !input || !resultsEl || form.dataset.initialized === "true") {
    return;
  }
  form.dataset.initialized = "true";

  const jobFitConfig = content.jobFit;

  const renderResults = (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) {
      resultsEl.hidden = true;
      resultsEl.innerHTML = "";
      return;
    }

    const report = analyzeJobDescription(trimmed, jobFitConfig);
    resultsEl.hidden = false;
    resultsEl.innerHTML = `
      <div class="job-fit-summary">
        <span class="job-fit-badge">${escapeHtml(report.summaryLabel)}</span>
        <p class="job-fit-summary-text">${escapeHtml(report.summaryText)}</p>
      </div>

      <div class="job-fit-columns">
        <div class="job-fit-col">
          <h3 class="job-fit-col-title">Matched Skills</h3>
          ${
            report.matchedSkills.length
              ? `<div class="skill-chips">${report.matchedSkills
                  .map((s) => `<span class="skill-chip job-chip--match">${escapeHtml(s)}</span>`)
                  .join("")}</div>`
              : `<p class="job-fit-empty">No matching skills from Amir's portfolio detected in this text.</p>`
          }
        </div>

        <div class="job-fit-col">
          <h3 class="job-fit-col-title">Gaps (Not Listed in Portfolio)</h3>
          ${
            report.gaps.length
              ? `<div class="skill-chips">${report.gaps
                  .map((g) => `<span class="skill-chip job-chip--gap">${escapeHtml(g)}</span>`)
                  .join("")}</div>`
              : `<p class="job-fit-empty">No common unlisted tool gaps detected from the catalog.</p>`
          }
        </div>
      </div>

      <div class="job-fit-exp-block">
        <h3 class="job-fit-col-title">Matched Experience</h3>
        ${
          report.matchedExperiences.length
            ? `<ul class="job-fit-exp-list">${report.matchedExperiences
                .map(
                  (exp) =>
                    `<li><strong>${escapeHtml(exp.title)}:</strong> ${escapeHtml(
                      exp.detail
                    )}</li>`
                )
                .join("")}</ul>`
            : `<p class="job-fit-empty">No direct experience keywords matched. Review Market Sphere X, AI Automation, or EVA Applied Technology above.</p>`
        }
      </div>

      <div class="job-fit-cta-row">
        <a href="#contact" class="btn btn-primary">${escapeHtml(
          jobFitConfig.contactCtaLabel
        )}</a>
      </div>
    `;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderResults(input.value);
  });

  clearBtn?.addEventListener("click", () => {
    input.value = "";
    renderResults("");
    input.focus();
  });

  document.querySelectorAll(".js-job-sample").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-sample-index") || 0);
      const sample = jobFitConfig.samples?.[idx];
      if (!sample) return;
      input.value = sample.text;
      renderResults(sample.text);
    });
  });
}

/* ==========================================================================
   3) SMART CONTACT FORM CLASSIFIER (IN-MEMORY ONLY, PRESERVES MAILTO FLOW)
   ========================================================================== */
export function classifyMessage(messageText, subjectText, smartConfig) {
  const combinedNorm = normalizeText(`${subjectText} ${messageText}`);
  const combinedTokens = tokenize(combinedNorm);

  if (!combinedTokens.length) {
    return null;
  }

  let bestCat = null;
  let bestHits = 0;

  for (const cat of smartConfig.categories || []) {
    let hits = 0;
    for (const kw of cat.keywords || []) {
      if (containsPhrase(combinedNorm, combinedTokens, kw)) {
        hits += 1;
      }
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestCat = cat;
    }
  }

  if (!bestCat || bestHits === 0) {
    return smartConfig.fallback;
  }
  return bestCat;
}

export function initSmartContactForm(content) {
  const form = document.getElementById("contact-form");
  const subjectInput = document.getElementById("cf-subject");
  const messageInput = document.getElementById("cf-message");
  const insightEl = document.getElementById("smart-contact-insight");

  if (
    !form ||
    !subjectInput ||
    !messageInput ||
    !insightEl ||
    form.dataset.smartInit === "true"
  ) {
    return;
  }
  form.dataset.smartInit = "true";

  const smartConfig = content.smartContact;
  const contact = content.contact;
  let subjectManuallyEdited = Boolean(subjectInput.value.trim());

  subjectInput.addEventListener("input", () => {
    subjectManuallyEdited = Boolean(subjectInput.value.trim());
  });

  const buildRoutePills = (routes) => {
    const map = {
      email: `<a href="mailto:${escapeHtml(
        contact.email
      )}" class="smart-route-pill">Email: ${escapeHtml(contact.email)}</a>`,
      phone: `<span class="smart-route-pill">Phone: ${escapeHtml(
        contact.phone
      )}</span>`,
      linkedin: `<a href="${escapeHtml(
        contact.linkedin
      )}" target="_blank" rel="noopener noreferrer" class="smart-route-pill">LinkedIn</a>`,
      github: `<a href="${escapeHtml(
        contact.github
      )}" target="_blank" rel="noopener noreferrer" class="smart-route-pill">GitHub</a>`,
      cv: `<a href="${escapeHtml(
        contact.cvHref
      )}" download="Amir_Girgis_Mofid_CV.pdf" class="smart-route-pill">Download CV</a>`
    };
    return (routes || [])
      .map((r) => map[r] || "")
      .filter(Boolean)
      .join("");
  };

  const updateClassification = () => {
    const msgVal = messageInput.value;
    if (!msgVal.trim()) {
      insightEl.hidden = true;
      insightEl.innerHTML = "";
      return;
    }

    const category = classifyMessage(msgVal, subjectInput.value, smartConfig);
    if (!category) return;

    if (!subjectManuallyEdited) {
      subjectInput.value = category.subject;
    }

    insightEl.hidden = false;
    insightEl.innerHTML = `
      <div class="smart-insight-top">
        <span class="smart-insight-badge">Detected: ${escapeHtml(
          category.label
        )}</span>
        <span class="smart-insight-note">Local keyword classification · Nothing stored</span>
      </div>
      <p class="smart-insight-route">${escapeHtml(category.routeNote)}</p>
      <div class="smart-route-row">${buildRoutePills(category.routes)}</div>
    `;
  };

  messageInput.addEventListener("input", updateClassification);
}
