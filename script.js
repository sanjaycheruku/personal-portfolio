document.addEventListener('DOMContentLoaded', () => {
    // -------------------------
    // Mobile Navigation
    // -------------------------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Hamburger Animation
            const bars = document.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'translateY(3.5px) rotate(45deg)';
                bars[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = document.querySelectorAll('.bar');
            if (bars.length) {
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    });

    // -------------------------
    // Navbar Scroll Effect & Active Links
    // -------------------------
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // -------------------------
    // Smooth Scroll
    // -------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // -------------------------
    // Reveal Animations (Intersection Observer)
    // -------------------------
    const revealElements = document.querySelectorAll('.fade-up, .fade-in');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // -------------------------
    // Custom Cursor
    // -------------------------
    const dot = document.querySelector('[data-cursor-dot]');
    const outline = document.querySelector('[data-cursor-outline]');
    
    // Check if device supports hover before enabling custom cursor
    const hasHover = window.matchMedia('(hover: hover)').matches;

    if (dot && outline && hasHover) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;

            // Outline follows with slight delay
            outline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 250, fill: "forwards" });
        });

        // Interactive states for links & buttons
        const interactables = document.querySelectorAll('a, button, .btn');
        
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                outline.style.width = '60px';
                outline.style.height = '60px';
                outline.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            });
            
            el.addEventListener('mouseleave', () => {
                outline.style.width = '32px';
                outline.style.height = '32px';
                outline.style.backgroundColor = 'transparent';
            });
        });
    } else {
        // If touch device or no hover, hide custom cursor
        if (dot) dot.style.display = 'none';
        if (outline) outline.style.display = 'none';
        document.body.style.cursor = 'auto'; // Reset body cursor
    }
});