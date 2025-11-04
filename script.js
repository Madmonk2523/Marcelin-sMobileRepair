// MARCELIN MOBILE REPAIR - ENHANCED JAVASCRIPT
// Advanced Single-Page Scrolling with Refined Animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeParticleSystem();
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormHandling();
    initializeGallery();
    initializeTestimonials();
    initializeMobileOptimizations();
    initializeAdvancedEffects();
});

// PARTICLE SYSTEM
function initializeParticleSystem() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '#ff6b35' : '#ff4500';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Create particles - reduced for cleaner look
    for (let i = 0; i < 25; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw subtle connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {  // Reduced connection distance
                    ctx.save();
                    ctx.globalAlpha = (80 - distance) / 80 * 0.1;  // More subtle
                    ctx.strokeStyle = '#ff6b35';
                    ctx.lineWidth = 0.5;  // Thinner lines
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ADVANCED NAVIGATION SYSTEM
function initializeNavigation() {
    const nav = document.getElementById('floatingNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const skipBtns = document.querySelectorAll('.skip-btn');
    const progressBar = document.getElementById('progressBar');
    
    let lastScrollY = window.scrollY;
    
    // Mobile nav toggle
    navToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
                
                // Smooth scroll with offset for fixed nav
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId.substring(1));
            }
        });
    });
    
    // Skip navigation buttons
    skipBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const targetSection = document.getElementById(target);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll-based navigation updates
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Hide/show nav on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;
        
        // Update progress bar
        const scrollProgress = (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollProgress + '%';
        
        // Update active section
        updateActiveSection();
    });
    
    function updateActiveSection() {
        const sections = document.querySelectorAll('.section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        updateActiveNavLink(current);
    }
    
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + activeId) {
                link.classList.add('active');
            }
        });
    }
}

// SCROLL ANIMATIONS
function initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animations to children
                const children = entry.target.querySelectorAll('.service-card, .gallery-item, .contact-card, .credential-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('fade-in', 'visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .section');
    animatedElements.forEach(el => observer.observe(el));
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image, .floating-elements');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// FORM HANDLING
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Initialize date picker with minimum date as tomorrow
        const dateInput = document.getElementById('preferred-date');
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = tomorrow.toISOString().split('T')[0];
        }
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        phoneInput?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d+)/, '($1) $2');
            }
            e.target.value = value;
        });
        
        // Service selection and pricing
        const serviceSelect = document.getElementById('service');
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        serviceSelect?.addEventListener('change', function(e) {
            updatePricingDisplay(e.target.value);
        });
        
        pricingCards.forEach(card => {
            card.addEventListener('click', function() {
                const service = this.dataset.service;
                serviceSelect.value = service;
                updatePricingDisplay(service);
            });
        });
        
        // Payment type toggle
        const paymentRadios = document.querySelectorAll('input[name="payment-type"]');
        const payDepositBtn = document.getElementById('pay-deposit-btn');
        const quoteBtn = document.querySelector('.quote-btn');
        
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'deposit') {
                    payDepositBtn.style.display = 'flex';
                    quoteBtn.style.display = 'none';
                } else {
                    payDepositBtn.style.display = 'none';
                    quoteBtn.style.display = 'flex';
                }
            });
        });
        
        // Payment deposit button
        payDepositBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateForm()) {
                processPayment('deposit');
            }
        });
        
        // Form submission (quote only)
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                processQuoteRequest();
            }
        });
        
        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value) {
                    this.style.borderColor = '#ff4500';
                } else {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        });
    }
}

// PRICING AND PAYMENT FUNCTIONS
function updatePricingDisplay(serviceType) {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.service === serviceType) {
            card.classList.add('selected');
        }
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    let isValid = true;
    const requiredFields = ['name', 'phone', 'vehicle', 'service', 'location', 'preferred-date', 'preferred-time'];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!formData.get(field)) {
            input.style.borderColor = '#ff4500';
            isValid = false;
        } else {
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    return isValid;
}

function getDepositAmount(serviceType) {
    const deposits = {
        'oil-change': 2500, // $25.00 in cents
        'battery': 5000,    // $50.00 in cents
        'brakes': 7500,     // $75.00 in cents
        'engine': 5000,     // $50.00 in cents
        'cooling': 5000,    // $50.00 in cents
        'emergency': 10000, // $100.00 in cents
        'other': 5000       // $50.00 in cents
    };
    return deposits[serviceType] || 5000;
}

async function processPayment(type) {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const serviceType = formData.get('service');
    
    // Show loading state
    const payBtn = document.getElementById('pay-deposit-btn');
    const originalText = payBtn.innerHTML;
    payBtn.innerHTML = '<span>Processing...</span><i class="fas fa-spinner fa-spin"></i>';
    payBtn.disabled = true;
    
    try {
        // Create payment intent with backend
        const paymentResponse = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                vehicle: formData.get('vehicle'),
                service: formData.get('service'),
                description: formData.get('description'),
                location: formData.get('location'),
                preferredDate: formData.get('preferred-date'),
                preferredTime: formData.get('preferred-time'),
                urgency: formData.get('urgency')
            })
        });
        
        if (!paymentResponse.ok) {
            throw new Error('Payment setup failed');
        }
        
        const { clientSecret, amount } = await paymentResponse.json();
        
        // Initialize Stripe (replace with your publishable key)
        const stripe = Stripe('pk_test_your_stripe_publishable_key_here');
        
        // Create payment element or redirect to Stripe Checkout
        // For demo purposes, we'll simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create booking after successful payment
        const bookingResponse = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                vehicle: formData.get('vehicle'),
                service: formData.get('service'),
                description: formData.get('description'),
                location: formData.get('location'),
                preferredDate: formData.get('preferred-date'),
                preferredTime: formData.get('preferred-time'),
                urgency: formData.get('urgency'),
                paymentIntentId: 'simulated_payment'
            })
        });
        
        if (!bookingResponse.ok) {
            throw new Error('Booking creation failed');
        }
        
        const bookingResult = await bookingResponse.json();
        
        // Show confirmation
        showBookingConfirmation(bookingResult.booking);
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Payment failed:', error);
        alert('Payment processing failed. Please try again or contact us directly at (123) 456-7890.');
    } finally {
        payBtn.innerHTML = originalText;
        payBtn.disabled = false;
    }
}

