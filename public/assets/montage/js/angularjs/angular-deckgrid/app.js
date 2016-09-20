
angular.module('akoenig.deckgrid.demo', [
    'ngRoute',
    'akoenig.deckgrid'
]);

angular.module('akoenig.deckgrid.demo').config([

    '$routeProvider',

    function configure ($routeProvider) {

        'use strict';

        $routeProvider.when('/', {
            controller: 'HomeController',
            templateUrl: 'js/home.html'
        });
    }
]);

