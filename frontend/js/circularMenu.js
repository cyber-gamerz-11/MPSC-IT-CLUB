// Circular Menu Logic for MPSC IT CLUB

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const circularMenu = document.getElementById('circular-menu');
    const menuItems = circularMenu.querySelectorAll('li');
    let isMenuOpen = false;
    let rotation = 0;

    // 1. Toggle Menu
    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            animateMenuItemsIn();
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    function animateMenuItemsIn() {
        gsap.from(menuItems, {
            x: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
    }

    // 2. Rotate Menu on Scroll
    window.addEventListener('wheel', (e) => {
        if (isMenuOpen) {
            rotation += e.deltaY * 0.1;
            gsap.to(circularMenu, {
                rotate: rotation,
                duration: 0.5,
                ease: "power2.out"
            });

            // Keep links upright
            menuItems.forEach((li, index) => {
                const link = li.querySelector('a');
                gsap.to(link, {
                    rotate: -rotation - (360 / 8 * index),
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        }
    });

    // 3. Mobile Interaction (Swipe/Touch)
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
        if (isMenuOpen) {
            const touchEndY = e.touches[0].clientY;
            const diff = touchStartY - touchEndY;
            rotation += diff * 0.2;
            
            gsap.to(circularMenu, {
                rotate: rotation,
                duration: 0.3
            });

            menuItems.forEach((li, index) => {
                const link = li.querySelector('a');
                gsap.to(link, {
                    rotate: -rotation - (360 / 8 * index),
                    duration: 0.3
                });
            });

            touchStartY = touchEndY;
        }
    });

    // 4. Close Menu on link click
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
});
