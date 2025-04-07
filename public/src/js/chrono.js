
const needles = document.querySelectorAll(".needle");
const buttons = document.querySelectorAll(".startBtn");

buttons.forEach((button, index) => {
    let secondesLocal = 0;
    let chronoLocal = null;
    let ispress = false;


    button.addEventListener("click", function () {
        if (ispress == false) {
            ispress = true;
            secondesLocal = 0;
            rotateNeedle(needles[index], 0);
            chronoLocal = setInterval(() => {
                secondesLocal++;

                //degrés d'avancée de l'aiguille par seconde
                rotateNeedle(needles[index], secondesLocal * 2);

                //durée de la boucle
                if (secondesLocal == 180) {
                    clearInterval(chronoLocal);
                    //envent à la fin de la boucle
                    console.log("end");
                }
            }, 1000);
        }



    });

    // Fonction de rotation de l'aiguille
    function rotateNeedle(needle, degrees) {
        needle.style.transform = `rotate(${degrees}deg)`; // Mise à jour de la rotation
    }

});


