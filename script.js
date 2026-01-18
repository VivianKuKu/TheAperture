document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on refresh
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
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
});
