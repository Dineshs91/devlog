$(function() {
    $('.deny.button').click(function() {
        $('input:radio').prop('checked', false);
    });

    $('.add').click(function() {
        $('.title').focus();
    });

    $('.ui.input')
      .popup({
          position: 'bottom left',
          delay: {
              show: 100
          }
      })
    ;
});