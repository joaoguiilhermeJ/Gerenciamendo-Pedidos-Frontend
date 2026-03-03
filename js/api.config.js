

const API_CONFIG = {
  // URLs base dos microserviços (via variáveis de ambiente ou defaults)
  CLIENTES: import.meta.env.VITE_URL_CLIENTES || "http://localhost:3001",
  PRODUTOS: import.meta.env.VITE_URL_PRODUTOS || "http://localhost:3002",
  PEDIDOS: import.meta.env.VITE_URL_PEDIDOS || "http://localhost:3003",


  API_KEY: import.meta.env.VITE_API_KEY || "default-api-key",

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "x-api-key": this.API_KEY,
    };
  },
};

// --- MS-CLIENTES (porta 3001) ---
API_CONFIG.endpoints = {
  clientes: {
    listar: () => `${API_CONFIG.CLIENTES}/clientes`,
    buscar: (id) => `${API_CONFIG.CLIENTES}/clientes/${id}`,
    criar: () => `${API_CONFIG.CLIENTES}/clientes`,
    atualizar: (id) => `${API_CONFIG.CLIENTES}/clientes/${id}`,
    deletar: (id) => `${API_CONFIG.CLIENTES}/clientes/${id}`,
  },

  // --- MS-PRODUTOS (porta 3002) ---
  produtos: {
    listar: () => `${API_CONFIG.PRODUTOS}/produtos`,
    buscar: (id) => `${API_CONFIG.PRODUTOS}/produtos/${id}`,
    criar: () => `${API_CONFIG.PRODUTOS}/produtos`,
    atualizar: (id) => `${API_CONFIG.PRODUTOS}/produtos/${id}`,
    deletar: (id) => `${API_CONFIG.PRODUTOS}/produtos/${id}`,
    atualizarEstoque: (id) => `${API_CONFIG.PRODUTOS}/produtos/${id}`, // PATCH para /produtos/:id
  },

  // --- MS-PEDIDOS (porta 3003) ---
  pedidos: {
    listar: () => `${API_CONFIG.PEDIDOS}/pedidos`,
    buscar: (id) => `${API_CONFIG.PEDIDOS}/pedidos/${id}`,
    criar: () => `${API_CONFIG.PEDIDOS}/pedidos`,
    atualizar: (id) => `${API_CONFIG.PEDIDOS}/pedidos/${id}`,
    deletar: (id) => `${API_CONFIG.PEDIDOS}/pedidos/${id}`,
    cancelar: (id) => `${API_CONFIG.PEDIDOS}/pedidos/${id}`, // DELETE para /pedidos/:id
  },
};

export default API_CONFIG;
