// Cart functionality
let cart = [];

// Load cart from localStorage if available
$(document).ready(function() {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartUI();
    }
    
    // If we're on the checkout page, load checkout items and hide unnecessary elements
    if (window.location.pathname.includes('/checkout')) {
        loadCheckoutItems();
        // Hide quick checkout on checkout page
        $('.quick-checkout').hide();
        // Hide category buttons at the top (they're typically in navbar.html)
        $('.icon-menu').parent().parent().hide();
    }
    
    // Add event listener to the order button
    $('.quick-checkout .add-to-cart').on('click', function() {
        window.location.href = '/checkout';
    });
    
    // Remove any previous global event listeners to prevent double-binding
    $(document).off('click', '.counter-plus.minus');
    $(document).off('click', '.counter-minus.plus');
    
    // Add global event listeners for cart quantity buttons
    $(document).on('click', '.counter-plus.minus', function(e) {
        console.log('Minus button clicked');
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent rapid clicking
        if ($(this).data('clicking')) return;
        $(this).data('clicking', true);
        
        const itemContainer = $(this).closest('.border-top.border-bottom');
        const productId = itemContainer.attr('data-product-id');
        if (productId) {
            updateQuantity(productId, -1);
        }
        
        const button = $(this);
        setTimeout(function() {
            button.data('clicking', false);
        }, 300);
    });
    
    $(document).on('click', '.counter-minus.plus', function(e) {
        console.log('Plus button clicked');
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent rapid clicking
        if ($(this).data('clicking')) return;
        $(this).data('clicking', true);
        
        const itemContainer = $(this).closest('.border-top.border-bottom');
        const productId = itemContainer.attr('data-product-id');
        if (productId) {
            updateQuantity(productId, 1);
        }
        
        const button = $(this);
        setTimeout(function() {
            button.data('clicking', false);
        }, 300);
    });
});

// Add to cart function
function addToCart(productId, productName, productPrice, productCategory) {
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
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    // Update item count
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const itemCountText = $('.quick-checkout-content p').first(); // Only target the first paragraph
    if (itemCountText.length) {
        itemCountText.text(`${itemCount} item${itemCount !== 1 ? 's' : ''} in the basket`);
    }
    
    // Update checkout content
    const checkoutContent = $('.quick-checkout-content .border-top.border-bottom').parent();
    
    // Clear current items
    const existingItems = $('.quick-checkout-content .border-top.border-bottom');
    existingItems.each(function(index) {
        if (index !== 0) { // Keep the first one as template
            $(this).remove();
        }
    });
    
    // If cart is empty, hide the first item
    if (cart.length === 0) {
        if (existingItems.length) {
            existingItems.first().hide();
        }
        return;
    }
    
    // Clone and modify the first item as template, then add new items
    const template = existingItems.first();
    template.show(); // Make sure it's visible
    
    // Update the first item with the first cart item
    updateItemTemplate(template, cart[0]);
    
    // Add additional items
    for (let i = 1; i < cart.length; i++) {
        const newItem = template.clone();
        updateItemTemplate(newItem, cart[i]);
        newItem.insertAfter(existingItems.eq(i-1));
    }
    
    // Initialize handleCounter for all cart items
    $('.quick-checkout-content .border-top.border-bottom').each(function() {
        const counter = $(this).find('.row.justify-content-end');
        if (counter.length) {
            var options = {
                minimum: 1,
                maximize: 10,
                onChange: function(val) {
                    // This allows the document-level handlers to do their work
                }
            };
            counter.handleCounter(options);
        }
    });
    
    // Make cart visible
    const checkout = $('.quick-checkout');
    if (cart.length > 0 && !checkout.hasClass('active')) {
        checkout.addClass('active');
    }
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
    
    // Clear any previous click handlers but don't add new ones directly
    // We rely on the document-level handlers and handleCounter initialization
    const minusButton = template.find('.counter-plus.minus');
    const plusButton = template.find('.counter-minus.plus');
    
    if (minusButton.length) {
        minusButton.off('click');
    }
    
    if (plusButton.length) {
        plusButton.off('click');
    }
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
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartUI();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
} 