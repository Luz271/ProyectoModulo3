//servicio de favoritos
//Manejo de favoritos con LocalStorage
//Clave de LocalStorage

const FAVORITES_KEY = "explorador_viajes_favoritos";

//obtener favoritos
export function obtenerFavoritos() {
  const favoritosGuardados = localStorage.getItem(FAVORITES_KEY);
  if (!favoritosGuardados) {
    return [];
  }
  //converir JSON almacenado a javaScript
  try {
    return JSON.parse(favoritosGuardados);
  } catch (error) {
    console.error("Error al leer favoritos", error);
    return [];
  }
}

//guardar favoritos
function guardarFavoritos(favoritos) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
}

//verificar favorito
export function esFavorito(codigo) {
  const favoritos = obtenerFavoritos();
  return favoritos.some((pais) => pais.codes?.alpha_3 === codigo);
}

//Agregar Favorito
export function agregarFavorito(pais) {
  const favoritos = obtenerFavoritos();
  const codigo = pais.codes?.alpha_3;
  //validamos
  if (!codigo) {
    return false;
  }

  const yaExiste = favoritos.some(
    (favorito) => favorito.codes?.alpha_3 === codigo,
  );
  if (yaExiste) {
    return false;
  }
  favoritos.push(pais);
  guardarFavoritos(favoritos);
  return true;
}

//Eliminar favoritos
export function eliminarFavorito(codigo) {
  const favoritos = obtenerFavoritos();
  const favoritosActualizados = favoritos.filter(
    (pais) => pais.codes?.alpha_3 !== codigo,
  );
  guardarFavoritos(favoritosActualizados);
  return favoritosActualizados;
}
