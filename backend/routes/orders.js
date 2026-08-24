const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, orderController.createOrder);
router.get('/myorders', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrder);

// Admin
router.get('/', protect, admin, orderController.getAllOrders);
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

module.exports = router;
