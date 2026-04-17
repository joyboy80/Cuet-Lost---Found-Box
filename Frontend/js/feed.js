// ==========================================
// CUET Lost & Found - Community Feed
// Backend-driven feed for all reported items
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:5000/api';

    let allPosts = [];
    let filteredPosts = [];
    let currentFilter = 'all';
    let currentCategory = '';
    let currentSort = 'recent';

    const feedContainer = document.getElementById('feedContainer');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');

    function getAuthToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }

    function normalizeItem(item) {
        return {
            id: item.id,
            type: (item.itemType || '').toLowerCase(),
            title: item.title || 'Untitled Item',
            description: item.description || '',
            category: item.category || 'other',
            location: item.location || 'Unknown',
            imageUrl: item.imageUrl || '',
            status: (item.status || 'Pending').toLowerCase(),
            createdAt: item.createdAt,
            owner: item.owner || null,
        };
    }

    async function loadItems() {
        const token = getAuthToken();
        if (!token) {
            showMessage('Please login to view the feed.', 'error');
            window.location.href = 'login.html';
            return;
        }

        loadingIndicator.style.display = 'block';

        try {
            const response = await fetch(`${API_BASE_URL}/items`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to load items.');
            }

            allPosts = (result.data || [])
                .map(normalizeItem)
                .filter((item) => item.status === 'approved');
            applyFilters();
        } catch (error) {
            allPosts = [];
            filteredPosts = [];
            feedContainer.innerHTML = '';
            noPostsMessage.style.display = 'block';
            showMessage(error.message || 'Unable to load feed items.', 'error');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function applyFilters() {
        filteredPosts = allPosts.filter(post => {
            if (currentFilter !== 'all' && post.type !== currentFilter) {
                return false;
            }

            if (currentCategory && post.category !== currentCategory) {
                return false;
            }

            return true;
        });

        if (currentSort === 'recent') {
            filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        displayPosts();
    }

    function displayPosts() {
        if (filteredPosts.length === 0) {
            feedContainer.innerHTML = '';
            noPostsMessage.style.display = 'block';
            return;
        }

        noPostsMessage.style.display = 'none';
        feedContainer.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
    }

    function createPostCard(post) {
        const typeBadge = post.type === 'lost'
            ? '<span class="status-pending" style="background: var(--danger-light); color: var(--danger);">Lost Item</span>'
            : '<span class="status-approved" style="background: var(--success-light); color: var(--success);">Found Item</span>';

        const ownerName = post.owner?.name || 'Anonymous User';
        const ownerDept = post.owner?.department || 'CUET';
        const initials = ownerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const timeAgo = getTimeAgo(post.createdAt);

        return `
            <div class="feed-post" style="background: linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(40, 40, 70, 0.8) 100%); backdrop-filter: blur(10px); border: 2px solid rgba(167, 139, 250, 0.3); border-radius: var(--radius-2xl); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;" onclick="viewPostDetails('${post.id}')" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 16px 48px rgba(102, 126, 234, 0.3)'; this.style.background='linear-gradient(135deg, rgba(40, 40, 70, 0.9) 0%, rgba(60, 50, 90, 0.9) 100%)'; this.style.borderColor='rgba(167, 139, 250, 0.6)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(0, 0, 0, 0.4)'; this.style.background='linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(40, 40, 70, 0.8) 100%)'; this.style.borderColor='rgba(167, 139, 250, 0.3)';">
                <div class="post-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="user-avatar" style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
                            ${initials}
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #ffffff; font-size: 1rem; font-weight: 700;">${ownerName}</h4>
                            <p style="margin: 0; color: #ffffff; font-size: 0.85rem; font-weight: 600; opacity: 0.95;">${ownerDept} • ${timeAgo}</p>
                        </div>
                    </div>
                    ${typeBadge}
                </div>

                <div class="post-content" style="margin-bottom: 1rem;">
                    <div style="display: flex; gap: 1rem; align-items: start;">
                        ${post.imageUrl ? `
                            <img src="${post.imageUrl}" alt="${post.title}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">
                        ` : `
                            <div style="width: 120px; height: 120px; background: var(--gray-100); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; flex-shrink: 0;">
                                ${post.type === 'lost' ? '📋' : '✅'}
                            </div>
                        `}
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; color: #ffffff; font-size: 1.25rem; font-weight: 700; text-shadow: 0 2px 8px rgba(167, 139, 250, 0.5);">${post.title}</h3>
                            <p style="color: #ffffff; margin-bottom: 0.75rem; line-height: 1.6; font-weight: 600;">
                                ${post.description.substring(0, 150)}${post.description.length > 150 ? '...' : ''}
                            </p>
                            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                                <span style="color: #ffffff; font-size: 0.9rem; font-weight: 600;">📂 ${getCategoryName(post.category)}</span>
                                <span style="color: #ffffff; font-size: 0.9rem; font-weight: 600;">📍 ${post.location}</span>
                                <span style="color: #ffffff; font-size: 0.9rem; font-weight: 600;">📅 ${formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="post-actions" style="display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(167, 139, 250, 0.3);">
                    <button class="btn btn-outline" style="flex: 1; padding: 0.6rem;" onclick="event.stopPropagation(); viewPostDetails('${post.id}')">👁️ View Details</button>
                    <button class="btn btn-primary" style="flex: 1; padding: 0.6rem;" onclick="event.stopPropagation(); contactOwner('${post.id}')">📧 Contact</button>
                </div>
            </div>
        `;
    }

    function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
        if (seconds < 2592000) return Math.floor(seconds / 604800) + ' weeks ago';
        return Math.floor(seconds / 2592000) + ' months ago';
    }

    window.showItemModal = function(itemId) {
        const item = allPosts.find(i => i.id === itemId);
        if (!item) return;

        const modal = document.getElementById('itemModal');
        if (!modal) return;

        const modalBody = document.getElementById('modalBody');
        const statusClass = item.type === 'lost' ? 'status-lost' : 'status-found';
        const statusText = item.type === 'lost' ? 'Lost' : 'Found';

        modalBody.innerHTML = `
            <div style="padding: 2rem;">
                <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem;">
                <span class="item-status ${statusClass}" style="font-size: 1rem;">${statusText} Item</span>
                <h2 style="margin: 1rem 0; font-size: 2rem; color: var(--gray-900);">${item.title}</h2>
                <div style="margin: 1.5rem 0;">
                    <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📂 Category:</strong> ${getCategoryName(item.category)}</p>
                    <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📍 Location:</strong> ${item.location}</p>
                    <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📅 Date:</strong> ${formatDate(item.createdAt)}</p>
                    <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📝 Description:</strong> ${item.description}</p>
                </div>
                <div style="background: var(--gray-50); padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
                    <p style="margin-bottom: 0.5rem; color: var(--gray-700);"><strong>Reporter:</strong> ${item.owner?.name || 'Not available'}</p>
                    <p style="color: var(--gray-700);"><strong>Contact:</strong> ${item.owner?.email || 'Not available'}</p>
                </div>
            </div>
        `;

        modal.classList.add('show');

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.classList.remove('show');

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        };
    };

    window.viewPostDetails = function(itemId) {
        showItemModal(itemId);
    };

    window.contactOwner = function(itemId) {
        const item = allPosts.find(i => i.id === itemId);
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <span class="modal-close">&times;</span>
                <div style="padding: 2rem; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📧</div>
                    <h2 style="margin-bottom: 1rem;">Contact Information</h2>
                    <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 8px; text-align: left; margin-bottom: 1.5rem;">
                        <p style="margin-bottom: 0.75rem;"><strong>Name:</strong> ${item.owner?.name || 'Not provided'}</p>
                        <p style="margin-bottom: 0;"><strong>Email:</strong> ${item.owner?.email || 'Not provided'}</p>
                    </div>
                    <p style="color: var(--gray-600); font-size: 0.9rem;">Please contact the owner to arrange item return.</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    };

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            applyFilters();
        });
    });

    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', function() {
        currentCategory = this.value;
        applyFilters();
    });

    const sortFilter = document.getElementById('sortFilter');
    sortFilter.addEventListener('change', function() {
        currentSort = this.value;
        applyFilters();
    });

    window.loadItems = loadItems;
    loadItems();
});
