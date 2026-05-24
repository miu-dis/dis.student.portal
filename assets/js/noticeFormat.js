/** Escape HTML, then apply simple notice formatting: newlines, **bold**, *italic* */
export function formatNoticeContent(raw) {
    if (!raw) return "";
    let s = String(raw)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
    s = s.replace(/\n/g, "<br>");
    return s;
}
