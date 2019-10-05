const SocketIo = require('socket.io');

module.exports = (httpServer) => {
  const io = SocketIo(httpServer);

  io.on('connection', (socket) => {
    console.log(`Se ha conectado el cliente ${socket.id}`);
    // console.log('Se ha conectado el cliente ' + socket.id);

    socket.broadcast.emit('alert', 'info', 'Se ha conectado un usuario');
  });
};
