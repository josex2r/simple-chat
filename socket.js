/**
 * Module for handling socket connections
 */
const socketIo = require('socket.io');
const cookie = require('./middlewares/cookie');

const CHAT_ROOMS = [
  'general',
  'juegos',
  'solterosDeOro'
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
    // returns socket's current room
    // only supports 1 room chat's
    const getCurrentRoom = socket => Object.keys(socket.rooms).pop();
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
    
    socket.emit('chat-ready', socket.id, currentRoom);
    broadcastUserJoin(currentRoom);
    
    
    socket.on('send-message', message => {
      // mensaje enviado por el usuario con true para pintar
      // la burbuja hacia el otro lado
      socket.emit('message-sent', userName, message, new Date(), true);
      // mensaje para el resto de usuarios
      socket.broadcast.emit('message-sent', userName, message, new Date());
    });
    
    socket.on('change-room', (from, to) => {
      console.log(getCurrentRoom(socket))
      // salir del canal y avisar de que usuario se ha ido
      // no se manda el mensaje al que lo emite
      socket.leave(from);
      socket.broadcast.to(from).emit('user-left', userName);

      // unirse a la nueva sala
      socket.join(to);

      // avisar al usuario que ha cambiado de sala
      updateRooms(to);
      socket.emit('user-join', userName, true);

      // avisar a los miembros del canal excepto al emisor
      broadcastUserJoin(to);
    });
  });
};


