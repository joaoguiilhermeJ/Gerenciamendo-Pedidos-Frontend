import API_CONFIG from "./api.config.js";

class APIService {
  _normalizeProduto(produto) {
    if (!produto) return produto;
    return {
      id: produto.id ?? produto.idProduto ?? null,
      nome: produto.nome ?? produto.nomeProduto ?? "",
      categoria: produto.categoria ?? produto.tipo ?? null,
      preco: Number(produto.preco ?? produto.valor ?? 0),
      estoque: Number(produto.estoque ?? produto.quantidade ?? 0),
      status: produto.status ?? true,
    };
  }

  _produtoPayloadFromForm(dados) {
    return {
      nome: dados.nome ?? dados.nomeProduto ?? "",
      preco: Number(dados.preco ?? dados.valor ?? 0),
      estoque: Number(dados.estoque ?? dados.quantidade ?? 0),
      categoria: dados.categoria ?? dados.tipo ?? null,
    };
  }

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

      // Alguns endpoints podem retornar 204 No Content ou respostas sem JSON.
      if (response.status === 204) return null;

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        // Retorna texto para casos inesperados
        return await response.text().catch(() => null);
      }

      return await response.json().catch(() => null);
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

  async deletarPedido(id) {
    return this.request(API_CONFIG.endpoints.pedidos.deletar(id), {
      method: "DELETE",
    });
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
    const res = await this.request(API_CONFIG.endpoints.produtos.listar(), {
      method: "GET",
    });
    if (!res) return [];
    return Array.isArray(res) ? res.map((p) => this._normalizeProduto(p)) : [this._normalizeProduto(res)];
  }

  async buscarProduto(id) {
    const res = await this.request(API_CONFIG.endpoints.produtos.buscar(id), {
      method: "GET",
    });
    return this._normalizeProduto(res);
  }

  async criarProduto(dados) {
    const payload = this._produtoPayloadFromForm(dados);
    return this.request(API_CONFIG.endpoints.produtos.criar(), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async atualizarProduto(id, dados) {
    const payload = this._produtoPayloadFromForm(dados);
    return this.request(API_CONFIG.endpoints.produtos.atualizar(id), {
      method: "PUT",
      body: JSON.stringify(payload),
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
