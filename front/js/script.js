// Récuperation des données de l'API
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((apiData) => displayCards(apiData))
  .catch(() => console.log('Une erreur est survenue'));

// Fonction permettant d'afficher les cartes
function displayCards(data) {
  for (product of data) {
    // Récupération de le section "items"
    let itemsSection = document.getElementById('items');

    // Création de l'élément "a"
    const productLink = document.createElement('a');
    productLink.href = `./product.html?id=${product._id}`;
    itemsSection.appendChild(productLink);

    // Création de l'élément "article"
    const articleSection = document.createElement('article');
    productLink.appendChild(articleSection);

    // Création de l'élément "img"
    const productImg = document.createElement('img');
    productImg.src = product.imageUrl;
    articleSection.appendChild(productImg);

    // Création de l'élément "h3"
    const productName = document.createElement('h3');
    productName.innerHTML = product.name;
    articleSection.appendChild(productName);

    // Création de l'élément "p"
    const productDesc = document.createElement('p');
    productDesc.innerHTML = product.description;
    articleSection.appendChild(productDesc);
  }
};
