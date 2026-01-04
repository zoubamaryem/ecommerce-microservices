const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { body } = require('express-validator');

// Validation pour créer une commande
const createOrderValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
];

// Validation pour mettre à jour le statut
const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
];

// Routes
router.post('/', createOrderValidation, orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', updateStatusValidation, orderController.updateOrderStatus);
router.delete('/:id', orderController.cancelOrder);

module.exports = router;
