const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');

// all order routes need login
router.use(authenticateUser);

// POST /api/orders - place a new order
router.post('/', placeOrder);

// GET /api/orders - get order history
router.get('/', getOrders);

// GET /api/orders/:id - get a specific order's details
router.get('/:id', getOrderById);

module.exports = router;
