const socket = io();

let playerRole = null;
let maxIngredients = 2;
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

    recipe.ingredients.forEach(ingredient => {
        // Vérification pour un objet avec src
        if (typeof ingredient === 'object' && ingredient.src) {
            const imgSrc = ingredient.src; // src dans l'objet
            const altText = imgSrc.split('/').pop().replace('.png', ''); // On extrait le nom de l'image
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = altText;
            img.style.width = "60px";
            img.style.height = "60px";
            img.setAttribute("data-state", ingredient.state || 0); // Utilisation de l'état si disponible
            ingredientsDiv.appendChild(img);
        } else if (typeof ingredient === 'string') { // Ancien format string
            const altText = ingredient.split('/').pop().replace('.png', '');
            const img = document.createElement("img");
            img.src = ingredient;
            img.alt = altText;
            img.style.width = "60px";
            img.style.height = "60px";
            img.setAttribute("data-state", 0);
            ingredientsDiv.appendChild(img);
        } else {
            console.error("❌ Format d'ingrédient non valide", ingredient);
        }
    });

    container.appendChild(ingredientsDiv);

    // Mise à jour de la logique pour le tableau weightedPool
    weightedPool = additionalImages.concat(
        recipe.ingredients.flatMap(ing => Array(3).fill(ing.src)) // Utilisation de ing.src dans weightedPool
    );

    const zoneId = targetDivId === "Player1Recipe" ? "Player1IngredientZone" : "Player2IngredientZone";
    const animationZone = document.getElementById(zoneId);
    animationZone.innerHTML = ''; // Réinitialisation de la zone

    recipe.ingredients.forEach((src, index) => {
        // Création des images animées pour chaque ingrédient
        const animatedImg = document.createElement("img");
        const altText = src.src.split('/').pop().replace('.png', ''); // src dans l'objet
        animatedImg.src = src.src;
        animatedImg.alt = altText;
        animatedImg.classList.add("ingredient-img");
        animatedImg.draggable = true;
        animatedImg.style.animationDelay = `${index * 1}s`;
        animatedImg.setAttribute("data-state", "0");
        animationZone.appendChild(animatedImg);
        registerInitialZone(animatedImg, animationZone);
    });

    // Gestion de la validation
    const validateButtonId = targetDivId === "Player1Recipe" ? "validateButtonP1" : "validateButtonP2";
    const verificationZoneId = targetDivId === "Player1Recipe" ? "Player1VerificationZone" : "Player2VerificationZone";

    const validateButton = document.getElementById(validateButtonId);
    validateButton.disabled = true;
    validateButton.addEventListener("click", () => {
        validateRecipeCompletion(targetDivId);
    });

    monitorVerificationZone(verificationZoneId, validateButtonId);
}


