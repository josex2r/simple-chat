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
  });
};

