// ==========================================
// CUET Lost & Found - Super Admin Dashboard
// User Management & System Overview
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!requireAuth('super-admin')) return;
    
    let allUsers = [];
    let currentTab = 'all';
    
    // ==========================================
    // Load Users
    // ==========================================
    function loadUsers() {
        allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        updateStatistics();
        updateDepartmentStats();
        displayUsers(currentTab);
    }
    
    // ==========================================
    // Update Statistics
    // ==========================================
    function updateStatistics() {
        const totalUsers = allUsers.length;
        const students = allUsers.filter(u => u.category === 'student').length;
        const teachers = allUsers.filter(u => u.category === 'teacher').length;
        const staff = allUsers.filter(u => u.category === 'staff').length;
        
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalStudents').textContent = students;
        document.getElementById('totalTeachers').textContent = teachers;
        document.getElementById('totalStaff').textContent = staff;
        
        // Update badges
        document.getElementById('allUsersBadge').textContent = totalUsers;
        document.getElementById('studentsBadge').textContent = students;
        document.getElementById('teachersBadge').textContent = teachers;
        document.getElementById('staffBadge').textContent = staff;
    }
    
    // ==========================================
    // Update Department Statistics
    // ==========================================
    function updateDepartmentStats() {
        const departmentGrid = document.getElementById('departmentGrid');
        const deptCounts = {};
        
        // Initialize all departments with 0
        Object.keys(DEPARTMENTS).forEach(code => {
            deptCounts[code] = { total: 0, students: 0, teachers: 0, staff: 0 };
        });
        
        // Count users by department
        allUsers.forEach(user => {
            if (user.department && deptCounts[user.department]) {
                deptCounts[user.department].total++;
                deptCounts[user.department][user.category + 's']++;
            }
        });
        
        // Generate department cards
        departmentGrid.innerHTML = Object.entries(DEPARTMENTS).map(([code, name]) => {
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
        }).join('');
    }
    
    // ==========================================
    // Display Users in Tables
    // ==========================================
    function displayUsers(category) {
        let filteredUsers = category === 'all' ? allUsers : 
                           allUsers.filter(u => u.category + 's' === category || u.category === category);
        
        const tbody = document.getElementById(`${category}TableBody`) || 
                     document.getElementById(`${category}UsersTableBody`);
        const noDataDiv = document.getElementById(`no${category.charAt(0).toUpperCase() + category.slice(1)}`);
        
        if (!tbody) return;
        
        if (filteredUsers.length === 0) {
            tbody.innerHTML = '';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }
        
        if (noDataDiv) noDataDiv.style.display = 'none';
        
        tbody.innerHTML = filteredUsers.map(user => {
            const statusBadge = user.status === 'active' ? 
                '<span class="status-active">Active</span>' : 
                '<span class="status-blocked">Blocked</span>';
            
            if (category === 'all' || category === 'allUsers') {
                return `
                    <tr>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${getCategoryIcon(user.category)} ${capitalize(user.category)}</td>
                        <td>${user.department ? DEPARTMENTS[user.department] : 'N/A'}</td>
                        <td>${formatDate(user.registeredAt)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewUser('${user.email}')">View</button>
                            <button class="action-btn ${user.status === 'active' ? 'btn-reject' : 'btn-approve'}" 
                                    onclick="toggleUserStatus('${user.email}')">
                                ${user.status === 'active' ? 'Block' : 'Unblock'}
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteUser('${user.email}')">Delete</button>
                        </td>
                    </tr>
                `;
            } else if (category === 'students') {
                return `
                    <tr>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${user.department ? DEPARTMENTS[user.department] : 'N/A'}</td>
                        <td>20${user.batch || 'N/A'}</td>
                        <td>${formatDate(user.registeredAt)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewUser('${user.email}')">View</button>
                            <button class="action-btn ${user.status === 'active' ? 'btn-reject' : 'btn-approve'}" 
                                    onclick="toggleUserStatus('${user.email}')">
                                ${user.status === 'active' ? 'Block' : 'Unblock'}
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteUser('${user.email}')">Delete</button>
                        </td>
                    </tr>
                `;
            } else {
                return `
                    <tr>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${user.department ? DEPARTMENTS[user.department] : 'N/A'}</td>
                        <td>${formatDate(user.registeredAt)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewUser('${user.email}')">View</button>
                            <button class="action-btn ${user.status === 'active' ? 'btn-reject' : 'btn-approve'}" 
                                    onclick="toggleUserStatus('${user.email}')">
                                ${user.status === 'active' ? 'Block' : 'Unblock'}
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteUser('${user.email}')">Delete</button>
                        </td>
                    </tr>
                `;
            }
        }).join('');
    }
    
    // ==========================================
    // Tab Switching
    // ==========================================
    const tabButtons = document.querySelectorAll('.admin-tab');
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            tabButtons.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentTab = this.dataset.tab;
            
            // Show corresponding tab pane
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            const targetTab = currentTab === 'all' ? 'allTab' : currentTab + 'Tab';
            const tabPane = document.getElementById(targetTab);
            if (tabPane) tabPane.classList.add('active');
            
            displayUsers(currentTab);
        });
    });
    
    // ==========================================
    // View User Details
    // ==========================================
    window.viewUser = function(email) {
        const user = allUsers.find(u => u.email === email);
        if (!user) return;
        
        const modal = document.getElementById('userModal');
        const modalBody = document.getElementById('userModalBody');
        
        const statusBadge = user.status === 'active' ? 
            '<span class="status-active">Active</span>' : 
            '<span class="status-blocked">Blocked</span>';
        
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
                        <p style="font-weight: 600;">${user.department ? DEPARTMENTS[user.department] : 'Not Specified'}</p>
                    </div>
                    ${user.batch ? `
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Batch</p>
                        <p style="font-weight: 600;">20${user.batch}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Student ID</p>
                        <p style="font-weight: 600;">${user.studentId || 'N/A'}</p>
                    </div>
                    ` : ''}
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Registered</p>
                        <p style="font-weight: 600;">${formatDate(user.registeredAt)}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">User ID</p>
                        <p style="font-weight: 600;">#${user.id}</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn ${user.status === 'active' ? 'btn-danger' : 'btn-secondary'}" 
                            style="flex: 1;" 
                            onclick="toggleUserStatus('${user.email}'); document.getElementById('userModal').classList.remove('show');">
                        ${user.status === 'active' ? 'Block User' : 'Unblock User'}
                    </button>
                    <button class="btn btn-outline" 
                            style="flex: 1;" 
                            onclick="deleteUser('${user.email}'); document.getElementById('userModal').classList.remove('show');">
                        Delete User
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    };
    
    // ==========================================
    // Toggle User Status
    // ==========================================
    window.toggleUserStatus = function(email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) return;
        
        user.status = user.status === 'active' ? 'blocked' : 'active';
        localStorage.setItem('users', JSON.stringify(users));
        
        showMessage(`User ${user.status === 'active' ? 'unblocked' : 'blocked'} successfully`, 'success');
        loadUsers();
    };
    
    // ==========================================
    // Delete User
    // ==========================================
    window.deleteUser = function(email) {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.email !== email);
        localStorage.setItem('users', JSON.stringify(users));
        
        showMessage('User deleted successfully', 'success');
        loadUsers();
    };
    
    // ==========================================
    // Search and Filter
    // ==========================================
    const searchBtn = document.getElementById('searchUsersBtn');
    const searchInput = document.getElementById('userSearchInput');
    const deptFilter = document.getElementById('deptFilter');
    
    function filterUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const deptCode = deptFilter.value;
        
        let filtered = currentTab === 'all' ? allUsers : 
                      allUsers.filter(u => u.category + 's' === currentTab || u.category === currentTab);
        
        if (searchTerm) {
            filtered = filtered.filter(u => 
                u.fullName.toLowerCase().includes(searchTerm) ||
                u.email.toLowerCase().includes(searchTerm)
            );
        }
        
        if (deptCode) {
            filtered = filtered.filter(u => u.department === deptCode);
        }
        
        // Display filtered results
        const tbody = document.getElementById(`${currentTab}TableBody`) || 
                     document.getElementById(`${currentTab}UsersTableBody`);
        
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--gray-500);">No users match your search criteria</td></tr>';
        } else {
            allUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const temp = allUsers;
            allUsers = filtered;
            displayUsers(currentTab);
            allUsers = temp;
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', filterUsers);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') filterUsers();
        });
    }
    
    if (deptFilter) {
        deptFilter.addEventListener('change', filterUsers);
    }
    
    // ==========================================
    // Item Matching Algorithm
    // ==========================================
    const runMatchingBtn = document.getElementById('runMatchingBtn');
    if (runMatchingBtn) {
        runMatchingBtn.addEventListener('click', function() {
            const matchingResults = document.getElementById('matchingResults');
            matchingResults.style.display = 'block';
            matchingResults.innerHTML = `
                <div class="loading-indicator">
                    <div class="spinner"></div>
                    <p>Running matching algorithm...</p>
                </div>
            `;
            
            setTimeout(() => {
                // Simulate matching
                const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
                const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
                
                const matches = [];
                lostItems.forEach(lost => {
                    foundItems.forEach(found => {
                        if (lost.category === found.category && 
                            lost.location.toLowerCase().includes(found.location.toLowerCase())) {
                            matches.push({ lost, found });
                        }
                    });
                });
                
                if (matches.length === 0) {
                    matchingResults.innerHTML = '<p style="text-align: center; color: var(--gray-600);">No potential matches found</p>';
                } else {
                    matchingResults.innerHTML = `
                        <h3 style="margin-bottom: 1rem; color: var(--success);">Found ${matches.length} potential match${matches.length > 1 ? 'es' : ''}!</h3>
                        ${matches.map(match => `
                            <div class="match-card">
                                <h4>Potential Match</h4>
                                <p><strong>Lost:</strong> ${match.lost.itemName} - ${match.lost.location}</p>
                                <p><strong>Found:</strong> ${match.found.itemName} - ${match.found.location}</p>
                                <button class="btn btn-primary btn-sm" style="margin-top: 0.5rem;">Notify Users</button>
                            </div>
                        `).join('')}
                    `;
                }
            }, 2000);
        });
    }
    
    // ==========================================
    // Helper Functions
    // ==========================================
    function getCategoryIcon(category) {
        const icons = {
            'student': '👨‍🎓',
            'teacher': '👨‍🏫',
            'staff': '👔'
        };
        return icons[category] || '👤';
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // ==========================================
    // Initialize
    // ==========================================
    loadUsers();
});
