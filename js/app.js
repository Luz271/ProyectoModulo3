//importaciones
import { obtenerPaises } from "./api/countriesApi.js";
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
  mostrarDetalle,
  cerrarDetalle,
} from "./ui/ui.js";
import { procesarPaises } from "./utils/filters.js";
import { crearMapa, destruirMapa } from "./ui/mapUI.js";

//console.log('conexion exitosa')
//referencias del DOM
const destinationsContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#search-input");
const continenteFilter = document.querySelector("#continent-filter");
const sortFilter = document.querySelector("#sort-filter");
const detailModal = document.querySelector("#detail-modal");
const detailModalContent = document.querySelector("#detail-modal-content");

//busacr paises por codigo
function obtenerPaisesPorCodigo(codigo) {
  return paises.find((pais) => (pais.codes?.alpha_3 ?? pais.cca3) === codigo);
}
//creamos la función de abrir detalle
function abrirDetalle(codigo) {
  const pais = obtenerPaisesPorCodigo(codigo);
  if (!pais) {
    console.warn("Pais no encontrado");
    return;
  }
  //mostrar detalle
  const datosMapa = mostrarDetalle(pais, detailModal, detailModalContent);
  //creamos el mapa de destino
  setTimeout(() => {
    crearMapa(datosMapa.latitud, datosMapa.longitud, datosMapa.nombre);
  }, 0);
}
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
  //acciones de las tarjetas
  destinationsContainer.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-action]");
    if (!boton) {
      return;
    }
    const accion = boton.dataset.action;
    const codigo = boton.dataset.countryCode;

    if (accion === "detail") {
      abrirDetalle(codigo);
    }
  });

  //cerrar modal de detalle
  function cerrarModalDetalle() {
    destruirMapa();
    cerrarDetalle(detailModal, detailModalContent);
  }
  //cerrar modal
  detailModal.addEventListener("click", (event) => {
    if (event.target.id === "btn-close-detail") {
      cerrarModalDetalle();
    }
    if (event.target === detailModal) {
      cerrarModalDetalle();
    }
  });
  //cerrar con escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !detailModal.classList.contains("hidden")) {
      cerrarModalDetalle();
    }
  });
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
