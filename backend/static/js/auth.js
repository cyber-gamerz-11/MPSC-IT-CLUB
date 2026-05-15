// Auth JS for MPSC IT CLUB

document.addEventListener('DOMContentLoaded', () => {
    
    const setButtonLoading = (btn, isLoading, originalText) => {
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner"></span>Processing...`;
        } else {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    };
    
    // Signup Logic
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const btn = signupForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setButtonLoading(btn, true, originalText);
            const formData = new FormData(signupForm);
            
            try {
                const response = await fetch('/auth/signup', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                if (response.ok) {
                    window.showToast('Signup successful! Welcome to the club.', 'success');
                    setTimeout(() => {
                        window.location.href = '/auth/login';
                    }, 2000);
                } else {
                    window.showToast(data.error, 'error');
                    setButtonLoading(btn, false, originalText);
                }
            } catch (err) {
                console.error(err);
                window.showToast('Connection failed. Try again.', 'error');
                setButtonLoading(btn, false, originalText);
            }
        });
    }

    // Login Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const btn = loginForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setButtonLoading(btn, true, originalText);
            const formData = new FormData(loginForm);
            
            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                if (response.ok) {
                    window.showToast('Access Granted. Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/user/dashboard';
                    }, 1500);
                } else {
                    window.showToast(data.error, 'error');
                    setButtonLoading(btn, false, originalText);
                }
            } catch (err) {
                console.error(err);
                window.showToast('Login failed. Try again.', 'error');
                setButtonLoading(btn, false, originalText);
            }
        });
    }

    // Forgot Password Logic
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        const btn = forgotForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setButtonLoading(btn, true, originalText);
            const formData = new FormData(forgotForm);

            try {
                const response = await fetch('/auth/forgot-password', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    window.showToast('Reset link sent to your email!', 'success');
                    forgotForm.reset();
                } else {
                    window.showToast(data.error, 'error');
                }
            } catch (err) {
                window.showToast('Failed to send email.', 'error');
            } finally {
                setButtonLoading(btn, false, originalText);
            }
        });
    }
});
