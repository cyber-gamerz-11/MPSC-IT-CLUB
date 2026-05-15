// Main JS for MPSC IT CLUB

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Logic - Fixed duration for premium experience
    const loader = document.getElementById('loader');
    const minLoaderTime = 2000; // 2 seconds minimum
    const startTime = Date.now();
    
    const hideLoader = () => {
        if (!loader) return;
        
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;
        const remainingTime = Math.max(0, minLoaderTime - timeElapsed);

        setTimeout(() => {
            if (window.gsap) {
                gsap.to(loader, {
                    opacity: 0,
                    scale: 1.1,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        loader.style.display = 'none';
                        initAnimations(); 
                    }
                });
            } else {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    initAnimations();
                }, 1000);
            }
        }, remainingTime);
    };

    // Initialize loader hide logic
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 6000); // Fallback
    }

    // 2. Cursor Glow
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow && window.gsap) {
            gsap.to(cursorGlow, {
                left: e.clientX,
                top: e.clientY,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });

    // 3. Navbar Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
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

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                // Fetch live stats from the database
                try {
                    const res = await fetch('/user/public_stats');
                    const data = await res.json();
                    
                    if(document.getElementById('stat-members')) document.getElementById('stat-members').setAttribute('data-target', data.members || 0);
                    if(document.getElementById('stat-events')) document.getElementById('stat-events').setAttribute('data-target', data.events || 0);
                    if(document.getElementById('stat-projects')) document.getElementById('stat-projects').setAttribute('data-target', data.projects || 0);
                    if(document.getElementById('stat-ec')) document.getElementById('stat-ec').setAttribute('data-target', data.ec || 0);
                } catch (err) {
                    console.error("Failed to load live stats:", err);
                }

                animateStats();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // 7. Toast System
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    window.showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '✅' : '❌';
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('active'), 10);
        
        // Remove after 4s
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 600);
        }, 4000);
    };
});

function initAnimations() {
    if (!window.gsap) return;

    // 5. Hero Typing Animation
    if (document.getElementById('hero-typing') && gsap.plugins.text) {
        const typingTimeline = gsap.timeline({ repeat: -1 });
        typingTimeline
            .to("#hero-typing", { duration: 2, text: "Innovating Future Minds", ease: "none" })
            .to("#hero-typing", { duration: 1, delay: 2, text: "", ease: "none" })
            .to("#hero-typing", { duration: 2, text: "Welcome to MPSC IT CLUB", ease: "none" })
            .to("#hero-typing", { duration: 1, delay: 2, text: "", ease: "none" });
    }

    // 6. Hero Content Entrance
    gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, delay: 0.2 });
    gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, delay: 0.4 });
    gsap.from(".hero-btns", { y: 20, opacity: 0, duration: 1, delay: 0.6 });
}
