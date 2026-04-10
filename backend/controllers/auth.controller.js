const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  return res.status(403).json({ message: 'Registration is disabled. Only admins can log in.' });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only administrators can log in.' });
    }

    const { password_hash, ...userObj } = user;
    res.json({ user: userObj, token: generateToken(user.id, user.role) });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
