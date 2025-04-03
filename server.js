const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir les fichiers statiques
app.use(express.static('public'));

// Connexion de Socket.io
io.on('connection', (socket) => {
    console.log('Un joueur s\'est connecté');

    // Gérer les événements ici
    socket.on('joinGame', (gameData) => {
        console.log(gameData);
        socket.emit('gameUpdate', gameData);
    });

    socket.on('addIngredient', (ingredientData) => {
        io.emit('ingredientAdded', ingredientData);
    });

    socket.on('nextPlayer', (currentPlayer) => {
        io.emit('switchPlayer', currentPlayer);
    });

    socket.on('disconnect', () => {
        console.log('Un joueur a quitté');
    });
});

// Lancer le serveur sur le port 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});