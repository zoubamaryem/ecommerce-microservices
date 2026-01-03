const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Créer un utilisateur
  static async create({ email, password, firstName, lastName, phone, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password, first_name, last_name, phone, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, phone, role, created_at
    `;
    
    const values = [email, hashedPassword, firstName, lastName, phone, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Trouver par email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Trouver par ID
  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, phone, role, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Mettre à jour
  static async update(id, { firstName, lastName, phone }) {
    const query = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          phone = COALESCE($3, phone),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, email, first_name, last_name, phone, role, updated_at
    `;
    
    const values = [firstName, lastName, phone, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Supprimer
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Comparer les mots de passe
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Changer le mot de passe
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE users 
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [hashedPassword, id]);
    return result.rows[0];
  }
}

module.exports = User;
