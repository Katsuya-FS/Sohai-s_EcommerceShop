// Shopping Cart Management System

class ShoppingCart {
  constructor() {
    this.cart = this.loadCart();
    this.pendingOpen = false;
    this.checkoutInitialized = false;
  }

  // Load cart from localStorage
  loadCart() {
    const cartData = localStorage.getItem('shoppingCart');
    return cartData ? JSON.parse(cartData) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
  }

  // Add item to cart (requires login)
  addToCart(product, quantity = 1) {
    // Check if product already exists in cart
    const existingItem = this.cart.find(item => item.name === product.name);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        ...product,
        quantity: quantity
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.showCartDropdown();
    return true;
  }

  // Remove item from cart
  removeFromCart(productName) {
    this.cart = this.cart.filter(item => item.name !== productName);
    this.saveCart();
    this.updateCartCount();
  }

  // Show cart dropdown modal
  showCartDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    if (dropdown) {
      this.updateCartDropdownDisplay();
      dropdown.style.display = 'block';
      this.pendingOpen = false;
    } else {
      this.pendingOpen = true;
    }
  }

  checkPendingDropdown() {
    if (this.pendingOpen) {
      this.showCartDropdown();
    }
  }

  // Update cart dropdown display
  formatCurrency(value, symbol = '₱') {
    return `${symbol}${value.toLocaleString()}`;
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateCartDropdownDisplay() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;

    if (this.cart.length === 0) {
      cartItemsList.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      const footerTotal = document.getElementById('cart-total-amount');
      if (footerTotal) {
        footerTotal.textContent = '₱0';
      }
      return;
    }

    let html = '';
    let total = 0;

    this.cart.forEach((item, index) => {
      const currency = item.currency || '₱';
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      html += `
        <div class="cart-item">
          <div class="item-info">
            <p class="item-name">${item.name}</p>
            <p class="item-price">${this.formatCurrency(item.price, currency)} x ${item.quantity} = ${this.formatCurrency(itemTotal, currency)}</p>
          </div>
          <button class="remove-item" data-index="${index}">Remove</button>
        </div>
      `;
    });

    cartItemsList.innerHTML = html;
    const footerTotal = document.getElementById('cart-total-amount');
    if (footerTotal) {
      footerTotal.textContent = this.formatCurrency(total, this.cart[0]?.currency || '₱');
    }

    // Add remove button listeners
    const removeButtons = cartItemsList.querySelectorAll('.remove-item');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const itemToRemove = this.cart[index];
        this.removeFromCart(itemToRemove.name);
        this.updateCartDropdownDisplay();
      });
    });
  }

  // Get cart count
  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Update cart count badge
  updateCartCount() {
    const cartBadge = document.getElementById('cart-count-badge');
    if (cartBadge) {
      const count = this.getCartCount();
      cartBadge.textContent = count;
      cartBadge.style.display = count > 0 ? 'block' : 'none';
    }
  }

  // Get all cart items
  getCartItems() {
    return this.cart;
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartCount();
  }

  // Open the checkout modal and render order details
  openCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const checkoutTotalAmount = document.getElementById('checkout-total-amount');

    if (!checkoutModal || !checkoutItemsList || !checkoutTotalAmount) return;

    if (this.cart.length === 0) {
      alert('Your cart is empty. Add products before checkout.');
      return;
    }

    checkoutItemsList.innerHTML = '';
    this.cart.forEach(item => {
      const currency = item.currency || '₱';
      const itemTotal = item.price * item.quantity;
      checkoutItemsList.insertAdjacentHTML('beforeend', `
        <div class="checkout-item">
          ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
          <div>
            <p class="item-name">${item.name}</p>
            <p class="item-price">${this.formatCurrency(item.price, currency)} x ${item.quantity}</p>
          </div>
          <p class="item-total">${this.formatCurrency(itemTotal, currency)}</p>
        </div>
      `);
    });

    checkoutTotalAmount.textContent = this.formatCurrency(this.getCartTotal(), this.cart[0]?.currency || '₱');
    checkoutModal.style.display = 'flex';
    this.resetCheckoutForm();
    document.getElementById('checkout-step').classList.remove('hidden');
    document.getElementById('receipt-step').classList.add('hidden');
  }

  resetCheckoutForm() {
    const fields = [
      'checkout-card-name',
      'checkout-card-number',
      'checkout-expiry',
      'checkout-cvv'
    ];
    fields.forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        field.value = '';
      }
    });
    this.clearCheckoutErrors();
  }

  clearCheckoutErrors() {
    ['checkout-error-name', 'checkout-error-number', 'checkout-error-expiry', 'checkout-error-cvv'].forEach(id => {
      const message = document.getElementById(id);
      if (message) {
        message.textContent = '';
      }
    });
  }

  validateCheckoutForm() {
    this.clearCheckoutErrors();
    let valid = true;

    const nameField = document.getElementById('checkout-card-name');
    const numberField = document.getElementById('checkout-card-number');
    const expiryField = document.getElementById('checkout-expiry');
    const cvvField = document.getElementById('checkout-cvv');

    if (!nameField || !numberField || !expiryField || !cvvField) return false;

    if (!nameField.value.trim()) {
      document.getElementById('checkout-error-name').textContent = 'Cardholder name is required.';
      valid = false;
    }

    const numberClean = numberField.value.replace(/\s+/g, '');
    if (!numberClean) {
      document.getElementById('checkout-error-number').textContent = 'Card number is required.';
      valid = false;
    } else if (!/^\d{12,19}$/.test(numberClean)) {
      document.getElementById('checkout-error-number').textContent = 'Card number must contain only digits.';
      valid = false;
    }

    if (!expiryField.value.trim()) {
      document.getElementById('checkout-error-expiry').textContent = 'Expiration date is required.';
      valid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryField.value)) {
      document.getElementById('checkout-error-expiry').textContent = 'Use MM/YY format.';
      valid = false;
    }

    if (!cvvField.value.trim()) {
      document.getElementById('checkout-error-cvv').textContent = 'CVV is required.';
      valid = false;
    } else if (!/^\d{3,4}$/.test(cvvField.value)) {
      document.getElementById('checkout-error-cvv').textContent = 'CVV must be 3 or 4 digits.';
      valid = false;
    }

    return valid;
  }

  showCheckoutLoading() {
    const loading = document.getElementById('checkout-loading');
    if (loading) {
      loading.classList.remove('hidden');
    }
  }

  hideCheckoutLoading() {
    const loading = document.getElementById('checkout-loading');
    if (loading) {
      loading.classList.add('hidden');
    }
  }

  showReceipt() {
    const orderNumber = document.getElementById('order-number');
    const receiptDetails = document.getElementById('receipt-details');
    const total = this.getCartTotal();
    if (orderNumber) {
      orderNumber.textContent = `#${Math.floor(100000 + Math.random() * 900000)}`;
    }
    if (receiptDetails) {
      receiptDetails.innerHTML = `
        <p class="receipt-line">Items: ${this.cart.length}</p>
        <p class="receipt-line">Total paid: ${this.formatCurrency(total, this.cart[0]?.currency || '₱')}</p>
        <p class="receipt-line">Thank you for trying our demo checkout.</p>
      `;
    }

    document.getElementById('checkout-step')?.classList.add('hidden');
    document.getElementById('receipt-step')?.classList.remove('hidden');
  }

  initializeCheckoutModal() {
    if (this.checkoutInitialized) {
      return;
    }
    this.checkoutInitialized = true;

    const checkoutButton = document.getElementById('checkout-button');
    const closeCheckoutModal = document.getElementById('close-checkout-modal');
    const receiptCloseBtn = document.getElementById('receipt-close-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const paymentCards = document.querySelectorAll('.payment-card');

    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        this.openCheckoutModal();
      });
    }

    if (closeCheckoutModal) {
      closeCheckoutModal.addEventListener('click', () => {
        const checkoutModal = document.getElementById('checkout-modal');
        checkoutModal.style.display = 'none';
      });
    }

    if (receiptCloseBtn) {
      receiptCloseBtn.addEventListener('click', () => {
        const checkoutModal = document.getElementById('checkout-modal');
        checkoutModal.style.display = 'none';
      });
    }

    paymentCards.forEach(card => {
      card.addEventListener('click', () => {
        paymentCards.forEach(item => item.classList.remove('selected'));
        card.classList.add('selected');
        const input = card.querySelector('input');
        if (input) input.checked = true;
      });
    });

    const cardNumberField = document.getElementById('checkout-card-number');
    const expiryField = document.getElementById('checkout-expiry');
    const cvvField = document.getElementById('checkout-cvv');

    if (cardNumberField) {
      cardNumberField.addEventListener('input', () => {
        const clean = cardNumberField.value.replace(/\D/g, '');
        const grouped = clean.match(/.{1,4}/g);
        cardNumberField.value = grouped ? grouped.join(' ') : clean;
      });
    }

    if (expiryField) {
      expiryField.addEventListener('input', () => {
        let value = expiryField.value.replace(/[^0-9]/g, '');
        if (value.length > 2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        expiryField.value = value;
      });
    }

    if (cvvField) {
      cvvField.addEventListener('input', () => {
        cvvField.value = cvvField.value.replace(/\D/g, '');
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!this.validateCheckoutForm()) return;

        this.showCheckoutLoading();
        setTimeout(() => {
          this.hideCheckoutLoading();
          this.showReceipt();
          this.clearCart();
          this.updateCartDropdownDisplay();
        }, 1400);
      });
    }
  }
}

