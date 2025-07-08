document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('bmiCalculatorModal');
    const openBtn = document.getElementById('openBmiCalc');
    const closeBtn = document.querySelector('.close-modal');
    const calculateBtn = document.getElementById('calculateBmi');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    
    // Open modal
    openBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Calculate BMI
    calculateBtn.addEventListener('click', calculateBMI);
    
    // Allow Enter key to trigger calculation
    weightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBMI();
        }
    });
    
    heightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBMI();
        }
    });
    
    function calculateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert('Please enter valid height and weight values');
            return;
        }
        
        // Convert height from cm to m and calculate BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const roundedBMI = Math.round(bmi * 10) / 10;
        
        // Display BMI value
        bmiValue.textContent = roundedBMI;
        
        // Determine BMI category
        let category;
        let categoryColor;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryColor = '#64b5f6';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal weight';
            categoryColor = '#81c784';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            categoryColor = '#ffd54f';
        } else {
            category = 'Obese';
            categoryColor = '#e57373';
        }
        
        // Display BMI category
        bmiCategory.textContent = category;
        bmiCategory.style.color = categoryColor;
    }
});