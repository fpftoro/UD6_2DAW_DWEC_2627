// E11 · Inscripción en los cursos de verano: inicia el formulario (no se modifica)
import { iniciarInscripcion } from './formulario.js';
import { simularInscripcion } from './servidor.js';

iniciarInscripcion(document.querySelector('#inscripcion'), { enviar: simularInscripcion });

// El formulario avisa de cada cambio de paso con un evento propio
document.addEventListener('pasocambiado', (evento) => {
  document.title = `Paso ${evento.detail.paso} de 4 · Inscripción`;
});
