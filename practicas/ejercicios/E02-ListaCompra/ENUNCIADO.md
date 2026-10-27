# E02 · Lista de la compra con delegación

**Tipo:** autocorrección

Una lista de la compra en la que **todos** los productos, los iniciales y los que se añadan, responden a clics, dobles clics, casillas y teclado con **un único oyente por tipo de evento** en la lista.

**CE:** RA5 b, d

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/devcontainer.json`: el mismo entorno que usaste en la UD1 (tema 5, apartado 5.4), con Node.js y npm, sin instalar nada en tu equipo. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda unos minutos, porque descarga la imagen.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3602) y abre <http://localhost:3602> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3602 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3602 .`.

## Punto de partida

`index.html` tiene el formulario `#nuevo` (campos `nombre` y `cantidad`), la lista `#lista`, el resumen `#resumen` y la plantilla `#plantilla-producto` (casilla `.comprado`, `.nombre`, `.cantidad` y tres botones con `data-accion`: `menos`, `mas` y `borrar`). `estilos.css` ya define `.comprado-si` (tachado), `input.editar` y `.vacia`. `js/main.js` solo tiene los productos iniciales.

## Requisitos

1. Al cargar, la lista muestra los productos de `INICIALES` creados desde la plantilla. Cada `<li>` guarda su cantidad en `data-cantidad` y sus controles llevan un `aria-label` con el nombre del producto («Borrar Leche»).
2. Al enviar el formulario (`submit` con `preventDefault`), se añade el producto al final. Si ya existe uno con el mismo nombre (sin distinguir mayúsculas ni espacios de los extremos), se **suma** la cantidad en lugar de repetirlo. Después se restablece el formulario y el foco vuelve al nombre.
3. **Un oyente de `click`** en la lista para los tres botones: `+` y `−` cambian la cantidad (entre 1 y 99) y 🗑️ borra el producto. El botón `−` está desactivado cuando la cantidad es 1.
4. **Un oyente de `change`** en la lista para las casillas: marcan el producto con la clase `comprado-si`.
5. **Un oyente de `dblclick`** en la lista: el doble clic en un `.nombre` lo sustituye por un `<input class="editar">` con el nombre actual, enfocado y con el texto seleccionado.
6. Durante la edición:
   - **Un oyente de `keydown`** en la lista: Intro guarda y Escape cancela (recupera el nombre original).
   - **Un oyente de `focusout`** en la lista: salir del campo guarda. ¿Por qué no sirve `blur`?
   - Un nombre vacío o igual al de **otro** producto no se guarda: se recupera el original.
   - Al terminar, el campo vuelve a ser un `<span class="nombre">` y se actualizan los `aria-label`.
7. Tras cada cambio, `#resumen` dice `3 productos · 9 unidades · 1 comprados`. Si la lista se queda vacía, se muestra `<li class="vacia">La lista está vacía</li>`, que desaparece al añadir un producto.
8. Nada de oyentes en los `<li>` ni en sus botones; nada de `innerHTML`.

**Entrega.** Completa el `README.md`: cómo abres la página, qué ves en cada comprobación de «Comprueba tu solución» y por qué no sirve `blur` en el requisito 6.

## Comprueba tu solución

- Al cargar: `3 productos · 9 unidades · 0 comprados` y el `−` de «Pan» desactivado.
- Añade `  leche ` con cantidad 3: no aparece un producto nuevo y el resumen pasa a `12 unidades`.
- Añade `<b>Café</b>`: se ve tal cual, con las etiquetas.
- Pulsa `+` en «Pan»: cantidad 2 y su `−` se activa.
- Doble clic en «Tomates», escribe «Tomates pera» e Intro: cambia el nombre. Repite con Escape: no cambia. Repite y pulsa fuera del campo: cambia.
- Cambia el nombre de «Leche» por «pan»: se recupera «Leche».
- En el panel Elementos, la lista tiene un oyente de cada tipo (`click`, `change`, `dblclick`, `keydown`, `focusout`) y los `<li>` ninguno (pestaña **Procesadores de eventos**, *Event Listeners*).
- Borra todos los productos: aparece «La lista está vacía» y `0 productos · 0 unidades · 0 comprados`.
- Prueba la edición en Chrome **y** en Firefox: en los dos, Escape tiene que recuperar el nombre original.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen del curso no se borra, así que la próxima vez el contenedor se vuelve a crear en pocos segundos.
