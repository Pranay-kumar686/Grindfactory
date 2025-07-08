// API Configuration
const API_BASE_URL = 'http://localhost:5500';

/* HOME SECTION */
document.addEventListener("DOMContentLoaded", function () {
    // Smooth Scrolling for Navigation
    document.querySelectorAll(".nav-links a").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
            
            // Update active state
            document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Initialize trainer profile sections to be hidden
    document.getElementById('trainer1').style.display = 'none';
    document.getElementById('trainer2').style.display = 'none';
    
    // Horizontal Navigation Scrolling
    const navLinks = document.getElementById('navLinks');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    if (scrollLeftBtn && scrollRightBtn && navLinks) {
        scrollLeftBtn.addEventListener('click', () => {
            navLinks.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            navLinks.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }
    
    // Track scroll position to update active menu item
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        
        // Get all sections
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === '#' + sectionId) {
                        a.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Auth Modal Functionality
    const authModal = document.getElementById('authModal');
    const startGrindBtn = document.getElementById('startGrindBtn');
    const closeAuthBtn = document.getElementById('closeAuthBtn');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Open auth modal when clicking the CTA button
    if (startGrindBtn) {
        startGrindBtn.addEventListener('click', () => {
            authModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close auth modal
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && authModal.style.display === 'flex') {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Tab switching for login/register
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and forms
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding form
                const tabName = tab.getAttribute('data-tab');
                document.getElementById(tabName + 'Form').classList.add('active');
            });
        });
        
        // Form submission handling with AJAX
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const loginMessage = document.getElementById('loginMessage');
        const registerMessage = document.getElementById('registerMessage');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset message
                loginMessage.className = 'message-box';
                loginMessage.innerHTML = '';
                loginMessage.style.display = 'none';
                
                // Get form data
                const formData = new FormData(this);
                const formDataObj = {};
                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });
                
                // Send AJAX request
                fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObj)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Store user data in localStorage
                        localStorage.setItem('user', JSON.stringify(data.user));
                        
                        // Show success message
                        loginMessage.className = 'message-box message-success';
                        loginMessage.innerHTML = data.message;
                        loginMessage.style.display = 'block';
                        
                        // Reset form
                        loginForm.reset();
                        
                        // Close modal after delay
                        setTimeout(() => {
                            authModal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                            
                            // Reload page to update user state
                            window.location.reload();
                        }, 2000);
                    } else {
                        // Show error message
                        loginMessage.className = 'message-box message-error';
                        loginMessage.innerHTML = data.message;
                        loginMessage.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    loginMessage.className = 'message-box message-error';
                    loginMessage.innerHTML = 'An error occurred. Please try again.';
                    loginMessage.style.display = 'block';
                });
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset message
                registerMessage.className = 'message-box';
                registerMessage.innerHTML = '';
                registerMessage.style.display = 'none';
                
                // Get form data
                const formData = new FormData(this);
                const formDataObj = {};
                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });
                
                // Check if passwords match
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password !== confirmPassword) {
                    registerMessage.className = 'message-box message-error';
                    registerMessage.innerHTML = 'Passwords do not match!';
                    registerMessage.style.display = 'block';
                    return;
                }
                
                // Send AJAX request
                fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObj)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        registerMessage.className = 'message-box message-success';
                        registerMessage.innerHTML = data.message;
                        registerMessage.style.display = 'block';
                        
                        // Reset form
                        registerForm.reset();
                        
                        // Switch to login tab after delay
                        setTimeout(() => {
                            document.querySelector('.auth-tab[data-tab="login"]').click();
                        }, 2000);
                    } else {
                        // Show error message
                        registerMessage.className = 'message-box message-error';
                        registerMessage.innerHTML = data.message;
                        registerMessage.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    registerMessage.className = 'message-box message-error';
                    registerMessage.innerHTML = 'An error occurred. Please try again.';
                    registerMessage.style.display = 'block';
    });
});
        }
    }

    // Check if user is logged in
    checkUserSession();

    // Membership modal logic
    var membershipModal = document.getElementById("membershipModal");
    var openModalBtn = document.getElementById("openModalBtn");
    var modalCloseBtn = document.querySelector(".close");
    var membershipForm = document.getElementById("membershipForm");
    var thankYouMsg = document.getElementById("thankYouMsg");

    if (openModalBtn) {
        openModalBtn.onclick = function () {
            membershipModal.style.display = "block";
            membershipForm.style.display = "block";
            thankYouMsg.style.display = "none";
        };
    }

    if (modalCloseBtn) {
        modalCloseBtn.onclick = function () {
            membershipModal.style.display = "none";
        };
    }

    window.onclick = function (event) {
        if (event.target === membershipModal) {
            membershipModal.style.display = "none";
        }
    };
    
    // Handle membership form submission
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Get user ID from localStorage if available
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                formDataObj.user_id = user.id;
            }
            
            // Send AJAX request
            fetch(`${API_BASE_URL}/membership`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showThankYou();
                } else {
                    // Show error message
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }

    window.showThankYou = function () {
        membershipForm.style.display = "none";
        thankYouMsg.style.display = "block";
        setTimeout(() => {
            membershipModal.style.display = "none";
        }, 3000);
    };
});

    function showTrainerProfile(trainerId) {
  // Get the profile element
  const profile = document.getElementById(trainerId);
  
  // Show the profile with flex display
  profile.style.display = 'flex';
  
  // Disable scrolling on the body
  document.body.style.overflow = 'hidden';
  
  // Add escape key functionality
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      goBack();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
  
  // Add click outside to close
  profile.addEventListener('click', function closeOnOutsideClick(e) {
    if (e.target === profile) {
      goBack();
      profile.removeEventListener('click', closeOnOutsideClick);
    }
  });
    }
  
    function goBack() {
  // Hide both trainer profiles
      document.getElementById('trainer1').style.display = 'none';
      document.getElementById('trainer2').style.display = 'none';
  
  // Re-enable scrolling on the body
  document.body.style.overflow = 'auto';
}

