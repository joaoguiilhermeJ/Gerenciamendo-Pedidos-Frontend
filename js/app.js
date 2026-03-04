import "./api/api.service.js";
import "./router/router.js";
import apiService from "./api/api.service.js";

// Expor apiService globalmente para ser acessível em módulos carregados dinamicamente
window.apiService = apiService;

// Ponto de entrada do frontend. Os módulos importados já inicializam o router e o serviço.
console.log("App inicializado");
