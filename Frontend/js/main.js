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
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }
});

// ==========================================
// Mock Data for Recent Items
// ==========================================
const mockItems = [
    {
        id: 1,
        type: 'lost',
        name: 'Blue Backpack',
        category: 'accessories',
        description: 'Navy blue backpack with laptop compartment, found near library entrance',
        location: 'Main Library',
        date: '2026-01-28',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        reporter: 'John Doe',
        contact: 'john@example.com'
    },
    {
        id: 2,
        type: 'found',
        name: 'iPhone 13',
        category: 'electronics',
        description: 'Black iPhone 13 with blue case, found in cafeteria',
        location: 'Cafeteria',
        date: '2026-01-29',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
        reporter: 'Jane Smith',
        contact: 'jane@example.com'
    },
    {
        id: 3,
        type: 'lost',
        name: 'Student ID Card',
        category: 'documents',
        description: 'Student ID card belonging to Muhammad Rahman, ID: 19XXXXXX',
        location: 'Building 3',
        date: '2026-01-27',
        image: 'https://images.unsplash.com/photo-1589395937658-0e7d895d6580?w=400&h=300&fit=crop',
        reporter: 'Sarah Ahmed',
        contact: 'sarah@example.com'
    },
    {
        id: 4,
        type: 'found',
        name: 'Red Umbrella',
        category: 'other',
        description: 'Red folding umbrella found near the entrance',
        location: 'Main Entrance',
        date: '2026-01-30',
        image: 'https://images.unsplash.com/photo-1558805111-86190f18cd89?w=400&h=300&fit=crop',
        reporter: 'Ali Hassan',
        contact: 'ali@example.com'
    },
    {
        id: 5,
        type: 'lost',
        name: 'Calculus Textbook',
        category: 'books',
        description: 'Calculus textbook with blue cover, notes inside',
        location: 'Computer Lab',
        date: '2026-01-26',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
        reporter: 'Maria Khan',
        contact: 'maria@example.com'
    },
    {
        id: 6,
        type: 'found',
        name: 'AirPods Pro',
        category: 'electronics',
        description: 'White AirPods Pro with charging case',
        location: 'Library Study Room',
        date: '2026-01-29',
        image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop',
        reporter: 'Ahmed Ali',
        contact: 'ahmed@example.com'
    }
];

// ==========================================
// Display Recent Items on Home Page
// ==========================================
function displayRecentItems() {
    const grid = document.getElementById('recentItemsGrid');
    if (!grid) return;
    
    // Get only the 6 most recent items
    const recentItems = mockItems.slice(0, 6);
    
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
    const item = mockItems.find(i => i.id == itemId);
    if (!item) return;
    
    const modal = document.getElementById('itemModal');
    if (!modal) return;
    
    const modalBody = document.getElementById('modalBody');
    const statusClass = item.type === 'lost' ? 'status-lost' : 'status-found';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    modalBody.innerHTML = `
        <div style="padding: 2rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem;">
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
    document.addEventListener('DOMContentLoaded', displayRecentItems);
} else {
    displayRecentItems();
}

// Export functions for use in other modules
window.mockItems = mockItems;
window.createItemCard = createItemCard;
window.showItemModal = showItemModal;
window.showMessage = showMessage;
window.getCategoryName = getCategoryName;
window.formatDate = formatDate;
