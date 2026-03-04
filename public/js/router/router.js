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
  "/pedidos/cadastrar": {
    view: "/views/pedidos/cadastrar.view.html",
    title: "Cadastrar Pedido",
  },
  "/produtos/cadastrar": {
    view: "/views/produtos/cadastrar.view.html",
    title: "Cadastrar Produto",
  },
  "/clientes/cadastrar": {
    view: "/views/clientes/cadastrar.view.html",
    title: "Cadastrar Cliente",
  },

  // EDIÇÕES (com possivel parâmetro id)
  "/pedidos/:id/editar": {
    view: "/views/pedidos/editar.view.html",
    title: "Editar Pedido",
  },
  "/produtos/editar": {
    view: "/views/produtos/editar.view.html",
    title: "Editar Produto",
  },
  "/clientes/:id/editar": {
    view: "/views/clientes/editar.view.html",
    title: "Editar Cliente",
  },

  // DETALHES
  "/pedidos/:id": {
    view: "/views/pedidos/detalhes.view.html",
    title: "Detalhes do Pedido",
  },
  // legacy-friendly route
  "/pedidos/detalhes": {
    view: "/views/pedidos/detalhes.view.html",
    title: "Detalhes do Pedido",
  },
};

let homeContent = "";

function normalizePath(input) {
  const url = new URL(input, window.location.origin);
  let pathname = url.pathname;
  if (pathname.length > 1) pathname = pathname.replace(/\/$/, "");
  return pathname;
}

// find matching route key, supporting simple ":param" segments
function matchRoute(pathname) {
  if (routes[pathname]) return pathname;
  const pathSeg = pathname.split("/").filter(Boolean);
  for (const routeKey in routes) {
    const routeSeg = routeKey.split("/").filter(Boolean);
    if (routeSeg.length !== pathSeg.length) continue;
    let ok = true;
    for (let i = 0; i < routeSeg.length; i++) {
      if (routeSeg[i].startsWith(":")) continue;
      if (routeSeg[i] !== pathSeg[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return routeKey;
  }
  return null;
}

// given a view path like "/views/clientes/cadastrar.view.html" return the
// corresponding route key (e.g. "/clientes/cadastrar"). useful for
// converting legacy hrefs that reference the file directly.
function findRouteByViewPath(viewPath) {
  for (const [key, r] of Object.entries(routes)) {
    if (normalizePath(r.view) === viewPath) return key;
  }
  return null;
}

async function loadView(path) {
  const mainContainer = document.querySelector("main");
  if (!mainContainer) return;

  const pathname = normalizePath(path);
  const routeKey = matchRoute(pathname);

  if (!routeKey) {
    // rota inexistente -> mensagem amigável
    document.title = "Rota não encontrada";
    mainContainer.innerHTML = `<div style="padding:2rem;text-align:center">
        <h2 style="color:red">Rota não encontrada</h2>
        <p>Não há conteúdo para <strong>${pathname}</strong></p>
      </div>`;
    return;
  }

  const route = routes[routeKey];
  document.title = route.title;

  document.querySelectorAll("nav a").forEach((link) => {
    const linkPath = normalizePath(link.getAttribute("href") || "/");
    if (
      linkPath === pathname ||
      (pathname.startsWith(linkPath) && linkPath !== "/")
    )
      link.classList.add("active");
    else link.classList.remove("active");
  });

  if (route.isHome && homeContent) {
    mainContainer.innerHTML = homeContent;
    return;
  }

  try {
    mainContainer.innerHTML = '<div class="loading">Carregando...</div>';

    const response = await fetch(route.view, { cache: "no-store" });
    if (!response.ok)
      throw new Error(`Falha ao carregar view (${response.status})`);

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const newMain = doc.querySelector("main");
    if (newMain) mainContainer.innerHTML = newMain.innerHTML;
    else mainContainer.innerHTML = doc.body.innerHTML;

    // Reexecuta scripts da view
    const scripts = doc.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const s = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        s.setAttribute(attr.name, attr.value),
      );
      if (oldScript.src) s.src = oldScript.src;
      else s.textContent = oldScript.textContent;
      document.body.appendChild(s);
    });

    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err);
    mainContainer.innerHTML = `
      <div style="padding:2rem;text-align:center">
        <h2 style="color:red">Erro ao navegar</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
}

function navigate(path) {
  window.history.pushState({}, "", path);
  loadView(path);
}

window.navigateTo = navigate;

document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href");
  if (
    !href ||
    href.startsWith("http") ||
    href.startsWith("//") ||
    a.target === "_blank" ||
    href.startsWith("#")
  )
    return;

  const [raw, qs] = href.split("?");
  const targetPath = normalizePath(raw);

  // try to find a matching route (includes dynamic patterns)
  let routeKey = matchRoute(targetPath);

  // if no route and user clicked on a view file path, map it
  if (!routeKey && targetPath.startsWith("/views/")) {
    routeKey = findRouteByViewPath(targetPath);
  }

  if (routeKey) {
    e.preventDefault();
    const finalPath =
      (targetPath.startsWith("/views/") ? routeKey : targetPath) +
      (qs ? "?" + qs : "");
    navigate(finalPath);
  }
});

window.addEventListener("popstate", () =>
  loadView(window.location.pathname + window.location.search),
);

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (main && normalizePath("/") === normalizePath(window.location.pathname))
    homeContent = main.innerHTML;
  loadView(window.location.pathname + window.location.search);
});
