// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.remove();
        }, 600);
    }
});

// ===== MOBILE MENU =====
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Kliknutí na odkaz v menu
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            // Zavřít menu
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Zavřít menu při kliku mimo něj
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== STICKY HEADER =====
const header = document.querySelector('header');
let lastScroll = 0;
const scrollThreshold = 200;
const scrollTolerance = 50;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (currentScroll - lastScroll > scrollTolerance && currentScroll > scrollThreshold) {
        header.classList.add('hidden');
    } else if (lastScroll - currentScroll > scrollTolerance) {
        header.classList.remove('hidden');
    }

    lastScroll = currentScroll;
});

// ===== LOGO BOUNCER =====
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        logo.classList.add('logo-bounce');
        setTimeout(() => logo.classList.remove('logo-bounce'), 1000);
    });
}

// ===== SPARKLE TLAČÍTKO =====
const sparkleButtons = document.querySelectorAll('.btn-primary');

const sparkleColors = [
    'radial-gradient(circle, #a8def0 0%, #fbc4d4 50%, #d9b3ff 80%)',
    'radial-gradient(circle, #a8e6cf 0%, #d0f0fd 50%, transparent 80%)',
    'radial-gradient(circle, #fff4e1 0%, #ffd6d6 50%, #fefefe 80%)'
];

sparkleButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) {  
            createSparkleOnButton(btn, e.clientX, e.clientY);
        }
    });

    btn.addEventListener('touchmove', (e) => {
        if (Math.random() > 0.8) {
            const touch = e.touches[0];
            createSparkleOnButton(btn, touch.clientX, touch.clientY);
        }
    }, { passive: true });
});

function createSparkleOnButton(button, clientX, clientY) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-hover';
    
    sparkle.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    
    const rect = button.getBoundingClientRect();
    const x = clientX - rect.left - 5;
    const y = clientY - rect.top - 5;
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    
    button.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 600);
}

// ===== PROJECT OVERLAY MOBILE =====
if (window.innerWidth <= 768) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.classList.toggle('visible');
            }
        });
    });
}

// ===== HERO SPARKLE EFFECT =====
const heroTitle = document.querySelector('.sparkle-text');

if (heroTitle) {
    heroTitle.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) createSparkle(e.clientX, e.clientY);
    });

    if (window.innerWidth <= 768) {
        heroTitle.addEventListener('touchmove', (e) => {
            if (Math.random() > 0.6) {
                const touch = e.touches[0];
                createSparkle(touch.clientX, touch.clientY);
            }
        }, { passive: true });

        heroTitle.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            createSparkle(touch.clientX, touch.clientY);
        }, { passive: true });
    }
}

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.pointerEvents = 'none';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// ===== TYPEWRITER EFFECT =====
const typewriterElement = document.querySelector('.typewriter');

if (typewriterElement) {
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    typewriterElement.style.opacity = '1';
    
    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < text.length) {
            typewriterElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 60);
        }
    }
    
    setTimeout(typeChar, 500);
}

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            projects.forEach(project => {
                const category = project.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== RIPPLE EFFECT (OPRAVENÝ - bez preventDefault) =====
document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // NEBLOKUJEME kliknutí - necháme link fungovat normálně
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});

// ===== INTERSECTION OBSERVER FOR FADE-IN =====
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
} else {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

window.addEventListener('load', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
});

// ===== FORM VALIDATION =====
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;
    
    const existingError = formGroup.querySelector('.error-msg');
    if (existingError) {
        existingError.remove();
    }
    
    formGroup.classList.remove('error', 'success');
    
    if (field.type === 'checkbox') {
        if (!field.checked && field.required) {
            formGroup.classList.add('error');
            showErrorMessage(formGroup, 'Toto pole je povinné');
            return false;
        }
        formGroup.classList.add('success');
        return true;
    }
    
    if (field.required && !field.value.trim()) {
        formGroup.classList.add('error');
        showErrorMessage(formGroup, 'Toto pole je povinné');
        return false;
    }
    
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            formGroup.classList.add('error');
            showErrorMessage(formGroup, 'Zadejte platnou emailovou adresu');
            return false;
        }
    }
    
    if (field.value.trim()) {
        formGroup.classList.add('success');
    }
    
    return true;
}

function showErrorMessage(formGroup, message) {
    const errorMsg = document.createElement('span');
    errorMsg.className = 'error-msg';
    errorMsg.textContent = message;
    formGroup.appendChild(errorMsg);
}

const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input:not([type="hidden"]):not([name="bot-field"]), textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    contactForm.addEventListener('submit', (e) => {
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            
            const firstError = contactForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            return false;
        }
        
        console.log('Formulář se odesílá...');
    });
}

// ===== PARALLAX EFFECT =====
if (window.innerWidth > 768) {
    const blobs = document.querySelectorAll('.blob');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        blobs.forEach((blob, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            blob.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== FOOTER SPARKLE EFFECT =====
const footer = document.querySelector('footer');

if (footer) {
    footer.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.85) {
            createFooterSparkle(e.clientX, e.clientY);
        }
    });

    if (window.innerWidth <= 768) {
        footer.addEventListener('touchmove', (e) => {
            if (Math.random() > 0.75) {
                const touch = e.touches[0];
                createFooterSparkle(touch.clientX, touch.clientY);
            }
        }, { passive: true });

        footer.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            createFooterSparkle(touch.clientX, touch.clientY);
        }, { passive: true });
    }
}

function createFooterSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-footer';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.pointerEvents = 'none';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// ===== EASTER EGG: Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'rainbow 2s infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 4000);
        
        console.log('🎉 Konami Code aktivován! Našli jste velikonoční vajíčko!');
    }
});
// ===== COOKIE CONSENT =====
(function() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    
    // Zkontroluj, jestli už uživatel rozhodl
    const consent = localStorage.getItem('cookie-consent');
    
    if (!consent) {
        // Zobraz banner po 1 sekundě
        setTimeout(() => {
            cookieBanner.style.display = 'block';
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 100);
        }, 1000);
    } else if (consent === 'accepted') {
        // Načti Google Analytics
        loadGoogleAnalytics();
    }
    
    // Přijmout cookies
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        hideBanner();
        loadGoogleAnalytics();
    });
    
    // Odmítnout cookies
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'declined');
        hideBanner();
    });
    
    function hideBanner() {
        cookieBanner.classList.remove('show');
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 400);
    }
    
    function loadGoogleAnalytics() {

        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-G-29FCKKCGYR'; 
        document.head.appendChild(script1);
        
        script1.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-29FCKKCGYR', { 
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=None;Secure'
            });
            
            console.log('✅ Google Analytics načteno');
        };
    }
})();
// ===== CONSOLE MESSAGE =====
console.log('%c✨ Ahoj! 👋', 'font-size: 24px; font-weight: bold; color: #E7B2C8;');
console.log('%cDíky, že jste tu! Pokud hledáte vývojářku/designérku, napište mi na zaneta.janacova@gmail.com', 'font-size: 14px; color: #6E6A86;');
console.log('%cPS: Zkuste zadat Konami Code... 🎮', 'font-size: 12px; color: #A7C4A0; font-style: italic;');