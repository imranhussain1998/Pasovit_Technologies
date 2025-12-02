import axios from 'axios';

const API_URLS = [
  process.env.REACT_APP_API_URL || 'https://pasovit-technologies-2.onrender.com/api',
  'http://localhost:5001/api'
];

let currentApiIndex = 0;

const createApiInstance = (baseURL) => {
  const instance = axios.create({ baseURL, timeout: 5000 });
  
  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  return instance;
};

const makeRequest = async (requestFn) => {
  for (let i = 0; i < API_URLS.length; i++) {
    try {
      const api = createApiInstance(API_URLS[currentApiIndex]);
      return await requestFn(api);
    } catch (error) {
      console.log(`API ${API_URLS[currentApiIndex]} failed, trying next...`);
      currentApiIndex = (currentApiIndex + 1) % API_URLS.length;
      if (i === API_URLS.length - 1) throw error;
    }
  }
};

const api = createApiInstance(API_URLS[0]);



export const authService = {
  login: async (email, password) => {
    return await makeRequest(api => api.post('/auth/login', { email, password }).then(res => res.data));
  },
  register: async (name, email, password) => {
    return await makeRequest(api => api.post('/auth/register', { name, email, password }).then(res => res.data));
  }
};

export const productService = {
  getProducts: async (params = {}) => {
    return await makeRequest(api => api.get('/products', { params }).then(res => res.data));
  },
  getProduct: async (id) => {
    return await makeRequest(api => api.get(`/products/${id}`).then(res => res.data));
  }
};

export const cartService = {
  getCart: async () => {
    return await makeRequest(api => api.get('/cart').then(res => res.data));
  },
  addToCart: async (productId, size, quantity) => {
    return await makeRequest(api => api.post('/cart/add', { productId, size, quantity }).then(res => res.data));
  },
  updateCartItem: async (productId, size, quantity) => {
    return await makeRequest(api => api.put('/cart/update', { productId, size, quantity }).then(res => res.data));
  },
  removeFromCart: async (productId, size) => {
    return await makeRequest(api => api.delete('/cart/remove', { data: { productId, size } }).then(res => res.data));
  }
};

export const orderService = {
  checkout: async (shippingAddress) => {
    return await makeRequest(api => api.post('/orders/checkout', { shippingAddress }).then(res => res.data));
  },
  getOrders: async () => {
    return await makeRequest(api => api.get('/orders').then(res => res.data));
  }
};