const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'dr-ehab-secret-key-2026';
const USERS_FILE = path.join(__dirname, 'users.json');
const APPOINTMENTS_FILE = path.join(__dirname, 'appointments.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function readJson(file, def) {
  try {
    if (!fs.existsSync(file)) return def;
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch { return def; }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw + JWT_SECRET).digest('hex');
}

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest('base64url');
  return header + '.' + body + '.' + sig;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const sig = crypto.createHmac('sha256', JWT_SECRET).update(parts[0] + '.' + parts[1]).digest('base64url');
    if (sig !== parts[2]) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  } catch { return null; }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  req.user = payload;
  next();
}

// ── Register ──
app.post('/api/register', (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !/^01\d{9}$/.test(phone) || !password || password.length < 4) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const users = readJson(USERS_FILE, []);
  if (users.find(u => u.phone === phone)) {
    return res.status(400).json({ error: 'Phone already registered' });
  }
  const user = { id: Date.now(), name, phone, password_hash: hashPassword(password), created_at: new Date().toISOString() };
  users.push(user);
  writeJson(USERS_FILE, users);
  res.json({ success: true });
});

// ── Login ──
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = readJson(USERS_FILE, []);
  const user = users.find(u => u.phone === phone && u.password_hash === hashPassword(password));
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = createToken({ id: user.id, name: user.name, phone: user.phone });
  res.json({ success: true, token, user: { id: user.id, name: user.name, phone: user.phone } });
});

// ── Get user's appointments ──
app.get('/api/user/appointments', authMiddleware, (req, res) => {
  const all = readJson(APPOINTMENTS_FILE, []);
  const userApps = all.filter(a => a.user_id === req.user.id).reverse();
  res.json(userApps);
});

// ── Create appointment ──
app.post('/api/appointments', (req, res) => {
  const { name, phone, location, specialty, date: dateStr } = req.body;
  if (!name || !phone || !/^01\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  let userId = null;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const payload = verifyToken(auth.slice(7));
    if (payload) userId = payload.id;
  }
  const all = readJson(APPOINTMENTS_FILE, []);
  const appt = {
    id: Date.now(),
    user_id: userId,
    name, phone,
    location: location || '',
    specialty: specialty || '',
    requested_date: dateStr || '',
    time_slot: '',
    status: 'pending',
    created_at: new Date().toISOString()
  };
  all.push(appt);
  writeJson(APPOINTMENTS_FILE, all);
  res.json({ success: true, id: appt.id });
});

// ── Admin: get all appointments ──
app.get('/api/admin/appointments', (req, res) => {
  if (req.query.password !== 'admin2026') return res.status(401).json({ error: 'Unauthorized' });
  const all = readJson(APPOINTMENTS_FILE, []).reverse();
  res.json(all);
});

// ── Admin: accept appointment with time slot ──
app.put('/api/admin/appointments/:id/accept', (req, res) => {
  if (req.query.password !== 'admin2026') return res.status(401).json({ error: 'Unauthorized' });
  const all = readJson(APPOINTMENTS_FILE, []);
  const idx = all.findIndex(a => a.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  all[idx].status = 'accepted';
  all[idx].time_slot = req.body.time_slot || '';
  writeJson(APPOINTMENTS_FILE, all);
  res.json({ success: true });
});

// ── User: cancel own appointment ──
app.put('/api/user/appointments/:id/cancel', authMiddleware, (req, res) => {
  const all = readJson(APPOINTMENTS_FILE, []);
  const idx = all.findIndex(a => a.id == req.params.id && a.user_id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (all[idx].status !== 'pending') return res.status(400).json({ error: 'Can only cancel pending appointments' });
  all[idx].status = 'cancelled';
  writeJson(APPOINTMENTS_FILE, all);
  res.json({ success: true });
});

// ── Admin: cancel appointment ──
app.put('/api/admin/appointments/:id/cancel', (req, res) => {
  if (req.query.password !== 'admin2026') return res.status(401).json({ error: 'Unauthorized' });
  const all = readJson(APPOINTMENTS_FILE, []);
  const idx = all.findIndex(a => a.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  all[idx].status = 'cancelled';
  writeJson(APPOINTMENTS_FILE, all);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
