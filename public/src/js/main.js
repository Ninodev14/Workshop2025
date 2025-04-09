const socket = io();

let playerRole = null;
let maxIngredients = 2;
const roomId = new URLSearchParams(window.location.search).get('roomId');
const playerId = localStorage.getItem("playerId");
const playerName = localStorage.getItem("playerName");


const additionalImages = [

    "src/img/ingredients/Bacon.png",
    "src/img/ingredients/Beurre.png",
    "src/img/ingredients/Boudoir.png",
    "src/img/ingredients/Carotte.png",
    "src/img/ingredients/Champignon.png",
    "src/img/ingredients/Chocolat en poudre.png",
    "src/img/ingredients/Chocolat.png",
    "src/img/ingredients/Chorizo.png",
    "src/img/ingredients/Citron.png",
    "src/img/ingredients/Cookie.png",
    "src/img/ingredients/Cornichon.png",
    "src/img/ingredients/Crème.png",
    "src/img/ingredients/Eau.png",
    "src/img/ingredients/Farine.png",
    "src/img/ingredients/Fraise.png",
    "src/img/ingredients/Fromage.png",
    "src/img/ingredients/Jambon.png",
    "src/img/ingredients/Kiwi.png",
    "src/img/ingredients/Lait.png",
    "src/img/ingredients/Miel.png",
    "src/img/ingredients/Myrtille.png",
    "src/img/ingredients/Oeuf.png",
    "src/img/ingredients/Oignon.png",
    "src/img/ingredients/Orange.png",
    "src/img/ingredients/Pain pita.png",
    "src/img/ingredients/Pain.png",
    "src/img/ingredients/Patate.png",
    "src/img/ingredients/Pâtes.png",
    "src/img/ingredients/Pêche.png",
    "src/img/ingredients/Pépites de chocolat.png",
    "src/img/ingredients/Petit pois.png",
    "src/img/ingredients/Piment.png",
    "src/img/ingredients/Poivre.png",
    "src/img/ingredients/Poisson.png",
    "src/img/ingredients/Pomme.png",
    "src/img/ingredients/Poulet frit.png",
    "src/img/ingredients/Poulet.png",
    "src/img/ingredients/Raisin.png",
    "src/img/ingredients/Riz.png",
    "src/img/ingredients/Salade.png",
    "src/img/ingredients/Sauce tomate.png",
    "src/img/ingredients/Sauce.png",
    "src/img/ingredients/Sucre.png",
    "src/img/ingredients/Saucisse.png",
    "src/img/ingredients/Sel.png",
    "src/img/ingredients/Steak.png",
    "src/img/ingredients/Tomate.png",
    "src/img/ingredients/Vanille.png",
    "src/img/ingredients/Yaourt.png",

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
        if (typeof ingredient === 'object' && ingredient.src) {
            const imgSrc = ingredient.src;
            const altText = imgSrc.split('/').pop().replace('.png', '');
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = altText;
            img.style.width = "auto";
            img.style.height = "60px";
            img.setAttribute("data-state", ingredient.state || 0);
            ingredientsDiv.appendChild(img);
        } else if (typeof ingredient === 'string') {
            const altText = ingredient.split('/').pop().replace('.png', '');
            const img = document.createElement("img");
            img.src = ingredient;
            img.alt = altText;
            img.style.width = "auto";
            img.style.height = "60px";
            img.setAttribute("data-state", 0);
            ingredientsDiv.appendChild(img);
        } else {
            console.error("❌ Format d'ingrédient non valide", ingredient);
        }
    });

    container.appendChild(ingredientsDiv);

    weightedPool = additionalImages.concat(
        recipe.ingredients.flatMap(ing => Array(3).fill(ing.src))
    );

    const zoneId = targetDivId === "Player1Recipe" ? "Player1IngredientZone" : "Player2IngredientZone";
    const animationZone = document.getElementById(zoneId);
    animationZone.innerHTML = '';

    recipe.ingredients.forEach((src, index) => {
        const animatedImg = document.createElement("img");
        const altText = src.src.split('/').pop().replace('.png', '');
        animatedImg.src = src.src;
        animatedImg.alt = altText;
        animatedImg.classList.add("ingredient-img");
        animatedImg.draggable = true;
        animatedImg.style.animationDelay = `${index * 1}s`;
        animatedImg.setAttribute("data-state", "0");
        animationZone.appendChild(animatedImg);
        registerInitialZone(animatedImg, animationZone);
    });

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

    function getDroppedIngredientData(element) {
        if (element.tagName === "IMG") {
            console.log("🔍 Élément image trouvé dans la zone :", element.alt, "État:", element.getAttribute('data-state'));
            return {
                text: element.alt,
                state: element.getAttribute('data-state')
            };
        } else if (element.classList.contains("cut-container")) {

            console.log("🔪 Élément découpé trouvé :", element.getAttribute('data-alt'), "État:", element.getAttribute('data-state'));
            return {
                text: element.getAttribute('data-alt') || element.textContent.trim(),
                state: element.getAttribute('data-state')
            };

        }
        console.warn("⚠️ Élément non reconnu :", element);
        return null;
    }

    const recipeIngredients = Array.from(recipeDiv.querySelectorAll("img")).map(img => {
        const ing = {
            text: img.src.split('/').pop().replace('.png', ''),
            state: img.getAttribute('data-state')
        };
        console.log("📋 Ingrédient attendu :", ing);
        return ing;
    });

    const droppedIngredients = Array.from(dropZone.children)
        .map(el => getDroppedIngredientData(el))
        .filter(data => data !== null);

    console.log("📦 Ingrédients déposés :", droppedIngredients);

    const missingIngredients = recipeIngredients.filter(recipeIng =>
        !droppedIngredients.some(droppedIng =>
            droppedIng.text === recipeIng.text && droppedIng.state === recipeIng.state
        )
    );

    const incorrectIngredients = droppedIngredients.filter(droppedIng =>
        !recipeIngredients.some(recipeIng =>
            recipeIng.text === droppedIng.text && recipeIng.state === droppedIng.state
        )
    );

    console.log("❓ Ingrédients manquants :", missingIngredients);
    console.log("🚫 Ingrédients incorrects :", incorrectIngredients);

    const messageDiv = document.getElementById("recipe-validation-message");
    messageDiv.style.display = "block";

    if (missingIngredients.length === 0 && incorrectIngredients.length === 0) {
        messageDiv.textContent = "🎉 Recette réussie ! Tous les bons ingrédients sont présents.";
        messageDiv.className = "success-message";
    } else {
        let errorMessage = "❌ Recette incorrecte.\n";
        if (missingIngredients.length > 0) {
            errorMessage += `🧂 Ingrédients manquants : ${missingIngredients.map(ing => ing.text).join(", ")}.\n`;
        }
        if (incorrectIngredients.length > 0) {
            errorMessage += `🍄 Ingrédients incorrects : ${incorrectIngredients.map(ing => ing.text).join(", ")}.`;
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
    const forbiddenTakeZones = ["Player1TakeZone", "Player2TakeZone"];
    const isGiveZone = target.classList.contains("give");

    if (forbiddenTakeZones.includes(target.id)) {
        console.log("⛔ Impossible de déposer ici (zone de réception uniquement).");
        const id = el.getAttribute("data-id");
        el.remove();
        if (id) {
            socket.emit("removeIngredient", {
                id,
                roomId,
                to: playerRole === "P1" ? "P2" : "P1"
            });
        }
        return;
    }

    if (!isGiveZone) {
        const id = el.getAttribute("data-id");
        if (id) {
            socket.emit("removeIngredient", {
                id,
                roomId,
                to: playerRole === "P1" ? "P2" : "P1"
            });
        }
    }

    if (target.id == "Player1GiveZone" && playerRole == "P1") {
        sendToPlayer(el, "P2");
        return;
    }

    if (target.id == "Player2GiveZone" && playerRole == "P2") {
        sendToPlayer(el, "P1");
        return;
    }

    // --- AUTRES ZONES ---
    const allowedZoneClasses = ['drop-zone', 'verification-zone', 'ingredient-zone'];
    const isAllowedZone = allowedZoneClasses.some(cls => target.classList.contains(cls));

    if (isAllowedZone) {
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
        const id = el.getAttribute("data-id");
        el.remove();
        if (id) {
            socket.emit("removeIngredient", {
                id,
                roomId,
                to: playerRole === "P1" ? "P2" : "P1"
            });
        }
    }
});

