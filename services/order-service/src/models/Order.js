const { pool } = require('../config/database');

class Order {
  // Créer une commande
  static async create({ userId, items, totalAmount, shippingAddress, paymentMethod }) {
    const query = `
      INSERT INTO orders (user_id, items, total_amount, shipping_address, payment_method, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      userId,
      JSON.stringify(items),
      totalAmount,
      JSON.stringify(shippingAddress),
      paymentMethod,
      'pending',
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Trouver par ID
  static async findById(id) {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Trouver toutes les commandes d'un utilisateur
  static async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT * FROM orders 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  // Compter les commandes d'un utilisateur
  static async countByUserId(userId) {
    const query = 'SELECT COUNT(*) FROM orders WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  // Mettre à jour le statut
  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const query = `
      UPDATE orders 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  // Annuler une commande
  static async cancel(id) {
    const order = await this.findById(id);
    
    if (!order) {
      throw new Error('Order not found');
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new Error('Order cannot be cancelled');
    }

    return await this.updateStatus(id, 'cancelled');
  }

  // Supprimer une commande
  static async delete(id) {
    const query = 'DELETE FROM orders WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Order;
