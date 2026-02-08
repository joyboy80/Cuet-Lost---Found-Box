// ==========================================
// CUET Lost & Found - Authentication System
// Registration, Login, and Email Validation
// ==========================================

// Department mapping with codes
const DEPARTMENTS = {
    '04': 'Civil Engineering',
    '08': 'Electrical & Electronic Engineering (EEE)',
    '12': 'Mechanical Engineering',
    '16': 'Computer Science & Engineering (CSE)',
    '20': 'Urban & Regional Planning (URP)',
    '24': 'Architecture',
    '28': 'Water Resources Engineering',
    '32': 'Petroleum & Mining Engineering',
    '36': 'Materials Science & Engineering',
    '40': 'Mechatronics & Industrial Engineering',
    '44': 'Electronics & Telecommunication Engineering',
    '48': 'Biomedical Engineering'
};

// Super Admin Credentials (Hardcoded - ONE SUPER ADMIN)
const SUPER_ADMIN = {
    email: 'admin@cuet.ac.bd',
    password: 'SuperAdmin@2026',
    role: 'super-admin',
    name: 'Super Administrator'
};

// ==========================================
// Initialize Super Admin in LocalStorage
// ==========================================
function initializeSuperAdmin() {
    const superAdmin = localStorage.getItem('superAdmin');
    if (!superAdmin) {
        localStorage.setItem('superAdmin', JSON.stringify(SUPER_ADMIN));
    }
}

