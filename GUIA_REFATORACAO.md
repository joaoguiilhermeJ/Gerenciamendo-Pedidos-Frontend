# 🔧 Guia de Refatoração Frontend para Microserviços

Este documento explica como adaptar seu frontend para chamar os 3 microserviços com autenticação via `x-api-key`.

## 📋 Arquivos Criados

1. **`frontend/.env.example`** - Template das variáveis de ambiente necessárias
2. **`frontend/public/js/api.config.js`** - Configuração centralizada das URLs e endpoints
3. **`frontend/public/js/api.service.js`** - Serviço que encapsula todas as requisições com autenticação
4. **`frontend/EXEMPLO_REFATORACAO_PRODUTOS.html`** - Exemplo de como refatorar um arquivo HTML

---

## 🚀 Passo 1: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:

   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Edite `frontend/.env` com as URLs corretas dos seus microserviços:
   ```dotenv
   VITE_API_KEY=MinhaChaveSuperSecreta123
   VITE_URL_CLIENTES=http://localhost:3001
   VITE_URL_PRODUTOS=http://localhost:3002
   VITE_URL_PEDIDOS=http://localhost:3003
   ```

---

## 🔐 Passo 2: Entender a Arquitetura

### `api.config.js`

**Responsabilidade:** Centralizar as URLs e endpoints

```javascript
API_CONFIG.CLIENTES; // http://localhost:3001
API_CONFIG.PRODUTOS; // http://localhost:3002
API_CONFIG.PEDIDOS; // http://localhost:3003

API_CONFIG.getHeaders(); // Retorna headers com x-api-key
API_CONFIG.endpoints.clientes.listar(); // Retorna URL completa
```

### `api.service.js`

**Responsabilidade:** Fazer requisições autenticadas

```javascript
// Métodos disponíveis:
await apiService.listarClientes();
await apiService.buscarCliente(id);
await apiService.criarCliente(dados);
await apiService.atualizarCliente(id, dados);
await apiService.deletarCliente(id);

await apiService.listarProdutos();
await apiService.buscarProduto(id);
await apiService.criarProduto(dados);
await apiService.atualizarProduto(id, dados);
await apiService.atualizarEstoqueProduto(id, estoque);
await apiService.deletarProduto(id);

await apiService.listarPedidos();
await apiService.buscarPedido(id);
await apiService.criarPedido(dados);
await apiService.atualizarPedido(id, dados);
await apiService.cancelarPedido(id);
```

---

## 🎯 Passo 3: Refatorar um Arquivo HTML

### ❌ ANTES (usando /api/...)

```html
<script>
  fetch("/api/produtos", {
    method: "DELETE",
  })
    .then((response) => response.json())
    .catch((error) => console.error("Erro:", error));
</script>
```

### ✅ DEPOIS (usando apiService)

```html
<!-- Importa os scripts necessários -->
<script src="/public/js/api.config.js" type="module"></script>
<script src="/public/js/api.service.js" type="module"></script>

<script type="module">
  // O apiService fica disponível globalmente em window.apiService
  try {
    await window.apiService.deletarProduto(produtoId);
    alert("Produto deletado com sucesso!");
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
</script>
```

---

## 📝 Exemplo Completo: Página de Listar Produtos

Veja `EXEMPLO_REFATORACAO_PRODUTOS.html` para um exemplo completo e funcional.

**Principais mudanças:**

1. **Remova o template EJS** (`<% %>`) - Agora o frontend carrega dados via API
2. **Importe os arquivos de API** no `<head>` ou antes do script
3. **Use `window.apiService`** para fazer requisições
4. **Renderize dinamicamente** com JavaScript

```html
<!-- Seu código fica assim: -->
<div id="produtos-container"></div>

<script type="module">
  async function carregarProdutos() {
    const produtos = await window.apiService.listarProdutos();
    // Renderize como desejar
    renderizarTabela(produtos);
  }

  carregarProdutos();
</script>
```

---

## 🔄 Checklist de Refatoração

Para cada arquivo HTML que faz requisições:

