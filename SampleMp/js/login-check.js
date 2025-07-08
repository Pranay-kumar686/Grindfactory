// Check if user is already logged in when visiting login page
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        window.location.href = 'dashboard.html';
    }
}); 