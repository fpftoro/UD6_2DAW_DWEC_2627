# E04 · Buscador con _debounce_ y barra con _throttle_

**Tipo:** autocorrección

Dos eventos que se lanzan muchas veces por segundo, `input` y `scroll`, domados con las dos técnicas del tema 3: un buscador que espera a que dejes de escribir y una barra de progreso de lectura que se actualiza como mucho diez veces por segundo. Unos contadores en pantalla te dejan **ver** la diferencia.

**CE:** RA5 c, d

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/devcontainer.json`: el mismo entorno que usaste en la UD1 (tema 5, apartado 5.4), con Node.js y npm, sin instalar nada en tu equipo. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda unos minutos, porque descarga la imagen.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3604) y abre <http://localhost:3604> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3604 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3604 .`.

## Punto de partida

`index.html` tiene el formulario `#buscador` (campo `#buscar` y lista `#espera` con 0, 150, 300 y 600 ms), los párrafos `#contadores` y `#total`, la lista `#resultados`, un artículo largo con `#contador-scroll` y la barra `#progreso`, cuyo ancho es la variable CSS `--progreso`. `js/municipios.js` exporta cuarenta municipios y `js/texto.js`, la función `normalizar` (quita tildes y pasa a minúsculas). `js/tiempo.js` tiene `debounce` y `throttle` con su JSDoc, sin programar.

## Requisitos

**Las técnicas** (`js/tiempo.js`):

1. `debounce(funcion, espera)` según su JSDoc, con el método `cancelar()` en la función que devuelve.
2. `throttle(funcion, intervalo)` según su JSDoc: la primera llamada se ejecuta enseguida; las que llegan durante el intervalo se descartan, **salvo la última**, que se ejecuta al acabar el intervalo. (Es la «llamada final» que menciona la nota del tema 3.)

**El buscador** (`js/main.js`):

3. Una función `buscar(texto)` que muestra en `#resultados` los municipios cuyo nombre **o** provincia contienen el texto, sin distinguir mayúsculas ni tildes (usa `normalizar`), cada uno como `<li>` con el nombre y la provincia en un `<span class="provincia">`. `#total` dice `5 de 40 municipios`, o `Sin resultados para «xyz»`.
4. Cada evento `input` del campo suma uno al contador de eventos, y la búsqueda se hace con `debounce` y la espera elegida en `#espera`. Cada búsqueda real suma uno al contador de búsquedas. `#contadores` muestra `Eventos input: 12 · Búsquedas: 2`.
5. Al cambiar `#espera`, se crea una función con rebote nueva, se **cancela** la búsqueda pendiente de la anterior y se busca otra vez con el texto actual.
6. Intro en el campo no recarga la página.
7. Al cargar se muestran los cuarenta municipios, con los dos contadores a cero.

**La barra de progreso**:

8. Un oyente **pasivo** de `scroll` en `window` suma uno al contador de eventos y llama a la actualización de la barra, envuelta en un `throttle` de 100 ms.
9. La actualización calcula el porcentaje desplazado (`scrollY` entre lo que se puede desplazar: `scrollHeight - innerHeight`), lo pone en la variable CSS `--progreso` del elemento raíz con `style.setProperty` y suma uno al contador de actualizaciones. `#contador-scroll` muestra `Eventos scroll: 40 · Actualizaciones de la barra: 9`.

**Entrega.** Completa el `README.md`: cómo abres la página, qué ves en cada comprobación de «Comprueba tu solución» y por qué la versión sencilla del `throttle` no siempre llega al 100 %.

## Comprueba tu solución

- Escribe «ubeda» seguido con la espera de 300 ms: el contador de eventos sube a 5 mientras escribes y el de búsquedas sigue en 0; al parar, pasa a 1 y aparece Úbeda.
- Cambia la espera a 0 ms y escribe «cadiz»: cada tecla es una búsqueda. Salen los cinco municipios de la provincia.
- Escribe deprisa con 300 ms y cambia enseguida la espera a 0 ms: los resultados corresponden al texto **actual**, no a uno anterior (requisito 5).
- Escribe «zzz»: `Sin resultados para «zzz»`.
- Desplázate hasta el final con la rueda: los eventos de `scroll` son muchos más que las actualizaciones de la barra, y al llegar al final la barra ocupa **todo** el ancho.
- Sustituye temporalmente tu `throttle` por la versión sencilla del tema 3: ¿llega siempre la barra al 100 %? Explica por qué.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen del curso no se borra, así que la próxima vez el contenedor se vuelve a crear en pocos segundos.
