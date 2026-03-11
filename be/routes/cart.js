const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

// all cart routes need the user to be logged in
router.use(authenticateUser);

// GET /api/cart - get all cart items
router.get('/', getCart);

// POST /api/cart - add item to cart
router.post('/', addToCart);

// PUT /api/cart/:id - update item quantity
router.put('/:id', updateCartItem);

// DELETE /api/cart/:id - remove item from cart
router.delete('/:id', removeFromCart);

// DELETE /api/cart - clear entire cart
router.delete('/', clearCart);

module.exports = router;
