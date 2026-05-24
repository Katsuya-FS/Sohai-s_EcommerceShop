// Carousel functionality
const carousel = {
    currentIndex: 0,
    slides: [],
    dots: [],
    interval: null,
    autoPlayDelay: 3000,

    init() {
        this.slides = document.querySelectorAll('.carousel-item');
        this.dots = document.querySelectorAll('.dot');
        
        if (this.slides.length === 0) return;

        // Manual controls
        document.querySelector('.prev')?.addEventListener('click', () => this.prev());
        document.querySelector('.next')?.addEventListener('click', () => this.next());
        
        // Dot navigation
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                this.goToSlide(parseInt(dot.dataset.index));
            });
        });

        // Auto play
        this.startAutoPlay();
        
        // Pause on hover
        const container = document.querySelector('.carousel-container');
        container?.addEventListener('mouseenter', () => this.stopAutoPlay());
        container?.addEventListener('mouseleave', () => this.startAutoPlay());
    },

    goToSlide(index) {
        this.slides[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
        if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;
        
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    },

    next() {
        this.goToSlide(this.currentIndex + 1);
        this.resetAutoPlay();
    },

    prev() {
        this.goToSlide(this.currentIndex - 1);
        this.resetAutoPlay();
    },

    startAutoPlay() {
        this.interval = setInterval(() => this.next(), this.autoPlayDelay);
    },

    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => carousel.init());