import fs from 'node:fs';
import path from 'node:path';

// Validate the actual HTML uploaded to this root-hosted GitHub Pages site.
// In particular, catch repo-prefixed media URLs and accidental flat HTML exports.
const output = path.resolve('out');
const failures = new Set();
for (const route of ['index.html', 'notes/index.html', 'papers/index.html', 'about/index.html']) {
  if (!fs.existsSync(path.join(output, route))) failures.add(`Missing route: ${route}`);
}

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});

let checked = 0;
for (const file of walk(output).filter((file) => file.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, attribute, value] of html.matchAll(/\b(src|poster|href)="([^"]+)"/g)) {
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const pathname = decodeURIComponent(value.split(/[?#]/)[0]);
    const target = path.join(output, pathname);
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) {
      failures.add(`${path.relative(output, file)}: ${attribute}="${value}" has no exported target`);
    }
    checked++;
  }
}

if (failures.size) {
  console.error([...failures].join('\n'));
  process.exit(1);
}
console.log(`Verified directory routes and ${checked} local resource/link URLs.`);
