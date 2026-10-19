//importaciones
import { obtenerPaises } from "./api/countriesApi.js";
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
} from "./ui/ui.js";
import { procesarPaises } from "./utils/filters.js";

//console.log('conexion exitosa')
//referencias del DOM
const destinationsContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#search-input");
const continenteFilter = document.querySelector("#continent-filter");
const sortFilter = document.querySelector("#sort-filter");

//aplicamos filtros
function aplicarFiltros() {
  //obtenemos valores seleccionados
  const texto = searchInput.value;
  const continente = continenteFilter.value;
  const criterioOrden = sortFilter.value;
  const resultados = procesarPaises(paises, texto, continente, criterioOrden);
  renderPaises(resultados, destinationsContainer);
  actualizarContador(resultados.length, resultsCount);
}
//registrar eventos
function registrarEventos() {
  searchInput.addEventListener("input", aplicarFiltros);
  continenteFilter.addEventListener("change", aplicarFiltros);
  sortFilter.addEventListener("change", aplicarFiltros);
}
//inicializamos la app
let paises = [];

//convertimos init() en una función asincrona
async function init() {
  console.log("Explorador de Viajes iniciado");

  //mostrar resultado de la carga
  mostrarCargando(destinationsContainer);

  //obtener paises desde la api
  paises = await obtenerPaises();

  //comprobar si se obtuvo datos
  if (paises.length === 0) {
    mostrarError(destinationsContainer);
    actualizarContador(0, resultsCount);
    return;
  }

  //remplazamos el render y actualizarContador por la siguiente instrucción:
  aplicarFiltros();
  //registrar eventos
  registrarEventos();

  //COMPROBAMOS RESULTADOS
  console.log("paises obtenidos", paises);

  //ACTUALIZAR CONTADOR
  resultsCount.textContent = `${paises.length} destinos`;
}

//iniciar app
init();
