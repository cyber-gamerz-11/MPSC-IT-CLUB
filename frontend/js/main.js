// Main JS for MPSC IT CLUB

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Logic
    const loader = document.getElementById('loader');
    const loaderStatus = document.getElementById('loader-status');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            gsap.to(loader, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    loader.style.display = 'none';
                    initAnimations(); // Start other animations after loader
                }
            });
        }, 1500);
    });

    // 2. Cursor Glow
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
            left: e.clientX,
            top: e.clientY,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    // 3. Navbar Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 4. Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const count = +stat.innerText;
            const speed = 200;
            const inc = target / speed;

            if (count < target) {
                stat.innerText = Math.ceil(count + inc);
                setTimeout(animateStats, 10);
            } else {
                stat.innerText = target;
            }
        });
    };

    // Intersection Observer for Stats
    const statsSection = document.getElementById('stats');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateStats();
            observer.unobserve(statsSection);
        }
    }, { threshold: 0.5 });

    if (statsSection) observer.observe(statsSection);
});

function initAnimations() {
    // 5. Hero Typing Animation
    gsap.registerPlugin(TextPlugin);
    
    const typingTimeline = gsap.timeline({ repeat: -1 });
    typingTimeline
        .to("#hero-typing", { duration: 2, text: "Innovating Future Minds", ease: "none" })
        .to("#hero-typing", { duration: 1, delay: 2, text: "", ease: "none" })
        .to("#hero-typing", { duration: 2, text: "Welcome to MPSC IT CLUB", ease: "none" })
        .to("#hero-typing", { duration: 1, delay: 2, text: "", ease: "none" });

    // 6. Hero Content Entrance
    gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, delay: 0.8 });
    gsap.from(".hero-btns", { y: 20, opacity: 0, duration: 1, delay: 1.1 });
}
