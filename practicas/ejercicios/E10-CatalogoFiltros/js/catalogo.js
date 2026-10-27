/**
 * Catálogo filtrable.
 *
 * HTML necesario: el formulario de filtros con los campos `q`, `categoria`, `max` (con su
 * `<output id="precio-valor">`), `stock`, `etiqueta` (casillas) y `orden`; la lista de productos;
 * `#contador`, `#sin-resultados` y la plantilla `#plantilla-producto`.
 *
 * Eventos: un oyente de `input` en el formulario (delegación): el buscador filtra con rebote y el
 * resto de campos, al momento. `submit` (Intro en el buscador) filtra al momento sin recargar y
 * `reset` vuelve a mostrar todo. Los filtros se guardan en la URL (`history.replaceState`) y se
 * recuperan de ella al cargar.
 *
 * @module catalogo
 */

import { leerFiltros, filtrarProductos, trocearCoincidencias } from './filtro.js';
import { debounce } from './tiempo.js';

/** @import { Producto } from './productos.js' */

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const ETIQUETAS = {
  ecologico: 'Ecológico',
  'sin-gluten': 'Sin gluten',
  vegano: 'Vegano',
  artesano: 'Artesano',
};
const CATEGORIAS = {
  aceite: 'Aceite',
  dulces: 'Dulces',
  conservas: 'Conservas',
  bebidas: 'Bebidas',
};

/**
 * Rellena el formulario con los parámetros de una URL (por ejemplo, `location.search`).
 * Los campos que no aparecen se quedan como están, salvo las casillas, que se desmarcan.
 * @param {HTMLFormElement} formulario
 * @param {string} busqueda `'?q=aceite&etiqueta=vegano'`.
 */
export function aplicarParametros(formulario, busqueda) {
  // TODO
}

/**
 * Inicia el catálogo.
 * @param {HTMLFormElement} formulario
 * @param {HTMLUListElement} lista
 * @param {Producto[]} productos
 * @param {object} [opciones]
 * @param {number} [opciones.espera=250] Milisegundos de rebote del buscador.
 * @returns {{ actualizar: function(): void, visibles: Array<number> }} `visibles` es un _getter_ con los
 *   `id` de los productos mostrados, en orden.
 * @listens input
 * @listens submit
 * @listens reset
 */
export function iniciarCatalogo(formulario, lista, productos, { espera = 250 } = {}) {
  // TODO
}
