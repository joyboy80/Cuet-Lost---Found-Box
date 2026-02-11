// ==========================================
// CUET Lost & Found Box - Search & Filter JS
// Search, filter, and display items
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // Initialize Variables
    // ==========================================
    let allItems = [...mockItems]; // Copy mock items
    let filteredItems = [...allItems];
    let currentFilters = {
        search: '',
        status: 'all',
        category: '',
        dateFrom: '',
        dateTo: '',
        location: ''
    };
    
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFromInput = document.getElementById('dateFrom');
    const dateToInput = document.getElementById('dateTo');
    const locationFilter = document.getElementById('locationFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const itemsGrid = document.getElementById('itemsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // View toggle buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // ==========================================
    // Load Items from LocalStorage (Demo)
    // ==========================================
    function loadStoredItems() {
        const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
        const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
        
        // Merge with mock items
        allItems = [...mockItems, ...lostItems, ...foundItems];
        filteredItems = [...allItems];
    }
    
    // ==========================================
    // Display Items
    // ==========================================
    function displayItems(items) {
        if (items.length === 0) {
            itemsGrid.style.display = 'none';
            noResults.style.display = 'block';
            resultsCount.innerHTML = 'Showing <strong>0</strong> items';
            return;
        }
        
        itemsGrid.style.display = 'grid';
        noResults.style.display = 'none';
        
        itemsGrid.innerHTML = items.map(item => createItemCard(item)).join('');
        resultsCount.innerHTML = `Showing <strong>${items.length}</strong> item${items.length !== 1 ? 's' : ''}`;
        
        // Add click event to each card
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', function() {
                const itemId = this.dataset.itemId;
                showItemModal(itemId);
            });
        });
    }
    
    // ==========================================
    // Filter Items
    // ==========================================
    function filterItems() {
        showLoading();
        
        setTimeout(() => {
            filteredItems = allItems.filter(item => {
                // Search filter
                if (currentFilters.search) {
                    const searchTerm = currentFilters.search.toLowerCase();
                    const matchesSearch = 
                        item.name.toLowerCase().includes(searchTerm) ||
                        item.description.toLowerCase().includes(searchTerm) ||
                        item.location.toLowerCase().includes(searchTerm);
                    
                    if (!matchesSearch) return false;
                }
                
                // Status filter
                if (currentFilters.status !== 'all' && item.type !== currentFilters.status) {
                    return false;
                }
                
                // Category filter
                if (currentFilters.category && item.category !== currentFilters.category) {
                    return false;
                }
                
                // Date range filter
                const itemDate = new Date(item.date);
                if (currentFilters.dateFrom) {
                    const fromDate = new Date(currentFilters.dateFrom);
                    if (itemDate < fromDate) return false;
                }
                if (currentFilters.dateTo) {
                    const toDate = new Date(currentFilters.dateTo);
                    if (itemDate > toDate) return false;
                }
                
                // Location filter
                if (currentFilters.location) {
                    const locationMatch = item.location.toLowerCase().includes(currentFilters.location.toLowerCase());
                    if (!locationMatch) return false;
                }
                
                return true;
            });
            
            hideLoading();
            displayItems(filteredItems);
        }, 300); // Simulate loading delay
    }
    
    // ==========================================
    // Show/Hide Loading
    // ==========================================
    function showLoading() {
        loadingIndicator.style.display = 'block';
        itemsGrid.style.display = 'none';
        noResults.style.display = 'none';
    }
    
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }
    
    // ==========================================
    // Event Listeners
    // ==========================================
    
    // Search button
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            currentFilters.search = searchInput.value.trim();
            filterItems();
        });
    }
    
    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentFilters.search = this.value.trim();
                filterItems();
            }
        });
    }
    
    // Status filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentFilters.status = this.dataset.filter;
            filterItems();
        });
    });
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            filterItems();
        });
    }
    
    // Date filters
    if (dateFromInput) {
        dateFromInput.addEventListener('change', function() {
            currentFilters.dateFrom = this.value;
            filterItems();
        });
    }
    
    if (dateToInput) {
        dateToInput.addEventListener('change', function() {
            currentFilters.dateTo = this.value;
            filterItems();
        });
    }
    
    // Location filter
    if (locationFilter) {
        locationFilter.addEventListener('change', function() {
            currentFilters.location = this.value;
            filterItems();
        });
    }
    
    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset all filters
            currentFilters = {
                search: '',
                status: 'all',
                category: '',
                dateFrom: '',
                dateTo: '',
                location: ''
            };
            
            // Reset UI
            searchInput.value = '';
            categoryFilter.value = '';
            dateFromInput.value = '';
            dateToInput.value = '';
            locationFilter.value = '';
            
            // Reset status buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                }
            });
            
            filterItems();
        });
    }
    
    // View toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            if (view === 'list') {
                itemsGrid.style.gridTemplateColumns = '1fr';
            } else {
                itemsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            }
        });
    });
    
    // ==========================================
    // Override showItemModal to use allItems
    // ==========================================
    window.showItemModal = function(itemId) {
        const item = allItems.find(i => i.id == itemId);
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
                    <p style="margin-bottom: 0.5rem; color: var(--gray-700);"><strong>Contact Information:</strong></p>
                    <p style="color: var(--gray-600); font-size: 0.9rem;">To protect privacy, contact details are only shared after admin verification.</p>
                    <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="requestContact('${item.id}')">Request Contact Info</button>
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
    };
    
    // Request contact info function
    window.requestContact = function(itemId) {
        showMessage('Contact request sent! You will be notified when the reporter responds.', 'success');
        const modal = document.getElementById('itemModal');
        if (modal) modal.classList.remove('show');
    };
    
    // ==========================================
    // Initialize
    // ==========================================
    loadStoredItems();
    displayItems(filteredItems);
});
