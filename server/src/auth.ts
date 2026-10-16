import { Router, Request, Response, NextFunction, CookieOptions } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db';

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production');
}
const SECRET = process.env.SESSION_SECRET || 'dev-only-insecure-secret';
const COOKIE_NAME = 'session';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
  maxAge: MAX_AGE_MS
};

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: number; email: string };
  }
}

const setSession = (res: Response, user: { id: number; email: string }) => {
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: Math.floor(MAX_AGE_MS / 1000)
  });
  res.cookie(COOKIE_NAME, token, cookieOptions);
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;
    req.user = { id: payload.id as number, email: payload.email as string };
    next();
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  const normalized = email.trim().toLowerCase();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(normalized)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const info = db
      .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
      .run(normalized, hash);
    const user = { id: Number(info.lastInsertRowid), email: normalized };
    setSession(res, user);
    res.status(201).json(user);
  } catch {
    res.status(409).json({ error: 'An account with this email already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const row = db
    .prepare('SELECT id, email, password_hash FROM users WHERE email = ?')
    .get(email.trim().toLowerCase()) as UserRow | undefined;
  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }
  const user = { id: row.id, email: row.email };
  setSession(res, user);
  res.json(user);
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

export default router;
