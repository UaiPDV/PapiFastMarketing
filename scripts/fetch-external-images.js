import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const distPath = path.resolve(process.cwd(), 'dist');
const contentPath = path.join(distPath, 'content.json');
const outDir = path.join(distPath, 'img', 'external');

if (!fs.existsSync(contentPath)) {
	console.error('dist/content.json not found. Run build first.');
	process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const contentRaw = fs.readFileSync(contentPath, 'utf8');
const urlRegex = /https?:\/\/[^"'\s,]+/g;

const urls = Array.from(new Set(contentRaw.match(urlRegex) || []));
if (urls.length === 0) {
	console.log('No external URLs found in content.json');
	process.exit(0);
}

console.log('Found', urls.length, 'external URLs. Downloading...');

async function download(url, dest) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
	const buffer = Buffer.from(await res.arrayBuffer());
	fs.writeFileSync(dest, buffer);
}

(async () => {
	const map = {};
	for (const url of urls) {
		try {
			const parsed = new URL(url);
			// get ext from pathname or fallback to .jpg
			const ext = path.extname(parsed.pathname).split('?')[0] || '.jpg';
			const hash = crypto
				.createHash('md5')
				.update(url)
				.digest('hex')
				.slice(0, 10);
			const filename = `${hash}${ext}`;
			const dest = path.join(outDir, filename);
			if (!fs.existsSync(dest)) {
				console.log('Downloading', url);
				await download(url, dest);
			} else {
				console.log('Already downloaded', url);
			}
			const relative = `./img/external/${filename}`;
			map[url] = relative;
		} catch (e) {
			console.warn('Failed to download', url, e.message);
		}
	}

	let newContent = contentRaw;
	for (const [u, r] of Object.entries(map)) {
		// replace all occurrences
		newContent = newContent.split(u).join(r);
	}

	fs.writeFileSync(contentPath, newContent, 'utf8');
	console.log('Updated', contentPath);
})();
