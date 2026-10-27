# E03 · Atajos de teclado

**Tipo:** autocorrección

Un visor de fotos que se maneja **por completo con el teclado**: flechas, Inicio y Fin, números, una tecla para marcar favoritas, Ctrl+S para guardar y `?` para la ayuda, sin estorbar cuando el usuario escribe en un campo.

**CE:** RA5 c, d

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/devcontainer.json`: el mismo entorno que usaste en la UD1 (tema 5, apartado 5.4), con Node.js y npm, sin instalar nada en tu equipo. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda unos minutos, porque descarga la imagen.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3603) y abre <http://localhost:3603> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3603 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3603 .`.

## Punto de partida

`index.html` tiene el visor (`#foto`, `#titulo`, `#posicion`, `#favorita`), la lista vacía `#miniaturas`, el campo `#nota`, los párrafos `#ultimo` y `#mensaje`, el botón `#abrir-ayuda` y el diálogo `#ayuda` con la tabla de atajos. `estilos.css` ya tiene las clases `tono-1` a `tono-6`, `[aria-current='true']` y `.es-favorita` para las miniaturas. `js/fotos.js` exporta las seis fotos.

## Requisitos

1. Al cargar, crea con el DOM una miniatura por foto (`<li>` con un `<button data-indice>` que muestra el emoji y tiene un `aria-label` con el número y el título) y muestra la primera foto: emoji, clase `foto tono-N`, título, posición (`1 / 6`) y la marca `#favorita` solo si lo es. La miniatura actual lleva `aria-current="true"`.
2. **Un único oyente de `keydown` en `document`** con estos atajos:

   | Tecla | Acción |
   |-------|--------|
   | `→` / `←` | Foto siguiente / anterior, **dando la vuelta** en los extremos |
   | `Inicio` / `Fin` | Primera / última foto |
   | `1` … `6` | Ir a esa foto |
   | `F` (mayúscula o minúscula) | Marcar o quitar como favorita. **Mantener la tecla pulsada no la alterna sin parar** (`evento.repeat`) |
   | `Ctrl+S` o `Cmd+S` | Guardar las favoritas en `localStorage` y mostrar en `#mensaje` `💾 N favoritas guardadas` (`💾 1 favorita guardada` si solo hay una), **sin** que el navegador abra «Guardar página como» |
   | `?` | Abrir el diálogo de ayuda con `showModal()` |

3. **Mientras se escribe** en un campo (`input`, `textarea`…), los atajos no se aplican, salvo `Ctrl+S` (que sigue guardando) y `Escape` (que saca el foco del campo).
4. Con la ayuda abierta, los atajos no se aplican: Escape la cierra (lo hace el propio `<dialog>`).
5. Los atajos sin modificadores no se activan si se pulsa Ctrl, Cmd o Alt: no se roban atajos del navegador.
6. Las flechas, Inicio y Fin no desplazan la página.
7. Tras cada atajo, `#ultimo` muestra la combinación con su `key` y su `code`: `Último atajo: f (key: 'f' · code: 'KeyF')`.
8. Cada foto recuerda su nota (evento `input` del campo) y al volver a ella se muestra.
9. Las miniaturas cambian de foto al pulsarlas, con **un** oyente en `#miniaturas`. `#abrir-ayuda` abre la ayuda.
10. Al recargar, las favoritas guardadas siguen marcadas.

Organiza los atajos en un **objeto** que asocie cada tecla a su acción, en lugar de una cadena de `if`.

**Entrega.** Completa el `README.md`: cómo abres la página, qué ves en cada comprobación de «Comprueba tu solución» y qué `key` y qué `code` tiene la «ñ».

## Comprueba tu solución

- `→` en la última foto lleva a la primera; `←` en la primera, a la última.
- Pulsa `4`: «La Alhambra», `4 / 6`. Pulsa `f`: aparece «★ Favorita» y `#ultimo` muestra `code: 'KeyF'`.
- Mantén pulsada la `f` un segundo: la marca cambia **una sola vez**.
- Escribe «f4» en la nota: no cambia la foto ni la favorita. Pulsa Ctrl+S sin salir de la nota: aparece el mensaje y el navegador no abre ningún diálogo. Pulsa Escape: el foco sale de la nota.
- Pulsa `?` (con Mayúsculas en un teclado español): se abre la ayuda; las flechas no cambian la foto; Escape la cierra.
- Pulsa la «ñ» y fíjate en que no hace nada… pero ¿qué `key` y qué `code` tiene? Compruébalo con un `console.log` temporal en tu oyente.
- Marca dos favoritas, guarda y recarga: siguen marcadas en las miniaturas.
- En una página larga (reduce la ventana), Inicio y Fin no desplazan la página.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen del curso no se borra, así que la próxima vez el contenedor se vuelve a crear en pocos segundos.
