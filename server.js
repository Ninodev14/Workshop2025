const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let playerSockets = {};
let rooms = {};
let roomReadyPlayers = {};
let roomRecipeTotals = {};
let disconnectTimeouts = {};


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
        playerSockets[playerId] = socket.id;
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
        playerSockets[playerId] = socket.id;
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
            delete rooms[roomId];
            io.emit('updateRooms', rooms);
        } else {
            console.log(`❌ Tentative de démarrage refusée pour le joueur ${playerId}`);
        }
    });

    socket.on('playerReadyForGame', (roomId, playerId) => {
        socket.join(roomId);

        if (!roomReadyPlayers[roomId]) {
            roomReadyPlayers[roomId] = new Set();
        }

        roomReadyPlayers[roomId].add(playerId);
        console.log(`✅ ${playerId} est prêt pour le jeu (Room: ${roomId})`);

        const playersInRoom = rooms[roomId].players.length;

        if (roomReadyPlayers[roomId].size === playersInRoom) {
            console.log(`🎉 Tous les joueurs sont prêts dans la room ${roomId}. Lancement du jeu.`);
            console.log(`Les joueurs dans la room ${roomId}:`, rooms[roomId].players);
            io.to(roomId).emit('GameCanBigin');
        }
    });




    socket.on('disconnect', () => {
        const playerId = Object.keys(playerSockets).find(id => playerSockets[id] === socket.id);
        console.log('🔌 Déconnexion détectée pour le socket:', socket.id);
        console.log('➡️ Résolu comme playerId:', playerId);
        if (!playerId) return;

        console.log(`🔌 Déconnexion détectée pour le joueur ${playerId}`);

        disconnectTimeouts[playerId] = setTimeout(() => {
            console.log(`⏳ Temps écoulé : suppression définitive du joueur ${playerId}`);
            let roomToDelete = [];

            for (const roomId in rooms) {
                const room = rooms[roomId];

                // Retirer le joueur de la room
                room.players = room.players.filter(player => player.id !== playerId);

                if (roomReadyPlayers[roomId]) {
                    roomReadyPlayers[roomId].delete(playerId);
                }

                if (room.host === playerId) {
                    if (room.players.length > 0) {
                        room.host = room.players[0].id;
                    } else {
                        roomToDelete.push(roomId);
                    }
                }

                if (room.players.length === 0) {
                    roomToDelete.push(roomId);
                }
            }

            roomToDelete.forEach(roomId => {
                delete rooms[roomId];
                delete roomReadyPlayers[roomId];
                delete roomRecipeTotals[roomId];
                console.log(`🧹 Room supprimée car vide : ${roomId}`);
            });

            delete playerSockets[playerId];
            delete disconnectTimeouts[playerId];

            io.emit('updateRooms', rooms);
        }, 10000); // Attend 10 secondes avant suppression définitive
    });

    socket.on('reconnectPlayer', (roomId, playerId) => {
        console.log(`🔁 Tentative de reconnexion pour playerId: ${playerId}`);
        if (disconnectTimeouts[playerId]) {
            console.log('❌ Timeout trouvé, on le clear');
            clearTimeout(disconnectTimeouts[playerId]);
            delete disconnectTimeouts[playerId];
        } else {
            console.log('⚠️ Aucun timeout trouvé pour ce joueur, trop tard ?');
        }

        if (rooms[roomId]) {
            const player = rooms[roomId].players.find(p => p.id === playerId);
            if (player) {
                playerSockets[playerId] = socket.id;
                socket.join(roomId);
                console.log(`🔄 Reconnexion du joueur ${player.name} (${playerId}) dans la room ${roomId}`);
                io.to(roomId).emit('updatePlayers', rooms[roomId].players, rooms[roomId].host);
                io.emit('updateRooms', rooms); // <-- Ajoute ça si tu veux garder les rooms à jour
            }
        }

    });



    socket.on('sendIngredient', (data) => {
        console.log('Ingrédient reçu sur le serveur:', data);

        const roomId = data.roomId;
        const targetRoom = rooms[roomId];

        if (targetRoom) {
            console.log('Liste des joueurs dans la room:', targetRoom.players);
            io.to(roomId).emit('receiveIngredient', data);
            console.log('✅ Ingrédient envoyé à la room:', roomId);
        } else {
            console.log('❌ Room introuvable:', roomId);
        }
    });
    socket.on('removeIngredient', (data) => {
        console.log('Demande de suppression d’ingrédient:', data);

        const roomId = data.roomId;
        const targetRoom = rooms[roomId];

        if (targetRoom) {
            const index = data.to === "P1" ? 0 : 1;
            const player = targetRoom.players[index];

            if (player) {
                const socketId = playerSockets[player.id];
                if (socketId) {
                    io.to(roomId).emit('ingredientRemoved', data);
                    console.log(`✅ Ingrédient retiré et signalé à ${data.to}`);
                } else {
                    console.log(`❌ Socket introuvable pour le joueur ${player.id}`);
                }
            } else {
                console.log('❌ Joueur introuvable pour la suppression');
            }
        } else {
            console.log('❌ Room introuvable:', roomId);
        }
    });

    socket.on('TotRecipeDone', (data) => {
        console.log(`📨 Recette reçue de ${socket.id} pour room ${data.roomId}`);



        if (!rooms[data.roomId]) {
            console.log(`❌ Room introuvable : ${data.roomId}`);
            return;
        }

        // Initialise le total s'il n'existe pas encore
        if (!roomRecipeTotals[data.roomId]) {
            roomRecipeTotals[data.roomId] = 0;
        }

        // Incrémentation

        roomRecipeTotals[data.roomId]++;
        let total = roomRecipeTotals[data.roomId];

        console.log(`🍲 Total de recettes pour la room ${data.roomId} : ${total}`);

        // Envoi du nouveau total aux joueurs de la room
        io.to(data.roomId).emit('updateRecipe', { total })



    });















});



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`✅ Serveur en écoute sur le port ${port}`);
});