// Create global cart instance
const cart = new ShoppingCart();

// Show login modal when needed
function showLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  cart.updateCartCount();

  const checkoutInitTimer = setInterval(() => {
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton && typeof cart.initializeCheckoutModal === 'function') {
      cart.initializeCheckoutModal();
      clearInterval(checkoutInitTimer);
    }
  }, 200);
  
  const addToCartBtn = document.getElementById('add-to-cart');

  // Close cart dropdown when clicking outside
  document.addEventListener('click', function(e) {
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartButton = document.getElementById('cart-button');
    const clickedInsideCartButton = cartButton && (e.target === cartButton || cartButton.contains(e.target));
    const clickedInsideDropdown = cartDropdown && cartDropdown.contains(e.target);
    const clickedAddToCart = addToCartBtn && (e.target === addToCartBtn || addToCartBtn.contains(e.target));

    if (cartDropdown && !clickedInsideCartButton && !clickedInsideDropdown && !clickedAddToCart) {
      cartDropdown.style.display = 'none';
    }
  });
  
  const closeDropdownBtn = document.getElementById('close-cart-dropdown');
  if (closeDropdownBtn) {
    closeDropdownBtn.addEventListener('click', function() {
      document.getElementById('cart-dropdown').style.display = 'none';
    });
  }
});
