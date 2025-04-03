const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {}; // Pour stocker les informations de chaque room

// Servir les fichiers statiques
app.use(express.static('public'));

// Connexion de Socket.io
io.on('connection', (socket) => {
    console.log('Un joueur s\'est connecté');

    // Joindre une room spécifique
    socket.on('joinRoom', (roomId, gameData) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: [],
                currentPlayer: 1,
                gameData: gameData,
            };
        }

        // Ajouter le joueur à la room
        rooms[roomId].players.push(socket.id);
        socket.join(roomId);

        console.log(`Le joueur ${socket.id} a rejoint la room ${roomId}`);
        socket.emit('gameUpdate', gameData); // Envoie les données du jeu au joueur
        socket.emit('currentPlayer', 1); // Indique au joueur qu'il est le premier à jouer
    });

    // Ajouter un ingrédient à la sélection
    socket.on('addIngredient', (ingredientData, roomId) => {
        // Envoyer à tous les autres clients dans la même room que l'ingrédient a été ajouté
        io.to(roomId).emit('ingredientAdded', ingredientData);
        rooms[roomId].currentPlayer = (rooms[roomId].currentPlayer % rooms[roomId].players.length) + 1;
        io.to(roomId).emit('switchPlayer', rooms[roomId].currentPlayer); // Change le joueur
    });

    // Passer au joueur suivant
    socket.on('nextPlayer', (roomId) => {
        rooms[roomId].currentPlayer = (rooms[roomId].currentPlayer % rooms[roomId].players.length) + 1;
        io.to(roomId).emit('switchPlayer', rooms[roomId].currentPlayer); // Passe au joueur suivant
    });

    // Déconnexion d'un joueur
    socket.on('disconnect', () => {
        console.log(`Le joueur ${socket.id} a quitté`);
        for (let roomId in rooms) {
            let index = rooms[roomId].players.indexOf(socket.id);
            if (index !== -1) {
                rooms[roomId].players.splice(index, 1);
                break;
            }
        }
    });
});

// Lancer le serveur sur le port 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});