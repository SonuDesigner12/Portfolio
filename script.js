// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initSkillBars();
    initContactForm();
    initNewsletterSubscription();
    initScrollAnimations();
    initMobileMenu();
    initStickyHeader();
});

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated Skill Bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillFill = entry.target;
                const percent = skillFill.getAttribute('data-percent');
                skillFill.style.width = percent + '%';
                skillObserver.unobserve(skillFill);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Call Phone Function
function callPhone() {
    const phoneNumber = '+91-988-884-8230';
    if (confirm(`Would you like to call ${phoneNumber}?`)) {
        window.location.href = `tel:${phoneNumber}`;
    }
}

// Contact Form Validation and Submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Enhanced validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (name.trim().length < 2) {
                showNotification('Name must be at least 2 characters long', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            sendEmail(name, email, message, submitBtn, originalText, this);
        });
    }
}

// Send Email Function
function sendEmail(name, email, message, submitBtn, originalText, form) {
    // Prepare data for PHP
    const emailData = {
        name: name,
        email: email,
        message: message
    };
    
    // Send email using PHP backend
    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success popup
            showEmailSuccessPopup(name, email, message);
            // Reset form
            form.reset();
            showNotification('Message sent successfully!', 'success');
        } else {
            // Show error message
            showNotification(data.message || 'Failed to send email. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Show Email Success Popup
function showEmailSuccessPopup(name, email, message) {
    const popup = document.createElement('div');
    popup.className = 'email-success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>✅ Message Sent Successfully!</h3>
                <button class="popup-close" onclick="closeEmailPopup()">&times;</button>
            </div>
                         <div class="popup-body">
                 <div class="success-icon">
                     <i class="fas fa-check-circle"></i>
                 </div>
                 <h4>Message Sent Successfully!</h4>
                 <p>Thank you for reaching out. I'll get back to you within 24 hours!</p>
             </div>
            <div class="popup-footer">
                <button class="btn btn-primary" onclick="closeEmailPopup()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add popup styles
    const popupStyles = `
        .email-success-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .popup-content {
            background: #1e1e1e;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
        }
        
        .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .popup-header h3 {
            color: #6a42eb;
            margin: 0;
        }
        
        .popup-close {
            background: none;
            border: none;
            color: #ffffff;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }
        
        .popup-close:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .popup-body {
            margin-bottom: 1.5rem;
        }
        
                 .popup-body {
             text-align: center;
             margin-bottom: 1.5rem;
         }
         
         .popup-body h4 {
             color: #ffffff;
             margin: 1rem 0;
             font-size: 1.5rem;
         }
         
         .popup-body p {
             margin-bottom: 1rem;
             color: #cccccc;
         }
         
         .success-icon {
             margin-bottom: 1rem;
         }
         
         .success-icon i {
             font-size: 4rem;
             color: #10b981;
         }
        
        .popup-footer {
            text-align: center;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .popup-content {
                margin: 1rem;
                padding: 1.5rem;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = popupStyles;
    document.head.appendChild(styleSheet);
}

// Close Email Popup
function closeEmailPopup() {
    const popup = document.querySelector('.email-success-popup');
    if (popup) {
        popup.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}

// Newsletter Subscription
function initNewsletterSubscription() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const newsletterEmail = document.getElementById('newsletterEmail');
    
    if (subscribeBtn && newsletterEmail) {
        subscribeBtn.addEventListener('click', function() {
            const email = newsletterEmail.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate subscription
            const originalText = this.textContent;
            this.textContent = 'Subscribing...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterEmail.value = '';
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-content, .contact-content');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        element.classList.add('fade-in');
        scrollObserver.observe(element);
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Sticky Header with Background Change
function initStickyHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Email Validation Helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing Animation for Hero Section
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Portfolio Item Click Handlers
function initPortfolioHandlers() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNotification(`Opening ${title} project...`, 'info');
        });
    });
}

// Service Card Click Handlers
function initServiceHandlers() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            showNotification(`Learn more about ${serviceName}`, 'info');
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initTypingAnimation();
    initParallaxEffect();
    initPortfolioHandlers();
    initServiceHandlers();
});

// Add CSS for mobile menu
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(10px);
            padding: 2rem;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-menu.active {
            transform: translateY(0);
        }
        
        .nav-menu ul {
            flex-direction: column;
            gap: 1rem;
        }
        
        .mobile-menu-btn.active i {
            transform: rotate(90deg);
        }
        
        .mobile-menu-btn i {
            transition: transform 0.3s ease;
        }
    }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Add scroll indicator
function initScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #ec4899, #8b5cf6);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(scrollIndicator);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollIndicator.style.width = scrollPercent + '%';
    });
}

// Initialize scroll indicator
document.addEventListener('DOMContentLoaded', initScrollIndicator);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const loadingStyles = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;

const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet);
