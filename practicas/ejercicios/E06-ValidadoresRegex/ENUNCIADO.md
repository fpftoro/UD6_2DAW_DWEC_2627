# E06 · Validadores con expresiones regulares

**Tipo:** autocorrección

Un módulo de validadores y utilidades de texto para datos españoles (DNI y NIE, código postal, teléfono, matrícula) y para extraer y transformar texto (hashtags, correos), con sus **tests** escritos como tablas de casos.

**CE:** RA5 g, h

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/`. Como los ejercicios de la UD2 con dependencias de npm, **construye su imagen** con el `Dockerfile` de esa carpeta, a partir de la imagen oficial de Node.js de **Docker Hub**, `node:24-bookworm` (UD2, tema 9, apartado 9.3.2). Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda algo más, porque descarga la imagen y la construye. Al crearse, el contenedor ejecuta `npm install`: cuando se abre, las dependencias ya están instaladas.

Ejecuta los programas en la terminal de VS Code, que ya es la del contenedor.

## Punto de partida

```text
├── package.json             ← scripts start, test, lint, format y format:check
├── src/
│   ├── validadores.js       ← seis funciones con su JSDoc, sin programar
│   └── main.js              ← demostración (no se modifica)
├── tests/
│   └── validadores.test.js  ← un primer test
└── README.md                ← plantilla de entrega
```

## Requisitos

1. Programa las seis funciones de `src/validadores.js` según su JSDoc, **con expresiones regulares**:

   | Función | Qué hace |
   |---------|----------|
   | `esDocumentoValido(documento)` | DNI (8 cifras y letra) o NIE (X, Y o Z, 7 cifras y letra) con la **letra de control** correcta. Quita antes espacios y guiones y admite minúsculas |
   | `esCodigoPostal(codigo)` | Cinco cifras con provincia del 01 al 52 |
   | `normalizarTelefono(telefono)` | Quita espacios, guiones, puntos y el prefijo `+34` o `0034`; si quedan nueve cifras que empiezan por 6, 7, 8 o 9, devuelve `'612 345 678'`; si no, `null` |
   | `esMatricula(matricula)` | Cuatro cifras y tres consonantes sin Ñ ni Q, en mayúsculas o minúsculas, con un espacio o un guion opcional en medio |
   | `extraerHashtags(texto)` | Los hashtags (`#` y letras de cualquier idioma, cifras o `_`) en minúsculas, sin repetir y en orden. No cuenta un `#` pegado a una palabra (`dwec#2`) |
   | `ocultarCorreo(correo)` | Si tiene la forma `usuario@dominio.ext`, cambia por asteriscos todo el usuario menos la primera letra; si no, `null` |

2. Usa al menos una vez: anclas, una clase con rango, un grupo con nombre, un grupo sin captura, el _flag_ `u` con `\p{L}`, una comprobación hacia atrás (`(?<!…)`), `matchAll` y `replace` con una **función**.
3. **Tests** en `tests/validadores.test.js`, con `it.each`: para cada función, casos válidos (incluidos los límites, como `01001` y `52080`) y **un caso no válido por cada regla**, cada uno con su motivo en el nombre del test.
4. `npm run lint` sin errores y el código formateado con `npm run format`.

**Entrega.** Completa el `README.md`: cómo se ejecuta, la salida de `npm start`, la de `npm test` con una tabla de tus casos, qué test falla al estropear el código postal (en «Comprueba tu solución») y la salida de las herramientas.

## Comprueba tu solución

- `npm start` muestra exactamente:

  ```text
  🪪 Documentos
    ✅ 12345678Z
    ❌ 12345678A
    ❌ 1234567Z
    ✅ X1234567L
    ✅ y-0000000-z
    ❌ W1234567L
  📮 Códigos postales
    ✅ 41001
    ✅ 01001
    ✅ 52080
    ❌ 53001
    ❌ 00100
    ❌ 4100
  📞 Teléfonos
    612 345 678 ← «612345678»
    612 345 678 ← «+34 612-34-56-78»
    958 123 456 ← «0034 958.12.34.56»
    ❌ no válido ← «512345678»
    ❌ no válido ← «61234567»
  🚗 Matrículas
    ✅ 1234BCD
    ✅ 1234 bcd
    ✅ 1234-XYZ
    ❌ 1234ABC
    ❌ 123BCD
    ❌ 1234BCQ
  #️⃣ Hashtags
    ["#dwec","#eventos","#año_2"]
    []
  📧 Correos
    a*********@ejemplo.es ← ana.garcia@ejemplo.es
    x@iesejemplo.org ← x@iesejemplo.org
    ❌ no válido ← sin-arroba.es
  ```

- `npm test` pasa todos tus tests. Cambia temporalmente `5[0-2]` por `5\d` en el código postal: algún test tiene que fallar. Si ninguno falla, te falta el caso `53001`.
- Calcula a mano la letra de `00000001` (resto 1 → `R`) y añádelo a tus casos válidos.
- Prueba cada expresión en regex101 con el modo *ECMAScript (JavaScript)* y los _flags_ que uses.

## Integración continua (opcional)

> 📝 Este apartado es **opcional** y no cuenta para la corrección. Hazlo si en clase habéis visto GitHub Actions; si no, sáltatelo.

Sube el proyecto a un repositorio tuyo de GitHub (el `.gitignore` ya deja fuera `node_modules/`). Escribe un *workflow* de GitHub Actions que pase **todas las comprobaciones del proyecto** cada vez que subas cambios. Es como el de la UD4: las dependencias se instalan con **`npm ci`** a partir de `package-lock.json`, con la caché de npm. Escríbelo tú, en `.github/workflows/ci.yml`, con estas orientaciones:

- Se ejecuta con cada `push` y cada *pull request* a la rama `main`.
- Tiene un único trabajo (*job*) que se ejecuta en `ubuntu-latest`.
- Sus pasos, en este orden, cada uno con un nombre (`name`) en español que diga qué hace:
  1. Descargar el código, con la acción `actions/checkout@v7`.
  2. Instalar Node.js 24 con la caché de npm, con la acción `actions/setup-node@v7`, `node-version: 24` y `cache: npm`.
  3. Instalar las dependencias con `npm ci`.
  4. Revisar el código con ESLint: `npm run lint`.
  5. Comprobar el formato con Prettier: `npm run format:check`.
  6. Ejecutar los tests: `npm test`.
- Sube también `package-lock.json`: lo creó `npm install` al abrir el contenedor. Sin él, `npm ci` falla. Si añades o actualizas una dependencia, vuelve a subirlo.
- Prettier también revisa el formato de `ci.yml`: ejecuta `npm run format` antes de subirlo.

Compruébalo:

1. Sube los cambios y abre la pestaña **Actions** del repositorio: la ejecución debe salir en verde, con los seis pasos.
2. Rompe algo a propósito (por ejemplo, cambia el resultado esperado de un caso de la tabla de `esCodigoPostal`), sube el cambio y comprueba que la ejecución sale en rojo en el paso que corresponde. Después, deshaz el cambio y comprueba que vuelve a verde.

Deja constancia en la sección «Integración continua (opcional)» del `README.md`: el enlace a la ejecución en verde y dos capturas en `img/`, una de la ejecución en verde con sus pasos y otra de la ejecución en rojo con el paso que falla.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen que ha construido el `Dockerfile` tampoco se borra (se llama `vsc-` seguido del nombre de la carpeta), así que la próxima vez no hace falta construirla de nuevo. Si necesitas espacio, bórrala desde la pestaña **Images** de Docker Desktop o con `docker image rm <nombre>`.
