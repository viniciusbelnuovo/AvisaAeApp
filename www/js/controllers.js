angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $cordovaGeolocation, $ionicPopup) {
  var _latitude = -23.1817876;
  var _longitude =-46.9215485;
  debugger;

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      console.log(lat + '   ' + long);
      alert(lat + '   ' + long);
    }, function(err) { 
      alert(err.message);     
      console.log(err)
    });
  
  var watchOptions = {
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
  }; 

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      debugger;
      
      alert(err.message);
      // error
    },
    function(position) {
      debugger;
      _latitude  = position.coords.latitude
      _longitude = position.coords.longitude
      alert(lat + '   ' + long);
      
  });

  $scope.Calculate = function(lat, lng){

    var dlon = deg2rad(lng) - deg2rad(_longitude); 
    var dlat = deg2rad(lat) - deg2rad(_latitude);

    var a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(deg2rad(_latitude)) * Math.cos(deg2rad(lat)) * Math.pow(Math.sin(dlon/2),2);
		var c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    var d = round(6373 * c );

    alert(d);
  };

  // convert degrees to radians
	function deg2rad(deg) {
		rad = deg * Math.PI/180; // radians = degrees * pi/180
		return rad;
	}
	
	
	// round to the nearest 1/1000
	function round(x) {
		return Math.round( x * 1000) / 1000;
	}
  
  $scope.locationChanged = function (location) {
    var _url = 'http://maps.google.com/maps/api/geocode/json?sensor=false&address=';
    var _location = _url + location;     
    $http({
      method: 'GET',
      url: _location
    })
    .then(function successCallback(response) {   
        debugger;
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;

        $scope.Calculate(lat, lng);
        var confirmPopup = $ionicPopup.confirm({
            title: 'Adicionar ao favoritos?',
            template: 'Você deseja adicionar esse local aos seus favoritos?'
          });

          confirmPopup.then(function(res) {
            if(res) {
              var _data = {
                Address : location,
                Lat: lat,
                Lng:lng
              };
              var json = JSON.stringify(_data);
              localStorage.setItem(response.data.results[0].place_id, json);  

              $ionicPopup.alert({
                title: 'Salvo com sucesso!'
              });
            } else {
              //console.log('You are not sure');
            }
          });

               
        // alert('LAtitude: ' + response.data.results[0].geometry.location.lat);
        // alert('Longitude: ' + response.data.results[0].geometry.location.lng);
        // this callback will be called asynchronously
        // when the response is available
    }, function errorCallback(response) {
        debugger;
        alert('Não foi encontrado a localização');
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
    debugger;
      
     
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  var _favorites = [];
  debugger;
  for (var i = 0; i < localStorage.length; i++){
    var _favorite = localStorage.getItem(localStorage.key(i));
    if(_favorite != null){
      _favorites.push(JSON.parse(_favorite));
    }
  }
  $scope.favorites = _favorites;
  // $scope.chats = Chats.all();
  $scope.remove = function(favorite) {
    $scope.favorites.remove(favorite);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
