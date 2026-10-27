# E07 · Formulario de registro con la API de validación

**Tipo:** autocorrección

Un formulario de alta que aprovecha la validación del HTML, pero controla con JavaScript **cuándo** y **cómo** se muestran los errores: mensajes propios, reglas que el HTML no sabe expresar, mensajes accesibles y un resumen de errores al enviar.

**CE:** RA5 e, f

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/devcontainer.json`: el mismo entorno que usaste en la UD1 (tema 5, apartado 5.4), con Node.js y npm, sin instalar nada en tu equipo. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda unos minutos, porque descarga la imagen.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3607) y abre <http://localhost:3607> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3607 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3607 .`.

## Punto de partida

`index.html` tiene el formulario `#registro` con `novalidate` y seis campos con sus reglas en el HTML (`required`, `pattern`, `type="email"`, `minlength`, `type="date"`). Cada campo tiene debajo un `<p class="error" id="<id>-error">` y está asociado a él con `aria-describedby`. Encima del formulario está el resumen `#resumen-errores` (oculto, con un `<ul>`) y debajo, `#resultado`. `estilos.css` pinta `[aria-invalid='true']` en rojo y `[aria-invalid='false']` en verde. `js/main.js` está vacío.

## Requisitos

1. **Mensajes propios** con `validity`, en una función `mensajeDeError(campo)` que devuelve `''` si es válido:

   | Motivo | Mensaje |
   |--------|---------|
   | `valueMissing` | `Este campo es obligatorio.` (en la casilla: `Tienes que aceptar las condiciones.`) |
   | `typeMismatch` | `Escribe un correo con el formato nombre@dominio.es.` |
   | `patternMismatch` | `Usa de 3 a 16 minúsculas, cifras o _, empezando por una letra.` |
   | `tooShort` | `Escribe al menos 8 caracteres (llevas 3).` |
   | `customError` | El mensaje de la regla propia (`validationMessage`) |

2. **Reglas propias** con `setCustomValidity`, que se calculan **cada vez** y se quitan con `''`:
   - Contraseña de 8 o más caracteres sin mayúscula o sin cifra: `Añade una mayúscula y una cifra.` (o solo la que falte).
   - Repetir distinta de la contraseña: `Las contraseñas no coinciden.`
   - Menor de 16 años según la fecha de nacimiento: `Tienes que tener al menos 16 años.`
3. Una función `validarCampo(campo)` que escribe el mensaje (precedido de `⚠ `) en su `<p class="error">`, pone `aria-invalid` a `"true"` o `"false"` y devuelve si es válido.
4. **Cuándo validar**, con un oyente por evento en el formulario (delegación):
   - `focusout`: marca el campo como tocado (`data-tocado`) y lo valida.
   - `input`: recalcula las reglas propias y revalida el campo **solo si ya está tocado** (la casilla, siempre). Cambiar la contraseña revalida también la repetición si ya está tocada.
   - Ojo: los botones también tienen `willValidate`. Valida solo los campos.
5. **Al enviar** (`submit`): valida todos los campos. Si hay errores, muestra `#resumen-errores` con un enlace por campo (`Correo electrónico: Escribe un correo…`, con `href="#correo"`), le da el foco y no envía. Los enlaces llevan al campo y le dan el foco.
6. Si todo es válido: oculta el resumen, muestra `✅ Cuenta creada para ana_33.` (con `FormData`), restablece el formulario y quita `data-tocado` y `aria-invalid` de todos los campos.

**Entrega.** Completa el `README.md`: cómo abres la página y qué ves en cada comprobación de «Comprueba tu solución».

## Comprueba tu solución

- Escribe una «A» en el usuario: no aparece nada hasta que sales del campo. Al salir, aparece el error del patrón y el borde rojo. Escribe `ana_33`: el error desaparece **mientras** escribes.
- Contraseña `abc` y sal: `Escribe al menos 8 caracteres (llevas 3).` Sigue hasta `abcdefghi`: `Añade una mayúscula y una cifra.`
- Repite `abcdefghi`, sal, y después añade `A1` a la contraseña: el error de la repetición aparece sin tocarla.
- Pon una fecha de hace diez años: `Tienes que tener al menos 16 años.`
- Pulsa «Crear la cuenta» con errores: aparece el resumen con un enlace por campo, el foco está en el resumen y cada enlace lleva a su campo.
- Corrige todo y envía: mensaje de éxito y formulario vacío, sin bordes de color.
- Con un lector de pantalla (o la pestaña **Accesibilidad** del panel Elementos de las DevTools, *Accessibility*), comprueba que el campo con error se anuncia como «no válido» junto con su mensaje.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen del curso no se borra, así que la próxima vez el contenedor se vuelve a crear en pocos segundos.
