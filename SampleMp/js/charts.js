// Initialize all charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWorkoutChart();
    initializeActivityChart();
    initializeWeightChart();
    initializeMeasurementsChart();
    initializeStrengthChart();
});

// Workout Progress Chart
function initializeWorkoutChart() {
    const ctx = document.getElementById('workoutChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Workout Duration (hours)',
                data: [1.5, 2, 1.8, 2.2, 1.5, 2.5, 1.2],
                borderColor: '#ff5722',
                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                }
            }
        }
    });
}

// Activity Distribution Chart
function initializeActivityChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cardio', 'Strength', 'Yoga', 'HIIT'],
            datasets: [{
                data: [30, 40, 20, 10],
                backgroundColor: [
                    '#ff5722',
                    '#2196f3',
                    '#9c27b0',
                    '#4caf50'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0a0',
                        padding: 20
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Weight Progress Chart
function initializeWeightChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Weight (kg)',
                data: [75, 74.5, 74, 73.5, 73, 72.5],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                }
            }
        }
    });
}

// Body Measurements Chart
function initializeMeasurementsChart() {
    const ctx = document.getElementById('measurementsChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Chest', 'Waist', 'Hips', 'Arms', 'Thighs'],
            datasets: [{
                label: 'Current',
                data: [95, 80, 90, 35, 55],
                borderColor: '#ff5722',
                backgroundColor: 'rgba(255, 87, 34, 0.2)',
                pointBackgroundColor: '#ff5722'
            }, {
                label: 'Target',
                data: [100, 75, 85, 40, 60],
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                pointBackgroundColor: '#2196f3'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a0a0'
                    }
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#a0a0a0'
                    },
                    ticks: {
                        color: '#a0a0a0',
                        backdropColor: 'transparent'
                    }
                }
            }
        }
    });
}

// Strength Progress Chart
function initializeStrengthChart() {
    const ctx = document.getElementById('strengthChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press'],
            datasets: [{
                label: 'Current Max (kg)',
                data: [80, 120, 150, 60],
                backgroundColor: '#ff5722'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                }
            }
        }
    });
}