// Création de l'URL en utilisant le numéro de commande
let url = new URL(window.location.href);
let orderNumber = url.searchParams.get('order');

// Récupération de l'élément "orderId" et modification par le numéro de commande
let orderId = document.getElementById('orderId');
orderId.innerText = orderNumber;