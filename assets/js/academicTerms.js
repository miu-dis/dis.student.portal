/** Academic session terms: regular vs weekend programs */
export const SESSION_TERMS = [
    "Spring (regular)",
    "Summer (regular)",
    "Fall (regular)",
    "Spring (weekend)",
    "Summer (weekend)",
    "Fall (weekend)",
];

export const SESSION_YEARS = ["2026", "2027", "2028", "2029", "2030"];

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

export function sessionFilterValue(term, sessionYear) {
    return `${normalizeSessionTerm(term)} ${sessionYear}`;
}

export function parseSessionFilterValue(sessionFull) {
    const m = String(sessionFull || "").trim().match(/^(.+)\s+(20\d{2})$/);
    if (!m) return { term: "Spring (regular)", year: "2026" };
    return { term: normalizeSessionTerm(m[1]), year: m[2] };
}

export function fillSessionTermSelect(selectEl, selectedValue) {
    if (!selectEl) return;
    selectEl.innerHTML = SESSION_TERMS.map(
        (v) => `<option value="${v}">${v}</option>`
    ).join("");
    const norm = normalizeSessionTerm(selectedValue || selectEl.value);
    selectEl.value = SESSION_TERMS.includes(norm) ? norm : "Spring (regular)";
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

export function fillSessionFilterSelect(selectEl, selectedFull) {
    if (!selectEl) return;
    const options = [];
    for (const y of SESSION_YEARS) {
        for (const t of SESSION_TERMS) {
            const val = `${t} ${y}`;
            options.push(`<option value="${val}">${val}</option>`);
        }
    }
    selectEl.innerHTML = options.join("");
    if (selectedFull) {
        const { term, year } = parseSessionFilterValue(selectedFull);
        const val = `${term} ${year}`;
        if ([...selectEl.options].some((o) => o.value === val)) selectEl.value = val;
    }
}
