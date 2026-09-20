# Trabajo práctico 04

Aplicación web desarrollada con **Node.js, Express y EJS** para gestionar y visualizar mascotas disponibles para adopción.

La aplicación permite consultar un catálogo de mascotas, visualizar el detalle de cada una y agregar nuevos registros mediante un formulario. Por ahora, los nuevos registros se mantienen únicamente en memoria mientras el servidor está en ejecución.

---

## Descripción

El proyecto consiste en una aplicación web orientada a la adopción de mascotas donde la información inicial de las mismas se encuentra almacenada en:

```text
datos/mascotas.json
```

Luego, al iniciar el servidor, estos datos son cargados en memoria.

La aplicación permite:

* visualizar la página de inicio;
* consultar el listado de mascotas;
* acceder al detalle de cada mascota;
* mostrar una página de error cuando no existe una mascota con el ID solicitado;
* acceder a un formulario para registrar una nueva mascota;
* validar en el servidor los datos recibidos;
* conservar los valores ingresados cuando el formulario contiene un error;
* agregar nuevas mascotas al listado durante la ejecución del servidor.

**¡Importante!Los nuevos registros no se escriben nuevamente en el archivo JSON ni en una base de datos.**

---

## Instalación

Para instalar el proyecto se debe clonar el repositorio y acceder a su carpeta:

```bash
git clone git@github.com:marcos-batallan/app-web-con-EJS.git
cd app-web-con-EJS
```

Luego se deben instalar las dependencias:

```bash
npm install
```

---

## Ejecución

Para iniciar la aplicación:

```bash
npm start
```

Una vez iniciado el servidor, se puede acceder desde:

```text
http://localhost:3000
```

La aplicación carga los datos iniciales del archivo `datos/mascotas.json` antes de comenzar a escuchar conexiones.

---

## Páginas y rutas

### Página de inicio

```text
GET /
```

Muestra la presentación principal de la aplicación y permite acceder al catálogo de mascotas.

### Listado de mascotas

```text
GET /mascotas
```

Muestra todas las mascotas disponibles en memoria.

Cada tarjeta presenta:

* nombre;
* especie;
* edad;
* estado;
* imagen;
* enlace hacia el detalle.

### Formulario de nueva mascota

```text
GET /mascotas/nueva
```

Muestra el formulario para registrar una nueva mascota.

### Detalle de mascota

```text
GET /mascotas/:id
```

Muestra la información completa de una mascota identificada mediante su ID.

Ejemplo:

```text
GET /mascotas/1
```

Si el ID no corresponde a ninguna mascota, la aplicación devuelve una página HTML de recurso **no encontrado** con estado HTTP `404`.

### Crear una mascota

```text
POST /mascotas
```

Recibe los datos enviados desde el formulario.

Si los datos son válidos, se genera un nuevo ID y se asigna la imagen por defecto:

```text
/img/mascota.svg
```

y la nueva mascota se agrega al arreglo en memoria.

Luego se realiza una redirección hacia:

```text
/mascotas
```

Si los datos no son válidos, se responde con estado HTTP `400` y se vuelve a mostrar el formulario conservando los valores ingresados.

---

## Estructura de vistas

Las vistas EJS se organizan de la siguiente manera:

```text
views/
├── layouts/
│   └── main.ejs
│
├── mascotas/
│   ├── detalle.ejs
│   ├── lista.ejs
│   └── nueva.ejs
│
├── partials/
│   ├── encabezado.ejs
│   └── pie.ejs   
│
├── inicio.ejs
└── no-encontrado.ejs
```

### Layout

El archivo:

```text
views/layouts/main.ejs
```

contiene la estructura general que comparten las distintas páginas de la aplicación, y el contenido específico de cada una de ellas se inserta dentro del layout.

Incluye elementos comunes como:

* estructura HTML principal;
* encabezado;
* navegación;
* contenido principal;
* pie de página;
* carga de los recursos CSS y JavaScript.


### Vistas

Las vistas representan el contenido particular de cada página.

```text
inicio.ejs
```

Contiene la página de inicio.

```text
mascotas/lista.ejs
```

Contiene el catálogo de mascotas.

```text
mascotas/detalle.ejs
```

Contiene el detalle de una mascota.

```text
mascotas/nueva.ejs
```

Contiene el formulario para registrar una nueva mascota.

```text
no-encontrado.ejs
```

Contiene la página mostrada cuando no se encuentra el recurso solicitado.


### Parciales

Los parciales son partes reutilizables de la interfaz y su objetivo es evitar repetir el mismo código en las distintas páginas.

En este proyecto se utilizan:

```text
views/partials/encabezado.ejs
views/partials/pie.ejs
```

La diferencia principal es:

* **Layout:** define la estructura general de la página.
* **Vista:** contiene el contenido específico de una ruta.
* **Parcial:** contiene un fragmento reutilizable de la interfaz.

---

## Recursos estáticos

Los recursos estáticos se encuentran dentro de la carpeta:

```text
public/
├── css/
│   └── estilos.css
│
├── img/
│   ├── canelo.webp
│   ├── coco.webp
│   ├── manola.webp
│   ├── mascota.svg
│   ├── mini.webp
│   ├── nala.webp
│   └── paquito.webp
│
└── js/
    └── app.js
```

Express permite acceder a estos archivos mediante `express.static`.

Por ejemplo, el archivo:

```text
public/img/mini.webp
```

puede ser solicitado desde el navegador mediante:

```text
/img/mini.webp
```