- [ ] Remova `<% %>` templates EJS (exceto para conteúdo estático)
- [ ] Adicione imports dos scripts de API:
  ```html
  <script src="/public/js/api.config.js" type="module"></script>
  <script src="/public/js/api.service.js" type="module"></script>
  ```
- [ ] Substitua `fetch()` direto por `window.apiService.metodo()`
- [ ] Adicione tratamento de erros com `try/catch`
- [ ] Adicione feedback visual (spinners, mensagens, etc)

---

## 📂 Arquivos que Precisam Refatoração

De acordo com sua estrutura:

### Clientes

- `frontend/views/clientes/listar.view.html` ➜ Use `apiService.listarClientes()`
- `frontend/views/clientes/cadastrar.view.html` ➜ Use `apiService.criarCliente()`
- `frontend/views/clientes/editar.view.html` ➜ Use `apiService.buscarCliente()` e `apiService.atualizarCliente()`

### Produtos

- `frontend/views/produtos/listar.view.html` ➜ Use `apiService.listarProdutos()`
- `frontend/views/produtos/cadastrar.view.html` ➜ Use `apiService.criarProduto()`
- `frontend/views/produtos/editar.view.html` ➜ Use `apiService.buscarProduto()` e `apiService.atualizarProduto()`

### Pedidos

- `frontend/views/pedidos/listar.view.html` ➜ Use `apiService.listarPedidos()`
- `frontend/views/pedidos/cadastrar.view.html` ➜ Use `apiService.criarPedido()`
- `frontend/views/pedidos/editar.view.html` ➜ Use `apiService.buscarPedido()` e `apiService.atualizarPedido()`
- `frontend/views/pedidos/detalhes.view.html` ➜ Use `apiService.buscarPedido()`

---

## 🛡️ Segurança: Header x-api-key

**Automático:** O `api.service.js` injeta automaticamente o header em TODAS as requisições:

```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': process.env.VITE_API_KEY
}
```

Você não precisa fazer nada especial - está tudo centralizado!

---

## ⚠️ Dicas Importantes

### 1. Variáveis de Ambiente no Frontend (Vite)

- Prefixo **obrigatório**: `VITE_`
- Acesso no código: `import.meta.env.VITE_API_KEY`
- Os arquivos `.env` **não** são sincronizados automaticamente

### 2. Módulo ES6 com `type="module"`

```html
<script type="module">
  // Usado para usar async/await e imports
</script>
```

### 3. Tratamento de Erros

```javascript
try {
  const resultado = await apiService.listarClientes();
} catch (error) {
  console.error(error); // Erro da rede ou resposta 401/404
  alert(error.message); // Mostra mensagem ao usuário
}
```

### 4. Resposta da API

Os microserviços retornam JSON direto (não precisam de `.json()`:

```javascript
const produtos = await apiService.listarProdutos(); // Já é um objeto!
// Não precisa: const data = await response.json();
```

---

## 🧪 Testando

1. Certifique-se que os 3 microserviços estão rodando:

   ```bash
   # Terminal 1
   cd ms-clientes && npm start

   # Terminal 2
   cd ms-produtos && npm start

   # Terminal 3
   cd ms-pedidos && npm start
   ```

2. Configure o `.env` do frontend com as portas corretas

3. Abra o console do navegador (F12) e veja as requisições sendo feitas

4. Se receber erro 401, verifique:
   - `VITE_API_KEY` está igual em todos os microserviços
   - O header `x-api-key` está sendo enviado (veja em Network)

---

## 📚 Referência Rápida

| Recurso  | URL Base                         |
| -------- | -------------------------------- |
| Clientes | `http://localhost:3001/clientes` |
| Produtos | `http://localhost:3002/produtos` |
| Pedidos  | `http://localhost:3003/pedidos`  |

**Exemplo de requisição completa:**

```javascript
// Listar produtos
const produtos = await window.apiService.listarProdutos();
// Requisição gerada: GET http://localhost:3002/produtos
// Headers: { 'Content-Type': 'application/json', 'x-api-key': 'xxx' }
```

---

Pronto! Seu frontend agora está pronto para funcionar com os microserviços autenticados! 🎉
