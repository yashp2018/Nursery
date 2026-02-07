// ===== SANAP HI-TECH NURSERY - COMMON JAVASCRIPT =====

// Global variables
let currentProduct = {};
let cartItems = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCommonFeatures();
    initializeAnimations();
    initializeWhatsAppFloat();
});

// Initialize common features
function initializeCommonFeatures() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize tooltips if Bootstrap is available
    if (typeof $ !== 'undefined' && $.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }
    
    // Initialize popovers if Bootstrap is available
    if (typeof $ !== 'undefined' && $.fn.popover) {
        $('[data-toggle="popover"]').popover();
    }
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.type === 'submit' || this.classList.contains('loading-btn')) {
                addLoadingState(this);
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.slide-up, .category-card, .product-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('fade-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.slide-up, .category-card, .product-card, .testimonial-card, .infrastructure-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize floating WhatsApp button
function initializeWhatsAppFloat() {
    // Create floating WhatsApp button
    const whatsappFloat = document.createElement('div');
    whatsappFloat.className = 'whatsapp-float';
    whatsappFloat.innerHTML = `
        <a href="https://wa.me/919823044556?text=Hello! I need help with plants" target="_blank" class="whatsapp-float-btn">
            <i class="fa fa-whatsapp"></i>
        </a>
    `;
    
    // Add CSS for floating button
    const style = document.createElement('style');
    style.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .whatsapp-float-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: #25D366;
            color: white;
            border-radius: 50%;
            text-decoration: none;
            font-size: 24px;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        }
        
        .whatsapp-float-btn:hover {
            background: #128C7E;
            color: white;
            text-decoration: none;
            transform: scale(1.1);
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }
            50% { box-shadow: 0 4px 25px rgba(37, 211, 102, 0.6); }
            100% { box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }
        }
        
        @media (max-width: 768px) {
            .whatsapp-float {
                bottom: 15px;
                right: 15px;
            }
            
            .whatsapp-float-btn {
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(whatsappFloat);
}

// WhatsApp Order Functions
function openWhatsAppOrder(productName, price, company, readyTime = '10-15 days', minQuantity = 50) {
    currentProduct = {
        name: productName,
        price: price,
        company: company,
        readyTime: readyTime,
        minQuantity: minQuantity
    };
    
    // Check if modal exists, if not create it
    let modal = document.getElementById('whatsappModal');
    if (!modal) {
        createWhatsAppModal();
        modal = document.getElementById('whatsappModal');
    }
    
    // Update modal content
    document.getElementById('minQuantity').textContent = minQuantity;
    document.getElementById('quantity').value = minQuantity;
    document.getElementById('quantity').min = minQuantity;
    
    document.getElementById('orderDetails').innerHTML = `
        <div class="product-summary">
            <h6>${productName}</h6>
            <p class="text-muted">${company}</p>
            <p class="text-green">₹${price}/plant</p>
            <p class="text-muted small">Ready in: ${readyTime}</p>
        </div>
    `;
    
    updateTotalPrice();
    
    // Show modal
    if (typeof $ !== 'undefined') {
        $('#whatsappModal').modal('show');
    }
}

// Create WhatsApp modal if it doesn't exist
function createWhatsAppModal() {
    const modalHTML = `
        <div class="modal fade whatsapp-modal" id="whatsappModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fa fa-whatsapp mr-2"></i>Order via WhatsApp</h5>
                        <button type="button" class="close text-white" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="orderDetails"></div>
                        <div class="quantity-selector">
                            <label>Quantity (Minimum <span id="minQuantity">50</span> plants):</label>
                            <div class="d-flex align-items-center">
                                <button type="button" class="quantity-btn" onclick="changeQuantity(-10)">-</button>
                                <input type="number" id="quantity" class="quantity-input" value="50" min="50">
                                <button type="button" class="quantity-btn" onclick="changeQuantity(10)">+</button>
                            </div>
                        </div>
                        <div class="total-price mt-3">
                            <h5>Total: ₹<span id="totalPrice">0</span></h5>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn-whatsapp" onclick="sendWhatsAppMessage()">
                            <i class="fa fa-whatsapp mr-2"></i>Send WhatsApp Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listener for quantity input
    document.getElementById('quantity').addEventListener('input', updateTotalPrice);
}

// Change quantity
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    const minQuantity = parseInt(quantityInput.min);
    let newQuantity = parseInt(quantityInput.value) + change;
    if (newQuantity < minQuantity) newQuantity = minQuantity;
    quantityInput.value = newQuantity;
    updateTotalPrice();
}

// Update total price
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    let price = currentProduct.price;
    
    // Handle price ranges (e.g., "10-15")
    if (typeof price === 'string' && price.includes('-')) {
        const priceRange = price.split('-');
        price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2;
    } else {
        price = parseInt(price);
    }
    
    const total = quantity * price;
    document.getElementById('totalPrice').textContent = Math.round(total);
}

// Send WhatsApp message
function sendWhatsAppMessage() {
    const quantity = document.getElementById('quantity').value;
    let price = currentProduct.price;
    
    // Handle price ranges
    if (typeof price === 'string' && price.includes('-')) {
        const priceRange = price.split('-');
        price = (parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2;
    } else {
        price = parseInt(price);
    }
    
    const total = quantity * price;
    
    const message = `Hello Sanap Hi-Tech Nursery!

I want to book:

Product: ${currentProduct.name}
Company: ${currentProduct.company}
Quantity: ${quantity} plants
Price per plant: ₹${currentProduct.price}
Estimated Total: ₹${Math.round(total)}

Ready in: ${currentProduct.readyTime}
Delivery to: [Please specify location]

Please confirm availability and send payment details.

My Information:
Name: [Please fill]
Phone: [Please fill]
Address: [Please fill]`;
    
    const whatsappUrl = `https://wa.me/919823044556?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Hide modal
    if (typeof $ !== 'undefined') {
        $('#whatsappModal').modal('hide');
    }
}

// Quick WhatsApp functions for different purposes
function quickWhatsAppEnquiry(subject = 'General Enquiry') {
    const message = `Hello Sanap Hi-Tech Nursery!

I have an enquiry regarding: ${subject}

Please provide more information.

My Information:
Name: [Please fill]
Phone: [Please fill]
Location: [Please fill]`;
    
    const whatsappUrl = `https://wa.me/919823044556?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function quickWhatsAppSupport() {
    const message = `Hello Sanap Hi-Tech Nursery!

I need technical support for my plants.

Issue: [Please describe your issue]

Plant details:
- Plant type: [Please specify]
- Age: [Please specify]
- Problem: [Please describe]

My Information:
Name: [Please fill]
Phone: [Please fill]
Location: [Please fill]`;
    
    const whatsappUrl = `https://wa.me/919823044556?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Utility Functions
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i>Loading...';
    button.disabled = true;
    
    // Remove loading state after 3 seconds (adjust as needed)
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 3000);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = `
        <i class="fa fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} mr-2"></i>
        ${message}
        <button type="button" class="close" onclick="this.parentElement.remove()">
            <span>&times;</span>
        </button>
    `;
    
    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .notification-toast {
                left: 20px;
                right: 20px;
                min-width: auto;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Form validation helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// Phone number validation
function validatePhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images with data-src exist
if (document.querySelectorAll('img[data-src]').length > 0) {
    lazyLoadImages();
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            // Simulate search results (in real implementation, this would be an API call)
            const mockResults = [
                { name: 'Grafted Tomato Sahil F1', category: 'Vegetables', price: '₹12/plant' },
                { name: 'Grafted Chili Teja F1', category: 'Vegetables', price: '₹8/plant' },
                { name: 'Watermelon Bahubali', category: 'Fruits', price: '₹6/plant' },
                { name: 'Marigold Eden Orange', category: 'Flowers', price: '₹5/plant' }
            ];
            
            const filteredResults = mockResults.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query)
            );
            
            if (filteredResults.length > 0) {
                searchResults.innerHTML = filteredResults.map(item => `
                    <div class="search-result-item p-2 border-bottom">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.category} - ${item.price}</small>
                    </div>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="p-2 text-muted">No results found</div>';
                searchResults.style.display = 'block';
            }
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Initialize search if elements exist
initializeSearch();

// Export functions for use in other scripts
window.NurseryApp = {
    openWhatsAppOrder,
    changeQuantity,
    updateTotalPrice,
    sendWhatsAppMessage,
    quickWhatsAppEnquiry,
    quickWhatsAppSupport,
    showNotification,
    validateForm,
    validatePhoneNumber,
    validateEmail,
    formatCurrency
};