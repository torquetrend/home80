"use strict";

// =========================
// Utility Functions
// =========================

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, wait = 100) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Toast Notification
 * @param {string} message - The message to display.
 * @param {string} type - The type of toast ('success', 'error', 'info').
 */
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

/**
 * Create Toast Container if it doesn't exist.
 * @returns {HTMLElement} - The toast container element.
 */
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// =========================
// Smooth Scrolling for Internal Links
// =========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =========================
// Sticky Header
// =========================

const header = document.getElementById('header');
window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 100));

// =========================
// Hamburger Menu Toggle
// =========================

const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function toggleSidebar() {
    hamburgerMenu.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    const expanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
    hamburgerMenu.setAttribute('aria-expanded', !expanded);

    const isHidden = sidebar.getAttribute('aria-hidden') === 'true';
    sidebar.setAttribute('aria-hidden', !isHidden);
}

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleSidebar);
    hamburgerMenu.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSidebar();
        }
    });
}

if (overlay) {
    overlay.addEventListener('click', toggleSidebar);
}

// =========================
// Modal Functionality
// =========================

const modal = document.getElementById('modal');
const openModalBtn = document.querySelector('.modal-btn-primary');
const closeModalBtn = document.querySelector('.close-button');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Trap focus within modal when open
modal.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// =========================
// Newsletter Modal Functionality
// =========================

const newsletterModal = document.getElementById('newsletter-modal');
const closeNewsletterModalBtn = document.querySelector('#newsletter-modal .close-button');

function openNewsletterModal() {
    newsletterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = newsletterModal.querySelector('button');
    if (firstInput) firstInput.focus();
}

function closeNewsletterModal() {
    newsletterModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (closeNewsletterModalBtn) {
    closeNewsletterModalBtn.addEventListener('click', closeNewsletterModal);
}

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && newsletterModal.classList.contains('active')) {
        closeNewsletterModal();
    }
});

// =========================
// Contact Form Submission with Validation
// =========================

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        let isValid = true;

        // Clear previous errors
        contactForm.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Name validation
        if (name === '') {
            isValid = false;
            const nameInput = document.getElementById('contact-name');
            nameInput.classList.add('error');
            nameInput.nextElementSibling.textContent = 'Please enter your name.';
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            const emailInput = document.getElementById('contact-email');
            emailInput.classList.add('error');
            emailInput.nextElementSibling.textContent = 'Please enter a valid email address.';
        }

        // Message validation
        if (message === '') {
            isValid = false;
            const messageInput = document.getElementById('contact-message');
            messageInput.classList.add('error');
            messageInput.nextElementSibling.textContent = 'Please enter your message.';
        }

        if (isValid) {
            // Here you can integrate with your backend to send the form data
            showToast(`Thank you for your message, ${name}! We'll get back to you soon.`, 'success');
            contactForm.reset();
            closeModal();
        } else {
            showToast('Please correct the errors in the form.', 'error');
        }
    });
}

// =========================
// Newsletter Subscription Submission with Validation
// =========================

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value.trim();
        let isValid = true;

        // Clear previous errors (if any)
        newsletterForm.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        newsletterForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            const emailInput = document.getElementById('newsletter-email');
            emailInput.classList.add('error');
            emailInput.nextElementSibling.textContent = 'Please enter a valid email address.';
            showToast('Please enter a valid email address.', 'error');
        }

        if (isValid) {
            // Here you can integrate with your backend to subscribe the email
            newsletterForm.reset();
            showToast('Thank you for subscribing!', 'success');
            openNewsletterModal();
        }
    });
}

// =========================
// Carousel Functionality
// =========================

document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.carousel-slide');
    const nextButton = document.querySelector('.carousel-nav.next');
    const prevButton = document.querySelector('.carousel-nav.prev');
    let currentIndex = 0;
    let carouselInterval;

    /**
     * Update Carousel Slides
     */
    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'next', 'prev');
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.classList.add('next');
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            }
        });
    }

    /**
     * Start Autoplay for Carousel
     */
    function startAutoplay() {
        carouselInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }

    /**
     * Stop Autoplay for Carousel
     */
    function stopAutoplay() {
        clearInterval(carouselInterval);
    }

    /**
     * Initialize Carousel
     */
    function initCarousel() {
        updateCarousel();
        startAutoplay();

        const carousel = document.querySelector('.carousel-3d');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);

            // Swipe support using Hammer.js
            const hammer = new Hammer(carousel);
            hammer.on('swipeleft', () => {
                nextSlide();
            });
            hammer.on('swiperight', () => {
                prevSlide();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }

        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
    }

    /**
     * Move to Next Slide
     */
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    /**
     * Move to Previous Slide
     */
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    initCarousel();

    /**
     * Adjust Carousel for Desktop
     */
    function adjustCarouselForDesktop() {
        if (window.innerWidth >= 768) {
            slides.forEach(slide => {
                slide.style.width = '300px';
                slide.style.margin = '0 15px';
            });
        } else {
            slides.forEach(slide => {
                slide.style.width = '';
                slide.style.margin = '';
            });
        }
    }

    adjustCarouselForDesktop();
    window.addEventListener('resize', adjustCarouselForDesktop);
});

