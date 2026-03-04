const routes = [
  {
    path: "/",
    view: "/index.html",
    title: "Gerenciamento de Pedidos - Início",
    isHome: true,
  },
  {
    path: "/pedidos",
    view: "/views/pedidos/listar.view.html",
    title: "Gerenciamento de Pedidos - Pedidos",
  },
  {
    path: "/produtos",
    view: "/views/produtos/listar.view.html",
    title: "Gerenciamento de Pedidos - Produtos",
  },
  {
    path: "/clientes",
    view: "/views/clientes/listar.view.html",
    title: "Gerenciamento de Pedidos - Clientes",
  },
  {
    path: "/itens",
    view: "/views/itens/listar.view.html",
    title: "Gerenciamento de Pedidos - Itens",
  },
  {
    path: "/pedidos/cadastrar",
    view: "/views/pedidos/cadastrar.view.html",
    title: "Gerenciamento de Pedidos - Novo Pedido",
  },
  {
    path: "/produtos/cadastrar",
    view: "/views/produtos/cadastrar.view.html",
    title: "Gerenciamento de Pedidos - Novo Produto",
  },
  {
    path: "/clientes/cadastrar",
    view: "/views/clientes/cadastrar.view.html",
    title: "Gerenciamento de Pedidos - Novo Cliente",
  },
  {
    path: "/pedidos/editar/:id",
    view: "/views/pedidos/editar.view.html",
    title: "Gerenciamento de Pedidos - Editar Pedido",
  },
  {
    path: "/produtos/editar/:id",
    view: "/views/produtos/editar.view.html",
    title: "Gerenciamento de Pedidos - Editar Produto",
  },
  {
    path: "/clientes/editar/:id",
    view: "/views/clientes/editar.view.html",
    title: "Gerenciamento de Pedidos - Editar Cliente",
  },
  {
    path: "/pedidos/detalhes/:id",
    view: "/views/pedidos/detalhes.view.html",
    title: "Gerenciamento de Pedidos - Detalhes do Pedido",
  },
];

let homeContent = "";

function normalizePathname(pathname) {
  if (!pathname) return "/";
  if (pathname !== "/" && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function pathToRegex(path) {
  const pattern =
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$";
  return new RegExp(pattern);
}

function getParams(routePath, match) {
  const keys = Array.from(routePath.matchAll(/:(\w+)/g)).map((m) => m[1]);
  const values = match.slice(1);
  const params = {};
  keys.forEach((k, i) => {
    params[k] = values[i];
  });
  return params;
}

function matchRoute(pathname) {
  const clean = normalizePathname(pathname);
  for (const r of routes) {
    const re = pathToRegex(r.path);
    const match = clean.match(re);
    if (match) {
      return {
        route: r,
        params: getParams(r.path, match),
      };
    }
  }
  return null;
}

function setActiveNav(pathname) {
  const clean = normalizePathname(pathname);
  document.querySelectorAll("nav a").forEach((link) => {
    const linkHref = link.getAttribute("href") || "";
    const linkPath = normalizePathname(linkHref.split("?")[0]);
    if (
      linkPath === clean ||
      (clean.startsWith(linkPath) && linkPath !== "/")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

async function loadView(fullPath) {
  const mainContainer = document.querySelector("main");
  if (!mainContainer) return;
  const url = new URL(fullPath, window.location.origin);
  const pathname = normalizePathname(url.pathname);
  const search = url.search || "";
  const matched = matchRoute(pathname);
  if (!matched) {
    window.history.replaceState({}, "", "/");
    return loadView("/");
  }
  const { route, params } = matched;
  window.routeParams = params || {};
  window.routeQuery = Object.fromEntries(new URLSearchParams(search));
  document.title = route.title;
  setActiveNav(pathname);
  if (route.isHome) {
    if (homeContent) {
      mainContainer.innerHTML = homeContent;
      return;
    }
  }
  try {
    mainContainer.innerHTML = '<div class="loading">Carregando view...</div>';
    const response = await fetch(route.view, { cache: "no-store" });
    if (!response.ok)
      throw new Error(
        `Falha ao carregar view: ${response.status} ${response.statusText}`,
      );
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newMainContent = doc.querySelector("main");
    if (newMainContent) mainContainer.innerHTML = newMainContent.innerHTML;
    else mainContainer.innerHTML = doc.body.innerHTML;
    document
      .querySelectorAll("script[data-router-injected='1']")
      .forEach((s) => s.remove());
    const scripts = doc.querySelectorAll("script");
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      newScript.setAttribute("data-router-injected", "1");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.src) newScript.src = oldScript.src;
      else newScript.textContent = oldScript.textContent;
      document.body.appendChild(newScript);
    }
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Erro de navegação:", error);
    mainContainer.innerHTML = `<div class="error-container" style="padding:2rem;text-align:center;"><h2 style="color:var(--danger-color, red);">Ops! Algo deu errado.</h2><p>${error.message}</p></div>`;
  }
}

function navigate(path) {
  window.history.pushState({}, "", path);
  loadView(path);
}

window.navigateTo = navigate;

function convertLegacyViewToRoute(hrefNoQuery) {
  const h = normalizePathname(hrefNoQuery);
  if (h === "/index.html") return "/";
  const m = h.match(
    /^\/views\/(clientes|produtos|pedidos|itens)\/(.+)\.view\.html$/,
  );
  if (!m) return null;
  const section = m[1];
  const page = m[2];
  if (page === "listar") return `/${section}`;
  return `/${section}/${page}`;
}

document.addEventListener("click", (e) => {
  const anchor = e.target.closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href) return;
  if (
    href.startsWith("http") ||
    href.startsWith("//") ||
    anchor.getAttribute("target") === "_blank" ||
    href.startsWith("#")
  )
    return;

  const hrefNoQuery = href.split("?")[0];
  const query = href.includes("?") ? "?" + href.split("?")[1] : "";
  const normalized = normalizePathname(hrefNoQuery);

  if (matchRoute(normalized)) {
    e.preventDefault();
    return navigate(normalized + query);
  }

  const converted = convertLegacyViewToRoute(hrefNoQuery);
  if (converted && matchRoute(converted)) {
    e.preventDefault();
    return navigate(converted + query);
  }

  if (
    converted &&
    (converted.endsWith("/editar") || converted.endsWith("/detalhes"))
  ) {
    const qs = new URLSearchParams(query);
    const id = qs.get("id");
    if (id) {
      const target = `${converted}/${id}`;
      if (matchRoute(target)) {
        e.preventDefault();
        return navigate(target);
      }
    }
  }
});

window.addEventListener("popstate", () => {
  loadView(window.location.pathname + window.location.search);
});

document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector("main");
  if (mainContainer && window.location.pathname === "/")
    homeContent = mainContainer.innerHTML;
  loadView(window.location.pathname + window.location.search);
});
