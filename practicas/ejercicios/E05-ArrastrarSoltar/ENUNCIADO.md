# E05 · Arrastrar y soltar

**Tipo:** autocorrección

Dos formas de arrastrar: soltar **ficheros** desde el escritorio en una zona de la página, con la API de arrastrar y soltar del HTML, y mover **notas** por un tablero con los **eventos de puntero**, que funcionan igual con el ratón, el dedo y el lápiz. Las dos con su alternativa para quien no puede arrastrar.

**CE:** RA5 c, d

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/devcontainer.json`: el mismo entorno que usaste en la UD1 (tema 5, apartado 5.4), con Node.js y npm, sin instalar nada en tu equipo. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda unos minutos, porque descarga la imagen.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3605) y abre <http://localhost:3605> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3605 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3605 .`.

## Punto de partida

`index.html` tiene la zona `#zona`, el selector de ficheros `#selector`, el estado `#estado-ficheros` y la lista `#ficheros`; y el tablero `#tablero` con tres notas `.nota` (con `tabindex="0"` y su posición inicial en `data-x` y `data-y`) y el párrafo `#posicion`. `estilos.css` ya define `.encima`, `.rechazado` y `.arrastrando`, y coloca cada nota según las variables CSS `--x` y `--y`; además tiene `touch-action: none` en las notas. `js/main.js` está vacío.

## Requisitos

**1. Zona de imágenes**

1. Una función `mostrarFicheros(ficheros)` que muestra en `#ficheros` un `<li>` por fichero:
   - Aceptado (imagen de 2 MB o menos): `🖼️ foto.png · 1,5 KB` (tamaño en KB con un decimal como mucho, con `Intl.NumberFormat`).
   - Rechazado, con la clase `rechazado` y el motivo: `❌ notas.txt · 0 KB · no es una imagen` o `❌ grande.jpg · 3072 KB · ocupa más de 2 MB`.
   - `#estado-ficheros` dice `1 de 3 ficheros aceptados`.
2. Eventos de la zona:
   - `dragenter`: añade la clase `encima`.
   - `dragover`: llama a `preventDefault()` (si no, no se puede soltar).
   - `dragleave`: quita `encima` **solo** si el puntero sale de la zona (`relatedTarget`), no al pasar por encima de un hijo.
   - `drop`: cancela la acción por defecto, quita `encima` y llama a `mostrarFicheros` con `dataTransfer.files`.
3. Si se suelta un fichero **fuera** de la zona, el navegador no lo abre (la página no se pierde).
4. **Alternativa**: el evento `change` del selector llama a la misma `mostrarFicheros`.

**2. Tablero de notas**

5. Una función `colocar(nota, x, y)` que limita la posición para que la nota no se salga del tablero, la guarda en `data-x` y `data-y` y la pasa al CSS con `style.setProperty('--x', '120px')`. Al cargar, coloca las tres notas según sus datos.
6. Con **eventos de puntero** y delegación en el tablero:
   - `pointerdown` con el botón principal sobre una nota: la lleva al final del tablero (para que quede encima), le da el foco, guarda la distancia entre el puntero y la esquina de la nota, **captura el puntero** (`setPointerCapture`) y le añade `arrastrando`.
   - `pointermove`: si se está arrastrando, coloca la nota siguiendo al puntero.
   - `pointerup` y `pointercancel`: termina el arrastre, quita la clase y anuncia en `#posicion`: `«Comprar pan» en x: 120, y: 70`.
7. **Alternativa con el teclado** (`keydown` delegado en el tablero): con una nota enfocada, las flechas la mueven 10 px (50 px con Mayúsculas), sin desplazar la página, y se anuncia la posición.

Sin `innerHTML`. El único estilo que escribe el JavaScript son las variables `--x` y `--y`: una posición calculada no se puede expresar con clases.

**Entrega.** Completa el `README.md`: cómo abres la página y qué ves en cada comprobación de «Comprueba tu solución».

## Comprueba tu solución

- Arrastra desde el escritorio una imagen pequeña, un fichero de texto y una imagen de más de 2 MB: dos salen en rojo con su motivo y el estado dice `1 de 3 ficheros aceptados`.
- Mientras arrastras sobre la zona, el borde se pone azul y **no parpadea** al pasar sobre el texto de dentro. Al salir de la zona, vuelve a gris.
- Suelta un fichero fuera de la zona: la página sigue ahí.
- Elige los mismos ficheros con el selector: mismo resultado.
- Arrastra «Comprar pan» por el tablero: se mueve con el puntero, queda por encima de las demás y no se sale de los bordes aunque lleves el ratón fuera del tablero.
- Pulsa el Tabulador hasta una nota y muévela con las flechas y con Mayúsculas + flechas.
- Activa en las DevTools la **barra de herramientas del dispositivo** (*device toolbar*), que simula una pantalla táctil, y arrastra una nota con el «dedo»: se mueve y la página no se desplaza.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen del curso no se borra, así que la próxima vez el contenedor se vuelve a crear en pocos segundos.
