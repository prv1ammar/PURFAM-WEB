const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

// ── Global middleware (must come first so CORS headers are on every response) ──
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://luxeessance.com',
      'https://www.luxeessance.com',
    ].filter(Boolean);
    if (!origin || allowed.some(o => origin.startsWith(o)) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));

// Stripe webhook needs raw body — mount BEFORE express.json()
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentRoutes);

app.use(express.json());

// ── Upload via Cloudinary ─────────────────────────────────────────────────────
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const { protect } = require('./middleware/auth');
const { admin } = require('./middleware/admin');

app.post('/api/admin/upload', protect, admin, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'luxe-essence', resource_type: 'image' },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('[Upload] Cloudinary error:', err.message);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/collections', require('./routes/collections.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', require('./routes/admin.routes'));

// Public settings endpoint (no auth required)
app.get('/api/settings', require('./controllers/admin.controller').getSiteSettings);

// Contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });
  if (!process.env.RESEND_API_KEY) {
    console.log('[Contact] Email not configured');
    return res.json({ ok: true });
  }
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Luxe Essence <onboarding@resend.dev>',
      to: process.env.NOTIFY_EMAIL || 'amarrabeh1998@gmail.com',
      subject: `📩 Message de ${name} — Luxe Essence`,
      html: `<p><b>Nom:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message}</p>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[Contact] Error:', err.message);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Luxe Essence API running' }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌟 Luxe Essence server running on port ${PORT}`));