function sendToPlayer(el, to) {
    const isCut = !el.src;
    const src = isCut ? el.getAttribute('data-src') : el.src;
    const alt = isCut ? el.getAttribute('data-alt') : el.alt;
    const state = el.getAttribute('data-state') || "0";

    if (!src || !alt) {
        console.log("❌ Données manquantes");
        return;
    }

    const id = el.getAttribute("data-id") || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    el.setAttribute("data-id", id);

    const data = {
        src,
        alt,
        state,
        to,
        roomId,
        id
    };

    socket.emit("sendIngredient", data);

    console.log(`📦 Ingrédient envoyé à ${to} (id: ${id})`);
}

const player1GiveZone = document.getElementById("Player1GiveZone");
const player2GiveZone = document.getElementById("Player2GiveZone");
drake.containers.push(document.getElementById("Player1TakeZone"));
drake.containers.push(document.getElementById("Player2TakeZone"));

drake.containers.push(player1GiveZone);
drake.containers.push(player2GiveZone);


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
    randomImg.setAttribute('data-state', '0');

    animationZone.appendChild(randomImg);
    registerInitialZone(randomImg, animationZone);

    clickCounts[randomImg.src] = 0;

    randomImg.addEventListener('click', () => {
        const player1DropZone = document.getElementById("Player1DropZone");
        const player2DropZone = document.getElementById("Player2DropZone");

        if (Array.from(player1DropZone.children).includes(randomImg)) {
            clickCounts[randomImg.src] += 1;
            console.log(`👨‍🍳 P1 - Clics sur ${randomImg.alt}: ${clickCounts[randomImg.src]}`);

            if (clickCounts[randomImg.src] >= 20) {
                cutImageInTwo(randomImg);
            }
        } else if (Array.from(player2DropZone.children).includes(randomImg)) {
            clickCounts[randomImg.src] += 1;
            console.log(`👩‍🍳 P2 - Clics sur ${randomImg.alt}: ${clickCounts[randomImg.src]}`);

            if (clickCounts[randomImg.src] >= 20) {

                randomImg.style.filter = 'brightness(1.8) grayscale(0.3)';
                randomImg.setAttribute('data-state', '2');
                console.log(`✨ ${randomImg.alt} est maintenant en état 2 (modifiée par P2)`);
            }
        } else {
            console.log("❌ L'image n'est pas dans une zone de drop autorisée.");
        }
    });
}

