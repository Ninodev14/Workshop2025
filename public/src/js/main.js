const socket = io();
let IsAlreadyValidate = false;
let playerRole = null;
let maxIngredients = 2;
const roomId = new URLSearchParams(window.location.search).get('roomId');


// window.addEventListener('beforeunload', (event) => {

//     const message = "Êtes-vous sûr de vouloir quitter/recharger cette page ?";
//     setTimeout(() => {
//         window.location.href = '/index.html';
//     }, 500);

//     event.returnValue = message;
//     return message;
// });


socket.on('connect', () => {
    // socket.on('playerDisconnected', (data) => {
    //     const { playerId, roomId } = data;
    //     console.log(`Le joueur ${playerId} de la room ${roomId} s'est déconnecté.`);
    //     const disconnectMessage = document.getElementById('disconnect-message');
    //     disconnectMessage.style.display = 'flex';
    //     const goHomeBtn = document.getElementById('go-home-btn');
    //     goHomeBtn.addEventListener('click', () => {
    //         window.location.href = '/';
    //     });
    // });
    const playerId = localStorage.getItem('playerId');
    const roomId = new URLSearchParams(window.location.search).get('roomId');

    console.log("📦 Récupération localStorage => playerId:", playerId, "roomId:", roomId);

    if (playerId && roomId) {
        console.log("🔁 Envoi de reconnectPlayer au serveur");
        socket.emit('reconnectPlayer', roomId, playerId);
    } else {
        console.log("❌ Aucune info de reconnexion trouvée");
    }
});
const playerId = localStorage.getItem("playerId");
const playerName = localStorage.getItem("playerName");
let helpClic = false;
let probarCanUpdate = false;

const additionalImages = [

    "src/img/ingredients/Bacon.png",
    "src/img/ingredients/Beurre.png",
    "src/img/ingredients/Boudoir.png",
    "src/img/ingredients/Carotte.png",
    "src/img/ingredients/Champignon.png",
    "src/img/ingredients/ChocolatEnPoudre.png",
    "src/img/ingredients/Chocolat.png",
    "src/img/ingredients/Chorizo.png",
    "src/img/ingredients/Citron.png",
    "src/img/ingredients/Cornichon.png",
    "src/img/ingredients/Creme.png",
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
    "src/img/ingredients/PainPita.png",
    "src/img/ingredients/Pain.png",
    "src/img/ingredients/Patate.png",
    "src/img/ingredients/Pates.png",
    "src/img/ingredients/Peche.png",
    "src/img/ingredients/PetitPois.png",
    "src/img/ingredients/Piment.png",
    "src/img/ingredients/Poivre.png",
    "src/img/ingredients/Poisson.png",
    "src/img/ingredients/Pomme.png",
    "src/img/ingredients/PouletFrit.png",
    "src/img/ingredients/Poulet.png",
    "src/img/ingredients/Raisin.png",
    "src/img/ingredients/Riz.png",
    "src/img/ingredients/Salade.png",
    "src/img/ingredients/SauceTomate.png",
    "src/img/ingredients/Sauce.png",
    "src/img/ingredients/Sucre.png",
    "src/img/ingredients/Saucisse.png",
    "src/img/ingredients/Sel.png",
    "src/img/ingredients/Steak.png",
    "src/img/ingredients/Tomate.png",
    "src/img/ingredients/Vanille.png",
    "src/img/ingredients/Yaourt.png",
    "src/img/ingredients/Amande.png",
    "src/img/ingredients/Cafe.png",
    "src/img/ingredients/Canelle.png",
    "src/img/ingredients/CompotePomme.png",
    "src/img/ingredients/Concombre.png",
    "src/img/ingredients/Epinards.png",
    "src/img/ingredients/FloconAvoine.png",
    "src/img/ingredients/Herbes.png",
    "src/img/ingredients/HuileOlive.png",
    "src/img/ingredients/Mais.png",
    "src/img/ingredients/Noix.png",
    "src/img/ingredients/OignonRouge.png",
    "src/img/ingredients/PatateDouce.png",

];

let weightedPool = additionalImages.slice();

