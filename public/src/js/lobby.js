const socket = io();

// Créer une room avec un ID unique
function createRoom() {
    const roomId = Math.random().toString(36).substr(2, 6); // Génère un ID aléatoire
    const maxPlayers = document.getElementById("max-players").value;

    socket.emit('createRoom', { roomId, maxPlayers });

    sessionStorage.setItem('roomId', roomId);
    window.location.href = `game.html?room=${roomId}`;
}

// Rejoindre une room existante
function joinRoom() {
    const roomId = document.getElementById("room-id").value.trim();
    if (!roomId) {
        alert("Veuillez entrer un ID de room !");
        return;
    }
    socket.emit('joinRoom', roomId);
    sessionStorage.setItem('roomId', roomId);
    window.location.href = `game.html?room=${roomId}`;
}

// Mettre à jour la liste des rooms ouvertes
socket.on('updateRooms', (rooms) => {
    const roomList = document.getElementById("room-list");
    roomList.innerHTML = "";

    for (const roomId in rooms) {
        const room = rooms[roomId];
        const li = document.createElement("li");
        li.innerHTML = `Room <strong>${roomId}</strong> - ${room.players.length}/${room.maxPlayers} joueurs 
                        <button onclick="joinSpecificRoom('${roomId}')">Rejoindre</button>`;
        roomList.appendChild(li);
    }
});

// Fonction pour rejoindre une room depuis la liste affichée
function joinSpecificRoom(roomId) {
    socket.emit('joinRoom', roomId);
    sessionStorage.setItem('roomId', roomId);
    window.location.href = `game.html?room=${roomId}`;
}