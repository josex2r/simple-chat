const socket = require('socket.io');
const cookieSession = require('./middlewares/cookie-session');
const users = require('./users');
const messages = require('./messages');

module.exports = function startSocket(server, app) {
    const io = socket(server);
    
    // Share session between express and socket.io to retrieve the username from the session cookie
    io.use((socket, next) => {
        cookieSession(socket.request, socket.request.res, next);
    });
    
    io.on('connection', function (socket) {
        const { user } = socket.request.session;
        
        // Add username to the cache
        users[user] = socket.id;
        console.log(`User '${user}' has connected`);
        
        // Send chat user name to the client
        socket.emit('user', { user });
        // Send available messages
        socket.emit('messages', messages);

        // When the server receives a message
        socket.on('message', (data) => {
            const message = {
                user,
                date: new Date(),
                message: data,
                type: 'message'
            };
            // Store the message
            messages.push(message);
            // Sending to the sender
            socket.emit('messages', [message]);
            // Sending to all clients except sender
            socket.broadcast.emit('messages', [message]);
        });
        
        // When the user disconnects
        socket.on('disconnect', (socket) => {
            delete users[user];
            console.log(`User '${user}' has disconnected`);
        });
    });
}