// Dashboard JS for MPSC IT CLUB

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch User Data
    try {
        const response = await fetch('/user/profile_data');
        if (response.ok) {
            const user = await response.json();
            updateDashboard(user);
        } else {
            // Not logged in or error
            window.location.href = '/login.html';
        }
    } catch (err) {
        console.error('Error fetching profile:', err);
    }

    // 2. Sidebar Navigation Switching
    const navLinks = document.querySelectorAll('.sidebar-nav li a');
    const sections = document.querySelectorAll('.dash-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update Active Link
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');

            // Show Target Section
            sections.forEach(section => {
                if (section.id === `${targetId}-section`) {
                    section.style.display = 'block';
                    gsap.from(section, { opacity: 0, y: 20, duration: 0.5 });
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});

function updateDashboard(user) {
    // Top Nav
    document.getElementById('user-name').innerText = user.full_name;
    
    // Sidebar
    document.getElementById('display-name').innerText = user.full_name;
    document.getElementById('display-id').innerText = user.member_id;
    if (user.profile_pic) {
        document.getElementById('display-profile-pic').src = user.profile_pic;
    }

    // Overview
    document.getElementById('welcome-name').innerText = user.full_name;

    // ID Card
    document.getElementById('id-name').innerText = user.full_name;
    document.getElementById('id-number').innerText = user.member_id;
    document.getElementById('id-date').innerText = user.join_date;
    
    // QR Code (Generate URL or fetch from backend)
    // For now, using a placeholder or dynamic service
    const qrImg = document.getElementById('id-qr-img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.member_id}`;
}
