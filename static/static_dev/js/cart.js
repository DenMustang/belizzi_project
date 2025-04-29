// Cart functionality
let cart = [];

// Load cart from localStorage if available
$(document).ready(function() {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartUI();
    }
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
    
    // Add event listeners to quantity buttons
    // Note: Classes are reversed in the HTML - "counter-plus" is actually the minus button
    // and "counter-minus" is actually the plus button
    const minusButton = template.find('.counter-plus.minus');
    const plusButton = template.find('.counter-minus.plus');
    
    if (minusButton.length) {
        minusButton.off('click').on('click', function() {
            updateQuantity(item.id, -1);
        });
    }
    
    if (plusButton.length) {
        plusButton.off('click').on('click', function() {
            updateQuantity(item.id, 1);
        });
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