const socket = io();
let selectedIngredient = null;
let selectedRecipe = "";
let chosenIngredients = [];
let players = 2; // Par défaut à 2, mais cela peut être modifié jusqu'à 4 joueurs
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

// Fonction pour obtenir une recette aléatoire
function getRandomRecipe() {
    const recipeNames = Object.keys(recipes);
    const randomIndex = Math.floor(Math.random() * recipeNames.length);
    return recipeNames[randomIndex];
}

document.addEventListener("DOMContentLoaded", () => {
    selectedRecipe = getRandomRecipe();
    document.getElementById("recipe-name").innerText = selectedRecipe;
    document.getElementById("recipe-name-play").innerText = selectedRecipe; // Pour l'affichage pendant le jeu
});

function continueGame() {
    document.getElementById("recipe-selection").style.display = "none"; // Cacher la sélection de recette
    document.getElementById("game-play").style.display = "block"; // Afficher le jeu

    startGame();
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
    managePlayerButtons();
}

// Distribution des ingrédients entre les joueurs
function distributeIngredients() {
    const { correct, incorrect } = recipes[selectedRecipe];
    allIngredients = [...correct, ...incorrect].sort(() => Math.random() - 0.5);

    availableIngredients = {};

    for (let i = 1; i <= players; i++) {
        availableIngredients[i] = getNewIngredients();
    }
}

// Distribution des nouveaux ingrédients à chaque joueur
function getNewIngredients() {
    return allIngredients.splice(0, 3);
}

// Remplissage de la sélection des ingrédients pour le joueur actuel
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

// Passer au joueur suivant
function nextPlayer() {
    currentPlayer = (currentPlayer % players) + 1;
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;
    socket.emit("nextPlayer", roomId);
    managePlayerButtons(); // Gérer l'état des boutons pour le joueur actuel
}

// Gérer l'état des boutons (activer/désactiver selon le joueur)
function managePlayerButtons() {
    // Désactiver tous les boutons
    const addButton = document.querySelector(".btnBoncy");
    addButton.disabled = true;

    // Activer le bouton pour le joueur actuel
    if (currentPlayer === 1) {
        addButton.disabled = false;
    } else if (currentPlayer === 2) {
        addButton.disabled = false;
    } else if (currentPlayer === 3) {
        addButton.disabled = false;
    } else if (currentPlayer === 4) {
        addButton.disabled = false;
    }
}

// Gestion du changement de joueur via socket
socket.on("switchPlayer", (player) => {
    currentPlayer = player;
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;
    populateIngredientSelect();
    managePlayerButtons(); // Mise à jour de l'état des boutons
});