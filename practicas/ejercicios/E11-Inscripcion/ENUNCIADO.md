# E11 · Inscripción en varios pasos (integrador)

**Tipo:** corrección por IA

Programa el **formulario de inscripción** en los cursos de verano: cuatro pasos (datos personales, curso, cuenta y resumen), validación en tiempo real con mensajes accesibles, validadores con **expresiones regulares**, campos que aparecen según lo elegido, contactos de emergencia dinámicos, un resumen editable y un **envío interceptado** que no se puede repetir. Con los validadores documentados y probados, tests del formulario en happy-dom y pruebas de extremo a extremo en Chromium con Playwright. Junta todo lo visto en la unidad.

**CE:** RA5 a, b, c, d, e, f, g, h

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/`. Como los ejercicios de la UD2 con dependencias de npm, **construye su imagen** con el `Dockerfile` de esa carpeta, a partir de la imagen oficial de Node.js de **Docker Hub**, `node:24-bookworm` (UD2, tema 9, apartado 9.3.2). Además, el `Dockerfile` instala el navegador Chromium de Playwright con las librerías del sistema que necesita, así que no tienes que descargarlo tú. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda bastante más que en otros ejercicios, porque descarga la imagen, la construye y descarga el navegador. Al crearse, el contenedor ejecuta `npm install`: cuando se abre, las dependencias ya están instaladas.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3611) y abre <http://localhost:3611> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3611 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3611 .`.

Ejecuta los tests, las pruebas de extremo a extremo, ESLint y Prettier en la terminal de VS Code, que ya es la del contenedor. `npm run e2e` aprovecha el servidor de la página que ya está en marcha.

## Punto de partida

```text
├── package.json · vitest.config.js · jsdoc.json   ← scripts test, e2e, lint, format, format:check y docs
├── playwright.config.js  ← carpeta e2e/, servidor de la página y Chromium (no se modifica)
├── index.html          ← el formulario con sus cuatro pasos, el resumen de errores, la confirmación y la plantilla de contacto (no se modifica)
├── estilos.css         ← estilos de los pasos, [aria-invalid], .error, .cumple, [aria-current] (no se modifica)
├── js/
│   ├── main.js         ← inicia el formulario y escucha su evento (no se modifica)
│   ├── provincias.js   ← provincia de cada código postal (no se modifica)
│   ├── servidor.js     ← simularInscripcion(datos, alTerminar) (no se modifica)
│   ├── validadores.js  ← validadores puros, con su JSDoc, sin programar
│   └── formulario.js   ← iniciarInscripcion, con su JSDoc y los tipos, sin programar
├── tests/
│   └── validadores.test.js  ← un primer test
├── e2e/
│   └── inscripcion.spec.js  ← una primera prueba de extremo a extremo
└── README.md           ← plantilla de entrega
```

Lee `index.html` antes de empezar: los `id`, los `name`, los atributos de validación, los `data-validar` y las cajas de error `<id>-error` forman parte del contrato.

## Requisitos

**Validadores** (`js/validadores.js`), funciones puras sin DOM, **con expresiones regulares**:

1. `normalizarDocumento`, `esDocumentoValido` (con la letra de control), `esCodigoPostal`, `normalizarTelefono`, `esCorreo`, `esUsuario`, `requisitosClave` (cada requisito por separado, con `\p{Ll}` y `\p{Lu}`) y `edad`, según su JSDoc.
2. `VALIDADORES`: un validador por valor de `data-validar` (`documento`, `edad`, `correo`, `telefono`, `codigoPostal`, `usuario` y `clave`) que devuelve el mensaje de error o `''`. El de la contraseña dice qué le falta: `La contraseña necesita: una mayúscula, una cifra.`

**Pasos** (`js/formulario.js`): `iniciarInscripcion(formulario, { enviar })`.

3. Solo se ve el paso actual; su elemento de `#progreso` lleva `aria-current="step"`; «Anterior» está oculto en el paso 1; «Siguiente» dice `Confirmar la inscripción` en el paso 4. Al cambiar de paso, el foco va a su título (`.titulo-paso`) y se emite en el formulario `CustomEvent('pasocambiado', { detail: { paso, anterior }, bubbles: true })`.
4. El envío del formulario (`submit`: botón o Intro) **valida solo los campos del paso actual** y, si son válidos, avanza. Si no, muestra `#resumen-errores` con un enlace por campo (un solo enlace para el grupo de cursos) y le da el foco; los enlaces llevan el foco al campo. «Anterior» vuelve sin validar.

**Validación en tiempo real** (CE f):

5. Cada campo se valida por primera vez al **salir** de él y, desde entonces, con cada `input`. Los mensajes salen de `validity` y de `VALIDADORES` (con `setCustomValidity`, recalculado siempre); la repetición de la contraseña es una regla propia que se revalida también al cambiar la contraseña.
6. El mensaje va en la caja `<id>-error` (en los cursos, `curso-error`) con `⚠ ` delante, y el campo lleva `aria-invalid` a `"true"` o `"false"` (en los cursos, todo el grupo).

**El formulario desde el código** (CE e):

7. El código postal muestra la provincia en `#provincia` en cuanto tiene dos cifras.
8. La casilla de alojamiento muestra y **activa** el `fieldset#bloque-alojamiento`, o lo oculta y desactiva.
9. Contactos de emergencia desde `#plantilla-contacto`: uno al cargar, como mucho dos. Cada campo recibe un `id` único (`contacto-2-telefono`), el `htmlFor` de su etiqueta y el `aria-describedby` de su caja de error (`contacto-2-telefono-error`). «Quitar» se desactiva con un solo contacto y «Añadir» con dos.
10. En la cuenta, la lista `#requisitos-clave` marca con la clase `cumple` cada requisito que se cumple y `#fuerza` (un `<meter>`) muestra cuántos se cumplen, mientras se escribe.
11. El paso 4 muestra un resumen (`<dl>` creada con el DOM) con los datos normalizados, un botón «Editar» por dato (`data-ir` con el paso) y el total en `#total` (precio del curso más 25 € por noche).

