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

    // Hero rotating word
    const rotater = document.getElementById('rotating-text');
    if (rotater) {
        const terms = ['AI', 'Community', 'Data', 'Purpose'];
        let termIndex = 0;

        const rotateText = () => {
            rotater.classList.add('fade-out');

            setTimeout(() => {
                termIndex = (termIndex + 1) % terms.length;
                rotater.textContent = terms[termIndex];
                rotater.classList.remove('fade-out');
                rotater.classList.add('fade-in');

                setTimeout(() => {
                    rotater.classList.remove('fade-in');
                }, 500);
            }, 500);
        };

        setTimeout(() => {
            rotateText();
            setInterval(rotateText, 3000);
        }, 1000);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items (single-open accordion)
            faqItems.forEach((i) => {
                i.classList.remove('active');
                const b = i.querySelector('.faq-question');
                if (b) b.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked item open unless it was already open
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard: Enter / Space already handled by button element natively
    });

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
    // Triggers when section comes into view, resets when out of view
    const swipeHints = document.querySelectorAll('.swipe-hint');
    if (swipeHints.length > 0) {
        const hintObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const hint = entry.target;
                if (entry.isIntersecting) {
                    // Slight delay to ensure it doesn't trigger if just scrolling past quickly
                    hint.classList.add('animate-swipe');
                } else {
                    // Reset animation when scrolling away so it can play again if revisited
                    hint.classList.remove('animate-swipe');
                }
            });
        }, { threshold: 0.2 }); // Lower threshold to ensure it catches

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
                ? 'Hide Past Events <span>↑</span>'
                : 'View Past Events <span>↓</span>';
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

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    const momentCards = Array.from(document.querySelectorAll('.moment-card'));
    let activeIndex = -1;

    if (lightbox && momentCards.length > 0) {
        const updateLightbox = (index) => {
            if (index < 0 || index >= momentCards.length) return;
            activeIndex = index;
            const card = momentCards[activeIndex];
            const src = card.getAttribute('data-src');
            const caption = card.getAttribute('data-caption');
            const desc = card.getAttribute('data-desc');

            lightboxImg.src = src;
            lightboxImg.alt = caption;
            lightboxTitle.textContent = caption;
            lightboxDesc.textContent = desc;
        };

        const openLightbox = (index) => {
            updateLightbox(index);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent page scroll
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore page scroll
            setTimeout(() => {
                lightboxImg.src = ''; // Clear image to save resources
            }, 300);
        };

        const showNext = () => {
            let nextIndex = (activeIndex + 1) % momentCards.length;
            updateLightbox(nextIndex);
        };

        const showPrev = () => {
            let prevIndex = (activeIndex - 1 + momentCards.length) % momentCards.length;
            updateLightbox(prevIndex);
        };

        // Attach click events to moment cards
        momentCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                openLightbox(index);
            });
        });

        // Close events
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            // Close lightbox if clicking outside the content area or on buttons
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navigation events
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showNext();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrev();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            }
        });

        // Touch Swipe support for Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50; // minimum distance in px
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swiped Left -> Show Next
                showNext();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swiped Right -> Show Prev
                showPrev();
            }
        };
    }
});
