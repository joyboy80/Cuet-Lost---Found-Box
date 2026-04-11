// ==========================================
// CUET Lost & Found Box - Report Form JS
// Form validation and submission handling
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:5000/api';

    // Get form elements
    const lostForm = document.getElementById('lostItemForm');
    const foundForm = document.getElementById('foundItemForm');
    
    // Determine which form we're working with
    const currentForm = lostForm || foundForm;
    if (!currentForm) return;
    
    // ==========================================
    // File Upload Preview
    // ==========================================
    const fileInput = document.getElementById('itemImage');
    const fileNameDisplay = document.getElementById('fileName');
    const imagePreview = document.getElementById('imagePreview');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Display file name
                fileNameDisplay.textContent = `Selected: ${file.name}`;
                
                // Show image preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 300px; border-radius: 12px; box-shadow: var(--shadow-md); margin-top: 1rem;">
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                fileNameDisplay.textContent = '';
                imagePreview.innerHTML = '';
            }
        });
    }
    
    // ==========================================
    // Form Validation Functions
    // ==========================================
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        // Clear previous error
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            showError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                showError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Date validation (not in future)
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate > today) {
                showError(field, 'Date cannot be in the future');
                return false;
            }
        }
        
        // Text length validation
        if (field.type === 'text' && value && value.length < 3) {
            showError(field, 'Please enter at least 3 characters');
            return false;
        }
        
        // Textarea length validation
        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            showError(field, 'Please provide a more detailed description (at least 10 characters)');
            return false;
        }
        
        return true;
    }
    
    function showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    // ==========================================
    // Real-time Validation
    // ==========================================
    const formInputs = currentForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                validateField(this);
            }
        });
        
        // Clear error on focus
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            const errorElement = document.getElementById(`${this.id}Error`);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        });
    });
    
    // ==========================================
    // Form Submission
    // ==========================================
    currentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showMessage('Please fix the errors in the form', 'error');
            // Scroll to first error
            const firstError = currentForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        await submitReport();
    });
    
    // ==========================================
    // Submit Report to Backend API
    // ==========================================
    async function submitReport() {
        // Show loading state
        const submitBtn = currentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.style.opacity = '0.7';

        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!token) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            showMessage('Please login first to submit a report.', 'error');
            window.location.href = 'login.html';
            return;
        }

        try {
            const multipartData = new FormData();
            const data = {
                title: document.getElementById('itemName').value.trim(),
                description: document.getElementById('description').value.trim(),
                category: document.getElementById('category').value,
                itemType: lostForm ? 'Lost' : 'Found',
                location: document.getElementById('location').value.trim()
            };

            // Backend expects these exact keys.
            multipartData.append('title', data.title);
            multipartData.append('description', data.description);
            multipartData.append('category', data.category);
            multipartData.append('itemType', data.itemType);
            multipartData.append('location', data.location);

            const selectedImage = fileInput ? fileInput.files[0] : null;
            if (!selectedImage) {
                throw new Error('Please upload an image before submitting.');
            }

            if (selectedImage) {
                multipartData.append('image', selectedImage);
            }

            const response = await fetch(`${API_BASE_URL}/items/report`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: multipartData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to submit report.');
            }

            currentForm.reset();
            document.getElementById('fileName').textContent = '';
            document.getElementById('imagePreview').innerHTML = '';

            showSuccessModal({
                itemName: data.title,
                type: data.itemType.toLowerCase(),
                category: data.category,
                location: data.location,
                id: result.data?.id || 'N/A'
            });
        } catch (error) {
            showMessage(error.message || 'Failed to submit report.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    }

    window.submitReport = submitReport;
    
    // ==========================================
    // Success Modal
    // ==========================================
    function showSuccessModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <span class="modal-close">&times;</span>
                <div style="padding: 2rem; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                    <h2 style="color: var(--success); margin-bottom: 1rem;">Report Submitted Successfully!</h2>
                    <p style="color: var(--gray-700); margin-bottom: 1.5rem;">
                        Your ${data.type} item report has been submitted and is pending admin approval.
                        You will be notified once it's reviewed.
                    </p>
                    <div style="background: var(--gray-50); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: left;">
                        <p style="margin-bottom: 0.5rem;"><strong>Item:</strong> ${data.itemName}</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Category:</strong> ${getCategoryName(data.category)}</p>
                        <p style="margin-bottom: 0.5rem;"><strong>Location:</strong> ${data.location}</p>
                        <p><strong>Reference ID:</strong> #${data.id}</p>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <a href="index.html" class="btn btn-primary">Go to Home</a>
                        <a href="search.html" class="btn btn-outline">Search Items</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => {
            modal.remove();
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }
    
    // ==========================================
    // Form Reset
    // ==========================================
    currentForm.addEventListener('reset', function() {
        // Clear all error messages
        const errorMessages = currentForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.classList.remove('show'));
        
        // Clear error classes
        const errorInputs = currentForm.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        // Clear file preview
        if (fileNameDisplay) fileNameDisplay.textContent = '';
        if (imagePreview) imagePreview.innerHTML = '';
    });
    
    // ==========================================
    // Set Max Date to Today
    // ==========================================
    const dateInputs = currentForm.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.setAttribute('max', today);
    });
});
