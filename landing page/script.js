// Remove white background from logo images
function removeWhiteBackground() {
    const logoImages = document.querySelectorAll('.logo-img, .footer-logo-img');
    logoImages.forEach(img => {
        if (img.complete) {
            processLogo(img);
        } else {
            img.addEventListener('load', () => processLogo(img));
        }
    });
}

function processLogo(img) {
    // Create canvas to process image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Make white pixels transparent
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If pixel is white (or near white), make it transparent
        if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    img.src = canvas.toDataURL();
}

// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const navbar = document.querySelector('.navbar');

// Scroll Effect for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('nav-active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Don't prevent default for modal links
        if (this.hasAttribute('data-modal')) {
            return;
        }
        
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! We will contact you soon.');
        this.reset();
    });
}

// Scroll Animation for Elements
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Start counting animation if this is the hero section
            if (entry.target.classList.contains('hero')) {
                startCountingAnimation();
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Counting Animation for Stats
function startCountingAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const targetValue = parseInt(stat.getAttribute('data-count'));
        const suffix = targetValue >= 1000 ? 'k+' : (targetValue === 99 ? '%' : '+');
        const duration = 2000; // Animation duration in milliseconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        let value = 0;
        
        // If it's a large number (2000), we'll display as 2k+
        const increment = targetValue > 1000 ? targetValue / 1000 / totalFrames : targetValue / totalFrames;
        
        const counter = setInterval(() => {
            frame++;
            
            // For 2000 (2k+), we count up to 2
            const displayValue = targetValue > 1000 ? 
                (Math.min(targetValue / 1000, value.toFixed(1))) : 
                Math.floor(value);
                
            // Update the text content
            stat.textContent = displayValue + suffix;
            
            value += increment;
            
            if (frame === totalFrames) {
                clearInterval(counter);
                // Ensure final value is displayed correctly
                if (targetValue >= 1000) {
                    stat.textContent = (targetValue/1000) + suffix;
                } else {
                    stat.textContent = targetValue + suffix;
                }
            }
        }, frameDuration);
    });
}

// Start counting animation immediately if hero section is visible
if (document.querySelector('.hero')) {
    // Slight delay to ensure the page has loaded
    setTimeout(startCountingAnimation, 500);
}

// Remove white background from logos when page loads
window.addEventListener('load', () => {
    // Try CSS approach first, if it doesn't work, use canvas method
    // The CSS mix-blend-mode should handle it, but we keep this as fallback
    setTimeout(removeWhiteBackground, 100);
});

// Modal Functionality
const featureLinks = document.querySelectorAll('.feature-link[data-modal]');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal-close');

// Open modal when feature link is clicked
featureLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

// Close modal when close button is clicked
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
});

// Close modal when clicking outside the modal content
modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
});

// Function to close modal and scroll to contact
function closeModalAndScrollToContact(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Small delay to allow modal to close smoothly
    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add highlight effect to contact form
            setTimeout(() => {
                const contactForm = document.getElementById('contact-form');
                const contactFormContainer = document.querySelector('.contact-form-container');
                if (contactForm) {
                    contactForm.classList.add('highlight');
                    if (contactFormContainer) {
                        contactFormContainer.classList.add('highlight');
                    }
                    setTimeout(() => {
                        contactForm.classList.remove('highlight');
                        if (contactFormContainer) {
                            contactFormContainer.classList.remove('highlight');
                        }
                    }, 2000);
                }
            }, 500);
        }
    }, 300);
}

// Handle modal CTA buttons
const modalCtaButtons = document.querySelectorAll('.modal-cta');
modalCtaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = this.closest('.modal');
        
        if (modal) {
            // Add clicked class for visual feedback
            this.classList.add('clicked');
            
            // Close modal and scroll to contact
            closeModalAndScrollToContact(modal);
            
            // Remove clicked class after animation
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 500);
        }
    });
}); 