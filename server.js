const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`Joueur connecté: ${socket.id}`);

    socket.on('requestRooms', () => {
        socket.emit('updateRooms', rooms);
    });

    socket.on('createRoom', ({ roomId, roomName, maxPlayers, playerName, playerId }, callback) => {
        if (rooms[roomId]) {
            return callback({ success: false, message: "Room déjà existante." });
        }

        rooms[roomId] = {
            name: roomName,
            players: [{ id: playerId, name: playerName }], // Utilisation de playerId
            maxPlayers: parseInt(maxPlayers),
            host: playerId
        };

        socket.join(roomId);
        console.log(`✅ Room créée: ${roomName} (${roomId}) avec ${playerName} comme hôte`);

        io.emit('updateRooms', rooms);
        callback({ success: true });
    });


    socket.on('joinRoom', (roomId, playerName, playerId, callback) => {
        console.log(`🔍 Tentative de rejoindre la room: ${roomId} par ${playerName} (${playerId})`);

        if (!rooms[roomId]) {
            console.log(`❌ ERREUR : La room ${roomId} n'existe pas !`);
            return callback({ success: false, message: "La room est introuvable." });
        }

        if (rooms[roomId].players.length >= rooms[roomId].maxPlayers) {
            return callback({ success: false, message: "La room est pleine." });
        }

        const isAlreadyInRoom = rooms[roomId].players.some(player => player.id === playerId);
        if (isAlreadyInRoom) {
            return callback({ success: false, message: "Vous êtes déjà dans cette room." });
        }

        rooms[roomId].players.push({ id: playerId, name: playerName });
        socket.join(roomId);

        console.log(`✅ ${playerName} a rejoint la room ${roomId}`);
        console.log("📌 Nouvelle liste de joueurs:", rooms[roomId].players);

        io.to(roomId).emit('updatePlayers', rooms[roomId].players); // Update the players list in the room
        io.emit('updateRooms', rooms); // Update all rooms

        callback({ success: true, players: rooms[roomId].players }); // Return the list of players in the callback
    });


    socket.on('startGame', (roomId) => {
        if (rooms[roomId] && rooms[roomId].host === socket.id) {
            io.to(roomId).emit('gameStarted');
        }
    });

    socket.on('disconnect', () => {
        let roomToDelete = null;

        // Rechercher les rooms où ce joueur se trouve
        for (const roomId in rooms) {
            // Filtrer les joueurs de la room pour retirer ce joueur par son ID
            rooms[roomId].players = rooms[roomId].players.filter(player => player.id !== socket.id);

            if (rooms[roomId].players.length === 0) {
                roomToDelete = roomId;
            }
        }

        if (roomToDelete) {
            delete rooms[roomToDelete];
        }

        io.emit('updateRooms', rooms);
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`✅ Serveur en écoute sur le port ${port}`);
});