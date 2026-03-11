const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const { getAddresses, addAddress, deleteAddress } = require('../controllers/addressController');

// all address routes need login
router.use(authenticateUser);

// GET /api/addresses - get all saved addresses
router.get('/', getAddresses);

// POST /api/addresses - add a new address
router.post('/', addAddress);

// DELETE /api/addresses/:id - delete an address
router.delete('/:id', deleteAddress);

module.exports = router;
