# Carrusel accesible con eventos

<!-- Completa cada sección. Borra los comentarios como este cuando termines. -->

## Cómo ejecutarlo

<!-- Cómo ver la página y cómo pasar los tests, las pruebas de extremo a extremo, ESLint y Prettier. -->

## Eventos en el HTML

<!-- 1. Qué hace el HTML por ti en este carrusel sin que escribas código (botones, teclado, hidden…)
        y qué ve un usuario sin JavaScript.
     2. Analiza legado/carrusel-antiguo.html: al menos TRES problemas concretos de cómo captura
        los eventos, explicando por qué es un problema (cita las líneas o los atributos). -->

## Oyentes y propagación

<!-- Tabla con cada evento que escucha el componente: dónde se registra, si usa delegación,
     en qué fase (o si el evento no sube) y por qué ahí. Explica cómo quitas todos los oyentes
     en destruir() y si usas (o no) stopPropagation, this o preventDefault, y por qué. -->

## Tipos de eventos

<!-- Las familias de eventos que usas (ratón, teclado, puntero, foco, documento, propio), para qué
     usas cada una y por qué has elegido esos eventos y no otros parecidos (por ejemplo,
     mouseenter frente a mouseover, focusin frente a focus, pointer frente a touch). -->

## Accesibilidad

<!-- Qué atributos ARIA pones y para qué; cómo se usa el carrusel solo con el teclado;
     cómo se puede detener el movimiento. -->

## Pruebas

<!-- 1. Pega la salida de `npm test`.
     2. Lista de lo que prueba cada grupo de tests.
     3. Cómo simulas los clics, las teclas, el deslizamiento, el foco y la pestaña oculta,
        y cómo controlas el tiempo.
     4. Pega la salida de `npm run e2e` y explica qué recorrido comprueba cada prueba de extremo a extremo,
        qué compruebas con Playwright que no puedes comprobar con happy-dom (tema 7, apartado 7.7)
        y de qué tipo es cada prueba en la pirámide. -->

## Herramientas

<!-- Pega la salida de `npm run lint` y de `npm run format:check`. Cuenta un problema que encontraras
     con el depurador (por ejemplo, con un punto de ruptura de eventos) y cómo lo resolviste. -->

## Integración continua (opcional)

<!-- Solo si has hecho el apartado opcional de integración continua del enunciado; si no, borra esta sección.
     1. Enlace a una ejecución en verde de la pestaña Actions de tu repositorio.
     2. Captura de esa ejecución con sus pasos: guárdala en img/ y enlázala aquí.
     3. Captura de una ejecución en rojo provocada a propósito, y qué cambiaste para provocarla. -->