socket.emit('requestRole', roomId, playerId, (response) => {
    console.log("🔁 Envoi de requestRole au serveur", response, roomId);
    if (response.success) {
        playerRole = response.role;
        console.log("🎭 Rôle assigné à l'entrée du jeu :", playerRole);
        document.getElementById("start-instructions").style.display = "flex";
        document.getElementById("btn-step1").disabled = false;
    } else {
        console.error("❌ Impossible d'assigner un rôle :", response.message);
    }
});

function step2() {
    document.getElementById("start-instructions").style.display = "none";
    document.getElementById("step2-instructions").style.display = "flex";
    document.getElementById("btn-step2").disabled = false;
}

function step3() {
    console.log("➡️ STEP 3 triggered");
    document.getElementById("step2-instructions").style.display = "none";

    if (playerRole === "P1") {
        console.log("✅ Affichage rôle P1");
        document.getElementById("step3-instructions-P1").style.display = "flex";
        document.getElementById("btn-p1").disabled = false;
    } else if (playerRole === "P2") {
        console.log("✅ Affichage rôle P2");
        document.getElementById("step3-instructions-P2").style.display = "flex";
        document.getElementById("btn-p2").disabled = false;
    } else {
        console.log("❌ Aucun rôle défini !");
    }
}

function readyToStartP1() {
    document.getElementById("step3-instructions-P1").style.display = "none";
    document.getElementById("Waiting").style.display = "flex";
    socket.emit("playerReadyForGame", roomId, playerId);
}

function readyToStartP2() {
    document.getElementById("step3-instructions-P2").style.display = "none";
    document.getElementById("Waiting").style.display = "flex";
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
    randomImg.setAttribute("data-state", "0");

    animationZone.appendChild(randomImg);
    registerInitialZone(randomImg, animationZone);
    transformIngredient(randomImg);
}

function startIngredientSpawning(zoneId) {
    setInterval(() => {
        spawnRandomIngredient(zoneId);
    }, 1500);
}

function startGame() {
    clearIngredientZone("Player1IngredientZone");
    clearIngredientZone("Player2IngredientZone");

    startIngredientSpawning("Player1IngredientZone");
    startIngredientSpawning("Player2IngredientZone");
}

let recipeName = "null";

