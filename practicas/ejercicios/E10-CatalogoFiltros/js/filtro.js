/**
 * Funciones puras del catálogo: leer los filtros, filtrar y ordenar los productos y preparar el
 * resaltado de las coincidencias. No usan el DOM.
 * @module filtro
 */

/** @import { Producto } from './productos.js' */

/**
 * @typedef {object} Filtros
 * @property {string} texto Lo escrito en el buscador, sin espacios en los extremos.
 * @property {string} categoria `''` para todas.
 * @property {number} precioMaximo
 * @property {boolean} soloEnStock
 * @property {string[]} etiquetas Todas tienen que estar en el producto.
 * @property {string} orden `'relevancia'`, `'precio-asc'`, `'precio-desc'` o `'nombre'`.
 */

/**
 * @typedef {object} Trozo
 * @property {string} texto
 * @property {boolean} coincide Si este trozo coincide con alguna palabra buscada.
 */

/**
 * Prepara un texto para comparar: sin tildes, en minúsculas y sin espacios en los extremos.
 * @param {string} texto
 * @returns {string}
 * @example
 * normalizar('  Café ÚBEDA '); // 'cafe ubeda'
 */
export function normalizar(texto) {
  // TODO
}

/**
 * Lee los filtros de los datos del formulario.
 * @param {FormData} datos Campos `q`, `categoria`, `max`, `stock`, `etiqueta` (varios) y `orden`.
 * @returns {Filtros}
 */
export function leerFiltros(datos) {
  // TODO
}

/**
 * Filtra y ordena los productos. Cada palabra del texto tiene que aparecer en el nombre o en la
 * descripción, sin distinguir mayúsculas ni tildes. No modifica el array recibido.
 * @param {Producto[]} productos
 * @param {Filtros} filtros
 * @returns {Producto[]} Un array nuevo; con `'relevancia'`, en el orden original.
 */
export function filtrarProductos(productos, filtros) {
  // TODO
}

/**
 * Divide un texto en trozos que coinciden o no con las palabras buscadas, para resaltarlas.
 * Busca sin distinguir mayúsculas ni tildes («cafe» resalta «Café») y escapa las palabras, así que
 * una búsqueda como «C++» no rompe la expresión regular. Unir los trozos devuelve el texto original.
 * @param {string} texto
 * @param {string} busqueda
 * @returns {Trozo[]}
 * @example
 * trocearCoincidencias('Café de Granada', 'cafe');
 * // [{ texto: 'Café', coincide: true }, { texto: ' de Granada', coincide: false }]
 */
export function trocearCoincidencias(texto, busqueda) {
  // TODO
}