socket.on("receiveIngredient", (data) => {
    if ((playerRole === "P1" && data.to === "P1") || (playerRole === "P2" && data.to === "P2")) {
        const zone = playerRole === "P1" ?
            document.getElementById("Player1TakeZone") :
            document.getElementById("Player2TakeZone");

        const id = data.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        if (data.state == "1") {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('cut-container');
            imageContainer.setAttribute('data-src', data.src);
            imageContainer.setAttribute('data-alt', data.alt);
            imageContainer.setAttribute('data-state', '1');
            imageContainer.setAttribute('data-id', id);

            const img = document.createElement("img");
            img.src = data.src;
            img.alt = data.alt;
            img.classList.add("ingredient-img");
            img.setAttribute("data-state", "1");
            img.setAttribute("data-id", id);
            img.draggable = false;

            imageContainer.appendChild(img);
            cutImageInTwo(img, imageContainer);
            zone.appendChild(imageContainer);
        } else {
            const img = document.createElement("img");
            img.src = data.src;
            img.alt = data.alt;
            img.classList.add("ingredient-img");
            img.setAttribute("data-state", data.state || "0");
            img.setAttribute("data-id", id);
            img.draggable = false;
            zone.appendChild(img);
        }

        drake.containers.push(zone);
    } else {
        console.log(`Ce joueur ne peut pas recevoir cet ingrédient (Rôle: ${playerRole}, À: ${data.to})`);
    }
});



function cutImageInTwo(imgElement) {

    const src = imgElement.src;
    const altText = imgElement.alt;
    const imageContainer = imgElement.parentElement;
    imgElement.remove();

    const cutContainer = document.createElement('div');
    cutContainer.classList.add('cut-container');

    cutContainer.setAttribute('data-src', src);
    cutContainer.setAttribute('data-alt', altText);
    cutContainer.setAttribute('data-state', '1');

    const leftPart = document.createElement('div');
    leftPart.classList.add('image-part', 'left');
    leftPart.style.backgroundImage = `url(${src})`;

    const rightPart = document.createElement('div');
    rightPart.classList.add('image-part', 'right');
    rightPart.style.backgroundImage = `url(${src})`;

    cutContainer.appendChild(leftPart);
    cutContainer.appendChild(rightPart);
    imageContainer.appendChild(cutContainer);

}

socket.on('ingredientRemoved', (data) => {
    const zone = playerRole === "P1" ? "Player1GiveZone" : "Player2GiveZone";
    const ingredient = document.querySelector(`[data-id="${data.id}"]`);

    if (ingredient) {
        const parentZone = ingredient.closest('.take');

        if (parentZone && (parentZone.id === "Player1TakeZone" || parentZone.id === "Player2TakeZone")) {
            ingredient.remove();
            console.log(`🗑️ L’ingrédient a été supprimé de ${zone} (id: ${data.id})`);
        } else {
            console.log("⛔ Suppression refusée : l’ingrédient n’est pas dans une zone 'take'.");
        }
    } else {
        console.log("❌ L'ingrédient n'a pas été trouvé pour la suppression.");
    }
});



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