async function processQuoteRequest() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.quote-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    try {
        // Send quote request to backend
        const response = await fetch('/api/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                vehicle: formData.get('vehicle'),
                service: formData.get('service'),
                description: formData.get('description'),
                location: formData.get('location'),
                preferredDate: formData.get('preferred-date'),
                preferredTime: formData.get('preferred-time'),
                urgency: formData.get('urgency')
            })
        });
        
        if (!response.ok) {
            throw new Error('Quote request failed');
        }
        
        const result = await response.json();
        
        // Show success message
        submitBtn.innerHTML = '<span>Quote Request Sent!</span><i class="fas fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            form.reset();
            
            // Reset date picker minimum
            const dateInput = document.getElementById('preferred-date');
            if (dateInput) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput.min = tomorrow.toISOString().split('T')[0];
            }
        }, 3000);
        
    } catch (error) {
        console.error('Quote request failed:', error);
        alert('Failed to send quote request. Please try again or call us at (123) 456-7890.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showBookingConfirmation(bookingData) {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'booking-confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="confirmation-header">
                <i class="fas fa-check-circle"></i>
                <h2>Booking Confirmed!</h2>
            </div>
            <div class="confirmation-details">
                <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
                <p><strong>Service:</strong> ${bookingData.service.replace('-', ' ').toUpperCase()}</p>
                <p><strong>Date & Time:</strong> ${formatDate(bookingData.preferredDate)} at ${formatTime(bookingData.preferredTime)}</p>
                <p><strong>Vehicle:</strong> ${bookingData.vehicle}</p>
                <p><strong>Deposit Paid:</strong> $${bookingData.depositAmount}</p>
                <p><strong>Service Location:</strong> ${bookingData.location}</p>
            </div>
            <div class="confirmation-actions">
                <p class="confirmation-note">
                    <i class="fas fa-info-circle"></i>
                    You will receive a confirmation email shortly with appointment details and our technician's contact information.
                </p>
                <button class="btn btn-primary" onclick="closeConfirmationModal()">
                    <span>Got It!</span>
                    <i class="fas fa-thumbs-up"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function closeConfirmationModal() {
    const modal = document.querySelector('.booking-confirmation-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// GALLERY SYSTEM
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items with animation
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                setTimeout(() => {
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    } else {
                        item.style.animation = 'fadeOut 0.3s ease-out forwards';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }, index * 50);
            });
        });
    });
    
    // Modal functionality
    galleryItems.forEach(item => {
        const viewBtn = item.querySelector('.view-btn');
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        viewBtn?.addEventListener('click', function() {
            modalImage.src = img.src;
            modalCaption.textContent = overlay.querySelector('h4').textContent;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeModal?.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    modal?.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// TESTIMONIALS SLIDER
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// MOBILE OPTIMIZATIONS
function initializeMobileOptimizations() {
    // Touch gesture support
    let startY = 0;
    let startX = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!startY || !startX) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const diffY = startY - currentY;
        const diffX = startX - currentX;
        
        // Prevent elastic scrolling on iOS
        if (Math.abs(diffY) > Math.abs(diffX)) {
            if (window.scrollY <= 0 && diffY < 0) {
                e.preventDefault();
            }
            if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight && diffY > 0) {
                e.preventDefault();
            }
        }
    });
    
    // iPhone safe area adjustments
    if (navigator.userAgent.includes('iPhone')) {
        document.body.classList.add('ios-device');
        
        // Add viewport meta tag adjustments for iPhone X and newer
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', viewport.getAttribute('content') + ', viewport-fit=cover');
        }
    }
    
    // Optimize for touch targets
    const buttons = document.querySelectorAll('button, .btn, .nav-link');
    buttons.forEach(btn => {
        btn.style.minHeight = '48px';
        btn.style.minWidth = '48px';
    });
}

// ADVANCED VISUAL EFFECTS
function initializeAdvancedEffects() {
    // Clean hover effects only - no cursor trail
    
    // Subtle gradient backgrounds on hover
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        const colors = ['#ff6b35', '#cc4125', '#ff4500'];
        const gradientColor = colors[index % colors.length];
        
        section.addEventListener('mouseenter', function() {
            this.style.background = `radial-gradient(circle at 50% 50%, ${gradientColor}08 0%, transparent 80%)`;
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    });
    
    // Scroll-triggered animations
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax backgrounds
        const parallaxElements = document.querySelectorAll('.hero-section');
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
    
    // Loading animation
    window.addEventListener('load', function() {
        const loadingElements = document.querySelectorAll('.hero-title .title-line');
        loadingElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
}

// UTILITY FUNCTIONS
function throttle(func, wait) {
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

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .ios-device {
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
    }
`;
document.head.appendChild(style);

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
        // Load non-critical features
        console.log('Marcelin Mobile Repair - Enhanced Website Loaded');
    });
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}