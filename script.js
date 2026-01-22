document.addEventListener('DOMContentLoaded', () => {
    // 1. Force scroll to top on refresh and remove hash to prevent jumping
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }

    // Clear hash if present to prevent browser auto-scroll
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }

    // Force top position
    window.scrollTo(0, 0);

    const reveals = document.querySelectorAll('.reveal');

    // Scroll Reveal
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Swipe Hint Trigger (Mobile)
    // Only triggers when the proper section comes into view
    const swipeHints = document.querySelectorAll('.swipe-hint');
    if (swipeHints.length > 0) {
        const hintObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-swipe');
                    // Stop observing once triggered so it doesn't loop annoyance
                    hintObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        swipeHints.forEach(hint => hintObserver.observe(hint));
    }

    // Mouse Parallax for Aperture
    const aperture = document.querySelector('.aperture-graphic');
    document.addEventListener('mousemove', (e) => {
        if (!aperture) return;
        const x = (window.innerWidth - e.pageX) / 50;
        const y = (window.innerHeight - e.pageY) / 50;

        aperture.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
    });

    // Archive Toggle
    const toggleBtn = document.getElementById('toggle-archive');
    const archiveList = document.getElementById('archive-list');

    if (toggleBtn && archiveList) {
        toggleBtn.addEventListener('click', () => {
            archiveList.classList.toggle('show');
            const isShown = archiveList.classList.contains('show');
            const arrow = toggleBtn.querySelector('span');

            toggleBtn.innerHTML = isShown
                ? 'Hide 2025 Events <span>↑</span>'
                : 'View 2025 Events <span>↓</span>';
        });
    }

    // Back to Top & Floating Nav Logic
    const backToTopBtn = document.getElementById('back-to-top');
    const floatingNav = document.querySelector('.floating-header');

    window.addEventListener('scroll', () => {
        // Back to top visibility
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Nav style on scroll
        if (floatingNav) {
            if (window.scrollY > 50) {
                floatingNav.style.background = 'rgba(255, 255, 255, 0.85)';
                floatingNav.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                floatingNav.style.padding = '0.5rem 2rem';
            } else {
                floatingNav.style.background = 'rgba(255, 255, 255, 0.6)';
                floatingNav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
                floatingNav.style.padding = '0.75rem 2rem';
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = floatingNav ? floatingNav.offsetHeight + 40 : 100;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
