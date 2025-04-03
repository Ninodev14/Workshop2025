const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Un client est connecté');

    ws.send('Bienvenue sur le serveur WebSocket !');

    ws.on('message', (message) => {
        console.log(`Message reçu : ${message}`);

        ws.send(`Vous avez dit : ${message}`);
    });

    ws.on('close', () => {
        console.log('Connexion fermée');
    });
});

console.log('Serveur WebSocket démarré sur ws://localhost:8080');