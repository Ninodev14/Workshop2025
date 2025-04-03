const socket = io();

// Mettre à jour la liste des rooms toutes les 5 secondes
setInterval(() => {
    socket.emit('requestRooms');
}, 5000);

// Mettre à jour la liste des rooms ouvertes
socket.on('updateRooms', (rooms) => {
    const roomList = document.getElementById("room-list");
    roomList.innerHTML = ""; // Réinitialiser la liste

    // Affichage des rooms
    Object.entries(rooms).forEach(([roomId, room]) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${room.name}</strong> - ${room.players.length}/${room.maxPlayers} joueurs 
                        <button onclick="joinRoom('${roomId}')">Rejoindre</button>`;
        roomList.appendChild(li);
    });
});

// Aller sur la page de création de room
function goToCreatePage() {
    window.location.href = "create_room.html"; // Page de création d'une room
}

// Rejoindre une room
function joinRoom(roomId) {
    socket.emit('joinRoom', roomId, (response) => {
        if (response.success) {
            // Enregistrer l'ID de la room dans sessionStorage et aller sur la page du jeu
            sessionStorage.setItem('roomId', roomId);
            window.location.href = `waiting_room.html?roomId=${roomId}`; // Page d'attente pour rejoindre la partie
        } else {
            alert(response.message); // Afficher un message si l'on ne peut pas rejoindre la room
        }
    });
}

socket.emit('requestRooms');