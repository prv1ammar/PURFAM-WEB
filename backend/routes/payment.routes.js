const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

// Webhook uses raw body (mounted in server.js before json middleware)
router.post('/webhook', handleWebhook);
router.post('/create-intent', createPaymentIntent);

module.exports = router;
