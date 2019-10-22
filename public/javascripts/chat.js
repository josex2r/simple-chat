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

function addRoom(container, name, callback) {
  const room = document.createElement('div');

  room.classList.add('room');
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

  addAlert(chatContent, 'Waiting server handshake...');
  // addAlert(chatContent, 'Welcome to the <b>Simple chat</b>, REPLACE_USERNAME!');
  // addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'My message');
  // addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'Others message 1', true);
  // addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'Others message 2', true);

  function joinRoom(newRoom) {
    socket.emit('change-room', currentRoom, newRoom);
    currentRoom = newRoom;
  }

  const socket = io();

  // When the client is connected to the server
  socket.on('connect', (connect) => {
    addAlert(chatContent, 'You have been connected!', 'info');
  });

  // When an information message is received
  socket.on('info', (message) => {
    addAlert(chatContent, message, 'info');
  });

  // When an alert message is received
  socket.on('alert', (message) => {
    addAlert(chatContent, message, 'warning');
  });

  // When client receives the available rooms
  socket.on('rooms', (rooms) => {
    currentRoom = rooms[0];
    clean(roomsContent);
    rooms.forEach((room) => addRoom(roomsContent, room, joinRoom));
  });

  // When the client receives a message
  socket.on('receive-message', ({ message, user, date }) => {
    addMessage(chatContent, user, new Date(date), message, true);
  });

  // When the server says that the mesage has been send
  socket.on('sent-message', ({ message, user, date }) => {
    addMessage(chatContent, user, new Date(date), message);
  });

  // When you disconnects (for example, when the servers gets shutdown)
  socket.on('disconnect', () => {
    addAlert(chatContent, 'You have been disconnected :(', 'danger');
  });

  // Send a message to the server when the button is clicked
  button.addEventListener('click', () => {
    socket.emit('send-message', chatText.value, new Date(), currentRoom);
    chatText.value = '';
  });
});
