/**
 * Validadores y utilidades de texto con expresiones regulares.
 * @module validadores
 */

/** Letras de control del DNI y del NIE: la del resto de dividir el número entre 23. */
const LETRAS_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';

/**
 * Comprueba un DNI o un NIE: el formato y la letra de control.
 * Admite minúsculas, espacios y guiones: se quitan antes de comprobar.
 * @param {string} documento
 * @returns {boolean}
 * @example
 * esDocumentoValido('12345678Z'); // true
 * esDocumentoValido('x-1234567-l'); // true
 * esDocumentoValido('12345678A'); // false (letra incorrecta)
 */
export function esDocumentoValido(documento) {
  // TODO
}

/**
 * Comprueba un código postal español: cinco cifras y provincia del 01 al 52.
 * @param {string} codigo
 * @returns {boolean}
 * @example
 * esCodigoPostal('41001'); // true
 * esCodigoPostal('53001'); // false (no hay provincia 53)
 */
export function esCodigoPostal(codigo) {
  // TODO
}

/**
 * Normaliza un teléfono español de nueve cifras que empieza por 6, 7, 8 o 9.
 * Admite el prefijo +34 o 0034 y espacios, guiones o puntos como separadores.
 * @param {string} telefono
 * @returns {string | null} El teléfono con el formato `612 345 678`, o `null` si no es válido.
 * @example
 * normalizarTelefono('+34 612-34-56-78'); // '612 345 678'
 * normalizarTelefono('512345678'); // null
 */
export function normalizarTelefono(telefono) {
  // TODO
}

/**
 * Comprueba una matrícula española actual: cuatro cifras y tres consonantes (sin Ñ ni Q).
 * Admite minúsculas y un espacio o un guion entre las cifras y las letras.
 * @param {string} matricula
 * @returns {boolean}
 * @example
 * esMatricula('1234 bcd'); // true
 * esMatricula('1234ABC'); // false (la A es vocal)
 */
export function esMatricula(matricula) {
  // TODO
}

/**
 * Extrae los hashtags de un texto, en minúsculas, sin repetir y en el orden en que aparecen.
 * Un hashtag es `#` seguido de letras (de cualquier idioma), cifras o `_`, y no puede ir pegado
 * a una palabra (en `dwec#2` no hay hashtag).
 * @param {string} texto
 * @returns {string[]}
 * @example
 * extraerHashtags('Repasando #DWEC y #Eventos… ¡#dwec mola!'); // ['#dwec', '#eventos']
 */
export function extraerHashtags(texto) {
  // TODO
}

/**
 * Oculta la parte del usuario de un correo: deja la primera letra y cambia el resto por asteriscos.
 * @param {string} correo
 * @returns {string | null} El correo oculto, o `null` si no tiene la forma `usuario@dominio.ext`.
 * @example
 * ocultarCorreo('ana.garcia@ejemplo.es'); // 'a*********@ejemplo.es'
 */
export function ocultarCorreo(correo) {
  // TODO
}
