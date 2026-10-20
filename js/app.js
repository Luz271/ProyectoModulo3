//importaciones
import { obtenerPaises } from "./api/countriesApi.js";
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
  mostrarDetalle,
  cerrarDetalle,
  mostrarFavoritosVacios,
} from "./ui/ui.js";
import { procesarPaises } from "./utils/filters.js";
import { crearMapa, destruirMapa } from "./ui/mapUI.js";
import {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
  esFavorito,
} from "./Services/favoritesService.js";

//referencias del DOM
const destinationsContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#search-input");
const continenteFilter = document.querySelector("#continent-filter");
const sortFilter = document.querySelector("#sort-filter");
const detailModal = document.querySelector("#detail-modal");
const detailModalContent = document.querySelector("#detail-modal-content");
const btnExplorar = document.querySelector("#btn-explorar");
const btnFavoritos = document.querySelector("#btn-favoritos");
const sectionTitle = document.querySelector("#section-title");
const searchForm = document.querySelector("#search-form");

//buscar paises por codigo
function obtenerPaisesPorCodigo(codigo) {
  return paises.find((pais) => (pais.codes?.alpha_3 ?? pais.cca3) === codigo);
}

//actualizar navegación
function actualizarNavegacion() {
  const clasesActivas = ["bg-blue-600", "text-white"];
  const clasesInactivas = [
    "bg-white",
    "text-slate-700",
    "border",
    "border-slate-300",
  ];
  if (vistaActual === "explorar") {
    btnExplorar.className = `
      px-4
      py-2
      bg-blue-600
      text-white
      rounded-lg
      font-medium
      cursor-pointer
      hover:bg-blue-700
      transition
      `;
    btnFavoritos.className = `
      px-4
      py-2
      bg-white
      text-slate-700
      border
      border-slate-300
      rounded-lg
      font-medium
      cursor-pointer
      hover:bg-slate-100
      transition
      `;
  } else {
    btnExplorar.className = `
      px-4
      py-2
      bg-white
      text-slate-700
      border
      border-slate-300
       rounded-lg
       font-medium
        cursor-pointer
        hover:bg-slate-100
        transition
        `;
    btnFavoritos.className = `
        px-4
        py-2
        bg-blue-600
        text-white
        rounded-lg
        font-medium
        cursor-pointer
        hover:bg-blue-700
        transition
        `;
  }
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
  if (vistaActual !== "explorar") {
    return;
  }
  //obtenemos valores seleccionados
  const texto = searchInput.value;
  const continente = continenteFilter.value;
  const criterioOrden = sortFilter.value;
  const resultados = procesarPaises(paises, texto, continente, criterioOrden);
  //obtener favoritos actuales
  const favoritos = obtenerFavoritos();
  renderPaises(resultados, destinationsContainer, "explorar", favoritos);
  actualizarContador(resultados.length, resultsCount);
}

//mostrar vista explorar
function mostrarExplorar() {
  vistaActual = "explorar";
  sectionTitle.textContent = "Destinos";
  searchForm.classList.remove("hidden");
  actualizarNavegacion();
  aplicarFiltros();
}
//mostrar favoritos
function mostrarFavoritos() {
  vistaActual = "favoritos";
  sectionTitle.textContent = "Mis favoritos";
  searchForm.classList.add("hidden");
  actualizarNavegacion();
  const favoritos = obtenerFavoritos();
  if (favoritos.length === 0) {
    mostrarFavoritosVacios(destinationsContainer);
    actualizarContador(0, resultsCount);
    return;
  }
  renderPaises(favoritos, destinationsContainer, "favoritos");
  actualizarContador(favoritos.length, resultsCount);
}
//agregar destino a favoritos
function manejarAgregarFavorito(codigo) {
  //busacmos el pais
  const pais = obtenerPaisesPorCodigo(codigo);
  //validamos
  if (!pais) {
    return;
  }
  //comprobamos si ya estaba guardado
  if (esFavorito(codigo)) {
    Swal.fire({
      icon: "info",
      title: "Ya está en favoritos",
      text: "Este destino ya había sido guardado.",
    });
    return;
  }
  //guardar favorito y mostrar confirmación
  const agregado = agregarFavorito(pais);
  if (agregado) {
    Swal.fire({
      icon: "success",
      title: "Destino guardado",
      text: `${pais.names?.common ?? "El destino"} fue agregado a favoritos.`,
      timer: 1800,
      showConfirmButton: false,
    });
  }
  //actualizar tarjetas
  aplicarFiltros();
}
//Eliminar destino de favoritos
async function manejarEliminarFavorito(codigo) {
  const pais = obtenerPaisesPorCodigo(codigo);

  if (!pais) {
    return;
  }
  //agragmos confirmación con SeetAlert2
  const resultado = await Swal.fire({
    icon: "warning",
    title: "Eliminar favorito",
    text: `¿Deseas eliminar ${pais.names?.common ?? "este destino"} de tus
favoritos?`,
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
  });
  if (!resultado.isConfirmed) {
    return;
  }
  eliminarFavorito(codigo);
  //actualizamos vista
  mostrarFavoritos();

  Swal.fire({
    icon: "success",
    title: "Favorito eliminado",
    timer: 1500,
    showConfirmButton: false,
  });
}

//registrar eventos
function registrarEventos() {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  searchInput.addEventListener("input", aplicarFiltros);
  continenteFilter.addEventListener("change", aplicarFiltros);
  sortFilter.addEventListener("change", aplicarFiltros);

  // Navegación principal
  btnExplorar.addEventListener("click", mostrarExplorar);
  btnFavoritos.addEventListener("click", mostrarFavoritos);

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
    if (accion === "favorite") {
      manejarAgregarFavorito(codigo);
    }
    if (accion === "remove-favorite") {
      manejarEliminarFavorito(codigo);
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

//estado de la vista actual
let vistaActual = "explorar";

//convertimos init() en una función asincrona
async function init() {
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
  //actualizar navegación
  actualizarNavegacion();
  //registrar eventos
  registrarEventos();

  //ACTUALIZAR CONTADOR
  resultsCount.textContent = `${paises.length} destinos`;
}

//iniciar app
init();
