let ultimo = 0;

/**
 * Simula el envío de la inscripción al servidor. Tras un segundo y medio llama a `alTerminar`:
 * con un error si ya hay una inscripción con ese documento (para probar, el `00000000T`) o con el
 * número de inscripción si todo va bien. En la UD7 se sustituirá por una petición `fetch`.
 * @param {object} datos Los datos de la inscripción.
 * @param {function(?string, ?string): void} alTerminar Recibe `(error, numero)`: uno de los dos es `null`.
 */
export function simularInscripcion(datos, alTerminar) {
  setTimeout(() => {
    if (datos.documento === '00000000T') {
      alTerminar('Ya hay una inscripción con ese documento.', null);
      return;
    }
    ultimo++;
    alTerminar(null, `INS-${String(ultimo).padStart(4, '0')}`);
  }, 1500);
}
