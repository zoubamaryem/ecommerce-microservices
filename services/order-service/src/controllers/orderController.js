const Order = require('../models/Order');
const { verifyUser, verifyProduct, updateProductStock } = require('../utils/serviceClient');
const { validationResult } = require('express-validator');

// Créer une commande
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, items, shippingAddress, paymentMethod } = req.body;

    // 1. Vérifier l'utilisateur
    const token = req.headers.authorization?.split(' ')[1];
    try {
      await verifyUser(userId, token);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'User verification failed',
      });
    }

    // 2. Vérifier les produits et le stock
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      try {
        const product = await verifyProduct(item.productId);
        
        // Vérifier le stock
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${product.name}`,
          });
        }

        // Calculer le montant
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        verifiedItems.push({
          productId: product._id,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Product verification failed for ID: ${item.productId}`,
        });
      }
    }

    // 3. Créer la commande
    const order = await Order.create({
      userId,
      items: verifiedItems,
      totalAmount: totalAmount.toFixed(2),
      shippingAddress,
      paymentMethod,
    });

    // 4. Mettre à jour le stock des produits
    for (const item of verifiedItems) {
      try {
        await updateProductStock(item.productId, -item.quantity);
      } catch (error) {
        console.error('Error updating stock:', error);
        // En production, il faudrait implémenter un système de rollback
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during order creation',
    });
  }
};

// Obtenir toutes les commandes d'un utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const orders = await Order.findByUserId(userId, limit, offset);
    const total = await Order.countByUserId(userId);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Obtenir une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.updateStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.cancel(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Remettre le stock (optionnel)
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    for (const item of items) {
      try {
        await updateProductStock(item.productId, item.quantity);
      } catch (error) {
        console.error('Error restoring stock:', error);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
