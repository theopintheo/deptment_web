document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .course-card').forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('active'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // 1.1 Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';

                // Set link colors to be visible on white bg
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.style.color = '#333';
                    link.style.margin = '10px 0';
                });
            }
        });
    }

    // 2. Preloader
    const preloader = document.querySelector('.preloader');
    const loaderBar = document.querySelector('.loader-bar');

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        loaderBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.style.cursor = 'auto'; // Re-enable default if customized
                // Trigger hero animations after preloader
                startHeroAnimations();
            }, 500);
        }
    }, 100);

    // 3. Navbar Scroll Effect & Active Link Highlighting
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const options = {
        threshold: 0.3,
        rootMargin: "-20% 0px -20% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => sectionObserver.observe(section));

    // 4. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                if (entry.target.classList.contains('counter')) {
                    startCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Hero Text Animations
    function startHeroAnimations() {
        const heroTitle = document.querySelector('.reveal-text');
        const heroP = document.querySelector('.reveal-p');
        const heroBtns = document.querySelector('.reveal-btns');

        setTimeout(() => heroTitle.classList.add('active-reveal'), 200);
        setTimeout(() => heroP.classList.add('active-reveal'), 400);
        setTimeout(() => heroBtns.classList.add('active-reveal'), 600);
    }

    // 6. Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function startCounter(el) {
        const target = +el.getAttribute('data-target');
        let count = 0;
        const speed = target / 100;

        const updateCount = () => {
            count += speed;
            if (count < target) {
                el.innerText = Math.ceil(count);
                setTimeout(updateCount, 20);
            } else {
                const suffix = el.getAttribute('data-suffix') || '';
                el.innerText = target + suffix;
            }
        };
        updateCount();
    }

    // 8. Photo Cut & Join (Slice Animation)
    const sliceContainer = document.querySelector('.slice-container');
    const sliceTrigger = document.querySelector('#slice-trigger');
    const imageSrc = sliceContainer.getAttribute('data-image');
    // Using an available image fallback if the one in attribute is missing
    const realImage = imageSrc || 'college_building_real.png';

    const sliceCount = 5; // Number of slices

    for (let i = 0; i < sliceCount; i++) {
        const slice = document.createElement('div');
        slice.classList.add('slice-part');
        slice.style.width = (100 / sliceCount) + '%';
        slice.style.left = (i * (100 / sliceCount)) + '%';
        slice.style.backgroundImage = `url('${realImage}')`;
        slice.style.backgroundPosition = `-${i * (100 / sliceCount * 5)}% center`; // Adjusting for container width
        // Correction for background position alignment
        const posPercent = (i / (sliceCount - 1)) * 100;
        slice.style.backgroundPosition = `${posPercent}% center`;

        sliceContainer.appendChild(slice);
    }

    const sliceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    sliceContainer.classList.add('joined');
                }, 300);
                sliceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (sliceTrigger) sliceObserver.observe(sliceTrigger);

    // 9. Tech Doodle Animation
    const doodleContainer = document.getElementById('doodle-container');
    const doodleSymbols = ['{ }', '< >', '0 1', '[ ]', '( )', '=>', '/*', '*/', 'git', 'sql', 'php', 'js', 'py', '++', '--'];

    function createDoodle() {
        if (!doodleContainer) return;

        const doodle = document.createElement('div');
        doodle.classList.add('tech-doodle');
        doodle.innerText = doodleSymbols[Math.floor(Math.random() * doodleSymbols.length)];

        // Random starting position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;

        // Random movement vector
        const moveX = (Math.random() - 0.5) * 400 + 'px';
        const moveY = (Math.random() - 0.5) * 400 + 'px';

        // Random size and duration (Increased size for more impact)
        const size = Math.random() * 3 + 2 + 'rem';
        const duration = Math.random() * 15 + 15 + 's';

        doodle.style.left = startX + '%';
        doodle.style.top = startY + '%';
        doodle.style.fontSize = size;
        doodle.style.setProperty('--move-x', moveX);
        doodle.style.setProperty('--move-y', moveY);
        doodle.style.animationDuration = duration;

        doodleContainer.appendChild(doodle);

        // Remove after animation finishes
        setTimeout(() => {
            doodle.remove();
        }, parseFloat(duration) * 1000);
    }

    // Initial batch and continuous generation
    if (doodleContainer) {
        for (let i = 0; i < 20; i++) {
            setTimeout(createDoodle, Math.random() * 5000);
        }
        setInterval(createDoodle, 1500);
    }
});
