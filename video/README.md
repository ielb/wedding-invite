# Invitation opening video

Status: prepared, not generated. fal.ai sign-in or a local FAL_KEY is required.

The reference is the approximately 10-second opening on https://template-bellagio.thedigitalyes.com/. It begins with an ivory satin bow on a closed embroidered invitation and reveals the open invitation.

The original starting frame is closed-invitation.webp. The ending frame is ../public/images/embroidered-garden.webp. Neither contains names or text, allowing the same video to serve both website variants. Keep all Arabic text as live HTML.

The exact prompt and model settings are in fal-input.json. The model is fal-ai/kling-video/v3/standard/image-to-video, 10 seconds, audio disabled. Its current published price is $0.084 per second without audio; confirm pricing in the fal.ai playground before running.

With FAL_KEY configured locally, run:

    node scripts/generate-wedding-video.mjs

The script saves and resumes one job under ignored outputs/fal-wedding. It never resubmits a job with an uncertain submission outcome. No key is stored in source or browser code.

After generation, inspect the actual opening, middle and final frames, check that text or hands were not introduced, and encode a web-friendly MP4. Integrate it with the existing static artwork as a poster/fallback, a skip control, and the site's pause/reduced-motion handling. Do not present the prepared artwork as a completed video.

Official model schema: https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video/api
