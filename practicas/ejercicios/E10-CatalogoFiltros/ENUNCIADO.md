# E10 · Catálogo filtrable

**Tipo:** corrección por IA

Programa el **formulario de filtros** de un catálogo de productos: un buscador que espera a que el usuario deje de escribir y resalta lo encontrado con **expresiones regulares**, filtros de categoría, precio, stock y etiquetas que se aplican al momento, un orden, y los filtros guardados en la **URL** para poder compartir el enlace. Con tests de las funciones puras y del formulario en happy-dom y pruebas de extremo a extremo en Chromium con Playwright.

**CE:** RA5 c, d, e, g, h

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/`. Como los ejercicios de la UD2 con dependencias de npm, **construye su imagen** con el `Dockerfile` de esa carpeta, a partir de la imagen oficial de Node.js de **Docker Hub**, `node:24-bookworm` (UD2, tema 9, apartado 9.3.2). Además, el `Dockerfile` instala el navegador Chromium de Playwright con las librerías del sistema que necesita, así que no tienes que descargarlo tú. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda bastante más que en otros ejercicios, porque descarga la imagen, la construye y descarga el navegador. Al crearse, el contenedor ejecuta `npm install`: cuando se abre, las dependencias ya están instaladas.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3610) y abre <http://localhost:3610> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3610 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3610 .`.

Ejecuta los tests, las pruebas de extremo a extremo, ESLint y Prettier en la terminal de VS Code, que ya es la del contenedor. `npm run e2e` aprovecha el servidor de la página que ya está en marcha.

## Punto de partida

```text
├── package.json · vitest.config.js   ← scripts test, e2e, lint, format y format:check (Vitest con happy-dom, sin la carpeta e2e/)
├── playwright.config.js  ← carpeta e2e/, servidor de la página y Chromium (no se modifica)
├── index.html          ← formulario #filtros, #contador, #productos, #sin-resultados y la plantilla (no se modifica)
├── estilos.css         ← estilos de las tarjetas, .agotado y mark (no se modifica)
├── js/
│   ├── main.js         ← inicia el catálogo (no se modifica)
│   ├── productos.js    ← veinte productos (no se modifica)
│   ├── tiempo.js       ← debounce con cancelar() (no se modifica)
│   ├── filtro.js       ← cuatro funciones puras, con su JSDoc, sin programar
│   └── catalogo.js     ← aplicarParametros e iniciarCatalogo, con su JSDoc, sin programar
├── tests/
│   └── filtro.test.js  ← un primer test
├── e2e/
│   └── catalogo.spec.js  ← una primera prueba de extremo a extremo
└── README.md           ← plantilla de entrega
```

## Requisitos

**Funciones puras** (`js/filtro.js`), sin DOM:

1. `normalizar(texto)`: sin tildes ni diéresis (`normalize('NFD')` y una expresión regular con `\p{Diacritic}`), en minúsculas y sin espacios en los extremos.
2. `leerFiltros(datos)`: convierte el `FormData` del formulario en el objeto `Filtros` del JSDoc (`has` para la casilla de stock y `getAll` para las etiquetas).
3. `filtrarProductos(productos, filtros)`: cada **palabra** del texto (troceado por espacios con una expresión regular) tiene que aparecer en el nombre o la descripción, sin distinguir mayúsculas ni tildes; además, la categoría (si no es `''`), el precio máximo, el stock y **todas** las etiquetas elegidas. Ordena según `orden` (con `'relevancia'`, el orden original) y no modifica el array recibido.
4. `trocearCoincidencias(texto, busqueda)`: divide el texto en trozos `{ texto, coincide }` que, unidos, dan el texto original, marcando las apariciones de cada palabra buscada sin distinguir mayúsculas ni tildes («cafe» marca «Café»). Construye **una** expresión regular con las palabras **escapadas** (`RegExp.escape`, con una alternativa si el navegador no lo tiene) y recorre las coincidencias con `matchAll`. Si una palabra contiene a otra, gana la más larga.

**El catálogo** (`js/catalogo.js`):

