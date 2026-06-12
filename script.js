// Data Array to hold products
let products = [];

// DOM Elements
const form = document.getElementById('product-form');
const titleInput = document.getElementById('title');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('image');
const categoryInput = document.getElementById('category');
const productIdInput = document.getElementById('product-id');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

const productGrid = document.getElementById('product-grid');
const emptyState = document.getElementById('empty-state');
const productCount = document.getElementById('product-count');

const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const sortAscBtn = document.getElementById('sort-asc');
const sortDescBtn = document.getElementById('sort-desc');

// Dashboard Stats Elements
const statTotalProducts = document.getElementById('stat-total-products');
const statActiveItems = document.getElementById('stat-active-items');
const statInventoryValue = document.getElementById('stat-inventory-value');

// Direct Current state Wala hai agar tu search karega to
let currentSearchTerm = '';
let currentFilter = 'All';
let currentSort = ''; // 'asc' or 'desc'

// Initialize to kana padegana 
function init() {
    loadProducts();
    displayProducts();
    
    // Add event listeners sared
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const price = parseFloat(priceInput.value);
        const image = imageInput.value.trim();
        const category = categoryInput.value;
        const id = productIdInput.value;
        
        // Validation bhi chahiye merekoooooooo
        if (!title) {
            alert('Please enter a product title.');
            return;
        }
        if (!price || price <= 0) {
            alert('Please enter a valid price greater than 0.');
            return;
        }
        if (!image) {
            alert('Please provide an image URL.');
            return;
        }
        if (!category) {
            alert('Please select a category.');
            return;
        }
        
        // Check if editing or adding nahi to add karna hai
        if (id) {
            updateProduct(id, title, price, image, category);
        } else {
            addProduct(title, price, image, category);
        }
    });

    cancelBtn.addEventListener('click', clearInputs);
    
    searchInput.addEventListener('input', searchProducts);
    filterSelect.addEventListener('change', filterProducts);
    sortAscBtn.addEventListener('click', () => sortProducts('asc'));
    sortDescBtn.addEventListener('click', () => sortProducts('desc'));
    
    // Initialize SPA navigation
    initSPA();
}

// Initialize Single Page App (SPA) Navigation
function initSPA() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const views = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (!targetId) return;

            // Update active class on nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            // Show target view, hide others
            views.forEach(view => {
                if (view.id === targetId) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // Handle global "New Product" button in header
    const globalNewBtn = document.getElementById('global-new-product-btn');
    if (globalNewBtn) {
        globalNewBtn.addEventListener('click', () => {
            // Navigate to products view
            const productsLink = document.querySelector('.nav-links a[data-target="view-products"]');
            if (productsLink) productsLink.click();
            
            // Focus on the form
            setTimeout(() => {
                const titleInput = document.getElementById('title');
                if (titleInput) titleInput.focus();
            }, 100);
        });
    }
}

// Load products when page opens varana submit to nahi kar paunga
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

// Save data to local storage varna sab gaya tera re baba
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Generate unique ID broooo
function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

// Add product Create valu operation
function addProduct(title, price, image, category) {
    const newProduct = {
        id: generateId(),
        title: title,
        price: price,
        image: image,
        category: category
    };
    
    products.push(newProduct);
    saveProducts();
    clearInputs();
    displayProducts();
}

// Update product information huhhhhhhhhhh
function updateProduct(id, title, price, image, category) {
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        products[index] = {
            id: id,
            title: title,
            price: price,
            image: image,
            category: category
        };
        
        saveProducts();
        clearInputs();
        displayProducts();
    }
}

// Edit product...bahot laba ho gaya ye
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Fill inputs
    productIdInput.value = product.id;
    titleInput.value = product.title;
    priceInput.value = product.price;
    imageInput.value = product.image;
    categoryInput.value = product.category;
    
    // Change Add button behavior to Update
    formTitle.textContent = 'Update Product';
    submitBtn.innerHTML = '<i class="ph ph-floppy-disk"></i> Save Changes';
    cancelBtn.classList.remove('hidden');
    
    // Scroll smoothly to form
    const formSection = document.querySelector('.form-section');
    if(formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Delete bhi to karna hai
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        displayProducts();
    }
}

function clearInputs() {
    titleInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
    categoryInput.value = '';
    productIdInput.value = '';
    formTitle.textContent = 'Add New Product';
    submitBtn.innerHTML = '<i class="ph ph-plus"></i> Add Product';
    cancelBtn.classList.add('hidden');
}

function searchProducts(e) {
    currentSearchTerm = e.target.value.toLowerCase();
    displayProducts();
}


function filterProducts(e) {
    currentFilter = e.target.value;
    displayProducts();
}

function sortProducts(direction) {
    currentSort = direction;
    
    if (direction === 'asc') {
        sortAscBtn.classList.add('active');
        sortDescBtn.classList.remove('active');
    } else {
        sortDescBtn.classList.add('active');
        sortAscBtn.classList.remove('active');
    }
    
    displayProducts();
}

// Calculate Dashboard Stats
function updateDashboardStats() {
    if(statTotalProducts) statTotalProducts.textContent = products.length;
    if(statActiveItems) statActiveItems.textContent = products.length;
    if(statInventoryValue) {
        const totalValue = products.reduce((sum, p) => sum + p.price, 0);
        statInventoryValue.textContent = '$' + totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// Display all broo
function displayProducts() {
    let result = [...products];
    
    // Filter by search
    if (currentSearchTerm) {
        result = result.filter(product => 
            product.title.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    if (currentFilter !== 'All') {
        result = result.filter(product => product.category === currentFilter);
    }
    
    // Sort by price mast lage
    if (currentSort === 'asc') {
        result.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'desc') {
        result.sort((a, b) => b.price - a.price);
    }
    
    // Clear current grid Lol
    productGrid.innerHTML = '';
    
    // Update product count....infinite mari dyo
    productCount.textContent = result.length;
    
    // Handle empty state
    if (result.length === 0) {
        productGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        // Show grid saru lage aetle
        productGrid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        // Generate card..patta vala nahi ho
        result.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Replaced old simple HTML with premium SaaS HTML structure
            card.innerHTML = `
                <div class="product-image-container">
                    <span class="product-category-badge">${product.category}</span>
                    <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://placehold.co/400x300/101115/0df5e3?text=No+Image'">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn-edit" onclick="editProduct('${product.id}')"><i class="ph ph-pencil-simple"></i> Edit</button>
                        <button class="btn-delete" onclick="deleteProduct('${product.id}')"><i class="ph ph-trash"></i> Delete</button>
                    </div>
                </div>
            `;
            
            productGrid.append(card);
        });
    }

    // Update the top stats
    updateDashboardStats();
}

document.addEventListener('DOMContentLoaded', init);
