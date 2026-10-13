console.log('conexion exitosa')
//referencias del DOM
const destinationsContainer = document.querySelector("#destinations-Container")
const resultsCount = document.querySelector("#results-count")

//inicializamos la app
function init(){
    console.log('Explorador de Viajes iniciado')
    resultsCount.textContent = `0 destinos`
}