5. `iniciarCatalogo(formulario, lista, productos, { espera = 250 } = {})` pinta los productos que cumplen los filtros clonando la plantilla: nombre y descripción con las coincidencias dentro de `<mark>` (creados con el DOM, sin `innerHTML`), precio con formato de euros, categoría, etiquetas y la clase `agotado` si no hay stock. Actualiza `#contador` (`2 productos`, `1 producto`), muestra `#sin-resultados` si no hay ninguno y escribe `Hasta 12 €` en `#precio-valor`.
6. **Un oyente de `input` en el formulario**: si el cambio viene del buscador (`q`), filtra con `debounce`; si viene de otro campo, cancela la búsqueda pendiente y filtra al momento.
7. `submit` (Intro en el buscador) filtra al momento sin recargar; `reset` vuelve a mostrar todo (cuidado: los campos se restablecen **después** del evento).
8. Tras cada actualización, la URL refleja los campos con un valor **distinto del inicial** (`URLSearchParams` y `history.replaceState`): `?categoria=dulces&etiqueta=vegano`. Al iniciar, `aplicarParametros(formulario, location.search)` rellena el formulario desde la URL. Ten en cuenta que algunos navegadores recuerdan los valores del formulario al recargar.
9. Devuelve `{ actualizar(), visibles }`, con `visibles` (un _getter_) igual a los `id` de los productos mostrados, en orden.

**Pruebas y documentación**:

10. Tests en `tests/filtro.test.js` (cada función pura, con casos límite: tildes, varias palabras, todas las etiquetas, los órdenes, que no modifica el array, caracteres especiales, palabras que se contienen) y en `tests/catalogo.test.js` (happy-dom con el HTML de la página y temporizadores falsos: carga inicial, el rebote del buscador justo antes y justo después de la espera, el resaltado y que el texto no se interpreta como HTML, los demás campos al momento, la cancelación de la búsqueda pendiente, el rango, sin resultados, Intro, la URL al cambiar y al cargar, y `reset`).
11. **Pruebas de extremo a extremo** en `e2e/catalogo.spec.js` (tema 7, apartado 7.7), con la página real en Chromium (`npm run e2e`): al escribir en el buscador como un usuario (`pressSequentially`), la lista se filtra al dejar de escribir y las coincidencias se resaltan; los demás filtros se aplican al momento y la URL los recoge; una dirección con filtros (`/?categoria=bebidas&stock=1`) abre el catálogo con el formulario relleno y filtrado; y «Quitar los filtros» vuelve a mostrar todo y limpia la URL. Escribe las direcciones con `/?…`: `serve` pierde los parámetros de `/index.html?…`. Busca los elementos como un usuario (`getByLabel`, `getByRole`, `getByText`).
12. Mantén el JSDoc de los módulos y documenta en el README cada expresión regular.
13. `npm test`, `npm run e2e`, `npm run lint` y `npm run format:check` sin errores. Completa el `README.md` y haz commits frecuentes.

## Contrato de entrega

| Elemento | Debe ser |
|----------|----------|
| `js/filtro.js` | `normalizar(texto)`, `leerFiltros(datos)`, `filtrarProductos(productos, filtros)`, `trocearCoincidencias(texto, busqueda)` |
| `Filtros` | `{ texto, categoria, precioMaximo, soloEnStock, etiquetas, orden }` (ver el JSDoc) |
| Trozos | Array de `{ texto: string, coincide: boolean }`; `[]` si el texto está vacío; un solo trozo sin coincidencia si no hay palabras |
| `js/catalogo.js` | `aplicarParametros(formulario, busqueda)`, `iniciarCatalogo(formulario, lista, productos, { espera = 250 } = {})` → `{ actualizar(), visibles }` |
| Tarjeta | `li.producto[data-id]` con `.nombre` y `.descripcion` (coincidencias en `<mark>`), `.precio`, `.categoria`, `.etiquetas > li` y la clase `agotado` |
| URL | Parámetros con los nombres de los campos (`q`, `categoria`, `max`, `stock`, `etiqueta`, `orden`), solo los distintos del valor inicial |
| Tests | `tests/filtro.test.js` y `tests/catalogo.test.js`, con `npm test` |
| Pruebas de extremo a extremo | `e2e/catalogo.spec.js`, con `npm run e2e` (`playwright.config.js` sin cambios) |
| Secciones del README | `## Cómo ejecutarlo`, `## Eventos del formulario`, `## El formulario desde el código`, `## Expresiones regulares`, `## Pruebas`, `## Herramientas` |
| Integración continua | **Opcional**: `.github/workflows/ci.yml`, `package-lock.json` y la sección `## Integración continua (opcional)` del README. No se corrige |

