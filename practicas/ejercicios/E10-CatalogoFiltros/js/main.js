// E10 · Catálogo de productos andaluces: inicia el catálogo (no se modifica)
import { PRODUCTOS } from './productos.js';
import { iniciarCatalogo } from './catalogo.js';

iniciarCatalogo(
  document.querySelector('#filtros'),
  document.querySelector('#productos'),
  PRODUCTOS,
);
