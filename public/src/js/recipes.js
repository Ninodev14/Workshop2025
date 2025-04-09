const recipes = [{
        name: "Burger",
        ingredients: [
            { src: "src/img/ingredients/Steak.png", state: 0 },
            { src: "src/img/ingredients/Salade.png", state: 2 },
            { src: "src/img/ingredients/Cornichon.png", state: 1 },
            { src: "src/img/ingredients/Pain.png", state: 0 },
            { src: "src/img/ingredients/Fromage.png", state: 0 }
        ]
    },
    {
        name: "Lasagne",
        ingredients: [
            { src: "src/img/ingredients/Steak.png", state: 1 },
            { src: "src/img/ingredients/SauceTomate.png", state: 0 },
            { src: "src/img/ingredients/Pates.png", state: 2 },
            { src: "src/img/ingredients/Creme.png", state: 0 },
            { src: "src/img/ingredients/Fromage.png", state: 1 }
        ]
    },
    {
        name: "Kebab",
        ingredients: [
            { src: "src/img/ingredients/Salade.png", state: 2 },
            { src: "src/img/ingredients/Poulet.png", state: 1 },
            { src: "src/img/ingredients/Tomate.png", state: 2 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/PainPita.png", state: 0 }
        ]
    },
    {
        name: "Tacos",
        ingredients: [
            { src: "src/img/ingredients/PainPita.png", state: 0 },
            { src: "src/img/ingredients/Steak.png", state: 0 },
            { src: "src/img/ingredients/Patate.png", state: 1 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Salade.png", state: 2 }
        ]
    },
    {
        name: "RizCantonais",
        ingredients: [
            { src: "src/img/ingredients/Riz.png", state: 0 },
            { src: "src/img/ingredients/Jambon.png", state: 1 },
            { src: "src/img/ingredients/Oeuf.png", state: 0 },
            { src: "src/img/ingredients/PetitPois.png", state: 2 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    {
        name: "GateauAuYaourt",
        ingredients: [
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Yaourt.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Beurre.png", state: 1 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "SaladeDeFruit",
        ingredients: [
            { src: "src/img/ingredients/Pomme.png", state: 1 },
            { src: "src/img/ingredients/Orange.png", state: 1 },
            { src: "src/img/ingredients/Fraise.png", state: 2 },
            { src: "src/img/ingredients/Kiwi.png", state: 0 },
            { src: "src/img/ingredients/Raisin.png", state: 2 }
        ]
    },
    {
        name: "FondantAuChocolat",
        ingredients: [
            { src: "src/img/ingredients/Chocolat.png", state: 1 },
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Beurre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "Tiramisu",
        ingredients: [
            { src: "src/img/ingredients/ChocolatEnPoudre.png", state: 0 },
            { src: "src/img/ingredients/Boudoir.png", state: 1 },
            { src: "src/img/ingredients/Creme.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "PommeAuFour",
        ingredients: [
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Pomme.png", state: 2 },
            { src: "src/img/ingredients/Miel.png", state: 0 },
            { src: "src/img/ingredients/Chocolat.png", state: 1 },
            { src: "src/img/ingredients/Vanille.png", state: 1 }
        ]
    },
    {
        name: "TarteAuPomme",
        ingredients: [
            { src: "src/img/ingredients/Pomme.png", state: 1 },
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Beurre.png", state: 1 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "SteakFrite",
        ingredients: [
            { src: "src/img/ingredients/Steak.png", state: 1 },
            { src: "src/img/ingredients/Patate.png", state: 1 },
            { src: "src/img/ingredients/Tomate.png", state: 2 },
            { src: "src/img/ingredients/PetitPois.png", state: 2 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },

    {
        name: "Omelette",
        ingredients: [
            { src: "src/img/ingredients/Oeuf.png", state: 2 },
            { src: "src/img/ingredients/Beurre.png", state: 0 },
            { src: "src/img/ingredients/Sel.png", state: 0 },
            { src: "src/img/ingredients/Fromage.png", state: 1 },
            { src: "src/img/ingredients/Jambon.png", state: 1 }
        ]
    },
    {
        name: "PatesCarbonara",
        ingredients: [
            { src: "src/img/ingredients/Pates.png", state: 2 },
            { src: "src/img/ingredients/Poivre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 },
            { src: "src/img/ingredients/Fromage.png", state: 1 },
            { src: "src/img/ingredients/Jambon.png", state: 1 }
        ]
    },
    {
        name: "BoeufBourguignon",
        ingredients: [
            { src: "src/img/ingredients/Steak.png", state: 1 },
            { src: "src/img/ingredients/Carotte.png", state: 2 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Champignon.png", state: 2 },
            { src: "src/img/ingredients/Oignon.png", state: 1 }
        ]
    },
    {
        name: "TarteAuCitron",
        ingredients: [
            { src: "src/img/ingredients/Citron.png", state: 1 },
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Lait.png", state: 0 },
            { src: "src/img/ingredients/Myrtille.png", state: 2 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "PoissonRiz",
        ingredients: [
            { src: "src/img/ingredients/Poisson.png", state: 0 },
            { src: "src/img/ingredients/Citron.png", state: 1 },
            { src: "src/img/ingredients/Riz.png", state: 2 },
            { src: "src/img/ingredients/Oeuf.png", state: 0 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    /* 
    {
        name: "PizzaChorizo",
        ingredients: [
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Chorizo.png", state: 2 },
            { src: "src/img/ingredients/Fromage.png", state: 1 },
            { src: "src/img/ingredients/SauceTomate.png", state: 0 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    {
        name: "PouletFrit",
        ingredients: [
            { src: "src/img/ingredients/PouletFrit.png", state: 1 },
            { src: "src/img/ingredients/Poivre.png", state: 0 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Patate.png", state: 2 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    
    {
        name: "Salade",
        ingredients: [
            { src: "src/img/ingredients/Salade.png", state: 2 },
            { src: "src/img/ingredients/Tomate.png", state: 2 },
            { src: "src/img/ingredients/Oignon.png", state: 0 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Fromage.png", state: 1 }
        ]
    },
    {
        name: "RougailleSaucisse",
        ingredients: [
            { src: "src/img/ingredients/Saucisse.png", state: 1 },
            { src: "src/img/ingredients/Tomate.png", state: 2 },
            { src: "src/img/ingredients/Piment.png", state: 2 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Riz.png", state: 0 }
        ]
    },
   
    
    {
        name: "Cookie",
        ingredients: [
            { src: "src/img/ingredients/PépitesDeChocolat.png", state: 1 },
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Lait.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "Crêpe",
        ingredients: [
            { src: "src/img/ingredients/Lait.png", state: 0 },
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Beurre.png", state: 1 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    */
];