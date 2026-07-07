// ============================================================
// scripts.js - Proyecto Integrador: StreamFlix
// Nombre: Juan Manuel Sanchez Castro
// Matrícula: 2403230435
// Grupo: 06IDPRMA
// ============================================================
//Esto garantiza que el JS no intenta buscar elementos del DOM antes de que el HTML termine de cargar.
document.addEventListener("DOMContentLoaded", function () {
// -----------------------------------------------------------------------
// Configuración: URL base del backend de FastAPI
// -----------------------------------------------------------------------
const API_URL = "http://127.0.0.1:8000";

// -----------------------------------------------------------------------
// Credenciales estáticas (hardcoded) — Sesión 15
// En una aplicación real, esto vendría de un endpoint de autenticación.
// -----------------------------------------------------------------------
const CREDENCIALES = {
    usuario: "admin",
    contrasenia: "12345"
};

// ============================================================
// FUNCIONES DE UTILIDAD
// ============================================================

/**
 * Muestra el modal de error con un mensaje personalizado.
 * Reutiliza la lógica implementada en la sesión 14/15.
 * @param {string} mensaje - Descripción del error.
 */
function mostrarModalError(mensaje) {
    const modalElement = document.getElementById("modalError");
    const modal = new bootstrap.Modal(modalElement);
    document.getElementById("modalErrorBody").textContent = mensaje;
    modal.show();
}

/**
 * Valida que los campos del login no estén vacíos.
 * @returns {boolean} true si ambos campos tienen contenido.
 */
function validarCamposLogin() {
    const usuario     = document.getElementById("inputUsuario").value.trim();
    const contrasenia = document.getElementById("inputContrasenia").value.trim();

    if (usuario === "") {
        mostrarModalError('El campo "Usuario" es obligatorio. Por favor, ingrésalo.');
        return false;
    }
    if (contrasenia === "") {
        mostrarModalError('El campo "Contraseña" es obligatorio. Por favor, ingrésala.');
        return false;
    }
    return true;
}

/**
 * Limpia los campos del formulario de login al cerrar sesión.
 */
function limpiarCamposLogin() {
    document.getElementById("inputUsuario").value = "";
    document.getElementById("inputContrasenia").value = "";
    document.getElementById("mensajeCredenciales").style.display = "none";
}

// ============================================================
// MANIPULACIÓN DEL DOM: CONTROL DE PANTALLAS (SPA)
// ============================================================

/**
 * Transición: oculta el Login y muestra la Aplicación Principal.
 * Dispara la carga del catálogo desde la API.
 */
function mostrarAplicacionPrincipal() {
    document.getElementById("contenedorLogin").style.display = "none";
    document.getElementById("contenedorApp").style.display = "block";
    cargarCatalogo(); // Consume la API al entrar a la app
}

/**
 * Transición: oculta la App y regresa al Login.
 * Limpia los campos por seguridad.
 */
function mostrarLogin() {
    document.getElementById("contenedorApp").style.display = "none";
    document.getElementById("contenedorLogin").style.display = "block";
    limpiarCamposLogin();
}

// ============================================================
// INTEGRACIÓN CON LA API: fetch() asíncrono
// ============================================================

/**
 * Genera el HTML de una tarjeta de película para inyectar con innerHTML.
 * @param {Object} pelicula - Objeto película proveniente del JSON de la API.
 * @returns {string} Cadena HTML de la tarjeta.
 */
function crearTarjetaPelicula(pelicula) {
    return `
        <div class="col-6 col-md-4 col-lg-2">
            <div class="tarjeta-contenido">
                <img src="${pelicula.imagen}" alt="${pelicula.titulo}">
                <div class="tarjeta-cuerpo">
                    <p class="tarjeta-titulo">${pelicula.titulo}</p>
                    <p class="tarjeta-meta">${pelicula.genero} · ${pelicula.anio}</p>
                    <p class="tarjeta-descripcion">${pelicula.descripcion}</p>
                    <span class="badge-calificacion">⭐ ${pelicula.calificacion}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Genera el HTML de una tarjeta de serie para inyectar con innerHTML.
 * @param {Object} serie - Objeto serie proveniente del JSON de la API.
 * @returns {string} Cadena HTML de la tarjeta.
 */
function crearTarjetaSerie(serie) {
    return `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="tarjeta-contenido">
                <img src="${serie.imagen}" alt="${serie.titulo}">
                <div class="tarjeta-cuerpo">
                    <p class="tarjeta-titulo">${serie.titulo}</p>
                    <p class="tarjeta-meta">${serie.genero} · ${serie.temporadas} temporada(s)</p>
                    <p class="tarjeta-descripcion">${serie.descripcion}</p>
                    <span class="badge-calificacion">⭐ ${serie.calificacion}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Hace una petición GET a /api/catalogo y renderiza el contenido en el DOM.
 * Usa fetch() con async/await para el consumo asíncrono del backend.
 */
async function cargarCatalogo() {
    // Mostrar indicador de carga
    document.getElementById("estadoCarga").style.display = "block";
    document.getElementById("errorConexion").style.display = "none";

    try {
        // Petición GET al endpoint del backend (FastAPI)
        const respuesta = await fetch(`${API_URL}/api/catalogo`);
        const datos = await respuesta.json();

        // Ocultamos el spinner una vez que llegan los datos
        document.getElementById("estadoCarga").style.display = "none";

        // ---- Renderizar películas usando innerHTML ----
        // Usamos un array y .map() para generar el HTML de cada tarjeta,
        // luego .join("") para convertirlo en una sola cadena e inyectarla.
        const gridPeliculas = document.getElementById("gridPeliculas");
        const peliculasHTML = datos.peliculas.map(p => crearTarjetaPelicula(p)).join("");
        gridPeliculas.innerHTML = peliculasHTML;

        // ---- Renderizar series usando innerHTML ----
        const gridSeries = document.getElementById("gridSeries");
        const seriesHTML = datos.series.map(s => crearTarjetaSerie(s)).join("");
        gridSeries.innerHTML = seriesHTML;

    } catch (error) {
        // Si el backend no está corriendo, mostramos el mensaje de error
        document.getElementById("estadoCarga").style.display = "none";
        document.getElementById("errorConexion").style.display = "block";
        console.error("Error al conectar con la API:", error);
    }
}

// ============================================================
// FILTRO DE SECCIONES POR NAVEGACIÓN
// ============================================================

/**
 * Muestra u oculta las secciones de películas y series
 * según el botón de navegación activo.
 * @param {string} seccion - "todos" | "peliculas" | "series"
 */
function filtrarSeccion(seccion) {
    const secPeliculas = document.getElementById("seccionPeliculas");
    const secSeries    = document.getElementById("seccionSeries");

    if (seccion === "peliculas") {
        secPeliculas.style.display = "block";
        secSeries.style.display   = "none";
    } else if (seccion === "series") {
        secPeliculas.style.display = "none";
        secSeries.style.display   = "block";
    } else {
        // "todos" — muestra ambas secciones
        secPeliculas.style.display = "block";
        secSeries.style.display   = "block";
    }
}

// ============================================================
// EVENTOS
// ============================================================

// ---- Botón Login ----
document.getElementById("btnLogin").addEventListener("click", function () {
    // 1. Validar campos vacíos
    if (!validarCamposLogin()) return;

    const usuario     = document.getElementById("inputUsuario").value.trim();
    const contrasenia = document.getElementById("inputContrasenia").value.trim();

    // 2. Validar credenciales estáticas
    const credencialesCorrectas =
        usuario === CREDENCIALES.usuario && contrasenia === CREDENCIALES.contrasenia;

    if (!credencialesCorrectas) {
        document.getElementById("mensajeCredenciales").style.display = "block";
        return;
    }

    // 3. Credenciales correctas: mostrar aplicación
    document.getElementById("mensajeCredenciales").style.display = "none";
    mostrarAplicacionPrincipal();
});

// ---- Botón Logout ----
document.getElementById("btnLogout").addEventListener("click", function () {
    mostrarLogin();
});

// ---- Botones de navegación (filtro de secciones) ----
document.querySelectorAll(".btn-nav").forEach(function (boton) {
    boton.addEventListener("click", function () {
        // Marcar el botón activo
        document.querySelectorAll(".btn-nav").forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        // Filtrar sección según el atributo data-seccion
        const seccion = this.getAttribute("data-seccion");
        filtrarSeccion(seccion);
    });
});

});