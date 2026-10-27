# 4. Formularios desde el código

[⬅️ Volver a la unidad](./README.md)

## Índice

- [4.1. El formulario como objeto](#41-el-formulario-como-objeto)
- [4.2. Acceder a los campos: `form.elements`](#42-acceder-a-los-campos-formelements)
- [4.3. Leer y escribir valores](#43-leer-y-escribir-valores)
  - [4.3.1. Campos de texto y números](#431-campos-de-texto-y-números)
  - [4.3.2. Casillas y botones de opción](#432-casillas-y-botones-de-opción)
  - [4.3.3. Listas desplegables](#433-listas-desplegables)
- [4.4. `FormData`: todos los datos de una vez](#44-formdata-todos-los-datos-de-una-vez)
- [4.5. Eventos del formulario: `input`, `change`, `submit` y `reset`](#45-eventos-del-formulario-input-change-submit-y-reset)
- [4.6. Modificar apariencia y comportamiento](#46-modificar-apariencia-y-comportamiento)
- [4.7. Campos dinámicos](#47-campos-dinámicos)
- [4.8. Ejemplo integrador: configurador de pedido](#48-ejemplo-integrador-configurador-de-pedido)
- [Resumen](#resumen)
- [Ejercicios de reflexión](#ejercicios-de-reflexión)

> **CE que trabaja este tema:** RA5 e.

---

## 4.1. El formulario como objeto

Un `<form>` es un objeto `HTMLFormElement` con propiedades y métodos propios para trabajar con sus campos. Sin JavaScript, un formulario ya sabe **recoger** los datos de sus campos y **enviarlos** al servidor. Con JavaScript puedes leerlos y cambiarlos, reaccionar a cada cambio, decidir si se envían y cómo.

| Propiedad o método de `HTMLFormElement` | Qué es o qué hace |
|-----------------------------------------|-------------------|
| `elements` | Colección con todos sus campos (apartado 4.2) |
| `length` | Número de campos |
| `action`, `method` | Adónde y cómo se envía (`get` o `post`) |
| `noValidate` | Refleja el atributo `novalidate` (tema 5) |
| `submit()` | Envía **sin** lanzar `submit` y **sin** validar |
| `requestSubmit()` | Envía como si se pulsara el botón: valida y lanza `submit` |
| `reset()` | Devuelve los campos a sus valores iniciales y lanza `reset` |
| `checkValidity()`, `reportValidity()` | Validan todos los campos (tema 5) |

```html
<form id="registro" action="/registro" method="post">
  <label for="nombre">Nombre</label>
  <input id="nombre" name="nombre" required>

  <label for="edad">Edad</label>
  <input id="edad" name="edad" type="number" min="16">

  <fieldset>
    <legend>Turno</legend>
    <label><input type="radio" name="turno" value="manana" checked> Mañana</label>
    <label><input type="radio" name="turno" value="tarde"> Tarde</label>
  </fieldset>

  <label><input type="checkbox" name="boletin"> Quiero recibir el boletín</label>

  <label for="ciclo">Ciclo</label>
  <select id="ciclo" name="ciclo">
    <option value="">Elige uno</option>
    <option value="daw">DAW</option>
    <option value="dam">DAM</option>
  </select>

  <button>Enviar</button>
</form>
```

Este formulario se usa en los ejemplos de todo el tema.

> 📝 **Nota del Profesor**: El atributo **`name`** es el que importa para los datos: es la clave con la que se envía cada campo y con la que lo encuentras en `form.elements` y en `FormData`. El `id` sirve para el `<label for>` y para el CSS. Un campo **sin `name` no se envía**.

---

## 4.2. Acceder a los campos: `form.elements`

| Forma | Ejemplo |
|-------|---------|
| Por `id` (como cualquier elemento) | `document.querySelector('#registro')` |
| Colección de formularios | `document.forms.registro` o `document.forms[0]` |
| Un campo por su `name` | `formulario.elements.nombre` o `formulario.elements['nombre']` |
| Un campo por posición | `formulario.elements[0]` |
| Recorrer todos | `for (const campo of formulario.elements) { … }` |

```js
const formulario = document.forms.registro;
const { nombre, edad, turno, boletin, ciclo } = formulario.elements; // desestructuración (UD2)

console.log(formulario.elements.length);   // 8: incluye el fieldset, los dos botones de opción y el botón
console.log(nombre.tagName, nombre.type);  // INPUT text
console.log(turno);                        // RadioNodeList [input, input]
```

`elements` es una `HTMLFormControlsCollection`: incluye los campos (`input`, `select`, `textarea`), los botones, los `fieldset` y los `output`, pero **no** las etiquetas `<label>`. Cuando varios campos comparten `name` (botones de opción, casillas), `elements.turno` devuelve una **`RadioNodeList`** con todos ellos.

Cada campo conoce también **su formulario**: `campo.form`. Es útil en un oyente delegado o en una función que recibe solo el campo.

> ⚠️ **Cuidado**: No pongas a un campo `name="submit"`, `name="reset"` o `name="action"`. Las propiedades de `elements` y del propio formulario por nombre **tapan** los métodos y propiedades del mismo nombre, y `formulario.submit()` deja de funcionar porque `formulario.submit` es el campo.

---

## 4.3. Leer y escribir valores

### 4.3.1. Campos de texto y números

| Propiedad | Qué es |
|-----------|--------|
| `value` | El valor actual, **siempre texto** (aunque sea `type="number"`) |
| `defaultValue` | El valor inicial (el atributo `value`); `reset()` vuelve a él |
| `valueAsNumber` | En `number`, `range` y fechas: el valor como número (`NaN` si está vacío) |
| `valueAsDate` | En `date`, `time`…: el valor como `Date` (o `null`) |
| `placeholder`, `maxLength`, `min`, `max`… | Reflejan sus atributos |

```js
edad.value = '17';
console.log(edad.value, typeof edad.value);               // 17 string
console.log(edad.valueAsNumber, typeof edad.valueAsNumber); // 17 number
console.log(Number(edad.value) + 1);                      // 18 (con value hay que convertir)

nombre.value = 'Ana';        // cambia el valor desde el código
console.log(nombre.defaultValue); // '' : el inicial no cambia
```

> ⚠️ **Cuidado**: Cambiar `value` desde el código **no** lanza `input` ni `change`. Si otros oyentes dependen de esos eventos (un contador, un total), llama a la misma función que ellos o lanza el evento con `dispatchEvent` (tema 3).

### 4.3.2. Casillas y botones de opción

En las casillas (`checkbox`) y los botones de opción (`radio`), lo que cambia es **`checked`** (booleano). Su `value` es fijo: lo que se enviará si está marcado.

```js
console.log(boletin.checked);  // false
boletin.checked = true;        // la marca desde el código

console.log(turno.value);      // 'manana': el value del botón marcado (RadioNodeList)
turno.value = 'tarde';         // marca el botón cuyo value es 'tarde'

const turnoElegido = formulario.querySelector('input[name="turno"]:checked')?.value; // alternativa con selector
```

Para un grupo de casillas con el mismo `name` (elegir varios idiomas, por ejemplo), se recogen las marcadas:

```js
const idiomas = [...formulario.querySelectorAll('input[name="idioma"]:checked')].map((casilla) => casilla.value);
```

### 4.3.3. Listas desplegables

| Propiedad de `<select>` | Qué es |
|-------------------------|--------|
| `value` | El `value` de la opción elegida |
| `selectedIndex` | La posición de la opción elegida (`-1` si ninguna) |
| `options` | Colección de sus `<option>` |
| `selectedOptions` | Las opciones elegidas (en un `<select multiple>`, varias) |

```js
ciclo.value = 'dam';
console.log(ciclo.selectedIndex);                 // 2
console.log(ciclo.options[ciclo.selectedIndex].text); // 'DAM': el texto visible

ciclo.append(new Option('ASIR', 'asir'));         // añadir una opción: new Option(texto, valor)
```

| Tipo de campo | Qué leer | Qué escribir |
|---------------|----------|--------------|
| Texto, correo, contraseña, `textarea` | `value` | `value` |
| Número, rango, fecha | `value` o `valueAsNumber` / `valueAsDate` | `value` |
| Casilla | `checked` | `checked` |
| Botones de opción | `elements.nombre.value` | `elements.nombre.value` o `checked` en uno |
| `<select>` | `value`, `selectedIndex` | `value` |
| `<select multiple>` | `selectedOptions` | `selected` en cada opción |
| Fichero | `files` (lista de `File`) | No se puede escribir |

> 💡 **Tip del Examinador**: "¿Cómo sabes qué botón de opción está marcado?" → Con `formulario.elements.nombreDelGrupo.value` (la `RadioNodeList` devuelve el `value` del marcado) o con `querySelector('input[name="…"]:checked')`.

---

## 4.4. `FormData`: todos los datos de una vez

`FormData` recoge **todos los campos con `name`** de un formulario tal y como se enviarían.

```js
const datos = new FormData(formulario);

console.log(datos.get('nombre'));     // 'Ana'
console.log(datos.get('boletin'));    // 'on' si está marcada; null si no
console.log(datos.has('boletin'));    // false si no está marcada
console.log(datos.getAll('idioma'));  // ['es', 'en']: todos los valores de un nombre repetido

for (const [clave, valor] of datos) {
  console.log(`${clave} = ${valor}`);
}

const objeto = Object.fromEntries(datos); // { nombre: 'Ana', edad: '17', turno: 'manana', ciclo: 'dam' }
```

| Detalle | Qué pasa |
|---------|----------|
| Campo sin `name` | No aparece |
| Campo `disabled` | No aparece |
| Casilla sin marcar | No aparece |
| Casilla marcada sin `value` | Aparece con el valor `'on'` |
| Nombres repetidos | `get` devuelve el primero; `getAll`, todos; `Object.fromEntries` se queda con el **último** |
| Valores | Siempre texto (o `File` en los campos de fichero) |

`FormData` es lo que enviarás al servidor con `fetch` en la UD7. También se puede construir vacío y rellenar con `append(clave, valor)` y `set(clave, valor)`.

> ⚠️ **Cuidado**: Los campos `disabled` no se envían ni aparecen en `FormData`. Si quieres que un campo no se pueda editar pero que **sí** se envíe, usa `readOnly` en lugar de `disabled`.

---

## 4.5. Eventos del formulario: `input`, `change`, `submit` y `reset`

| Evento | Sobre | Úsalo para |
|--------|-------|------------|
| `input` | Cada campo (sube al formulario) | Reaccionar **mientras** se escribe: contadores, totales, validación en vivo |
| `change` | Cada campo (sube) | Reaccionar al valor **confirmado**: casillas, `<select>`, al salir de un campo de texto |
| `submit` | El formulario | Interceptar el envío: validar, recoger datos, enviar con JavaScript |
| `reset` | El formulario | Limpiar mensajes y estado propio al restablecer |

Como `input` y `change` **suben**, un único oyente en el formulario sirve para todos sus campos (delegación):

```js
formulario.addEventListener('input', (evento) => {
  console.log(`Ha cambiado ${evento.target.name}: ${evento.target.value}`);
});
```

El evento `submit` se lanza en el **formulario**, no en el botón. Escuchar el `click` del botón es un error: el formulario también se envía pulsando Intro en un campo, y entonces no hay clic. El objeto es un `SubmitEvent`, con `evento.submitter`: el botón que lo envió (o `null`).

```js
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();                        // no recargar la página
  const datos = new FormData(formulario);
  console.log('Enviado con', evento.submitter?.textContent, Object.fromEntries(datos));
});

formulario.addEventListener('reset', () => {
  document.querySelector('#mensaje').textContent = '';
});
```

> 💡 **Tip del Examinador**: "¿Por qué se escucha `submit` en el formulario y no `click` en el botón?" → Porque un formulario se puede enviar de varias formas (botón, Intro en un campo, `requestSubmit()`), y todas lanzan `submit` en el formulario. El clic del botón solo cubre una de ellas.

---

## 4.6. Modificar apariencia y comportamiento

Desde el código se puede cambiar **cómo se ve** y **cómo se comporta** cada campo:

| Propiedad o método | Efecto |
|--------------------|--------|
| `disabled` | Desactiva el campo (no se edita, no recibe el foco, no se envía). En un `<fieldset>`, desactiva todos sus campos |
| `readOnly` | No se puede editar, pero recibe el foco y se envía |
| `required` | Obligatorio (validación, tema 5) |
| `hidden` | Lo oculta (también a su `<label>` si los envuelve un contenedor oculto) |
| `classList` | Clases de estado para el CSS (`error`, `valido`) |
| `focus()` | Le pone el foco |
| `select()` | Selecciona todo su texto |
| `setSelectionRange(inicio, fin)` | Selecciona una parte o coloca el cursor |
| `placeholder`, `min`, `max`, `maxLength`, `step` | Cambian sus restricciones |

```js
// Si elige «Otro», aparece un campo obligatorio para especificarlo
const como = formulario.elements.como;         // <select> «¿Cómo nos conociste?»
const otro = formulario.elements.otro;         // <input> dentro de <p id="bloque-otro" hidden>

como.addEventListener('change', () => {
  const esOtro = como.value === 'otro';
  document.querySelector('#bloque-otro').hidden = !esOtro;
  otro.required = esOtro;
  otro.disabled = !esOtro;                     // si no se usa, que no se envíe
  if (esOtro) otro.focus();
});
```

```js
// Desactivar un bloque entero según una casilla
formulario.elements.facturaEmpresa.addEventListener('change', (evento) => {
  document.querySelector('#datos-empresa').disabled = !evento.target.checked; // <fieldset id="datos-empresa">
});
```

> ✅ **Buena práctica**: Igual que en la UD5, el aspecto lo decide el CSS: el código cambia **estados** (`disabled`, `required`, `hidden`, una clase) y el CSS los pinta. Los formularios tienen además pseudoclases propias para esos estados: `:disabled`, `:checked`, `:required`, `:read-only`, `:focus-visible`, `:valid` e `:invalid` (tema 5).

---

## 4.7. Campos dinámicos

Hay formularios en los que el número de campos depende del usuario: varias líneas de pedido, varios teléfonos, varios acompañantes. La receta:

1. Un **`<template>`** con el bloque de campos (UD5).
2. Al pulsar «Añadir», clonar la plantilla, dar a los campos **nombres** coherentes y añadirla.
3. Un único oyente en el contenedor (delegación) para los botones «Quitar».

```html
<fieldset id="telefonos">
  <legend>Teléfonos</legend>
  <button type="button" id="anadir-telefono">Añadir teléfono</button>
</fieldset>

<template id="plantilla-telefono">
  <p class="telefono">
    <label>Teléfono <input type="tel" name="telefono"></label>
    <button type="button" class="quitar">Quitar</button>
  </p>
</template>
```

```js
const contenedor = document.querySelector('#telefonos');
const plantilla = document.querySelector('#plantilla-telefono');
const MAXIMO = 3;

function actualizarBoton() {
  document.querySelector('#anadir-telefono').disabled = contenedor.querySelectorAll('.telefono').length >= MAXIMO;
}

document.querySelector('#anadir-telefono').addEventListener('click', () => {
  const bloque = plantilla.content.cloneNode(true);
  const campo = bloque.querySelector('input');
  contenedor.querySelector('#anadir-telefono').before(bloque);
  campo.focus();
  actualizarBoton();
});

contenedor.addEventListener('click', (evento) => {
  const quitar = evento.target.closest('.quitar');
  if (!quitar) return;
  quitar.closest('.telefono').remove();
  actualizarBoton();
});
```

Todos los campos se llaman `telefono`, así que `new FormData(formulario).getAll('telefono')` devuelve la lista. Si cada bloque tiene varios campos relacionados (producto y cantidad), se pueden numerar los nombres (`lineas[0][producto]`) o recorrer los bloques y leer sus campos con `querySelector` dentro de cada uno.

> ⚠️ **Cuidado**: Si los bloques clonados llevan `id`, se repetirán. Usa clases dentro de la plantilla y, si necesitas `id` (para un `<label for>`), genera uno distinto en cada clon o envuelve el campo con el `<label>`, como en el ejemplo.

---

## 4.8. Ejemplo integrador: configurador de pedido

Un configurador de menú que calcula el precio en vivo, con campos que aparecen según lo elegido, y que al enviar muestra un resumen con `FormData`.

```html
<form id="pedido">
  <label for="menu">Menú</label>
  <select id="menu" name="menu" required>
    <option value="">Elige un menú</option>
    <option value="clasico" data-precio="9.5">Clásico · 9,50 €</option>
    <option value="vegetal" data-precio="8.9">Vegetal · 8,90 €</option>
  </select>

  <label for="cantidad">Cantidad</label>
  <input id="cantidad" name="cantidad" type="number" min="1" max="20" value="1">

  <fieldset>
    <legend>Extras (1 € cada uno)</legend>
    <label><input type="checkbox" name="extra" value="patatas"> Patatas</label>
    <label><input type="checkbox" name="extra" value="postre"> Postre</label>
  </fieldset>

  <label><input type="checkbox" name="domicilio"> Envío a domicilio (+2 €)</label>
  <p id="bloque-direccion" hidden>
    <label for="direccion">Dirección</label>
    <input id="direccion" name="direccion" disabled>
  </p>

  <output id="total" for="menu cantidad">0,00 €</output>
  <button>Pedir</button>
</form>
<pre id="resumen"></pre>
```

```js
// pedido.js (módulo)
const formulario = document.forms.pedido;
const { menu, cantidad, domicilio, direccion } = formulario.elements;
const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }); // UD4

function calcularTotal() {
  const precio = Number(menu.selectedOptions[0]?.dataset.precio ?? 0);
  const extras = formulario.querySelectorAll('input[name="extra"]:checked').length;
  const unidades = Number.isNaN(cantidad.valueAsNumber) ? 0 : cantidad.valueAsNumber;
  return (precio + extras) * unidades + (domicilio.checked ? 2 : 0);
}

// Un oyente para todos los campos: input y change suben hasta el formulario
formulario.addEventListener('input', () => {
  document.querySelector('#total').value = euros.format(calcularTotal());
});

domicilio.addEventListener('change', () => {
  document.querySelector('#bloque-direccion').hidden = !domicilio.checked;
  direccion.disabled = !domicilio.checked;
  direccion.required = domicilio.checked;
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(formulario);
  const resumen = {
    menu: datos.get('menu'),
    cantidad: Number(datos.get('cantidad')),
    extras: datos.getAll('extra'),
    direccion: datos.get('direccion') ?? 'recoger en tienda',
    total: euros.format(calcularTotal()),
  };
  document.querySelector('#resumen').textContent = JSON.stringify(resumen, null, 2);
});

formulario.addEventListener('reset', () => {
  document.querySelector('#total').value = euros.format(0);
  document.querySelector('#bloque-direccion').hidden = true;
  direccion.disabled = true;
});
```

```text
// #resumen tras pedir 2 menús clásicos con patatas y envío a domicilio:
{
  "menu": "clasico",
  "cantidad": 2,
  "extras": [
    "patatas"
  ],
  "direccion": "Calle Mayor, 1",
  "total": "23,00 €"
}
```

| Capacidad | Dónde |
|-----------|-------|
| Acceder a los campos por nombre | `formulario.elements` con desestructuración |
| Leer cada tipo de campo | `selectedOptions`, `valueAsNumber`, `:checked`, `checked` |
| Delegación de `input` | Un oyente en el formulario recalcula el total |
| Modificar el comportamiento | `hidden`, `disabled` y `required` según la casilla |
| Interceptar el envío | `submit` + `preventDefault()` |
| Recoger los datos | `FormData` con `get` y `getAll` |
| Restablecer | Evento `reset` para limpiar el estado propio |
| Mostrar un resultado calculado | `<output>` |

Fíjate en que el resumen no incluye la dirección si no se marca el envío: el campo está `disabled` y `FormData` no lo recoge.

---

## Resumen

- Un `<form>` es un `HTMLFormElement` con `elements`, `submit()`, `requestSubmit()`, `reset()` y los métodos de validación.
- `form.elements.nombre` da un campo por su `name`; si el nombre se repite, una `RadioNodeList`. Cada campo conoce su `form`.
- `value` es siempre texto; `valueAsNumber` y `valueAsDate` para números y fechas; `checked` para casillas y botones de opción; `selectedIndex` y `selectedOptions` para `<select>`.
- Cambiar `value` desde el código no lanza `input` ni `change`.
- `FormData` recoge los campos con `name`, sin los `disabled` ni las casillas sin marcar; `get`, `getAll`, `has` y `Object.fromEntries`.
- `input` y `change` suben: un oyente en el formulario sirve para todos los campos. El envío se escucha en `submit` del formulario (`evento.submitter` es el botón).
- Se modifica el comportamiento con `disabled`, `readOnly`, `required`, `hidden` y `focus()`, y el aspecto con clases y pseudoclases.
- Los campos dinámicos se crean desde un `<template>` y se quitan con delegación.

## Ejercicios de reflexión

1. ¿Qué diferencia hay entre `campo.value` y `campo.defaultValue` después de escribir en el campo? ¿Y después de `form.reset()`?
2. Pon `disabled` y luego `readOnly` a un campo y mira qué recoge `FormData` en cada caso. ¿Cuándo usarías cada uno?
3. ¿Por qué `formulario.submit()` puede fallar con «`submit` is not a function»? ¿Cómo lo evitas?
4. ¿Qué devuelve `Object.fromEntries(new FormData(f))` si hay tres casillas `idioma` marcadas? ¿Cómo obtienes las tres?
5. Explica qué pasa si escuchas `click` en el botón de envío en lugar de `submit` en el formulario y el usuario pulsa Intro en un campo de texto.

---

[⬅️ Volver a la unidad](./README.md)
