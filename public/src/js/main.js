const socket = io();

let playerRole = null;
let maxIngredients = 1;
const roomId = new URLSearchParams(window.location.search).get('roomId');
const playerId = localStorage.getItem("playerId");
const playerName = localStorage.getItem("playerName");


const additionalImages = [
    "src/img/ingredients/tomato.png",
    "src/img/ingredients/cheese.png",
    "src/img/ingredients/lettuce.png",
    "src/img/ingredients/cucumber.png",
    "src/img/ingredients/pepperoni.png"
];

let weightedPool = additionalImages.slice();

socket.emit('requestRole', roomId, playerId, (response) => {
    if (response.success) {
        playerRole = response.role;
        console.log("🎭 Rôle assigné à l'entrée du jeu :", playerRole);
        document.getElementById("start-instructions").style.display = "block";
        document.getElementById("btn-step1").disabled = false;
    } else {
        console.error("❌ Impossible d'assigner un rôle :", response.message);
    }
});

function step2() {
    document.getElementById("start-instructions").style.display = "none";
    document.getElementById("step2-instructions").style.display = "block";
    document.getElementById("btn-step2").disabled = false;
}

function step3() {
    console.log("➡️ STEP 3 triggered");
    document.getElementById("step2-instructions").style.display = "none";

    if (playerRole === "P1") {
        console.log("✅ Affichage rôle P1");
        document.getElementById("step3-instructions-P1").style.display = "block";
        document.getElementById("btn-p1").disabled = false;
    } else if (playerRole === "P2") {
        console.log("✅ Affichage rôle P2");
        document.getElementById("step3-instructions-P2").style.display = "block";
        document.getElementById("btn-p2").disabled = false;
    } else {
        console.log("❌ Aucun rôle défini !");
    }
}

function readyToStartP1() {
    document.getElementById("step3-instructions-P1").style.display = "none";
    socket.emit("playerReadyForGame", roomId, playerId);
}

function readyToStartP2() {
    document.getElementById("step3-instructions-P2").style.display = "none";
    socket.emit("playerReadyForGame", roomId, playerId);
}

function clearIngredientZone(zoneId) {
    const zone = document.getElementById(zoneId);
    zone.innerHTML = '';
}

function spawnRandomIngredient(zoneId) {
    const randomImage = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    const animationZone = document.getElementById(zoneId);

    const randomImg = document.createElement("img");
    const altText = randomImage.split('/').pop().replace('.png', '');

    randomImg.src = randomImage;
    randomImg.alt = altText;
    randomImg.classList.add("ingredient-img");
    randomImg.draggable = true;
    randomImg.style.animationDelay = '0s';

    animationZone.appendChild(randomImg);
    registerInitialZone(randomImg, animationZone);
}

function startIngredientSpawning(zoneId) {
    setInterval(() => {
        spawnRandomIngredient(zoneId);
    }, 2000);
}

function startGame() {
    clearIngredientZone("Player1IngredientZone");
    clearIngredientZone("Player2IngredientZone");

    startIngredientSpawning("Player1IngredientZone");
    startIngredientSpawning("Player2IngredientZone");
}

function displayRandomRecipe(targetDivId) {
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    const container = document.getElementById(targetDivId);

    const title = document.createElement("h3");
    title.textContent = `Recette : ${recipe.name}`;
    container.appendChild(title);

    const ingredientsDiv = document.createElement("div");
    ingredientsDiv.style.display = "flex";
    ingredientsDiv.style.gap = "10px";

    recipe.ingredients.forEach(imgSrc => {
        const img = document.createElement("img");
        const altText = imgSrc.split('/').pop().replace('.png', '');
        img.src = imgSrc;
        img.alt = altText;
        img.style.width = "60px";
        img.style.height = "60px";
        ingredientsDiv.appendChild(img);
    });

    container.appendChild(ingredientsDiv);

    weightedPool = additionalImages.concat(
        recipe.ingredients.flatMap(ing => Array(3).fill(ing))
    );

    const zoneId = targetDivId === "Player1Recipe" ? "Player1IngredientZone" : "Player2IngredientZone";
    const animationZone = document.getElementById(zoneId);
    animationZone.innerHTML = '';

    recipe.ingredients.forEach((src, index) => {
        const animatedImg = document.createElement("img");
        const altText = src.split('/').pop().replace('.png', '');
        animatedImg.src = src;
        animatedImg.alt = altText;
        animatedImg.classList.add("ingredient-img");
        animatedImg.draggable = true;
        animatedImg.style.animationDelay = `${index * 1}s`;
        animationZone.appendChild(animatedImg);
        registerInitialZone(animatedImg, animationZone);
    });

    const randomImage = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    const randomImg = document.createElement("img");
    const randomAltText = randomImage.split('/').pop().replace('.png', '');
    randomImg.src = randomImage;
    randomImg.alt = randomAltText;
    randomImg.classList.add("ingredient-img");
    randomImg.draggable = true;
    randomImg.style.animationDelay = `${recipe.ingredients.length}s`;
    animationZone.appendChild(randomImg);
    registerInitialZone(randomImg, animationZone);
}

const drake = dragula([document.querySelector('#Player1IngredientZone'), document.querySelector('#Player2IngredientZone')]);

function registerInitialZone(imgElement, zone) {
    drake.on('drag', (el) => {
        el.classList.add('dragging');
    });
    drake.on('dragend', (el) => {
        el.classList.remove('dragging');
    });
}
let isIngredientInZone = {
    Player1: false,
    Player2: false
};

function initializeDropZones() {
    const dropZones = [
        document.getElementById('Player1DropZone'),
        document.getElementById('Player2DropZone')
    ];

    drake.on('drop', (el, target) => {
        console.log("Élément déposé", el);
        if (target.classList.contains('drop-zone')) {
            const player = target.id === 'Player1DropZone' ? 'Player1' : 'Player2';

            if (target.children.length < maxIngredients) {
                el.draggable = false;
                target.appendChild(el);
                el.style.animation = 'none';
                el.style.position = "relative";
                console.log(`${target.id} a maintenant ${target.children.length} ingrédients.`);
            } else {
                console.log("Zone déjà pleine.");
            }
        }
    });
}

socket.on("GameCanBigin", () => {
    console.log("🎮 Le jeu peut commencer!");
    document.getElementById("title").style.display = "none";
    if (playerRole === "P1") {
        document.getElementById("Player1Game").style.display = "block";
        displayRandomRecipe("Player1Recipe");
        startGame();
    } else if (playerRole === "P2") {
        document.getElementById("Player2Game").style.display = "block";
        displayRandomRecipe("Player2Recipe");
        startGame();
    }
    initializeDropZones();
});