const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    getCategories,
    getFeaturedProducts
} = require('../controllers/productController');

// GET /api/products - get all products (with search & filter support)
router.get('/', getAllProducts);

// GET /api/products/featured - get homepage featured products
router.get('/featured', getFeaturedProducts);

// GET /api/products/categories - get all product categories
router.get('/categories', getCategories);

// GET /api/products/:id - get a single product's full details
router.get('/:id', getProductById);

module.exports = router;
