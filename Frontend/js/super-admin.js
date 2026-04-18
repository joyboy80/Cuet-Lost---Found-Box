document.addEventListener("DOMContentLoaded", function () {
    let allUsers = [];
    let currentTab = "all";

    const tabButtons = document.querySelectorAll(".admin-tab");
    const searchBtn = document.getElementById("searchUsersBtn");
    const searchInput = document.getElementById("userSearchInput");
    const deptFilter = document.getElementById("deptFilter");
    const runMatchingBtn = document.getElementById("runMatchingBtn");

    async function apiRequest(path, options = {}) {
        const response = await fetch(`${window.API_BASE_URL}${path}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Request failed");
        }

        return data;
    }

    function parseBatchFromStudentId(studentID) {
        if (!studentID || studentID.length < 2) return "";
        return studentID.slice(0, 2);
    }

    function deriveDepartmentCode(user) {
        const department = String(user.department || "").trim();
        if (department && DEPARTMENTS[department]) return department;

        const studentId = String(user.studentID || "").trim();
        if (/^\d{7}$/.test(studentId)) {
            const code = studentId.slice(2, 4);
            if (DEPARTMENTS[code]) return code;
        }

        const email = String(user.email || "").trim().toLowerCase();
        const emailMatch = email.match(/^u\d{2}(\d{2})\d{3}@student\.cuet\.ac\.bd$/);
        if (emailMatch && DEPARTMENTS[emailMatch[1]]) {
            return emailMatch[1];
        }

        return "";
    }

    function getDepartmentLabel(user) {
        if (!user.department) return "N/A";
        return DEPARTMENTS[user.department] || user.department;
    }

    function normalizeUser(user) {
        return {
            id: String(user._id || user.id || ""),
            fullName: user.name || "Unknown",
            email: user.email || "",
            category: user.role || "student",
            department: deriveDepartmentCode(user),
            studentId: user.studentID || "",
            batch: parseBatchFromStudentId(user.studentID || ""),
            registeredAt: user.createdAt,
            status: user.status || "active",
            systemRole: user.systemRole || "user",
        };
    }

    async function verifySuperAdminSession() {
        try {
            const result = await apiRequest("/users/profile", { method: "GET" });
            const profile = result.data || {};

            if (profile.systemRole !== "super-admin") {
                if (typeof showMessage === "function") {
                    showMessage("Super admin access required.", "error");
                }
                window.location.href = "user-dashboard.html";
                return false;
            }

            return true;
        } catch (error) {
            if (typeof showMessage === "function") {
                showMessage(error.message || "Session expired. Please login again.", "error");
            }
            setTimeout(() => {
                window.location.href = "index.html";
            }, 600);
            return false;
        }
    }

    async function loadUsers() {
        const result = await apiRequest("/users/admin/users", { method: "GET" });
        allUsers = (result.data || []).map(normalizeUser);
        updateStatistics();
        updateDepartmentStats();
        displayUsers(currentTab);
    }

    function updateStatistics() {
        const totalUsers = allUsers.length;
        const students = allUsers.filter((u) => u.category === "student").length;
        const teachers = allUsers.filter((u) => u.category === "teacher").length;
        const staff = allUsers.filter((u) => u.category === "staff").length;

        document.getElementById("totalUsers").textContent = totalUsers;
        document.getElementById("totalStudents").textContent = students;
        document.getElementById("totalTeachers").textContent = teachers;
        document.getElementById("totalStaff").textContent = staff;

        document.getElementById("allUsersBadge").textContent = totalUsers;
        document.getElementById("studentsBadge").textContent = students;
        document.getElementById("teachersBadge").textContent = teachers;
        document.getElementById("staffBadge").textContent = staff;
    }

    function updateDepartmentStats() {
        const departmentGrid = document.getElementById("departmentGrid");
        const deptCounts = {};

        Object.keys(DEPARTMENTS).forEach((code) => {
            deptCounts[code] = { total: 0, students: 0, teachers: 0, staff: 0 };
        });

        allUsers.forEach((user) => {
            if (user.department && deptCounts[user.department]) {
                deptCounts[user.department].total += 1;
                if (user.category === "student") deptCounts[user.department].students += 1;
                if (user.category === "teacher") deptCounts[user.department].teachers += 1;
                if (user.category === "staff") deptCounts[user.department].staff += 1;
            }
        });

        departmentGrid.innerHTML = Object.entries(DEPARTMENTS)
            .map(([code, name]) => {
                const counts = deptCounts[code];
                return `
                <div class="department-card">
                    <h3>${name}</h3>
                    <div class="dept-count">${counts.total}</div>
                    <div class="dept-breakdown">
                        <span>👨‍🎓 ${counts.students}</span>
                        <span>👨‍🏫 ${counts.teachers}</span>
                        <span>👔 ${counts.staff}</span>
                    </div>
                </div>
            `;
            })
            .join("");
    }

    function getUsersForTab(tab) {
        if (tab === "all") return [...allUsers];
        if (tab === "students") return allUsers.filter((u) => u.category === "student");
        if (tab === "teachers") return allUsers.filter((u) => u.category === "teacher");
        if (tab === "staff") return allUsers.filter((u) => u.category === "staff");
        return [];
    }

    function getTableElements(category) {
        const tbody = document.getElementById(`${category}TableBody`) || document.getElementById(`${category}UsersTableBody`);
        const noDataDiv = document.getElementById(`no${category.charAt(0).toUpperCase() + category.slice(1)}`);
        return { tbody, noDataDiv };
    }

    function renderUsersInTable(category, users) {
        const { tbody, noDataDiv } = getTableElements(category);
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = "";
            if (noDataDiv) noDataDiv.style.display = "block";
            return;
        }

        if (noDataDiv) noDataDiv.style.display = "none";

        tbody.innerHTML = users
            .map((user) => {
                const statusBadge =
                    user.status === "active"
                        ? '<span class="status-active">Active</span>'
                        : '<span class="status-blocked">Blocked</span>';

                if (category === "all") {
                    return `
                    <tr>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${getCategoryIcon(user.category)} ${capitalize(user.category)}</td>
                        <td>${getDepartmentLabel(user)}</td>
                        <td>${formatDate(user.registeredAt)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
                            <button class="action-btn ${user.status === "active" ? "btn-reject" : "btn-approve"}" onclick="toggleUserStatus('${user.id}')">
                                ${user.status === "active" ? "Block" : "Unblock"}
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                        </td>
                    </tr>
                `;
                }

                if (category === "students") {
                    return `
                    <tr>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${getDepartmentLabel(user)}</td>
                        <td>${user.batch ? `20${user.batch}` : "N/A"}</td>
                        <td>${formatDate(user.registeredAt)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
                            <button class="action-btn ${user.status === "active" ? "btn-reject" : "btn-approve"}" onclick="toggleUserStatus('${user.id}')">
                                ${user.status === "active" ? "Block" : "Unblock"}
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                        </td>
                    </tr>
                `;
                }

                return `
                <tr>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${getDepartmentLabel(user)}</td>
                    <td>${formatDate(user.registeredAt)}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
                        <button class="action-btn ${user.status === "active" ? "btn-reject" : "btn-approve"}" onclick="toggleUserStatus('${user.id}')">
                            ${user.status === "active" ? "Block" : "Unblock"}
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                    </td>
                </tr>
            `;
            })
            .join("");
    }

    function displayUsers(category) {
        const users = getUsersForTab(category);
        renderUsersInTable(category, users);
    }

    function filterUsers() {
        const searchTerm = (searchInput?.value || "").trim().toLowerCase();
        const deptCode = deptFilter?.value || "";

        let filtered = getUsersForTab(currentTab);

        if (searchTerm) {
            filtered = filtered.filter(
                (u) => u.fullName.toLowerCase().includes(searchTerm) || u.email.toLowerCase().includes(searchTerm)
            );
        }

        if (deptCode) {
            filtered = filtered.filter((u) => u.department === deptCode);
        }

        renderUsersInTable(currentTab, filtered);
    }

    window.viewUser = function (id) {
        const user = allUsers.find((u) => u.id === String(id));
        if (!user) return;

        const modal = document.getElementById("userModal");
        const modalBody = document.getElementById("userModalBody");

        const statusBadge =
            user.status === "active"
                ? '<span class="status-active">Active</span>'
                : '<span class="status-blocked">Blocked</span>';

        modalBody.innerHTML = `
            <div style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                    <div>
                        <h2 style="margin-bottom: 0.5rem; font-size: 2rem; color: var(--gray-900);">${user.fullName}</h2>
                        <p style="color: var(--gray-600); margin-bottom: 0.5rem;">${user.email}</p>
                    </div>
                    ${statusBadge}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Category</p>
                        <p style="font-weight: 600;">${getCategoryIcon(user.category)} ${capitalize(user.category)}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Department</p>
                        <p style="font-weight: 600;">${user.department ? DEPARTMENTS[user.department] : "Not Specified"}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Student ID</p>
                        <p style="font-weight: 600;">${user.studentId || "N/A"}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Registered</p>
                        <p style="font-weight: 600;">${formatDate(user.registeredAt)}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">System Role</p>
                        <p style="font-weight: 600;">${user.systemRole}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">User ID</p>
                        <p style="font-weight: 600;">#${user.id}</p>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn ${user.status === "active" ? "btn-danger" : "btn-secondary"}" style="flex: 1;" onclick="toggleUserStatus('${user.id}'); document.getElementById('userModal').classList.remove('show');">
                        ${user.status === "active" ? "Block User" : "Unblock User"}
                    </button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="deleteUser('${user.id}'); document.getElementById('userModal').classList.remove('show');">
                        Delete User
                    </button>
                </div>
            </div>
        `;

        modal.classList.add("show");

        const closeBtn = modal.querySelector(".modal-close");
        closeBtn.onclick = () => modal.classList.remove("show");
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove("show");
        };
    };

    window.toggleUserStatus = async function (id) {
        try {
            const user = allUsers.find((u) => u.id === String(id));
            if (!user) return;

            const nextStatus = user.status === "active" ? "blocked" : "active";
            await apiRequest(`/users/admin/users/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus }),
            });

            if (typeof showMessage === "function") {
                showMessage(`User ${nextStatus} successfully`, "success");
            }

            await loadUsers();
        } catch (error) {
            if (typeof showMessage === "function") {
                showMessage(error.message || "Failed to update user status", "error");
            }
        }
    };

    window.deleteUser = async function (id) {
        const shouldDelete = confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (!shouldDelete) return;

        try {
            await apiRequest(`/users/admin/users/${id}`, { method: "DELETE" });

            if (typeof showMessage === "function") {
                showMessage("User deleted successfully", "success");
            }

            await loadUsers();
        } catch (error) {
            if (typeof showMessage === "function") {
                showMessage(error.message || "Failed to delete user", "error");
            }
        }
    };

    async function runMatchingAlgorithm() {
        const matchingResults = document.getElementById("matchingResults");
        if (!matchingResults) return;

        matchingResults.style.display = "block";
        matchingResults.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Loading pending match suggestions...</p>
            </div>
        `;

        try {
            const result = await apiRequest("/admin/matches", { method: "GET" });
            const matches = result.data || [];

            if (matches.length === 0) {
                matchingResults.innerHTML =
                    '<p style="text-align: center; color: var(--gray-600);">No pending match suggestions found</p>';
                return;
            }

            matchingResults.innerHTML = `
                <h3 style="margin-bottom: 1rem; color: var(--success);">Pending Match Suggestions (${matches.length})</h3>
                ${matches
                    .map(
                        (match) => `
                    <div class="match-card">
                        <h4>Potential Match</h4>
                        <p><strong>Lost:</strong> ${match.lostItem?.title || "N/A"} - ${match.lostItem?.location || "N/A"}</p>
                        <p><strong>Found:</strong> ${match.foundItem?.title || "N/A"} - ${match.foundItem?.location || "N/A"}</p>
                        <p><strong>Score:</strong> ${typeof match.score === "number" ? match.score.toFixed(2) : "N/A"}</p>
                        <div style="display: flex; gap: 0.75rem; margin-top: 0.75rem; flex-wrap: wrap;">
                            <button class="btn btn-primary btn-sm" onclick="notifyMatchUsers('${match.id}')">Notify Users</button>
                            <button class="btn btn-danger btn-sm" onclick="rejectMatchSuggestion('${match.id}')">Reject</button>
                        </div>
                    </div>
                `
                    )
                    .join("")}
            `;
        } catch (error) {
            matchingResults.innerHTML = `<p style="text-align: center; color: var(--danger);">${error.message || "Failed to load pending matches."}</p>`;
        }
    }

    window.notifyMatchUsers = async function (matchId) {
        const adminMessage = prompt(
            "Enter success message for both users:",
            "Your lost item has been successfully matched with a found item."
        );

        if (adminMessage === null) {
            return;
        }

        const trimmedMessage = String(adminMessage).trim();
        if (!trimmedMessage) {
            if (typeof showMessage === "function") {
                showMessage("Admin success message is required.", "error");
            }
            return;
        }

        try {
            await apiRequest(`/admin/match/notify/${matchId}`, {
                method: "PUT",
                body: JSON.stringify({ adminMessage: trimmedMessage }),
            });

            if (typeof showMessage === "function") {
                showMessage("Users notified successfully.", "success");
            }

            await runMatchingAlgorithm();
        } catch (error) {
            if (typeof showMessage === "function") {
                showMessage(error.message || "Failed to notify users.", "error");
            }
        }
    };

    window.rejectMatchSuggestion = async function (matchId) {
        try {
            await apiRequest(`/admin/match/reject/${matchId}`, { method: "PUT" });
            if (typeof showMessage === "function") {
                showMessage("Match suggestion rejected.", "success");
            }
            await runMatchingAlgorithm();
        } catch (error) {
            if (typeof showMessage === "function") {
                showMessage(error.message || "Failed to reject match.", "error");
            }
        }
    };

    function getCategoryIcon(category) {
        const icons = {
            student: "👨‍🎓",
            teacher: "👨‍🏫",
            staff: "👔",
        };
        return icons[category] || "👤";
    }

    function capitalize(str) {
        return String(str || "").charAt(0).toUpperCase() + String(str || "").slice(1);
    }

    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    tabButtons.forEach((tab) => {
        tab.addEventListener("click", function () {
            tabButtons.forEach((t) => t.classList.remove("active"));
            this.classList.add("active");

            currentTab = this.dataset.tab;

            document.querySelectorAll(".tab-pane").forEach((pane) => {
                pane.classList.remove("active");
            });

            const targetTab = currentTab === "all" ? "allTab" : `${currentTab}Tab`;
            const pane = document.getElementById(targetTab);
            if (pane) pane.classList.add("active");

            displayUsers(currentTab);
        });
    });

    if (searchBtn) searchBtn.addEventListener("click", filterUsers);
    if (searchInput) {
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") filterUsers();
        });
    }
    if (deptFilter) deptFilter.addEventListener("change", filterUsers);
    if (runMatchingBtn) runMatchingBtn.addEventListener("click", runMatchingAlgorithm);

    (async () => {
        const ok = await verifySuperAdminSession();
        if (!ok) return;

        try {
            await loadUsers();
        } catch (error) {
            if (typeof showMessage === "function") {
                showMessage(error.message || "Failed to load users", "error");
            }
        }
    })();
});