function displayRandomRecipe(targetDivId) {
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    const container = document.getElementById(targetDivId);
    recipeName = recipe.name;
    console.log("ffzfzzf")
    IsAlreadyValidate = false;


    //const title = document.createElement("h3");
    //title.textContent = `Recette : ${recipe.name}`;
    //container.appendChild(title);

    const oldDiv = document.querySelector(".ingredientRecipeZone");
    if (oldDiv) {
        oldDiv.remove();
    }
    const ingredientsDiv = document.createElement("div");
    ingredientsDiv.classList.add("ingredientRecipeZone");
    ingredientsDiv.innerHTML = '';

    document.body.appendChild(ingredientsDiv)
    recipe.ingredients.forEach(ingredient => {
        let imgSrc, state;

        if (typeof ingredient === 'object' && ingredient.src) {
            imgSrc = ingredient.src;
            state = ingredient.state || 0;
        } else if (typeof ingredient === 'string') {
            imgSrc = ingredient;
            state = 0;
        } else {
            console.error("❌ Format d'ingrédient non valide", ingredient);
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";

        const altText = imgSrc.split('/').pop().replace('.png', '');
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = altText;
        img.className = "ImgRicipe";
        img.className = "ImgRicipe";
        img.setAttribute("data-state", state);

        wrapper.appendChild(img);

        if (state === 1 || state === 2) {
            const stateIcon = document.createElement("img");
            stateIcon.src = state === 1 ?
                "src/img/icons/cut.png" :
                "src/img/icons/washed.png";

            stateIcon.alt = state === 1 ? "Coupé" : "Lavé";
            stateIcon.style.position = "absolute";
            stateIcon.style.bottom = "0";
            stateIcon.style.right = "0";
            stateIcon.style.width = "24px";
            stateIcon.style.height = "24px";
            stateIcon.style.background = "rgba(255,255,255,0.8)";
            stateIcon.style.borderRadius = "50%";

            wrapper.appendChild(stateIcon);
        }

        ingredientsDiv.appendChild(wrapper);
    });

    container.appendChild(ingredientsDiv);

    const GOOD_INGREDIENT_WEIGHT = 12;
    const BAD_INGREDIENT_WEIGHT = 1;

    const recipeIngredientPool = recipe.ingredients.flatMap(ing => {
        const src = typeof ing === 'object' ? ing.src : ing;
        return Array(GOOD_INGREDIENT_WEIGHT).fill(src);
    });

    const additionalImagePool = additionalImages.flatMap(src => {
        return Array(BAD_INGREDIENT_WEIGHT).fill(src);
    });

    weightedPool = recipeIngredientPool.concat(additionalImagePool);


    const zoneId = targetDivId === "Player1Recipe" ? "Player1IngredientZone" : "Player2IngredientZone";
    const animationZone = document.getElementById(zoneId);
    animationZone.innerHTML = '';

    recipe.ingredients.forEach((ing, index) => {
        const src = typeof ing === 'object' ? ing.src : ing;
        const altText = src.split('/').pop().replace('.png', '');

        const animatedImg = document.createElement("img");
        animatedImg.src = src;
        animatedImg.alt = altText;
        animatedImg.classList.add("ingredient-img");
        animatedImg.draggable = true;
        animatedImg.style.animationDelay = `${index * 1}s`;
        animatedImg.setAttribute("data-state", "0");

        animationZone.appendChild(animatedImg);
        registerInitialZone(animatedImg, animationZone);
        transformIngredient(animatedImg);
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

        if (elements.length === 5) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    observer.observe(zone, { childList: true });
}




let stateRecipe = null;

function validateRecipeCompletion(targetDivId) {
    if (IsAlreadyValidate == false) {
        IsAlreadyValidate = true;
        const expectedZoneId = targetDivId === "Player1Recipe" ? "Player1VerificationZone" : "Player2VerificationZone";
        const dropZone = document.getElementById(expectedZoneId);
        const recipeDiv = document.getElementById(targetDivId);

        function getDroppedIngredientData(element) {
            // Cas d'un élément lavé ou découpé contenu dans une div
            if (element.tagName === "DIV") {
                const alt = element.getAttribute('data-alt');
                const state = element.getAttribute('data-state');

                if (alt && state) {
                    return {
                        text: alt,
                        state: state
                    };
                }

                // Si la div contient une image, on récupère les infos depuis celle-ci
                const img = element.querySelector('img');
                if (img) {
                    const altText = img.alt || img.getAttribute('data-alt');
                    const state = img.getAttribute('data-state');
                    return {
                        text: altText,
                        state: state
                    };
                }
            }

            // Cas d'un élément image directe
            if (element.tagName === "IMG") {
                return {
                    text: element.alt || element.getAttribute('data-alt'),
                    state: element.getAttribute('data-state')
                };
            }

            console.warn("⚠️ Élément non reconnu :", element);
            return null;
        }

        // Lecture des ingrédients de la recette attendue
        const recipeIngredients = Array.from(recipeDiv.querySelectorAll("img"))
            .filter(img => img.getAttribute('data-state') !== null)
            .map(img => {
                return {
                    text: img.src.split('/').pop().replace('.png', ''),
                    state: img.getAttribute('data-state')
                };
            });

        // Lecture des ingrédients déposés
        const droppedIngredients = Array.from(dropZone.children)
            .map(el => getDroppedIngredientData(el))
            .filter(data => data !== null);

        // Comparaison
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
            stateRecipe = true;
            anomationCook();

            const data = {
                roomId: roomId
            };
            console.log("feefefzrgrzgf")
            console.log(`[${playerRole}] envoie TotRecipeDone`);
            socket.emit("TotRecipeDone", data);
        } else {

            stateRecipe = false;
            console.log(stateRecipe);
            anomationCook();

        }
    }
}


function anomationCook() {


    const flash = document.createElement('div');
    flash.className = 'flash-overlay';
    document.body.appendChild(flash);

    requestAnimationFrame(() => {
        flash.style.opacity = '1';

        setTimeout(() => {
            apDisap('.casseroleContainer', "none");
            flash.style.opacity = '0';
            showRecipe();
            setTimeout(() => {
                flash.remove();

            }, 1000);
        }, 2000);
    });
}


function showRecipe() {

    const recipeImagePath = `src/img/recipes/${recipeName}.png`;

    appearPlat = document.querySelectorAll(".imgplat");
    textFinsihTab = document.querySelectorAll(".TutoAndFish");



    if (stateRecipe == false) {

        appearPlat.forEach(element => {
            element.src = `src/img/recipes/PlatFoireux.png`;
            element.alt = `PlatFoireux`;

        });

        apDisap('.casseroleContainer', "none")
        apDisap('.txtTuto', "none")
        apDisap('.txtFinisBad', "block")



    } else {
        appearPlat.forEach(element => {


            element.src = recipeImagePath;
            element.alt = recipeName;


        });

        apDisap('.casseroleContainer', "none")
        apDisap('.txtTuto', "none")
        apDisap('.txtFinishGood', "block")



    }







    apDisap(".Contenerassiet", "flex");

    apDisap(".btnNextRecipe", "flex");



}


function nextRecipe() {

    const transitionDiv = document.getElementById("next-recipe-transition");
    transitionDiv.style.display = "block";



    transitionDiv.style.display = "none";
    document.getElementById("Player1IngredientZone").innerHTML = '';
    document.getElementById("Player2IngredientZone").innerHTML = '';
    document.getElementById("Player1VerificationZone").innerHTML = '';
    document.getElementById("Player2VerificationZone").innerHTML = '';

    if (playerRole === "P1") {
        displayRandomRecipe("Player1Recipe");
    } else if (playerRole === "P2") {
        displayRandomRecipe("Player2Recipe");
    }


    apDisap(".Contenerassiet", "none");
    apDisap(".casseroleContainer", "flex");
    apDisap(".btnNextRecipe", "none");
    apDisap('.txtTuto', "block");
    apDisap('.txtFinishGood', "none");
    apDisap('.txtFinisBad', "none");





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

drake.on('drop', (el, target, source) => {
    const forbiddenTakeZones = ["Player1TakeZone", "Player2TakeZone"];
    const isGiveZone = target.classList.contains("give");
    const isFromTakeZone = source && forbiddenTakeZones.includes(source.id);

    if (isFromTakeZone && isGiveZone) {

        const id = el.getAttribute("data-id");

        console.log("Déplacé de Take vers Give");

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

    const allowedZoneClasses = ['drop-zone', 'verification-zone', 'ingredient-zone'];
    const isAllowedZone = allowedZoneClasses.some(cls => target.classList.contains(cls));
    const imageCount = Array.from(target.children).filter(child => child.tagName === "IMG" || child.tagName === "DIV").length;
    const limit = target.classList.contains('verification-zone') ? 6 : maxIngredients;

    // ✅ Appliquer la limite aussi pour les GiveZone
    if (
        (target.id === "Player1GiveZone" && playerRole === "P1") ||
        (target.id === "Player2GiveZone" && playerRole === "P2")
    ) {
        if (imageCount < limit) {
            sendToPlayer(el, playerRole === "P1" ? "P2" : "P1");
        } else {
            console.log("Zone déjà pleine (give zone).");
            el.remove();
        }
        return;
    }

    if (isAllowedZone) {
        const isDropZone = target.classList.contains('drop-zone');

        if (imageCount < limit) {
            el.draggable = false;
            target.appendChild(el);
            el.style.animation = 'none';
            el.style.position = "relative";

            if (isDropZone) {
                probarCanUpdate = true;

                setTimeout(() => {
                    if (helpClic === false) {
                        apDisap(".clicindicateur", "block");

                    }


                }, 2000);


                drake.on('out', (el, container, source) => {
                    if (container.classList.contains('drop-zone')) {
                        // Tu peux exécuter ta logique ici (réinitialiser, enlever barre, etc.)
                        apDisap(".clicindicateur", "none");
                        apDisap(".progressbar", "none");
                    }
                });


            }

        } else {
            console.log("Zone déjà pleine.");
            el.remove();
        }
    } else {
        const id = el.getAttribute("data-id");
        el.remove();
        console.log("COUCOUUU3")
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
        console.log(el);
        console.log(el.alt);
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
drake.containers.push(document.getElementById("Player2VerificationZone"));
drake.containers.push(document.getElementById("Player1VerificationZone"));
drake.containers.push(document.getElementById("Player2VerificationZoneCasserole"));
drake.containers.push(document.getElementById("Player1VerificationZoneCasserole"));
drake.containers.push(player1GiveZone);
drake.containers.push(player2GiveZone);


drake.on('drop', (el, target) => {

    if (target.id === "Player2VerificationZoneCasserole") {
        const newTarget = document.getElementById("Player2VerificationZone");

        if (newTarget.children.length < 5) {
            newTarget.appendChild(el);
            drake.containers.push(newTarget);
        } else {
            el.remove();
        }
    }

    if (target.id === "Player1VerificationZoneCasserole") {
        const newTarget = document.getElementById("Player1VerificationZone");

        if (newTarget.children.length < 5) {
            newTarget.appendChild(el);
            drake.containers.push(newTarget);
        } else {
            el.remove();
        }
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

        const imageCount = Array.from(target.children).filter(child => child.tagName === "IMG" || child.tagName === "DIV").length;


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




function transformIngredient(imgToCut) {
    const player1DropZone = document.getElementById("Player1DropZone");
    const player2DropZone = document.getElementById("Player2DropZone");
    const id = imgToCut.src;
    if (!clickCounts[id]) clickCounts[id] = 0;

    let decayInterval = null;
    let decayTimeout = null;

    const progressBarElements = document.querySelectorAll(".progressbarRemplisage");

    const updateProgress = () => {
        const percent = Math.min(100, (clickCounts[id] / 10) * 100);
        progressBarElements.forEach(bar => {
            bar.style.width = `${percent}%`;
        });
    };

    const startDecay = () => {
        clearInterval(decayInterval);
        decayInterval = setInterval(() => {
            if (clickCounts[id] > 0) {
                clickCounts[id] -= 1;
                updateProgress();
            }
            if (clickCounts[id] <= 0) {
                clearInterval(decayInterval);
            }
        }, 300); // baisse tous les 300ms
    };

    imgToCut.addEventListener('click', () => {

        helpClic = true;
        apDisap(".clicindicateur", "none");
        if (probarCanUpdate == true) {
            apDisap(".progressbar", "flex");
        }
        clearTimeout(decayTimeout);
        clearInterval(decayInterval);

        const isInP1Zone = Array.from(player1DropZone.children).includes(imgToCut);
        const isInP2Zone = Array.from(player2DropZone.children).includes(imgToCut);
        if (isInP1Zone || isInP2Zone) {
            clickCounts[id] += 1; + updateProgress();
            if (clickCounts[id] >= 10) {
                apDisap(".progressbar", "none")

                // Reset le compteur après transformation
                clickCounts[id] = 0;
                updateProgress(); // Pour réinitialiser la barre

                if (isInP1Zone) {
                    cutImageInTwo(imgToCut);
                } else if (isInP2Zone) {
                    WashItem(imgToCut);
                }
                clearInterval(decayInterval); // stop la baisse
                probarCanUpdate = false;
            } else {
                decayTimeout = setTimeout(() => {
                    startDecay();
                }, 1000); // commence à baisser après 1 sec d'inactivité
            }
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
            cutImageInTwo(img);
            zone.appendChild(imageContainer);

        } else if (data.state == "2") {
            const img = document.createElement("img");
            img.src = data.src;
            img.alt = data.alt;
            img.classList.add("ingredient-img");
            img.setAttribute("data-state", data.state || "0");
            img.setAttribute('data-id', id);
            img.draggable = false;
            zone.appendChild(img);
            img.style.animation = 'none';
            const src = img.src;
            const altText = img.alt;

            const wrapper = document.createElement("div");
            wrapper.classList.add("washed-img");
            wrapper.setAttribute("data-state", "2");
            wrapper.setAttribute("data-alt", altText);
            wrapper.setAttribute("data-src", src)


            img.parentNode.replaceChild(wrapper, img);
            wrapper.appendChild(img);
            wrapper.setAttribute('data-id', id);

        } else {
            const img = document.createElement("img");
            img.src = data.src;
            img.alt = data.alt;
            img.classList.add("ingredient-img");
            img.setAttribute("data-state", data.state || "0");
            img.setAttribute("data-id", id);
            img.draggable = false;
            zone.appendChild(img);

            transformIngredient(img);
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

function WashItem(imgElement) {
    const src = imgElement.src;
    const altText = imgElement.alt;

    const wrapper = document.createElement("div");
    wrapper.classList.add("washed-img");
    wrapper.setAttribute("data-state", "2");
    wrapper.setAttribute("data-alt", altText);
    wrapper.setAttribute("data-src", src)


    imgElement.parentNode.replaceChild(wrapper, imgElement);
    wrapper.appendChild(imgElement);

}

socket.on('ingredientRemoved', (data) => {
    const ingredient = document.querySelector(`[data-id="${data.id}"]`);

    if (ingredient) {

        const parentZone = ingredient.closest('.take') || ingredient.closest('.give');

        if (parentZone && (parentZone.id === "Player1TakeZone" || parentZone.id === "Player2TakeZone" || parentZone.id === "Player1GiveZone" || parentZone.id === "Player2GiveZone")) {
            ingredient.remove();
            console.log(`🗑️ L’ingrédient (id: ${data.id}) a été supprimé de ${parentZone.id}`);
        } else {
            console.log("⛔ Suppression refusée : l’ingrédient n’est pas dans une zone autorisée (take/give).");
        }
    } else {
        console.log("❌ L'ingrédient n'a pas été trouvé pour la suppression.");
    }
});



socket.on("GameCanBigin", () => {
    console.log("🎮 Le jeu peut commencer!");
    document.getElementById("Waiting").style.display = "none";
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

    const needles = document.querySelectorAll('.needle');
    needles.forEach((needle, index) => {
        let secondesLocal = 0;
        let chronoLocal = null;

        secondesLocal = 0;
        rotateNeedle(needle, 0);

        // Lancer l'intervalle pour chaque joueur
        chronoLocal = setInterval(() => {
            secondesLocal++;

            // Calcul des degrés d'avancée de l'aiguille par seconde
            rotateNeedle(needle, secondesLocal * 1); // 2° par seconde

            // Condition pour arrêter l'intervalle après 180 secondes
            if (secondesLocal === 360) {
                clearInterval(chronoLocal);
                // Appeler la fonction pour gérer la fin du jeu
                endGame();
            }
        }, 1000); // Déclenche chaque seconde
    });
});

// Fonction de rotation de l'aiguille
function rotateNeedle(needle, degrees) {
    needle.style.transform = `rotate(${degrees}deg)`; // Mise à jour de la rotation
}




let globalScore = 0;
let isUpdating = false;

socket.on("updateRecipe", (total) => {

    if (isUpdating) {

        return;
    }

    isUpdating = true;

    globalScore += 1;

    const scoreElements = document.querySelectorAll(".score");

    scoreElements.forEach(element => {
        element.innerHTML = globalScore;
    });

    if (globalScore >= 6) {
        const textExplication = document.getElementById("textExplication")
        textExplication.innerHTML = "Bravo, vous avez terminé à temps ! Voyons votre travail ...";
        endGame();
    }

    setTimeout(() => {
        isUpdating = false;
    }, 500);
});




function apDisap(classHtml, stateTo) {

    elementToChange = document.querySelectorAll(classHtml);
    elementToChange.forEach(element => {
        element.style.display = stateTo;
    });

}


function endGame() {
    const Player2Game = document.getElementById("Player2Game");
    Player2Game.style.display = "none";
    const Player1Game = document.getElementById("Player1Game");
    Player1Game.style.display = "none";
    const EndScreen = document.getElementById("start-end");
    EndScreen.style.display = "flex";
}

function endGameResult() {
    const EndScreen = document.getElementById("start-end");
    EndScreen.style.display = "none";

    const image = document.createElement('img');
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.style.display = "flex";
    image.alt = "Résultat final";

    if (globalScore <= 2) {
        resultContainer.style.backgroundImage = "url(src/img/game/result_bad.png)";
        image.src = "src/img/game/1star.png";
    } else if (globalScore <= 4) {
        resultContainer.style.backgroundImage = "url(src/img/game/result_medium.png)";
        image.src = "src/img/game/2star.png";
    } else {
        resultContainer.style.backgroundImage = "url(src/img/game/result_good.png)";
        image.src = "src/img/game/3star.png";
    }

    resultContainer.appendChild(image);
    overlay.style.display = "flex";
    setTimeout(() => {
        const overlay = document.getElementById("overlay");
        overlay.classList.add("overlay-visible");
    }, 3000);
}

function goToLobbyPage() {
    window.location.href = "lobby.html";
}

function goToIndexPage() {
    window.location.href = "index.html";
}