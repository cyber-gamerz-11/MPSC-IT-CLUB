// Auth JS for MPSC IT CLUB

document.addEventListener('DOMContentLoaded', () => {
    // Signup Logic
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signupForm);
            
            try {
                const response = await fetch('/auth/signup', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                if (response.ok) {
                    alert('Signup successful! Member ID: ' + data.member_id);
                    window.location.href = '/login.html';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            }
        });
    }

    // Login Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            
            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                if (response.ok) {
                    window.location.href = '/dashboard.html';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            }
        });
    }
});
