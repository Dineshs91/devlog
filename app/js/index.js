var win = gui.Window.get();

$(function() {
    $('.deny.button').click(function() {
        $('input:radio').prop('checked', false);
    });

    $('.add').click(function() {
        $('.title').focus();
    });

    $('.quit').click(function() {
        window.close();
    });

    $('.minimize').click(function() {
        win.minimize();
    });

    $('.maximize').click(function() {
        win.maximize();
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