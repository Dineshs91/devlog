devlog.directive('semanticTag', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        template: '<div class="ui fluid multiple search selection dropdown">' +
                      '<input name="tags" type="hidden">' +
                      '<div class="default text">Tags...</div>' +
                    '</div>',
        replace: true,
        link: {
            post: function(scope, element, attrs, ngModel) {
                // Jquery is loaded before angular
                // So angular uses it instead of jqLite.
                element = $(element[0]);
                var input = $(element).find("input");

                scope.$on('log-saved', function() {
                    console.log("log-saved");
                    ngModel.$setViewValue(input.val());
                });

                ngModel.$render = function() {
                    element.dropdown('clear');
                    element.dropdown('set selected', ngModel.$modelValue);
                };
            }
        }
    };
});
