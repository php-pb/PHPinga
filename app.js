var app = angular.module('Pinga', []);
app.filter('to_trusted', ['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);

app.controller('MainController', ['$scope', '$http', function($scope, $http){

  $scope.state = 'welcome';
  $scope.perguntas = [];
  $scope.respondidas = [];
  $scope.contador = 0;
  $scope.time = 0;

  var timeout = 30
    , timer;

  $scope.letTheGameBegin = function() {
    getPerguntas().then(function(response){
      $scope.perguntas = processaPerguntas(response.data.perguntas);
      $scope.contador = Math.floor(Math.random() * ($scope.perguntas.length - 0)) + 0;
      mostraPergunta();
    });
  };

  $scope.responder = function() {
    if(angular.element('input[type="radio"]:checked').length === 0) return;
    var resp = angular.element('input[type="radio"]:checked').val();
    stopTimer();
    if($scope.perguntas[$scope.contador].alternativas[resp].correta === true){
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
    $scope.perguntas[$scope.contador].alternativas = shuffleArray($scope.perguntas[$scope.contador].alternativas);

    if($scope.contador == $scope.perguntas.length) {
      $scope.letTheGameBegin();
    } else {
      mostraPergunta();
    }
  };

  var processaTexto = function(str) {
    str = markdown.toHTML(str+'');
    str = str.replace('block<code>', '<pre><code>');
    str = str.replace('</code>block', '</code></pre>');
    return str;
  }

  var processaPerguntas = function(perguntas) {

    var _final = [];
    for(var i in perguntas) {
      var pergunta = perguntas[i];
      pergunta.pergunta = processaTexto(pergunta.pergunta);
      for(var z in pergunta.alternativas) {
        pergunta.alternativas[z].texto = processaTexto(pergunta.alternativas[z].texto);
      }
      _final.push(pergunta);
    }
    return _final;
  };

  var startTimer = function() {
    $scope.time = $scope.perguntas[$scope.contador].tempo || timeout;

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

  var shuffleArray = function(array) {
    var m = array.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  };

}]);
