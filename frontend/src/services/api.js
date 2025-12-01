import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  }
};

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addToCart: async (productId, size, quantity) => {
    const response = await api.post('/cart/add', { productId, size, quantity });
    return response.data;
  },
  updateCartItem: async (productId, size, quantity) => {
    const response = await api.put('/cart/update', { productId, size, quantity });
    return response.data;
  },
  removeFromCart: async (productId, size) => {
    const response = await api.delete('/cart/remove', { data: { productId, size } });
    return response.data;
  }
};

export const orderService = {
  checkout: async (shippingAddress) => {
    const response = await api.post('/orders/checkout', { shippingAddress });
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  }
};