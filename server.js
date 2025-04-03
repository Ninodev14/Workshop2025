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

    socket.on('createRoom', ({ roomId, roomName, maxPlayers, playerName }, callback) => {
        if (rooms[roomId]) {
            return callback({ success: false, message: "Room déjà existante." });
        }

        rooms[roomId] = {
            name: roomName,
            players: [{ id: socket.id, name: playerName }],
            maxPlayers: parseInt(maxPlayers),
            host: socket.id
        };

        socket.join(roomId);
        console.log(`Room créée : ${roomName} (${roomId})`);

        io.emit('updateRooms', rooms);
        callback({ success: true });
    });

    socket.on('joinRoom', (roomId, playerName, callback) => {
        if (!rooms[roomId] || rooms[roomId].players.length >= rooms[roomId].maxPlayers) {
            return callback({ success: false, message: "La room est pleine ou introuvable." });
        }

        rooms[roomId].players.push({ id: socket.id, name: playerName });
        socket.join(roomId);

        console.log(`${playerName} a rejoint la room ${roomId}`);

        io.to(roomId).emit('updatePlayers', rooms[roomId].players);
        io.emit('updateRooms', rooms);
        callback({ success: true });
    });

    socket.on('startGame', (roomId) => {
        if (rooms[roomId] && rooms[roomId].host === socket.id) {
            io.to(roomId).emit('gameStarted');
        }
    });

    socket.on('disconnect', () => {
        let roomToDelete = null;

        for (const roomId in rooms) {
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

server.listen(3000, () => {
    console.log(`✅ Serveur en écoute sur le port 3000`);
});