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
                element = $(element[0]);
                var input = $(element).find("input");
                var search = angular.element('.search');

                search.bind('keyup', function(event) {
                    ngModel.$setViewValue(input.val());
                });

                ngModel.$render = function() {
                    element.dropdown('clear');
                    element.dropdown('set selected', ngModel.$modelValue);
                }
            }
        }
    };
});
