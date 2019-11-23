/**
 * Module for handling socket connections
 */
const socketIo = require('socket.io');
const cookie = require('./middlewares/cookie');


module.exports = server => {
  const io = socketIo(server);

  io.use((socket, next) => {
    // socket.request
    // socket.request.res
    cookie(socket.request, socket.request.res, next);
  });

  io.on('connection', socket => {
    socket.emit('chat-ready', socket.id);
    // el nombre de usuario se mete en la
    // propiedad user de la cookie session
    socket.broadcast.emit('user-join', socket.request.session.user);

    socket.on('send-message', message => {
      console.log(message);
      const user = socket.request.session.user;
      // mensaje enviado por el usuario con true para pintar
      // la burbuja hacia el otro lado
      socket.emit('sent-message', user, message, new Date(), true);
      // mensaje para el resto de usuarios
      socket.broadcast.emit('sent-message', user, message, new Date());
    });

  });
};

