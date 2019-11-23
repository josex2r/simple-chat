function addMessage(container, user, date, message, reverse) {
  const bubble = document.createElement('div');

  if (reverse) {
    bubble.classList.add('reverse');
  }

  bubble.classList.add('speech-bubble');
  bubble.innerHTML = `By <small>${user}, ${date.toDateString()}</small>:<div>${message}</div>`;

  container.appendChild(bubble);
  bubble.scrollIntoView();
}

function addAlert(container, content, type = 'success') {
  const alert = document.createElement('div');

  alert.classList.add('alert', `alert-${type}`);
  alert.role = 'alert';
  alert.innerHTML = content;

  container.appendChild(alert);
  alert.scrollIntoView();
}

function addRoom(container, name, callback, isCurrent) {
  const room = document.createElement('div');

  room.classList.add('room');

  if (isCurrent) {
    room.classList.add('current-room');
  }

  room.innerHTML = name;

  container.appendChild(room);

  room.addEventListener('click', callback.bind(callback, name));
}

function clean(container) {
  container.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const chatContent = document.querySelector('.chat-content');
  const roomsContent = document.querySelector('#rooms');
  const chatText = document.querySelector('textarea');
  const button = document.querySelector('button#send');
  let currentRoom;
  let _userName;

  addAlert(chatContent, 'Waiting server handshake...');
  // addAlert(chatContent, 'Welcome to the <b>Simple chat</b>, REPLACE_USERNAME!');
  // addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'My message');
  // addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'Others message 1', true);
  // addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'Others message 2', true);

  // conectamos el front con el socket. la librería mete la función io en window con
  // lo que ya la temnemos disponible
  const socket = io();

  // pintamos las salas disponibles en el fromt
  socket.on('update-rooms', (rooms, currRoom) => {
    currentRoom = currRoom;
    roomsContent.innerHTML = '';
    rooms.forEach(room => {
      let isCurrent = currentRoom === room;
      addRoom(roomsContent, room, changeRoomCallback(room), isCurrent)
    });
  });

  const changeRoomCallback = roomName => () => {
    socket.emit('change-room', currentRoom, roomName);
  }

  socket.on('chat-ready', (id, room, userName) => {
    currentRoom = room;
    _userName = userName;
    addAlert(
      chatContent,
      `Te has conectado al chat por el socket ${id}`,
      'success'
    );
  });

  socket.on('user-join', (userName, itself) => {
    // el orden de esto puede afectar a la performance
    const {message, alertType} = {
      [!itself]: {
        message: `${userName} se ha unido al canal.`,
        alertType: 'info'
      },
      [!!itself]: {
        message: `Te has unido al canal ${currentRoom}.`,
        alertType: 'success'
      },
    }[true];

    addAlert(chatContent, message, alertType);
  });

  socket.on('user-left', userName => {
    addAlert(chatContent, `${userName} se ha ido del canal`, 'info');
  });

  socket.on('message-sent', (message, date, user) => {
    const isOwn = !user;
    user = user || _userName;
  
    addMessage(chatContent, user, new Date(date), message, isOwn);
  });

  // socket.on('room-changed', (newRoom) => {
  //   currentRoom = newRoom;
  // });

  // Send a message to the server when the button is clicked
  button.addEventListener('click', () => {
    let value = chatText.value;
    if (value) {
      socket.emit('send-message', chatText.value);
      chatText.value = '';
    }
  });
});
