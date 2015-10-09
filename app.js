var app = angular.module('Pinga', []);

app.controller('MainController', ['$scope', '$http', function($scope, $http){

  $scope.state = 'welcome';
  $scope.perguntas = [];
  $scope.respondidas = [];
  $scope.contador = 0;
  $scope.time = 0;

  var timeout = 15
    , timer;

  $scope.letTheGameBegin = function() {
    getPerguntas().then(function(response){
      $scope.perguntas = response.data.perguntas;
      $scope.contador = Math.floor(Math.random() * ($scope.perguntas.length - 0)) + 0;
      timeout = $scope.perguntas[$scope.contador].time ? $scope.perguntas[$scope.contador] : timeout;
      mostraPergunta();
    });
  };

  $scope.responder = function() {
    if(angular.element('input[type="radio"]:checked').length === 0) return;
    var resp = angular.element('input[type="radio"]:checked').val();
    stopTimer();
    if(resp == $scope.perguntas[$scope.contador].correta){
      $scope.state = 'correct';
      $scope.respondidas.push($scope.perguntas[$scope.contador]);
      $scope.perguntas.splice($scope.contador, 1);
      if ($scope.perguntas.length === 0) {
        $scope.perguntas = $scope.respondidas;
        $scope.respondidas = [];
        $scope.state = 'end';
      }
    } else {
      $scope.state = 'wrong';
    }
    $('input[type="radio"]').prop('checked', false);
  };

  $scope.proximo = function() {

    $scope.contador = Math.floor(Math.random() * ($scope.perguntas.length - 0)) + 0;
    if($scope.contador == $scope.perguntas.length) {
      $scope.letTheGameBegin();
    } else {
      mostraPergunta();
    }

  };

  var startTimer = function() {
    if (! $scope.perguntas[$scope.contador].tempo) {
      $scope.time = timeout;
    } else {
      $scope.time = $scope.perguntas[$scope.contador].tempo;
    }
    timer = setInterval(function() {
      $scope.time--;
      if($scope.time == 0){
        stopTimer();
        $scope.state = 'wrong';
      }
      $scope.$apply();
    }, 1000);
  };

  var stopTimer = function() {
    clearInterval(timer);
  };

  var mostraPergunta = function() {
    $scope.state = 'questions';
    startTimer();
  };

  var getPerguntas = function() {
    return $http({
      method: 'GET',
      url: location.href + '/data.json'
    });
  };
}]);
