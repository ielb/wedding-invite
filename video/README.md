# Invitation opening artwork and video

The hero is one portrait 2:3 artwork plus a short opening clip that ends exactly on
that artwork. Neither asset contains names or text — all Arabic copy stays live HTML
over the top, so the same pair serves `/` (wedding) and `/henna` (henna + wedding).

Both are generated from a brief in this folder with the same script:

    node scripts/fal-generate.mjs video/fal-image-input.json   # artwork
    node scripts/fal-generate.mjs video/fal-input.json         # opening clip

The script reads `FAL_KEY` from the environment or from a single `FAL_KEY=...` line in
`.env` (gitignored). It records intent before submitting and resumes an existing job
rather than resubmitting, so an interrupted run cannot be charged twice. Results land
under the ignored `outputs/` tree for inspection before anything is copied into
`public/`.

## Order matters

The artwork is the video's end frame, so generate it first:

1. `node scripts/fal-generate.mjs video/fal-image-input.json`
2. Inspect `outputs/fal-tetouan/tetouan-arch.webp` — the centre of the arch must be a
   clean empty field, and there must be no lettering anywhere.
3. `node scripts/fal-generate.mjs video/fal-input.json` — the brief points its end
   frame at the pristine file in `outputs/`, so nothing needs copying first.
4. Inspect the clip, then re-encode both into `public/` (see Delivery below).

Deleting a file under `outputs/` is what makes the script regenerate it; otherwise it
reports the existing result and exits without spending anything.

## Artwork brief

`fal-image-input.json` — `openai/gpt-image-2/edit` at exactly 1024×1536, matching the
previous artwork. It passes `public/images/embroidered-garden.webp` as a style
reference and asks for the same crewel-embroidery medium and ivory/sage/powder-blue
palette with Tetouan's Moorish architecture in place of the Italianate garden: a
horseshoe keyhole arch, zellige and carved stucco spandrels, the whitewashed medina
with green-glazed roofs and a square minaret, and the Rif mountains behind.

The generated `tetouan-arch.webp` was checked at full resolution: the zellige is
genuine geometric star tiling with no pseudo-Arabic lettering anywhere, and the arch
interior is a clean empty field, so the HTML names sit on it without collision.
`embroidered-garden.webp` stays in the repo — it is the style reference this brief
depends on, not dead weight.

## Video brief

`fal-input.json` — `fal-ai/kling-video/v3/standard/image-to-video`, 5 seconds, audio
disabled. Starts on `closed-invitation.webp`, ends on the artwork above.

Two problems from the first 10-second run, and where they stand:

- **The bow never untied.** The prompt asked for it in seconds 0–3 and the model
  ignored it — the knot stayed tied and simply slid out of frame with the panels.
  Given a start and an end frame, kling takes the laziest interpolation it can, so the
  untie became the prompt's dominant instruction rather than one beat among several.
  **Partly fixed.** The ribbon now visibly loosens and the tails fly apart, but the
  knot is still split by the opening panels rather than untying itself first. To get a
  true self-untie, generate it as its own clip — closed card with a tied bow to closed
  card with the ribbon slack — and concatenate that ahead of this one.
- **Only ~3.5s of the 10s moved.** Roughly 3s of stillness at the head and 3.5s at the
  tail. **Fixed.** At five seconds the motion carries the whole clip, and both the cost
  and the raw file size roughly halved.

The old run cost $0.14/second ($1.40 for 10s); pricing can change.

## Delivery

fal returns far more bitrate than flat embroidery needs — the first clip shipped at
11 MB for 10 seconds (784×1176, 8.9 Mbps), heavy enough to stall visibly on a phone.
Always re-encode before copying into `public/`:

    ffmpeg -i in.mp4 -c:v libx264 -crf 26 -preset slow -an -pix_fmt yuv420p \
      -movflags +faststart public/videos/invitation-opening.mp4
    cwebp -q 82 -m 6 in.webp -o public/images/tetouan-arch.webp

That took the shipped clip from 7.0 MB to 812 KB and the artwork from 2.3 MB to 420 KB,
in line with the 416 KB of the original artwork.

Model schemas:
- https://fal.ai/models/openai/gpt-image-2/edit/api
- https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video/api
