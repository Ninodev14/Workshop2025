const socket = io();

// Mettre à jour la liste des rooms toutes les 5 secondes
setInterval(() => {
    socket.emit('requestRooms');
}, 5000);

// Mettre à jour la liste des rooms ouvertes
socket.on('updateRooms', (rooms) => {
    const roomList = document.getElementById("room-list");
    roomList.innerHTML = ""; // Réinitialiser la liste

    Object.entries(rooms).forEach(([roomId, room]) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${room.name}</strong> - ${room.players.length}/${room.maxPlayers} joueurs 
                        <button onclick="joinRoom('${roomId}')">Rejoindre</button>`;
        roomList.appendChild(li);
    });
});

// Aller sur la page de création
function goToCreatePage() {
    window.location.href = "create.html";
}

// Rejoindre une room
function joinRoom(roomId) {
    socket.emit('joinRoom', roomId);
    sessionStorage.setItem('roomId', roomId);
    window.location.href = `game.html?room=${roomId}`;
}

// Demande initiale des rooms
socket.emit('requestRooms');