// =========================
// Save User Preferences
// =========================

function savePreference(articleId) {
    let preferences = JSON.parse(localStorage.getItem('preferences')) || [];
    if (!preferences.includes(articleId)) {
        preferences.push(articleId);
        localStorage.setItem('preferences', JSON.stringify(preferences));
        showToast('Article added to your recommendations!', 'success');
    } else {
        showToast('Article already in your recommendations.', 'info');
    }
}

// =========================
// Load Recommended Articles
// =========================

function loadRecommendedArticles() {
    let preferences = JSON.parse(localStorage.getItem('preferences')) || [];
    const recommendationsContainer = document.getElementById('recommended-articles');

    if (recommendationsContainer && preferences.length > 0) {
        fetchArticlesByIds(preferences).then(articles => {
            recommendationsContainer.innerHTML = '';
            articles.forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.classList.add('article-grid-item');

                articleItem.innerHTML = `
                    <img src="${article.image}" alt="${article.title}">
                    <div class="article-content">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="#" class="btn-secondary" aria-label="Read More about ${article.title}">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;

                recommendationsContainer.appendChild(articleItem);
            });
        });
    } else {
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '<p>No recommendations yet. Explore articles and save your favorites!</p>';
        }
    }
}

/**
 * Fetch Articles by IDs
 * @param {Array} ids - Array of article IDs.
 * @returns {Promise<Array>} - Promise resolving to array of articles.
 */
function fetchArticlesByIds(ids) {
    return new Promise(resolve => {
        const allArticles = [
            {
                id: 'article1',
                title: 'Age of Electric Vehicles',
                description: 'How electric vehicles are reshaping the automotive industry.',
                image: 'car charging.jpg'
            },
            {
                id: 'article2',
                title: 'Autonomous Drivers?',
                description: 'Our world with fully self-driving cars.',
                image: 'waymo.jpg'
            },
            {
                id: 'article3',
                title: 'Sustainable Critical Materials',
                description: 'Exploring the impacts of critical materials and our daily driving needs.',
                image: 'lithium-mine.jpg'
            },
            // Add more articles as needed
        ];

        const articles = allArticles.filter(article => ids.includes(article.id));
        resolve(articles);
    });
}

window.addEventListener('load', loadRecommendedArticles);

// =========================
// Debounced Search Functionality
// =========================

const searchBarDesktop = document.getElementById('search-bar');
const searchBarMobile = document.getElementById('sidebar-search-bar');
const searchResults = document.getElementById('search-results');

/**
 * Execute Search
 */
function executeSearch() {
    const query = (searchBarDesktop ? searchBarDesktop.value.trim() : '') ||
                  (searchBarMobile ? searchBarMobile.value.trim() : '');

    if (query === '') {
        if (searchResults) {
            searchResults.innerHTML = '';
        }
        return;
    }

    if (searchResults) {
        searchResults.innerHTML = `<p>Searching for "<strong>${query}</strong>"...</p>`;
    }

    // Simulate search operation (Replace with actual search logic/API)
    setTimeout(() => {
        if (searchResults) {
            // Replace with actual search results
            searchResults.innerHTML = `
                <h3>Search Results for "${query}":</h3>
                <ul>
                    <li><a href="#latest-news">Electric Vehicles Revolutionizing the Market</a></li>
                    <li><a href="#reviews">Tesla Model S Review</a></li>
                    <li><a href="#articles">Age of Electric Vehicles</a></li>
                </ul>
            `;
        }
    }, 500);
}

const debouncedExecuteSearch = debounce(executeSearch, 300);

if (searchBarDesktop) {
    searchBarDesktop.addEventListener('input', debouncedExecuteSearch);
}

if (searchBarMobile) {
    searchBarMobile.addEventListener('input', debouncedExecuteSearch);
}

// =========================
// Accessibility Enhancements
// =========================

// Ensure focus is trapped within the modal when it's open
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });
}

if (modal) {
    trapFocus(modal);
}

if (newsletterModal) {
    trapFocus(newsletterModal);
}

// =========================
// Additional Enhancements
// =========================

// Placeholder for Car Chatbot Integration
const chatbotContainer = document.querySelector('.chatbot-container');
if (chatbotContainer) {
    // Initialize your chatbot here
    // For example, embedding a chatbot iframe:
    // chatbotContainer.innerHTML = `<iframe src="your-chatbot-url" title="Car Chatbot" width="100%" height="100%" frameborder="0"></iframe>`;
}

// =========================
// Service Worker Registration
// =========================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}
