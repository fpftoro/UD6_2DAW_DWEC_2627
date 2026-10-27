import { describe, it, expect } from 'vitest';
import { normalizar } from '../js/filtro.js';

describe('normalizar', () => {
  it('quita las tildes, pasa a minúsculas y quita los espacios de los extremos', () => {
    expect(normalizar('  Café ÚBEDA ')).toBe('cafe ubeda');
  });

  // TODO: el resto de tests del enunciado (filtro.test.js y catalogo.test.js)
});
