// registration-script.js

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeUserTypeToggle();
});

function initializeEventListeners() {
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegistration);

    // User type radio buttons
    const userTypeRadios = document.querySelectorAll('input[name="userType"]');
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleUserTypeChange);
    });

    // Password confirmation validation
    const confirmPassword = document.getElementById('confirmPassword');
    const password = document.getElementById('password');
    
    confirmPassword.addEventListener('input', () => {
        validatePasswordMatch(password.value, confirmPassword.value);
    });

    password.addEventListener('input', () => {
        if (confirmPassword.value) {
            validatePasswordMatch(password.value, confirmPassword.value);
        }
    });
}

function initializeUserTypeToggle() {
    // Set initial state for patient (default)
    handleUserTypeChange();
}

function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update forms
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.classList.remove('active');
    });

    const targetForm = document.getElementById(tabName + '-form');
    if (targetForm) {
        targetForm.classList.add('active');
    }
}

function handleUserTypeChange() {
    const selectedType = document.querySelector('input[name="userType"]:checked').value;
    const doctorFields = document.getElementById('doctorFields');
    const patientFields = document.getElementById('patientFields');
    const doctorNotice = document.getElementById('doctorNotice');

    if (selectedType === 'doctor') {
        doctorFields.style.display = 'block';
        patientFields.style.display = 'none';
        doctorNotice.style.display = 'flex';
        
        // Make doctor fields required
        document.getElementById('specialization').required = true;
        document.getElementById('licenseNumber').required = true;
        document.getElementById('experience').required = true;
        
        // Remove patient field requirements
        document.getElementById('dateOfBirth').required = false;
        document.getElementById('gender').required = false;
    } else {
        doctorFields.style.display = 'none';
        patientFields.style.display = 'block';
        doctorNotice.style.display = 'none';
        
        // Make patient fields required
        document.getElementById('dateOfBirth').required = true;
        document.getElementById('gender').required = true;
        
        // Remove doctor field requirements
        document.getElementById('specialization').required = false;
        document.getElementById('licenseNumber').required = false;
        document.getElementById('experience').required = false;
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling.nextElementSibling; // Skip the input-icon
    const icon = toggle.querySelector('i');

    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function validatePasswordMatch(password, confirmPassword) {
    const confirmField = document.getElementById('confirmPassword');
    
    if (password !== confirmPassword) {
        confirmField.style.borderColor = '#e74c3c';
        confirmField.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        return false;
    } else {
        confirmField.style.borderColor = '#00b894';
        confirmField.style.boxShadow = '0 0 0 3px rgba(0, 184, 148, 0.1)';
        return true;
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };

    // Show loading
    showLoading();

    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        // Simulate successful login
        if (loginData.email && loginData.password) {
            // Store user session (in real app, this would be handled by backend)
            sessionStorage.setItem('userLoggedIn', 'true');
            sessionStorage.setItem('userEmail', loginData.email);
            
            showSuccessModal('Login successful! Redirecting to dashboard...', () => {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            });
        } else {
            showErrorMessage('Please enter valid credentials.');
        }
    }, 1500);
}

function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    // Validate password match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (!validatePasswordMatch(password, confirmPassword)) {
        showErrorMessage('Passwords do not match.');
        return;
    }

    // Collect registration data
    const registrationData = {
        userType: userType,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: password
    };

    // Add user-type specific data
    if (userType === 'doctor') {
        registrationData.specialization = formData.get('specialization');
        registrationData.licenseNumber = formData.get('licenseNumber');
        registrationData.experience = formData.get('experience');
    } else {
        registrationData.dateOfBirth = formData.get('dateOfBirth');
        registrationData.gender = formData.get('gender');
        registrationData.emergencyContact = formData.get('emergencyContact');
    }

    // Show loading
    showLoading();

    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        // Simulate successful registration
        const successMessage = userType === 'doctor' 
            ? 'Registration submitted! Your account will be reviewed and approved within 24-48 hours. You will receive an email notification once approved.'
            : 'Registration successful! You can now log in to your account.';
            
        showSuccessModal(successMessage, () => {
            if (userType === 'patient') {
                // Switch to login tab for patients
                switchTab('login');
                // Pre-fill email
                document.getElementById('loginEmail').value = registrationData.email;
            } else {
                // For doctors, just close modal
                closeModal();
            }
        });
        
        // Reset form
        e.target.reset();
        // Reset to patient type
        document.querySelector('input[name="userType"][value="patient"]').checked = true;
        handleUserTypeChange();
        
    }, 2000);
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showSuccessModal(message, callback) {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');
    
    messageEl.textContent = message;
    modal.style.display = 'flex';
    
    // Store callback
    modal.callback = callback;
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    // Execute callback if exists
    if (modal.callback) {
        modal.callback();
        modal.callback = null;
    }
}

function showErrorMessage(message) {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Add error styles
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
        z-index: 1002;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 4 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 300);
    }, 4000);
}

// Add CSS animations for error messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Form validation utilities
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
                this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            } else if (this.value) {
                this.style.borderColor = '#00b894';
                this.style.boxShadow = '0 0 0 3px rgba(0, 184, 148, 0.1)';
            }
        });
    });

    // Phone validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = '#e74c3c';
                this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            } else if (this.value) {
                this.style.borderColor = '#00b894';
                this.style.boxShadow = '0 0 0 3px rgba(0, 184, 148, 0.1)';
            }
        });
    });

    // Password validation
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value && !validatePassword(this.value)) {
                this.style.borderColor = '#e74c3c';
                this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
                showPasswordRequirements();
            } else if (this.value) {
                this.style.borderColor = '#00b894';
                this.style.boxShadow = '0 0 0 3px rgba(0, 184, 148, 0.1)';
                hidePasswordRequirements();
            }
        });
    }
});

function showPasswordRequirements() {
    const existingMsg = document.getElementById('passwordRequirements');
    if (existingMsg) return;

    const passwordGroup = document.getElementById('password').parentElement;
    const requirementsDiv = document.createElement('div');
    requirementsDiv.id = 'passwordRequirements';
    requirementsDiv.innerHTML = `
        <small style="color: #e74c3c; font-size: 0.8rem; margin-top: 5px; display: block;">
            Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number
        </small>
    `;
    passwordGroup.appendChild(requirementsDiv);
}

function hidePasswordRequirements() {
    const requirementsDiv = document.getElementById('passwordRequirements');
    if (requirementsDiv) {
        requirementsDiv.remove();
    }
}