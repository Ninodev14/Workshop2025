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
            { src: "src/img/ingredients/Sauce tomate.png", state: 0 },
            { src: "src/img/ingredients/Pâtes.png", state: 2 },
            { src: "src/img/ingredients/Crème.png", state: 0 },
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
            { src: "src/img/ingredients/Pain.png", state: 0 }
        ]
    },
    {
        name: "Tacos",
        ingredients: [
            { src: "src/img/ingredients/Pain.png", state: 0 },
            { src: "src/img/ingredients/Steack.png", state: 0 },
            { src: "src/img/ingredients/Patate.png", state: 1 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Salade.png", state: 2 }
        ]
    },
    {
        name: "Riz cantonais",
        ingredients: [
            { src: "src/img/ingredients/Riz.png", state: 0 },
            { src: "src/img/ingredients/Jambon.png", state: 1 },
            { src: "src/img/ingredients/Oeuf.png", state: 0 },
            { src: "src/img/ingredients/Petit pois.png", state: 2 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    {
        name: "Gateau au yaourt",
        ingredients: [
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Yaourt.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Beurre.png", state: 1 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "Salade de fruit",
        ingredients: [
            { src: "src/img/ingredients/Pomme.png", state: 1 },
            { src: "src/img/ingredients/Orange.png", state: 1 },
            { src: "src/img/ingredients/Fraise.png", state: 2 },
            { src: "src/img/ingredients/Kiwi.png", state: 0 },
            { src: "src/img/ingredients/Raisin.png", state: 2 }
        ]
    },
    {
        name: "Fondant au chocolat",
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
            { src: "src/img/ingredients/Poudre de chocolat.png", state: 0 },
            { src: "src/img/ingredients/Boudoir.png", state: 1 },
            { src: "src/img/ingredients/Crème.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "Pomme au four",
        ingredients: [
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Pomme.png", state: 2 },
            { src: "src/img/ingredients/Miel.png", state: 0 },
            { src: "src/img/ingredients/Chocolat.png", state: 1 },
            { src: "src/img/ingredients/Vanille.png", state: 1 }
        ]
    },
    {
        name: "Tarte au pomme",
        ingredients: [
            { src: "src/img/ingredients/Pomme.png", state: 1 },
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Beurre.png", state: 1 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    /* 
    {
        name: "Pizza chorizo",
        ingredients: [
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Chorizo.png", state: 2 },
            { src: "src/img/ingredients/Fromage.png", state: 1 },
            { src: "src/img/ingredients/Sauce tomate.png", state: 0 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    {
        name: "Poisson riz",
        ingredients: [
            { src: "src/img/ingredients/Poisson.png", state: 2 },
            { src: "src/img/ingredients/Citron.png", state: 1 },
            { src: "src/img/ingredients/Riz.png", state: 2 },
            { src: "src/img/ingredients/Poivre.png", state: 0 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    {
        name: "Steak frite",
        ingredients: [
            { src: "src/img/ingredients/Steack.png", state: 1 },
            { src: "src/img/ingredients/Patate.png", state: 2 },
            { src: "src/img/ingredients/Poivre.png", state: 0 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    {
        name: "Omelette",
        ingredients: [
            { src: "src/img/ingredients/Oeuf.png", state: 2 },
            { src: "src/img/ingredients/Lait.png", state: 0 },
            { src: "src/img/ingredients/Sel.png", state: 0 },
            { src: "src/img/ingredients/Fromage.png", state: 1 },
            { src: "src/img/ingredients/Jambon.png", state: 1 }
        ]
    },
    {
        name: "Poulet frit",
        ingredients: [
            { src: "src/img/ingredients/Poulet frit.png", state: 1 },
            { src: "src/img/ingredients/Poivre.png", state: 0 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Patate.png", state: 2 },
            { src: "src/img/ingredients/Sel.png", state: 0 }
        ]
    },
    {
        name: "Pâtes carbonara",
        ingredients: [
            { src: "src/img/ingredients/Pâtes.png", state: 2 },
            { src: "src/img/ingredients/Poivre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 },
            { src: "src/img/ingredients/Froomage.png", state: 1 },
            { src: "src/img/ingredients/Jambon.png", state: 1 }
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
        name: "Rougaille saucisse",
        ingredients: [
            { src: "src/img/ingredients/Saucisse.png", state: 1 },
            { src: "src/img/ingredients/Tomate.png", state: 2 },
            { src: "src/img/ingredients/Piment.png", state: 2 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Riz.png", state: 0 }
        ]
    },
    {
        name: "Boeuf bourguignon",
        ingredients: [
            { src: "src/img/ingredients/Boeuf.png", state: 1 },
            { src: "src/img/ingredients/Carotte.png", state: 2 },
            { src: "src/img/ingredients/Sauce.png", state: 0 },
            { src: "src/img/ingredients/Champignon.png", state: 2 },
            { src: "src/img/ingredients/Oignon.png", state: 1 }
        ]
    },
    {
        name: "Tarte citron",
        ingredients: [
            { src: "src/img/ingredients/Citron.png", state: 1 },
            { src: "src/img/ingredients/Farine.png", state: 0 },
            { src: "src/img/ingredients/Lait.png", state: 0 },
            { src: "src/img/ingredients/Sucre.png", state: 0 },
            { src: "src/img/ingredients/Oeuf.png", state: 2 }
        ]
    },
    {
        name: "Cookie",
        ingredients: [
            { src: "src/img/ingredients/Pépites de chocolat.png", state: 1 },
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