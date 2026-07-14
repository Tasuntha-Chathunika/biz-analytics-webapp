const db = require('../db');
const crypto = require('crypto');

const JWT_SECRET = 'insightengine-secret-key-123456';

// Pure node.js implementation of JWT generation
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  // Add expiration (24h)
  const expPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  };
  const body = Buffer.from(JSON.stringify(expPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const hash = db.hashPassword(password, user.salt);
    if (hash !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields (email, password, name, role) are required' });
    }

    if (!['admin', 'manager', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role selection' });
    }

    // Check if email already exists
    const checkRes = await db.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (checkRes.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = db.hashPassword(password, salt);

    // Insert user into SQLite
    await db.query(
      'INSERT INTO users (email, password_hash, salt, role, name) VALUES ($1, $2, $3, $4, $5)',
      [email.trim().toLowerCase(), hash, salt, role, name]
    );

    // Fetch the new user to get their auto-generated id
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    const user = userRes.rows[0];

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// Export verification utility for middleware
exports.verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    
    const decodedBody = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    // Check expiration
    if (decodedBody.exp && decodedBody.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decodedBody;
  } catch (err) {
    return null;
  }
};
