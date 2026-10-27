/**
 * Validadores de la inscripción: funciones puras, sin DOM, que reciben texto.
 *
 * | Validador | Acepta | Rechaza |
 * |-----------|--------|---------|
 * | `esDocumentoValido` | `12345678Z`, `x-1234567-l` | `12345678A` (letra), `1234567Z` (cifras), `W1234567L` (inicial) |
 * | `esCodigoPostal` | `01001`, `52080` | `00100`, `53001`, `4100` |
 * | `normalizarTelefono` | `+34 612 34 56 78`, `958-123-456` | `512345678`, `61234567` |
 * | `esCorreo` | `ana@ejemplo.es` | `ana@`, `ana@ejemplo`, `ana garcia@ejemplo.es` |
 * | `esUsuario` | `ana_33`, `luis` | `33ana`, `Ana`, `an`, `ana-33` |
 *
 * @module validadores
 */

/** Letras de control: la del resto de dividir el número entre 23. */
const LETRAS_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';

/** Edad mínima para inscribirse. */
export const EDAD_MINIMA = 16;

/**
 * Quita espacios y guiones de un DNI o NIE y lo pasa a mayúsculas.
 * @param {string} documento
 * @returns {string}
 * @example
 * normalizarDocumento(' x-1234567-l '); // 'X1234567L'
 */
export function normalizarDocumento(documento) {
  // TODO
}

/**
 * Comprueba un DNI (8 cifras y letra) o un NIE (X, Y o Z, 7 cifras y letra), con la letra de control.
 * @param {string} documento Admite minúsculas, espacios y guiones.
 * @returns {boolean}
 * @example
 * esDocumentoValido('12345678Z'); // true
 * esDocumentoValido('12345678A'); // false
 */
export function esDocumentoValido(documento) {
  // TODO
}

/**
 * Comprueba un código postal español: cinco cifras con provincia del 01 al 52.
 * @param {string} codigo
 * @returns {boolean}
 * @example
 * esCodigoPostal('41001'); // true
 */
export function esCodigoPostal(codigo) {
  // TODO
}

/**
 * Normaliza un teléfono español de nueve cifras que empieza por 6, 7, 8 o 9. Admite el prefijo
 * +34 o 0034 y espacios, guiones o puntos.
 * @param {string} telefono
 * @returns {string | null} `'612 345 678'`, o `null` si no es válido.
 * @example
 * normalizarTelefono('+34 612-34-56-78'); // '612 345 678'
 */
export function normalizarTelefono(telefono) {
  // TODO
}

/**
 * Comprueba la forma de un correo: algo sin espacios, @, algo, punto y al menos dos caracteres.
 * @param {string} correo
 * @returns {boolean}
 * @example
 * esCorreo('ana@ejemplo.es'); // true
 */
export function esCorreo(correo) {
  // TODO
}

/**
 * Comprueba un nombre de usuario: de 3 a 16 minúsculas, cifras o `_`, empezando por una letra.
 * @param {string} usuario
 * @returns {boolean}
 * @example
 * esUsuario('ana_33'); // true
 */
export function esUsuario(usuario) {
  // TODO
}

/**
 * @typedef {object} RequisitosClave
 * @property {boolean} longitud 8 caracteres o más.
 * @property {boolean} minuscula
 * @property {boolean} mayuscula
 * @property {boolean} cifra
 */

/**
 * Comprueba cada requisito de la contraseña por separado, para poder decir cuál falta.
 * @param {string} clave
 * @returns {RequisitosClave}
 * @example
 * requisitosClave('abc'); // { longitud: false, minuscula: true, mayuscula: false, cifra: false }
 */
export function requisitosClave(clave) {
  // TODO
}

/**
 * Edad cumplida en una fecha.
 * @param {string} fecha Fecha de nacimiento con el formato de un campo date: `AAAA-MM-DD`.
 * @param {Date} [hoy]
 * @returns {number}
 * @example
 * edad('2000-05-20', new Date(2026, 4, 19)); // 25
 */
export function edad(fecha, hoy = new Date()) {
  // TODO
}

const NOMBRES_REQUISITOS = {
  longitud: '8 caracteres',
  minuscula: 'una minúscula',
  mayuscula: 'una mayúscula',
  cifra: 'una cifra',
};

/**
 * @callback Validador
 * @param {string} valor El valor del campo (no vacío: si está vacío, lo decide `required`).
 * @returns {string} El mensaje de error, o `''` si es válido.
 */

/**
 * Validadores de los campos, por el valor de su atributo `data-validar`.
 * @type {Object<string, Validador>}
 */
export const VALIDADORES = {
  // TODO: documento, edad, correo, telefono, codigoPostal, usuario y clave
};
