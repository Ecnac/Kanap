// Création de la page du produit

// Création de l'URL en utilisant l'ID de l'article
let url = new URL(window.location.href);
let productId = url.searchParams.get('id');

// Déclaration des variables
const itemImg = document.querySelector('.item__img');
const articleImg = document.createElement('img');
const articleName = document.getElementById('title');
const articlePrice = document.getElementById('price');
const articleDesc = document.getElementById('description');

// Récupération des données de l'API correspondant à l'ID
fetch('http://localhost:3000/api/products/' + productId)
  .then((response) => response.json())
  .then((data) => insertData(data))
  .catch(() => console.log('Une erreur est survenue'));

function insertData(data) {
  // Insertion de l'image
  articleImg.src = data.imageUrl;
  articleImg.alt = data.altTxt;
  itemImg.appendChild(articleImg);

  // Insertion du nom
  articleName.innerText = data.name;

  // Insertion du prix
  articlePrice.innerText = data.price;

  // Insertion de la description
  articleDesc.innerText = data.description;

  // Boucle pour explorer le tableau "colors" de l'API et appelant une fonction
  data.colors.forEach((color) => colorSelection(color));
}

// Déclaration de la fonction permettant d'insérer les éléments de choix de couleur de l'article
function colorSelection(color) {
  const colorSection = document.getElementById('colors');
  const colorPick = document.createElement('option');
  colorSection.appendChild(colorPick);
  colorPick.value = color;
  colorPick.innerText = color;
}

// Gestion du panier

// Récupération des éléments "quantité", "couleur" et "button"
const productQuantity = document.getElementById('quantity');
const getButton = document.getElementById('addToCart');

const addToCart = ({ id, color, quantity }) => {
  // Récupère le panier dans le local storage ou crée un array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Récupère l'index de l'objet du panier et retourne son ID et sa couleur
  const productIndex = cart.findIndex((i) => i.id == id && i.color == color);

  if (productIndex !== -1) {
    // Détermine la quantité totale en fonction de la quantité indexée et de la quantité à ajouter
    let totalQuantity = cart[productIndex].quantity + quantity;

    // Modifie la quantité indexée par le total à ajouter
    cart[productIndex].quantity = totalQuantity;
  } else {
    // Ajoute le produit au panier
    cart.push({
      id: productId,
      color,
      price: articlePrice.innerText,
      quantity,
      name: articleName.innerText,
      img: articleImg.src,
      alt: articleImg.alt,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
};

// Gestion de l'ajout au panier
const submitButton = () => {
  try {
    let quantity = parseInt(productQuantity.value);
    const color = document.getElementById('colors').value;

    // Vérifie si une couleur a été sélectionnée
    if (!color) {
      throw 'Veuillez sélectionner une couleur';
    }

    // Vérifie si la quantité est valide
    if (isNaN(quantity) || quantity <= 0 || quantity > 100) {
      productQuantity.value = 1;
      throw 'Veuillez sélectionner entre 1 et 100 articles';
    }

    addToCart({
      id: productId,
      color,
      quantity,
      price: articlePrice.innerText,
      name: articleName.innerText,
      img: articleImg.src,
      alt: articleImg.alt,
    });

    // Notifie l'utilisateur que le panier a été mis à jour
    alert('Vos articles ont été ajoutés au panier !');
  } catch (Error) {
    alert(Error);
  }
};

getButton.addEventListener('click', submitButton);
