// Gestion du menu mobile
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
const body = document.body;

menuToggle.addEventListener('click', function() {
    navbar.classList.toggle('active');
    menuToggle.classList.toggle('active');
    body.classList.toggle('menu-open');
});

// Fermer le menu en cliquant sur un lien
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function() {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Fermer le menu en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    if (!navbar.contains(event.target) && !menuToggle.contains(event.target) && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Gestion du défilement pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});