const SocketIo = require('socket.io');
const cookieSession = require('./middlewares/session');

module.exports = (httpServer) => {
  const io = SocketIo(httpServer);

  io.use((socket, next) => {
    cookieSession(socket.request, socket.request.res, next);
  });

  io.on('connection', (socket) => {
    const user = socket.request.session.user;

    console.log(`Se ha conectado el cliente ${socket.id} con el nombre "${user}"`);
    // console.log('Se ha conectado el cliente ' + socket.id);

    socket.broadcast.emit('alert', 'info', `Se ha conectado el usuario "${user}"`);
  });
};
