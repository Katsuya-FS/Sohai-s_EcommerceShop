// Fetch and insert header component
async function loadHeader() {
  try {
    let headerPath = 'components/header.html';
    if (window.location.pathname.includes('/pages/')) {
      headerPath = '../components/header.html';
    }

    const response = await fetch(headerPath);
    const headerHTML = await response.text();

    const headerContainer = document.getElementById('header-container');
    headerContainer.innerHTML = headerHTML;
    updateHeaderLinks();

    // Wait for DOM to update
    setTimeout(() => {
      initializeHeader();

      // Update cart badge after header loads
      if (typeof cart !== "undefined") {
        cart.updateCartCount();
        if (typeof cart.checkPendingDropdown === 'function') {
          cart.checkPendingDropdown();
        }
        if (typeof cart.initializeCheckoutModal === 'function') {
          cart.initializeCheckoutModal();
        }
      }

    }, 0);

  } catch (error) {
    console.error('Error loading header:', error);
  }
}

function updateHeaderLinks() {
  const isInPages = window.location.pathname.includes('/pages/');
  document.querySelectorAll('#header-container [data-path]').forEach((link) => {
    const path = link.dataset.path;
    if (!path) return;

    if (!isInPages) {
      link.href = path;
      return;
    }

    if (path.startsWith('pages/')) {
      link.href = path.replace(/^pages\//, '');
    } else {
      link.href = `../${path}`;
    }
  });
}

// Initialize header functionality
function initializeHeader() {
  console.log("Initializing header...");

  // =========================
  // AUTH ELEMENTS
  // =========================
  const loginBtn = document.getElementById('btn-login-header');
  const registerBtn = document.getElementById('btn-register-header');
  const userBtn = document.getElementById('btn-user-header');
  const loginModal = document.getElementById('login-modal');
  const closeModal = document.getElementById('close-modal');
  const toggleRegisterLink = document.getElementById('toggle-register');
  const toggleLoginLink = document.getElementById('toggle-login');
  const authForm = document.getElementById('auth-form');
  const authSubmitBtn = document.getElementById('auth-submit');
  const modalTitle = document.getElementById('modal-title');
  const confirmPasswordGroup = document.getElementById('confirm-password-group');
  const toggleLoginText = document.getElementById('toggle-login-text');

  const emailInput = document.getElementById('auth-email');
  const confirmPasswordInput = document.getElementById('auth-confirm-password');
  const profileModal = document.getElementById('profile-modal');
  const closeProfileModal = document.getElementById('close-profile-modal');
  const profileUsername = document.getElementById('profile-username');
  const profileEmail = document.getElementById('profile-email');
  const recentPurchasesList = document.getElementById('recent-purchases-list');
  const logoutProfileBtn = document.getElementById('profile-logout-btn');

  // =========================
  // CART ELEMENTS (FIXED)
  // =========================
  const cartBtn = document.getElementById('cart-button');
  const cartDropdown = document.getElementById('cart-dropdown');
  const closeCartBtn = document.getElementById('close-cart-dropdown');

  if (!loginModal) {
    console.error('Login modal not found!');
    return;
  }

  let isRegisterMode = false;

  updateAuthUI();

  // =========================
  // AUTH EVENTS
  // =========================

  loginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = false;
    updateModalUI();
    loginModal.style.display = 'flex';
  });

  registerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = true;
    updateModalUI();
    loginModal.style.display = 'flex';
  });

  userBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openProfileModal();
  });

  closeModal?.addEventListener('click', () => {
    loginModal.style.display = 'none';
    resetForm();
  });

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
      resetForm();
    }
    if (e.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });

  closeProfileModal?.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });

  logoutProfileBtn?.addEventListener('click', () => {
    auth.logout();
  });

  toggleRegisterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = true;
    updateModalUI();
  });

  toggleLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = false;
    updateModalUI();
  });

  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAuth();
  });

  // =========================
  // CART EVENTS (FIXED)
  // =========================
  if (!cartBtn || !cartDropdown) {
    console.error("Cart elements not found!");
  } else {

    cartBtn.addEventListener('click', function (e) {
      e.preventDefault();
      console.log("CART CLICKED");

      if (cartDropdown.style.display === 'block') {
        cartDropdown.style.display = 'none';
      } else {
        if (typeof cart !== "undefined") {
          cart.updateCartDropdownDisplay();
        }
        cartDropdown.style.display = 'block';
      }
    });

    closeCartBtn?.addEventListener('click', () => {
      cartDropdown.style.display = 'none';
    });

    // Click outside to close
    window.addEventListener('click', (e) => {
      if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDropdown.style.display = 'none';
      }
    });
  }

  // =========================
  // FUNCTIONS
  // =========================

  function updateModalUI() {
    if (isRegisterMode) {
      modalTitle.textContent = 'Register';
      authSubmitBtn.textContent = 'Register';

      document.getElementById('email-group').style.display = 'block';
      confirmPasswordGroup.style.display = 'block';
      toggleLoginText.style.display = 'block';

      emailInput.required = true;
      confirmPasswordInput.required = true;

    } else {
      modalTitle.textContent = 'Log In';
      authSubmitBtn.textContent = 'Log In';

      document.getElementById('email-group').style.display = 'none';
      confirmPasswordGroup.style.display = 'none';
      toggleLoginText.style.display = 'none';

      emailInput.required = false;
      confirmPasswordInput.required = false;
    }
  }

  function handleAuth() {
    const username = document.getElementById('auth-username').value;
    const email = emailInput.value;
    const password = document.getElementById('auth-password').value;
    const confirmPassword = confirmPasswordInput.value;

    if (isRegisterMode) {
      if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
      }

      if (auth.register(username, email, password, confirmPassword)) {
        showRegistrationSuccess(username);
        loginModal.style.display = 'none';
        updateAuthUI();
        resetForm();
      } else {
        alert('Registration failed.');
      }

    } else {
      if (!username || !password) {
        alert('Enter username and password.');
        return;
      }

      if (auth.login(username, password)) {
        alert('Login successful!');
        loginModal.style.display = 'none';
        updateAuthUI();
        resetForm();
      } else {
        alert('Invalid credentials.');
      }
    }
  }

  function resetForm() {
    authForm.reset();
    isRegisterMode = false;
    updateModalUI();
  }

  function updateAuthUI() {
    const isLoggedIn = auth.isLoggedIn();
    const currentUser = auth.getCurrentUser();
    const adminDashboardBtn = document.getElementById('btn-admin-dashboard');

    if (isLoggedIn) {
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
      userBtn.style.display = 'inline-block';
      userBtn.textContent = currentUser.username || 'Profile';
      userBtn.title = 'View profile';

      // Show admin dashboard button only if user is admin
      if (auth.isAdmin() && adminDashboardBtn) {
        adminDashboardBtn.style.display = 'flex';
      } else if (adminDashboardBtn) {
        adminDashboardBtn.style.display = 'none';
      }

      userBtn.onclick = (e) => {
        e.preventDefault();
        openProfileModal();
      };
    } else {
      loginBtn.style.display = 'inline-block';
      registerBtn.style.display = 'inline-block';
      userBtn.style.display = 'none';
      if (adminDashboardBtn) {
        adminDashboardBtn.style.display = 'none';
      }
    }
  }

  function openProfileModal() {
    if (!auth.isLoggedIn() || !profileModal) return;

    const currentUser = auth.getCurrentUser();
    const emailValue = currentUser.email || `${currentUser.username || 'user'}@example.com`;

    profileUsername.textContent = currentUser.username || 'Guest User';
    profileEmail.textContent = emailValue;
    renderRecentPurchases(currentUser.username);
    profileModal.style.display = 'flex';
  }

  function renderRecentPurchases(username) {
    if (!recentPurchasesList) return;

    const samplePurchases = [
      {
        name: 'Gaming Mouse',
        meta: 'May 10, 2026',
        price: '₱1,499'
      },
      {
        name: 'Mechanical Keyboard',
        meta: 'May 4, 2026',
        price: '₱2,899'
      },
      {
        name: 'RTX 4070 GPU',
        meta: 'Apr 28, 2026',
        price: '₱34,999'
      }
    ];

    recentPurchasesList.innerHTML = samplePurchases.map(purchase => `
      <div class="purchase-item">
        <div>
          <p class="item-name">${purchase.name}</p>
          <p class="item-meta">${purchase.meta}</p>
        </div>
        <span class="item-price">${purchase.price}</span>
      </div>
    `).join('');
  }

  function showRegistrationSuccess(username) {
    alert(`Welcome ${username}! Registration successful.`);
  }
}

// RUN ONLY ONCE
document.addEventListener('DOMContentLoaded', loadHeader);