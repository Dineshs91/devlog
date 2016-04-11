var win = gui.Window.get();

$(function() {
    $('.deny.button').click(function() {
        $('input:radio').prop('checked', false);
    });

    $('.add').click(function() {
        $('.title').focus();
        var container = $('.ui.list');
        scrollTo(container);
    });

    $('.ui.dropdown').dropdown({
        action: 'hide'
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
        var container = $('.ui.list');
        scrollTo(container);
    });
});

function scrollTo(container) {
    $('.logs-list').each(function(index) {
        if($(this).hasClass('active')) {
            container.animate({
                scrollTop: $(this).offset().top - container.offset().top + container.scrollTop()
            })
        }
    });
}