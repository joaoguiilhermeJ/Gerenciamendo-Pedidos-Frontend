/**
 * SPA Router for Gerenciamento de Pedidos
 */

const routes = {
  "/": {
    view: "/index.html",
    title: "Gerenciamento de Pedidos - Início",
    isHome: true,
  },
  "/pedidos": {
    view: "/views/pedidos/listar.view.html",
    title: "Gerenciamento de Pedidos - Pedidos",
  },
  "/produtos": {
    view: "/views/produtos/listar.view.html",
    title: "Gerenciamento de Pedidos - Produtos",
  },
  "/clientes": {
    view: "/views/clientes/listar.view.html",
    title: "Gerenciamento de Pedidos - Clientes",
  },
  "/itens": {
    view: "/views/itens/listar.view.html",
    title: "Gerenciamento de Pedidos - Itens",
  },
};

let homeContent = "";

async function loadView(path) {
  const mainContainer = document.querySelector("main");
  if (!mainContainer) return;

  const url = new URL(path, window.location.origin);
  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  const route = routes[pathname];
  if (!route) return;

  document.title = route.title;

  document.querySelectorAll("nav a").forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (
      linkPath === pathname ||
      (pathname.startsWith(linkPath) && linkPath !== "/")
    )
      link.classList.add("active");
    else link.classList.remove("active");
  });

  if (route.isHome) {
    if (homeContent) {
      mainContainer.innerHTML = homeContent;
      return;
    }
  }

  try {
    mainContainer.innerHTML = '<div class="loading">Carregando view...</div>';
    const response = await fetch(route.view);
    if (!response.ok)
      throw new Error(`Falha ao carregar view: ${response.statusText}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newMainContent = doc.querySelector("main");
    if (newMainContent) mainContainer.innerHTML = newMainContent.innerHTML;
    else {
      const tempDiv = doc.createElement("div");
      tempDiv.innerHTML = doc.body.innerHTML;
      const scripts = tempDiv.querySelectorAll("script");
      scripts.forEach((s) => s.remove());
      mainContainer.innerHTML = tempDiv.innerHTML;
    }

    const scripts = doc.querySelectorAll("script");
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );
      if (oldScript.src) newScript.src = oldScript.src;
      else newScript.textContent = oldScript.textContent;
      document.body.appendChild(newScript);
    }

    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Erro de navegação:", error);
    mainContainer.innerHTML = `<div class="error-container" style="padding:2rem;text-align:center;"><h2 style="color:var(--danger-color,red);">Ops! Algo deu errado.</h2><p>${error.message}</p></div>`;
  }
}

function navigate(path) {
  window.history.pushState({}, "", path);
  loadView(path);
}

window.navigateTo = navigate;

document.addEventListener("click", (e) => {
  const anchor = e.target.closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("http") ||
    href.startsWith("//") ||
    anchor.getAttribute("target") === "_blank" ||
    href.startsWith("#")
  )
    return;

  let targetPath = href.split("?")[0];
  const queryParams = href.includes("?") ? "?" + href.split("?")[1] : "";

  if (targetPath.includes("/views/pedidos/listar.view.html"))
    targetPath = "/pedidos";
  else if (targetPath.includes("/views/produtos/listar.view.html"))
    targetPath = "/produtos";
  else if (targetPath.includes("/views/clientes/listar.view.html"))
    targetPath = "/clientes";
  else if (targetPath.includes("/views/itens/listar.view.html"))
    targetPath = "/itens";
  else if (targetPath.includes("/index.html")) targetPath = "/";

  if (routes[targetPath] || targetPath === "/") {
    e.preventDefault();
    navigate(targetPath + queryParams);
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
