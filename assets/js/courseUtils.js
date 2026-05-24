/** Same code + title + teacher = one logical course across semesters */
export function buildCourseIdentityKey(code, title, teacher) {
    const norm = (s) =>
        String(s || "")
            .trim()
            .toUpperCase()
            .replace(/\s+/g, " ");
    return `${norm(code)}|${norm(title)}|${norm(teacher)}`;
}

export function resourceCourseIdentity(rData) {
    if (rData.courseIdentityKey) return rData.courseIdentityKey;
    return buildCourseIdentityKey(
        rData.courseCode,
        rData.courseTitle || "",
        rData.courseTeacher || ""
    );
}

export function resourceMatchesCourse(rData, course) {
    const courseKey = buildCourseIdentityKey(course.code, course.title, course.teacher);
    const rKey = resourceCourseIdentity(rData);
    if (rKey === courseKey) return true;
    // Legacy uploads: only course code, no identity fields
    if (!rData.courseIdentityKey && !rData.courseTitle && !rData.courseTeacher) {
        const code = String(rData.courseCode || "")
            .trim()
            .toUpperCase();
        return code === String(course.code || "").trim().toUpperCase();
    }
    return false;
}

export function categorizeResource(rData) {
    const type = String(rData.type || "");
    const isExternal = rData.urlType === "external";
    if (type.includes("Video") || (isExternal && /youtube|youtu\.be|vimeo/i.test(rData.url || ""))) {
        return "video";
    }
    if (type.includes("Audio")) return "audio";
    if (type.includes("Image")) return "image";
    if (type.includes("PDF") || type.includes("Handnote")) return "pdf";
    if (isExternal) return "link";
    return "pdf";
}

export const RESOURCE_CATEGORY_ORDER = ["pdf", "video", "audio", "image", "link"];

export const RESOURCE_CATEGORY_LABELS = {
    en: {
        pdf: "PDF / Handnotes",
        video: "Video / YouTube",
        audio: "Audio / Voice",
        image: "Photos / Documents",
        link: "Cloud Links",
    },
    bn: {
        pdf: "পিডিএফ / হ্যান্ডনোট",
        video: "ভিডিও / ইউটিউব",
        audio: "অডিও / ভয়েস",
        image: "ছবি / ডকুমেন্ট",
        link: "ক্লাউড লিংক",
    },
};
