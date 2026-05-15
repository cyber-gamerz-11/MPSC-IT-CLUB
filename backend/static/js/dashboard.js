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
            window.location.href = '/auth/login';
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
    const userNameElem = document.getElementById('user-name');
    if (userNameElem) userNameElem.innerText = user.full_name;
    
    // Sidebar
    const displayNameElem = document.getElementById('display-name');
    const displayIdElem = document.getElementById('display-id');
    const displayPicElem = document.getElementById('display-profile-pic');
    
    if (displayNameElem) displayNameElem.innerText = user.full_name;
    if (displayIdElem) displayIdElem.innerText = user.member_id;
    if (user.profile_pic && displayPicElem) {
        displayPicElem.src = user.profile_pic;
    }

    // Overview
    const welcomeNameElem = document.getElementById('welcome-name');
    if (welcomeNameElem) welcomeNameElem.innerText = user.full_name;

    // ID Card
    const idNameElem = document.getElementById('id-name');
    const idNumberElem = document.getElementById('id-number');
    const idDateElem = document.getElementById('id-date');
    const idQrImgElem = document.getElementById('id-qr-img');
    
    if (idNameElem) idNameElem.innerText = user.full_name;
    if (idNumberElem) idNumberElem.innerText = user.member_id;
    if (idDateElem) idDateElem.innerText = user.join_date;
    
    if (idQrImgElem) {
        idQrImgElem.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.member_id}`;
    }
}
