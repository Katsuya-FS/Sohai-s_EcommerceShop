
const assetRoot = window.location.pathname.includes('/pages/') ? '../assets/images/' : 'assets/images/';

const products =
  typeof collectionProducts !== "undefined"
    ? collectionProducts
    : [
        {name: "GigaByte RTX 3060", price: 21500, image: `${assetRoot}rtx3060.jpg`, category: "laptop"},
        {name: "ZotacGaming RTX 3090", price: 63000, image: `${assetRoot}rtx3090.jpg`, category: "graphics"},
        {name: "AMD Radeon RX 6600", price: 15000, image: `${assetRoot}rx6600.jpg`, category: "graphics"},
        {name: "ASUS ROG Strix B550", price: 8500, image: `${assetRoot}ASUS ROG Strix B550.jpg`, category: "motherboard"},
        {name: "MSI B550 Gaming Edge", price: 9000, image: `${assetRoot}MSI B550 Gaming Edge.jpg`, category: "motherboard"},
        {name: "Gigabyte B550 Gaming X V2", price: 9000, image: `${assetRoot}Gigabyte B550.jpg`, category: "motherboard"},
        {name: "Intel Core i7-13700K", price: 18000, image: `${assetRoot}Intel Core i7-13700K.jpg`, category: "cpu"},
        {name: "AMD Ryzen 5 5600g", price: 18000, image: `${assetRoot}amd ryzen 5 5600g.jpg`, category: "cpu"},
        {name: "AMD Ryzen 9 7950X", price: 22000, image: `${assetRoot}AMD Ryzen 9 7950X.jpg`, category: "cpu"}
      ];

// GET ID FROM URL
const params = new URLSearchParams(window.location.search);
const idRaw = params.get("id");
const id = idRaw !== null ? Number(idRaw) : null;

// LOAD PRODUCT DETAILS
if (id !== null && Number.isInteger(id) && id >= 0 && id < products.length) {
  const product = products[id];

  document.getElementById("main-image").src = product.image;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-price").innerHTML =
  `&#8369;${product.price.toLocaleString()}`;
  document.getElementById("product-description").textContent =
    "High-quality product with premium features.";

} else {
  document.querySelector(".product-content").innerHTML =
    "<p>Product not found</p>";
}

// ===============================
// QUANTITY BUTTONS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const qtyInput = document.getElementById("quantity");
  const btnPlus = document.getElementById("qty-plus");
  const btnMinus = document.getElementById("qty-minus");

  if (btnPlus && btnMinus && qtyInput) {
    btnPlus.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });

    btnMinus.addEventListener("click", () => {
      if (qtyInput.value > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
      }
    });
  }

  // ===============================
  // ADD TO CART BUTTON
  // ===============================
  const addToCartBtn = document.querySelector(".btn-add-cart");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value) || 1;

      if (id !== null && products[id]) {
        const product = products[id];

        // ADD TO CART
        cart.addToCart(product, qty);

        alert(`${product.name} added to cart (x${qty})`);
      }
    });
  }
});



