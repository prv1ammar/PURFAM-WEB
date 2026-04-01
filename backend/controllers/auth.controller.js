const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res, next) => {
  return res.status(403).json({ message: 'Registration is disabled. Only admins can log in.' });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only administrators can log in.' });
    }
    const userObj = user.toJSON();
    res.json({ user: userObj, token: generateToken(user._id, user.role) });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
