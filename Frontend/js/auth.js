// Shared auth/session helpers for pages that are not module-based.
if (!window.API_BASE_URL) {
    const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
    const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (!isHttp) {
        window.API_BASE_URL = "http://localhost:5000/api";
    } else if (isLocalHost && window.location.port !== "5000") {
        window.API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
    } else {
        window.API_BASE_URL = `${window.location.origin}/api`;
    }
}

const DEPARTMENTS = {
    "01": "Civil Engineering (CE)",
    "02": "Electrical & Electronic Engineering (EEE)",
    "03": "Mechanical Engineering (ME)",
    "04": "Computer Science & Engineering (CSE)",
    "05": "Urban & Regional Planning (URP)",
    "06": "Architecture",
    "07": "Petroleum & Mining Engineering (PME)",
    "08": "Electronics & Telecommunication Engineering (ETE)",
    "09": "Mechatronics & Industrial Engineering (MIE)",
    "10": "Water Resources Engineering (WRE)",
    "11": "Biomedical Engineering (BME)",
    "12": "Materials & Metallurgical Engineering (MME)",
};

function getCurrentSession() {
    const localSession = localStorage.getItem("currentSession");
    const sessionSession = sessionStorage.getItem("currentSession");

    return JSON.parse(localSession || sessionSession || "null");
}

function isAuthenticated() {
    return getCurrentSession() !== null;
}

function requireAuth(requiredRole = null) {
    const session = getCurrentSession();

    if (!session) {
        window.location.href = "index.html";
        return false;
    }

    if (requiredRole) {
        const role = session.role || session.user?.systemRole || "user";
        if (role !== requiredRole) {
            if (role === "super-admin") {
                window.location.href = "super-admin.html";
            } else {
                window.location.href = "user-dashboard.html";
            }
            return false;
        }
    }

    return true;
}

async function logout() {
    try {
        await fetch(`${window.API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        // Ignore network errors and still clear client state.
    }

    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("currentSession");
    sessionStorage.removeItem("currentSession");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            logout();
        });
    }
});

window.getCurrentSession = getCurrentSession;
window.isAuthenticated = isAuthenticated;
window.requireAuth = requireAuth;
window.logout = logout;
window.DEPARTMENTS = DEPARTMENTS;
