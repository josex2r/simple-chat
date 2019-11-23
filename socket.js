/**
 * Module for handling socket connections
 */
const socketIo = require('socket.io');
const cookie = require('./middlewares/cookie');

const CHAT_ROOMS = [
  'General',
  'Juegos',
  '+18'
];

const DEFAULT_ROOM = CHAT_ROOMS[0];

module.exports = server => {
  const io = socketIo(server);

  // const customRoom = io.of('/customRoom');

  io.use((socket, next) => {
    // socket.request
    // socket.request.res
    cookie(socket.request, socket.request.res, next);
  });

  io.on('connection', socket => {
    let currentRoom = DEFAULT_ROOM;

    // el nombre de usuario se mete en la
    // propiedad user de la cookie session
    const userName = socket.request.session.user;

    // emite evento para actualizar canales
    const updateRooms = (room = currentRoom) => {
      socket.emit('update-rooms', CHAT_ROOMS, room);
    }

    // broadcast user join
    const broadcastUserJoin = (to) => {
      socket.broadcast.to(to).emit('user-join', userName, false);
    }


    // unimos al canal general
    socket.join(currentRoom);
    // emitimos las salas de chat disponibles
    updateRooms();
    
    socket.emit('chat-ready', socket.id, currentRoom, userName);
    broadcastUserJoin(currentRoom);
    
    
    socket.on('send-message', message => {
      // confirmación de mensaje enviado para el usuario
      socket.emit('message-sent', message, new Date());

      // mensaje para el resto de usuarios
      socket.broadcast
        .to(currentRoom)
        .emit('message-sent', message, new Date(), userName);
    });
    
    socket.on('change-room', (from, to) => {
      // salir del canal y avisar de que usuario se ha ido
      // no se manda el mensaje al que lo emite
      socket.leave(from);
      socket.broadcast.to(from).emit('user-left', userName);

      // unirse a la nueva sala
      socket.join(to);
      currentRoom = to;

      // avisar al usuario que ha cambiado de sala
      updateRooms(to);
      socket.emit('user-join', userName, true);

      // avisar a los miembros del canal excepto al emisor
      broadcastUserJoin(to);
    });
  });
};


