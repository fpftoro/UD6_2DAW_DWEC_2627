# 6. Expresiones regulares

[⬅️ Volver a la unidad](./README.md)

## Índice

- [6.1. Qué es una expresión regular](#61-qué-es-una-expresión-regular)
- [6.2. Crear expresiones regulares](#62-crear-expresiones-regulares)
- [6.3. La sintaxis de los patrones](#63-la-sintaxis-de-los-patrones)
  - [6.3.1. Caracteres y clases](#631-caracteres-y-clases)
  - [6.3.2. Anclas](#632-anclas)
  - [6.3.3. Cuantificadores](#633-cuantificadores)
  - [6.3.4. Grupos y alternativas](#634-grupos-y-alternativas)
  - [6.3.5. Comprobaciones hacia delante y hacia atrás](#635-comprobaciones-hacia-delante-y-hacia-atrás)
- [6.4. _Flags_](#64-flags)
- [6.5. Métodos que usan expresiones regulares](#65-métodos-que-usan-expresiones-regulares)
  - [6.5.1. `test`: ¿encaja?](#651-test-encaja)
  - [6.5.2. `match` y `matchAll`: extraer](#652-match-y-matchall-extraer)
  - [6.5.3. `replace` y `replaceAll`: sustituir](#653-replace-y-replaceall-sustituir)
  - [6.5.4. `split` y `search`](#654-split-y-search)
- [6.6. El atributo `pattern`](#66-el-atributo-pattern)
- [6.7. Patrones habituales](#67-patrones-habituales)
  - [6.7.1. DNI y NIE con su letra de control](#671-dni-y-nie-con-su-letra-de-control)
- [6.8. Buenas prácticas y trampas](#68-buenas-prácticas-y-trampas)
- [6.9. Ejemplo integrador: módulo de validadores](#69-ejemplo-integrador-módulo-de-validadores)
- [Resumen](#resumen)
- [Ejercicios de reflexión](#ejercicios-de-reflexión)

> **CE que trabaja este tema:** RA5 g.

---

## 6.1. Qué es una expresión regular

Una **expresión regular** (*regular expression*, *regex*) es un **patrón** que describe un conjunto de textos: «cinco cifras», «una palabra que empieza por mayúscula», «algo con forma de correo». En la UD4 viste dos ejemplos; aquí aprendes a escribirlas y a usarlas para **validar**, **buscar**, **extraer** y **sustituir**.

```js
const codigoPostal = /^\d{5}$/;
console.log(codigoPostal.test('41001')); // true
console.log(codigoPostal.test('4100'));  // false: solo cuatro cifras
console.log(codigoPostal.test('41001a')); // false: sobra la a
```

| Sin expresión regular | Con expresión regular |
|-----------------------|-----------------------|
| `texto.length === 5 && [...texto].every((c) => c >= '0' && c <= '9')` | `/^\d{5}$/.test(texto)` |

Son un **lenguaje dentro del lenguaje**: compactas y potentes, pero difíciles de leer si se abusa de ellas. Para probarlas, usa una herramienta como **regex101.com** (elige el modo *ECMAScript (JavaScript)*): explica cada parte del patrón y muestra las coincidencias al momento.

---

## 6.2. Crear expresiones regulares

| Forma | Ejemplo | Cuándo |
|-------|---------|--------|
| **Literal** | `/^\d{5}$/i` | El patrón es fijo (lo habitual) |
| **Constructor** | `new RegExp('^\\d{5}$', 'i')` | El patrón se construye en tiempo de ejecución (por ejemplo, con lo que escribe el usuario) |

```js
const palabra = 'gato';
const buscar = new RegExp(`\\b${palabra}\\b`, 'gi'); // la palabra completa, sin distinguir mayúsculas
console.log('El Gato y el gatopardo'.match(buscar)); // [ 'Gato' ]
```

> ⚠️ **Cuidado**: En el constructor el patrón es una **cadena**, así que las barras invertidas se escriben **dobles**: `'\\d'` para `\d`. Y si el patrón incluye texto del usuario, sus caracteres especiales (`.`, `*`, `(`…) se interpretarían como parte del patrón: hay que **escaparlos** con `RegExp.escape` (apartado 6.8).

---

## 6.3. La sintaxis de los patrones

### 6.3.1. Caracteres y clases

| Patrón | Encaja con | Ejemplo |
|--------|-----------|---------|
| `abc` | Exactamente «abc» | `/hola/` |
| `.` | Cualquier carácter salvo el salto de línea | `/c.sa/` → casa, cosa, c-sa |
| `[abc]` | Uno de esos caracteres | `/[aeiou]/` → una vocal |
| `[a-z]`, `[0-9]` | Uno del rango | `/[A-Z]/` → una mayúscula |
| `[^abc]` | Cualquiera **menos** esos | `/[^0-9]/` → algo que no es una cifra |
| `\d`, `\D` | Una cifra / algo que no es cifra | `/\d\d/` |
| `\w`, `\W` | Letra inglesa, cifra o `_` / lo contrario | `/\w+/` |
| `\s`, `\S` | Espacio en blanco (espacio, tabulador, salto de línea) / lo contrario | `/\s+/` |
| `\p{L}` | Cualquier letra de cualquier idioma (con el _flag_ `u` o `v`) | `/^\p{L}+$/u` → «Begoña» |
| `\.`, `\*`, `\(`… | El carácter literal | `/\d+\.\d{2}/` → 12.50 |

Los **caracteres especiales** que hay que escapar con `\` para usarlos literalmente son: `. * + ? ^ $ { } ( ) [ ] | / \`.

> ⚠️ **Cuidado**: `\w` **no** incluye la ñ ni las vocales con tilde: `/^\w+$/.test('Begoña')` es `false`. Para nombres en español usa `\p{L}` con el _flag_ `u` o una clase explícita como `[a-záéíóúüñ]` con el _flag_ `i`. Lo mismo pasa con `\b`: para él, la «í» de «María» no es una letra y hay un límite de palabra en medio.

### 6.3.2. Anclas

| Patrón | Posición |
|--------|----------|
| `^` | Principio del texto (o de cada línea con el _flag_ `m`) |
| `$` | Final del texto (o de cada línea con el _flag_ `m`) |
| `\b` | Límite de palabra |

```js
console.log(/\d{5}/.test('Mi CP es 41001'));   // true: hay cinco cifras en algún sitio
console.log(/^\d{5}$/.test('Mi CP es 41001')); // false: el texto entero no son cinco cifras
```

> 💡 **Tip del Examinador**: "¿Por qué los patrones de validación empiezan por `^` y acaban en `$`?" → Para que el patrón encaje con el **texto entero**. Sin anclas, `/\d{5}/` acepta «abc41001xyz», porque solo comprueba que haya cinco cifras **en alguna parte**.

### 6.3.3. Cuantificadores

| Cuantificador | Veces | Ejemplo |
|---------------|-------|---------|
| `*` | 0 o más | `/ab*c/` → ac, abc, abbc |
| `+` | 1 o más | `/\d+/` → 7, 42, 2024 |
| `?` | 0 o 1 (opcional) | `/colou?r/` → color, colour |
| `{n}` | Exactamente n | `/\d{4}/` |
| `{n,}` | n o más | `/\w{8,}/` |
| `{n,m}` | Entre n y m | `/\d{2,4}/` |

Los cuantificadores son **voraces** (*greedy*): cogen todo lo que pueden. Con un `?` detrás pasan a ser **perezosos** (*lazy*) y cogen lo mínimo:

```js
const html = '<b>uno</b> y <b>dos</b>';
console.log(html.match(/<b>.*<\/b>/)[0]);  // '<b>uno</b> y <b>dos</b>' (voraz: hasta el último </b>)
console.log(html.match(/<b>.*?<\/b>/)[0]); // '<b>uno</b>' (perezoso: hasta el primero)
```

### 6.3.4. Grupos y alternativas

| Patrón | Qué hace |
|--------|----------|
| `(…)` | **Grupo de captura**: agrupa y guarda lo que encaja (`$1`, `$2`… o `[1]`, `[2]` en el resultado) |
| `(?<nombre>…)` | **Grupo con nombre** (ES2018): se lee en `resultado.groups.nombre` |
| `(?:…)` | Agrupa **sin** capturar (para aplicar un cuantificador o una alternativa) |
| `a\|b` | **Alternativa**: a o b |
| `\1`, `\k<nombre>` | Referencia a lo capturado por un grupo, dentro del mismo patrón |

```js
const fecha = /^(?<dia>\d{2})\/(?<mes>\d{2})\/(?<anio>\d{4})$/;
const resultado = '07/03/2025'.match(fecha);
console.log(resultado[1], resultado.groups.anio); // '07' '2025'

const telefono = /^(?:\+34)?[6-9]\d{8}$/; // prefijo opcional, sin capturarlo
console.log(telefono.test('+34612345678'), telefono.test('512345678')); // true false

console.log(/^(gato|perro)s?$/.test('perros')); // true
```

### 6.3.5. Comprobaciones hacia delante y hacia atrás

Las **comprobaciones** (*lookahead* y *lookbehind*) miran si algo aparece (o no) en una posición **sin consumir** caracteres. Son la forma de exigir varias condiciones a la vez:

| Patrón | Significa |
|--------|-----------|
| `(?=…)` | Lo que sigue encaja con … |
| `(?!…)` | Lo que sigue **no** encaja con … |
| `(?<=…)` | Lo anterior encaja con … (ES2018) |
| `(?<!…)` | Lo anterior **no** encaja con … (ES2018) |

```js
// Contraseña: al menos 8 caracteres, con una minúscula, una mayúscula y una cifra
const claveSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
console.log(claveSegura.test('abcdefgh'));  // false: sin mayúscula ni cifra
console.log(claveSegura.test('Abcdefg1'));  // true

console.log('Total: 25 € y 30 €'.match(/\d+(?= €)/g)); // [ '25', '30' ]: cifras seguidas de « €»
```

Cada `(?=.*X)` se coloca al principio y comprueba que **en algún sitio** del texto hay una X; luego `.{8,}` comprueba la longitud.

> ✅ **Buena práctica**: Una expresión con cuatro comprobaciones funciona, pero el mensaje de error solo puede decir «la contraseña no es segura». Si quieres decir **qué** falta, comprueba cada condición por separado (`/[A-Z]/.test(clave)`…) y construye el mensaje.

---

## 6.4. _Flags_

Los **_flags_** (modificadores) se escriben tras la barra final (`/patrón/gi`) o como segundo argumento del constructor.

| _Flag_ | Nombre | Qué hace |
|:------:|--------|----------|
| `g` | *global* | Busca **todas** las coincidencias, no solo la primera |
| `i` | *ignore case* | No distingue mayúsculas de minúsculas |
| `m` | *multiline* | `^` y `$` encajan al principio y final de **cada línea** |
| `s` | *dotAll* (ES2018) | `.` encaja también con el salto de línea |
| `u` | *unicode* (ES2015) | Trata el texto como Unicode completo y permite `\p{…}` |
| `v` | *unicodeSets* (ES2024) | Como `u`, con más operaciones en las clases; lo usa el atributo `pattern` |
| `y` | *sticky* | La coincidencia tiene que empezar justo en `lastIndex` |
| `d` | *indices* (ES2022) | El resultado incluye las posiciones de inicio y fin de cada grupo |

```js
console.log('Hola hola HOLA'.match(/hola/gi)); // [ 'Hola', 'hola', 'HOLA' ]
console.log(/^\p{Lu}/u.test('Ángel'));         // true: empieza por mayúscula (de cualquier idioma)
```

---

## 6.5. Métodos que usan expresiones regulares

| Método | De | Devuelve | Para |
|--------|----|----------|------|
| `regex.test(texto)` | `RegExp` | `true` / `false` | **Validar** |
| `regex.exec(texto)` | `RegExp` | Una coincidencia con sus grupos, o `null` | Extraer una a una (forma clásica) |
| `texto.match(regex)` | `String` | Sin `g`: una coincidencia con grupos. Con `g`: un array de textos. Sin coincidencias: `null` | **Extraer** |
| `texto.matchAll(regex)` | `String` | Un iterador de coincidencias con sus grupos (el patrón debe tener `g`) | **Extraer todas con grupos** |
| `texto.replace(regex, nuevo)` | `String` | Un texto nuevo | **Sustituir** (todas con `g`) |
| `texto.replaceAll(regex, nuevo)` | `String` | Un texto nuevo | Sustituir todas (el patrón debe tener `g`) |
| `texto.split(regex)` | `String` | Un array | **Trocear** |
| `texto.search(regex)` | `String` | La posición de la primera coincidencia o `-1` | Localizar |

### 6.5.1. `test`: ¿encaja?

```js
const matricula = /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/; // matrícula española actual: 4 cifras y 3 consonantes
console.log(matricula.test('1234BCD')); // true
console.log(matricula.test('1234ABC')); // false: la A no se usa
```

### 6.5.2. `match` y `matchAll`: extraer

```js
const texto = 'Pedidos #120, #75 y #3021';

console.log(texto.match(/#\d+/));   // [ '#120', index: 8, … ]: la primera, con información
console.log(texto.match(/#\d+/g));  // [ '#120', '#75', '#3021' ]: todas, solo el texto
console.log(texto.match(/@\w+/g));  // null: ninguna (cuidado al recorrer el resultado)

for (const coincidencia of texto.matchAll(/#(?<numero>\d+)/g)) {
  console.log(`Pedido ${coincidencia.groups.numero} en la posición ${coincidencia.index}`);
}
// Pedido 120 en la posición 8
// Pedido 75 en la posición 14
// Pedido 3021 en la posición 20
```

> ⚠️ **Cuidado**: `match` devuelve `null` si no encuentra nada, no un array vacío. `texto.match(/x/g).length` lanza un `TypeError` cuando no hay coincidencias; escribe `(texto.match(/x/g) ?? []).length`.

### 6.5.3. `replace` y `replaceAll`: sustituir

En el texto de sustitución, `$1`, `$2`… insertan lo capturado por cada grupo y `$<nombre>` lo de un grupo con nombre. También se puede pasar una **función**, que recibe la coincidencia y sus grupos y devuelve el texto nuevo.

```js
console.log('2025-03-07'.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')); // '07/03/2025'

console.log('  muchos    espacios   aquí '.trim().replace(/\s+/g, ' ')); // 'muchos espacios aquí'

const formatear = (telefono) => telefono.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3');
console.log(formatear('612345678')); // '612 345 678'

// Con una función: poner en mayúscula la primera letra de cada palabra (una letra sin otra letra delante)
console.log('maría del mar'.replace(/(?<!\p{L})\p{L}/gu, (letra) => letra.toUpperCase())); // 'María Del Mar'
```

> 📝 **Nota del Profesor**: Sin el _flag_ `g`, `replace` cambia solo la **primera** coincidencia. Es uno de los errores más frecuentes: `'a-b-c'.replace(/-/, ' ')` da `'a b-c'`.

### 6.5.4. `split` y `search`

```js
console.log('rojo, verde;azul  amarillo'.split(/[,;\s]+/)); // [ 'rojo', 'verde', 'azul', 'amarillo' ]
console.log('Hola Mundo'.search(/mundo/i));                  // 5
```

---

## 6.6. El atributo `pattern`

El atributo `pattern` de un `<input>` valida con una expresión regular **sin JavaScript** (tema 5). Tres diferencias con una expresión de JavaScript:

| `pattern` | Por qué importa |
|-----------|-----------------|
| Se escribe **sin barras** ni _flags_ | `pattern="\d{5}"`, no `pattern="/\d{5}/"` |
| Está **anclado** automáticamente: tiene que encajar el valor entero | No hacen falta `^` ni `$` (no estorban) |
| Se evalúa con el _flag_ `v` | Dentro de una clase hay que escapar `-`, `(`, `)`, `[`, `{`, `/`, `\|`: `[\w\-\.]`, no `[\w-.]` |

```html
<input name="cp" pattern="(0[1-9]|[1-4]\d|5[0-2])\d{3}" title="Código postal español de cinco cifras">
```

El `title` se muestra en el mensaje del navegador cuando no encaja: úsalo para explicar el formato. Un campo vacío **no** se comprueba con `pattern`: si es obligatorio, añade `required`.

> ⚠️ **Cuidado**: Si el patrón tiene un error de sintaxis (por ejemplo, un `-` sin escapar dentro de una clase en modo `v`), el navegador lo **ignora** sin avisar y el campo acepta cualquier cosa. Comprueba siempre en la consola que `campo.validity.patternMismatch` se activa con un valor incorrecto.

---

## 6.7. Patrones habituales

| Dato | Expresión | Notas |
|------|-----------|-------|
| Código postal español | `/^(0[1-9]\|[1-4]\d\|5[0-2])\d{3}$/` | Las dos primeras cifras son la provincia (01 a 52) |
| Móvil o fijo español | `/^(?:\+34\|0034)?[6-9]\d{8}$/` | Quitar antes los espacios: `replace(/\s/g, '')` |
| Correo (práctico) | `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` | Algo, @, algo, punto y al menos dos caracteres. La única validación completa es enviar un correo de confirmación |
| Contraseña | `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/` | Mejor comprobar cada condición por separado para el mensaje |
| Matrícula actual | `/^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/` | Sin vocales, Ñ ni Q |
| Nombre de usuario | `/^[a-z][a-z0-9_]{2,15}$/` | Empieza por letra; de 3 a 16 caracteres |
| DNI | `/^\d{8}[A-Z]$/` | Más la letra de control (apartado 6.7.1) |
| NIE | `/^[XYZ]\d{7}[A-Z]$/` | Más la letra de control |

> 💡 **Tip del Examinador**: "¿Basta `/^\d{8}[A-Z]$/` para validar un DNI?" → No: comprueba el **formato**, pero no la **letra de control**. «12345678A» encaja y no es un DNI válido. La letra se calcula con el número (apartado 6.7.1).

### 6.7.1. DNI y NIE con su letra de control

La letra del DNI es la posición del **resto de dividir el número entre 23** en la cadena `TRWAGMYFPDXBNJZSQVHLCKE`. En el NIE, la letra inicial se cambia por una cifra (X → 0, Y → 1, Z → 2) y se calcula igual.

```js
const LETRAS = 'TRWAGMYFPDXBNJZSQVHLCKE';

/**
 * Comprueba un DNI o NIE: formato y letra de control.
 * @param {string} documento Admite minúsculas, espacios y guion: «12345678-z».
 * @returns {boolean}
 * @example
 * esDocumentoValido('12345678Z'); // true
 * esDocumentoValido('X1234567L'); // true
 */
export function esDocumentoValido(documento) {
  const limpio = documento.toUpperCase().replace(/[\s-]/g, '');
  const partes = limpio.match(/^(?<inicial>[XYZ]?)(?<numero>\d{7,8})(?<letra>[A-Z])$/);
  if (!partes) return false;
  const { inicial, numero, letra } = partes.groups;
  if (numero.length !== (inicial === '' ? 8 : 7)) return false; // DNI: 8 cifras · NIE: letra y 7 cifras
  const prefijo = inicial === '' ? '' : String('XYZ'.indexOf(inicial)); // X → 0, Y → 1, Z → 2
  return LETRAS[Number(prefijo + numero) % 23] === letra;
}

console.log(esDocumentoValido('12345678Z'));  // true
console.log(esDocumentoValido('12345678A'));  // false: letra incorrecta
console.log(esDocumentoValido('x-1234567-l')); // true: se limpia antes
console.log(esDocumentoValido('1234567Z'));   // false: un DNI tiene 8 cifras
```

La expresión regular comprueba la **forma** y separa las partes con grupos con nombre; la letra se comprueba con **código**. Es la combinación habitual: las expresiones regulares no saben hacer cuentas.

---

## 6.8. Buenas prácticas y trampas

**Escapar el texto del usuario.** Si construyes un patrón con lo que escribe el usuario (un buscador que resalta coincidencias), escapa sus caracteres especiales con `RegExp.escape` (ES2025):

```js
const busqueda = 'C++ (básico)';
const patron = new RegExp(RegExp.escape(busqueda), 'gi');
console.log(patron.test('Curso de C++ (básico)')); // true

// Sin escapar: new RegExp('C++ (básico)') lanza SyntaxError (Invalid regular expression … Nothing to repeat)
```

`RegExp.escape` es reciente (Baseline desde 2025). En navegadores que no lo tengan, la alternativa clásica es `texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`, donde `$&` es la coincidencia entera.

**`lastIndex` con el _flag_ `g`.** Una expresión con `g` **recuerda** dónde terminó la última búsqueda en su propiedad `lastIndex`, y `test` y `exec` siguen desde ahí:

```js
const conG = /a/g;
console.log(conG.test('aa'), conG.test('aa'), conG.test('aa')); // true true false
```

Para validar, **no** pongas `g`: no lo necesitas y provoca resultados alternos si reutilizas la expresión.

**Legibilidad.** Una expresión que nadie entiende es un error esperando a ocurrir:

- Ponle un **nombre** descriptivo (`const CODIGO_POSTAL = /…/`) y un comentario con ejemplos de lo que acepta y rechaza.
- Divide las validaciones complejas en varias comprobaciones sencillas.
- Escribe **tests** con casos válidos y no válidos, incluidos los límites (tema 7).

**Rendimiento.** Patrones con cuantificadores anidados como `/^(a+)+$/` pueden tardar segundos (o bloquear la página) con textos de pocas decenas de caracteres que **no** encajan: se llama *backtracking catastrófico* y es la base de un ataque de denegación de servicio (ReDoS). Evita anidar cuantificadores sobre lo mismo.

> ✅ **Buena práctica**: No intentes validar con una expresión regular lo que no se puede validar así. Un correo con forma correcta puede no existir; una fecha `31/02/2025` encaja con `\d{2}\/\d{2}\/\d{4}` y no existe. Usa la expresión para la **forma** y código (o `Date`, UD4) para el **significado**.

---

## 6.9. Ejemplo integrador: módulo de validadores

Un módulo de validadores puros, reutilizables en cualquier formulario y fáciles de probar (tema 7). Cada validador recibe el texto y devuelve un mensaje de error o `''`.

```js
// validadores.js
import { esDocumentoValido } from './documento.js';

/** Código postal: provincia 01–52 y tres cifras. */
const CODIGO_POSTAL = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
/** Teléfono español, con prefijo +34 opcional. Se quitan antes los espacios. */
const TELEFONO = /^(?:\+34)?[6-9]\d{8}$/;
/** Correo con forma práctica: algo@algo.algo. */
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * @callback Validador
 * @param {string} valor
 * @returns {string} Mensaje de error, o '' si es válido.
 */

/** @type {Object<string, Validador>} */
export const validadores = {
  documento: (valor) => (esDocumentoValido(valor) ? '' : 'El DNI o NIE no es válido.'),
  codigoPostal: (valor) => (CODIGO_POSTAL.test(valor) ? '' : 'Escribe un código postal de cinco cifras.'),
  telefono: (valor) =>
    TELEFONO.test(valor.replace(/\s/g, '')) ? '' : 'Escribe un teléfono de nueve cifras que empiece por 6, 7, 8 o 9.',
  correo: (valor) => (CORREO.test(valor.trim()) ? '' : 'Escribe un correo con el formato nombre@dominio.es.'),
  clave: (valor) => {
    const faltan = [
      [/.{8,}/, '8 caracteres'],
      [/[a-z]/, 'una minúscula'],
      [/[A-Z]/, 'una mayúscula'],
      [/\d/, 'una cifra'],
    ].filter(([regla]) => !regla.test(valor)).map(([, texto]) => texto);
    return faltan.length === 0 ? '' : `La contraseña necesita: ${faltan.join(', ')}.`;
  },
};
```

```js
// En el formulario: el campo dice qué validador usa con data-validar
formulario.addEventListener('input', (evento) => {
  const campo = evento.target;
  const validar = validadores[campo.dataset.validar];
  if (validar) campo.setCustomValidity(campo.value === '' ? '' : validar(campo.value)); // vacío: lo decide required
});
```

```html
<input name="dni" data-validar="documento" required aria-describedby="dni-error">
<input name="telefono" type="tel" data-validar="telefono" aria-describedby="telefono-error">
```

```js
console.log(validadores.clave('abc'));
// La contraseña necesita: 8 caracteres, una mayúscula, una cifra.
console.log(validadores.telefono('612 345 678')); // '' (válido)
console.log(validadores.codigoPostal('53001'));   // Escribe un código postal de cinco cifras.
```

| Técnica | Dónde |
|---------|-------|
| Constantes con nombre y comentario | `CODIGO_POSTAL`, `TELEFONO`, `CORREO` |
| Limpiar antes de validar | `replace(/\s/g, '')`, `trim()` |
| Forma con regex, significado con código | `esDocumentoValido` |
| Mensajes que dicen qué falta | `clave`: una regla por condición |
| Unir con el formulario | `data-validar` + `setCustomValidity` (tema 5): patrón Strategy de la UD3 |
| Fácil de probar | Funciones puras que reciben texto y devuelven texto |

---

## Resumen

- Una **expresión regular** describe un patrón de texto. Se crea con un literal (`/…/flags`) o con `new RegExp(cadena, flags)` (doblando las `\`).
- Sintaxis: clases (`[a-z]`, `\d`, `\w`, `\s`, `\p{L}`), anclas (`^`, `$`, `\b`), cuantificadores (`*`, `+`, `?`, `{n,m}`; perezosos con `?`), grupos (`(…)`, `(?<nombre>…)`, `(?:…)`), alternativas (`|`) y comprobaciones (`(?=…)`, `(?!…)`).
- _Flags_: `g`, `i`, `m`, `s`, `u`, `v`, `y`, `d`.
- Métodos: `test` para validar, `match`/`matchAll` para extraer, `replace`/`replaceAll` (con `$1`, `$<nombre>` o una función) para sustituir, `split` y `search`.
- `pattern` en el HTML: sin barras, anclado y con el _flag_ `v`.
- Para validar: anclas siempre, sin `g`, limpiar antes, forma con regex y significado con código (letra del DNI), mensajes concretos.
- Escapa el texto del usuario con `RegExp.escape` (ES2025); evita los cuantificadores anidados.

## Ejercicios de reflexión

1. Escribe una expresión para un código de asignatura con el formato `DWEC-0612` (letras mayúsculas, guion y cuatro cifras) y pruébala en regex101 con cinco ejemplos válidos y cinco no válidos.
2. ¿Qué devuelve `'a1b2c3'.replace(/\d/, '')`? ¿Y con el _flag_ `g`? ¿Y con `replaceAll` sin `g`?
3. ¿Por qué `/^\w+$/` rechaza «Begoña»? Escribe una alternativa que acepte nombres en español.
4. Calcula a mano la letra del DNI 00000000 y del NIE Y0000000. Comprueba tu respuesta con `esDocumentoValido`.
5. Un buscador construye `new RegExp(textoDelUsuario, 'i')`. ¿Qué pasa si el usuario busca «¿qué es (esto)?»? ¿Cómo lo arreglas?

---

[⬅️ Volver a la unidad](./README.md)
