document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Clear previous error messages
            if (errorMessage) {
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
            }
            
            // Validate inputs
            if (!email || !password) {
                if (errorMessage) {
                    errorMessage.textContent = 'Please enter both email and password.';
                    errorMessage.style.display = 'block';
                }
                return;
            }
            
            // Send login request to server
            fetch('http://localhost:5500/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Store user info in localStorage
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = data.message || 'Invalid email or password.';
                        errorMessage.style.display = 'block';
                    }
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                if (errorMessage) {
                    errorMessage.textContent = 'An error occurred. Please try again.';
                    errorMessage.style.display = 'block';
                }
            });
        });
    }
});