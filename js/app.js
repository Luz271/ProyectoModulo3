//vO.0.1
//console.log('conexion exitosa')
//referencias del DOM
const destinationsContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");

//inicializamos la app
//convertimos init() en una función asincrona
async function init() {
  console.log("Explorador de Viajes iniciado");
}

//iniciar app
init();
//vO.0.2
// importaciones
import { obtenerPaises } from "./api/countriesApi.js";

//estado de aplicación
let paises = [];

const initialMessage = document.querySelector("#initial-message");
initialMessage.innerHTML = /*html*/ `
<!--Agregamos estado de carga-->
<div class= "text-5xl mb-4">
    🌎  
</div>

<h3
    class= "
    text-xl
    font-semibold
    text-slate-800
    mb-2
    "
    >
    cargando destinos...
</h3>

<p class = "text-slate-500">
    Estamos consultando información
    de países alrededor del mundo
</p>
`;
//obtener paises
paises = await obtenerPaises();
//COMPROBAMOS RESULTADOS
console.log("paises obtenidos", paises);
//ACTUALIZAR CONTADOR
resultsCount.textContent = `${paises.length} destinos`;
//mostrar resultado de la carga
if (paises.length > 0) {
  initialMessage.innerHTML = /*html*/ `
    <div class= "text-5xl mb-4">
    ✅   
    </div>
    <h3
        class = "
        text-xl 
        font-semibold
        text-slate-800
        mb-2
        "
    >
    Destinos Cargados
    </h3>

    <p class = "text-slate-500">
        Se obtuvieron ${paises.length}
        destinos correctamente.
    </p>
    `;
} else {
  initialMessage.innerHTML = /*html*/ `
    <div class= "text-5xl mb-4">
        ⚠️ 
    </div>

    <h3
        class= "
            text-xl
            font-semibold
            text-slate-800
            mb-2
            "
    >
    No fue posible cargar los destinos
    </h3>

    <p class = "text-slate-500">
        verifica tu conexión e intenta
        nuevamente. 
    </p>
    `;
}
