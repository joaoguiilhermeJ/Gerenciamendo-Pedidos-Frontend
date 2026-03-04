import API_CONFIG from "./api.config.js";

class APIService {
  async request(url, options = {}) {
    try {
      const headers = {
        ...API_CONFIG.getHeaders(),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ erro: "Erro desconhecido" }));

        throw new Error(
          errorData.erro || `Erro ${response.status}: ${response.statusText}`,
        );
      }

      if (response.status === 204) return null;

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        return await response.text().catch(() => null);
      }

      return await response.json().catch(() => null);
    } catch (error) {
      console.error(`[API ERROR] URL: ${url}`);
      console.error(`[API ERROR] Method: ${options.method || "GET"}`);
      console.error(`[API ERROR]`, error);

      throw new Error(
        `Erro de rede ao conectar à API.
URL: ${url}
Detalhe: ${error.message}`
      );
    }
  }

  async listarClientes() {
    return this.request(API_CONFIG.endpoints.clientes.listar(), {
      method: "GET",
    });
  }

  async buscarCliente(id) {
    return this.request(API_CONFIG.endpoints.clientes.buscar(id), {
      method: "GET",
    });
  }

  async criarCliente(dados) {
    return this.request(API_CONFIG.endpoints.clientes.criar(), {
      method: "POST",
      body: JSON.stringify(dados),
    });
  }

  async atualizarCliente(id, dados) {
    return this.request(API_CONFIG.endpoints.clientes.atualizar(id), {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  }

  async deletarCliente(id) {
    return this.request(API_CONFIG.endpoints.clientes.deletar(id), {
      method: "DELETE",
    });
  }

  async listarProdutos() {
    return this.request(API_CONFIG.endpoints.produtos.listar(), {
      method: "GET",
    });
  }

  async buscarProduto(id) {
    return this.request(API_CONFIG.endpoints.produtos.buscar(id), {
      method: "GET",
    });
  }

  async criarProduto(dados) {
    return this.request(API_CONFIG.endpoints.produtos.criar(), {
      method: "POST",
      body: JSON.stringify(dados),
    });
  }

  async atualizarProduto(id, dados) {
    return this.request(API_CONFIG.endpoints.produtos.atualizar(id), {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  }

  async deletarProduto(id) {
    return this.request(API_CONFIG.endpoints.produtos.deletar(id), {
      method: "DELETE",
    });
  }

  async listarPedidos() {
    return this.request(API_CONFIG.endpoints.pedidos.listar(), {
      method: "GET",
    });
  }

  async buscarPedido(id) {
    return this.request(API_CONFIG.endpoints.pedidos.buscar(id), {
      method: "GET",
    });
  }

  async criarPedido(dados) {
    return this.request(API_CONFIG.endpoints.pedidos.criar(), {
      method: "POST",
      body: JSON.stringify(dados),
    });
  }

  async atualizarPedido(id, dados) {
    return this.request(API_CONFIG.endpoints.pedidos.atualizar(id), {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  }

  async deletarPedido(id) {
    return this.request(API_CONFIG.endpoints.pedidos.deletar(id), {
      method: "DELETE",
    });
  }
}

const apiService = new APIService();
export default apiService;

window.apiService = apiService;