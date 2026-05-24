/** Academic session: season + program type (stored in profileTerm / mapping keys) */
export const SESSION_SEASONS = ["Spring", "Summer", "Fall"];

export const SESSION_PROGRAMS = [
    { value: "regular", label: "Regular" },
    { value: "weekend", label: "Weekend" },
];

export const SESSION_TERMS = SESSION_SEASONS.flatMap((season) =>
    SESSION_PROGRAMS.map((p) => `${season} (${p.value})`)
);

export const CALENDAR_SESSION_START = 2026;
export const CALENDAR_SESSION_END = 2030;

/** Profile modal + archive calendar year dropdown (2026–2030) */
export const PROFILE_SESSION_YEARS = ["2026", "2027", "2028", "2029", "2030"];

export function getCalendarSessionYears() {
    const years = [];
    for (let y = CALENDAR_SESSION_START; y <= CALENDAR_SESSION_END; y++) {
        years.push(String(y));
    }
    return years;
}

export function combineSessionTerm(season, program) {
    const s = SESSION_SEASONS.includes(season) ? season : "Spring";
    const p = program === "weekend" ? "weekend" : "regular";
    return `${s} (${p})`;
}

export function splitSessionTerm(term) {
    const norm = normalizeSessionTerm(term);
    const m = norm.match(/^(Spring|Summer|Fall)\s+\((regular|weekend)\)$/i);
    if (m) return { season: m[1], program: m[2].toLowerCase() };
    if (SESSION_SEASONS.includes(norm)) return { season: norm, program: "regular" };
    return { season: "Spring", program: "regular" };
}

/** Map legacy profileTerm / filter values to the new labeled format */
export function normalizeSessionTerm(term) {
    if (!term) return "Spring (regular)";
    const t = String(term).trim();
    if (t === "Spring" || t === "Summer" || t === "Fall") return `${t} (regular)`;
    return t;
}

export function buildTrimesterKey(year, termNum, term, sessionYear) {
    const sessionTerm = normalizeSessionTerm(term);
    return `${year} - ${termNum} (${sessionTerm} ${sessionYear})`;
}

/** Normalize full semester keys, including legacy "(Spring 2026)" without program type */
export function normalizeTrimesterKey(key) {
    if (!key || !key.includes("(")) return key;
    const closeIdx = key.lastIndexOf(")");
    const openIdx = key.indexOf("(");
    if (openIdx < 0 || closeIdx < 0) return key;
    const prefix = key.slice(0, openIdx).trim();
    const inner = key.slice(openIdx + 1, closeIdx).trim();
    const yearMatch = inner.match(/\s+(20\d{2})$/);
    if (!yearMatch) return key;
    const sessionYear = yearMatch[1];
    const termPart = inner.slice(0, inner.length - yearMatch[0].length).trim();
    const dashIdx = prefix.indexOf(" - ");
    if (dashIdx < 0) return key;
    const yr = prefix.slice(0, dashIdx).trim();
    const termNum = prefix.slice(dashIdx + 3).trim();
    return buildTrimesterKey(yr, termNum, termPart, sessionYear);
}

export function getArchiveSessionFull(season, program, sessionYear) {
    return `${combineSessionTerm(season, program)} ${sessionYear}`;
}

/** Legacy course_mapping doc ids used Spring/Summer/Fall without (regular)/(weekend) */
export function toLegacyTrimesterKey(key) {
    const norm = normalizeTrimesterKey(key);
    const closeIdx = norm.lastIndexOf(")");
    const openIdx = norm.indexOf("(");
    if (openIdx < 0 || closeIdx < 0) return null;
    const prefix = norm.slice(0, openIdx).trim();
    const inner = norm.slice(openIdx + 1, closeIdx).trim();
    const yearMatch = inner.match(/\s+(20\d{2})$/);
    if (!yearMatch) return null;
    const sessionYear = yearMatch[1];
    const termPart = inner.slice(0, inner.length - yearMatch[0].length).trim();
    if (!termPart.endsWith(" (regular)")) return null;
    const legacyTerm = termPart.slice(0, -" (regular)".length);
    return `${prefix} (${legacyTerm} ${sessionYear})`;
}

export function fillSessionTermSelect(selectEl, selectedValue) {
    if (!selectEl) return;
    selectEl.innerHTML = SESSION_TERMS.map(
        (v) => `<option value="${v}">${v}</option>`
    ).join("");
    const norm = normalizeSessionTerm(selectedValue || selectEl.value);
    selectEl.value = SESSION_TERMS.includes(norm) ? norm : "Spring (regular)";
}

/** Class Shared Resources Archive: season, program, calendar year as separate dropdowns */
export function fillArchiveSessionFilters({ seasonEl, programEl, yearEl, profileTerm, sessionYear }) {
    if (seasonEl) {
        seasonEl.innerHTML = SESSION_SEASONS.map(
            (s) => `<option value="${s}">${s}</option>`
        ).join("");
    }
    if (programEl) {
        programEl.innerHTML = SESSION_PROGRAMS.map(
            (p) => `<option value="${p.value}">${p.label}</option>`
        ).join("");
    }
    if (yearEl) {
        yearEl.innerHTML = getCalendarSessionYears()
            .map((y) => `<option value="${y}">${y}</option>`)
            .join("");
    }
    if (profileTerm !== undefined || sessionYear !== undefined) {
        const { season, program } = splitSessionTerm(profileTerm);
        if (seasonEl && SESSION_SEASONS.includes(season)) seasonEl.value = season;
        if (programEl) programEl.value = program === "weekend" ? "weekend" : "regular";
        if (yearEl) {
            const y = String(sessionYear || CALENDAR_SESSION_START);
            if ([...yearEl.options].some((o) => o.value === y)) yearEl.value = y;
        }
    }
}
