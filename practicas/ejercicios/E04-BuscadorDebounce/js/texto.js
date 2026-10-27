/**
 * Prepara un texto para comparar: sin tildes ni diéresis, en minúsculas y sin espacios en los extremos.
 * Usa una expresión regular (tema 6): `\p{Diacritic}` son las marcas que separa `normalize('NFD')`.
 * @param {string} texto
 * @returns {string}
 * @example
 * normalizar(' Úbeda '); // 'ubeda'
 */
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}
