// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Update user info in dashboard
    const userEmail = localStorage.getItem('userEmail');
    const userNameElement = document.querySelector('.user-profile span');
    if (userNameElement && userEmail) {
        userNameElement.textContent = userEmail;
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Get the chart canvas
const ctx = document.getElementById('workoutChart').getContext('2d');

// Chart data
const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Workout Duration (minutes)',
        data: [45, 60, 75, 50, 90, 65, 80],
        backgroundColor: 'rgba(255, 87, 34, 0.2)',
        borderColor: '#ff5722',
        borderWidth: 2,
        tension: 0.4,
        fill: true
    }]
};

// Chart configuration
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#ffffff'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#cccccc'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#cccccc'
                }
            }
        }
    }
};

// Create the chart
new Chart(ctx, config);

// Add hover effect to stat cards
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add logout functionality
const userProfile = document.querySelector('.user-profile');
if (userProfile) {
    userProfile.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });
} 