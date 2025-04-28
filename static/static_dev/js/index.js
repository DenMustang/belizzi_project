// closing the menu-overlay
$('.close, .photo-container').click(function(){
    $('.photo-tab').css('background','none');
    $('.photo-container').removeClass('displayed'); return false;
});
// preventing clicks on the menu closing it for now because there is nothing inside yet.
$('.photo-tab').click(function(){ return false; });

