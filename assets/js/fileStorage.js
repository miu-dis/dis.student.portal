import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function assertConfigured() {
    if (
        !SUPABASE_URL ||
        SUPABASE_URL.includes("YOUR_PROJECT") ||
        !SUPABASE_ANON_KEY ||
        SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
    ) {
        throw new Error(
            "Supabase is not configured. Edit assets/js/supabase-config.js with your Project URL and anon key."
        );
    }
}

/**
 * Upload study material file to Supabase Storage (free tier friendly).
 */
export async function uploadPortalFile(file, userId) {
    assertConfigured();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `resources/${userId}/${Date.now()}_${safeName}`;

    const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream"
    });
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
    return {
        downloadUrl: data.publicUrl,
        storagePath: path,
        urlType: "supabase"
    };
}

/**
 * Remove file from Supabase Storage. Ignores missing objects.
 */
export async function deletePortalFile(storagePath) {
    if (!storagePath) return;
    assertConfigured();
    const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([storagePath]);
    if (error) console.warn("Supabase delete:", error.message);
}
