const MAX = 10;

class Queue extends Array {
    constructor() {
        super(...arguments);
    }
    push() {
        super.push(...arguments);
        if (this.length > MAX) {
            this.shift();
        }
    }
}

const queue = new Queue();

queue.push({
    date: new Date(),
    message: 'Welcome to the Simple chat!',
    type: 'success'
});

queue.push({
    user: 'Unicorn',
    date: new Date(),
    message: 'Hello from a flying unicorn',
    type: 'message'
});

module.exports = queue;