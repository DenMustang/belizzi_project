// Checkout page specific functionality
$(document).ready(function() {
    console.log("Checkout page initialized");
    
    // Hide category navigation and quick checkout drawer
    $('.quick-checkout').hide();
    $('.icon-menu').closest('.row').hide();
    
    // Load checkout items if not already loaded
    if (window.BelizziCart && typeof window.BelizziCart.loadCheckoutItems === 'function') {
        window.BelizziCart.loadCheckoutItems();
    } else if (typeof window.loadCheckoutItems === 'function') {
        window.loadCheckoutItems();
    }
    
    // Add event listener to complete order button
    $('#complete-order-btn').off('click').on('click', function() {
        // Get the selected payment method
        var paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        // Log the selected payment method (for debugging)
        console.log("Selected Payment Method: " + paymentMethod);
        
        // If payment method is selected, proceed with the order and redirect
        if (paymentMethod) {
            // Clear the cart
            if (window.BelizziCart && typeof window.BelizziCart.clear === 'function') {
                window.BelizziCart.clear();
            } else if (typeof clearCart === 'function') {
                clearCart();
            } else {
                console.error("clearCart function not found");
                localStorage.removeItem('belizzi_cart');
                localStorage.setItem('quickCheckoutActive', 'false');
            }
            
            // Show confirmation
            alert("Order completed successfully using " + paymentMethod);
            
            // Redirect to order confirmation or home page
            window.location.href = "/";
        } else {
            alert("Please select a payment method!");
        }
    });
    
    // Improve payment method selection styling
    $('.payment-option input[type="radio"]').on('change', function() {
        // Remove active class from all options
        $('.payment-option').removeClass('active-payment');
        
        // Add active class to selected option
        $(this).closest('.payment-option').addClass('active-payment');
    });
    
    // Make entire payment option clickable
    $('.payment-option').on('click', function() {
        const radio = $(this).find('input[type="radio"]');
        radio.prop('checked', true).trigger('change');
    });
    
    // Initially activate the first option
    $('.payment-option input[type="radio"]:checked')
        .closest('.payment-option')
        .addClass('active-payment');
}); 