const API_BASE_URL = "https://cuet-lost-found-box-1.onrender.com/api";

function getRedirectPathByRole(role) {
  if (role === "admin" || role === "super-admin") {
    return "super-admin.html";
  }
  return "user-dashboard.html";
}

async function submitRegistration(event) {
  if (event) {
    event.preventDefault();
  }

  try {
    const name = document.getElementById("fullName")?.value.trim();
    const studentID = document.getElementById("studentID")?.value.trim();
    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const password = document.getElementById("password")?.value;

    if (!name || !studentID || !email || !password) {
      throw new Error("Please fill all required registration fields.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, studentID, email, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Registration failed.");
    }

    localStorage.setItem("authToken", result.token);
    localStorage.setItem("currentSession", JSON.stringify({
      user: result.user,
      role: result.user.role,
      loginTime: new Date().toISOString(),
    }));

    window.location.href = getRedirectPathByRole(result.user.role);
  } catch (error) {
    alert(error.message || "Registration failed due to an unexpected error.");
  }
}

async function submitLogin(event) {
  if (event) {
    event.preventDefault();
  }

  try {
    const studentID = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!studentID || !password) {
      throw new Error("Student ID and password are required.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentID, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Login failed.");
    }

    localStorage.setItem("authToken", result.token);
    localStorage.setItem("currentSession", JSON.stringify({
      user: result.user,
      role: result.user.role,
      loginTime: new Date().toISOString(),
    }));

    window.location.href = getRedirectPathByRole(result.user.role);
  } catch (error) {
    alert(error.message || "Login failed due to an unexpected error.");
  }
}

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentSession");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("currentSession");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", submitRegistration);
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", submitLogin);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      logout();
    });
  }
});

window.submitRegistration = submitRegistration;
window.submitLogin = submitLogin;
window.logout = logout;
