import API_CONFIG from "./api.config.js";

class APIService {

  _normalizeProduto(produto) {
    if (!produto) return produto;

    return {
      id: produto.id ?? produto.idProduto ?? null,
      idProduto: produto.idProduto ?? produto.id ?? null,
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
          errorData.erro || `Erro ${response.status}: ${response.statusText}`
        );
      }

      if (response.status === 204) return null;

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        return await response.text().catch(() => null);
      }

      return await response.json().catch(() => null);

    } catch (error) {

      console.error(`[API FETCH ERROR] URL: ${url}`);
      console.error(`[API FETCH ERROR] Method: ${options.method || 'GET'}`);
      console.error(`[API FETCH ERROR]`, error);

      if (
        error instanceof TypeError &&
        (error.message.includes("fetch") ||
          error.message.includes("Network") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("CORS"))
      ) {
        throw new Error(
          `Erro de rede ao conectar à API.
URL: ${url}
Detalhe: ${error.message}`
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
    if (!id) throw new Error("ID do cliente inválido.");

    return this.request(API_CONFIG.endpoints.clientes.deletar(id), {
      method: "DELETE",
    });
  }

  async listarProdutos() {
    const res = await this.request(API_CONFIG.endpoints.produtos.listar(), {
      method: "GET",
    });

    if (!res) return [];

    const produtos = Array.isArray(res) ? res : [res];

    return produtos.map(p => this._normalizeProduto(p));
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
    if (!id) throw new Error("ID do produto inválido.");

    const payload = this._produtoPayloadFromForm(dados);

    return this.request(API_CONFIG.endpoints.produtos.atualizar(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async atualizarEstoqueProduto(id, estoque) {
    if (!id) throw new Error("ID do produto inválido.");

    return this.request(API_CONFIG.endpoints.produtos.atualizarEstoque(id), {
      method: "PATCH",
      body: JSON.stringify({ estoque }),
    });
  }

  async deletarProduto(id) {
    if (!id) throw new Error("ID do produto inválido.");

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
    if (!id) throw new Error("ID do pedido inválido.");

    return this.request(API_CONFIG.endpoints.pedidos.atualizar(id), {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  }

  async deletarPedido(id) {
    if (!id) throw new Error("ID do pedido inválido.");

    return this.request(API_CONFIG.endpoints.pedidos.deletar(id), {
      method: "DELETE",
    });
  }

  async cancelarPedido(id) {
    if (!id) throw new Error("ID do pedido inválido.");

    return this.request(API_CONFIG.endpoints.pedidos.cancelar(id), {
      method: "DELETE",
    });
  }

  async entregarPedido(id) {
    if (!id) throw new Error("ID do pedido inválido.");

    return this.request(
      `${API_CONFIG.endpoints.pedidos.listar()}/${id}/entregar`,
      { method: "POST" }
    );
  }
}

const apiService = new APIService();

export default apiService;

window.apiService = apiService;