// Création de la page du produit

// Création de la nouvelle URL en utilisant l'ID de l'article
let url = new URL(window.location.href)
let id = url.searchParams.get("id")
console.log(id)
console.log("Done")

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


// Création du panier

// Déclaration du panier
const cart = []

// Récupération de l'élément "quantité"
const productQuantity = document.getElementById("quantity")

// Récupération de l'élément "couleur"
const productColor = document.getElementById("colors")

function addToCart () {
    // Récupération de l'élément "button"
    const getButton = document.getElementById("addToCart")
    
    // Ecoute de l'évenement au clic sur le bouton et vérification de la condition d'ajout au panier
    getButton.addEventListener("click", function checkSelection () {

        // Récupération du nombre d'articles
        const pickedQuantity = productQuantity.value

        // Récupération de la couleur de l'article
        const pickedColor = productColor.value

        // Vérification des conditions d'ajout des articles
        if (pickedQuantity <= 0 || pickedQuantity > 100 || pickedColor == "") {
            alert("Veuillez sélectionner une quantité d'articles entre 1 et 100 et/ou une couleur !")
            productQuantity.value = 1
            console.log(cart)
        } else {

            // Création du produit à ajouter au panier
            const productInfos = {
                productId : id,
                quantity : pickedQuantity,
                color : pickedColor,
            }
            
            // Ajout de l'article au panier
            cart.push(productInfos)
            console.log(cart)
        }
    })
}

addToCart()



