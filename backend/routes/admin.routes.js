const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect, admin);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
