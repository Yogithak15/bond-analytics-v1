/**
 * Run once to create the initial admin user:
 *   node create-user.mjs
 *
 * Edit EMAIL and PASSWORD below before running.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env
try {
  const env = readFileSync(resolve(__dirname, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
} catch {}

// --- EDIT THESE ---
const EMAIL    = 'admin@bondbulls.in';
const PASSWORD = 'BondBulls@2025';
const NAME     = 'Admin';
// ------------------

const PORT = process.env.AUTH_PORT || '3001';
const INTERNAL_URL = `http://localhost:${PORT}`;

const res = await fetch(`${INTERNAL_URL}/api/auth/sign-up/email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': INTERNAL_URL,
  },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: NAME }),
});

const data = await res.json();
if (res.ok) {
  console.log('User created:', data.user?.email);
} else {
  console.error('Error:', data);
}
process.exit(0);
