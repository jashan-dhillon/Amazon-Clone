const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart
} = require('../controllers/wishlistController');

// all wishlist routes need login
router.use(authenticateUser);

// GET /api/wishlist - get all wishlist items
router.get('/', getWishlist);

// POST /api/wishlist - add product to wishlist
router.post('/', addToWishlist);

// DELETE /api/wishlist/:id - remove from wishlist
router.delete('/:id', removeFromWishlist);

// POST /api/wishlist/:id/move-to-cart - move item from wishlist to cart
router.post('/:id/move-to-cart', moveToCart);

module.exports = router;
