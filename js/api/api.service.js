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

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      if (
        error instanceof TypeError &&
        (error.message.includes("fetch") ||
          error.message.includes("Network") ||
          error.message.includes("Failed to fetch"))
      ) {
        throw new Error(
          "Não foi possível conectar ao servidor. O microserviço pode estar fora do ar.",
        );
      }
      throw error;
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

  async atualizarEstoqueProduto(id, estoque) {
    return this.request(API_CONFIG.endpoints.produtos.atualizarEstoque(id), {
      method: "PATCH",
      body: JSON.stringify({ estoque }),
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

  async cancelarPedido(id) {
    return this.request(API_CONFIG.endpoints.pedidos.cancelar(id), {
      method: "DELETE",
    });
  }

  async entregarPedido(id) {
    return this.request(
      `${API_CONFIG.endpoints.pedidos.listar()}/${id}/entregar`,
      { method: "POST" },
    );
  }
}

const apiService = new APIService();
export default apiService;
window.apiService = apiService;