## Criterios de evaluación

- ✅ Se eligen y justifican los eventos del formulario
- ✅ El código captura y usa los eventos con delegación, rebote cancelable, `submit` y `reset`
- ✅ Se leen y escriben los campos con `FormData`, `elements` y `URLSearchParams`, y se modifica la apariencia
- ✅ Se filtra, ordena y pinta sin modificar los datos ni usar `innerHTML`
- ✅ Expresiones regulares para normalizar, trocear, escapar y resaltar, documentadas
- ✅ Tests de las funciones puras y del formulario con temporizadores falsos, y pruebas de extremo a extremo con Playwright
- ✅ JSDoc, README, ESLint y Prettier
- ✅ Historial de commits progresivo y con mensajes descriptivos

## Integración continua (opcional)

> 📝 Este apartado es **opcional** y no cuenta para la corrección. Hazlo si en clase habéis visto GitHub Actions; si no, sáltatelo.

Tu repositorio de la tarea ya está en GitHub. Escribe un *workflow* de GitHub Actions que pase **todas las comprobaciones del proyecto** cada vez que subas cambios. Es el mismo que el de la UD5: `npm ci` con la caché de npm, ESLint, Prettier, los tests y las **pruebas de extremo a extremo**. La máquina de GitHub no trae los navegadores de Playwright, así que el *workflow* instala Chromium antes de ejecutarlas, como hace el `Dockerfile` de tu Dev Container. No hace falta un paso para arrancar el servidor de la página: lo arranca el `webServer` de `playwright.config.js`. Escríbelo tú, en `.github/workflows/ci.yml`, con estas orientaciones:

- Se ejecuta con cada `push` y cada *pull request* a la rama `main`.
- Tiene un único trabajo (*job*) que se ejecuta en `ubuntu-latest`.
- Sus pasos, en este orden, cada uno con un nombre (`name`) en español que diga qué hace:
  1. Descargar el código, con la acción `actions/checkout@v7`.
  2. Instalar Node.js 24 con la caché de npm, con la acción `actions/setup-node@v7`, `node-version: 24` y `cache: npm`.
  3. Instalar las dependencias con `npm ci`.
  4. Revisar el código con ESLint: `npm run lint`.
  5. Comprobar el formato con Prettier: `npm run format:check`.
  6. Ejecutar los tests: `npm test`.
  7. Instalar Chromium para Playwright, con las librerías del sistema que necesita: `npx playwright install --with-deps chromium`.
  8. Ejecutar las pruebas de extremo a extremo: `npm run e2e`.
- Sube también `package-lock.json`: lo creó `npm install` al abrir el contenedor. Sin él, `npm ci` falla. Si añades o actualizas una dependencia, vuelve a subirlo.
- Prettier también revisa el formato de `ci.yml`: ejecuta `npm run format` antes de subirlo.

Compruébalo:

1. Sube los cambios y abre la pestaña **Actions** del repositorio: la ejecución debe salir en verde, con los ocho pasos.
2. Rompe algo a propósito (por ejemplo, cambia el número de productos esperado en `e2e/catalogo.spec.js`), sube el cambio y comprueba que la ejecución sale en rojo en el paso que corresponde. Después, deshaz el cambio y comprueba que vuelve a verde.

Deja constancia en la sección «Integración continua (opcional)» del `README.md`: el enlace a la ejecución en verde y dos capturas en `img/`, una de la ejecución en verde con sus pasos y otra de la ejecución en rojo con el paso que falla.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen que ha construido el `Dockerfile` tampoco se borra (se llama `vsc-` seguido del nombre de la carpeta), así que la próxima vez no hace falta construirla de nuevo. Ocupa bastante (unos 2 GB, con Chromium): si necesitas espacio, bórrala desde la pestaña **Images** de Docker Desktop o con `docker image rm <nombre>`.
