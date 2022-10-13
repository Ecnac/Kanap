// ========== INSERTION DES ARTICLES ==========

const getDataFromAPI = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  const data = await response.json();
  return data;
};

// Déclaration des variables
const cartTotalQuantity = document.getElementById('totalQuantity');
const cartTotalPrice = document.getElementById('totalPrice');

// Récupère le panier dans le local storage et le stocke dans une variable
const cart = JSON.parse(localStorage.getItem('cart'));

// Fonction permettant d'insérer les éléments du panier dans le HTML
const insertElements = (cart, data) => {
  for (let i = 0, j = 0 ; i < cart.length; i++, j++) {

    const kanap = data.findIndex((index) => index._id == cart[i].id);
    const kanapPrice = data[kanap].price;
    const kanapImg = data[kanap].imageUrl;
    const kanapAlt = data[kanap].altTxt;
    const kanapName = data[kanap].name;
    
    document.querySelector('#cart__items').innerHTML += 
                `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                    <div class="cart__item__img">
                        <img src="${kanapImg}" alt="${kanapAlt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${kanapName}</h2>
                            <p>${cart[i].color}</p>
                            <p>${kanapPrice}€</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`;
  }
  quantitySelection();
  getDeleteButton();
  totalUpdate();
};

// ========== GESTION DE LA QUANTITE ==========

function totalUpdate() {
  let totalQuantity = 0;
  let totalPrice = 0;

  // Récupère les éléments de la classe itemQuantity et les stocke dans une variable
  const quantitySelector = document.querySelectorAll('.itemQuantity');

  // Pour chaque élément de la classe itemQuantity, modifie la quantité totale et le prix total
  getDataFromAPI().then((data) => {
    quantitySelector.forEach((input) => {
      const kanap = data.findIndex((index) => index._id == input.closest('[data-id]').dataset.id);
      const kanapPrice = data[kanap].price;

      totalQuantity += Number(input.value);
      totalPrice += Number(input.value) * kanapPrice;
    });
    cartTotalQuantity.textContent = totalQuantity;
    cartTotalPrice.textContent = totalPrice;
  });
}


const quantitySelection = () => {
  // Récupère les éléments de la classe itemQuantity et les stocke dans une variable
  const quantitySelector = document.querySelectorAll('.itemQuantity');

  // Pour chaque élément de la classe itemQuantity, ajoute un écouteur d'évènement sur le changement de valeur
  quantitySelector.forEach((input) =>
    input.addEventListener('change', handleQuantityInput)
  );
};

const handleQuantityInput = (e) => {
  // Récupère l'ID et la couleur de l'élément avec le data-id correspondant puis réattribue la quantité
  const selectItem = e.target.closest('[data-id]');
  const { id, color } = selectItem.dataset;
  let quantity = Number(e.target.value);

  if (quantity <= 0 || quantity > 100) {
    // Si la quantité est inférieure ou égale à 0 ou supérieure à 100, affiche un message d'erreur
    alert('Veuillez entrer une quantité entre 1 et 100');
    e.target.value = 1;
    quantity = 1;
  }

  // Change la quantité de l'élément dans le panier
  changeCartItemQuantity({ id, color, quantity });

  // Met à jour le prix total
  totalUpdate();
};

const changeCartItemQuantity = ({ id, color, quantity }) => {
  // Récupère l'index de l'élément dans le panier
  const itemIndex = cart.findIndex((i) => i.id == id && i.color == color);

  // Change la quantité de l'élément dans le panier
  cart[itemIndex].quantity = quantity;

  const newCart = cart.map((item) => ({
    id: item.id,
    color: item.color,
    quantity: item.quantity,
  }));

  // Met à jour le panier dans le local storage
  localStorage.setItem('cart', JSON.stringify(newCart));
};

// ========== SUPPRESSION D'ARTICLES ==========

const deleteItem = ({ id, color }) => {
  // Récupère l'index de l'élément dans le panier
  const itemIndex = cart.findIndex((i) => i.id == id && i.color == color);
  cart.splice(itemIndex, 1);

  // Met à jour le panier dans le local storage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Ajoute un délai pour afficher l'alerte après la suppresion des éléments visuels
  setTimeout(() => alert('Article supprimé avec succès'), 10);
};

const handleDeleteButton = (e) => {
  // Récupère l'ID et la couleur de l'élément avec le data-id correspondant puis supprime l'élément
  const selectItem = e.target.closest('[data-id]');
  const { id, color } = selectItem.dataset;

  selectItem.remove();

  deleteItem({ id, color });
  totalUpdate();
};

// Récupère les boutons de suppression d'article et ajoute une écoute des clicks
const getDeleteButton = () => {
  // Récupère les éléments de la classe deleteItem et les stocke dans une variable
  const deleteButton = document.querySelectorAll('.deleteItem');
  deleteButton.forEach((button) =>
    // Pour chaque élément de la classe deleteItem, ajoute un écouteur d'évènement sur le click
    button.addEventListener('click', handleDeleteButton)
  );
};

// ========== FORM ===========

const formFirstName = document.getElementById('firstName');
let firstNameIsValid = false;
const formLastName = document.getElementById('lastName');
let lastNameIsValid = false;
const formAddress = document.getElementById('address');
let addressIsValid = false;
const formCity = document.getElementById('city');
let cityIsValid = false;
const formMail = document.getElementById('email');
let mailIsValid = false;

