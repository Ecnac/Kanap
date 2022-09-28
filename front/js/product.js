// Création de la page du produit

// Récupère l'ID du produit
let url = new URL(window.location.href);
let productId = url.searchParams.get('id');

// Déclaration des variables
const itemImg = document.querySelector('.item__img');
const articleImg = document.createElement('img');
const articleName = document.getElementById('title');
const articlePrice = document.getElementById('price');
const articleDesc = document.getElementById('description');

// Appel de l'API
fetch('http://localhost:3000/api/products/' + productId)
  .then((response) => response.json())
  .then((data) => insertData(data))
  .catch(() => console.log('Une erreur est survenue'));

// Fonction permettant d'insérer les données de l'article
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

// Fonction permettant de créer les options de couleur
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

// Fonction permettant d'ajouter un article au panier
const addToCart = ({ id, color, quantity }) => {
  // Récupère les données du panier
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Vérifie si l'article est déjà dans le panier
  const productIndex = cart.findIndex((i) => i.id == id && i.color == color);

  if (productIndex !== -1) {
    // Si l'article est déjà dans le panier, ajoute la quantité
    let totalQuantity = cart[productIndex].quantity + quantity;

    // Modifie la quantité indexée par le total à ajouter
    cart[productIndex].quantity = totalQuantity;
  } else {
    // Si l'article n'est pas dans le panier, ajoute le produit
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

  // Met à jour le panier
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Fonction permettant de récupérer les données de l'article
const submitButton = () => {
  try {
    // Récupère les données de l'article
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

    // Ajoute l'article au panier
    addToCart({
      id: productId,
      color,
      quantity,
    });

    // Notifie l'utilisateur que le panier a été mis à jour
    alert('Vos articles ont été ajoutés au panier !');
  } catch (Error) {
    alert(Error);
  }
};

// Ajoute un écouteur d'événement au bouton "Ajouter au panier"
getButton.addEventListener('click', submitButton);
