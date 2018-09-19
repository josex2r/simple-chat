const SocketIo = require('socket.io');
const cookieSession = require('./middlewares/cookie-session');

const ROOMS = ['general', 'developers', 'news', 'random'];
const DEFAULT_ROOM = ROOMS[0];

module.exports = function(server) {
  const io = SocketIo(server);

  // Share session between express and socket.io to retrieve the username
  // from the session cookie
  io.use((socket, next) => {
    cookieSession(socket.request, socket.request.res, next);
  });

  io.on('connection', (socket) => {
    const user = socket.request.session.user;
    console.log('connection', 'user:' + user)

    // Join to the default room
    socket.join(DEFAULT_ROOM);
    // Send available rooms to the clien
    socket.emit('rooms', ROOMS);
    // Send a message to the rest of the room
    socket.broadcast.emit('info', `"${user}" has joined to "${DEFAULT_ROOM}"`);

    // Listen all messages sended by the clients
    socket.on('send-message', (message, date, room) => {
      console.log('send-message', message, date, room);
      // Send the message to the rest
      socket.to(room).broadcast.emit('receive-message', { user, message, date });
      // Send the message to the client
      socket.emit('sent-message', { user, message, date });
    });

    // Listen all messages sended by the clients
    socket.on('change-room', (from, to) => {
      console.log('change-room', from, to);
      // Notify to the room that someone has exited
      socket.to(from).broadcast.emit('info', `"${user}" has left the room`);
      // Leave the old room
      socket.leave(from);
      // Join the new room
      socket.join(to);
      // Send the join message to the new room
      socket.to(to).broadcast.emit('info', `"${user}" has joined`);
      // Send a notification to the client
      socket.emit('info', `you joined "${to}"`);
    });

    // Listen disconnections
    socket.on('disconnect', () =>{
      console.log('disconnect', 'user:' + user);
      // Send a message to the room when someone disconnects
      socket.broadcast.emit('alert', `"${user}" has disconnected`);
    });
  });

  return io;
};
