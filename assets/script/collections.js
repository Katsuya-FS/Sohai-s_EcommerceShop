/* collections.js — product data and rendering (GitHub Pages-safe paths) */
const imageRoot = window.location.pathname.includes('/pages/') ? '../assets/images/' : 'assets/images/';
const productPageRoot = window.location.pathname.includes('/pages/') ? '' : 'pages/';

const collectionProducts = [
  { name: "Gigabyte RTX 3060", price: 21500, image: `${imageRoot}rtx3060.jpg`, category: "graphics", badge: "New" },
  { name: "ZotacGaming RTX 3090", price: 63000, image: `${imageRoot}rtx3090.jpg`, category: "graphics", badge: "Best seller" },
  { name: "AMD Radeon RX 6600", price: 15000, image: `${imageRoot}rx6600.jpg`, category: "graphics", badge: "Hot deal" },

  { name: "ASUS ROG Strix B550", price: 8500, image: `${imageRoot}ASUS ROG Strix B550.jpg`, category: "motherboard", badge: "Limited" },
  { name: "MSI B550 Gaming Edge", price: 9000, image: `${imageRoot}MSI B550 Gaming Edge.jpg`, category: "motherboard", badge: "Trending" },
  { name: "Gigabyte B550 Gaming X V2", price: 9000, image: `${imageRoot}Gigabyte B550.jpg`, category: "motherboard", badge: "New" },

  { name: "Intel Core i7-13700K", price: 18000, image: `${imageRoot}Intel Core i7-13700K.jpg`, category: "cpu", badge: "Best seller" },
  { name: "AMD Ryzen 5 5600g", price: 18000, image: `${imageRoot}amd ryzen 5 5600g.jpg`, category: "cpu", badge: "Hot deal" },
  { name: "AMD Ryzen 9 7950X", price: 22000, image: `${imageRoot}AMD Ryzen 9 7950X.jpg`, category: "cpu", badge: "Limited" },

  { name: "Minimalistic Keyboard", price: 1500, image: `${imageRoot}keyboard.jpg`, category: "peripherals", badge: "Trending" },
  { name: "Maono Mircrophone", price: 3500, image: `${imageRoot}microphone.jpg`, category: "peripherals", badge: "New" },
  { name: "Razer BlackWidow Mouse", price: 5000, image: `${imageRoot}mouse.jpg`, category: "peripherals", badge: "Best seller" },
];

window.collectionProducts = collectionProducts;

const categories = ['all', ...new Set(collectionProducts.map((p) => p.category))];

function formatCategoryName(category) {
  return category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
}

function renderCollectionFilters() {
  const filterContainer = document.getElementById('collection-filters');
  if (!filterContainer) return;

  filterContainer.innerHTML = categories
    .map((category) => `
      <button class="filter-btn${category === 'all' ? ' active' : ''}" data-category="${category}">
        ${formatCategoryName(category)}
      </button>
    `)
    .join('');

  filterContainer.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      renderCollectionProducts(button.dataset.category);
    });
  });
}

function renderCollectionProducts(category = 'all') {
  const container = document.getElementById('collection-grid');
  if (!container) return;

  const filtered = category === 'all' ? collectionProducts : collectionProducts.filter((p) => p.category === category);

  container.innerHTML = filtered
    .map((product, index) => `
      <article class="collection-card">
        <a class="card-link" href="${productPageRoot}product.html?id=${index}">
          <img src="${product.image}" alt="${product.name}">
          <div class="collection-card-body">
            <span class="collection-card-badge">${product.badge}</span>
            <h2 class="collection-card-title">${product.name}</h2>
            <div class="collection-card-meta">
              <span class="collection-card-price">₱${product.price.toLocaleString()}</span>
              <span class="card-stats">${product.category.toUpperCase()}</span>
            </div>
            <div class="product-card-actions">
              <span class="card-button" role="button">Add to cart</span>
              <span class="card-stats">Quick view</span>
            </div>
          </div>
        </a>
      </article>
    `)
    .join('');
}

renderCollectionFilters();
renderCollectionProducts();
