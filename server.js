const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {}; // Stockage des rooms

// Servir les fichiers statiques
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`Joueur connecté: ${socket.id}`);

    // Demande de la liste des rooms
    socket.on('requestRooms', () => {
        socket.emit('updateRooms', rooms);
    });

    // Création d'une room
    socket.on('createRoom', ({ roomId, roomName, maxPlayers }) => {
        rooms[roomId] = {
            name: roomName,
            players: [],
            maxPlayers: parseInt(maxPlayers),
            currentPlayer: 1,
            gameData: {},
        };

        console.log(`Room créée : ${roomName} (${roomId}) - Max: ${maxPlayers} joueurs`);
        io.emit('updateRooms', rooms);
    });

    // Rejoindre une room
    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId] && rooms[roomId].players.length < rooms[roomId].maxPlayers) {
            socket.join(roomId);
            rooms[roomId].players.push(socket.id);
            console.log(`Joueur ${socket.id} a rejoint la room ${roomId}`);

            // Mise à jour des joueurs
            io.to(roomId).emit('gameUpdate', rooms[roomId].gameData);
            io.to(roomId).emit('currentPlayer', rooms[roomId].currentPlayer);
            io.emit('updateRooms', rooms);
        }
    });

    // Ajouter un ingrédient
    socket.on('addIngredient', (ingredientData, roomId) => {
        if (rooms[roomId]) {
            io.to(roomId).emit('ingredientAdded', ingredientData);
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
        console.log(`Joueur déconnecté: ${socket.id}`);
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
            console.log(`Room supprimée : ${rooms[roomToDelete].name} (${roomToDelete})`);
            delete rooms[roomToDelete];
        }

        io.emit('updateRooms', rooms);
    });
});

// Lancer le serveur
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`✅ Serveur en écoute sur le port ${port}`);
});