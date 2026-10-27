/**
 * Formulario de inscripción en varios pasos.
 *
 * HTML necesario: el formulario `#inscripcion` con `novalidate`, cuatro pasos `.paso[data-paso]`
 * (los tres primeros, `fieldset`; el cuarto, el resumen), cada uno con un título `.titulo-paso`
 * enfocable (`tabindex="-1"`), los botones `#anterior` y `#siguiente`,
 * `#estado`, la lista `#progreso`, el resumen de errores `#resumen-errores`, `#confirmacion` y la
 * plantilla `#plantilla-contacto`. Cada campo tiene un `<p class="error">` con el id `<id>-error`
 * (los botones de opción, `<name>-error`) asociado con `aria-describedby`; los que tienen reglas
 * propias llevan `data-validar` con el nombre de su validador.
 *
 * Estado: `hidden` en los pasos no actuales; `aria-current="step"` en el paso de `#progreso`;
 * `aria-invalid` y `data-tocado` en los campos; `data-enviando` y `aria-busy` en el formulario
 * durante el envío.
 *
 * Eventos que escucha, todos en el formulario (delegación) salvo los enlaces del resumen de errores:
 * `submit` (avanza o envía), `click` (anterior, editar, añadir y quitar contactos), `input`
 * (reglas propias, revalidación, provincia, fuerza de la contraseña), `change` (alojamiento) y
 * `focusout` (primera validación de cada campo).
 *
 * @module formulario
 */

import {
  VALIDADORES,
  normalizarDocumento,
  normalizarTelefono,
  requisitosClave,
  edad,
} from './validadores.js';
import { PROVINCIAS } from './provincias.js';

/** Número de pasos, con el resumen. */
const PASOS = 4;
/** Contactos de emergencia: mínimo y máximo. */
const CONTACTOS = { minimo: 1, maximo: 2 };
/** Precio del alojamiento por noche, en euros. */
const PRECIO_NOCHE = 25;

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

/**
 * Se lanza en el formulario cada vez que cambia el paso.
 * @event module:formulario#pasocambiado
 * @type {CustomEvent}
 * @property {{ paso: number, anterior: number }} detail
 */

/**
 * @typedef {object} Contacto
 * @property {string} nombre
 * @property {string} telefono Normalizado: `'612 345 678'`.
 */

/**
 * @typedef {object} Inscripcion
 * @property {string} nombre
 * @property {string} apellidos
 * @property {string} documento Normalizado: `'X1234567L'`.
 * @property {string} nacimiento `AAAA-MM-DD`.
 * @property {string} correo
 * @property {string} telefono Normalizado: `'612 345 678'`.
 * @property {string} curso
 * @property {string} turno
 * @property {string} cp
 * @property {string} provincia
 * @property {?{ noches: number }} alojamiento `null` si no lo necesita.
 * @property {Contacto[]} contactos
 * @property {string} usuario
 * @property {string} clave
 * @property {number} total Precio total en euros.
 */

/**
 * @callback FuncionEnvio
 * @param {Inscripcion} datos
 * @param {function(?string, ?string): void} alTerminar Recibe `(error, numero)`.
 */

/**
 * Inicia el formulario de inscripción.
 * @param {HTMLFormElement} formulario
 * @param {{ enviar: FuncionEnvio }} opciones `enviar` manda los datos al servidor (en la página,
 *   `simularInscripcion`; en los tests, un espía).
 * @returns {{ paso: number }} Un objeto con el _getter_ `paso`: el paso actual (del 1 al 4).
 * @fires module:formulario#pasocambiado
 * @listens submit
 * @listens click
 * @listens input
 * @listens change
 * @listens focusout
 */
export function iniciarInscripcion(formulario, { enviar }) {
  // TODO
}
