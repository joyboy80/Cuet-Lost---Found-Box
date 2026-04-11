import { API_BASE_URL } from "./config.js";

const roleSelect = document.getElementById("role");
const studentIDGroup = document.getElementById("studentIDGroup");
const studentIDInput = document.getElementById("studentID");
const registerForm = document.getElementById("registerForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const togglePasswordBtn = document.getElementById("togglePassword");
const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");
const passwordStrengthDiv = document.getElementById("passwordStrength");

const emailHint = document.getElementById("emailHint");
const departmentHint = document.getElementById("departmentHint");
const departmentSelect = document.getElementById("department");

const STUDENT_EMAIL_REGEX = /^u\d{7}@student\.cuet\.ac\.bd$/;
const TEACHER_EMAIL_REGEX = /^[a-zA-Z0-9._-]+@cuet\.ac\.bd$/;
const STAFF_EMAIL_REGEX = /^[a-zA-Z0-9._-]+@officers\.cuet\.ac\.bd$/;

if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", function() {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });
}

if (toggleConfirmPasswordBtn && confirmPasswordInput) {
    toggleConfirmPasswordBtn.addEventListener("click", function() {
        confirmPasswordInput.type = confirmPasswordInput.type === "password" ? "text" : "password";
    });
}

if (passwordInput) {
    passwordInput.addEventListener("input", function() {
        if (!passwordStrengthDiv) return;

        const value = passwordInput.value;
        if (!value) {
            passwordStrengthDiv.className = "password-strength";
            return;
        }

        let strength = 0;
        if (value.length >= 8) strength++;
        if (value.length >= 12) strength++;
        if (/[a-z]/.test(value)) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^a-zA-Z0-9]/.test(value)) strength++;

        passwordStrengthDiv.className = `password-strength ${strength <= 2 ? "weak" : strength <= 4 ? "medium" : "strong"}`;
    });
}

if (roleSelect) {
    roleSelect.addEventListener("change", applyRoleUIState);
    applyRoleUIState();
}

if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        clearFormErrors();

        const name = (document.getElementById("fullName")?.value || "").trim();
        const role = (roleSelect?.value || "").trim();
        const email = (document.getElementById("email")?.value || "").trim().toLowerCase();
        const password = passwordInput?.value || "";
        const confirmPassword = confirmPasswordInput?.value || "";
        const department = (departmentSelect?.value || "").trim();
        const studentID = (studentIDInput?.value || "").trim();
        const agreeTerms = document.getElementById("agreeTerms")?.checked;

        let hasError = false;

        if (name.length < 3) {
            showError("fullName", "Please enter your full name (at least 3 characters)");
            hasError = true;
        }

        if (!role) {
            showError("role", "Please select a role");
            hasError = true;
        }

        if (role === "student" && !department) {
            showError("department", "Department is required for students");
            hasError = true;
        }

        if (!validateEmailByRole(email, role)) {
            showError("email", "Please provide a valid CUET official email for the selected role");
            hasError = true;
        }

        if (role === "student" && !studentID) {
            showError("studentID", "Student ID is required for student users");
            hasError = true;
        }

        if (password.length < 8) {
            showError("password", "Password must be at least 8 characters long");
            hasError = true;
        }

        if (password !== confirmPassword) {
            showError("confirmPassword", "Passwords do not match");
            hasError = true;
        }

        if (!agreeTerms) {
            showError("agreeTerms", "You must agree to the terms and conditions");
            hasError = true;
        }

        if (hasError) {
            if (typeof showMessage === "function") {
                showMessage("Please fix the errors in the form", "error");
            }
            return;
        }

        const payload = {
            name,
            email,
            password,
            role,
            department: department || ""
        };

        if (role === "student") {
            payload.studentID = studentID;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                if (response.status === 400) {
                    throw new Error(result.message || "Please check required fields.");
                }

                if (response.status === 401) {
                    throw new Error(result.message || "Unauthorized request.");
                }

                throw new Error(result.message || "Registration failed");
            }

            if (typeof showMessage === "function") {
                showMessage(result.message || "Registration successful", "success");
            }

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } catch (error) {
            if (typeof showMessage === "function") {
                showMessage(error.message || "Registration failed", "error");
            }
        }
    });
}

function applyRoleUIState() {
    const role = roleSelect?.value;

    if (role === "student") {
        if (studentIDGroup) studentIDGroup.style.display = "block";
        if (studentIDInput) studentIDInput.setAttribute("required", "required");

        if (departmentHint) departmentHint.style.display = "block";
        if (departmentSelect) departmentSelect.setAttribute("required", "required");

        if (emailHint) {
            emailHint.innerHTML = "<strong>Format:</strong> u{batch}{deptId}{id}@student.cuet.ac.bd";
        }
        return;
    }

    if (studentIDGroup) studentIDGroup.style.display = "none";
    if (studentIDInput) {
        studentIDInput.removeAttribute("required");
        studentIDInput.value = "";
    }

    if (departmentHint) departmentHint.style.display = "none";
    if (departmentSelect) departmentSelect.removeAttribute("required");

    if (emailHint) {
        if (role === "teacher") {
            emailHint.innerHTML = "<strong>Format:</strong> name@cuet.ac.bd";
        } else if (role === "staff") {
            emailHint.innerHTML = "<strong>Format:</strong> name@officers.cuet.ac.bd";
        } else {
            emailHint.textContent = "Select role first to see email format";
        }
    }
}

function validateEmailByRole(email, role) {
    if (!email || !role) return false;

    if (role === "student") return STUDENT_EMAIL_REGEX.test(email);
    if (role === "teacher") return TEACHER_EMAIL_REGEX.test(email);
    if (role === "staff") return STAFF_EMAIL_REGEX.test(email);

    return false;
}

function clearFormErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
        el.textContent = "";
        el.classList.remove("show");
    });

    document.querySelectorAll(".form-input").forEach((el) => {
        el.classList.remove("error");
    });
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);

    if (input) input.classList.add("error");
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add("show");
    }
}