// ==========================================
// Initialize Demo Users
// ==========================================
function initializeDemoUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if demo users already exist
    if (users.length === 0) {
        const demoUsers = [
            {
                id: 1,
                fullName: 'Rahim Ahmed',
                email: 'u221601@student.cuet.ac.bd',
                password: 'Student@123',
                category: 'student',
                department: '16',
                batch: '22',
                studentId: '01',
                status: 'active',
                role: 'user',
                registeredAt: new Date().toISOString()
            },
            {
                id: 2,
                fullName: 'Fatima Akter',
                email: 'u221602@student.cuet.ac.bd',
                password: 'Student@123',
                category: 'student',
                department: '16',
                batch: '22',
                studentId: '02',
                status: 'active',
                role: 'user',
                registeredAt: new Date().toISOString()
            },
            {
                id: 3,
                fullName: 'Dr. Kamal Hossain',
                email: 'kamal@teacher.cuet.ac.bd',
                password: 'Teacher@123',
                category: 'teacher',
                department: '16',
                status: 'active',
                role: 'user',
                registeredAt: new Date().toISOString()
            },
            {
                id: 4,
                fullName: 'Nasrin Sultana',
                email: 'nasrin@officers.cuet.ac.bd',
                password: 'Staff@123',
                category: 'staff',
                department: '16',
                status: 'active',
                role: 'user',
                registeredAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
}

// ==========================================
// Initialize Demo Posts (Lost & Found Items)
// ==========================================
function initializeDemoPosts() {
    const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
    
    // Check if demo posts already exist
    if (lostItems.length === 0 && foundItems.length === 0) {
        // Demo Lost Items
        const demoLostItems = [
            {
                id: 1,
                itemName: 'Black Leather Wallet',
                category: 'accessories',
                description: 'Lost my black leather wallet containing important cards and some cash. It has a small scratch on the back. Last seen near the CSE Building.',
                location: 'CSE Building, 2nd Floor',
                dateLost: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                contactName: 'Rahim Ahmed',
                email: 'u221601@student.cuet.ac.bd',
                phone: '+880 1712-345678',
                image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop',
                status: 'approved',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                itemName: 'Blue Backpack',
                category: 'bags',
                description: 'Lost my blue Nike backpack with laptop and books inside. Has a small CUET keychain attached. Please contact if found!',
                location: 'Library, 1st Floor',
                dateLost: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                contactName: 'Fatima Akter',
                email: 'u221602@student.cuet.ac.bd',
                phone: '+880 1823-456789',
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
                status: 'approved',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                itemName: 'Samsung Galaxy Phone',
                category: 'electronics',
                description: 'Lost Samsung Galaxy S21 with black case. Screen has a small crack on bottom right. Very important, please help!',
                location: 'EEE Building Cafeteria',
                dateLost: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                contactName: 'Dr. Kamal Hossain',
                email: 'kamal@teacher.cuet.ac.bd',
                phone: '+880 1934-567890',
                image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
                status: 'approved',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        
        // Demo Found Items
        const demoFoundItems = [
            {
                id: 1,
                itemName: 'Student ID Card',
                category: 'keys',
                description: 'Found a CUET student ID card near the main gate. The card belongs to a CSE student from batch 2022. Currently keeping it safe.',
                location: 'Main Gate Area',
                dateFound: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                contactName: 'Nasrin Sultana',
                email: 'nasrin@officers.cuet.ac.bd',
                phone: '+880 1745-678901',
                image: 'https://images.unsplash.com/photo-1589395937658-0e7d895d6580?w=400&h=300&fit=crop',
                status: 'approved',
                storageLocation: 'Admin Office',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                itemName: 'Red Umbrella',
                category: 'other',
                description: 'Found a red umbrella in the lecture hall. It was left behind after class. Has a wooden handle.',
                location: 'Lecture Hall 301',
                dateFound: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                contactName: 'Rahim Ahmed',
                email: 'u221601@student.cuet.ac.bd',
                phone: '+880 1712-345678',
                image: 'https://images.unsplash.com/photo-1558805111-86190f18cd89?w=400&h=300&fit=crop',
                status: 'approved',
                storageLocation: 'Lost & Found Box - CSE',
                date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                itemName: 'Calculus Textbook',
                category: 'books',
                description: 'Found a calculus textbook (Anton 11th Edition) in the library. Has some notes and highlights inside. Owner\'s name might be written inside.',
                location: 'Central Library',
                dateFound: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                contactName: 'Fatima Akter',
                email: 'u221602@student.cuet.ac.bd',
                phone: '+880 1823-456789',
                image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
                status: 'approved',
                storageLocation: 'Library Reception',
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                itemName: 'Wired Earphones',
                category: 'electronics',
                description: 'Found white wired earphones near the canteen. Looks like Apple earphones. They are in good condition.',
                location: 'University Canteen',
                dateFound: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                contactName: 'Dr. Kamal Hossain',
                email: 'kamal@teacher.cuet.ac.bd',
                phone: '+880 1934-567890',
                image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
                status: 'approved',
                storageLocation: 'Teachers Lounge',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        
        localStorage.setItem('lostItems', JSON.stringify(demoLostItems));
        localStorage.setItem('foundItems', JSON.stringify(demoFoundItems));
    }
}

// ==========================================
// Email Validation Functions
// ==========================================

// Validate Student Email
function validateStudentEmail(email, departmentCode) {
    // Format: u22DDSS@student.cuet.ac.bd
    // u = prefix, 22 = batch, DD = dept code, SS = student ID
    
    const studentEmailRegex = /^u(\d{2})(\d{2})(\d{2})@student\.cuet\.ac\.bd$/;
    const match = email.match(studentEmailRegex);
    
    if (!match) {
        return {
            valid: false,
            error: 'Student email must be in format: u22DDSS@student.cuet.ac.bd'
        };
    }
    
    const [, batch, emailDeptCode, studentId] = match;
    
    // Verify department code matches
    if (emailDeptCode !== departmentCode) {
        return {
            valid: false,
            error: `Department code mismatch! Email has code ${emailDeptCode} but you selected ${DEPARTMENTS[departmentCode]}`
        };
    }
    
    return {
        valid: true,
        batch: batch,
        departmentCode: emailDeptCode,
        studentId: studentId
    };
}

// Validate Teacher Email
function validateTeacherEmail(email) {
    // Format: name@teacher.cuet.ac.bd
    const teacherEmailRegex = /^[a-zA-Z0-9._-]+@teacher\.cuet\.ac\.bd$/;
    
    if (!teacherEmailRegex.test(email)) {
        return {
            valid: false,
            error: 'Teacher email must be in format: name@teacher.cuet.ac.bd'
        };
    }
    
    return { valid: true };
}

// Validate Staff Email
function validateStaffEmail(email) {
    // Format: name@officers.cuet.ac.bd
    const staffEmailRegex = /^[a-zA-Z0-9._-]+@officers\.cuet\.ac\.bd$/;
    
    if (!staffEmailRegex.test(email)) {
        return {
            valid: false,
            error: 'Staff email must be in format: name@officers.cuet.ac.bd'
        };
    }
    
    return { valid: true };
}

// Main Email Validation based on category
function validateCUETEmail(email, category, departmentCode) {
    if (category === 'student') {
        return validateStudentEmail(email, departmentCode);
    } else if (category === 'teacher') {
        return validateTeacherEmail(email);
    } else if (category === 'staff') {
        return validateStaffEmail(email);
    }
    
    return { valid: false, error: 'Invalid category' };
}

// ==========================================
// Password Strength Checker
// ==========================================
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

// ==========================================
// Registration Page Logic
// ==========================================
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName');
    const userCategorySelect = document.getElementById('userCategory');
    const departmentSelect = document.getElementById('department');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailHint = document.getElementById('emailHint');
    const departmentHint = document.getElementById('departmentHint');
    const passwordStrengthDiv = document.getElementById('passwordStrength');
    
    // Update email hint based on selected category
    userCategorySelect.addEventListener('change', function() {
        const category = this.value;
        
        if (category === 'student') {
            emailHint.innerHTML = '<strong>Format:</strong> u22DDSS@student.cuet.ac.bd<br><small>Example: u2204094@student.cuet.ac.bd (batch 22, dept 04, student 94)</small>';
            departmentHint.style.display = 'block';
            departmentSelect.setAttribute('required', 'required');
        } else if (category === 'teacher') {
            emailHint.innerHTML = '<strong>Format:</strong> name@teacher.cuet.ac.bd<br><small>Example: suhenaalam@teacher.cuet.ac.bd</small>';
            departmentHint.style.display = 'none';
            departmentSelect.removeAttribute('required');
        } else if (category === 'staff') {
            emailHint.innerHTML = '<strong>Format:</strong> name@officers.cuet.ac.bd<br><small>Example: alam@officers.cuet.ac.bd</small>';
            departmentHint.style.display = 'none';
            departmentSelect.removeAttribute('required');
        } else {
            emailHint.innerHTML = 'Select category first to see email format';
            departmentHint.style.display = 'none';
        }
    });
    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            passwordStrengthDiv.className = 'password-strength';
            return;
        }
        
        const strength = checkPasswordStrength(password);
        passwordStrengthDiv.className = `password-strength ${strength}`;
    });
    
    // Password toggle visibility
    document.getElementById('togglePassword').addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    });
    
    document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
    });
    
    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
        
        // Get form values
        const fullName = fullNameInput.value.trim();
        const userCategory = userCategorySelect.value;
        const department = departmentSelect.value;
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        let hasError = false;
        
        // Validate full name
        if (fullName.length < 3) {
            showError('fullName', 'Please enter your full name (at least 3 characters)');
            hasError = true;
        }
        
        // Validate category
        if (!userCategory) {
            showError('userCategory', 'Please select a user category');
            hasError = true;
        }
        
        // Validate department for students
        if (userCategory === 'student' && !department) {
            showError('department', 'Department is required for students');
            hasError = true;
        }
        
        // Validate CUET email
        const emailValidation = validateCUETEmail(email, userCategory, department);
        if (!emailValidation.valid) {
            showError('email', emailValidation.error);
            hasError = true;
        }
        
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            showError('email', 'This email is already registered');
            hasError = true;
        }
        
        // Validate password
        if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters long');
            hasError = true;
        }
        
        if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            hasError = true;
        }
        
        // Validate terms
        if (!agreeTerms) {
            showError('agreeTerms', 'You must agree to the terms and conditions');
            hasError = true;
        }
        
        if (hasError) {
            showMessage('Please fix the errors in the form', 'error');
            return;
        }
        
        // Create user object
        const newUser = {
            id: Date.now(),
            fullName,
            email,
            category: userCategory,
            department: department || null,
            password: password, // In production, hash this!
            status: 'active',
            registeredAt: new Date().toISOString(),
            ...(userCategory === 'student' && emailValidation.batch ? {
                batch: emailValidation.batch,
                studentId: emailValidation.studentId
            } : {})
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success and redirect
        showSuccessModal(newUser);
    });
    
    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        
        if (input) input.classList.add('error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }
    
    function showSuccessModal(user) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div style="padding: 2rem; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                    <h2 style="color: var(--success); margin-bottom: 1rem;">Registration Successful!</h2>
                    <p style="color: var(--gray-700); margin-bottom: 1.5rem;">
                        Your account has been created successfully. You can now login with your credentials.
                    </p>
                    <div style="background: var(--gray-50); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: left;">
                        <p style="margin-bottom: 0.5rem;"><strong>Name:</strong> ${user.fullName}</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> ${user.email}</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Category:</strong> ${user.category}</p>
                        ${user.department ? `<p><strong>Department:</strong> ${DEPARTMENTS[user.department]}</p>` : ''}
                    </div>
                    <a href="login.html" class="btn btn-primary btn-large">
                        Proceed to Login
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    }
}

