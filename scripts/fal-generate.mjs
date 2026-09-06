// Runs one fal.ai brief (video/*.json) and saves the result under the ignored outputs/ tree.
// Usage: node scripts/fal-generate.mjs video/fal-image-input.json
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const briefPath = process.argv[2] ?? 'video/fal-input.json';
const brief = JSON.parse(await fs.readFile(path.join(root, briefPath), 'utf8'));

// ponytail: FAL_KEY from the environment, else one KEY=value line in .env (already gitignored).
const key = process.env.FAL_KEY ?? (await fs.readFile(path.join(root, '.env'), 'utf8').catch(() => ''))
  .split('\n').find(line => line.startsWith('FAL_KEY='))?.slice('FAL_KEY='.length).trim().replace(/^["']|["']$/g, '');
if (!key) throw new Error('Set FAL_KEY in the environment or in .env to generate. No request was sent.');

const resultPath = path.join(root, brief.output);
const jobDir = path.dirname(resultPath);
const jobPath = path.join(jobDir, 'job.json');
await fs.mkdir(jobDir, { recursive: true });
const exists = async file => fs.access(file).then(() => true, () => false);
if (await exists(resultPath)) {
  console.log('Already generated: ' + brief.output + '. Delete it to regenerate.');
  process.exit(0);
}

const mime = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const dataUri = async name => {
  const type = mime[path.extname(name).toLowerCase()];
  if (!type) throw new Error('Unsupported reference image type: ' + name);
  return 'data:' + type + ';base64,' + (await fs.readFile(path.join(root, name))).toString('base64');
};
const api = async (url, options = {}) => {
  if (new URL(url).origin !== 'https://queue.fal.run') throw new Error('Unexpected queue URL.');
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: 'Key ' + key, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error('fal.ai returned HTTP ' + response.status + ': ' + (await response.text()).slice(0, 400));
  return response.json();
};

// brief.input is passed to the model verbatim; brief.image_inputs names the fields
// whose local paths become data URIs, so the script stays model-agnostic.
const buildInput = async () => {
  const images = await Promise.all(
    Object.entries(brief.image_inputs ?? {}).map(async ([field, value]) => [
      field,
      Array.isArray(value) ? await Promise.all(value.map(dataUri)) : await dataUri(value),
    ]),
  );
  return { ...brief.input, ...Object.fromEntries(images) };
};

let job;
if (await exists(jobPath)) {
  job = JSON.parse(await fs.readFile(jobPath, 'utf8'));
  if (!job.status_url || !job.response_url) throw new Error('A previous submission has an uncertain outcome. Check the fal.ai request history before submitting another paid generation.');
} else {
  // Record intent before submitting so an interrupted run cannot charge twice.
  await fs.writeFile(jobPath, JSON.stringify({ phase: 'submitting', model: brief.model, created_at: new Date().toISOString() }, null, 2));
  job = await api('https://queue.fal.run/' + brief.model, { method: 'POST', body: JSON.stringify(await buildInput()) });
  await fs.writeFile(jobPath, JSON.stringify(job, null, 2));
}

const deadline = Date.now() + 20 * 60 * 1000;
while (Date.now() < deadline) {
  const status = await api(job.status_url);
  if (status.status === 'COMPLETED') {
    const result = await api(job.response_url);
    await fs.writeFile(path.join(jobDir, 'result.json'), JSON.stringify(result, null, 2));
    const url = result.video?.url ?? result.images?.[0]?.url;
    if (!url) throw new Error('The completed response contained no video or image.');
    const download = await fetch(url, { signal: AbortSignal.timeout(120000) });
    if (!download.ok) throw new Error('Download failed; rerun to resume the existing job.');
    await fs.writeFile(resultPath + '.tmp', Buffer.from(await download.arrayBuffer()));
    await fs.rename(resultPath + '.tmp', resultPath);
    console.log('Saved ' + brief.output + '. Inspect it before integrating it into the site.');
    process.exit(0);
  }
  if (!['IN_QUEUE', 'IN_PROGRESS'].includes(status.status)) throw new Error('Unexpected fal.ai job state: ' + status.status);
  console.log(brief.model + ': ' + status.status);
  await new Promise(resolve => setTimeout(resolve, 15000));
}
throw new Error('Still pending. Run the script again to resume the existing job.');
