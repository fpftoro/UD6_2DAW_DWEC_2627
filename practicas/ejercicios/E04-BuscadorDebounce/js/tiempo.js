/**
 * Devuelve una versión de `funcion` que solo se ejecuta cuando han pasado `espera` ms sin llamadas,
 * con los argumentos de la última llamada. La función devuelta tiene un método `cancelar()` que
 * descarta la llamada pendiente.
 * @param {function(...*): void} funcion
 * @param {number} espera Milisegundos.
 * @returns {function(...*): void} La función con rebote, con su método `cancelar`.
 */
export function debounce(funcion, espera) {
  // TODO
}

/**
 * Devuelve una versión de `funcion` que se ejecuta como mucho una vez cada `intervalo` ms.
 * Si llegan llamadas durante la espera, hace una llamada final con los últimos argumentos,
 * para no perder el último estado (por ejemplo, el final del desplazamiento).
 * @param {function(...*): void} funcion
 * @param {number} intervalo Milisegundos.
 * @returns {function(...*): void}
 */
export function throttle(funcion, intervalo) {
  // TODO
}
