// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let scrollTimeout;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeNavigation();
    initializeScrollAnimations();
    initializeGalleryFilter();
    initializeModal();
    initializeFAQ();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeiOSOptimizations();
    initializeSwipeGestures();
    initializeTouchFeedback();
    
    // Loading animation
    document.body.classList.add('loaded');
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            requestAnimationFrame(updateNavbar);
            isScrolling = true;
        }
    });

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 300) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
        isScrolling = false;
    }

    // Active link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id], .hero');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id') || 'home';

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`) || 
                                 document.querySelector('.nav-link[href="index.html"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grouped elements
                const siblings = entry.target.parentElement.querySelectorAll('.fade-in-scroll');
                siblings.forEach((sibling, index) => {
                    if (sibling.classList.contains('visible')) {
                        setTimeout(() => {
                            sibling.style.transform = 'translateY(0)';
                            sibling.style.opacity = '1';
                        }, index * 100);
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all fade-in-scroll elements
    document.querySelectorAll('.fade-in-scroll').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for numbers
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// ===== GALLERY FILTER =====
function initializeGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length === 0 || galleryItems.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== MODAL FUNCTIONALITY =====
function initializeModal() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.querySelector('.close');

    // Make openModal function global
    window.openModal = function(button) {
        if (!modal) return;

        const galleryItem = button.closest('.gallery-item');
        const img = galleryItem.querySelector('.gallery-img');
        const title = galleryItem.querySelector('h3').textContent;
        const description = galleryItem.querySelector('p').textContent;

        if (modalImage) modalImage.src = img.src;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDescription) modalDescription.textContent = description;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Add animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    };

    // Make closeModal function global
    window.closeModal = function() {
        if (!modal) return;

        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    };

    // Close modal events
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// ===== FAQ FUNCTIONALITY =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    // Make toggleFAQ function global
    window.toggleFAQ = function(element) {
        const faqItem = element.closest('.faq-item');
        const faqAnswer = faqItem.querySelector('.faq-answer');
        
        // Close other FAQs
        faqItems.forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = '0';
            }
        });

        // Toggle current FAQ
        faqItem.classList.toggle('active');
        
        if (faqItem.classList.contains('active')) {
            faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
        } else {
            faqAnswer.style.maxHeight = '0';
        }
    };

    // Initialize all FAQ items
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                toggleFAQ(this);
            });
        }
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            showNotification('Thank you! Your quote request has been sent. We\'ll contact you within 2 hours.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(data) {
    let isValid = true;

    // Required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'address', 'problemDescription'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });

    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldName, 'This field is required');
        return false;
    }

    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(fieldName, 'Please enter a valid email address');
        return false;
    }

    if (fieldName === 'phone' && value && !isValidPhone(value)) {
        showFieldError(fieldName, 'Please enter a valid phone number');
        return false;
    }

    clearFieldError(fieldName);
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--accent-color)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--accent-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// ===== PERFORMANCE OPTIMIZATIONS =====

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'hero-mechanic.jpg',
        'mobile-repair.jpg',
        'thesky-marcelin.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Call preload when DOM is ready
document.addEventListener('DOMContentLoaded', preloadResources);

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful');
        })
        .catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(backToTop);

    // Show/hide based on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    backToTop.addEventListener('mouseenter', function() {
        this.style.background = 'var(--secondary-color)';
        this.style.transform = 'scale(1.1)';
    });

    backToTop.addEventListener('mouseleave', function() {
        this.style.background = 'var(--primary-color)';
        this.style.transform = 'scale(1)';
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', initializeBackToTop);

// ===== ANIMATION ON SCROLL REFRESH =====
function refreshScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-scroll');
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0) {
            el.classList.add('visible');
        }
    });
}

// Refresh animations on page load and resize
window.addEventListener('load', refreshScrollAnimations);
window.addEventListener('resize', debounce(refreshScrollAnimations, 250));

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // You could send error reports to a logging service here
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send error reports to a logging service here
});

// ===== ANALYTICS HELPER =====
function trackEvent(category, action, label) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track form submissions
document.addEventListener('submit', function(event) {
    if (event.target.id === 'contactForm') {
        trackEvent('Form', 'Submit', 'Contact Form');
    }
});

// Track button clicks
document.addEventListener('click', function(event) {
    if (event.target.matches('.btn-primary')) {
        trackEvent('Button', 'Click', event.target.textContent.trim());
    }
    
    if (event.target.matches('a[href^="tel:"]')) {
        trackEvent('Contact', 'Phone Click', 'Phone Number');
    }
    
    if (event.target.matches('a[href^="mailto:"]')) {
        trackEvent('Contact', 'Email Click', 'Email Address');
    }
});

// ===== iOS SPECIFIC OPTIMIZATIONS =====
function initializeiOSOptimizations() {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone;
    
    if (isIOS) {
        document.body.classList.add('ios');
        
        // Add iOS-specific class for standalone mode
        if (isStandalone) {
            document.body.classList.add('ios-standalone');
        }
        
        // Prevent zoom on input focus
        preventZoomOnInputFocus();
        
        // Handle safe area insets
        handleSafeAreaInsets();
        
        // Optimize scrolling
        optimizeScrolling();
        
        // Add iOS bounce effect
        addIOSBounceEffect();
    }
}

function preventZoomOnInputFocus() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        });
        
        input.addEventListener('blur', function() {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
            }
        });
    });
}

function handleSafeAreaInsets() {
    // Dynamic safe area handling
    function updateSafeAreas() {
        const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)');
        const safeAreaBottom = getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)');
        
        document.documentElement.style.setProperty('--calculated-safe-top', safeAreaTop || '0px');
        document.documentElement.style.setProperty('--calculated-safe-bottom', safeAreaBottom || '0px');
    }
    
    updateSafeAreas();
    window.addEventListener('orientationchange', () => {
        setTimeout(updateSafeAreas, 100);
    });
}

function optimizeScrolling() {
    // Add momentum scrolling to scrollable elements
    const scrollableElements = document.querySelectorAll('.nav-menu, .gallery-items, .testimonials-grid');
    scrollableElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
        element.style.overflowScrolling = 'touch';
    });
}

function addIOSBounceEffect() {
    // Add subtle bounce effect to buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .gallery-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===== SWIPE GESTURES =====
function initializeSwipeGestures() {
    let startX, startY, endX, endY;
    
    // Gallery swipe navigation
    const galleryItems = document.querySelector('.gallery-items');
    if (galleryItems) {
        galleryItems.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryItems.addEventListener('touchmove', handleTouchMove, { passive: true });
        galleryItems.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Mobile menu swipe to close
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('touchstart', handleNavTouchStart, { passive: true });
        navMenu.addEventListener('touchmove', handleNavTouchMove, { passive: true });
        navMenu.addEventListener('touchend', handleNavTouchEnd, { passive: true });
    }
    
    function handleTouchStart(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }
    
    function handleTouchMove(event) {
        if (!startX || !startY) return;
        
        endX = event.touches[0].clientX;
        endY = event.touches[0].clientY;
    }
    
    function handleTouchEnd(event) {
        if (!startX || !startY || !endX || !endY) return;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Horizontal swipe detection
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - previous
                console.log('Swipe right detected');
            } else {
                // Swipe left - next
                console.log('Swipe left detected');
            }
        }
        
        resetSwipeValues();
    }
    
    function handleNavTouchStart(event) {
        startX = event.touches[0].clientX;
    }
    
    function handleNavTouchMove(event) {
        if (!startX) return;
        endX = event.touches[0].clientX;
    }
    
    function handleNavTouchEnd(event) {
        if (!startX || !endX) return;
        
        const deltaX = endX - startX;
        
        // Swipe left to close menu
        if (deltaX < -100) {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        resetSwipeValues();
    }
    
    function resetSwipeValues() {
        startX = null;
        startY = null;
        endX = null;
        endY = null;
    }
}

// ===== TOUCH FEEDBACK =====
function initializeTouchFeedback() {
    // Add haptic-like feedback for buttons
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .service-card, .testimonial-card, .gallery-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touching');
            
            // Add subtle scale animation
            if (!this.style.transition.includes('transform')) {
                this.style.transition += ', transform 0.1s ease';
            }
            this.style.transform = (this.style.transform || '') + ' scale(0.98)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touching');
            
            // Reset scale
            const currentTransform = this.style.transform;
            this.style.transform = currentTransform.replace(/scale\([^)]*\)/, '').trim();
            if (this.style.transform === '') {
                this.style.transform = 'none';
            }
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.classList.remove('touching');
            const currentTransform = this.style.transform;
            this.style.transform = currentTransform.replace(/scale\([^)]*\)/, '').trim();
            if (this.style.transform === '') {
                this.style.transform = 'none';
            }
        }, { passive: true });
    });
}

// ===== ORIENTATION CHANGE HANDLER =====
window.addEventListener('orientationchange', function() {
    // Handle orientation change for iPhone
    setTimeout(() => {
        // Recalculate viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Refresh scroll animations
        refreshScrollAnimations();
        
        // Close mobile menu if open
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, 300);
});

// ===== VIEWPORT HEIGHT FIX FOR iPhone =====
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

// ===== ENHANCED FORM VALIDATION FOR iPhone =====
function enhanceFormForMobile() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Add better mobile UX
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Add focus/blur animations
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Auto-format phone numbers
        if (input.type === 'tel') {
            input.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }
                this.value = value;
            });
        }
    });
}

// Initialize mobile form enhancements
document.addEventListener('DOMContentLoaded', enhanceFormForMobile);