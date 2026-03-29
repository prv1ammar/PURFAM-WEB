const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getFeatured } = require('../controllers/product.controller');

router.get('/', getAllProducts);
router.get('/featured', getFeatured);
router.get('/:id', getProductById);

module.exports = router;
