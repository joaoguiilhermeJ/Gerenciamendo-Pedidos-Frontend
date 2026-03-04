const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE ||
    "https://gp-api-gateway.onrender.com/api/v1",
  API_KEY: import.meta.env.VITE_API_KEY || "IFPIpantera3324JJM",

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "x-api-key": this.API_KEY,
    };
  },
};

API_CONFIG.endpoints = {
  clientes: {
    listar: () => `${API_CONFIG.BASE_URL}/customers`,
    buscar: (id) => `${API_CONFIG.BASE_URL}/customers/${id}`,
    criar: () => `${API_CONFIG.BASE_URL}/customers`,
    atualizar: (id) => `${API_CONFIG.BASE_URL}/customers/${id}`,
    deletar: (id) => `${API_CONFIG.BASE_URL}/customers/${id}`,
  },

  produtos: {
    listar: () => `${API_CONFIG.BASE_URL}/products`,
    buscar: (id) => `${API_CONFIG.BASE_URL}/products/${id}`,
    criar: () => `${API_CONFIG.BASE_URL}/products`,
    atualizar: (id) => `${API_CONFIG.BASE_URL}/products/${id}`,
    deletar: (id) => `${API_CONFIG.BASE_URL}/products/${id}`,
    atualizarEstoque: (id) => `${API_CONFIG.BASE_URL}/products/${id}`,
  },

  pedidos: {
    listar: () => `${API_CONFIG.BASE_URL}/orders`,
    buscar: (id) => `${API_CONFIG.BASE_URL}/orders/${id}`,
    criar: () => `${API_CONFIG.BASE_URL}/orders`,
    atualizar: (id) => `${API_CONFIG.BASE_URL}/orders/${id}`,
    deletar: (id) => `${API_CONFIG.BASE_URL}/orders/${id}`,
    cancelar: (id) => `${API_CONFIG.BASE_URL}/orders/${id}`,
  },
};

export default API_CONFIG;
