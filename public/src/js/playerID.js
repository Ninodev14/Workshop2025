if (!localStorage.getItem("playerId")) {
    localStorage.setItem("playerId", Math.random().toString(36).substr(2, 9));
}
const playerId = localStorage.getItem("playerId");
console.log(`🎮 Player ID: ${playerId}`);