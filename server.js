const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {}; // Stockage des rooms

// Servir les fichiers statiques
app.use(express.static('public'));

// Connexion d'un joueur
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
            players: [socket.id],
            maxPlayers: parseInt(maxPlayers),
            currentPlayer: 1,
            gameData: {},
            host: socket.id, // Le joueur qui a créé la room est l'hôte
        };

        console.log(`Room créée : ${roomName} (${roomId}) - Max: ${maxPlayers} joueurs`);
        io.emit('updateRooms', rooms); // Mise à jour des rooms pour tous les clients
    });

    // Rejoindre une room
    socket.on('joinRoom', (roomId, callback) => {
        if (rooms[roomId] && rooms[roomId].players.length < rooms[roomId].maxPlayers) {
            socket.join(roomId);
            rooms[roomId].players.push(socket.id);
            console.log(`Joueur ${socket.id} a rejoint la room ${roomId}`);

            // Mise à jour des joueurs et du joueur courant
            io.to(roomId).emit('updatePlayers', rooms[roomId].players);
            io.to(roomId).emit('currentPlayer', rooms[roomId].currentPlayer);
            io.emit('updateRooms', rooms); // Mise à jour globale des rooms

            callback({ success: true });
        } else {
            callback({ success: false, message: "La room est pleine ou introuvable." });
        }
    });

    // Récupérer les informations d'une room
    socket.on('getRoomInfo', (roomId) => {
        if (rooms[roomId]) {
            socket.emit('roomInfo', rooms[roomId]);
        }
    });

    // Ajouter un ingrédient à la room
    socket.on('addIngredient', (ingredientData, roomId) => {
        if (rooms[roomId]) {
            io.to(roomId).emit('ingredientAdded', ingredientData);
            // Passer au joueur suivant
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

        // Supprimer le joueur de la room à laquelle il appartient
        for (const roomId in rooms) {
            const index = rooms[roomId].players.indexOf(socket.id);
            if (index !== -1) {
                rooms[roomId].players.splice(index, 1);


                break;
            }
        }

        // Si la room est vide, la supprimer
        if (roomToDelete) {
            console.log(`Room supprimée : ${rooms[roomToDelete].name} (${roomToDelete})`);
            delete rooms[roomToDelete];
        }

        // Réémettre la liste des rooms après modification
        io.emit('updateRooms', rooms);
    });

    // Lancer une partie
    socket.on('startGame', (roomId) => {
        if (rooms[roomId] && rooms[roomId].host === socket.id) {
            io.to(roomId).emit('gameStarted');
        }
    });
});

// Lancer le serveur
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`✅ Serveur en écoute sur le port ${port}`);
});