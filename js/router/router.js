/**
 * SPA Router for Gerenciamento de Pedidos
 */

const routes = {
  "/": {
    view: "/index.html",
    title: "Gerenciamento de Pedidos - Início",
    isHome: true,
  },

  "/clientes": {
    view: "/views/clientes/listar.view.html",
    title: "Gerenciamento de Pedidos - Clientes",
  },
  "/clientes/cadastrar": {
    view: "/views/clientes/cadastrar.view.html",
    title: "Gerenciamento de Pedidos - Cadastrar Cliente",
  },
  "/clientes/editar": {
    view: "/views/clientes/editar.view.html",
    title: "Gerenciamento de Pedidos - Editar Cliente",
  },

  "/produtos": {
    view: "/views/produtos/listar.view.html",
    title: "Gerenciamento de Pedidos - Produtos",
  },
  "/produtos/cadastrar": {
    view: "/views/produtos/cadastrar.view.html",
    title: "Gerenciamento de Pedidos - Cadastrar Produto",
  },
  "/produtos/editar": {
    view: "/views/produtos/editar.view.html",
    title: "Gerenciamento de Pedidos - Editar Produto",
  },

  "/pedidos": {
    view: "/views/pedidos/listar.view.html",
    title: "Gerenciamento de Pedidos - Pedidos",
  },
  "/pedidos/cadastrar": {
    view: "/views/pedidos/cadastrar.view.html",
    title: "Gerenciamento de Pedidos - Cadastrar Pedido",
  },
  "/pedidos/editar": {
    view: "/views/pedidos/editar.view.html",
    title: "Gerenciamento de Pedidos - Editar Pedido",
  },
  "/pedidos/detalhes": {
    view: "/views/pedidos/detalhes.view.html",
    title: "Gerenciamento de Pedidos - Detalhes do Pedido",
  },

  "/itens": {
    view: "/views/itens/listar.view.html",
    title: "Gerenciamento de Pedidos - Itens",
  },
}

let homeContent = ""

function normalizePath(inputPath) {
  const url = new URL(inputPath, window.location.origin)
  let pathname = url.pathname || "/"
  if (pathname.length > 1) pathname = pathname.replace(/\/$/, "")

  if (pathname.includes("/views/clientes/listar.view.html")) pathname = "/clientes"
  if (pathname.includes("/views/clientes/cadastrar.view.html")) pathname = "/clientes/cadastrar"
  if (pathname.includes("/views/clientes/editar.view.html")) pathname = "/clientes/editar"

  if (pathname.includes("/views/produtos/listar.view.html")) pathname = "/produtos"
  if (pathname.includes("/views/produtos/cadastrar.view.html")) pathname = "/produtos/cadastrar"
  if (pathname.includes("/views/produtos/editar.view.html")) pathname = "/produtos/editar"

  if (pathname.includes("/views/pedidos/listar.view.html")) pathname = "/pedidos"
  if (pathname.includes("/views/pedidos/cadastrar.view.html")) pathname = "/pedidos/cadastrar"
  if (pathname.includes("/views/pedidos/editar.view.html")) pathname = "/pedidos/editar"
  if (pathname.includes("/views/pedidos/detalhes.view.html")) pathname = "/pedidos/detalhes"

  if (pathname.includes("/views/itens/listar.view.html")) pathname = "/itens"
  if (pathname.includes("/index.html")) pathname = "/"

  return pathname + (url.search || "")
}

async function loadView(path) {
  const mainContainer = document.querySelector("main")
  if (!mainContainer) return

  const normalized = normalizePath(path)
  const url = new URL(normalized, window.location.origin)
  const pathname = url.pathname
  const route = routes[pathname]

  if (!route) {
    window.history.replaceState({}, "", "/")
    return loadView("/")
  }

  document.title = route.title

  document.querySelectorAll("nav a").forEach((link) => {
    const linkPath = normalizePath(link.getAttribute("href") || "/")
    const linkUrl = new URL(linkPath, window.location.origin)
    const lp = linkUrl.pathname
    if (lp === pathname || (pathname.startsWith(lp) && lp !== "/")) link.classList.add("active")
    else link.classList.remove("active")
  })

  if (route.isHome) {
    if (homeContent) {
      mainContainer.innerHTML = homeContent
      return
    }
  }

  try {
    mainContainer.innerHTML = '<div class="loading">Carregando view...</div>'

    const response = await fetch(route.view, { cache: "no-store" })
    if (!response.ok) throw new Error(`Falha ao carregar view: ${response.status} ${response.statusText}`)

    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const newMainContent = doc.querySelector("main")
    if (newMainContent) {
      mainContainer.innerHTML = newMainContent.innerHTML
    } else {
      const tempDiv = doc.createElement("div")
      tempDiv.innerHTML = doc.body.innerHTML
      const scripts = tempDiv.querySelectorAll("script")
      scripts.forEach((s) => s.remove())
      mainContainer.innerHTML = tempDiv.innerHTML
    }

    const scripts = doc.querySelectorAll("script")
    for (const oldScript of scripts) {
      const newScript = document.createElement("script")
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value))
      if (oldScript.src) newScript.src = oldScript.src
      else newScript.textContent = oldScript.textContent
      document.body.appendChild(newScript)
    }

    window.scrollTo(0, 0)
  } catch (error) {
    console.error("Erro de navegação:", error)
    mainContainer.innerHTML = `<div class="error-container" style="padding:2rem;text-align:center;"><h2 style="color:var(--danger-color,red);">Ops! Algo deu errado.</h2><p>${error.message}</p></div>`
  }
}

function navigate(path) {
  const normalized = normalizePath(path)
  window.history.pushState({}, "", normalized)
  loadView(normalized)
}

window.navigateTo = navigate

document.addEventListener("click", (e) => {
  const anchor = e.target.closest("a")
  if (!anchor) return

  const href = anchor.getAttribute("href")
  if (!href) return
  if (href.startsWith("http") || href.startsWith("//")) return
  if (anchor.getAttribute("target") === "_blank") return
  if (href.startsWith("#")) return
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return

  const normalized = normalizePath(href)
  const url = new URL(normalized, window.location.origin)
  const pathname = url.pathname

  if (routes[pathname] || pathname === "/") {
    e.preventDefault()
    navigate(normalized)
  }
})

window.addEventListener("popstate", () => {
  loadView(window.location.pathname + window.location.search)
})

document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector("main")
  if (mainContainer && window.location.pathname === "/") homeContent = mainContainer.innerHTML
  loadView(window.location.pathname + window.location.search)
})