import { describe, it, expect } from 'vitest';
import { esDocumentoValido } from '../js/validadores.js';

describe('esDocumentoValido', () => {
  it.each([['12345678Z', 'DNI']])('acepta %s (%s)', (documento) => {
    expect(esDocumentoValido(documento)).toBe(true);
  });

  // TODO: el resto de tests del enunciado (validadores.test.js y formulario.test.js)
});
