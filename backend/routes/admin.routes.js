const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getCollections, createCollection, updateCollection, deleteCollection, getCollectionProducts, addProductToCollection, removeProductFromCollection } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect, admin);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/collections', getCollections);
router.post('/collections', createCollection);
router.put('/collections/:id', updateCollection);
router.delete('/collections/:id', deleteCollection);

router.get('/collections/:id/products', getCollectionProducts);
router.post('/collections/:id/products', addProductToCollection);
router.delete('/collections/:id/products/:productId', removeProductFromCollection);

module.exports = router;
