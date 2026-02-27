// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic
    const preloader = document.querySelector('.preloader');
    const loaderBar = document.querySelector('.loader-bar');

    if (preloader && loaderBar) {
        // Simple loader bar animation
        gsap.to(loaderBar, {
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to(preloader, {
                    opacity: 0,
                    visibility: 'hidden',
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    }

    // 0.1 Tech Doodle Animation
    const doodleContainer = document.getElementById('doodle-container');
    if (doodleContainer) {
        const symbols = ['{ }', '< >', '[ ]', '/', '*', '&&', '||', '!', '?', '~', '=>', '()', '01'];
        const symbolCount = 30;

        for (let i = 0; i < symbolCount; i++) {
            const doodle = document.createElement('div');
            doodle.classList.add('tech-doodle');
            doodle.innerText = symbols[Math.floor(Math.random() * symbols.length)];

            // Random positions
            doodle.style.left = Math.random() * 100 + '%';
            doodle.style.top = Math.random() * 100 + '%';

            // Random moves
            const moveX = (Math.random() - 0.5) * 400 + 'px';
            const moveY = (Math.random() - 0.5) * 400 + 'px';
            doodle.style.setProperty('--move-x', moveX);
            doodle.style.setProperty('--move-y', moveY);

            // Random animation params
            doodle.style.animationDuration = 5 + Math.random() * 15 + 's';
            doodle.style.animationDelay = -Math.random() * 20 + 's';
            doodle.style.fontSize = 0.5 + Math.random() * 1.5 + 'rem';

            doodleContainer.appendChild(doodle);
        }
    }

    // 1. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .course-card').forEach(item => {
            item.addEventListener('mouseenter', () => cursor.classList.add('active'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }



    // 5. Innovation Hub Split/Join Animation
    const sliceContainer = document.querySelector('.slice-container');
    if (sliceContainer) {
        const imageUrl = sliceContainer.getAttribute('data-image');
        const sliceCount = 8;

        for (let i = 0; i < sliceCount; i++) {
            const slice = document.createElement('div');
            slice.classList.add('slice-part');
            slice.style.width = `${100 / sliceCount}%`;
            slice.style.left = `${(100 / sliceCount) * i}%`;
            slice.style.backgroundImage = `url(${imageUrl})`;
            slice.style.backgroundPosition = `${(100 / (sliceCount - 1)) * i}% center`;
            slice.style.backgroundSize = `${sliceCount * 100}% 100%`;
            sliceContainer.appendChild(slice);
        }

        ScrollTrigger.create({
            trigger: '#slice-trigger',
            start: 'top 70%',
            onEnter: () => sliceContainer.classList.add('joined'),
            markers: false
        });
    }

    // 6. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 7. Achievement Cards Floating & Hover Physics
    const achievementCards = document.querySelectorAll('.achievement-card');
    const achievementGrid = document.querySelector('.achievements-grid');

    if (achievementCards.length > 0) {
        // Floating Sine Wave Animation
        achievementCards.forEach((card, index) => {
            gsap.to(card, {
                y: '+=20',
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: Math.random() * 2
            });

            // Hover: Other cards drift away
            card.addEventListener('mouseenter', () => {
                achievementGrid.classList.add('has-hover');
                achievementCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const rect = card.getBoundingClientRect();
                        const otherRect = otherCard.getBoundingClientRect();

                        // Calculate vector away from hovered card
                        const dx = otherRect.left - rect.left;
                        const dy = otherRect.top - rect.top;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        const driftX = (dx / distance) * 30;
                        const driftY = (dy / distance) * 30;

                        gsap.to(otherCard, {
                            x: driftX,
                            y: driftY,
                            duration: 0.8,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                achievementGrid.classList.remove('has-hover');
                achievementCards.forEach(otherCard => {
                    gsap.to(otherCard, {
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                });
            });
        });
    }

    // Update cursor targets for new cards
    document.querySelectorAll('.achievement-card, .btn-link').forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('active'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // 8. Navigation Active State & ScrollSpy
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

    function updateActiveLink() {
        if (!isHomePage) return; // Only ScrollSpy on home page

        let current = "";
        const scrollPos = window.scrollY + 150;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${current}` || href === `index.html#${current}`) {
                link.classList.add("active");
            }
        });
    }

    if (isHomePage) {
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink(); // Initial check
    }

    // Smooth Scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#') && isHomePage) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetElement.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Mobile menu close if exists
                    const navLinksContainer = document.querySelector('.nav-links');
                    if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                        navLinksContainer.classList.remove('active');
                        const menuToggle = document.querySelector('.menu-toggle');
                        const icon = menuToggle.querySelector('i');
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            }
        });
    });

    // 9. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
});

