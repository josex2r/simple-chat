function addMessage(container, user, date, content, reverse) {
    const bubble = document.createElement('div');
    
    if (reverse) {
        bubble.classList.add('reverse');
    }
    bubble.classList.add('speech-bubble');
    bubble.innerHTML = `By <small>${user}, ${date.toDateString()}</small><div>${content}</div>`;
    
    container.appendChild(bubble);
}

function addAlert(container, content, type = 'success') {
    const alert = document.createElement('div');
    
    alert.classList.add('alert', `alert-${type}`);
    alert.role = 'alert';
    alert.innerHTML = content;
    
    container.appendChild(alert);
}

function clean(container) {
    container.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    // Create the socket connection
    const socket = io();
    // DOM selectors
    const chatContent = document.querySelector('.chat-content');
    const chatText = document.querySelector('textarea');
    const button = document.querySelector('button#send');
    // The conected username, currently is empty
    let username;
    
    button.addEventListener('click', (event) => {
        // Send the message to the server
        socket.emit('message', chatText.value);
        // Clean the <textarea>
        chatText.value = '';
    });
    
    socket.on('connect', () => {
        // Clean all messages and add a green alert
        clean(chatContent);
        addAlert(chatContent, 'You have been connected!', 'info');
    });
    
    socket.on('disconnect', ({ user }) => {
        // Add a red alert
        addAlert(chatContent, 'You have been disconnected :(', 'danger');
    });
    
    socket.on('user', ({ user }) => {
        // Store username
        username = user;
    });
    
    socket.on('messages', (messages) => {
        // Loop over the messages
        messages.forEach((data) => {
            // For each message render a template
            if (data.type === 'message') {
                addMessage(chatContent, data.user, new Date(data.date), data.message, username !== data.user);
            } else {
                addAlert(chatContent, data.message, data.type);
            }
        });
    });
});