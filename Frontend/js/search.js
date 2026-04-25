// ==========================================
// CUET Lost & Found Box - Search & Filter JS
// Backend API driven item search
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'https://cuet-lost-found-box.onrender.com/api';

    let allItems = [];
    let filteredItems = [];
    let currentFilters = {
        search: '',
        status: 'all',
        category: '',
        dateFrom: '',
        dateTo: '',
        location: ''
    };

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

    const filterButtons = document.querySelectorAll('.filter-btn');
    const viewButtons = document.querySelectorAll('.view-btn');

    function getAuthToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }

    function normalizeItem(item) {
        return {
            id: item.id,
            name: item.title || 'Untitled Item',
            description: item.description || '',
            category: item.category || 'other',
            location: item.location || '',
            date: item.createdAt,
            type: (item.itemType || '').toLowerCase(),
            image: item.imageUrl || '',
            status: (item.status || 'Pending').toLowerCase(),
            owner: item.owner || null
        };
    }

    async function loadItems() {
        const token = getAuthToken();
        if (!token) {
            showMessage('Please login to search items.', 'error');
            window.location.href = 'login.html';
            return;
        }

        showLoading();

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

            allItems = (result.data || []).map(normalizeItem);
            filteredItems = [...allItems];
            hideLoading();
            displayItems(filteredItems);
        } catch (error) {
            hideLoading();
            allItems = [];
            filteredItems = [];
            displayItems(filteredItems);
            showMessage(error.message || 'Unable to load items from server.', 'error');
        }
    }

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

        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', function() {
                const itemId = this.dataset.itemId;
                showItemModal(itemId);
            });
        });
    }

    function filterItems() {
        showLoading();

        filteredItems = allItems.filter(item => {
            if (currentFilters.search) {
                const searchTerm = currentFilters.search.toLowerCase();
                const matchesSearch =
                    item.name.toLowerCase().includes(searchTerm) ||
                    item.description.toLowerCase().includes(searchTerm) ||
                    item.location.toLowerCase().includes(searchTerm);

                if (!matchesSearch) return false;
            }

            if (currentFilters.status !== 'all' && item.type !== currentFilters.status) {
                return false;
            }

            if (currentFilters.category && item.category !== currentFilters.category) {
                return false;
            }

            const itemDate = new Date(item.date);
            if (currentFilters.dateFrom) {
                const fromDate = new Date(currentFilters.dateFrom);
                if (itemDate < fromDate) return false;
            }
            if (currentFilters.dateTo) {
                const toDate = new Date(currentFilters.dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (itemDate > toDate) return false;
            }

            if (currentFilters.location) {
                const locationMatch = item.location.toLowerCase().includes(currentFilters.location.toLowerCase());
                if (!locationMatch) return false;
            }

            return true;
        });

        hideLoading();
        displayItems(filteredItems);
    }

    function showLoading() {
        loadingIndicator.style.display = 'block';
        itemsGrid.style.display = 'none';
        noResults.style.display = 'none';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            currentFilters.search = searchInput.value.trim();
            filterItems();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentFilters.search = this.value.trim();
                filterItems();
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentFilters.status = this.dataset.filter;
            filterItems();
        });
    });

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            filterItems();
        });
    }

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

    if (locationFilter) {
        locationFilter.addEventListener('change', function() {
            currentFilters.location = this.value;
            filterItems();
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            currentFilters = {
                search: '',
                status: 'all',
                category: '',
                dateFrom: '',
                dateTo: '',
                location: ''
            };

            searchInput.value = '';
            categoryFilter.value = '';
            dateFromInput.value = '';
            dateToInput.value = '';
            locationFilter.value = '';

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                }
            });

            filterItems();
        });
    }

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

    window.showItemModal = function(itemId) {
        const item = allItems.find(i => i.id === itemId);
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

    window.requestContact = function() {
        showMessage('Please use the details shown in the item modal to contact the reporter.', 'success');
        const modal = document.getElementById('itemModal');
        if (modal) modal.classList.remove('show');
    };

    window.loadItems = loadItems;
    loadItems();
});
