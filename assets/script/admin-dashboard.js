// Admin Dashboard Functionality

class AdminDashboard {
    constructor() {
        this.currentUser = auth.getCurrentUser();
        this.init();
    }

    init() {
        // Check if user is logged in and is admin
        if (!this.currentUser || this.currentUser.username !== 'admin') {
            window.location.href = '../index.html';
            return;
        }

        this.updateUserInfo();
        this.initializeSidebar();
        this.initializeProfileDropdown();
        this.initializeDatetime();
        this.initializeChart();
        this.attachEventListeners();
    }

    updateUserInfo() {
        const adminUsername = document.getElementById('admin-username');
        const adminDropdownUsername = document.getElementById('admin-dropdown-username');
        const adminDropdownEmail = document.getElementById('admin-dropdown-email');

        if (adminUsername) adminUsername.textContent = this.currentUser.username;
        if (adminDropdownUsername) adminDropdownUsername.textContent = this.currentUser.username;
        if (adminDropdownEmail) adminDropdownEmail.textContent = this.currentUser.email;
    }

    initializeSidebar() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        const navLinks = document.querySelectorAll('.nav-link:not(.back-btn):not(.logout-btn)');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Close sidebar on link click on mobile
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const section = link.getAttribute('data-section');
                    if (section) {
                        this.handleNavigation(section);
                    }
                }

                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Set Dashboard as active by default
        const dashboardLink = document.querySelector('[data-section="dashboard"]');
        if (dashboardLink) {
            dashboardLink.classList.add('active');
        }
    }

    handleNavigation(section) {
        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');

        const sections = {
            dashboard: { title: 'Dashboard', subtitle: 'Welcome back, Admin' },
            orders: { title: 'Orders', subtitle: 'Manage all customer orders' },
            sales: { title: 'Sales', subtitle: 'View sales analytics' },
            customers: { title: 'Customers', subtitle: 'Manage customers' },
            reports: { title: 'Reports', subtitle: 'View detailed reports' }
        };

        if (sections[section]) {
            if (pageTitle) pageTitle.textContent = sections[section].title;
            if (pageSubtitle) pageSubtitle.textContent = sections[section].subtitle;
        }
    }

    initializeProfileDropdown() {
        const profileBtn = document.getElementById('admin-profile-btn');
        const userDropdown = document.getElementById('user-dropdown');

        if (profileBtn && userDropdown) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('click', (e) => {
                if (!profileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
        }
    }

    attachLogoutButtons() {
        const adminLogoutBtn = document.getElementById('admin-logout-btn');
        const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');

        const handleLogout = () => {
            auth.logout();
        };

        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', handleLogout);
        }

        if (dropdownLogoutBtn) {
            dropdownLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    }

    initializeDatetime() {
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date().toLocaleDateString('en-US', options);
            currentDateElement.textContent = today;
        }
    }

    initializeChart() {
        const chartCanvas = document.getElementById('sales-chart');
        if (!chartCanvas) return;

        const ctx = chartCanvas.getContext('2d');

        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Sales (₱)',
                    data: [12000, 19000, 8000, 15000, 22000, 25000, 18000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Orders',
                    data: [8, 12, 6, 10, 15, 18, 12],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        };

        this.chart = new Chart(ctx, config);
    }

    attachEventListeners() {
        // Attach logout buttons
        this.attachLogoutButtons();

        // Attach chart filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartData(e.target.getAttribute('data-filter'));
            });
        });

        // Attach view all links
        const viewAllLinks = document.querySelectorAll('.view-all-link');
        viewAllLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Can be extended for navigation to full tables
            });
        });
    }

    updateChartData(period) {
        if (!this.chart) return;

        let labels, salesData, ordersData;

        switch(period) {
            case 'week':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                salesData = [12000, 19000, 8000, 15000, 22000, 25000, 18000];
                ordersData = [8, 12, 6, 10, 15, 18, 12];
                break;
            case 'month':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                salesData = [65000, 85000, 78000, 92000];
                ordersData = [45, 52, 48, 58];
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                salesData = [120000, 145000, 130000, 172000, 142895, 165000, 195000, 210000, 185000, 220000, 198000, 215000];
                ordersData = [250, 280, 260, 310, 298, 325, 380, 410, 365, 420, 395, 410];
                break;
            default:
                return;
        }

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = salesData;
        this.chart.data.datasets[1].data = ordersData;
        this.chart.update();
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});
