//buscar paises por nombre

export function buscarPaises(paises, texto) {
  const textonormalizado = texto.trim().toLowerCase();

  if (!textonormalizado) {
    return paises;
  }

  return paises.filter((pais) => {
    // Leemos la propiedad name y cca3 de la API

    const nombre = (pais.names?.common ?? "").toLowerCase();

    const codigo = (pais.cca3 ?? "").toLowerCase();

    return (
      nombre.includes(textonormalizado) || codigo.includes(textonormalizado)
    );
  });
}

//filtramos por continente

export function filtrarPorContinente(paises, continente) {
  if (continente === "all") {
    return paises;
  }

  //ahora filtramos por región

  return paises.filter((pais) => pais.region === continente);
}

//ordenamos paises

export function ordenarPaises(paises, criterio) {
  const paisesOrdenados = [...paises];

  //ordenamos de A-Z

  if (criterio === "az") {
    return paisesOrdenados.sort((a, b) => {
      const nombreA = a.names?.common ?? "";

      const nombreB = b.names?.common ?? "";

      return nombreA.localeCompare(nombreB);
    });
  }

  //agregamos orden de Z-A

  if (criterio === "za") {
    return paisesOrdenados.sort((a, b) => {
      const nombreA = a.names?.common ?? "";

      const nombreB = b.names?.common ?? "";

      return nombreB.localeCompare(nombreA);
    });
  }

  return paisesOrdenados;
}

//procesar paises

export function procesarPaises(paises, texto, continente, criterioOrden) {
  let resultado = buscarPaises(paises, texto);

  resultado = filtrarPorContinente(resultado, continente);

  resultado = ordenarPaises(resultado, criterioOrden);

  return resultado;
}
