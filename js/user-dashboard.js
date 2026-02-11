// ==========================================
// CUET Lost & Found - User Dashboard
// User profile and reports management
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!requireAuth('user')) return;
    
    const session = getCurrentSession();
    const currentUser = session.user;
    
    // ==========================================
    // Display User Information
    // ==========================================
    function displayUserInfo() {
        // Set user name and email
        document.getElementById('userName').textContent = currentUser.fullName;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userWelcome').textContent = `Welcome back, ${currentUser.fullName}!`;
        
        // Set user category badge
        const categoryIcons = {
            'student': '👨‍🎓 Student',
            'teacher': '👨‍🏫 Teacher',
            'staff': '👔 Staff'
        };
        document.getElementById('userCategory').textContent = categoryIcons[currentUser.category] || currentUser.category;
        
        // Set department if exists
        if (currentUser.department && DEPARTMENTS[currentUser.department]) {
            document.getElementById('userDepartment').textContent = DEPARTMENTS[currentUser.department];
        } else {
            document.getElementById('userDepartment').style.display = 'none';
        }
        
        // Set user initials
        const initials = currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        document.getElementById('userInitials').textContent = initials;
    }
    
    // ==========================================
    // Calculate User Statistics
    // ==========================================
    function calculateStats() {
        const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
        const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
        
        // Filter items by current user email
        const userLostItems = lostItems.filter(item => item.email === currentUser.email);
        const userFoundItems = foundItems.filter(item => item.email === currentUser.email);
        
        // Count matched items (status = matched)
        const matchedItems = [...userLostItems, ...userFoundItems].filter(item => item.status === 'matched').length;
        
        // Update UI
        document.getElementById('userLostItems').textContent = userLostItems.length;
        document.getElementById('userFoundItems').textContent = userFoundItems.length;
        document.getElementById('userMatches').textContent = matchedItems;
        document.getElementById('userTotalReports').textContent = userLostItems.length + userFoundItems.length;
        
        // Update badges
        document.getElementById('lostBadge').textContent = userLostItems.length;
        document.getElementById('foundBadge').textContent = userFoundItems.length;
        
        return { userLostItems, userFoundItems };
    }
    
    // ==========================================
    // Display User Reports
    // ==========================================
    function displayReports() {
        const { userLostItems, userFoundItems } = calculateStats();
        
        // Display lost items
        const lostGrid = document.getElementById('userLostItemsGrid');
        const noLostItems = document.getElementById('noLostItems');
        
        if (userLostItems.length === 0) {
            lostGrid.style.display = 'none';
            noLostItems.style.display = 'flex';
        } else {
            lostGrid.style.display = 'grid';
            noLostItems.style.display = 'none';
            lostGrid.innerHTML = userLostItems.map(item => createUserItemCard(item, 'lost')).join('');
        }
        
        // Display found items
        const foundGrid = document.getElementById('userFoundItemsGrid');
        const noFoundItems = document.getElementById('noFoundItems');
        
        if (userFoundItems.length === 0) {
            foundGrid.style.display = 'none';
            noFoundItems.style.display = 'flex';
        } else {
            foundGrid.style.display = 'grid';
            noFoundItems.style.display = 'none';
            foundGrid.innerHTML = userFoundItems.map(item => createUserItemCard(item, 'found')).join('');
        }
    }
    
    // ==========================================
    // Create Item Card for User
    // ==========================================
    function createUserItemCard(item, type) {
        const statusClass = {
            'pending': 'bg-warning-light',
            'approved': 'bg-success-light',
            'rejected': 'bg-danger-light',
            'matched': 'bg-success-light'
        }[item.status] || 'bg-warning-light';
        
        const statusText = {
            'pending': '⏳ Pending Review',
            'approved': '✅ Approved',
            'rejected': '❌ Rejected',
            'matched': '🤝 Matched'
        }[item.status] || item.status;
        
        return `
            <div class="item-card" onclick="viewItemDetails('${item.id}', '${type}')">
                ${item.image ? `<img src="${item.image}" alt="${item.itemName || item.name}" class="item-image">` : `
                    <div class="item-image" style="background: var(--gray-200); display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                        ${type === 'lost' ? '📋' : '✅'}
                    </div>
                `}
                <div class="item-content">
                    <span class="item-status ${statusClass.replace('bg-', 'status-').replace('-light', '')}" style="padding: 4px 12px; border-radius: 12px; font-size: 0.85rem;">
                        ${statusText}
                    </span>
                    <h3 class="item-title">${item.itemName || item.name}</h3>
                    <p class="item-category">📂 ${getCategoryName(item.category)}</p>
                    <p class="item-location">📍 ${item.location}</p>
                    <p class="item-date">📅 ${formatDate(item.date || item.dateLost || item.dateFound)}</p>
                </div>
            </div>
        `;
    }
    
    // ==========================================
    // View Item Details
    // ==========================================
    window.viewItemDetails = function(itemId, type) {
        const items = type === 'lost' ? 
            JSON.parse(localStorage.getItem('lostItems') || '[]') :
            JSON.parse(localStorage.getItem('foundItems') || '[]');
        
        const item = items.find(i => i.id == itemId);
        if (!item) return;
        
        // Use existing modal from main.js
        showItemModal(item.id);
    };
    
    // ==========================================
    // Tab Switching
    // ==========================================
    const reportsTabs = document.querySelectorAll('.reports-tab');
    reportsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            reportsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            
            // Hide all tab panes
            document.querySelectorAll('#lostItemsTab, #foundItemsTab').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Show selected tab
            if (tabName === 'lost') {
                document.getElementById('lostItemsTab').classList.add('active');
            } else {
                document.getElementById('foundItemsTab').classList.add('active');
            }
        });
    });
    
    // ==========================================
    // View Profile
    // ==========================================
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfileModal();
        });
    }
    
    function showProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <span class="modal-close">&times;</span>
                <div style="padding: 2rem;">
                    <h2 style="margin-bottom: 1.5rem; color: var(--gray-900);">My Profile</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Full Name</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${currentUser.fullName}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Email</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${currentUser.email}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Category</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${currentUser.category.toUpperCase()}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Department</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${currentUser.department ? DEPARTMENTS[currentUser.department] : 'Not Specified'}</p>
                        </div>
                        ${currentUser.batch ? `
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Batch</p>
                            <p style="font-weight: 600; color: var(--gray-900);">20${currentUser.batch}</p>
                        </div>
                        ` : ''}
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Member Since</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${formatDate(currentUser.registeredAt)}</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
                        <h3 style="margin-bottom: 1rem; color: var(--gray-900);">Account Status</h3>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <span class="status-active">Active Account</span>
                            <p style="color: var(--gray-600); margin: 0;">Your account is in good standing</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
    
    // ==========================================
    // Initialize Dashboard
    // ==========================================
    displayUserInfo();
    displayReports();
});
