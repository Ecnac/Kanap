// Création de la nouvelle URL en utilisant l'ID de l'article
let url = new URL(window.location.href)
let id = url.searchParams.get("id")
console.log(id)

// Déclaration des variables
const itemImg = document.querySelector(".item__img")
const articleImg = document.createElement("img")
const articleName = document.getElementById("title")
const articlePrice = document.getElementById("price")
const articleDesc = document.getElementById("description")

// Récupération des données de l'API correspondant à l'ID
fetch ("http://localhost:3000/api/products/" + id)
    .then ((response) => response.json())
    .then ((data) => insertData(data))

function insertData(data) { 

    // Insertion de l'image
    articleImg.src = data.imageUrl
    itemImg.appendChild(articleImg)

    // Insertion du nom
    articleName.innerText = data.name

    // Insertion du prix
    articlePrice.innerText = data.price

    // Insertion de la description
    articleDesc.innerText = data.description

    // Boucle pour explorer le tableau "colors" de l'API et appelant une fonction
    data.colors.forEach(color => colorSelection(color))
}

// Déclaration de la fonction permettant d'insérer les éléments de choix de couleur de l'article
function colorSelection(color) {
    const colorSection = document.getElementById("colors")
    const colorPick = document.createElement("option")
    colorSection.appendChild(colorPick)
    colorPick.value = color
    colorPick.innerText = color
}