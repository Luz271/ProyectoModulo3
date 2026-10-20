//Mapa integración de Leaflet
//INSTANCIA DEL MAPA
let mapaActual = null;
//destruir mapaactual
export function destruirMapa() {
  if (mapaActual) {
    mapaActual.remove();
    mapaActual = null;
  }
}

//creamos mapa
export function crearMapa(latitud, longitud, nombre) {
  //validamos coordenadas
  if (typeof latitud !== "number" || typeof longitud !== "number") {
    console.warn("coordenadas no disponibles");
    const contenedor = document.querySelector("#destination-map");
    if (contenedor) {
      contenedor.innerHTML = /*html*/ `
      <div
      class="
      h-full
      flex
      items-center
      justify-center
      text-slate-500
      bg-slate-100
      "
      >
      Ubicación no disponible
      </div>
      `;
    }
    return;
  }
  //eliminar mapa anterior
  destruirMapa();
  //Inicializar Leaflet
  mapaActual = L.map("destination-map").setView([latitud, longitud], 4);

  //agregamos capa de OPENSTREETMAP
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapaActual);

  //agregar marcador
  L.marker([latitud, longitud])
    .addTo(mapaActual)
    .bindPopup(`<strong>${nombre}</strong>`)
    .openPopup();
}
