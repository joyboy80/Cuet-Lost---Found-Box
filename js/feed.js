// ==========================================
// CUET Lost & Found - Community Feed
// Display all lost and found posts from users
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    let allPosts = [];
    let filteredPosts = [];
    let currentFilter = 'all';
    let currentCategory = '';
    let currentSort = 'recent';
    
    const feedContainer = document.getElementById('feedContainer');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // ==========================================
    // Load All Posts
    // ==========================================
    function loadPosts() {
        loadingIndicator.style.display = 'block';
        
        // Get lost and found items from localStorage
        const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
        const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Combine and format posts
        allPosts = [
            ...lostItems.map(item => ({
                ...item,
                type: 'lost',
                postedBy: getUserInfo(item.email, users)
            })),
            ...foundItems.map(item => ({
                ...item,
                type: 'found',
                postedBy: getUserInfo(item.email, users)
            }))
        ];
        
        // Filter only approved items
        allPosts = allPosts.filter(post => post.status === 'approved');
        
        loadingIndicator.style.display = 'none';
        applyFilters();
    }
    
    // ==========================================
    // Get User Information
    // ==========================================
    function getUserInfo(email, users) {
        const user = users.find(u => u.email === email);
        if (user) {
            return {
                name: user.fullName,
                email: user.email,
                category: user.category,
                department: user.department ? DEPARTMENTS[user.department] : 'N/A'
            };
        }
        return {
            name: 'Anonymous User',
            email: email,
            category: 'unknown',
            department: 'N/A'
        };
    }
    
    // ==========================================
    // Apply Filters
    // ==========================================
    function applyFilters() {
        filteredPosts = allPosts.filter(post => {
            // Filter by type
            if (currentFilter !== 'all' && post.type !== currentFilter) {
                return false;
            }
            
            // Filter by category
            if (currentCategory && post.category !== currentCategory) {
                return false;
            }
            
            return true;
        });
        
        // Apply sorting
        if (currentSort === 'recent') {
            filteredPosts.sort((a, b) => new Date(b.date || b.dateLost || b.dateFound) - new Date(a.date || a.dateLost || a.dateFound));
        } else {
            filteredPosts.sort((a, b) => new Date(a.date || a.dateLost || a.dateFound) - new Date(b.date || b.dateLost || b.dateFound));
        }
        
        displayPosts();
    }
    
    // ==========================================
    // Display Posts
    // ==========================================
    function displayPosts() {
        if (filteredPosts.length === 0) {
            feedContainer.innerHTML = '';
            noPostsMessage.style.display = 'block';
            return;
        }
        
        noPostsMessage.style.display = 'none';
        
        feedContainer.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
    }
    
    // ==========================================
    // Create Post Card
    // ==========================================
    function createPostCard(post) {
        const typeIcon = post.type === 'lost' ? '📋' : '✅';
        const typeBadge = post.type === 'lost' ? 
            '<span class="status-pending" style="background: var(--danger-light); color: var(--danger);">Lost Item</span>' :
            '<span class="status-approved" style="background: var(--success-light); color: var(--success);">Found Item</span>';
        
        const categoryIcon = getCategoryIcon(post.category);
        const timeAgo = getTimeAgo(post.date || post.dateLost || post.dateFound);
        
        return `
            <div class="feed-post" style="background: linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(40, 40, 70, 0.8) 100%); backdrop-filter: blur(10px); border: 2px solid rgba(167, 139, 250, 0.3); border-radius: var(--radius-2xl); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;" onclick="viewPostDetails('${post.id}', '${post.type}')" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 16px 48px rgba(102, 126, 234, 0.3)'; this.style.background='linear-gradient(135deg, rgba(40, 40, 70, 0.9) 0%, rgba(60, 50, 90, 0.9) 100%)'; this.style.borderColor='rgba(167, 139, 250, 0.6)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(0, 0, 0, 0.4)'; this.style.background='linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(40, 40, 70, 0.8) 100%)'; this.style.borderColor='rgba(167, 139, 250, 0.3)';">
                <div class="post-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="user-avatar" style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
                            ${post.postedBy.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #ffffff; font-size: 1rem; font-weight: 700;">${post.postedBy.name}</h4>
                            <p style="margin: 0; color: #ffffff; font-size: 0.85rem; font-weight: 600; opacity: 0.95;">${post.postedBy.department} • ${timeAgo}</p>
                        </div>
                    </div>
                    ${typeBadge}
                </div>
                
                <div class="post-content" style="margin-bottom: 1rem;">
                    <div style="display: flex; gap: 1rem; align-items: start;">
                        ${post.image ? `
                            <img src="${post.image}" alt="${post.itemName || post.name}" 
                                 style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">
                        ` : `
                            <div style="width: 120px; height: 120px; background: var(--gray-100); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; flex-shrink: 0;">
                                ${typeIcon}
                            </div>
                        `}
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; color: #ffffff; font-size: 1.25rem; font-weight: 700; text-shadow: 0 2px 8px rgba(167, 139, 250, 0.5);">${post.itemName || post.name}</h3>
                            <p style="color: #ffffff; margin-bottom: 0.75rem; line-height: 1.6; font-weight: 600;">
                                ${(post.description || '').substring(0, 150)}${(post.description || '').length > 150 ? '...' : ''}
                            </p>
                            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                                <span style="color: #ffffff; font-size: 0.9rem; font-weight: 600;">
                                    ${categoryIcon} ${getCategoryName(post.category)}
                                </span>
                                <span style="color: #ffffff; font-size: 0.9rem; font-weight: 600;">
                                    📍 ${post.location}
                                </span>
                                <span style="color: #ffffff; font-size: 0.9rem; font-weight: 600;">
                                    📅 ${formatDate(post.date || post.dateLost || post.dateFound)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="post-actions" style="display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(167, 139, 250, 0.3);">
                    <button class="btn btn-outline" style="flex: 1; padding: 0.6rem;" onclick="event.stopPropagation(); viewPostDetails('${post.id}', '${post.type}')">
                        👁️ View Details
                    </button>
                    <button class="btn btn-primary" style="flex: 1; padding: 0.6rem;" onclick="event.stopPropagation(); contactOwner('${post.id}', '${post.type}')">
                        📧 Contact
                    </button>
                </div>
            </div>
        `;
    }
    
    // ==========================================
    // Get Category Icon
    // ==========================================
    function getCategoryIcon(category) {
        const icons = {
            'electronics': '📱',
            'documents': '📄',
            'accessories': '⌚',
            'clothing': '👕',
            'books': '📚',
            'bags': '🎒',
            'keys': '🔑',
            'sports': '⚽',
            'other': '📦'
        };
        return icons[category] || '📦';
    }
    
    // ==========================================
    // Get Time Ago
    // ==========================================
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
    
    // ==========================================
    // View Post Details
    // ==========================================
    window.viewPostDetails = function(itemId, type) {
        showItemModal(itemId);
    };
    
    // ==========================================
    // Contact Owner
    // ==========================================
    window.contactOwner = function(itemId, type) {
        const items = type === 'lost' ? 
            JSON.parse(localStorage.getItem('lostItems') || '[]') :
            JSON.parse(localStorage.getItem('foundItems') || '[]');
        
        const item = items.find(i => i.id == itemId);
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
                        <p style="margin-bottom: 0.75rem;"><strong>Name:</strong> ${item.contactName || 'Not provided'}</p>
                        <p style="margin-bottom: 0.75rem;"><strong>Email:</strong> ${item.email || 'Not provided'}</p>
                        <p style="margin-bottom: 0;"><strong>Phone:</strong> ${item.phone || 'Not provided'}</p>
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
    
    // ==========================================
    // Filter Event Listeners
    // ==========================================
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
    
    // ==========================================
    // Initialize
    // ==========================================
    loadPosts();
});
