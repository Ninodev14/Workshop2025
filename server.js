const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {}; // Stocke les rooms et les joueurs

// Servir les fichiers statiques
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Un joueur s\'est connecté');

    // Création d'une nouvelle room
    socket.on('createRoom', (roomData) => {
        const { roomId, maxPlayers } = roomData;

        rooms[roomId] = {
            players: [],
            maxPlayers,
            currentPlayer: 1,
            gameData: {},
        };

        console.log(`Room créée : ${roomId} (Max: ${maxPlayers} joueurs)`);
        io.emit('updateRooms', rooms);
    });

    // Rejoindre une room
    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId] && rooms[roomId].players.length < rooms[roomId].maxPlayers) {
            socket.join(roomId);
            rooms[roomId].players.push(socket.id);
            console.log(`Le joueur ${socket.id} a rejoint la room ${roomId}`);

            // Mettre à jour les joueurs de la room
            io.to(roomId).emit('gameUpdate', rooms[roomId].gameData);
            io.to(roomId).emit('currentPlayer', rooms[roomId].currentPlayer);

            io.emit('updateRooms', rooms);
        }
    });

    // Ajouter un ingrédient
    socket.on('addIngredient', (ingredientData, roomId) => {
        io.to(roomId).emit('ingredientAdded', ingredientData);

        if (rooms[roomId]) {
            rooms[roomId].currentPlayer = (rooms[roomId].currentPlayer % rooms[roomId].players.length) + 1;
            io.to(roomId).emit('switchPlayer', rooms[roomId].currentPlayer);
        }
    });

    // Passer au joueur suivant
    socket.on('nextPlayer', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].currentPlayer = (rooms[roomId].currentPlayer % rooms[roomId].players.length) + 1;
            io.to(roomId).emit('switchPlayer', rooms[roomId].currentPlayer);
        }
    });

    // Gérer la déconnexion d'un joueur
    socket.on('disconnect', () => {
        console.log(`Le joueur ${socket.id} a quitté`);
        let roomToDelete = null;

        for (const roomId in rooms) {
            const index = rooms[roomId].players.indexOf(socket.id);
            if (index !== -1) {
                rooms[roomId].players.splice(index, 1);

                // Supprimer la room si elle est vide
                if (rooms[roomId].players.length === 0) {
                    roomToDelete = roomId;
                }
                break;
            }
        }

        if (roomToDelete) {
            delete rooms[roomToDelete];
        }

        io.emit('updateRooms', rooms);
    });
});

// Lancer le serveur sur le port 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});