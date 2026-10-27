/**
 * Carrusel accesible.
 *
 * HTML necesario: un contenedor con `id` y, dentro, una `<ul class="diapositivas">` con un `<li>`
 * por diapositiva. Sin JavaScript, las diapositivas se ven una debajo de otra (mejora progresiva).
 *
 * Al iniciarse: añade la clase `con-carrusel` y `aria-roledescription="carrusel"` al contenedor,
 * convierte cada `<li>` en un grupo (`role="group"`, `aria-roledescription="diapositiva"`,
 * `aria-label="2 de 5"`), deja visible solo la actual (`hidden` en el resto) y crea los controles:
 * botones anterior, pausa y siguiente, un indicador por diapositiva y una región que anuncia la
 * diapositiva actual.
 *
 * Eventos que escucha (todos con la misma `AbortSignal`, que `destruir()` aborta):
 * - `click` en el contenedor (delegación): botones con `data-accion` e indicadores con `data-indice`.
 * - `keydown` en el contenedor: flechas izquierda y derecha.
 * - `pointerdown`, `pointerup` y `pointercancel` en la lista: deslizar 50 px o más cambia de diapositiva.
 * - `mouseenter`/`mouseleave` y `focusin`/`focusout` en el contenedor: pausan el paso automático
 *   mientras el puntero o el foco están dentro.
 * - `visibilitychange` en `document`: pausa el paso automático con la pestaña oculta.
 *
 * @module carrusel
 * @example
 * const carrusel = iniciarCarrusel(document.querySelector('#destacados'), { intervalo: 4000 });
 * carrusel.ir(2);
 * carrusel.actual; // 2
 */

/** Distancia mínima en píxeles para que un deslizamiento cambie de diapositiva. */
const UMBRAL_DESLIZAMIENTO = 50;

/**
 * Se lanza en el contenedor cuando cambia la diapositiva actual.
 * @event module:carrusel#diapositivacambiada
 * @type {CustomEvent}
 * @property {{ indice: number, total: number, origen: string }} detail `origen` es `'boton'`,
 *   `'indicador'`, `'teclado'`, `'deslizamiento'`, `'automatico'` o `'codigo'`.
 */

/**
 * @typedef {object} Carrusel
 * @property {function(number): void} ir Va a una diapositiva (los índices fuera de rango dan la vuelta).
 * @property {function(): void} siguiente
 * @property {function(): void} anterior
 * @property {function(): void} pausar Pausa el paso automático hasta que se llame a `reanudar`.
 * @property {function(): void} reanudar
 * @property {function(): void} destruir Quita los oyentes, el temporizador y los controles, y deja el HTML como estaba.
 * @property {number} actual Índice de la diapositiva actual (solo lectura).
 * @property {boolean} pausado Si el paso automático está detenido ahora (solo lectura).
 */

/**
 * Inicia un carrusel.
 *
 * @param {HTMLElement} contenedor
 * @param {object} [opciones]
 * @param {number} [opciones.intervalo=5000] Milisegundos entre diapositivas en el paso automático.
 * @param {boolean} [opciones.automatico=true] Si pasa de diapositiva solo.
 * @returns {Carrusel}
 * @throws {Error} Si el contenedor no tiene `id` o no tiene diapositivas.
 * @listens click
 * @listens keydown
 * @listens pointerdown
 * @listens pointerup
 * @listens visibilitychange
 * @fires module:carrusel#diapositivacambiada
 */
export function iniciarCarrusel(contenedor, { intervalo = 5000, automatico = true } = {}) {
  // TODO
}