**Envío interceptado** (CE f):

12. En el paso 4, el envío revalida los tres pasos (si alguno falla, vuelve a él) y llama a `enviar(datos, alTerminar)` con el objeto `Inscripcion` del contrato. Mientras tanto, el formulario tiene `data-enviando` y `aria-busy="true"`, los botones están desactivados, «Siguiente» dice `Enviando…` y un segundo envío **no** hace nada.
13. Si `alTerminar` recibe un error, se muestra en `#estado` (`❌ Ya hay una inscripción con ese documento.`) y se puede reintentar. Si recibe el número, se ocultan el formulario y el progreso y se muestra `#confirmacion` con el número y el correo, con el foco.

**Pruebas y documentación** (CE h):

14. `tests/validadores.test.js`: tablas `it.each` con casos válidos (incluidos los límites) y **un caso no válido por cada regla** de cada validador, con su motivo; `edad` con una fecha fija; los mensajes de `VALIDADORES`.
15. `tests/formulario.test.js` (happy-dom, con el HTML de la página y temporizadores falsos; `enviar` es un espía): pasos y errores, resumen de errores y foco, el evento propio, la validación al salir y al escribir, provincia, alojamiento, contactos, requisitos de la contraseña, repetición, resumen y total, envío con los datos exactos, sin doble envío, confirmación y error del servidor.
16. **Pruebas de extremo a extremo** en `e2e/inscripcion.spec.js` (tema 7, apartado 7.7), con la página real en Chromium (`npm run e2e`), rellenando el formulario como un usuario (`fill`, `check`, `selectOption`, `press`): sin datos no se avanza y el resumen de errores recibe el foco y lleva a cada campo; un campo se valida al salir de él (Tabulador) y el error desaparece mientras se corrige; el paso 2 muestra la provincia y añade y quita contactos; los requisitos de la contraseña se marcan mientras se escribe; una inscripción completa se envía y se confirma; y, con el documento `00000000T`, se muestra el error del servidor y se puede reintentar. Busca los campos por su etiqueta (`getByLabel`).
17. JSDoc en todos los módulos (los validadores, con lo que aceptan y rechazan y un `@example`) y documentación generada con `npm run docs`.
18. `npm test`, `npm run e2e`, `npm run lint` y `npm run format:check` sin errores. Completa el `README.md` y haz commits frecuentes.

Ni `innerHTML`, ni estilos en el JavaScript, ni atributos `on…`.

## Contrato de entrega

| Elemento | Debe ser |
|----------|----------|
| `js/validadores.js` | Las funciones del requisito 1 y `VALIDADORES`, con las firmas de su JSDoc |
| `js/formulario.js` | `iniciarInscripcion(formulario, { enviar })` → `{ paso }` (_getter_) |
| `enviar(datos, alTerminar)` | `alTerminar(error, numero)`: uno de los dos es `null` |
| `Inscripcion` | `{ nombre, apellidos, documento, nacimiento, correo, telefono, curso, turno, cp, provincia, alojamiento, contactos, usuario, clave, total }`: documento y teléfonos normalizados, `alojamiento` igual a `{ noches }` o `null`, `contactos` igual a `[{ nombre, telefono }]` y `total` en euros (número) |
| Evento | `pasocambiado` en el formulario, `bubbles: true`, `detail: { paso, anterior }` |
| Estado | `hidden` en los pasos; `aria-current="step"`; `aria-invalid`; `data-enviando` y `aria-busy` durante el envío; clase `cumple` en los requisitos |
| Contactos | `id="contacto-N-nombre"` y `id="contacto-N-telefono"`, con sus cajas `…-error` |
| Tests | `tests/validadores.test.js` y `tests/formulario.test.js`, con `npm test` |
| Pruebas de extremo a extremo | `e2e/inscripcion.spec.js`, con `npm run e2e` (`playwright.config.js` sin cambios) |
| Secciones del README | `## Cómo ejecutarlo`, `## Eventos en el HTML`, `## Oyentes y propagación`, `## Tipos de eventos`, `## El formulario desde el código`, `## Validación`, `## Expresiones regulares`, `## Pruebas`, `## Documentación`, `## Herramientas` |
| Integración continua | **Opcional**: `.github/workflows/ci.yml`, `package-lock.json` y la sección `## Integración continua (opcional)` del README. No se corrige |

## Criterios de evaluación

- ✅ Se reconoce qué ofrece el HTML para capturar y gestionar los eventos del formulario
- ✅ Los oyentes se registran con delegación, sin cortar la propagación, y se emite un evento propio
- ✅ Se eligen y justifican los tipos de eventos
- ✅ El código captura y usa los eventos para navegar por los pasos
- ✅ Se usan las capacidades del lenguaje para leer, crear y modificar los campos del formulario
- ✅ Se valida en tiempo real con mensajes accesibles y el envío está controlado
- ✅ Las expresiones regulares validan y normalizan los datos, y están documentadas
- ✅ Los validadores y el formulario están probados (también de extremo a extremo con Playwright) y documentados
- ✅ Historial de commits progresivo, ESLint y Prettier

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
2. Rompe algo a propósito (por ejemplo, cambia el número de inscripción esperado en `e2e/inscripcion.spec.js`), sube el cambio y comprueba que la ejecución sale en rojo en el paso que corresponde. Después, deshaz el cambio y comprueba que vuelve a verde.

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
