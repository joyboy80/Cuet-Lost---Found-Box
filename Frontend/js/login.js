import { API_BASE_URL } from "./config.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email") || document.getElementById("officialEmail");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");

if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", function() {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        clearFormErrors();

        const emailValue = (emailInput?.value || "").trim().toLowerCase();
        const passwordValue = passwordInput?.value || "";
        const rememberMe = document.getElementById("rememberMe")?.checked || false;

        if (!emailValue || !passwordValue) {
            showError("email", "Email and password are required.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: emailValue, password: passwordValue })
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                if (response.status === 400) {
                    throw new Error(result.message || "Email and password are required.");
                }

                if (response.status === 401) {
                    throw new Error(result.message || "Invalid email or password.");
                }

                if (response.status === 403 && (result.message || "").toLowerCase().includes("verify")) {
                    const emailQuery = encodeURIComponent(emailValue);
                    window.location.href = `verify-email.html?email=${emailQuery}`;
                    return;
                }

                if (response.status === 405) {
                    throw new Error("Login endpoint not reachable. Open the app from http://localhost:5000/login.html");
                }

                throw new Error(result.message || "Login failed");
            }

            if (result.user.systemRole !== "super-admin") {
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem("authToken", result.token);
                storage.setItem("currentSession", JSON.stringify({
                    user: result.user,
                    role: result.user.systemRole || "user",
                    loginTime: new Date().toISOString()
                }));
            }

            if (typeof showMessage === "function") {
                showMessage(`Welcome back, ${result.user.name}!`, "success");
            }

            setTimeout(() => {
                if (result.user.systemRole === "super-admin") {
                    window.location.href = "super-admin.html";
                } else {
                    window.location.href = "user-dashboard.html";
                }
            }, 800);
        } catch (error) {
            showError("email", error.message || "Login failed");
        }
    });
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
