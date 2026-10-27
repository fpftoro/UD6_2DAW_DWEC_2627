// E09 · Escapadas por Andalucía: inicia el carrusel y escucha su evento (no se modifica)
import { iniciarCarrusel } from './carrusel.js';

const registro = document.querySelector('#registro');

iniciarCarrusel(document.querySelector('#destacados'), { intervalo: 4000 });

// El carrusel avisa de sus cambios con un evento propio, que sube hasta document
document.addEventListener('diapositivacambiada', (evento) => {
  const { indice, total, origen } = evento.detail;
  registro.textContent = `Diapositiva ${indice + 1} de ${total} (${origen})`;
});
