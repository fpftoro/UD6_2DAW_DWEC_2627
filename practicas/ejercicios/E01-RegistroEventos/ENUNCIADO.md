# E01 · Registro de eventos en pantalla

**Tipo:** autocorrección

Una página que **se observa a sí misma**: registra por qué elementos pasa cada clic, en qué fase y con qué `target` y `currentTarget`, y compara las tres formas de asociar un manejador.

**CE:** RA5 a, b

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/devcontainer.json`: el mismo entorno que usaste en la UD1 (tema 5, apartado 5.4), con Node.js y npm, sin instalar nada en tu equipo. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda unos minutos, porque descarga la imagen.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3601) y abre <http://localhost:3601> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3601 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3601 .`.

## Punto de partida

`index.html` tiene tres capas anidadas con la clase `capa` y su nombre en `data-nombre` (`section#zona` › `div` › `button#objetivo`, con una estrella `<span>` dentro del botón), un enlace dentro del `div`, dos casillas de opciones, el botón `#tres-formas` con un atributo `onclick` y el registro `#registro`. `estilos.css` ya define las clases `separador` y `aviso` para las líneas del registro. `js/main.js` está vacío y el `README.md` tiene las preguntas que debes contestar.

## Requisitos

**Parte 1 · El recorrido de un clic**

1. Una función `registrar(texto, clase)` que añade un `<li>` al registro con `textContent` (y la clase, si se indica).
2. En **cada** `.capa`, un oyente de `click` en la fase de **captura** y otro en la de **burbuja**, los dos con la misma función. Cada uno registra una línea con este formato:

   ```text
   ⬇️ captura · div (target: span)
   ```

   La flecha y el nombre de la fase salen de `evento.eventPhase` (`⬇️ captura`, `🎯 objetivo`, `⬆️ burbuja`), el nombre de la capa de `evento.currentTarget.dataset.nombre` y el del `target` de su `tagName` en minúsculas.
3. Antes de las líneas de cada clic dentro de `#zona`, una línea separadora con la clase `separador`: `— Clic n.º 3 en span —`. Tiene que salir **antes** que todas las demás: piensa en qué nodo y en qué fase registrar su oyente.
4. Si `#detener` está marcada, el `div` detiene la propagación en la fase de burbuja y lo registra: `✋ Propagación detenida en el div` (clase `aviso`).
5. Si `#cancelar` está marcada y se pulsa el enlace, la `section` cancela la acción por defecto y lo registra: `🚫 Acción por defecto cancelada: el enlace no se sigue` (clase `aviso`).
6. `#limpiar` vacía el registro y reinicia el contador de clics.

**Parte 2 · Tres formas de asociar un manejador**

7. Antes de programar esta parte, pulsa `#tres-formas` y observa qué hace su atributo `onclick`.
8. Al cargar, registra `String(boton.onclick)`: lo que el navegador ha creado con el texto del atributo.
9. Registra en este orden: un `addEventListener` que registra `addEventListener 1`, la **propiedad** `onclick` con una función que registra `propiedad onclick`, y otro `addEventListener` que registra `addEventListener 2`.

**Respuestas**

10. Contesta las preguntas de la sección «Respuestas» del `README.md` con lo que observes en el registro.

Sin `innerHTML` y sin tocar el HTML.

**Entrega.** Completa el `README.md`: cómo abres la página, qué ves en cada comprobación de «Comprueba tu solución» y las cuatro respuestas.

## Comprueba tu solución

- Al cargar, la primera línea del registro empieza por `El atributo onclick…` y contiene `function onclick(event)`.
- Pulsa la estrella: un separador y **seis** líneas, tres `⬇️ captura` (section, div, button) y tres `⬆️ burbuja` (button, div, section), todas con `target: span`.
- Pulsa el texto del botón (fuera de la estrella): sus dos líneas salen como `🎯 objetivo`.
- Pulsa en la zona azul de la `section`, fuera del `div`: solo dos líneas, las dos de la `section`.
- Marca «Detener»: tras `⬆️ burbuja · div` aparece el aviso `✋` y ya no sale `⬆️ burbuja · section`.
- Marca solo «Cancelar» y pulsa el enlace: aparece `🚫` y la página no cambia. Marca las dos y pulsa el enlace: la página **sí** navega. Explica por qué en la sección «Respuestas» del `README.md`.
- Pulsa `#tres-formas`: se registran tres líneas y el texto del botón **ya no** cambia.
- En el panel Elementos, el `div` tiene tres oyentes de `click` (pestaña **Procesadores de eventos**, *Event Listeners*).

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen del curso no se borra, así que la próxima vez el contenedor se vuelve a crear en pocos segundos.
