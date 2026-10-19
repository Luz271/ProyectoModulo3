//importaciones
import { obtenerPaises } from "./api/countriesApi.js";
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
} from "./ui/ui.js";

//console.log('conexion exitosa')
//referencias del DOM
const destinationsContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");

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

  //renderizamos paises
  renderPaises(paises, destinationsContainer);

  //actualizar contador
  actualizarContador(paises.length, resultsCount);

  //COMPROBAMOS RESULTADOS
  console.log("paises obtenidos", paises);

  //ACTUALIZAR CONTADOR
  resultsCount.textContent = `${paises.length} destinos`;
}

//iniciar app
init();
