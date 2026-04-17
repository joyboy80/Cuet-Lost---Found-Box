// ==========================================
// CUET Lost & Found Box - Admin Panel JS
// Super admin moderation workflow (Pending/Approved/Rejected)
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = (window.API_BASE_URL)
        ? window.API_BASE_URL
        : ['localhost', '127.0.0.1'].includes(window.location.hostname)
            ? `${window.location.protocol}//${window.location.hostname}:5000/api`
            : `${window.location.origin}/api`;

    let adminItems = [];
    let currentTab = 'pending';
    let currentRejectionItemId = null;

    const tabButtons = document.querySelectorAll('.admin-tab');
    const adminSearchInput = document.getElementById('adminSearchInput');
    const adminCategoryFilter = document.getElementById('adminCategoryFilter');
    const adminStatusFilter = document.getElementById('adminStatusFilter');
    const adminSearchBtn = document.getElementById('adminSearchBtn');

    const rejectionModal = document.getElementById('rejectionModal');
    const rejectionReasonInput = document.getElementById('rejectionReason');
    const confirmRejectBtn = document.getElementById('confirmReject');
    const cancelRejectBtn = document.getElementById('cancelReject');
    const rejectModalCloseBtn = document.getElementById('rejectModalClose');

    function getAuthToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    }

    async function apiRequest(path, options = {}) {
        const token = getAuthToken();

        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            credentials: 'include',
            headers,
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Request failed.');
        }

        return data;
    }

    function normalizeItem(item) {
        return {
            id: item.id,
            title: item.title || 'Untitled Item',
            description: item.description || '',
            category: item.category || 'other',
            location: item.location || '',
            itemType: (item.itemType || 'Lost').toLowerCase(),
            imageUrl: item.imageUrl || '',
            status: (item.status || 'Pending').toLowerCase(),
            rejectionReason: item.rejectionReason || '',
            createdAt: item.createdAt,
            owner: item.owner || null,
        };
    }

    async function verifySuperAdminSession() {
        const result = await apiRequest('/users/profile', { method: 'GET' });
        const profile = result.data || {};
        if (profile.systemRole !== 'super-admin') {
            throw new Error('Super admin access required.');
        }
    }

    async function loadAdminItems() {
        const result = await apiRequest('/items', { method: 'GET' });
        adminItems = (result.data || []).map(normalizeItem);
    }

    function getCategoryName(category) {
        const map = {
            electronics: 'Electronics',
            accessories: 'Accessories',
            clothing: 'Clothing',
            books: 'Books',
            documents: 'Documents',
            keys: 'Keys & Cards',
            sports: 'Sports Equipment',
            bags: 'Bags',
            other: 'Other',
        };
        return map[category] || category || 'Other';
    }

    function formatDate(dateValue) {
        if (!dateValue) return 'N/A';
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function getStatusBadge(status) {
        const badges = {
            pending: '<span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Pending</span>',
            approved: '<span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Approved</span>',
            rejected: '<span style="background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Rejected</span>',
        };
        return badges[status] || status;
    }

    function updateStats() {
        const pending = adminItems.filter((item) => item.status === 'pending').length;
        const approved = adminItems.filter((item) => item.status === 'approved').length;
        const rejected = adminItems.filter((item) => item.status === 'rejected').length;
        const total = adminItems.length;

        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('approvedCount').textContent = approved;
        document.getElementById('matchedCount').textContent = rejected;
        document.getElementById('totalCount').textContent = total;

        document.getElementById('pendingBadge').textContent = pending;
        document.getElementById('approvedBadge').textContent = approved;
        document.getElementById('rejectedBadge').textContent = rejected;
    }

    function getFilteredItems(status) {
        const searchTerm = (adminSearchInput?.value || '').trim().toLowerCase();
        const category = adminCategoryFilter?.value || '';
        const typeFilter = adminStatusFilter?.value || '';

        return adminItems
            .filter((item) => item.status === status)
            .filter((item) => {
                if (searchTerm) {
                    const searchable = `${item.title} ${item.description} ${item.location}`.toLowerCase();
                    if (!searchable.includes(searchTerm)) return false;
                }

                if (category && item.category !== category) return false;
                if (typeFilter && item.itemType !== typeFilter) return false;

                return true;
            });
    }

    function renderRows(status, items) {
        if (status === 'pending') {
            return items.map((item) => `
                <tr>
                    <td>#${item.id}</td>
                    <td>${item.itemType === 'lost' ? '📋 Lost' : '✅ Found'}</td>
                    <td>${item.title}</td>
                    <td>${getCategoryName(item.category)}</td>
                    <td>${item.location}</td>
                    <td>${formatDate(item.createdAt)}</td>
                    <td>${item.owner?.name || 'N/A'}</td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewAdminItem('${item.id}')">View</button>
                        <button class="action-btn btn-approve" onclick="setItemStatus('${item.id}', 'approved')">Approve</button>
                        <button class="action-btn btn-reject" onclick="showRejectModal('${item.id}')">Reject</button>
                    </td>
                </tr>
            `).join('');
        }

        if (status === 'approved') {
            return items.map((item) => `
                <tr>
                    <td>#${item.id}</td>
                    <td>${item.itemType === 'lost' ? '📋 Lost' : '✅ Found'}</td>
                    <td>${item.title}</td>
                    <td>${getCategoryName(item.category)}</td>
                    <td>${item.location}</td>
                    <td>${formatDate(item.createdAt)}</td>
                    <td>${getStatusBadge(item.status)}</td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewAdminItem('${item.id}')">View</button>
                        <button class="action-btn btn-reject" onclick="showRejectModal('${item.id}')">Reject</button>
                        <button class="action-btn btn-delete" onclick="setItemStatus('${item.id}', 'pending')">Set Pending</button>
                    </td>
                </tr>
            `).join('');
        }

        return items.map((item) => `
            <tr>
                <td>#${item.id}</td>
                <td>${item.itemType === 'lost' ? '📋 Lost' : '✅ Found'}</td>
                <td>${item.title}</td>
                <td>${getCategoryName(item.category)}</td>
                <td>${item.rejectionReason || 'No reason provided'}</td>
                <td>${formatDate(item.createdAt)}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewAdminItem('${item.id}')">View</button>
                    <button class="action-btn btn-approve" onclick="setItemStatus('${item.id}', 'approved')">Approve</button>
                    <button class="action-btn btn-delete" onclick="setItemStatus('${item.id}', 'pending')">Set Pending</button>
                </td>
            </tr>
        `).join('');
    }

    function displayAdminItems(status) {
        const items = getFilteredItems(status);
        const tbody = document.getElementById(`${status}TableBody`);
        const noDataDiv = document.getElementById(`no${status.charAt(0).toUpperCase() + status.slice(1)}`);

        if (!tbody) return;

        if (items.length === 0) {
            tbody.innerHTML = '';
            if (noDataDiv) noDataDiv.style.display = 'block';
            return;
        }

        if (noDataDiv) noDataDiv.style.display = 'none';
        tbody.innerHTML = renderRows(status, items);
    }

    function openTab(tabName) {
        currentTab = tabName;
        tabButtons.forEach((tab) => tab.classList.remove('active'));
        const currentButton = document.querySelector(`.admin-tab[data-tab="${tabName}"]`);
        if (currentButton) currentButton.classList.add('active');

        document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.remove('active'));
        const pane = document.getElementById(`${tabName}Tab`);
        if (pane) pane.classList.add('active');

        displayAdminItems(tabName);
    }

    async function setItemStatus(itemId, status, rejectionReason = '') {
        try {
            await apiRequest(`/items/${itemId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status, rejectionReason }),
            });

            if (typeof showMessage === 'function') {
                showMessage(`Item moved to ${status}.`, 'success');
            }

            await loadAdminItems();
            updateStats();
            displayAdminItems(currentTab);
        } catch (error) {
            if (typeof showMessage === 'function') {
                showMessage(error.message || 'Failed to update item status.', 'error');
            }
        }
    }

    window.setItemStatus = setItemStatus;

    window.showRejectModal = function (itemId) {
        currentRejectionItemId = itemId;
        if (rejectionReasonInput) rejectionReasonInput.value = '';
        if (rejectionModal) rejectionModal.classList.add('show');
    };

    function closeRejectModal() {
        currentRejectionItemId = null;
        if (rejectionModal) rejectionModal.classList.remove('show');
    }

    window.viewAdminItem = function (itemId) {
        const item = adminItems.find((it) => String(it.id) === String(itemId));
        if (!item) return;

        const modal = document.getElementById('adminModal');
        const modalBody = document.getElementById('adminModalBody');
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h2 style="color: var(--gray-900); margin-bottom: 0.5rem;">${item.title}</h2>
                        <p style="color: var(--gray-600); margin: 0;">${item.itemType === 'lost' ? 'Lost' : 'Found'} • ${getCategoryName(item.category)}</p>
                    </div>
                    ${getStatusBadge(item.status)}
                </div>

                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;">` : ''}

                <p style="margin-bottom: 0.5rem;"><strong>Location:</strong> ${item.location}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Date:</strong> ${formatDate(item.createdAt)}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Reporter:</strong> ${item.owner?.name || 'N/A'} (${item.owner?.email || 'N/A'})</p>
                ${item.rejectionReason ? `<p style="margin-bottom: 0.5rem;"><strong>Rejection Reason:</strong> ${item.rejectionReason}</p>` : ''}
                <p style="margin-top: 1rem; color: var(--gray-700);">${item.description}</p>

                ${item.status === 'pending' ? `
                    <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                        <button class="btn btn-secondary" style="flex: 1;" onclick="setItemStatus('${item.id}', 'approved'); document.getElementById('adminModal').classList.remove('show');">Approve</button>
                        <button class="btn btn-danger" style="flex: 1;" onclick="showRejectModal('${item.id}'); document.getElementById('adminModal').classList.remove('show');">Reject</button>
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.add('show');
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.onclick = () => modal.classList.remove('show');
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    };

    if (rejectModalCloseBtn) rejectModalCloseBtn.addEventListener('click', closeRejectModal);
    if (cancelRejectBtn) cancelRejectBtn.addEventListener('click', closeRejectModal);
    if (rejectionModal) {
        rejectionModal.addEventListener('click', (e) => {
            if (e.target === rejectionModal) closeRejectModal();
        });
    }

    if (confirmRejectBtn) {
        confirmRejectBtn.addEventListener('click', async () => {
            const reason = String(rejectionReasonInput?.value || '').trim();
            if (!currentRejectionItemId) return;
            if (!reason) {
                alert('Please provide a rejection reason.');
                return;
            }

            await setItemStatus(currentRejectionItemId, 'rejected', reason);
            closeRejectModal();
        });
    }

    tabButtons.forEach((tab) => {
        tab.addEventListener('click', () => openTab(tab.dataset.tab));
    });

    if (adminSearchBtn) adminSearchBtn.addEventListener('click', () => displayAdminItems(currentTab));
    if (adminSearchInput) {
        adminSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') displayAdminItems(currentTab);
        });
    }
    if (adminCategoryFilter) adminCategoryFilter.addEventListener('change', () => displayAdminItems(currentTab));
    if (adminStatusFilter) adminStatusFilter.addEventListener('change', () => displayAdminItems(currentTab));

    (async () => {
        try {
            await verifySuperAdminSession();
            await loadAdminItems();
            updateStats();
            openTab('pending');
        } catch (error) {
            if (typeof showMessage === 'function') {
                showMessage(error.message || 'Unable to load admin panel.', 'error');
            }
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 700);
        }
    })();
});
