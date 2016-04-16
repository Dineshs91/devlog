$(function() {
    var container = $('.ui.list');
    $('.deny.button').click(function() {
        $('input:radio').prop('checked', false);
    });

    $('.add').click(function() {
        $('.title').focus();
        scrollTo(container);
    });

    $('.ui.dropdown').dropdown({
        action: 'hide'
    });

    $('.ui.dropdown.search.selection').dropdown({
        allowAdditions: true,
        duration: 50
    });

    $('.ui.input')
      .popup({
          position: 'bottom left',
          delay: {
              show: 100
          }
      })
    ;

    $(document).on('click', '.trash.icon', function() {
        scrollTo(container);
    });

    // Using tab should not focus on trix-toolbar editor buttons like bold
    // italic etc. So add tabindex=-1 to all button elements
    $(':button').attr('tabindex', '-1');
});

function scrollTo(container) {
    $('.logs-list').each(function(index) {
        if($(this).hasClass('active')) {
            container.animate({
                scrollTop: $(this).offset().top - container.offset().top + container.scrollTop()
            });
        }
    });
}