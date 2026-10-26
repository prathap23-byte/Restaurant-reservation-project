
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 4000);
const DB = path.join(__dirname, 'data.json');

const seedRestaurants = [
  { id: '1', name: 'Olive & Ember', cuisine: 'Mediterranean', area: 'Race Course', price: '₹₹₹', rating: '4.8', time: '12–25 min', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85', description: 'Seasonal plates, open-fire cooking, and a warm candlelit room.', tags: ['Date night', 'Chef-led'] },
  { id: '2', name: 'The Green Table', cuisine: 'Modern Indian', area: 'RS Puram', price: '₹₹', rating: '4.7', time: '15–30 min', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85', description: 'A fresh take on regional favourites with locally sourced ingredients.', tags: ['Vegetarian friendly', 'Family'] },
  { id: '3', name: 'Saffron House', cuisine: 'South Indian', area: 'Peelamedu', price: '₹₹', rating: '4.6', time: '10–20 min', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85', description: 'Comforting classics, crisp dosas, and a contemporary dining space.', tags: ['Local favourite', 'Casual'] },
  { id: '4', name: 'Miso & Maple', cuisine: 'Asian fusion', area: 'Avinashi Road', price: '₹₹₹', rating: '4.9', time: '20–35 min', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85', description: 'Bright flavours, handmade dumplings, and a playful seasonal menu.', tags: ['Group dining', 'Cocktails'] },
  { id: '5', name: 'Cedar Social', cuisine: 'Continental', area: 'Saibaba Colony', price: '₹₹', rating: '4.5', time: '10–25 min', image: 'https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=1200&q=85', description: 'An easygoing neighbourhood spot for long lunches and shared plates.', tags: ['Brunch', 'Outdoor seats'] },
  { id: '6', name: 'Little Fig', cuisine: 'Cafe & bakery', area: 'Vadavalli', price: '₹', rating: '4.7', time: '5–15 min', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85', description: 'Coffee, baked treats, and a calm corner for slow mornings.', tags: ['Coffee', 'Breakfast'] }
];

function saveDB(data) {
  const tempFile = `${DB}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, DB);
}

function readDB() {
  let db;

  try {
    db = JSON.parse(fs.readFileSync(DB, 'utf8'));
  } catch {
    db = {};
  }

  if (!db || typeof db !== 'object' || Array.isArray(db)) {
    db = {};
  }

  if (!Array.isArray(db.restaurants) || db.restaurants.length === 0) {
    db.restaurants = seedRestaurants;
  }

  if (!Array.isArray(db.users)) db.users = [];
  if (!Array.isArray(db.reservations)) db.reservations = [];

  saveDB(db);
  return db;
}

readDB();

function safeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function findRestaurant(db, restaurantId, restaurantName) {
  let restaurant = db.restaurants.find(
    item => String(item.id) === String(restaurantId ?? '').trim()
  );

  if (!restaurant && restaurantName) {
    restaurant = db.restaurants.find(
      item => normalizeText(item.name) === normalizeText(restaurantName)
    );
  }

  return restaurant;
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ')
    ? header.slice(7).trim()
    : '';

  if (!token) {
    return res.status(401).json({
      message: 'Please log in to continue.'
    });
  }

  const db = readDB();
  const user = db.users.find(item => item.token === token);

  if (!user) {
    return res.status(401).json({
      message: 'Your session is invalid. Please log in again.'
    });
  }

  req.user = safeUser(user);
  next();
}

function normalizeReservationDate(value) {
  const text = String(value ?? '').trim();
  let year, month, day;

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    [year, month, day] = text.split('-').map(Number);
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(text)) {
    [day, month, year] = text.split('-').map(Number);
  } else {
    return null;
  }

  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayLocalISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function validateReservation(body) {
  const { name, date, time, guests } = body;

  if (
    typeof name !== 'string' ||
    name.trim().length < 2 ||
    !date ||
    !time ||
    !Number.isInteger(Number(guests)) ||
    Number(guests) < 1 ||
    Number(guests) > 12
  ) {
    return 'Check the required reservation fields.';
  }

  const normalizedDate = normalizeReservationDate(date);

  if (!normalizedDate) {
    return 'Choose a valid reservation date.';
  }

  if (normalizedDate < todayLocalISO()) {
    return 'Reservation date cannot be in the past.';
  }

  return null;
}

app.use(cors({ origin: true }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', storage: 'local JSON file' });
});

app.get('/api/restaurants', (req, res) => {
  const db = readDB();
  res.json({ restaurants: db.restaurants });
});

app.get('/api/restaurants/:id', (req, res) => {
  const db = readDB();
  const restaurant = db.restaurants.find(
    item => String(item.id) === String(req.params.id)
  );

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found.' });
  }

  res.json({ restaurant });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (
    typeof name !== 'string' ||
    name.trim().length < 2 ||
    typeof email !== 'string' ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    typeof password !== 'string' ||
    password.length < 8
  ) {
    return res.status(400).json({
      message: 'Enter a name, valid email, and password with at least 8 characters.'
    });
  }

  const db = readDB();
  const normalizedEmail = email.trim().toLowerCase();

  if (db.users.some(user => normalizeText(user.email) === normalizedEmail)) {
    return res.status(409).json({
      message: 'An account with this email already exists.'
    });
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
    token: crypto.randomBytes(32).toString('hex')
  };

  db.users.push(user);
  saveDB(db);

  res.status(201).json({ user: safeUser(user), token: user.token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      message: 'Enter your email and password.'
    });
  }

  const db = readDB();
  const normalizedEmail = email.trim().toLowerCase();
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  const user = db.users.find(
    item =>
      normalizeText(item.email) === normalizedEmail &&
      item.passwordHash === hash
  );

  if (!user) {
    return res.status(401).json({
      message: 'Email or password is incorrect.'
    });
  }

  user.token ||= crypto.randomBytes(32).toString('hex');
  saveDB(db);

  res.json({ user: safeUser(user), token: user.token });
});

app.post('/api/auth/logout', auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(item => item.id === req.user.id);

  if (user) user.token = null;

  saveDB(db);
  res.status(204).end();
});

app.get('/api/reservations', auth, (req, res) => {
  const db = readDB();

  const reservations =
    req.user.email === 'admin@gathergrain.local'
      ? db.reservations
      : db.reservations.filter(item => item.userId === req.user.id);

  res.json({ reservations });
});

app.post('/api/reservations', auth, (req, res) => {
  const body = req.body || {};
  const db = readDB();

  const restaurant = findRestaurant(
    db,
    body.restaurantId,
    body.restaurantName
  );

  if (!restaurant) {
    return res.status(400).json({
      message: 'Choose a valid restaurant. Refresh the page and select a restaurant again.'
    });
  }

  const validationError = validateReservation(body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const normalizedDate = normalizeReservationDate(body.date);

  const reservation = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    email: req.user.email,
    restaurantId: String(restaurant.id),
    restaurantName: restaurant.name,
    name: body.name.trim(),
    date: normalizedDate,
    time: body.time,
    guests: Number(body.guests),
    occasion: body.occasion || '',
    notes: body.notes || '',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  db.reservations.unshift(reservation);
  saveDB(db);

  res.status(201).json({ reservation });
});

app.put('/api/reservations/:id', auth, (req, res) => {
  const db = readDB();
  const reservation = db.reservations.find(
    item => item.id === req.params.id
  );

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found.' });
  }

  if (
    reservation.userId !== req.user.id &&
    req.user.email !== 'admin@gathergrain.local'
  ) {
    return res.status(403).json({
      message: 'You cannot edit this reservation.'
    });
  }

  const body = req.body || {};
  const validationError = validateReservation(body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  Object.assign(reservation, {
    name: body.name.trim(),
    date: normalizeReservationDate(body.date),
    time: body.time,
    guests: Number(body.guests),
    occasion: body.occasion || '',
    notes: body.notes || ''
  });

  saveDB(db);
  res.json({ reservation });
});

app.delete('/api/reservations/:id', auth, (req, res) => {
  const db = readDB();
  const index = db.reservations.findIndex(
    item => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ message: 'Reservation not found.' });
  }

  const reservation = db.reservations[index];

  if (
    reservation.userId !== req.user.id &&
    req.user.email !== 'admin@gathergrain.local'
  ) {
    return res.status(403).json({
      message: 'You cannot cancel this reservation.'
    });
  }

  db.reservations.splice(index, 1);
  saveDB(db);

  res.status(204).end();
});

app.use((err, req, res, next) => {
  console.error('[Gather & Grain API]', err);

  if (res.headersSent) return next(err);

  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Gather & Grain API running at http://localhost:${PORT}`);
});
