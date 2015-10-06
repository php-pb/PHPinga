var app = angular.module('Pinga', []);

app.factory('TrueRandomService', function($http) {
  return {
    getRand: function(number) {
      return $http({
        url: 'https://cors-anywhere.herokuapp.com/https://api.random.org/json-rpc/1/invoke',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-rpc'
        },
        data: {
          'jsonrpc': '2.0',
          'method': 'generateIntegers',
          'params': {
            'apiKey': 'd2319b89-8389-4d24-b1eb-4dbd80009153',
            'n': number,
            'min': 1,
            'max': number,
            'replacement': false,
            'base': 10
          },
          'id': 27846
        }
      });
    }
  };
});

app.controller('MainController', ['$scope', '$http', 'TrueRandomService', function($scope, $http, TrueRandomService){

  $scope.state = 'welcome';
  $scope.perguntas = [];
  $scope.sequencia = [];
  $scope.contador = 0;

  // Métodos

  $scope.letTheGameBegin = function() {
    getPerguntas().then(function(response){
      $scope.perguntas = response.data.perguntas;
      return TrueRandomService.getRand($scope.perguntas.length);
    }).then(function(res) {
      $scope.contador = 0;
      $scope.sequencia = res.data.result.random.data;
      $scope.state = 'questions';
    });
  };

  $scope.responder = function() {
    var resp = angular.element('input[type="radio"]:checked').val();
    if(resp == $scope.perguntas[$scope.contador].correta){
      $scope.state = 'correct';
    } else {
      $scope.state = 'wrong';
    }
    $('input[type="radio"]').prop('checked', false);
  };

  $scope.proximo = function() {
    $scope.contador++;
    if($scope.contador == $scope.perguntas.length) {
      $scope.letTheGameBegin();
    } else {
      $scope.state = 'questions';
    }
  };

  var getPerguntas = function() {
    return $http({
      method: 'GET',
      url: location.href + '/data.json'
    });
  };

}]);