// ==========================================
// Login Page Logic
// ==========================================
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Password toggle
    document.getElementById('togglePassword').addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
        
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Check Super Admin
        const superAdmin = JSON.parse(localStorage.getItem('superAdmin') || 'null');
        if (superAdmin && email === superAdmin.email && password === superAdmin.password) {
            // Super Admin login
            const session = {
                user: superAdmin,
                role: 'super-admin',
                loginTime: new Date().toISOString()
            };
            
            if (rememberMe) {
                localStorage.setItem('currentSession', JSON.stringify(session));
            } else {
                sessionStorage.setItem('currentSession', JSON.stringify(session));
            }
            
            showMessage('Welcome, Super Admin!', 'success');
            setTimeout(() => {
                window.location.href = 'super-admin.html';
            }, 1000);
            return;
        }
        
        // Check regular users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showError('email', 'Email not found. Please register first.');
            return;
        }
        
        if (user.password !== password) {
            showError('password', 'Incorrect password');
            return;
        }
        
        if (user.status === 'blocked') {
            showError('email', 'Your account has been blocked. Please contact admin.');
            return;
        }
        
        // Successful login
        const session = {
            user: user,
            role: 'user',
            loginTime: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem('currentSession', JSON.stringify(session));
        } else {
            sessionStorage.setItem('currentSession', JSON.stringify(session));
        }
        
        showMessage(`Welcome back, ${user.fullName}!`, 'success');
        setTimeout(() => {
            window.location.href = 'user-dashboard.html';
        }, 1000);
    });
    
    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        
        if (input) input.classList.add('error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }
}

// ==========================================
// Session Management
// ==========================================
function getCurrentSession() {
    const localSession = localStorage.getItem('currentSession');
    const sessionSession = sessionStorage.getItem('currentSession');
    
    return JSON.parse(localSession || sessionSession || 'null');
}

function isAuthenticated() {
    return getCurrentSession() !== null;
}

function requireAuth(requiredRole = null) {
    const session = getCurrentSession();
    
    if (!session) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && session.role !== requiredRole) {
        if (session.role === 'super-admin') {
            window.location.href = 'super-admin.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
        return false;
    }
    
    return true;
}

function logout() {
    localStorage.removeItem('currentSession');
    sessionStorage.removeItem('currentSession');
    window.location.href = 'login.html';
}

// Logout button handler
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// ==========================================
// Initialize
// ==========================================
initializeSuperAdmin();
initializeDemoUsers();
initializeDemoPosts();

// Export functions for use in other modules
window.getCurrentSession = getCurrentSession;
window.isAuthenticated = isAuthenticated;
window.requireAuth = requireAuth;
window.logout = logout;
window.DEPARTMENTS = DEPARTMENTS;
