const rawApiKey =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_KEY) ||
  "IFPIpantera3324JJM";

const API_CONFIG = {
  API_KEY: rawApiKey,

  getHeaders() {
    return {
      "Content-Type": "application/json",
      "x-api-key": this.API_KEY,
    };
  },
};

API_CONFIG.endpoints = {
  clientes: {
    listar: () => `https://gp-ms-clientes.onrender.com/clientes`,
    buscar: (id) => `https://gp-ms-clientes.onrender.com/clientes/${id}`,
    criar: () => `https://gp-ms-clientes.onrender.com/clientes`,
    atualizar: (id) => `https://gp-ms-clientes.onrender.com/clientes/${id}`,
    deletar: (id) => `https://gp-ms-clientes.onrender.com/clientes/${id}`,
  },

  produtos: {
    listar: () => `https://gp-ms-produtos.onrender.com/produtos`,
    buscar: (id) => `https://gp-ms-produtos.onrender.com/produtos/${id}`,
    criar: () => `https://gp-ms-produtos.onrender.com/produtos`,
    atualizar: (id) => `https://gp-ms-produtos.onrender.com/produtos/${id}`,
    deletar: (id) => `https://gp-ms-produtos.onrender.com/produtos/${id}`,
    atualizarEstoque: (id) => `https://gp-ms-produtos.onrender.com/produtos/${id}`,
  },

  pedidos: {
    listar: () => `https://gp-ms-pedidos.onrender.com/pedidos`,
    buscar: (id) => `https://gp-ms-pedidos.onrender.com/pedidos/${id}`,
    criar: () => `https://gp-ms-pedidos.onrender.com/pedidos`,
    atualizar: (id) => `https://gp-ms-pedidos.onrender.com/pedidos/${id}`,
    deletar: (id) => `https://gp-ms-pedidos.onrender.com/pedidos/${id}`,
    cancelar: (id) => `https://gp-ms-pedidos.onrender.com/pedidos/${id}`,
  },
};

export default API_CONFIG;