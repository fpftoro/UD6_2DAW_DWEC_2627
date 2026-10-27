import { describe, it, expect } from 'vitest';
import { esDocumentoValido } from '../src/validadores.js';

describe('esDocumentoValido', () => {
  it.each([['12345678Z', 'DNI válido']])('acepta %s (%s)', (documento) => {
    expect(esDocumentoValido(documento)).toBe(true);
  });

  // TODO: más casos válidos y no válidos (con su motivo) y tests del resto de funciones
});
