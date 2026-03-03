# Arquivos de Referência

Exemplos de implementação de páginas usando o `apiService` para comunicação com os microserviços.

## 📄 Arquivos Disponíveis

| Arquivo                | Descrição                          |
| ---------------------- | ---------------------------------- |
| `clientes.criar.html`  | Formulário para criar novo cliente |
| `clientes.listar.html` | Lista e gerencia clientes          |
| `produtos.listar.html` | Lista e gerencia produtos          |
| `pedidos.criar.html`   | Formulário para criar novo pedido  |

## 🚀 Como Usar

1. Copie o código dos arquivos que se adequam à sua implementação
2. Adapte os seletores CSS conforme sua estrutura
3. Importe `api.config.js` e `api.service.js`
4. Use `window.apiService` para chamar as operações

## 🔑 Métodos Disponíveis

```javascript
// Clientes
await apiService.listarClientes();
await apiService.criarCliente(data);
await apiService.deletarCliente(id);

// Produtos
await apiService.listarProdutos();
await apiService.deletarProduto(id);

// Pedidos
await apiService.criarPedido(data);
```

Veja `GUIA_REFATORACAO.md` para detalhes completos.