Lo mismo sucede con los archivos CSS, JavaScript e imágenes.

---

## Formulario

El formulario se encuentra disponible en:

```text
GET /mascotas/nueva
```

Aquí se pueden ingresar los siguientes datos:

* nombre;
* especie;
* edad;
* descripción;
* estado.

El formulario utiliza el método:

```text
POST /mascotas
```

El servidor realiza una validación básica de los datos recibidos. Si falta información o algún valor no es válido, se devuelve un error `400` y se vuelve a mostrar el formulario.

Los valores ingresados se envían nuevamente a la vista mediante `res.render`, permitiendo conservar la información introducida y corregir solamente el dato que produjo el error.

Cuando los datos son válidos, se crea el nuevo objeto mascota, se genera su ID y se agrega al arreglo que contiene las mascotas en memoria.

---

## Persistencia de los datos

Las mascotas iniciales se encuentran almacenadas en:

```text
datos/mascotas.json
```

Este archivo se lee al iniciar el servidor mediante una función asíncrona. Los datos son cargados en un arreglo en memoria y posteriormente utilizados por las distintas rutas.

Cuando se agrega una nueva mascota mediante:

```text
POST /mascotas
```

el nuevo registro se agrega solamente al arreglo en memoria.

**No se modifica el archivo:**

```text
datos/mascotas.json
```

y tampoco se utiliza una base de datos.

Por este motivo, **las nuevas mascotas desaparecen al reiniciar el servidor**.

Al volver a ejecutar la aplicación, los datos se cargan nuevamente desde el archivo JSON original y el registro creado durante la ejecución anterior ya no existe.

---

## Conceptos principales

### Datos enviados a una vista mediante `res.render`

Las vistas EJS necesitan recibir los datos que deben mostrar y esto se realiza mediante `res.render()`.

Por ejemplo, una ruta puede enviar un título y un arreglo de mascotas:

```js
res.render("mascotas/lista", {
    titulo: "Mascotas en adopción",
    mascotas
});
```

La vista puede acceder a esos datos utilizando las expresiones de EJS:

```ejs
<h1><%= titulo %></h1>
```

También puede recorrer el arreglo:

```ejs
<% mascotas.forEach((mascota) => { %>
```

De esta manera, el servidor prepara los datos y EJS genera el HTML que recibe el navegador.

---

### Función de `express.static`

`express.static` permite que Express sirva archivos estáticos directamente al navegador.

En este proyecto se utiliza para la carpeta:

```text
public/
```

Esto permite acceder a:

* hojas de estilos CSS;
* imágenes;
* archivos JavaScript del navegador.

Por ejemplo:

```text
public/img/mascota.svg
```

puede ser solicitado desde el navegador como:

```text
/img/mascota.svg
```

---

### Función de `express.urlencoded`

`express.urlencoded` es un middleware que permite a Express interpretar los datos enviados por formularios HTML mediante el método `POST`.

En este proyecto se utiliza:

```js
app.use(express.urlencoded({ extended: false }));
```

Al utilizar este middleware, los datos enviados desde el formulario quedan disponibles en:

```js
req.body
```

Por ejemplo:

```js
req.body.nombre
req.body.especie
req.body.edad
```

---

### Recorrido POST, redirección y GET

El recorrido para crear una nueva mascota es el siguiente:

```text
1. GET /mascotas/nueva
           ↓
2. El servidor muestra el formulario
           ↓
3. El usuario completa los datos
           ↓
4. POST /mascotas
           ↓
5. El servidor valida los datos
           ↓
6. Se crea la nueva mascota en memoria
           ↓
7. Redirección → /mascotas
           ↓
8. GET /mascotas
           ↓
9. Se muestra nuevamente el listado
```

Después de realizar el `POST`, el navegador vuelve a solicitar mediante `GET` la página `/mascotas`, que obtiene el listado actualizado desde el arreglo en memoria.

---

### ¿Por qué desaparece el nuevo registro al reiniciar?

El nuevo registro solamente se agrega al arreglo que existe en la memoria mientras el servidor está funcionando:

```text
mascotas.json
      ↓
   memoria
      ↓
nueva mascota
```

Al detener el servidor, esa memoria se pierde.

Cuando se vuelve a iniciar:

```text
mascotas.json
      ↓
   memoria
```

El arreglo se vuelve a construir utilizando únicamente los datos originales del archivo JSON.

Por eso las mascotas creadas mediante el formulario no permanecen después de reiniciar la aplicación.

---

## Estructura general del proyecto

```text
app-web-con-EJS/
│
├── datos/
│   └── mascotas.json
│
├── public/
│   ├── css/
│   │   └── estilos.css
│   │
├── img/
│   ├── canelo.webp
│   ├── coco.webp
│   ├── manola.webp
│   ├── mascota.svg
│   ├── mini.webp
│   ├── nala.webp
│   └── paquito.webp
│   │
│   └── js/
│       └── app.js
│
├── src/
│   ├── archivos.js
│   └── index.js
│
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   │
│   ├── mascotas/
│   │   ├── detalle.ejs
│   │   ├── lista.ejs
│   │   └── nueva.ejs
│   │
│   ├── partials/
│   │   ├── encabezado.ejs
│   │   └── pie.ejs
│   │
│   ├── inicio.ejs
│   └── no-encontrado.ejs
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Tecnologías utilizadas

* **Node.js**
* **Express**
* **EJS**
* **express-ejs-layouts**
* **HTML**
* **CSS**
* **JavaScript**
* **JSON**

---