/**
 * Cart functionality for Belizzi
 * Namespace: BelizziCart to avoid conflicts
 */

// Create namespace to avoid global scope pollution
window.BelizziCart = (function() {
    // Private variables
    let cart = [];
    let isInitialized = false;
    
    // Load cart from localStorage
    function loadCart() {
        if (localStorage.getItem('belizzi_cart')) {
            try {
                cart = JSON.parse(localStorage.getItem('belizzi_cart'));
                console.log("Cart loaded:", cart);
            } catch (e) {
                console.error("Error parsing cart from localStorage:", e);
                cart = [];
                localStorage.removeItem('belizzi_cart');
            }
        }
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('belizzi_cart', JSON.stringify(cart));
    }
    
    // Add to cart function
    function addToCart(productId, productName, productPrice, productCategory) {
        console.log("Adding to cart:", productId, productName, productPrice, productCategory);
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex !== -1) {
            // Increment quantity if product already in cart
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                category: productCategory,
                quantity: 1
            });
        }
        
        // Save cart and show panel
        saveCart();
        $('.quick-checkout').addClass('active');
        localStorage.setItem('quickCheckoutActive', 'true');
        
        // Update UI
        updateQuickCheckoutUI();
        return true;
    }
    
    // Update cart UI in the quick checkout panel
    function updateQuickCheckoutUI() {
        console.log("Updating quick checkout UI with", cart.length, "items");
        
        // Update item count text
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        const itemCountText = $('.quick-checkout-content p').first();
        if (itemCountText.length) {
            itemCountText.text(`${itemCount} item${itemCount !== 1 ? 's' : ''} in the basket`);
        }
        
        // Get the item template and container
        const existingItems = $('.quick-checkout-content .border-top.border-bottom');
        
        // Clear current items (except template)
        existingItems.each(function(index) {
            if (index !== 0) { // Keep the first one as template
                $(this).remove();
            }
        });
        
        // If cart is empty, hide elements
        if (cart.length === 0) {
            console.log("Cart is empty, hiding elements");
            if (existingItems.length) {
                existingItems.first().hide();
            }
            // Hide panel when cart is empty
            $('.quick-checkout').removeClass('active');
            localStorage.setItem('quickCheckoutActive', 'false');
            return;
        }
        
        // Cart has items - show and update the template
        const template = existingItems.first();
        template.show();
        
        // Update the first item with the first cart item
        updateItemTemplate(template, cart[0]);
        
        // Add additional items
        for (let i = 1; i < cart.length; i++) {
            const newItem = template.clone();
            updateItemTemplate(newItem, cart[i]);
            newItem.insertAfter(existingItems.eq(i-1));
        }
        
        // Initialize quantity controls for all cart items
        $('.quick-checkout-content .border-top.border-bottom').each(function() {
            const counter = $(this).find('.row.justify-content-end');
            if (counter.length) {
                try {
                    $(counter).handleCounter({
                        minimum: 1,
                        maximize: 10,
                    });
                } catch(e) {
                    console.error("Error initializing counter:", e);
                }
            }
        });
    }
    
    // Update a single item in the cart UI
    function updateItemTemplate(template, item) {
        const nameElement = template.find('h4');
        const priceElement = template.find('b');
        const quantityInput = template.find('input.number');
        
        if (nameElement.length) nameElement.text(item.name);
        if (priceElement.length) priceElement.text(`$${item.price}`);
        if (quantityInput.length) quantityInput.val(item.quantity);
        
        // Add data attribute to identify the item
        template.attr('data-product-id', item.id);
    }
    
    // Update quantity of an item in the cart
    function updateQuantity(productId, change) {
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
            cart[productIndex].quantity += change;
            
            // Remove item if quantity is 0
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
            
            // Save cart to localStorage
            saveCart();
            console.log("Updated quantity, new cart:", cart);
            
            // Update UI based on current page
            if (window.location.pathname.includes('/checkout')) {
                loadCheckoutItems();
            } else {
                updateQuickCheckoutUI();
            }
        }
    }
    
    // Clear cart (used after order completion)
    function clearCart() {
        cart = [];
        localStorage.removeItem('belizzi_cart');
        localStorage.setItem('quickCheckoutActive', 'false');
        updateQuickCheckoutUI();
    }
    
    // Load items on the checkout page
    function loadCheckoutItems() {
        console.log("Loading checkout items from cart:", cart);
        const checkoutItemsContainer = $('#checkout-items');
        
        if (!checkoutItemsContainer.length) {
            console.error("Checkout items container not found");
            return;
        }
        
        // Clear existing items
        checkoutItemsContainer.empty();
        
        if (cart.length === 0) {
            console.log("Cart is empty on checkout page");
            checkoutItemsContainer.html('<p>Your cart is empty</p>');
            $('#subtotal-price').text('$0.00');
            $('#total-price').text('$0.00');
            return;
        }
        
        // Calculate subtotal
        let subtotal = 0;
        
        // Add each item to the checkout page
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemHtml = `
                <div class="checkout-item border-bottom padding-bottom-10 margin-bottom-10">
                    <div class="checkout-item-details">
                        <span class="checkout-item-quantity">${item.quantity}</span>
                        <div>
                            <h4>${item.name}</h4>
                            <p class="margin-bottom-0">${item.category}</p>
                        </div>
                    </div>
                    <div>
                        <h4>$${itemTotal.toFixed(2)}</h4>
                    </div>
                </div>
            `;
            
            checkoutItemsContainer.append(itemHtml);
        });
        
        // Update totals
        const deliveryFee = 2.99;
        $('#subtotal-price').text(`$${subtotal.toFixed(2)}`);
        $('#total-price').text(`$${(subtotal + deliveryFee).toFixed(2)}`);
    }
    
    // Initialize cart functionality on page load
    function initialize() {
        if (isInitialized) return;
        
        console.log("Initializing BelizziCart");
        
        // Load cart from localStorage
        loadCart();
        
        // Set up event handlers for quantity buttons
        $(document).on('click', '.counter-plus.minus', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const itemContainer = $(this).closest('.border-top.border-bottom');
            const productId = itemContainer.attr('data-product-id');
            
            if (productId) {
                console.log("Decreasing quantity for:", productId);
                updateQuantity(productId, -1);
            }
        });
        
        $(document).on('click', '.counter-minus.plus', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const itemContainer = $(this).closest('.border-top.border-bottom');
            const productId = itemContainer.attr('data-product-id');
            
            if (productId) {
                console.log("Increasing quantity for:", productId);
                updateQuantity(productId, 1);
            }
        });
        
        // Update UI based on current page
        if (window.location.pathname.includes('/checkout')) {
            // On checkout page
            loadCheckoutItems();
            // Hide quick checkout panel on checkout page
            $('.quick-checkout').hide();
        } else {
            // On regular pages (home, category, etc.)
            updateQuickCheckoutUI();
            
            // Show cart panel if it has items and was previously active
            if (cart.length > 0 && localStorage.getItem('quickCheckoutActive') === 'true') {
                console.log("Showing quick checkout panel because it was previously active");
                $('.quick-checkout').addClass('active');
            }
        }
        
        isInitialized = true;
        console.log("BelizziCart initialized successfully");
    }
    
    // Add debug functionality
    function debug() {
        console.log("=== CART DEBUG ===");
        console.log("Cart contents:", cart);
        console.log("Cart in localStorage:", localStorage.getItem('belizzi_cart'));
        console.log("quickCheckoutActive:", localStorage.getItem('quickCheckoutActive'));
        console.log("Quick checkout has 'active' class:", $('.quick-checkout').hasClass('active'));
        console.log("Current path:", window.location.pathname);
        console.log("==================");
    }
    
    // Initialize on page load
    $(document).ready(function() {
        initialize();
    });
    
    // Public API
    return {
        add: addToCart,
        update: updateQuantity,
        clear: clearCart,
        debug: debug,
        loadCheckoutItems: loadCheckoutItems,
        updateUI: updateQuickCheckoutUI
    };
})();

// Backward compatibility for old code
window.addToCart = function(productId, productName, productPrice, productCategory) {
    return window.BelizziCart.add(productId, productName, productPrice, productCategory);
};

window.updateQuantity = function(productId, change) {
    return window.BelizziCart.update(productId, change);
};

window.clearCart = function() {
    return window.BelizziCart.clear();
};

window.debugCart = function() {
    return window.BelizziCart.debug();
}; 