// Check if user is logged in when page loads
function checkUserSession() {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userData) {
        // User is logged in
        const user = JSON.parse(userData);
        console.log('User is logged in:', user);
        
        // Update UI elements to show logged-in state
        // For example, show a welcome message
        const startGrindBtn = document.getElementById('startGrindBtn');
        if (startGrindBtn) {
            startGrindBtn.textContent = `Welcome, ${user.name}`;
        }
        
        // Show logout button
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            
            // Add logout functionality
            logoutBtn.addEventListener('click', function() {
                // Clear user data from localStorage
                localStorage.removeItem('user');
                // Reload page to update UI
                window.location.reload();
            });
        }
        
        // You can add more UI changes here
    } else {
        // User is not logged in
        console.log('User is not logged in');
        
        // Hide logout button
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    }
}

// Add testimonials reveal animation
document.addEventListener('DOMContentLoaded', function() {
  // Animate testimonials on scroll
  const revealTestimonials = () => {
    const testimonialSection = document.querySelector('.testimonials-section');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (testimonialSection && testimonialCards.length) {
      const sectionPosition = testimonialSection.getBoundingClientRect();
      const screenPosition = window.innerHeight;
      
      if (sectionPosition.top < screenPosition * 0.8) {
        testimonialCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('revealed');
          }, index * 300);
        });
        
        // Remove scroll listener once animations are triggered
        window.removeEventListener('scroll', revealTestimonials);
      }
    }
  };
  
  // Initial check on page load
  revealTestimonials();
  
  // Add scroll listener
  window.addEventListener('scroll', revealTestimonials);
});

