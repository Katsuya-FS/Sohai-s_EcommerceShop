// Authentication Management System

class AuthSystem {
  constructor() {
    this.currentUser = this.loadUser();
    this.initializeAccounts();
  }

  // Initialize default accounts
  initializeAccounts() {
    const existingAccounts = localStorage.getItem('accounts');
    if (!existingAccounts) {
      const defaultAccounts = [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123'
        },
        {
          username: 'user',
          email: 'user@example.com',
          password: 'user123'
        }
      ];
      localStorage.setItem('accounts', JSON.stringify(defaultAccounts));
    }
  }

  // Get all accounts
  getAccounts() {
    const accounts = localStorage.getItem('accounts');
    return accounts ? JSON.parse(accounts) : [];
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Load user from localStorage
  loadUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Login user with username and password validation
  login(username, password) {
    const accounts = this.getAccounts();
    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
      const user = {
        username: account.username,
        email: account.email,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
      return true;
    }
    return false;
  }

  // Register new user
  register(username, email, password, confirmPassword) {
    // Validate passwords match
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      console.error('Password must be at least 6 characters');
      return false;
    }

    const accounts = this.getAccounts();

    // Check if username already exists
    if (accounts.find(acc => acc.username === username)) {
      console.error('Username already exists');
      return false;
    }

    // Check if email already exists
    if (accounts.find(acc => acc.email === email)) {
      console.error('Email already exists');
      return false;
    }

    // Create new account
    const newAccount = {
      username: username,
      email: email,
      password: password
    };

    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // Auto login the new user
    return this.login(username, password);
  }

  // Logout user
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    location.reload();
  }

  // Check if current user is admin
  isAdmin() {
    return this.currentUser && this.currentUser.username === 'admin';
  }
}

// Create global auth instance
const auth = new AuthSystem();
