import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

// Signe un token JWT avec l'id et le username
function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * POST /api/users/register
 * Body: { username, password }
 * Inscription + retour d'un JWT
 */
export const register = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'username et password sont requis.' });
    }

    // Vérifie l’unicité du username
    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(409).json({ message: 'Nom d’utilisateur déjà pris.' });

    // Hash du mot de passe
    const hashed = await bcrypt.hash(password, 12);

    // Création de l’utilisateur
    const user = await User.create({ username, password: hashed });

    // Génère un token pour utilisation immédiate
    const token = signToken(user);

    return res.status(201).json({
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription.' });
  }
};

/**
 * POST /api/users/login
 * Body: { username, password }
 * Connexion + retour d'un JWT
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'username et password sont requis.' });
    }

    // Recherche de l’utilisateur
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    // Vérifie le mot de passe
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Mot de passe incorrect.' });

    // Génère le token
    const token = signToken(user);

    return res.status(200).json({
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};