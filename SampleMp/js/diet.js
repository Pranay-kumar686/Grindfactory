document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const date = new Date();
    document.getElementById('currentDate').textContent = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Diet plan selection functionality
    const dietPlanSelect = document.getElementById('dietPlanSelect');
    const dietPlans = document.querySelectorAll('.diet-plan');
    
    // Show the default selected diet plan
    showSelectedDietPlan();
    
    // Add event listener for diet plan selection
    dietPlanSelect.addEventListener('change', showSelectedDietPlan);
    
    function showSelectedDietPlan() {
        // Hide all diet plans
        dietPlans.forEach(plan => {
            plan.classList.remove('active');
        });
        
        // Show the selected diet plan
        const selectedPlan = document.getElementById(dietPlanSelect.value);
        if (selectedPlan) {
            selectedPlan.classList.add('active');
        }
    }
    
    // Calculate BMR and calorie needs based on user data
    // This would be connected to user profile data in a real application
    function calculateCalorieNeeds(gender, weight, height, age, activityLevel, goal) {
        // BMR calculation using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Activity multiplier
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };
        
        // Calculate TDEE (Total Daily Energy Expenditure)
        const tdee = bmr * activityMultipliers[activityLevel];
        
        // Adjust based on goal
        let calorieNeeds;
        switch(goal) {
            case 'weight-loss':
                calorieNeeds = tdee - 500; // 500 calorie deficit
                break;
            case 'weight-gain':
                calorieNeeds = tdee + 500; // 500 calorie surplus
                break;
            case 'bulking':
                calorieNeeds = tdee + 700; // 700 calorie surplus
                break;
            case 'cutting':
                calorieNeeds = tdee - 700; // 700 calorie deficit
                break;
            default: // maintenance
                calorieNeeds = tdee;
        }
        
        return Math.round(calorieNeeds);
    }
    
    // Example usage (would be connected to user profile in real app)
    // const userCalories = calculateCalorieNeeds('male', 75, 180, 30, 'moderate', 'weight-gain');
    // console.log('Recommended daily calories:', userCalories);
});

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}