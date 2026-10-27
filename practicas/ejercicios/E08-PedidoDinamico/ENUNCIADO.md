# E08 · Pedido con líneas dinámicas y doble envío

**Tipo:** autocorrección

Un formulario de pedido en el que el usuario añade y quita líneas de productos, el total se recalcula en vivo, la dirección solo se pide si hace falta, los datos se recogen con `FormData` y el envío (simulado) **no se puede repetir** mientras está en curso.

**CE:** RA5 e, f

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/devcontainer.json`: el mismo entorno que usaste en la UD1 (tema 5, apartado 5.4), con Node.js y npm, sin instalar nada en tu equipo. Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda unos minutos, porque descarga la imagen.

La página usa módulos, así que necesita un servidor: no la abras con doble clic. Al abrir el contenedor, VS Code arranca solo el servidor de la página (`serve`, en el puerto 3608) y abre <http://localhost:3608> en el navegador de tu equipo. Si no se abre, búscala en el panel **Puertos** de VS Code: la columna **Dirección reenviada** da la dirección exacta (si el 3608 de tu equipo ya está ocupado, VS Code usa otro número). Si paras el servidor, vuelve a lanzarlo en la terminal del contenedor con `npx --yes serve@14.2.6 --listen 3608 .`.

## Punto de partida

`index.html` tiene el formulario `#pedido` con `novalidate`: el contenedor `#lineas`, el botón `#anadir-linea`, los botones de opción `entrega` (`tienda` o `domicilio`), el `fieldset#direccion` (oculto y desactivado, con los campos `calle` y `cp` y sus `<p class="error">`), las salidas `#envio` y `#total`, el botón de envío `#enviar` y uno de restablecer. Debajo, `#estado` y `#resumen`. La plantilla `#plantilla-linea` tiene un desplegable `producto` (cada opción con su `data-precio`), un campo `cantidad`, una salida `.subtotal`, un botón `.quitar` y un `<p class="error">`. `js/servidor.js` exporta `simularEnvio(pedido, alTerminar)`, que responde a los 1,5 s con un número de pedido. `js/main.js` está vacío.

## Requisitos

**Líneas dinámicas**

1. Al cargar hay una línea, creada desde la plantilla. `#anadir-linea` añade otra (hasta 10; después se desactiva) y enfoca su desplegable.
2. El botón `.quitar` de cada línea la elimina, con **un** oyente en `#lineas`. Si solo queda una línea, su botón está desactivado. Cada botón lleva un `aria-label` con su número de línea («Quitar la línea 2»), que se actualiza al quitar.

**Cálculos en vivo**

3. Un único oyente de `input` en el formulario recalcula con cualquier cambio: el subtotal de cada línea (precio × cantidad), el envío (3,95 € con envío a domicilio, gratis desde 30 € de productos) y el total, con formato de euros (`Intl.NumberFormat`).
4. El evento `change` de `entrega` muestra y activa el `fieldset#direccion` si se elige domicilio, y lo oculta y desactiva si no. Un `fieldset` desactivado no se valida ni se envía.

**Validación al enviar**

5. Al enviar: si ya se está enviando, no hace nada. Si no, valida todos los campos:
   - En cada línea, el `<p class="error">` muestra el error del primer campo no válido: `Elige un producto.`, `La cantidad va de 1 a 99.` o, con una regla propia (`setCustomValidity`), `Ya has elegido este producto en otra línea.`
   - Los campos de la dirección muestran su error en su `<p class="error">`.
   - Los campos no válidos llevan `aria-invalid="true"`, el foco va al primero y `#estado` dice `Revisa 2 campos antes de enviar.` (o `Revisa 1 campo…`)
   - Tras un intento fallido, los errores se actualizan en vivo con cada `input`.
6. Si todo es válido, construye el pedido con `FormData` (combinando `getAll('producto')` y `getAll('cantidad')`):

   ```json
   {
     "lineas": [{ "producto": "cuaderno", "cantidad": 4 }, { "producto": "calculadora", "cantidad": 2 }],
     "entrega": "domicilio",
     "total": "39,80 €",
     "direccion": { "calle": "Calle Mayor, 1", "cp": "41001" }
   }
   ```

   `direccion` solo aparece con envío a domicilio.

**Envío sin repeticiones**

7. Mientras dura el envío: el formulario tiene `data-enviando` y `aria-busy="true"`, el botón está desactivado y dice `Enviando…`, y `#estado` dice `Enviando el pedido…`. Pulsar Intro en un campo **no** envía otra vez.
8. Al terminar: `#estado` dice `✅ Pedido PED-0001 recibido.`, `#resumen` muestra el pedido (`JSON.stringify` con sangría), se restablece el botón y se llama a `reset()`.
9. El evento `reset` deja el formulario como al cargar: una sola línea, la dirección oculta y desactivada, sin errores ni `aria-invalid`, y los totales a cero. (Los campos recuperan sus valores **después** del evento `reset`: piensa cuándo recalcular.)

**Entrega.** Completa el `README.md`: cómo abres la página y qué ves en cada comprobación de «Comprueba tu solución».

## Comprueba tu solución

- Pulsa «Hacer el pedido» sin elegir nada: `⚠ Elige un producto.` y el foco en el desplegable. Elige un producto: el error desaparece al momento.
- 4 cuadernos: total `10,00 €`. Añade una línea con otro cuaderno y envía: error de producto repetido.
- Cambia la segunda línea a una calculadora: `24,90 €`. Elige envío a domicilio: envío `3,95 €` y total `28,85 €`. Pon 2 calculadoras: el envío pasa a `0,00 €`.
- Añade líneas hasta diez: el botón de añadir se desactiva.
- Envía con la dirección completa y pulsa Intro enseguida en un campo: en la consola solo aparece **un** `📤 Enviando al servidor` y el estado dice `PED-0001`.
- Tras el envío, el formulario vuelve a tener una línea y los totales a cero. Haz un pedido para recoger en la tienda: el resumen no tiene `direccion`.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen del curso no se borra, así que la próxima vez el contenedor se vuelve a crear en pocos segundos.
