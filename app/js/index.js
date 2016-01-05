var win = gui.Window.get();

$(function() {
    $('.deny.button').click(function() {
        $('input:radio').prop('checked', false);
    });

    $('.add').click(function() {
        $('.title').focus();
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
});