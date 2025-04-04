// Au début du fichier
gsap.registerPlugin(ScrollTrigger);

// Animation du texte avec effet de révélation
const revealText = () => {
    const textElements = document.querySelectorAll('.reveal-text');
    
    textElements.forEach(element => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
    });
};

// Animation des cartes de projets avec effet de perspective (uniquement sur desktop)
const animateProjectCards = () => {
    if (window.innerWidth <= 768) return; // Désactiver sur mobile
    
    const cards = document.querySelectorAll('.bix-project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30; // Réduit l'intensité
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
};

// Animation des services avec effet de flottement (uniquement sur desktop)
const floatServices = () => {
    if (window.innerWidth <= 768) return; // Désactiver sur mobile
    
    const services = document.querySelectorAll('.bix-services');
    
    services.forEach(service => {
        service.addEventListener('mouseenter', () => {
            service.style.transform = 'translateY(-5px)'; // Réduit l'amplitude
            service.style.transition = 'transform 0.3s ease';
        });
        
        service.addEventListener('mouseleave', () => {
            service.style.transform = 'translateY(0)';
        });
    });
};

// Animation du loader avec effet de pulsation
const animateLoader = () => {
    const loader = document.querySelector('.bix-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
};

// Animation du scroll avec effet de parallaxe (uniquement sur desktop)
const parallaxScroll = () => {
    if (window.innerWidth <= 768) return; // Désactiver sur mobile
    
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
};

// Animation des liens avec effet de soulignement
const animateLinks = () => {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.position = 'relative';
            link.style.overflow = 'hidden';
            
            const underline = document.createElement('span');
            underline.style.position = 'absolute';
            underline.style.bottom = '0';
            underline.style.left = '0';
            underline.style.width = '100%';
            underline.style.height = '2px';
            underline.style.backgroundColor = '#f41a4a';
            underline.style.transform = 'translateX(-100%)';
            underline.style.transition = 'transform 0.3s ease';
            
            link.appendChild(underline);
            setTimeout(() => {
                underline.style.transform = 'translateX(0)';
            }, 10);
        });
        
        link.addEventListener('mouseleave', () => {
            const underline = link.querySelector('span');
            if (underline) {
                underline.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    underline.remove();
                }, 300);
            }
        });
    });
};

// Animation créative de la section hero (uniquement sur desktop)
const animateHero = () => {
    if (window.innerWidth <= 768) return; // Désactiver sur mobile

    // Animation de l'image avec effet de distorsion
    const heroImage = document.querySelector('.hero-parallax');
    if (heroImage) {
        heroImage.addEventListener('mousemove', (e) => {
            const rect = heroImage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30; // Réduit l'intensité
            const rotateY = (centerX - x) / 30;
            
            heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        heroImage.addEventListener('mouseleave', () => {
            heroImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // Animation des noms en arrière-plan
    const firstName = document.querySelector('.first-name');
    const lastName = document.querySelector('.last-name');
    
    if (firstName && lastName) {
        let angle = 0;
        setInterval(() => {
            angle += 0.3; // Réduit la vitesse
            firstName.style.transform = `translateY(${Math.sin(angle) * 10}px) rotate(${Math.sin(angle) * 1}deg)`;
            lastName.style.transform = `translateY(${Math.cos(angle) * 10}px) rotate(${Math.cos(angle) * 1}deg)`;
        }, 50);
    }
};

// Initialisation des animations
document.addEventListener('DOMContentLoaded', () => {
    revealText();
    animateProjectCards();
    floatServices();
    animateLoader();
    parallaxScroll();
    animateLinks();
    animateHero();

    // Animation d'entrée pour le titre
    gsap.from('.title', {
        duration: 0.8, // Réduit la durée
        y: -50, // Réduit l'amplitude
        opacity: 0,
        ease: 'power2.out'
    });

    // Animation pour les éléments au scroll
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8, // Réduit la durée
            y: 30, // Réduit l'amplitude
            opacity: 0,
            ease: 'power2.out'
        });
    });

    // Animation au survol des boutons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});

// Menu mobile animations
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');

    if (mobileMenuButton && mobileMenu) {
        let isOpen = false;

        // Positionner les lignes du hamburger
        hamburgerLines[0].style.top = '25%';
        hamburgerLines[1].style.top = '50%';
        hamburgerLines[2].style.top = '75%';

        mobileMenuButton.addEventListener('click', function() {
            isOpen = !isOpen;
            
            // Animer les lignes du hamburger
            if (isOpen) {
                hamburgerLines[0].style.top = '50%';
                hamburgerLines[0].style.transform = 'rotate(45deg)';
                hamburgerLines[1].style.opacity = '0';
                hamburgerLines[2].style.top = '50%';
                hamburgerLines[2].style.transform = 'rotate(-45deg)';
                
                mobileMenu.classList.remove('hidden');
                // Petit délai pour permettre l'animation
                setTimeout(() => {
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.transform = 'translateY(0)';
                }, 10);
            } else {
                hamburgerLines[0].style.top = '25%';
                hamburgerLines[0].style.transform = 'rotate(0)';
                hamburgerLines[1].style.opacity = '1';
                hamburgerLines[2].style.top = '75%';
                hamburgerLines[2].style.transform = 'rotate(0)';
                
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                // Attendre la fin de l'animation avant de cacher
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }
        });

        // Fermer le menu mobile lors d'un clic à l'extérieur
        document.addEventListener('click', function(event) {
            if (isOpen && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenuButton.click();
            }
        });
    }
});

// Ajouter une classe active à la navbar lors du scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
}); 