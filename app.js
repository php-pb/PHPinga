var app = angular.module('Pinga', []);

app.factory('TrueRandomService', function($http) {
  return {
    getRand: function(number) {
      var url =  encodeURIComponent('http://www.random.org/sequences/?num='+number+'&min=1&max='+(number)+'&col=1&replace=false&base=10&format=plain&rnd=new');
      return $http({
        url: 'https://jsonp.afeld.me/?url='+url
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
      var seq = res.data.trim().split("\n");
      $scope.sequencia = [];
      for(var i in seq) $scope.sequencia.push(parseInt(seq[i]));
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
