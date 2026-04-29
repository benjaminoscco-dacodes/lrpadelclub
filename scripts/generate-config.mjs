import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';
const anonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

const out = `Object.assign(window.__SUPABASE_CONFIG__ || {}, {
  url: ${JSON.stringify(url)},
  anonKey: ${JSON.stringify(anonKey)}
});
`;

fs.writeFileSync(path.join(root, 'config.js'), out, 'utf8');
console.log('config.js generado (SUPABASE_URL / SUPABASE_ANON_KEY).');