// ========== REGEXP ==========
// Déclaration des expressions régulières
const nameReg = /^[a-z '-]+$/i;
const mailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// First Name
const firstNameErr = document.getElementById('firstNameErrorMsg');
const validateFirstName = () => {
  // Vérifie si la valeur du champ firstName correspond à l'expression régulière
  formFirstName.addEventListener('change', function (e) {
    // Si la valeur du champ firstName correspond à l'expression régulière, la variable firstNameIsValid passe à true
    if ((formFirstName.innerText = e.target.value.match(nameReg))) {
      firstNameIsValid = true;
      firstNameErr.innerText = '';
    }
    // Sinon, la variable firstNameIsValid passe à false et affiche un message d'erreur
    else {
      firstNameErr.innerText =
        'Saisie du prénom invalide, seuls les lettres, les espaces, les apostrophes et les tirets sont autorisés';
      firstNameIsValid = false;
    }
  });
};

// Last Name
const lastNameErr = document.getElementById('lastNameErrorMsg');
const validateLastName = () => {
  // Vérifie si la valeur du champ lastName correspond à l'expression régulière
  formLastName.addEventListener('change', function (e) {
    // Si la valeur du champ lastName correspond à l'expression régulière, la variable lastNameIsValid passe à true
    if ((formLastName.innerText = e.target.value.match(nameReg))) {
      lastNameIsValid = true;
      lastNameErr.innerText = '';
    }
    // Sinon, la variable lastNameIsValid passe à false et affiche un message d'erreur
    else {
      lastNameErr.innerText =
        'Saisie du nom invalide , seuls les lettres, les espaces, les apostrophes et les tirets sont autorisés';
      lastNameIsValid = false;
    }
  });
};

// Address
const addressErr = document.getElementById('addressErrorMsg');
const validateAddress = () => {
  // Vérifie si la valeur du champ address correspond à l'expression régulière
  formAddress.addEventListener('change', function (e) {
    // Si la valeur du champ address correspond à l'expression régulière, la variable addressIsValid passe à true
    if (e.target.value !== '') {
      addressIsValid = true;
      addressErr.innerText = '';
    }
    // Sinon, la variable addressIsValid passe à false et affiche un message d'erreur
    else {
      addressErr.innerText = "Saisie de l'adresse invalide";
      addressIsValid = false;
    }
  });
};

// City
const cityErr = document.getElementById('cityErrorMsg');
const validateCity = () => {
  // Vérifie si la valeur du champ city correspond à l'expression régulière
  formCity.addEventListener('change', function (e) {
    // Si la valeur du champ city correspond à l'expression régulière, la variable cityIsValid passe à true
    if ((formCity.innerText = e.target.value.match(nameReg))) {
      cityIsValid = true;
      cityErr.innerText = '';
    }
    // Sinon, la variable cityIsValid passe à false et affiche un message d'erreur
    else {
      cityErr.innerText =
        'Saisie de la ville invalide , seuls les lettres, les espaces, les apostrophes et les tirets sont autorisés';
      cityIsValid = false;
    }
  });
};

// Email
const emailErr = document.getElementById('emailErrorMsg');
const validateEmail = () => {
  // Vérifie si la valeur du champ email correspond à l'expression régulière
  formMail.addEventListener('change', function (e) {
    // Si la valeur du champ email correspond à l'expression régulière, la variable mailIsValid passe à true
    if ((formMail.innerText = e.target.value.match(mailReg))) {
      mailIsValid = true;
      emailErr.innerText = '';
    }
    // Sinon, la variable mailIsValid passe à false et affiche un message d'erreur
    else {
      emailErr.innerText = "Saisie de l'addresse email invalide";
      mailIsValid;
    }
  });
};

const checkOrder = (e) => {
  e.preventDefault();
  // Si toutes les variables sont à true, on envoie la commande
  if (
    firstNameIsValid &&
    lastNameIsValid &&
    addressIsValid &&
    cityIsValid &&
    mailIsValid &&
    cart.length > 0
  ) {
    createOrder();
  }
  // Sinon, on affiche un message d'erreur
  else {
    alert(
      'Veuillez remplir le formulaire ou ajouter des articles au panier avant de valider votre commande'
    );
  }
};

// ========== CREATION DE LA COMMANDE ==========

const createOrder = () => {
  // Création de l'objet contact
  let contact = {
    firstName: formFirstName.value,
    lastName: formLastName.value,
    address: formAddress.value,
    city: formCity.value,
    email: formMail.value,
  };
  // Création de l'objet products
  let products = cart.flatMap((item) => item.id);
  let order = JSON.stringify({ contact, products });
  // Envoi de la commande
  postOrder(order);
};

// Récupération de l'élément "order" et ajout de l'écoute sur le clic
const orderButton = document.getElementById('order');
orderButton.addEventListener('click', checkOrder);

// ========== POST DE LA COMMANDE ==========
const postOrder = (order) => {
  const options = {
    method: 'POST',
    body: order,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Envoi de la commande
  fetch('http://localhost:3000/api/products/order', options)
    .then((res) => res.json())
    .then((res) => redirection(res));
  console.log(order);
};

// Récupération de l'ID de la commande et redirection vers la page de confirmation
function redirection(res) {
  let orderId = res.orderId;
  localStorage.clear(cart);
  window.location.replace(
    'http://127.0.0.1:5500/front/html/confirmation.html?order=' + orderId
  );
}

// ========== APPEL DES FONCTIONS ==========
getDataFromAPI().then((data) => {insertElements(cart, data)});

// Appel des fonctions de validation
validateFirstName();
validateLastName();
validateAddress();
validateCity();
validateEmail();