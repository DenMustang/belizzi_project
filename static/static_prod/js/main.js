/**
 * Main JavaScript file for the Belizzi app
 * This handles all clickable elements and UI interactions
 */

// Global variables
let isAddingToCart = false;

/**
 * Initialize all event handlers when the document is ready
 */
$(document).ready(function() {
    console.log("🚀 Belizzi main.js loaded");
    
    // ===== RESTAURANT BLOCKS =====
    // Make restaurant blocks clickable (but not buttons inside them)
    $('.restaurant-block').on('click', function(e) {
        // Only toggle active state if we didn't click on a button
        if (!$(e.target).is('button') && $(e.target).closest('button').length === 0) {
            $(this).toggleClass('active');
        }
    });

    // ===== ADD TO CART BUTTONS =====
    // Add product to cart when clicking "Add to cart" button
    $('.add-to-cart-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent bubbling to parent elements
        
        // Prevent double-clicks
        if (isAddingToCart) return;
        isAddingToCart = true;
        
        const $btn = $(this);
        const productId = $btn.data('id');
        const productName = $btn.data('name');
        const productPrice = $btn.data('price');
        const productCategory = $btn.data('category');
        
        console.log("➕ Adding to cart:", productName);
        
        try {
            // Call the addToCart function from cart.js
            window.addToCart(productId, productName, productPrice, productCategory);
            
            // Visual feedback
            $btn.text("Added! ✓");
            setTimeout(function() {
                $btn.text("Add to cart");
                isAddingToCart = false;
            }, 1000);
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            alert("Sorry, couldn't add item to cart. Please try again.");
            isAddingToCart = false;
        }
    });

    // ===== QUICK CHECKOUT DRAWER =====
    // Toggle quick checkout drawer when clicking the dash
    $('.dash-to-open').on('click', function() {
        console.log("🔽 Toggling quick checkout drawer");
        $('.quick-checkout').toggleClass('active');
        localStorage.setItem('quickCheckoutActive', $('.quick-checkout').hasClass('active'));
    });
    
    // Go to checkout page when clicking the Order button
    $('.checkout-button').on('click', function() {
        console.log("🛒 Going to checkout");
        window.location.href = '/checkout';
    });
    
    // ===== QUANTITY CONTROLS =====
    // Initialize quantity controls
    try {
        $('#handleCounter').handleCounter({
            minimum: 1,
            maximize: 10
        });
    } catch (error) {
        console.warn("⚠️ Could not initialize handleCounter:", error);
    }
    
    // Quantity decrease button
    $(document).on('click', '.counter-plus.minus', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const itemContainer = $(this).closest('.border-top.border-bottom');
        const productId = itemContainer.attr('data-product-id');
        
        if (productId && window.updateQuantity) {
            console.log("➖ Decreasing quantity for:", productId);
            window.updateQuantity(productId, -1);
        }
    });
    
    // Quantity increase button
    $(document).on('click', '.counter-minus.plus', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const itemContainer = $(this).closest('.border-top.border-bottom');
        const productId = itemContainer.attr('data-product-id');
        
        if (productId && window.updateQuantity) {
            console.log("➕ Increasing quantity for:", productId);
            window.updateQuantity(productId, 1);
        }
    });
    
    // ===== DEBUG PANEL =====
    // Toggle debug panel with Ctrl+Shift+D
    $(document).keydown(function(e) {
        if (e.ctrlKey && e.shiftKey && e.keyCode === 68) {
            $('#debug-panel').toggle();
        }
    });
    
    // Add manual debug function
    window.debugBelizzi = function() {
        console.log("=== 🐞 BELIZZI DEBUG ===");
        console.log("Is document ready:", document.readyState);
        console.log("jQuery loaded:", typeof $ !== 'undefined');
        console.log("addToCart function exists:", typeof window.addToCart === 'function');
        console.log("updateQuantity function exists:", typeof window.updateQuantity === 'function');
        console.log("Restaurant blocks:", $('.restaurant-block').length);
        console.log("Add to cart buttons:", $('.add-to-cart-btn').length);
        console.log("Quick checkout visible:", $('.quick-checkout').hasClass('active'));
        console.log("=====================");
        
        return "Debug information printed to console";
    };
    
    // Run debug on load
    window.debugBelizzi();
}); 