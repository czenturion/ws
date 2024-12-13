const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let connections = {};
let nextId = 1;

function trackConnection(ws) {
    const id = nextId;
    connections[id] = ws;
    nextId++;

    return id;
}

wss.on('connection', (ws) => {
    const id = trackConnection(ws);

    console.log(`Новое соединение с id: ${id}`)

    ws.on('message', (message) => {
        console.log(`Получено сообщение ${message}`);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Пользователь${id}: ${message}`);
            }
        });
    });

    ws.on('close', () => {
        console.log('Клиент отключился.');
    });

    ws.send('Добро пожаловать на ws сервер!');
});

console.log('WebSocket запущен на localhost:8080');