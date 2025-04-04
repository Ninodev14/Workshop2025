const socket = io();
let selectedIngredient = null;
let selectedRecipe = "";
let chosenIngredients = [];
let players = 2;
let currentPlayer = 1;
let totalRounds = 0;
let availableIngredients = {};
let allIngredients = [];
let roomId = "";

const recipes = {
    "Pizza": {
        correct: ["Farine", "Eau", "Levure", "Sel", "Tomate", "Fromage"],
        incorrect: ["Chocolat", "Fraise", "Miel", "Curry", "Banane"]
    },
    "Salade": {
        correct: ["Laitue", "Tomate", "Concombre", "Oignon", "Huile", "Sel"],
        incorrect: ["Nutella", "Pâte à tartiner", "Beurre", "Ketchup", "Bonbon"]
    }
};

function getRandomRecipe() {
    const recipeNames = Object.keys(recipes);
    const randomIndex = Math.floor(Math.random() * recipeNames.length);
    return recipeNames[randomIndex];
}

document.addEventListener("DOMContentLoaded", () => {
    selectedRecipe = getRandomRecipe();
    document.getElementById("recipe-name").innerText = selectedRecipe;
    nextStep(2); // Passe à l'étape 2 après avoir choisi la recette
});

socket.on('gameData', (gameState) => {
    console.log("Données du jeu reçues :", gameState);

    if (gameState.gameState === 'waiting') {
        document.getElementById('step-1').style.display = 'block';
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'none';
    } else if (gameState.gameState === 'started') {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'block';
    }
});

function startGame() {
    socket.emit('startCooking', roomId);
}

function createRoom() {
    roomId = "room-" + Math.random().toString(36).substring(7);
    selectedRecipe = getRandomRecipe(); // Choix aléatoire de la recette

    console.log(`Recette sélectionnée : ${selectedRecipe}`); // Pour vérifier la recette choisie

    socket.emit("createRoom", { roomId, recipe: selectedRecipe, players });

    nextStep(2);
}

function nextStep(step) {
    if (step === 2) {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
    } else if (step === 3) {
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'block';
    }
}

function startGame() {
    chosenIngredients = [];
    currentPlayer = 1;
    totalRounds = 0;
    document.getElementById("ingredient-list").innerHTML = "";
    document.getElementById("result").style.display = "none";
    document.getElementById("result-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";

    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;

    distributeIngredients();
    populateIngredientSelect();
}

function distributeIngredients() {
    const { correct, incorrect } = recipes[selectedRecipe];
    allIngredients = [...correct, ...incorrect].sort(() => Math.random() - 0.5);

    availableIngredients = {};

    for (let i = 1; i <= players; i++) {
        availableIngredients[i] = getNewIngredients();
    }
}

function getNewIngredients() {
    return allIngredients.splice(0, 3);
}

function populateIngredientSelect() {
    const container = document.getElementById("ingredient-container");
    container.innerHTML = "";
    selectedIngredient = null;

    if (!availableIngredients[currentPlayer] || availableIngredients[currentPlayer].length === 0) {
        nextPlayer();
        return;
    }

    availableIngredients[currentPlayer].forEach(ingredient => {
        const img = document.createElement("img");
        img.src = `src/img/${ingredient.toLowerCase()}.png`;
        img.alt = ingredient;
        img.classList.add("ingredient-img");
        img.onclick = () => selectIngredient(img, ingredient);

        container.appendChild(img);
    });
}

function selectIngredient(imgElement, ingredient) {
    document.querySelectorAll('.ingredient-img').forEach(img => img.classList.remove('selected'));
    imgElement.classList.add('selected');
    selectedIngredient = ingredient;
}

function addIngredient() {
    if (!selectedIngredient) {
        alert("Sélectionnez un ingrédient !");
        return;
    }

    if (chosenIngredients.includes(selectedIngredient)) {
        alert("Cet ingrédient est déjà ajouté !");
        return;
    }

    chosenIngredients.push(selectedIngredient);

    const ingredientList = document.getElementById("ingredient-list");
    const listItem = document.createElement("li");

    const img = document.createElement("img");
    img.src = `src/img/${selectedIngredient.toLowerCase()}.png`;
    img.alt = selectedIngredient;
    img.classList.add("selected-ingredient-img");

    listItem.appendChild(img);
    ingredientList.appendChild(listItem);

    availableIngredients[currentPlayer] = availableIngredients[currentPlayer].filter(i => i !== selectedIngredient);

    totalRounds++;

    socket.emit("addIngredient", { player: currentPlayer, ingredient: selectedIngredient }, roomId);

    if (totalRounds >= recipes[selectedRecipe].correct.length) {
        document.getElementById("result-btn").style.display = "block";
        return;
    }

    nextPlayer();
}

function nextPlayer() {
    currentPlayer = (currentPlayer % players) + 1;
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;
    socket.emit("nextPlayer", roomId);
}

socket.on("switchPlayer", (player) => {
    currentPlayer = player;
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;
    populateIngredientSelect();
});