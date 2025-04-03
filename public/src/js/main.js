const socket = io();

let selectedIngredient = null;
let selectedRecipe = "";
let chosenIngredients = [];
let players = 2;
let currentPlayer = 1;
let totalRounds = 0;
let availableIngredients = {};
let allIngredients = [];

function nextStep(step) {
    document.getElementById("step-1").style.display = step === 1 ? "block" : "none";
    document.getElementById("step-2").style.display = step === 2 ? "block" : "none";
    document.getElementById("step-3").style.display = step === 3 ? "block" : "none";

    if (step === 2) {
        players = parseInt(document.getElementById("player-count").value);
        populateRecipeSelect();
    }
    if (step === 3) {
        startGame();
    }
}

function populateRecipeSelect() {
    const select = document.getElementById("recipe-select");
    select.innerHTML = Object.keys(recipes).map(r => `<option value="${r}">${r}</option>`).join("");
}

function startGame() {
    selectedRecipe = document.getElementById("recipe-select").value;
    chosenIngredients = [];
    currentPlayer = 1;
    totalRounds = 0;
    document.getElementById("ingredient-list").innerHTML = "";
    document.getElementById("result").style.display = "none";
    document.getElementById("result-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;

    // Envoyer les données du jeu au serveur
    socket.emit('joinGame', {
        recipe: selectedRecipe,
        players: players
    });

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

    if (availableIngredients[currentPlayer].length === 0) {
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
    // Enlever la sélection des autres
    document.querySelectorAll('.ingredient-img').forEach(img => img.classList.remove('selected'));

    // Ajouter la sélection
    imgElement.classList.add('selected');
    selectedIngredient = ingredient;
}

function addIngredient() {
    if (!selectedIngredient) {
        alert("Veuillez d'abord sélectionner un ingrédient !");
        return;
    }

    if (chosenIngredients.includes(selectedIngredient)) {
        alert("Cet ingrédient a déjà été ajouté !");
        return;
    }

    chosenIngredients.push(selectedIngredient);

    // Ajoute l'ingrédient sous forme d'image dans la liste
    const ingredientList = document.getElementById("ingredient-list");
    const listItem = document.createElement("li");

    const img = document.createElement("img");
    img.src = `src/img/${selectedIngredient.toLowerCase()}.png`;
    img.alt = selectedIngredient;
    img.classList.add("selected-ingredient-img");

    listItem.appendChild(img);
    ingredientList.appendChild(listItem);

    availableIngredients[currentPlayer] = availableIngredients[currentPlayer].filter(i => i !== selectedIngredient);
    if (allIngredients.length > 0) {
        availableIngredients[currentPlayer].push(allIngredients.shift());
    }

    totalRounds++;

    // Notifier le serveur qu'un ingrédient a été ajouté
    socket.emit('addIngredient', {
        player: currentPlayer,
        ingredient: selectedIngredient
    });

    if (totalRounds >= recipes[selectedRecipe].correct.length) {
        document.getElementById("ingredient-container").style.display = "none";
        document.getElementById("current-player").style.display = "none";
        document.getElementById("result-btn").style.display = "block";
        return;
    }

    nextPlayer();
}


function nextPlayer() {
    currentPlayer = (currentPlayer % players) + 1;
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;

    // Envoyer au serveur qu'on passe au joueur suivant
    socket.emit('nextPlayer', currentPlayer);

    populateIngredientSelect();
}

function calculateScore() {
    const { correct, incorrect } = recipes[selectedRecipe];

    let correctCount = chosenIngredients.filter(i => correct.includes(i)).length;
    let incorrectCount = chosenIngredients.filter(i => incorrect.includes(i)).length;

    let score = (correctCount / correct.length) * 100;
    let penalty = incorrectCount * 10;

    let finalScore = Math.max(0, score - penalty);

    document.getElementById("result").innerText = `Recette suivie à ${finalScore.toFixed(1)}%`;
    document.getElementById("result").style.display = "block";
    document.getElementById("restart-btn").style.display = "block";
}

function restartGame() {
    nextStep(1);
}

nextStep(1);

socket.on('switchPlayer', (currentPlayer) => {
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;
    populateIngredientSelect();
});

// Écoute pour les ajouts d'ingrédient (pour tous les clients)
socket.on('ingredientAdded', (ingredientData) => {
    // Mettre à jour l'interface en fonction de l'ingrédient ajouté
    console.log(`${ingredientData.player} a ajouté ${ingredientData.ingredient}`);
});