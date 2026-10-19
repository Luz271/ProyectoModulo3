//INTERFAZ DE USUARIO Funciones encargadas de actualizar el DOM
//mostrar esatdo de carga

export function mostrarCargando(contenedor) {
  contenedor.innerHTML = /*html*/ `
    <!--Agregamos estado de carga-->
    <div 
        class= "
        col-span-full
        bg-white
        border
        border-dashed
        border-slate-300
        rounded-xl
        p-12
        text-center" >
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
    
    </div>
    `;
}

//mostrar error
export function mostrarError(error) {
  error.innerHTML = /*html*/ `
    <div class= "
        col-span-full
        bg-red-50
        border
        border-red-200
        p-12
        text-center
        ">
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
</div>
    `;
}

//actualizar contador
export function actualizarContador(total, elementoContador) {
  elementoContador.textContent = `${total} destinos`;
}

//renderizar destinos
export function renderPaises(paises, contenedor) {
  if (paises.length === 0) {
    contenedor.innerHTML = /*html*/ `
    <div
        class="
        col-span-full
        bg-white
        border
        border-dashed
        border-slate-300
        rounded-xl
        p-12
        text-center
        "
        >
        <div class="text-5xl mb-4">
        🔎
        </div>
        <h3
        class="
        text-xl
        font-semibold
        text-slate-800
        mb-2
        "
        >
        No encontramos destinos
        </h3>
        <p class="text-slate-500">
        Intenta cambiar los criterios
        de búsqueda.
        </p>
        </div>
        `;
    return;
  }
  const tarjetas = paises
    .map((pais) => {
      const nombre =
        pais.name?.common ?? pais.names?.common ?? "Nombre no disponible";
      const region = pais.region ?? "Región no disponible";
      const población = pais.population ?? 0;
      const bandera = pais.flags?.png ?? pais.flag?.url_png ?? "";
      const codigo = pais.cca3 ?? pais.codes?.alpha_3 ?? "";
      const poblacionFormateada = población.toLocaleString("es-MX");

      return /*html*/ `
            <article 
                class = "
                    bg-white

                rounded-xl
                border
                border-slate-200
                overflow-hidden
                shadow-sm
                hover:shadow-md
                transition
                "
                >
        <!--BANDERA-->
        <div
            class= "
                h-48
                bg-slate-100
                overflow-hidden
            "
            >
            <img
                src="${bandera}"
                alt="Bandera de ${nombre}"
                class= "
                    w-full
                    h-full
                    object-cover
                "
            >
         </div>
        <!--Información del destino-->
        <div class= "p-5">
            <div
                class= "
                    flex
                    items-star
                    justify-between
            gap-4
            mb-4
            "
            >
            <div>
                <h3
                    class= "
                        text-xl
                        font-bold
                        text-slate-900
                    "
                >
                  ${nombre}
                </h3>

                <p class= "text-sm text-slate-500">
                    ${region}
                </p>
            </div>

        <!--Población-->
        <div class ="mb-5">
            <p class = "text-xs text-slate-500">
                Población
            </p>
            <p class= "
                text-lg
                font-semibold
                text-slate-800
                "
            >
             ${poblacionFormateada}
            </p>
         </div>

        <!--Acciones-->
        <div class= "flex gap-3">

            <button
                type = "button"
                data-action = "detail"
                data-country-code = "${codigo}"
                class = "
                    flex-1
                    px-4
                    py-2
                    bg-blue-600
                    text-white
                    rounded-lg
                    font-medium
                    cursor-pointer
                    hover:bg-blue-700
                    transition
                    "
                >
                Ver más
             </button>

             <button 
                type= "button"
                data-action= "favorite"
                data-country-code= "${codigo}"
                arial-label= "Agregar ${nombre} a favoritos"
                class= "
                    px-4
                    py-2
                    border
                    border-slate-300
                    text-slate-600
                    rounder-lg
                    cursor-pointer
                    hover:bg-slate-100
                    transition
                    "
                >
                ♡
              </button>
       </div>
           </div>
             </article>
            `;
    })
    .join("");
  contenedor.innerHTML = tarjetas;
}
