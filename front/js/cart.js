// ========== INSERTION DES ARTICLES ==========

// Récupération des données de l'API
fetch('http://localhost:3000/api/products/')
  .then((response) => response.json())
  .then(() => insertElements(cart))
  .catch(() => console.log('Aucun élément à afficher'));

// Déclaration des variables
const cartTotalQuantity = document.getElementById('totalQuantity');
const cartTotalPrice = document.getElementById('totalPrice');

// Récupère le panier dans le local storage et le stocke dans une variable
const cart = JSON.parse(localStorage.getItem('cart'));

// Fonction permettant d'ajouter les éléments dans le HTML
const insertElements = (cart) => {
  for (let i = 0; i < cart.length; i++) {
    document.querySelector('#cart__items').innerHTML += 
                `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                    <div class="cart__item__img">
                        <img src="${cart[i].img}" alt="${cart[i].alt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${cart[i].name}</h2>
                            <p>${cart[i].color}</p>
                            <p>${cart[i].price}€</p>
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
  totalUpdate();
};



// ========== GESTION DE LA QUANTITE ==========

// Fonction permettant de mettre à jour la quantité totale et le prix total des articles du panier
const totalUpdate = () => {

  // Déclaration des variables
  let totalQuantity = 0;
  let totalPrice = 0;

  // Boucle pour définir la quantité totale de produits
  cart.forEach((product) => {
    totalQuantity += parseInt(product.quantity);
    totalPrice += product.price * product.quantity;
  });
  // Affiche le prix et la quantité de produits
  cartTotalQuantity.innerText = totalQuantity;
  cartTotalPrice.innerText = totalPrice;
};

//* Récupère tous les éléments avec la classe .itemQuantity
//  Ajoute une écoute à la modification sur les éléments */
const quantitySelection = () => {
  const quantitySelector = document.querySelectorAll('.itemQuantity');
  quantitySelector.forEach((input) =>
    input.addEventListener('change', handleQuantityInput)
  );
};

//* Fonction gérant la modification de quantité
//  Récupère l'ID et la couleur de l'élément avec le data-id correspondant puis réattribue la quantité */
const handleQuantityInput = (e) => {
  const selectItem = e.target.closest('[data-id]');
  const { id, color } = selectItem.dataset;
  const quantity = e.target.value;
  changeCartItemQuantity({ id, color, quantity });
  totalUpdate();
};

const changeCartItemQuantity = ({ id, color, quantity }) => {
  // Récupère l'index de l'objet du panier et retourne son ID et sa couleur puis réattribue la quantité
  const itemIndex = cart.findIndex((i) => i.id == id && i.color == color);
  cart[itemIndex].quantity = quantity;

  // Crée un nouveau tableau à partir de l'ancien avec les nouvelles valeurs puis l'ajoute au local storage
  const newCart = cart.map((item) => ({
    id: item.id,
    color: item.color,
    price: item.price,
    quantity: item.quantity,
    name: item.name,
    img: item.img,
    alt: item.alt,
  }));
  localStorage.setItem('cart', JSON.stringify(newCart));
};




// ========== SUPPRESSION D'ARTICLES ==========

const deleteItem = ({ id, color }) => {
  // Récupère l'index de l'objet du panier, retourne son ID et sa couleur, puis le supprime du panier
  const itemIndex = cart.findIndex((i) => i.id == id && i.color == color);
  cart.splice(itemIndex, 1);

  // Crée un nouveau tableau à partir de l'ancien avec les nouvelles valeurs puis l'ajoute au local storage
  /*const newCart = cart.map((item) => ({
    id: item.id,
    color: item.color,
    price: item.price,
    quantity: item.quantity,
    name: item.name,
    img: item.img,
    alt: item.alt,
  }));*/
  localStorage.setItem('cart', JSON.stringify(cart));

  // Ajoute un délai pour afficher l'alerte après la suppresion des éléments visuels
  setTimeout(() => alert('Article supprimé avec succès'), 10);
};

const handleDeleteButton = (e) => {
  //*  Récupère l'ID et la couleur de l'élément avec le data-id correspondant
  //   Supprime l'élement HTML correspondant
  const selectItem = e.target.closest('[data-id]');
  const { id, color } = selectItem.dataset;

  selectItem.remove();

  deleteItem({ id, color });
  totalUpdate();
};

// Récupère les boutons de suppression d'article et ajoute une écoute des clicks
const getDeleteButton = () => {
  const deleteButton = document.querySelectorAll('.deleteItem');
  deleteButton.forEach((button) =>
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
const formCity = document.getElementById('city')
let cityIsValid = false;
const formMail = document.getElementById('email');
let mailIsValid = false;

// ========== REGEXP ==========

const nameReg = /^[a-z '-]+$/i;
const mailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// First Name
const firstNameErr = document.getElementById('firstNameErrorMsg');
const validateFirstName = () => {
    formFirstName.addEventListener('change', function (e) {
        if (formFirstName.innerText = e.target.value.match(nameReg)) {
            firstNameIsValid = true;
            firstNameErr.innerText = "";
        } else {
            firstNameErr.innerText = "Saisie du prénom invalide";
            firstNameIsValid = false;
        }
    }); 
};

// Last Name
const lastNameErr = document.getElementById('lastNameErrorMsg');
const validateLastName = () => {
    formLastName.addEventListener('change', function (e) {
        if (formLastName.innerText = e.target.value.match(nameReg)) {
            lastNameIsValid = true;
            lastNameErr.innerText = "";
        } else {
            lastNameErr.innerText = "Saisie du nom invalide";
            lastNameIsValid = false;
        }
    }); 
};

// Address
const addressErr = document.getElementById('addressErrorMsg');
const validateAddress = () => {
    formAddress.addEventListener('change', function (e) {
        if (e.target.value !== "") {
            addressIsValid = true;
            addressErr.innerText = "";
        } else {
            addressErr.innerText = "Saisie de l'adresse invalide";
            addressIsValid = false;
        }
    });
};

// City
const cityErr = document.getElementById('cityErrorMsg');
const validateCity = () => {
    formCity.addEventListener('change', function (e) {
        if (formCity.innerText = e.target.value.match(nameReg)) {
            cityIsValid = true;
            cityErr.innerText = "";
        } else {
            cityErr.innerText = "Saisie de la ville invalide";
            cityIsValid = false;
        }
    }); 
};

// Email
const emailErr = document.getElementById('emailErrorMsg');
const validateEmail = () => {
    formMail.addEventListener('change', function (e) {
        if (formMail.innerText = e.target.value.match(mailReg)) {
            mailIsValid = true;
            emailErr.innerText = "";
        } else {
            emailErr.innerText = "Saisie de l'addresse email invalide";
            mailIsValid
        }
    }); 
};

const checkForm = (e) => {
    e.preventDefault();
    if (firstNameIsValid && lastNameIsValid && addressIsValid && cityIsValid && mailIsValid) {
        createOrder();
    } else {
        alert('Veuillez remplir le formulaire correctement');
    }
}

// ========== CREATION DE LA COMMANDE ==========

const createOrder = () => {

    // Création de l'objet contact
    let contact = {
        firstName: formFirstName.value,
        lastName: formLastName.value,
        address: formAddress.value,
        city: formCity.value,
        email: formMail.value
    };
    let products = cart.flatMap((item) => item.id);
    let order = JSON.stringify({contact, products});
    postOrder(order);

}

// Récupération de l'élément "order" et ajout de l'écoute sur le clic
const orderButton = document.getElementById("order");
orderButton.addEventListener('click', checkForm);


// ========== POST DE LA COMMANDE ==========
const postOrder = (order) => {

const options = {
    method: 'POST',
    body: order,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Envoi de la requête POST
fetch('http://localhost:3000/api/products/order', options)
    .then(res => res.json())
    .then(res => redirection(res));
    console.log(order)
    
};

// Récupération de l'ID de la commande et redirection vers la page de confirmation
function redirection (res) {
  let orderId = res.orderId
  localStorage.clear(cart);
  window.location.replace("http://127.0.0.1:5500/front/html/confirmation.html?order=" + orderId);
};

// ========== APPEL DES FONCTIONS ==========


// Ajoute un délai avant l'exécution des fonctions pour permettre la récupération des valeurs
setTimeout(function () {
  quantitySelection();
  getDeleteButton();
}, 300);

validateFirstName();
validateLastName();
validateAddress();
validateCity();
validateEmail();
