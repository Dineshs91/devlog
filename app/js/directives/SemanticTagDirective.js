devlog.directive('semanticTag', function() {
    function link(scope, element, attrs, ngModel) {
        $('.search').bind('keyup', function(event) {
            ngModel.$setViewValue(element.val());
        });

        ngModel.$render = function() {
            $('.ui.dropdown.search.selection').dropdown('clear');
            $('.ui.dropdown.search.selection').dropdown('set selected', ngModel.$modelValue);
        }
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
});