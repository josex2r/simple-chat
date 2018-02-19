function addMessage(container, user, date, content, reverse) {
    const bubble = document.createElement('div');
    
    if (reverse) {
        bubble.classList.add('reverse');
    }
    bubble.classList.add('speech-bubble');
    bubble.innerHTML = `By <small>REPLACE_USERNAME, ${date.toDateString()}</small><div>${content}</div>`;
    
    container.appendChild(bubble);
}

function addAlert(container, content, type = 'success') {
    const alert = document.createElement('div');
    
    alert.classList.add('alert', `alert-${type}`);
    alert.role = 'alert';
    alert.innerHTML = content;
    
    container.appendChild(alert);
}

function sendMessage(message) {
    alert(message)
}

document.addEventListener('DOMContentLoaded', () => {
    const chatContent = document.querySelector('.chat-content');
    const chatText = document.querySelector('textarea');
    const button = document.querySelector('button#send');
    
    addAlert(chatContent, 'Welcome to the <b>Simple chat</b>, REPLACE_USERNAME!');
    addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'My message');
    addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'Others message 1', true);
    addMessage(chatContent, 'REPLACE_USERNAME', new Date(), 'Others message 2', true);
    
    button.addEventListener('click', () => sendMessage(chatText.value));
});