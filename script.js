document.addEventListener('DOMContentLoaded', () => {
    // -------------------------
    // Preloader Dismissal
    // -------------------------
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            // Allow body overflow once loaded
            document.body.style.overflow = 'auto';
        }
    });

    // Disable scroll during loading
    document.body.style.overflow = 'hidden';

    // -------------------------
    // Particle Background
    // -------------------------
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(37, 99, 235, ${this.alpha})`;
                ctx.fill();
            }
        }

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // -------------------------
    // Scroll Progress Bar
    // -------------------------
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // -------------------------
    // Project Filtering
    // -------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // -------------------------
    // 3D Tilt Effect
    // -------------------------
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // -------------------------
    // Back to Top
    // -------------------------
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

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
    // Stats Counter Animation
    // -------------------------
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const isDecimal = el.getAttribute('data-decimal') === 'true';
        const duration = 2000;
        const start = 0;
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            let current = progress * (target - start) + start;
            
            if (isDecimal) {
                el.innerText = current.toFixed(1);
            } else {
                el.innerText = Math.floor(current);
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.innerText = isDecimal ? target.toFixed(1) : target;
            }
        };

        window.requestAnimationFrame(step);
    };

    // -------------------------
    // Reveal Animations (Intersection Observer)
    // -------------------------
    const revealElements = document.querySelectorAll('.fade-up, .fade-in, .stat-number, .progress');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            } else if (entry.target.classList.contains('progress')) {
                const targetWidth = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = targetWidth;
                }, 100);
            } else {
                entry.target.classList.add('visible');
            }
            observer.unobserve(entry.target);
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