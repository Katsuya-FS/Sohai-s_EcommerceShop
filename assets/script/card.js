const imageRoot = window.location.pathname.includes('/pages/') ? '../assets/images/' : 'assets/images/';
const productPageRoot = window.location.pathname.includes('/pages/') ? '' : 'pages/';

function createCard(product, index){
  const productLink = `${productPageRoot}product.html?id=${index}`;

  return `
  <a href="${productLink}" class="card-link">
    <div class="card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>&#8369;${product.price.toLocaleString()}</p>
    </div>
  </a>
  `;
}

const allProducts = [
  {name: "Gigabyte RTX 3060", price: 21500, image: `${imageRoot}rtx3060.jpg`, category: "graphics"},
  {name: "ZotacGaming RTX 3090", price: 63000, image: `${imageRoot}rtx3090.jpg`, category: "graphics"},
  {name: "AMD Radeon RX 6600", price: 15000, image: `${imageRoot}rx6600.jpg`, category: "graphics"},

  {name: "ASUS ROG Strix B550", price: 8500, image: `${imageRoot}ASUS ROG Strix B550.jpg`, category: "motherboard"},
  {name: "MSI B550 Gaming Edge", price: 9000, image: `${imageRoot}MSI B550 Gaming Edge.jpg`, category: "motherboard"},
  {name: "Gigabyte B550 Gaming X V2", price: 9000, image: `${imageRoot}Gigabyte B550.jpg`, category: "motherboard"},

  {name: "Intel Core i7-13700K", price: 18000, image: `${imageRoot}Intel Core i7-13700K.jpg`, category: "cpu"},
  {name: "AMD Ryzen 5 5600g", price: 18000, image: `${imageRoot}amd ryzen 5 5600g.jpg`, category: "cpu"},
  {name: "AMD Ryzen 9 7950X", price: 22000, image: `${imageRoot}AMD Ryzen 9 7950X.jpg`, category: "cpu"}
];

// NEW RENDER LOGIC
function renderProducts(containerId, category) {
  const container = document.getElementById(containerId);
  if (!container) return;

  allProducts
    .map((product, index) => ({ ...product, index }))
    .filter(product => product.category === category)
    .forEach(product => {
      container.insertAdjacentHTML(
        "beforeend",
        createCard(product, product.index)
      );
    });
}

// render each section
renderProducts("graphics-product-list", "graphics");
renderProducts("motherboard-product-list", "motherboard");
renderProducts("cpu-product-list", "cpu");


