// main.js
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
    const select = document.getElementById("ingredient-select");

    if (availableIngredients[currentPlayer].length === 0) {
        nextPlayer();
        return;
    }

    select.innerHTML = availableIngredients[currentPlayer].map(i => `<option value="${i}">${i}</option>`).join("");
}

function addIngredient() {
    const ingredient = document.getElementById("ingredient-select").value;

    if (chosenIngredients.includes(ingredient)) {
        alert("Cet ingrédient a déjà été ajouté !");
        return;
    }

    chosenIngredients.push(ingredient);
    document.getElementById("ingredient-list").innerHTML += `<li>${ingredient} (Joueur ${currentPlayer})</li>`;
    availableIngredients[currentPlayer] = availableIngredients[currentPlayer].filter(i => i !== ingredient);
    if (allIngredients.length > 0) {
        availableIngredients[currentPlayer].push(allIngredients.shift());
    }

    totalRounds++;

    if (totalRounds >= recipes[selectedRecipe].correct.length) {
        document.getElementById("ingredient-select").style.display = "none";
        document.getElementById("current-player").style.display = "none";
        document.getElementById("result-btn").style.display = "block";
        return;
    }

    nextPlayer();
}

function nextPlayer() {
    currentPlayer = (currentPlayer % players) + 1;
    document.getElementById("current-player").innerText = `Joueur ${currentPlayer}, choisissez un ingrédient :`;
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