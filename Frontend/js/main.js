// ==========================================
// CUET Lost & Found Box - Main JavaScript
// Common functionality across all pages
// ==========================================

// ==========================================
// Mobile Navigation Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Create overlay element for mobile menu backdrop
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        document.body.appendChild(overlay);

        function openMenu() {
            navMenu.classList.add('active');
            overlay.style.display = 'block';
            requestAnimationFrame(() => { overlay.style.opacity = '1'; });
            document.body.style.overflow = 'hidden';
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            overlay.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 300);
            document.body.style.overflow = '';
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }

        hamburger.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMenu);

        // Close menu when clicking a nav link
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on window resize (if viewport becomes desktop size)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
});

// ==========================================
// Backend Item Data
// ==========================================
const MAIN_API_BASE_URL =
    'https://cuet-lost-found-box.onrender.com/api';
let liveItems = [];

function getAuthToken() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    const normalizedToken = String(token).trim();
    if (!normalizedToken || normalizedToken === 'null' || normalizedToken === 'undefined') {
        return '';
    }
    return normalizedToken;
}

function normalizeItem(item) {
    return {
        id: item.id,
        type: (item.itemType || '').toLowerCase(),
        name: item.title || 'Untitled Item',
        category: item.category || 'other',
        description: item.description || '',
        location: item.location || 'Unknown',
        date: item.createdAt,
        image: item.imageUrl || '',
        reporter: item.owner?.name || 'Anonymous User',
        contact: item.owner?.email || 'Not provided'
    };
}

async function fetchItems() {
    const token = getAuthToken();
    const hasSession = Boolean(localStorage.getItem('currentSession') || sessionStorage.getItem('currentSession'));

    if (!token && !hasSession) {
        liveItems = [];
        return;
    }

    if (!token && hasSession) {
        // Prevent stale session state from making unauthorized requests on home load.
        localStorage.removeItem('currentSession');
        sessionStorage.removeItem('currentSession');
        liveItems = [];
        return;
    }

    const response = await fetch(`${MAIN_API_BASE_URL}/items`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        liveItems = [];
        return;
    }

    const result = await response.json();
    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch items.');
    }

    liveItems = (result.data || []).map(normalizeItem);
}

// ==========================================
// Display Recent Items on Home Page
// ==========================================
async function displayRecentItems() {
    const grid = document.getElementById('recentItemsGrid');
    if (!grid) return;

    const token = getAuthToken();
    if (!token) {
        grid.innerHTML = '';
        return;
    }

    try {
        await fetchItems();
    } catch (error) {
        grid.innerHTML = '<p style="text-align:center; color: var(--gray-600);">Unable to load recent reports right now.</p>';
        return;
    }
    
    // Get only the 6 most recent items
    const recentItems = liveItems
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);

    if (recentItems.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color: var(--gray-600);">No reports available yet.</p>';
        return;
    }
    
    grid.innerHTML = recentItems.map(item => createItemCard(item)).join('');
    
    // Add click event to each card
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            showItemModal(itemId);
        });
    });
}

// ==========================================
// Create Item Card HTML
// ==========================================
function createItemCard(item) {
    const statusClass = item.type === 'lost' ? 'status-lost' : 'status-found';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    return `
        <div class="item-card" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-content">
                <span class="item-status ${statusClass}">${statusText}</span>
                <h3 class="item-title">${item.name}</h3>
                <p class="item-category">📂 ${getCategoryName(item.category)}</p>
                <p class="item-location">📍 ${item.location}</p>
                <p class="item-date">📅 ${formatDate(item.date)}</p>
            </div>
        </div>
    `;
}

// ==========================================
// Get Category Display Name
// ==========================================
function getCategoryName(category) {
    const categories = {
        'electronics': 'Electronics',
        'accessories': 'Accessories',
        'clothing': 'Clothing',
        'books': 'Books & Stationery',
        'documents': 'Documents',
        'keys': 'Keys & Cards',
        'sports': 'Sports Equipment',
        'other': 'Other'
    };
    return categories[category] || category;
}

// ==========================================
// Format Date
// ==========================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ==========================================
// Show Item Detail Modal
// ==========================================
function showItemModal(itemId) {
    const item = liveItems.find(i => i.id == itemId);
    if (!item) return;
    
    const modal = document.getElementById('itemModal');
    if (!modal) return;
    
    const modalBody = document.getElementById('modalBody');
    const statusClass = item.type === 'lost' ? 'status-lost' : 'status-found';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    modalBody.innerHTML = `
        <div style="padding: 2rem;">
            <img src="${item.image || ''}" alt="${item.name}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem;">
            <span class="item-status ${statusClass}" style="font-size: 1rem;">${statusText} Item</span>
            <h2 style="margin: 1rem 0; font-size: 2rem; color: var(--gray-900);">${item.name}</h2>
            <div style="margin: 1.5rem 0;">
                <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📂 Category:</strong> ${getCategoryName(item.category)}</p>
                <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📍 Location:</strong> ${item.location}</p>
                <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📅 Date:</strong> ${formatDate(item.date)}</p>
                <p style="margin-bottom: 0.75rem; color: var(--gray-700);"><strong>📝 Description:</strong> ${item.description}</p>
            </div>
            <div style="background: var(--gray-50); padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
                <p style="margin-bottom: 0.5rem; color: var(--gray-700);"><strong>Reporter:</strong> ${item.reporter}</p>
                <p style="color: var(--gray-700);"><strong>Contact:</strong> ${item.contact}</p>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => modal.classList.remove('show');
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    };
}

// ==========================================
// Success/Error Message Display
// ==========================================
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Initialize on Page Load
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        displayRecentItems();
    });
} else {
    displayRecentItems();
}

// Export functions for use in other modules
window.mockItems = liveItems;
window.createItemCard = createItemCard;
window.showItemModal = showItemModal;
window.showMessage = showMessage;
window.getCategoryName = getCategoryName;
window.formatDate = formatDate;
