# simple-chat

Aplicación hecha con [expressjs](http://expressjs.com/) y [socket.io](http://socket.io) para el [Curso de NodeJS](https://github.com/Fictizia/Curso-Node.js-para-desarrolladores-Front-end_ed5) de [@Fictizia](https://github.com/Fictizia);

El objetivo es crear un chat utilizando Web Sockets.

[https://nameless-refuge-18649.herokuapp.com](https://nameless-refuge-18649.herokuapp.com)

## Instalación

> Por defecto la aplicación arrancará en el puerto **8080**.

```
git clone https://github.com/josex2r/simple-chat.git
cd simple-chat
npm install
npm server
```

## Plantilla

En la rama [#template](https://github.com/josex2r/simple-chat/tree/template) se encuentra el proyecto inicializado con toda la parte del cliente de tal manera que únicamente es necesario programar la parte del socket.

## Contenido

La aplicación contiene las siguientes rutas:

- **Rutas públicas (sin autenticación)**
  - [`/`](routes/index.js):
    - Si la petición es un `GET`, muestra un formulario de login (nombre de usuario) que envía un `POST` a `/login`.
    - Si el usuario ya está autenticado redirige a `/chat`.
  - [`/login`](routes/login.js):
    - Si la petición es un `POST`, crea la **cookie** de sesión y redirige a la ruta `/chat`.
    - [`/logout`](routes/login.js): Destruye la sesión y redirige a `/`
- **Rutas privadas (con autenticación)**
  - [`/chat`](routes/chat.js): Muestra la ventana de chat
