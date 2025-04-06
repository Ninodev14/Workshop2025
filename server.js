const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};
let roomReadyPlayers = {};


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

        // Utilisation de playerId passé par le client
        rooms[roomId] = {
            name: roomName,
            players: [{ id: playerId, name: playerName }],
            maxPlayers: parseInt(maxPlayers),
            host: playerId
        };

        socket.join(roomId);
        console.log(`✅ Room créée: ${roomName} (${roomId}) avec ${playerName} comme hôte`);

        io.emit('updateRooms', rooms);
        callback({ success: true });
    });

    socket.on('joinRoom', (roomId, playerName, playerId, callback) => {
        if (!rooms[roomId]) return callback({ success: false, message: "La room est introuvable." });

        if (rooms[roomId].players.length >= rooms[roomId].maxPlayers) {
            return callback({ success: false, message: "La room est pleine." });
        }

        const isAlreadyInRoom = rooms[roomId].players.some(player => player.id === playerId);
        if (isAlreadyInRoom) {
            return callback({ success: false, message: "Vous êtes déjà dans cette room." });
        }

        rooms[roomId].players.push({ id: playerId, name: playerName });
        socket.join(roomId);

        io.to(roomId).emit('updatePlayers', rooms[roomId].players, rooms[roomId].host);
        io.emit('updateRooms', rooms);

        callback({
            success: true,
            players: rooms[roomId].players,
            name: rooms[roomId].name
        });
    });
    socket.on('requestRole', (roomId, playerId, callback) => {
        const room = rooms[roomId];
        if (!room) return callback({ success: false, message: "Room introuvable" });

        const index = room.players.findIndex(p => p.id === playerId);
        if (index === -1) return callback({ success: false, message: "Joueur introuvable dans la room" });

        const role = index === 0 ? "P1" : "P2";
        callback({ success: true, role });
    });


    socket.on('reconnectPlayer', (roomId, playerId) => {
        if (rooms[roomId]) {
            const player = rooms[roomId].players.find(p => p.id === playerId);
            if (player) {
                socket.join(roomId);
                console.log(`🔄 Reconnexion du joueur ${player.name} (${playerId}) dans la room ${roomId}`);
                io.to(roomId).emit('updatePlayers', rooms[roomId].players, rooms[roomId].host);
            }
        }
    });


    socket.on('showRoomDetails', (roomId, callback) => {
        console.log(`🔍 Demande de détails de la room: ${roomId}`);
        if (!rooms[roomId]) {
            console.log(`❌ ERREUR : La room ${roomId} n'existe pas !`);
            return callback({ success: false, message: "La room est introuvable." });
        }
        callback({
            success: true,
            name: rooms[roomId].name,
            players: rooms[roomId].players,
            host: rooms[roomId].host
        });
    });


    socket.on('startGame', (roomId, playerId) => {
        if (rooms[roomId] && rooms[roomId].host === playerId) {
            console.log(`🎮 Démarrage de la partie dans la room ${roomId}`);
            io.to(roomId).emit('gameStarted');
        } else {
            console.log(`❌ Tentative de démarrage refusée pour le joueur ${playerId}`);
        }
    });
    socket.on('playerReadyForStepper', (roomId, playerId) => {
        if (!roomReadyPlayers[roomId]) {
            roomReadyPlayers[roomId] = new Set();
        }

        roomReadyPlayers[roomId].add(playerId);
        console.log(`✅ ${playerId} est prêt pour le jeu (Room: ${roomId})`);

        const playersInRoom = (rooms[roomId] && rooms[roomId].players) ? rooms[roomId].players.length : 0;


        if (roomReadyPlayers[roomId].size === playersInRoom) {
            console.log(`🎉 Tous les joueurs sont prêts dans la room ${roomId}. Lancement du jeu.`);
            io.to(roomId).emit('startGame');
            roomReadyPlayers[roomId] = new Set();
        }
    });



    socket.on('disconnect', () => {
        let roomToDelete = null;

        for (const roomId in rooms) {
            rooms[roomId].players = rooms[roomId].players.filter(player => player.id !== socket.id);
            if (roomReadyPlayers[roomId]) {
                roomReadyPlayers[roomId].delete(socket.id);
            }

            if (rooms[roomId].host === socket.id) {
                if (rooms[roomId].players.length > 0) {
                    rooms[roomId].host = rooms[roomId].players[0].id;
                } else {
                    roomToDelete = roomId;
                }
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