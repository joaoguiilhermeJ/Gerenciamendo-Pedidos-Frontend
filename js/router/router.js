/**
 * SPA Router for Gerenciamento de Pedidos
 */

const routes = {
  "/": {
    view: "/index.html",
    title: "Gerenciamento de Pedidos - Início",
    isHome: true,
  },

  // LISTAGENS
  "/pedidos": { view: "/views/pedidos/listar.view.html", title: "Pedidos" },
  "/produtos": { view: "/views/produtos/listar.view.html", title: "Produtos" },
  "/clientes": { view: "/views/clientes/listar.view.html", title: "Clientes" },
  "/itens": { view: "/views/itens/listar.view.html", title: "Itens" },

  // CADASTROS
  "/pedidos/cadastrar": { view: "/views/pedidos/cadastrar.view.html", title: "Cadastrar Pedido" },
  "/produtos/cadastrar": { view: "/views/produtos/cadastrar.view.html", title: "Cadastrar Produto" },
  "/clientes/cadastrar": { view: "/views/clientes/cadastrar.view.html", title: "Cadastrar Cliente" },

  // EDIÇÕES
  "/pedidos/editar": { view: "/views/pedidos/editar.view.html", title: "Editar Pedido" },
  "/produtos/editar": { view: "/views/produtos/editar.view.html", title: "Editar Produto" },
  "/clientes/editar": { view: "/views/clientes/editar.view.html", title: "Editar Cliente" },

  // DETALHES
  "/pedidos/detalhes": { view: "/views/pedidos/detalhes.view.html", title: "Detalhes do Pedido" },
}

let homeContent = ""

function normalizePath(input) {
  const url = new URL(input, window.location.origin)
  let pathname = url.pathname
  if (pathname.length > 1) pathname = pathname.replace(/\/$/, "")
  return pathname
}

async function loadView(path) {
  const mainContainer = document.querySelector("main")
  if (!mainContainer) return

  const pathname = normalizePath(path)
  const route = routes[pathname]

  if (!route) {
    // Se rota não existir, manda pra home (sem deixar travado em estado estranho)
    window.history.replaceState({}, "", "/")
    return loadView("/")
  }

  document.title = route.title

  document.querySelectorAll("nav a").forEach((link) => {
    const linkPath = normalizePath(link.getAttribute("href") || "/")
    if (linkPath === pathname || (pathname.startsWith(linkPath) && linkPath !== "/")) link.classList.add("active")
    else link.classList.remove("active")
  })

  if (route.isHome && homeContent) {
    mainContainer.innerHTML = homeContent
    return
  }

  try {
    mainContainer.innerHTML = '<div class="loading">Carregando...</div>'

    const response = await fetch(route.view, { cache: "no-store" })
    if (!response.ok) throw new Error(`Falha ao carregar view (${response.status})`)

    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const newMain = doc.querySelector("main")
    if (newMain) mainContainer.innerHTML = newMain.innerHTML
    else mainContainer.innerHTML = doc.body.innerHTML

    // Reexecuta scripts da view
    const scripts = doc.querySelectorAll("script")
    scripts.forEach((oldScript) => {
      const s = document.createElement("script")
      Array.from(oldScript.attributes).forEach((attr) => s.setAttribute(attr.name, attr.value))
      if (oldScript.src) s.src = oldScript.src
      else s.textContent = oldScript.textContent
      document.body.appendChild(s)
    })

    window.scrollTo(0, 0)
  } catch (err) {
    console.error(err)
    mainContainer.innerHTML = `
      <div style="padding:2rem;text-align:center">
        <h2 style="color:red">Erro ao navegar</h2>
        <p>${err.message}</p>
      </div>
    `
  }
}

function navigate(path) {
  window.history.pushState({}, "", path)
  loadView(path)
}

window.navigateTo = navigate

document.addEventListener("click", (e) => {
  const a = e.target.closest("a")
  if (!a) return

  const href = a.getAttribute("href")
  if (!href || href.startsWith("http") || href.startsWith("//") || a.target === "_blank" || href.startsWith("#")) return

  const targetPath = normalizePath(href)

  if (routes[targetPath]) {
    e.preventDefault()
    navigate(targetPath + (href.includes("?") ? "?" + href.split("?")[1] : ""))
  }
})

window.addEventListener("popstate", () => loadView(window.location.pathname + window.location.search))

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main")
  if (main && normalizePath("/") === normalizePath(window.location.pathname)) homeContent = main.innerHTML
  loadView(window.location.pathname + window.location.search)
})