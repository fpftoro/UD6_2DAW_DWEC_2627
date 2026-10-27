import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { iniciarCarrusel } from '../js/carrusel.js';

describe('iniciarCarrusel', () => {
  let contenedor;
  let carrusel;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <section class="carrusel" id="destacados" aria-label="Destacados">
        <ul class="diapositivas">
          <li><h2>Granada</h2></li>
          <li><h2>Cádiz</h2></li>
        </ul>
      </section>`;
    contenedor = document.querySelector('#destacados');
    carrusel = iniciarCarrusel(contenedor, { intervalo: 1000 });
  });

  afterEach(() => {
    carrusel.destruir();
    vi.useRealTimers();
  });

  it('muestra solo la primera diapositiva', () => {
    const visibles = [...contenedor.querySelectorAll('.diapositivas > li')].map((li) => !li.hidden);
    expect(visibles).toEqual([true, false]);
  });

  // TODO: el resto de tests del enunciado
});
