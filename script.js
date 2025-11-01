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

// ===== MOBILE MENU & SMOOTH SCROLL =====
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
        link.addEventListener('click', (e) => {
            e.preventDefault(); // vždy zastavíme výchozí chování
            e.stopPropagation();
            
            const targetId = link.getAttribute('href');
            console.log('Kliknuto na:', targetId); // DEBUG
            
            const targetEl = document.querySelector(targetId);
            console.log('Nalezený element:', targetEl); // DEBUG

            // Zavřít menu HNED
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');

            // Scroll s malým zpožděním (aby se menu stihlo zavřít)
            setTimeout(() => {
                if (targetEl) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetEl.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn('Element nenalezen:', targetId);
                }
            }, 100);
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
const scrollThreshold = 200; // od kdy začne header reagovat
const scrollTolerance = 50;  // minimální rozdíl scrollu, aby se header měnil

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Přidání nebo odstranění scrolled třídy
    if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Schování / zobrazení podle směru scrollu jen při větším rozdílu
    if (currentScroll - lastScroll > scrollTolerance && currentScroll > scrollThreshold) {
        // scroll dolů → schovej header
        header.classList.add('hidden');
    } else if (lastScroll - currentScroll > scrollTolerance) {
        // scroll nahoru → zobraz header
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
const sparkleButtons = document.querySelectorAll('.btn-primary'); // všechna tlačítka

const sparkleColors = [
    'radial-gradient(circle, #a8def0 0%, #fbc4d4 50%, #d9b3ff 80%)',
    'radial-gradient(circle, #a8e6cf 0%, #d0f0fd 50%, transparent 80%)',
    'radial-gradient(circle, #fff4e1 0%, #ffd6d6 50%, #fefefe 80%)'
];

sparkleButtons.forEach(btn => {
    // Sparkle na mousemove (desktop)
    btn.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) {  
            createSparkleOnButton(btn, e.clientX, e.clientY);
        }
    });

    // Touch verze (mobil) - BEZ preventDefault
    btn.addEventListener('touchmove', (e) => {
        if (Math.random() > 0.8) { // menší frekvence na mobilu
            const touch = e.touches[0];
            createSparkleOnButton(btn, touch.clientX, touch.clientY);
        }
    }, { passive: true }); // passive = neblokuje scroll
});

// Pomocná funkce pro vytvoření sparkle
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
if (window.innerWidth <= 768) { // jen mobil / tablety
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const overlay = card.querySelector('.project-overlay');
            if (!overlay) return;

            // toggle třídu "visible" pro fade-in / fade-out
            overlay.classList.toggle('visible');
        });
    });
}

// ===== HERO SPARKLE EFFECT =====
const heroTitle = document.querySelector('.sparkle-text');

if (heroTitle) {
    // Desktop - sparkle při pohybu myši
    heroTitle.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) createSparkle(e.clientX, e.clientY);
    });

    // Mobil/Tablet - sparkle při podržení a pohybu prstu
    if (window.innerWidth <= 768) {
        heroTitle.addEventListener('touchmove', (e) => {
            if (Math.random() > 0.6) { // trochu častěji než na desktopu
                const touch = e.touches[0];
                createSparkle(touch.clientX, touch.clientY);
            }
        }, { passive: true }); // neblokuje scroll

        // Bonus: sparkle i při touchstart (první dotek)
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
    
    // Spustit po načtení stránky s malým zpožděním
    setTimeout(typeChar, 500);
}

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projects.forEach(project => {
                const category = project.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    project.style.display = 'block';
                    // Trigger reflow for animation
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

// ===== RIPPLE EFFECT =====
document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Pokud je tlačítko typu submit uvnitř formu, necháme submit proběhnout
        if (this.type !== 'submit') e.preventDefault();

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

        // Po animaci odstraň ripple
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});



// ===== INTERSECTION OBSERVER FOR FADE-IN =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Odpojit po animaci (performance)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe všechny fade-in elementy
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===== HELPER FUNCTIONS (musí být PRVNÍ) =====
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;
    
    const existingError = formGroup.querySelector('.error-msg');
    if (existingError) {
        existingError.remove();
    }
    
    formGroup.classList.remove('error', 'success');
    
    // Checkbox
    if (field.type === 'checkbox') {
        if (!field.checked && field.required) {
            formGroup.classList.add('error');
            showErrorMessage(formGroup, 'Toto pole je povinné');
            return false;
        }
        formGroup.classList.add('success');
        return true;
    }
    
    // Required
    if (field.required && !field.value.trim()) {
        formGroup.classList.add('error');
        showErrorMessage(formGroup, 'Toto pole je povinné');
        return false;
    }
    
    // Email
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

// ===== FORM VALIDATION ONLY (Netlify zpracuje odeslání) =====
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input:not([type="hidden"]):not([name="bot-field"]), textarea');
    
    // Real-time validace při opuštění pole
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
    
    // Před odesláním zkontrolujeme validaci
    contactForm.addEventListener('submit', (e) => {
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        // Pouze pokud validace SELHALA, zastavíme odeslání
        if (!isValid) {
            e.preventDefault();
            
            // Scroll na první chybu
            const firstError = contactForm.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            return false;
        }
        
        // Pokud validace PROŠLA, necháme formulář NORMÁLNĚ odeslat
        // NEPOUŽÍVÁME e.preventDefault() ani fetch()
        // Netlify automaticky zachytí díky data-netlify="true"
        
        console.log('Formulář se odesílá...');
    });
}

// ===== PARALLAX EFFECT (Optional - pouze pro desktop) =====
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

// ===== LAZY LOADING IMAGES =====
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback pro starší prohlížeče
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===== PERFORMANCE MONITORING (Dev only) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Čas načtení stránky: ${pageLoadTime}ms`);
        }
    });
}
// ===== FOOTER SPARKLE EFFECT =====
const footer = document.querySelector('footer');

if (footer) {
    // Desktop - sparkle při pohybu myši
    footer.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.85) { // méně často než u hero
            createFooterSparkle(e.clientX, e.clientY);
        }
    });

    // Mobil/Tablet - sparkle při pohybu prstu
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

// ===== CONSOLE MESSAGE =====
console.log('%c✨ Ahoj! 👋', 'font-size: 24px; font-weight: bold; color: #E7B2C8;');
console.log('%cDíky, že jste tu! Pokud hledáte vývojářku/designérku, napište mi na zaneta.janacova@gmail.com', 'font-size: 14px; color: #6E6A86;');
console.log('%cPS: Zkuste zadat Konami Code... 🎮', 'font-size: 12px; color: #A7C4A0; font-style: italic;');