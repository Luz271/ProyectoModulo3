//comunicacion con la API PAISES

const API_URL =
  "https://juancognitus.github.io/explorador-viajes-api/paises.json";

//Export me permite exportar mi función o lo que este manejando aotros archivos js
export async function obtenerPaises() {
  try {
    //realizamos peticion HTTP

    const response = await fetch(API_URL);
    //validacion de respuesta HTTP
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    //convertimos respuesta a json
    const result = await response.json();
    console.log("Respuesta completa de la API:", result);
    //extraemos arreglo de paises
    const paises = result;
    //retornamos el resultado
    return paises;
  } catch (error) {
    //manejo de errores
    console.log("Error al obtener los paises: ", error);
    return [];
  }
}
