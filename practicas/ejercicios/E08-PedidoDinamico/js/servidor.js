let ultimoNumero = 0;

/**
 * Simula el envío del pedido al servidor: tras un segundo y medio, llama a `alTerminar` con el
 * número de pedido. En la UD7 se sustituirá por una petición `fetch`.
 * @param {object} pedido Los datos del pedido.
 * @param {function(string): void} alTerminar Recibe el número de pedido, por ejemplo `'PED-0001'`.
 */
export function simularEnvio(pedido, alTerminar) {
  ultimoNumero++;
  const numero = `PED-${String(ultimoNumero).padStart(4, '0')}`;
  console.log('📤 Enviando al servidor:', pedido);
  setTimeout(() => alTerminar(numero), 1500);
}
