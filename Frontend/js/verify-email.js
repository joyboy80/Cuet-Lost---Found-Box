import { API_BASE_URL } from "./config.js";

const verifyForm = document.getElementById("verifyEmailForm");
const emailInput = document.getElementById("email");
const otpInput = document.getElementById("otp");
const verifyBtn = document.getElementById("verifyOtpBtn");

const params = new URLSearchParams(window.location.search);
const initialEmail = (params.get("email") || "").trim().toLowerCase();
if (initialEmail && emailInput) {
    emailInput.value = initialEmail;
}

if (otpInput) {
    otpInput.addEventListener("input", () => {
        otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
    });
}

if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearFormErrors();

        const email = (emailInput?.value || "").trim().toLowerCase();
        const otp = (otpInput?.value || "").trim();

        let hasError = false;

        if (!email) {
            showError("email", "Email is required.");
            hasError = true;
        }

        if (!/^\d{6}$/.test(otp)) {
            showError("otp", "OTP must be a 6-digit code.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        verifyBtn.disabled = true;
        verifyBtn.textContent = "Verifying...";

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                throw new Error(result.message || "OTP verification failed.");
            }

            const storage = localStorage;
            storage.setItem("authToken", result.token);
            storage.setItem(
                "currentSession",
                JSON.stringify({
                    user: result.user,
                    role: result.user.systemRole || "user",
                    loginTime: new Date().toISOString(),
                })
            );

            if (typeof showMessage === "function") {
                showMessage("Email verified successfully.", "success");
            }

            setTimeout(() => {
                window.location.href = "user-dashboard.html";
            }, 900);
        } catch (error) {
            showError("otp", error.message || "OTP verification failed.");
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = "Verify Email";
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

    if (input) {
        input.classList.add("error");
    }

    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add("show");
    }
}
