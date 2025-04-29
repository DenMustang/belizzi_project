// Checkout page specific functionality
$(document).ready(function() {
    // Hide category navigation and quick checkout drawer
    $('.quick-checkout').hide();
    $('.icon-menu').closest('.row').hide();
    
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