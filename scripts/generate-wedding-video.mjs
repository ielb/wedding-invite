import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'outputs/fal-wedding');
const jobPath = path.join(output, 'job.json');
const videoPath = path.join(output, 'invitation-opening.mp4');
const key = process.env.FAL_KEY;
if (!key) throw new Error('Set FAL_KEY in the local environment to generate the video. No request was sent.');
const brief = JSON.parse(await fs.readFile(path.join(root, 'video/fal-input.json'), 'utf8'));
await fs.mkdir(output, { recursive: true });
const exists = async file => fs.access(file).then(() => true, () => false);
if (await exists(videoPath)) {
  console.log('The generated video already exists at outputs/fal-wedding/invitation-opening.mp4.');
  process.exit(0);
}
const dataUri = async name => 'data:image/webp;base64,' + (await fs.readFile(path.join(root, name))).toString('base64');
const api = async (url, options = {}) => {
  if (new URL(url).origin !== 'https://queue.fal.run') throw new Error('Unexpected queue URL.');
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: 'Key ' + key, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error('fal.ai returned HTTP ' + response.status + '. Inspect the saved job before retrying.');
  return response.json();
};
let job;
if (await exists(jobPath)) {
  job = JSON.parse(await fs.readFile(jobPath, 'utf8'));
  if (!job.status_url || !job.response_url) throw new Error('A previous submission has an uncertain outcome. Check fal.ai request history before submitting another paid generation.');
} else {
  const input = {
    prompt: brief.prompt,
    duration: brief.duration,
    generate_audio: brief.generate_audio,
    start_image_url: await dataUri(brief.start_image),
    end_image_url: await dataUri(brief.end_image),
  };
  // Record intent before submitting so an interrupted run cannot charge twice.
  await fs.writeFile(jobPath, JSON.stringify({ phase: 'submitting', model: brief.model, created_at: new Date().toISOString() }, null, 2));
  job = await api('https://queue.fal.run/' + brief.model, { method: 'POST', body: JSON.stringify(input) });
  await fs.writeFile(jobPath, JSON.stringify(job, null, 2));
}
const deadline = Date.now() + 20 * 60 * 1000;
while (Date.now() < deadline) {
  const status = await api(job.status_url);
  if (status.status === 'COMPLETED') {
    const result = await api(job.response_url);
    await fs.writeFile(path.join(output, 'result.json'), JSON.stringify(result, null, 2));
    if (!result.video?.url) throw new Error('The completed response did not contain a video.');
    const download = await fetch(result.video.url, { signal: AbortSignal.timeout(120000) });
    if (!download.ok) throw new Error('Video download failed; the existing job can be resumed.');
    await fs.writeFile(videoPath + '.tmp', Buffer.from(await download.arrayBuffer()));
    await fs.rename(videoPath + '.tmp', videoPath);
    console.log('Saved outputs/fal-wedding/invitation-opening.mp4. Inspect the video before integrating it into the site.');
    process.exit(0);
  }
  if (!['IN_QUEUE', 'IN_PROGRESS'].includes(status.status)) throw new Error('Unexpected fal.ai job state: ' + status.status);
  console.log('Video generation: ' + status.status);
  await new Promise(resolve => setTimeout(resolve, 15000));
}
throw new Error('Generation is still pending. Run this script again to resume the existing job.');
