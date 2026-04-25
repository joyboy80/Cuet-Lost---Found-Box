// ==========================================
// CUET Lost & Found - User Dashboard
// User profile and reports management
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'https://cuet-lost-found-box.onrender.com/api';

    // Check authentication
    if (!requireAuth('user')) return;

    let currentUser = null;
    let userItems = [];
    let successfulPosts = [];

    function getAuthToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }

    async function fetchUserProfile() {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Missing auth token. Please login again.');
        }

        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to load profile');
        }

        return result.data;
    }
    
    // ==========================================
    // Display User Information
    // ==========================================
    function displayUserInfo() {
        // Set user name and student ID
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userWelcome').textContent = `Welcome back, ${currentUser.name}!`;
        
        // Set user category badge
        const categoryIcons = {
            'student': '👨‍🎓 Student',
            'teacher': '👨‍🏫 Teacher',
            'staff': '👔 Staff',
            'user': '👤 User',
            'admin': '🛡️ Admin',
            'super-admin': '👑 Super Admin'
        };
        document.getElementById('userCategory').textContent = categoryIcons[currentUser.role] || currentUser.role || '👤 User';
        
        // Set department if exists
        const deptBadge = document.getElementById('userDepartment');
        if (currentUser.department) {
            deptBadge.style.display = 'inline-flex';
            deptBadge.textContent = currentUser.department;
        } else {
            deptBadge.style.display = 'none';
        }
        
        // Set user initials
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const initialsEl = document.getElementById('userInitials');
        const avatarEl = document.querySelector('.user-avatar');

        initialsEl.textContent = initials;

        if (currentUser.profileImage) {
            avatarEl.style.backgroundImage = `url(${currentUser.profileImage})`;
            avatarEl.style.backgroundSize = 'cover';
            avatarEl.style.backgroundPosition = 'center';
            initialsEl.style.display = 'none';
        } else {
            avatarEl.style.backgroundImage = '';
            initialsEl.style.display = 'inline';
        }
    }

    async function uploadProfileImage(file) {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Missing auth token. Please login again.');
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to upload profile image');
        }

        return result.data;
    }

    async function fetchUserItems() {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Missing auth token. Please login again.');
        }

        const response = await fetch(`${API_BASE_URL}/items/my-items`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to load your reported items');
        }

        return result.data || [];
    }

    async function fetchSuccessfulPosts() {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Missing auth token. Please login again.');
        }

        const response = await fetch(`${API_BASE_URL}/user/successful-posts`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to load successful posts');
        }

        return result.data || [];
    }
    
    // ==========================================
    // Calculate User Statistics
    // ==========================================
    function calculateStats() {
        const userLostItems = userItems.filter(item => item.itemType === 'Lost');
        const userFoundItems = userItems.filter(item => item.itemType === 'Found');
        
        const matchedItems = successfulPosts.length;
        
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

    function displaySuccessfulPosts() {
        const successfulGrid = document.getElementById('successfulPostsGrid');
        const noSuccessfulPosts = document.getElementById('noSuccessfulPosts');

        if (!successfulGrid || !noSuccessfulPosts) {
            return;
        }

        if (!successfulPosts.length) {
            successfulGrid.style.display = 'none';
            noSuccessfulPosts.style.display = 'flex';
            return;
        }

        successfulGrid.style.display = 'grid';
        noSuccessfulPosts.style.display = 'none';

        successfulGrid.innerHTML = successfulPosts
            .map((post) => `
                <article class="successful-post-card">
                    ${post.itemImageUrl ? `<img src="${post.itemImageUrl}" alt="${post.itemTitle || 'Matched Item'}" class="successful-post-image">` : ''}
                    <h3>${post.itemTitle || 'Matched Item'}</h3>
                    <p class="successful-post-message">${post.adminMessage || 'Your lost item has been successfully matched with a found item.'}</p>
                    <p class="successful-post-message" style="margin-bottom: 0.5rem;"><strong>Matched With:</strong> ${post.otherUser?.name || 'N/A'}</p>
                    <p class="successful-post-date">📧 ${post.otherUser?.email || 'N/A'}</p>
                    <p class="successful-post-date">📞 ${post.otherUser?.phone || 'N/A'}</p>
                    <p class="successful-post-date">🏫 ${post.otherUser?.department || 'N/A'}</p>
                    <p class="successful-post-date">📅 ${formatDate(post.matchDate)}</p>
                </article>
            `)
            .join('');
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
        const normalizedStatus = String(item.status || '').toLowerCase();
        const statusClass = {
            'pending': 'bg-warning-light',
            'approved': 'bg-success-light',
            'rejected': 'bg-danger-light',
            'matched': 'bg-success-light'
        }[normalizedStatus] || 'bg-warning-light';
        
        const statusText = {
            'pending': '⏳ Pending Review',
            'approved': '✅ Approved',
            'rejected': '❌ Rejected',
            'matched': '🤝 Matched'
        }[normalizedStatus] || item.status;
        
        return `
            <div class="item-card" onclick="viewItemDetails('${item.id}', '${type}')">
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title || item.itemName || item.name}" class="item-image">` : `
                    <div class="item-image" style="background: var(--gray-200); display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                        ${type === 'lost' ? '📋' : '✅'}
                    </div>
                `}
                <div class="item-content">
                    <span class="item-status ${statusClass.replace('bg-', 'status-').replace('-light', '')}" style="padding: 4px 12px; border-radius: 12px; font-size: 0.85rem;">
                        ${statusText}
                    </span>
                    <h3 class="item-title">${item.title || item.itemName || item.name}</h3>
                    <p class="item-category">📂 ${getCategoryName(item.category)}</p>
                    <p class="item-location">📍 ${item.location}</p>
                    <p class="item-date">📅 ${formatDate(item.createdAt || item.date || item.dateLost || item.dateFound)}</p>
                </div>
            </div>
        `;
    }
    
    // ==========================================
    // View Item Details
    // ==========================================
    window.viewItemDetails = function(itemId, type) {
        const item = userItems.find(i => i.id == itemId);
        if (!item) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 640px;">
                <span class="modal-close">&times;</span>
                <div style="padding: 2rem;">
                    <img src="${item.imageUrl || ''}" alt="${item.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1.25rem; object-fit: cover; max-height: 320px;">
                    <h2 style="margin-bottom: 0.75rem;">${item.title}</h2>
                    <p style="margin-bottom: 0.5rem;"><strong>Type:</strong> ${item.itemType}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Category:</strong> ${getCategoryName(item.category)}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Location:</strong> ${item.location}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Status:</strong> ${item.status}</p>
                    <p style="margin-top: 1rem; color: var(--gray-700);">${item.description || ''}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
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
                            <p style="font-weight: 600; color: var(--gray-900);">${currentUser.name}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Email</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${currentUser.email}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Category</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${(currentUser.role || 'user').toUpperCase()}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-500); font-size: 0.85rem; margin-bottom: 0.25rem;">Department</p>
                            <p style="font-weight: 600; color: var(--gray-900);">${currentUser.department || 'Not Specified'}</p>
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
    
    const avatarInput = document.getElementById('avatarInput');
    const chooseAvatarBtn = document.getElementById('chooseAvatarBtn');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');

    if (chooseAvatarBtn && avatarInput) {
        chooseAvatarBtn.addEventListener('click', () => avatarInput.click());
    }

    if (uploadAvatarBtn && avatarInput) {
        uploadAvatarBtn.addEventListener('click', async function() {
            await handleImageUpload();
        });
    }

    async function handleImageUpload() {
        if (!uploadAvatarBtn || !avatarInput) {
            return;
        }

            const selectedFile = avatarInput.files && avatarInput.files[0];

            if (!selectedFile) {
                showMessage('Please choose an image first.', 'error');
                return;
            }

            const originalText = uploadAvatarBtn.textContent;
            uploadAvatarBtn.disabled = true;
            uploadAvatarBtn.textContent = 'Uploading...';

            try {
                const updatedProfile = await uploadProfileImage(selectedFile);
                currentUser = { ...currentUser, ...updatedProfile };

                const session = getCurrentSession();
                if (session && session.user) {
                    session.user = { ...session.user, ...updatedProfile };
                    if (localStorage.getItem('currentSession')) {
                        localStorage.setItem('currentSession', JSON.stringify(session));
                    } else {
                        sessionStorage.setItem('currentSession', JSON.stringify(session));
                    }
                }

                displayUserInfo();
                showMessage('Profile image updated successfully.', 'success');
            } catch (error) {
                showMessage(error.message || 'Failed to upload profile image.', 'error');
            } finally {
                uploadAvatarBtn.disabled = false;
                uploadAvatarBtn.textContent = originalText;
            }
    }

    async function loadDashboard() {
        try {
            currentUser = await fetchUserProfile();
            userItems = await fetchUserItems();
            successfulPosts = await fetchSuccessfulPosts();
            displayUserInfo();
            displaySuccessfulPosts();
            displayReports();
        } catch (error) {
            showMessage(error.message || 'Failed to load dashboard profile.', 'error');
            if (error.message && error.message.toLowerCase().includes('token')) {
                logout();
            }
        }
    }

    // ==========================================
    // Initialize Dashboard
    // ==========================================
    window.loadDashboard = loadDashboard;
    window.handleImageUpload = handleImageUpload;

    loadDashboard();
});
