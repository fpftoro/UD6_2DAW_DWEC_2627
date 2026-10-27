# E09 · Carrusel accesible con eventos

**Tipo:** corrección por IA

Programa un **carrusel** que se construye sobre un HTML mínimo y responde al ratón, al teclado, al dedo (deslizando), al foco y a la visibilidad de la página; que pasa solo de diapositiva y sabe cuándo pararse; que avisa de sus cambios con un **evento propio**; y que se puede **destruir** sin dejar oyentes vivos. Con tests de eventos simulados en happy-dom y pruebas de extremo a extremo en Chromium con Playwright.

**CE:** RA5 a, b, c, d, h

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/`. Como los ejercicios de la UD2 con dependencias de npm, **construye su imagen** con el `Dockerfile` de esa carpeta, a partir de la imagen oficial de Node.js de **Docker Hub**, `node:24-bookworm` (UD2, tema 9, apartado 9.3.2). Además, el `Dockerfile` instala el navegador Chromium de Playwright con las librerías del sistema que necesita, así que no tienes que descargarlo tú. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda bastante más que en otros ejercicios, porque descarga la imagen, la construye y descarga el navegador. Al crearse, el contenedor ejecuta `npm install`: cuando se abre, las dependencias ya están instaladas.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3609) y abre <http://localhost:3609> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3609 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3609 .`.

Ejecuta los tests, las pruebas de extremo a extremo, ESLint y Prettier en la terminal de VS Code, que ya es la del contenedor. `npm run e2e` aprovecha el servidor de la página que ya está en marcha.

## Punto de partida

```text
├── package.json · vitest.config.js   ← scripts test, e2e, lint, format y format:check (Vitest con happy-dom, sin la carpeta e2e/)
├── playwright.config.js  ← carpeta e2e/, servidor de la página y Chromium (no se modifica)
├── index.html             ← un carrusel con cinco diapositivas; sin JavaScript se ven todas (no se modifica)
├── estilos.css            ← estilos de .con-carrusel, .controles, .indicadores, [aria-current] y [hidden] (no se modifica)
├── legado/
│   └── carrusel-antiguo.html  ← versión antigua con atributos on…, para analizarla en el README
├── js/
│   ├── main.js            ← inicia el carrusel y escucha su evento (no se modifica)
│   └── carrusel.js        ← iniciarCarrusel, con su JSDoc, sin programar
├── tests/
│   └── carrusel.test.js   ← un primer test
├── e2e/
│   └── carrusel.spec.js  ← una primera prueba de extremo a extremo
└── README.md              ← plantilla de entrega
```

Abre la página en el navegador (apartado «Entorno de trabajo») y comprueba que, **sin** tu código, las diapositivas se ven una debajo de otra.

## Requisitos

**Estructura** (`js/carrusel.js`): `iniciarCarrusel(contenedor, { intervalo = 5000, automatico = true } = {})`, según su JSDoc y el contrato.

1. Comprueba que el contenedor tiene `id` y una `.diapositivas` hija directa con diapositivas; si no, lanza los errores del contrato.
2. Marca el contenedor (clase `con-carrusel`, `aria-roledescription="carrusel"`) y cada diapositiva (`role="group"`, `aria-roledescription="diapositiva"`, `aria-label="2 de 5"`).
3. Crea con el DOM, detrás de la lista, un `div.controles` con los botones anterior, pausa y siguiente (con `data-accion` y `aria-label`) y un `div.indicadores` con un botón por diapositiva (`data-indice`, `aria-label="Ir a la diapositiva 3"`); y un `p.estado-carrusel` con `aria-live="polite"`.
4. Solo la diapositiva actual es visible (`hidden` en las demás), su indicador lleva `aria-current="true"` y el estado dice `Diapositiva 2 de 5`.

**Eventos** (todos registrados con la `signal` de un `AbortController`):

5. `click` en el **contenedor**, con delegación, para todos los botones. La navegación da la vuelta en los extremos.
6. `keydown` en el contenedor: flecha derecha e izquierda cambian de diapositiva, sin desplazar la página. Otras teclas no hacen nada.
7. Eventos de **puntero** en la lista: deslizar 50 px o más hacia la izquierda pasa a la siguiente; hacia la derecha, a la anterior. `pointercancel` anula el deslizamiento.
8. **Paso automático** cada `intervalo` ms (si `automatico` es `true`). Un cambio manual reinicia el intervalo. Se detiene:
   - con el botón de pausa (que pasa a decir `Reanudar`) o `pausar()`, hasta que se reanude;
   - mientras el puntero está sobre el carrusel (`mouseenter`/`mouseleave`);
   - mientras el foco está dentro (`focusin`/`focusout`, mirando `relatedTarget`);
   - mientras la pestaña está oculta (`visibilitychange`).
   Cada motivo es independiente: la pausa del botón se mantiene aunque el puntero salga.
