/**
 * Module for handling socket connections
 */
const socketIo = require('socket.io');

module.exports = server => {
  const io = socketIo(server);

  io.on('connection', socket => {
    socket.emit('chat-ready', socket.id);
    socket.broadcast.emit('user-join');
  });
};

