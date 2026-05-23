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
            "Supabase সেটআপ হয়নি। assets/js/supabase-config.js এ Project URL এবং anon public key বসান (service_role নয়)।"
        );
    }
    if (SUPABASE_ANON_KEY.includes("service_role")) {
        throw new Error(
            "ভুল API key! service_role ব্যবহার করবেন না। Supabase → API Keys → Legacy anon → anon public key বসান।"
        );
    }
}

function buildPublicUrl(storagePath) {
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(storagePath);
    return data?.publicUrl || "";
}

/**
 * Upload study material file to Supabase Storage.
 */
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
        throw new Error(
            "আপলোড ব্যর্থ: " + error.message +
            " — Storage বাকেট 'resources' Public আছে কিনা এবং SQL policy সেট আছে কিনা চেক করুন।"
        );
    }

    const downloadUrl = buildPublicUrl(storagePath);
    if (!downloadUrl.startsWith("http")) {
        throw new Error("ফাইল আপলোড হয়েছে কিন্তু public URL তৈরি হয়নি। বাকেট Public চালু করুন।");
    }

    return { downloadUrl, storagePath, urlType: "supabase" };
}

export async function deletePortalFile(storagePath) {
    if (!storagePath) return;
    assertConfigured();
    const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([storagePath]);
    if (error) console.warn("Supabase delete:", error.message);
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