9. Al cambiar de diapositiva (no si se va a la que ya está), emite en el contenedor `CustomEvent('diapositivacambiada', { detail: { indice, total, origen }, bubbles: true })`, con el `origen` del contrato.
10. Devuelve el objeto del contrato. `destruir()` aborta la señal (quita **todos** los oyentes, también el de `document`), para el temporizador, quita los controles y deja el HTML como estaba.
11. Ni `innerHTML`, ni estilos en el JavaScript, ni atributos `on…`.

**Pruebas y documentación**:

12. Tests en `tests/carrusel.test.js` (happy-dom, temporizadores falsos), con el HTML en `beforeEach`: estructura y errores; botones, indicadores, teclado (y que se cancela la acción por defecto), deslizamiento (por encima y por debajo del umbral) y `pointercancel`; el evento con sus orígenes (con `vi.fn()`) y que no se emite sin cambio; el paso automático, el reinicio tras un cambio manual y las cuatro pausas; y `destruir()` (sin oyentes ni temporizadores).
13. **Pruebas de extremo a extremo** en `e2e/carrusel.spec.js` (tema 7, apartado 7.7), con la página real en Chromium (`npm run e2e`): al cargar solo se ve la primera diapositiva; los botones y los indicadores cambian la diapositiva visible (con la vuelta en los extremos) y `#registro` lo dice; con el foco dentro, las flechas cambian de diapositiva; deslizar con el puntero (`page.mouse`) pasa de diapositiva si se superan los 50 px, y no si se queda corto; y, **sin JavaScript**, se ven las cinco diapositivas y ningún botón. Busca los elementos como un usuario (`getByRole`, `getByText`), no por clases.
14. Mantén el JSDoc del módulo: HTML necesario, estado, eventos que escucha y evento que emite.
15. `npm test`, `npm run e2e`, `npm run lint` y `npm run format:check` sin errores. Completa el `README.md` y haz commits frecuentes.

## Contrato de entrega

| Elemento | Debe ser |
|----------|----------|
| Exportación | `iniciarCarrusel(contenedor, { intervalo = 5000, automatico = true } = {})` en `js/carrusel.js` |
| Devuelve | `{ ir(indice), siguiente(), anterior(), pausar(), reanudar(), destruir(), actual, pausado }` (`actual` y `pausado` son _getters_) |
| Errores | `Error('El carrusel necesita un id')`; `Error('«#<id>» no tiene diapositivas')` |
| Estructura creada | `.controles` con `button[data-accion="anterior"]`, `[data-accion="pausa"]` y `[data-accion="siguiente"]`, y `.indicadores` con `button[data-indice="N"]`; `p.estado-carrusel[aria-live="polite"]` |
| Estado | `hidden` en las diapositivas no actuales; `aria-current` en los indicadores; clase `con-carrusel` |
| Teclado | `ArrowRight`, `ArrowLeft` (circular), con `preventDefault` |
| Deslizamiento | `pointerdown`/`pointerup` en `.diapositivas`, umbral de 50 px; `pointercancel` |
| Evento | `diapositivacambiada` en el contenedor, `bubbles: true`, `detail: { indice, total, origen }`; `origen`: `'boton'`, `'indicador'`, `'teclado'`, `'deslizamiento'`, `'automatico'` o `'codigo'` (los métodos) |
| Tests | `tests/carrusel.test.js`, con `npm test` |
| Pruebas de extremo a extremo | `e2e/carrusel.spec.js`, con `npm run e2e` (`playwright.config.js` sin cambios) |
| Secciones del README | `## Cómo ejecutarlo`, `## Eventos en el HTML`, `## Oyentes y propagación`, `## Tipos de eventos`, `## Accesibilidad`, `## Pruebas`, `## Herramientas` |
| Integración continua | **Opcional**: `.github/workflows/ci.yml`, `package-lock.json` y la sección `## Integración continua (opcional)` del README. No se corrige |

## Criterios de evaluación

- ✅ Se reconoce qué ofrece el HTML para capturar eventos y los problemas de los atributos `on…`
- ✅ Los oyentes se registran donde corresponde, con delegación, propagación y `signal`
- ✅ Se eligen y justifican los tipos de eventos de cada familia
- ✅ Navegación con ratón, teclado, indicadores y deslizamiento con eventos de puntero
- ✅ Paso automático con sus cuatro pausas y evento propio
- ✅ Tests de eventos simulados con temporizadores falsos y pruebas de extremo a extremo con Playwright
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
2. Rompe algo a propósito (por ejemplo, cambia el texto esperado de `#registro` en `e2e/carrusel.spec.js`), sube el cambio y comprueba que la ejecución sale en rojo en el paso que corresponde. Después, deshaz el cambio y comprueba que vuelve a verde.

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
