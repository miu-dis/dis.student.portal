import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function assertConfigured() {
    const missingUrl = !SUPABASE_URL || SUPABASE_URL.includes("YOUR_PROJECT");
    const missingKey =
        !SUPABASE_ANON_KEY ||
        SUPABASE_ANON_KEY.includes("YOUR_SUPABASE") ||
        SUPABASE_ANON_KEY.includes("PASTE_YOUR_ANON");
    if (missingUrl || missingKey) {
        throw new Error(
            "Supabase সেটআপ হয়নি। assets/js/supabase-config.js এ Project URL এবং anon public key বসান।"
        );
    }
    if (SUPABASE_ANON_KEY.includes("service_role")) {
        throw new Error("ভুল API key! শুধু anon public key ব্যবহার করুন (service_role নয়)।");
    }
}

/** Firestore-এ যেভাবে সেভ আছে সেভাবেই object path */
function storageObjectPath(storagePath) {
    return (storagePath || "").replace(/^\/+/, "");
}

function buildPublicUrl(storagePath) {
    const path = storageObjectPath(storagePath);
    if (!path) return "";
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
}

async function createSignedDownloadUrl(storagePath, expiresIn = 3600) {
    const path = storageObjectPath(storagePath);
    if (!path) return "";
    const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .createSignedUrl(path, expiresIn);
    if (error) {
        console.warn("Signed URL error:", error.message);
        return "";
    }
    return data?.signedUrl || "";
}

/**
 * ফাইল খোলার জন্য সবচেয়ে নির্ভরযোগ্য URL (signed → public → Firestore url)
 */
export async function resolveResourceFileUrl(rData) {
    assertConfigured();

    if (rData.urlType === "external") {
        const u = (rData.url || "").trim();
        if (u.startsWith("http") || u.startsWith("data:")) return u;
        return "";
    }

    if (rData.storagePath) {
        const signed = await createSignedDownloadUrl(rData.storagePath);
        if (signed.startsWith("http")) return signed;

        const pub = buildPublicUrl(rData.storagePath);
        if (pub.startsWith("http")) return pub;
    }

    const u = (rData.url || "").trim();
    if (u.startsWith("http") || u.startsWith("data:")) return u;
    return "";
}

export async function openResourceFile(rData) {
    const url = await resolveResourceFileUrl(rData);
    if (!url) return false;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
}

export function getPortalFilePublicUrl(storagePath) {
    if (!storagePath) return "";
    try {
        assertConfigured();
        return buildPublicUrl(storagePath);
    } catch {
        return "";
    }
}

export async function uploadPortalFile(file, userId) {
    assertConfigured();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${userId}/${Date.now()}_${safeName}`;

    const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream"
    });
    if (error) {
        throw new Error("আপলোড ব্যর্থ: " + error.message + " — Storage বাকেট Public ও policy চেক করুন।");
    }

    const signedUrl = await createSignedDownloadUrl(storagePath);
    if (!signedUrl.startsWith("http")) {
        throw new Error("ফাইল আপলোড হয়েছে কিন্তু পড়া যাচ্ছে না। Supabase Storage → resources → Policies চেক করুন।");
    }

    try {
        const head = await fetch(signedUrl, { method: "HEAD" });
        if (!head.ok) {
            console.warn("Storage HEAD check:", head.status, storagePath);
        }
    } catch {
        /* CORS-এ HEAD ব্যর্থ হতে পারে; আপলোড সফল থাকলে চালিয়ে যান */
    }

    const downloadUrl = buildPublicUrl(storagePath) || signedUrl;

    return { downloadUrl, storagePath, urlType: "supabase" };
}

export async function deletePortalFile(storagePath) {
    if (!storagePath) return;
    assertConfigured();
    const path = storageObjectPath(storagePath);
    const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([path]);
    if (error) console.warn("Supabase delete:", error.message);
}
