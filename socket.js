const SocketIo = require('socket.io');

module.exports = (httpServer) => {
  const io = SocketIo(httpServer);

  io.on('connection', (socket) => {
    console.log(`Se ha conectado el cliente ${socket.id}`);
    console.log('Se ha conectado el cliente ' + socket.id);
  });
};
