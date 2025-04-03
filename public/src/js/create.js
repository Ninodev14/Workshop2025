const socket = io();

function confirmCreateRoom() {
    const roomName = document.getElementById("room-name").value.trim();
    const maxPlayers = document.getElementById("max-players").value;

    if (!roomName) {
        alert("Veuillez entrer un nom de room !");
        return;
    }

    // Générer un ID unique pour la room
    const roomId = Math.random().toString(36).substr(2, 6);

    // Envoyer la création de la room au serveur
    socket.emit('createRoom', { roomId, roomName, maxPlayers });

    // Stocker l'ID et le nom de la room pour l'utiliser dans la partie
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('roomName', roomName);

    // Rediriger vers game.html
    window.location.href = `game.html?room=${roomId}`;
}