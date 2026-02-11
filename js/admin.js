// ==========================================
// CUET Lost & Found Box - Admin Panel JS
// Admin dashboard functionality
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // Mock Admin Data
    // ==========================================
    let adminItems = [
        ...mockItems.map(item => ({
            ...item,
            status: Math.random() > 0.5 ? 'pending' : 'approved',
            submittedAt: item.date,
            reviewedAt: null
        }))
    ];
    
    // Add items from localStorage
    const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
    adminItems = [...adminItems, ...lostItems, ...foundItems];
    
    let currentTab = 'pending';
    let currentRejectionItem = null;
    
    // ==========================================
    // Update Statistics
    // ==========================================
    function updateStats() {
        const pending = adminItems.filter(item => item.status === 'pending').length;
        const approved = adminItems.filter(item => item.status === 'approved').length;
        const rejected = adminItems.filter(item => item.status === 'rejected').length;
        const matched = adminItems.filter(item => item.status === 'matched').length;
        const total = adminItems.length;
        
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('approvedCount').textContent = approved;
        document.getElementById('matchedCount').textContent = matched;
        document.getElementById('totalCount').textContent = total;
        
        // Update badges
        document.getElementById('pendingBadge').textContent = pending;
        document.getElementById('approvedBadge').textContent = approved;
        document.getElementById('rejectedBadge').textContent = rejected;
    }
    
    // ==========================================
    // Display Items in Table
    // ==========================================
    function displayAdminItems(status) {
        const items = adminItems.filter(item => item.status === status);
        const tbody = document.getElementById(`${status}TableBody`);
        const noDataDiv = document.getElementById(`no${status.charAt(0).toUpperCase() + status.slice(1)}`);
        
        if (!tbody) return;
        
        if (items.length === 0) {
            tbody.innerHTML = '';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }
        
        if (noDataDiv) noDataDiv.style.display = 'none';
        
        tbody.innerHTML = items.map(item => {
            const typeIcon = item.type === 'lost' ? '📋' : '✅';
            const statusBadge = getStatusBadge(item.status);
            
            if (status === 'pending') {
                return `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${typeIcon} ${item.type === 'lost' ? 'Lost' : 'Found'}</td>
                        <td>${item.name}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td>${item.location}</td>
                        <td>${formatDate(item.date)}</td>
                        <td>${item.reporter || item.contactName || 'N/A'}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewAdminItem(${item.id})">View</button>
                            <button class="action-btn btn-approve" onclick="approveItem(${item.id})">Approve</button>
                            <button class="action-btn btn-reject" onclick="showRejectModal(${item.id})">Reject</button>
                        </td>
                    </tr>
                `;
            } else if (status === 'approved') {
                return `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${typeIcon} ${item.type === 'lost' ? 'Lost' : 'Found'}</td>
                        <td>${item.name}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td>${item.location}</td>
                        <td>${formatDate(item.date)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewAdminItem(${item.id})">View</button>
                            <button class="action-btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
            } else { // rejected
                return `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${typeIcon} ${item.type === 'lost' ? 'Lost' : 'Found'}</td>
                        <td>${item.name}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td>${item.rejectionReason || 'No reason provided'}</td>
                        <td>${formatDate(item.date)}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewAdminItem(${item.id})">View</button>
                            <button class="action-btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
            }
        }).join('');
    }
    
    // ==========================================
    // Get Status Badge HTML
    // ==========================================
    function getStatusBadge(status) {
        const badges = {
            'pending': '<span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Pending</span>',
            'approved': '<span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Approved</span>',
            'rejected': '<span style="background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Rejected</span>',
            'matched': '<span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Matched</span>'
        };
        return badges[status] || status;
    }
    
    // ==========================================
    // Tab Switching
    // ==========================================
    const tabButtons = document.querySelectorAll('.admin-tab');
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabButtons.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Get tab name
            currentTab = this.dataset.tab;
            
            // Update tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(`${currentTab}Tab`).classList.add('active');
            
            // Display items for this tab
            displayAdminItems(currentTab);
        });
    });
    
    // ==========================================
    // View Item Details
    // ==========================================
    window.viewAdminItem = function(itemId) {
        const item = adminItems.find(i => i.id === itemId);
        if (!item) return;
        
        const modal = document.getElementById('adminModal');
        const modalBody = document.getElementById('adminModalBody');
        
        const statusClass = item.type === 'lost' ? 'status-lost' : 'status-found';
        const statusText = item.type === 'lost' ? 'Lost' : 'Found';
        
        modalBody.innerHTML = `
            <div style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                    <div>
                        <span class="item-status ${statusClass}" style="font-size: 1rem;">${statusText} Item</span>
                        <h2 style="margin: 1rem 0; font-size: 2rem; color: var(--gray-900);">${item.name}</h2>
                    </div>
                    ${getStatusBadge(item.status)}
                </div>
                
                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;">` : ''}
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Category</p>
                        <p style="font-weight: 600;">${getCategoryName(item.category)}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Location</p>
                        <p style="font-weight: 600;">${item.location}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Date</p>
                        <p style="font-weight: 600;">${formatDate(item.date)}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Reference ID</p>
                        <p style="font-weight: 600;">#${item.id}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.5rem;">Description</p>
                    <p style="color: var(--gray-700); line-height: 1.6;">${item.description}</p>
                </div>
                
                <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px;">
                    <h3 style="margin-bottom: 1rem; color: var(--gray-900);">Reporter Information</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Name</p>
                            <p style="font-weight: 600;">${item.reporter || item.contactName || 'N/A'}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Email</p>
                            <p style="font-weight: 600;">${item.contact || item.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Phone</p>
                            <p style="font-weight: 600;">${item.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Student ID</p>
                            <p style="font-weight: 600;">${item.studentId || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                
                ${item.status === 'pending' ? `
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button class="btn btn-secondary" style="flex: 1;" onclick="approveItem(${item.id}); document.getElementById('adminModal').classList.remove('show');">Approve Item</button>
                        <button class="btn btn-danger" style="flex: 1;" onclick="showRejectModal(${item.id}); document.getElementById('adminModal').classList.remove('show');">Reject Item</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.add('show');
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    };
    
    // ==========================================
    // Approve Item
    // ==========================================
    window.approveItem = function(itemId) {
        const item = adminItems.find(i => i.id === itemId);
        if (!item) return;
        
        item.status = 'approved';
        item.reviewedAt = new Date().toISOString();
        
        showMessage(`Item "${item.name}" has been approved!`, 'success');
        updateStats();
        displayAdminItems(currentTab);
    };
    
    // ==========================================
    // Show Rejection Modal
    // ==========================================
    window.showRejectModal = function(itemId) {
        currentRejectionItem = itemId;
        const modal = document.getElementById('rejectionModal');
        modal.classList.add('show');
        document.getElementById('rejectionReason').value = '';
    };
    
    // Close rejection modal
    const rejectModalClose = document.getElementById('rejectModalClose');
    const cancelReject = document.getElementById('cancelReject');
    const rejectionModal = document.getElementById('rejectionModal');
    
    if (rejectModalClose) {
        rejectModalClose.onclick = () => {
            rejectionModal.classList.remove('show');
            currentRejectionItem = null;
        };
    }
    
    if (cancelReject) {
        cancelReject.onclick = () => {
            rejectionModal.classList.remove('show');
            currentRejectionItem = null;
        };
    }
    
    // Confirm rejection
    const confirmReject = document.getElementById('confirmReject');
    if (confirmReject) {
        confirmReject.onclick = function() {
            const reason = document.getElementById('rejectionReason').value.trim();
            
            if (!reason) {
                alert('Please provide a reason for rejection');
                return;
            }
            
            const item = adminItems.find(i => i.id === currentRejectionItem);
            if (item) {
                item.status = 'rejected';
                item.rejectionReason = reason;
                item.reviewedAt = new Date().toISOString();
                
                showMessage(`Item "${item.name}" has been rejected`, 'success');
                updateStats();
                displayAdminItems(currentTab);
            }
            
            rejectionModal.classList.remove('show');
            currentRejectionItem = null;
        };
    }
    
    // ==========================================
    // Delete Item
    // ==========================================
    window.deleteItem = function(itemId) {
        if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }
        
        const index = adminItems.findIndex(i => i.id === itemId);
        if (index > -1) {
            const item = adminItems[index];
            adminItems.splice(index, 1);
            showMessage(`Item "${item.name}" has been deleted`, 'success');
            updateStats();
            displayAdminItems(currentTab);
        }
    };
    
    // ==========================================
    // Search and Filter
    // ==========================================
    const adminSearchBtn = document.getElementById('adminSearchBtn');
    const adminSearchInput = document.getElementById('adminSearchInput');
    const adminCategoryFilter = document.getElementById('adminCategoryFilter');
    const adminStatusFilter = document.getElementById('adminStatusFilter');
    
    function filterAdminItems() {
        const searchTerm = adminSearchInput.value.toLowerCase();
        const category = adminCategoryFilter.value;
        const statusFilter = adminStatusFilter.value;
        
        let filtered = adminItems.filter(item => item.status === currentTab);
        
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm)
            );
        }
        
        if (category) {
            filtered = filtered.filter(item => item.category === category);
        }
        
        if (statusFilter) {
            filtered = filtered.filter(item => item.type === statusFilter);
        }
        
        // Update display with filtered items
        const tbody = document.getElementById(`${currentTab}TableBody`);
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--gray-500);">No items match your search criteria</td></tr>';
        } else {
            // Re-render with filtered items
            displayFilteredAdminItems(filtered, currentTab);
        }
    }
    
    function displayFilteredAdminItems(items, status) {
        const tbody = document.getElementById(`${status}TableBody`);
        if (!tbody) return;
        
        tbody.innerHTML = items.map(item => {
            const typeIcon = item.type === 'lost' ? '📋' : '✅';
            const statusBadge = getStatusBadge(item.status);
            
            if (status === 'pending') {
                return `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${typeIcon} ${item.type === 'lost' ? 'Lost' : 'Found'}</td>
                        <td>${item.name}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td>${item.location}</td>
                        <td>${formatDate(item.date)}</td>
                        <td>${item.reporter || item.contactName || 'N/A'}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewAdminItem(${item.id})">View</button>
                            <button class="action-btn btn-approve" onclick="approveItem(${item.id})">Approve</button>
                            <button class="action-btn btn-reject" onclick="showRejectModal(${item.id})">Reject</button>
                        </td>
                    </tr>
                `;
            } else if (status === 'approved') {
                return `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${typeIcon} ${item.type === 'lost' ? 'Lost' : 'Found'}</td>
                        <td>${item.name}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td>${item.location}</td>
                        <td>${formatDate(item.date)}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewAdminItem(${item.id})">View</button>
                            <button class="action-btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
            } else {
                return `
                    <tr>
                        <td>#${item.id}</td>
                        <td>${typeIcon} ${item.type === 'lost' ? 'Lost' : 'Found'}</td>
                        <td>${item.name}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td>${item.rejectionReason || 'No reason provided'}</td>
                        <td>${formatDate(item.date)}</td>
                        <td>
                            <button class="action-btn btn-view" onclick="viewAdminItem(${item.id})">View</button>
                            <button class="action-btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
            }
        }).join('');
    }
    
    if (adminSearchBtn) {
        adminSearchBtn.addEventListener('click', filterAdminItems);
    }
    
    if (adminSearchInput) {
        adminSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') filterAdminItems();
        });
    }
    
    if (adminCategoryFilter) {
        adminCategoryFilter.addEventListener('change', filterAdminItems);
    }
    
    if (adminStatusFilter) {
        adminStatusFilter.addEventListener('change', filterAdminItems);
    }
    
    // ==========================================
    // Initialize Admin Panel
    // ==========================================
    updateStats();
    displayAdminItems('pending');
});