function monitorVerificationZone(zoneId, buttonId) {
    const zone = document.getElementById(zoneId);
    const button = document.getElementById(buttonId);

    const observer = new MutationObserver(() => {
        const elements = Array.from(zone.children);
        console.log(`Zone ${zoneId} contient ${elements.length} éléments.`);

        if (elements.length === 5) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    observer.observe(zone, { childList: true });
}

function validateRecipeCompletion(targetDivId) {
    const expectedZoneId = targetDivId === "Player1Recipe" ? "Player1VerificationZone" : "Player2VerificationZone";
    const dropZone = document.getElementById(expectedZoneId);
    const recipeDiv = document.getElementById(targetDivId);

    // Fonction pour récupérer le texte et l'état d'un élément et de son enfant (ingredient-text)
    function getIngredientData(imgElement) {
        const ingredientText = imgElement.querySelector(".ingredient-text");
        if (ingredientText) {
            return {
                text: ingredientText.textContent.trim(), // Récupère le texte de l'élément enfant
                state: ingredientText.getAttribute('data-state') // Récupère l'état de l'élément enfant
            };
        } else {
            return {
                text: imgElement.alt, // Si aucun enfant, utilise l'attr alt de l'image (ancien comportement)
                state: imgElement.getAttribute('data-state')
            };
        }
    }

    // Extraire les ingrédients attendus (avec leur src et state) de la recette
    const recipeIngredients = Array.from(recipeDiv.querySelectorAll("img")).map(img => {
        const ingredientData = getIngredientData(img);
        return {
            src: img.src,
            state: ingredientData.state,
            text: ingredientData.text // Ajoute le texte des enfants
        };
    });

    // Extraire les ingrédients déposés (avec leur alt et state) dans la zone de dépôt
    const droppedIngredients = Array.from(dropZone.querySelectorAll("img")).map(img => {
        const ingredientData = getIngredientData(img);
        return {
            alt: ingredientData.text, // Utilise le texte récupéré de l'élément enfant
            state: ingredientData.state
        };
    });

    // Vérification des ingrédients manquants et incorrects
    const missingIngredients = recipeIngredients.filter(recipeIng =>
        !droppedIngredients.some(droppedIng =>
            droppedIng.alt === recipeIng.src.split('/').pop().replace('.png', '') &&
            droppedIng.state === recipeIng.state
        )
    );

    const incorrectIngredients = droppedIngredients.filter(droppedIng =>
        !recipeIngredients.some(recipeIng =>
            recipeIng.src.split('/').pop().replace('.png', '') === droppedIng.alt &&
            recipeIng.state === droppedIng.state
        )
    );

    const messageDiv = document.getElementById("recipe-validation-message");
    messageDiv.style.display = "block";

    if (missingIngredients.length === 0 && incorrectIngredients.length === 0) {
        messageDiv.textContent = "🎉 Recette réussie ! Tous les bons ingrédients sont présents.";
        messageDiv.className = "success-message";
    } else {
        let errorMessage = "❌ Recette incorrecte.\n";
        if (missingIngredients.length > 0) {
            errorMessage += `🧂 Ingrédients manquants : ${missingIngredients.map(ing => ing.src.split('/').pop().replace('.png', '')).join(", ")}.\n`;
        }
        if (incorrectIngredients.length > 0) {
            errorMessage += `🍄 Ingrédients incorrects : ${incorrectIngredients.map(ing => ing.alt).join(", ")}.`;
        }
        messageDiv.textContent = errorMessage;
        messageDiv.className = "error-message";
    }
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

drake.on('drop', (el, target) => {
    console.log("Élément déposé", el);
    console.log("Zone cible", target);

    if (target.classList.contains('drop-zone') || target.classList.contains('verification-zone')) {
        const isVerificationZone = target.classList.contains('verification-zone');
        const limit = isVerificationZone ? 6 : maxIngredients;

        const imageCount = Array.from(target.children).filter(child => child.tagName === "IMG").length;

        if (imageCount < limit) {
            el.draggable = false;
            target.appendChild(el);
            el.style.animation = 'none';
            el.style.position = "relative";
            console.log(`${target.id} a maintenant ${imageCount + 1} ingrédients.`);
        } else {
            console.log("Zone déjà pleine.");
            el.remove();
        }
    } else {
        console.log("Zone incorrecte, l'élément disparaît.");
        el.remove();
    }
});

function initializeDropZones() {
    const dropZones = [
        document.getElementById('Player1DropZone'),
        document.getElementById('Player2DropZone')
    ];
    drake.containers.push(...dropZones);
}

function initializeVerificationZone() {
    const verificationZones = [
        document.getElementById('Player1VerificationZone'),
        document.getElementById('Player2VerificationZone')
    ];

    if (!verificationZones[0] || !verificationZones[1]) {
        console.error("❌ Zones de vérification introuvables");
    } else {
        console.log("✅ Zones de vérification trouvées");
        drake.containers.push(...verificationZones);
    }
}

function setupDragAndDropLogic() {
    drake.on('drag', (el) => {
        el.classList.add('dragging');
    });

    drake.on('dragend', (el) => {
        el.classList.remove('dragging');
    });

    drake.on('drop', (el, target) => {
        console.log("Élément déposé", el);
        console.log("Zone cible", target);

        const isVerificationZone = target.classList.contains('verification-zone');
        const limit = isVerificationZone ? 6 : maxIngredients;

        const imageCount = Array.from(target.children).filter(child => child.tagName === "IMG").length;

        if (target.classList.contains('drop-zone') || isVerificationZone) {
            if (imageCount < limit) {
                el.draggable = false;
                target.appendChild(el);
                el.style.animation = 'none';
                el.style.position = "relative";
                console.log(`${target.id} a maintenant ${imageCount + 1} ingrédients.`);
            } else {
                console.log("Zone déjà pleine.");
                el.remove();
            }
        } else {
            console.log("Zone incorrecte, l'élément disparaît.");
            el.remove();
        }
    });
}

let clickCounts = {};

function isInPlayer1DropZone(imgElement) {
    const player1DropZone = document.getElementById("Player1DropZone");
    return Array.from(player1DropZone.children).includes(imgElement);
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
    randomImg.setAttribute('data-state', '0'); // Initialisation avec data-state="0"

    animationZone.appendChild(randomImg);
    registerInitialZone(randomImg, animationZone);

    clickCounts[randomImg.src] = 0;

    randomImg.addEventListener('click', () => {
        const player1DropZone = document.getElementById("Player1DropZone");

        if (Array.from(player1DropZone.children).includes(randomImg)) {
            clickCounts[randomImg.src] += 1;
            console.log(`Clics sur ${randomImg.alt}: ${clickCounts[randomImg.src]}`);

            if (clickCounts[randomImg.src] >= 20) {
                cutImageInTwo(randomImg); // On découpe l'image après 20 clics
            }
        } else {
            console.log("L'image n'est pas dans la bonne zone, on ne peut pas la couper.");
        }
    });
}


function cutImageInTwo(imgElement) {
    const src = imgElement.src;
    const altText = imgElement.alt;
    const imageContainer = imgElement.parentElement;
    imgElement.remove();

    const cutContainer = document.createElement('div');
    cutContainer.classList.add('cut-container');

    const leftPart = document.createElement('div');
    leftPart.classList.add('image-part', 'left');
    leftPart.style.backgroundImage = `url(${src})`;
    leftPart.setAttribute('data-state', '1');
    leftPart.setAttribute('data-alt', altText);

    const rightPart = document.createElement('div');
    rightPart.classList.add('image-part', 'right');
    rightPart.style.backgroundImage = `url(${src})`;

    cutContainer.appendChild(leftPart);
    cutContainer.appendChild(rightPart);

    imageContainer.appendChild(cutContainer);

    const textDiv = document.createElement('div');
    textDiv.classList.add('ingredient-text');
    textDiv.textContent = altText;

    textDiv.style.display = "none";
    cutContainer.appendChild(textDiv);
    textDiv.setAttribute('data-state', '1');
    console.log(`L'image ${altText} a été coupée en deux !`);
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
    initializeVerificationZone();
    initializeDropZones();
});