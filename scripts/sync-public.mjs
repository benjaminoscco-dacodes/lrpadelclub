import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');

fs.rmSync(pub, { recursive: true, force: true });
fs.mkdirSync(pub, { recursive: true });

const rootFiles = [
  'index.html',
  'contacto.html',
  'torneos.html',
  'academia.html',
  'membresias.html',
  'reservas.html',
  'styles.css',
  'script.js',
  'config.js'
];

for (const f of rootFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(pub, f));
  }
}

const assetsSrc = path.join(root, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, path.join(pub, 'assets'), { recursive: true });
}

console.log('Sitio copiado a public/ para el deploy en Vercel.');
