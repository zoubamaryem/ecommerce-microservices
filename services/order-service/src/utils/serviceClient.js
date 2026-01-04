const axios = require('axios');
require('dotenv').config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

// Client pour User Service
const userServiceClient = axios.create({
  baseURL: USER_SERVICE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client pour Product Service
const productServiceClient = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vérifier si un utilisateur existe
const verifyUser = async (userId, token) => {
  try {
    const response = await userServiceClient.get(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.user;
  } catch (error) {
    console.error('Error verifying user:', error.message);
    throw new Error('User verification failed');
  }
};

// Vérifier un produit et son stock
const verifyProduct = async (productId) => {
  try {
    const response = await productServiceClient.get(`/api/products/${productId}`);
    return response.data.data.product;
  } catch (error) {
    console.error('Error verifying product:', error.message);
    throw new Error('Product verification failed');
  }
};

// Mettre à jour le stock d'un produit
const updateProductStock = async (productId, quantity) => {
  try {
    const response = await productServiceClient.patch(
      `/api/products/${productId}/stock`,
      { quantity }
    );
    return response.data.data.product;
  } catch (error) {
    console.error('Error updating product stock:', error.message);
    throw new Error('Stock update failed');
  }
};

module.exports = {
  verifyUser,
  verifyProduct,
  updateProductStock,
};