// Add countdown timer functionality
function updateCountdown() {
  const countdownElement = document.querySelector('.countdown');
  if (!countdownElement) return;
  
  const targetDate = new Date(countdownElement.getAttribute('data-countdown')).getTime();
  const now = new Date().getTime();
  const timeRemaining = targetDate - now;
  
  if (timeRemaining <= 0) {
    countdownElement.innerHTML = '<div class="expired">This offer has expired!</div>';
    return;
  }
  
  // Calculate time units
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
  // Update DOM
  document.querySelector('.countdown .days').textContent = days < 10 ? `0${days}` : days;
  document.querySelector('.countdown .hours').textContent = hours < 10 ? `0${hours}` : hours;
  document.querySelector('.countdown .minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
  document.querySelector('.countdown .seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
}

// Initialize and update the countdown every second
document.addEventListener('DOMContentLoaded', function() {
  // Initial call to setup countdown
  updateCountdown();
  
  // Update countdown every second
  setInterval(updateCountdown, 1000);
  
  // Add testimonials reveal animation
  const revealTestimonials = () => {
    // ... existing testimonial code ...
  };
  
  // Offer buttons click handlers
  const offerButtons = document.querySelectorAll('.offer-button');
  offerButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the action based on the button text
      const buttonText = this.textContent.trim();
      
      switch(buttonText) {
        case 'CLAIM OFFER':
          // Open membership modal for these offers
          document.getElementById('membershipModal').style.display = 'block';
          document.getElementById('membershipForm').style.display = 'block';
          document.getElementById('thankYouMsg').style.display = 'none';
          
          // Set plan type based on the offer
          const offerTitle = this.closest('.offer-card').querySelector('.offer-title').textContent.trim();
          const planSelect = document.querySelector('select[name="plan_type"]');
          
          if (offerTitle.includes('ANNUAL')) {
            planSelect.value = 'VIP'; // Annual membership is treated as VIP
          } else if (offerTitle.includes('NEW MEMBER')) {
            planSelect.value = 'Basic';
          } else {
            // Default behavior
            planSelect.selectedIndex = 0;
          }
          break;
          
        case 'INVITE FRIEND':
          // Scroll to contact section
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          
          // Pre-fill the contact form subject
          const subjectSelect = document.getElementById('subject');
          subjectSelect.value = 'membership';
          
          // Pre-fill message
          const messageField = document.getElementById('message');
          messageField.value = "I'd like to invite a friend to join Grind Factory and claim the 20% discount offer for both of us.";
          break;
          
        case 'GET STUDENT DISCOUNT':
          // Scroll to contact section
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          
          // Pre-fill the form
          document.getElementById('subject').value = 'membership';
          document.getElementById('message').value = "I'm a student interested in the 25% student discount. I'd like to know what documents I need to provide to verify my student status.";
          break;
          
        case 'ACCEPT CHALLENGE':
          // Scroll to contact section
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          
          // Pre-fill the form
          document.getElementById('subject').value = 'personal-training';
          document.getElementById('message').value = "I want to join the 90-day transformation challenge. Please provide more details about how the challenge works and how my progress will be tracked.";
          break;
      }
    });
  });
  
  // Corporate inquiry button handler
  const inquireButton = document.querySelector('.secondary-button');
  if (inquireButton) {
    inquireButton.addEventListener('click', function() {
      // Scroll to contact section
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      
      // Pre-fill the form
      document.getElementById('subject').value = 'other';
      document.getElementById('message').value = "I'm interested in learning more about corporate membership packages for my organization. Please provide details about available options and rates for groups.";
    });
  }
  
  // Contact info card click handlers
  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach(card => {
    card.addEventListener('click', function() {
      const title = this.querySelector('h3').textContent.trim();
      
      switch(title) {
        case 'VISIT US':
          // Open Google Maps link
          window.open('https://goo.gl/maps/7pquGjUbhS6cg8jR8', '_blank');
          break;
          
        case 'CALL US':
          // Trigger phone call on mobile devices
          window.location.href = 'tel:+919876543210';
          break;
          
        case 'EMAIL US':
          // Open default email client
          window.location.href = 'mailto:info@grindfactory.com';
          break;
      }
    });
  });
  
  // Initial check on page load
  revealTestimonials();
  
  // Add scroll listener
  window.addEventListener('scroll', revealTestimonials);
});

// Contact form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
      
      if (!name || !email || !phone || !subject || !message) {
        showFormMessage('Please fill in all required fields.', false);
        highlightEmptyFields();
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', false);
        document.getElementById('email').classList.add('error');
        return;
      }
      
      // Phone validation - simple check for numbers and basic symbols
      const phoneRegex = /^[0-9+\- ]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        showFormMessage('Please enter a valid phone number.', false);
        document.getElementById('phone').classList.add('error');
        return;
      }
      
      // All validation passed, simulate form submission
      // Replace this with actual form submission to backend
      simulateFormSubmission();
    });
    
    // Clear error class on input
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.classList.remove('error');
        hideFormMessage();
      });
    });
  }
  
  // Simulate form submission (in a real app, this would be an AJAX call)
  function simulateFormSubmission() {
    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate delay
    setTimeout(function() {
      // Show success message
      showFormMessage('Your message has been sent successfully! We\'ll get back to you soon.', true);
      
      // Reset form
      contactForm.reset();
      
      // Reset button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 2000);
  }
  
  // Show form message
  function showFormMessage(text, isSuccess) {
    // Check if message element exists, create if not
    let messageEl = document.getElementById('contactFormMessage');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'contactFormMessage';
      contactForm.insertAdjacentElement('beforebegin', messageEl);
    }
    
    // Set message style and text
    messageEl.className = isSuccess ? 'form-message success' : 'form-message error';
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    
    // Auto-hide after a delay if success
    if (isSuccess) {
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 5000);
    }
  }
  
  // Hide form message
  function hideFormMessage() {
    const messageEl = document.getElementById('contactFormMessage');
    if (messageEl) {
      messageEl.style.display = 'none';
    }
  }
  
  // Highlight empty required fields
  function highlightEmptyFields() {
    const requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
      }
    });
  }
});
  