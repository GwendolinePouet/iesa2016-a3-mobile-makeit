var app = {
   // Application Constructor
   initialize: function () {
      this.bindEvents();
   },


   // Bind Event Listeners
   bindEvents: function () {
      document.addEventListener('deviceready', this.onDeviceReady, false);
   },

   // deviceready Event Handler
   onDeviceReady: function () {

      //Temoin
      app.receivedEvent('deviceready');

      //Status bar
      StatusBar.hide();

      //Orientation
      app.checkDeviceOrientation();

      //Network
      document.addEventListener("offline", app.checkConnection, false);
      document.addEventListener("online", app.checkConnection, false);

      //Photo
      app.profilPicture();

      //Contact
      $('#contact-btn').click(function () {
         app.findContacts();
      });

      //Video
      $('#capture-btn').click(function () {
         app.initcapture();
      });

      app.checkVideo();

      //Call Geolocation feature
      $('#geolocation-btn').click(function () {
         app.geolocationTuto();
      });

      app.langSelect();
   },
   // Fin Device ready
   //-----------------------------------

   // Starter video
   //-----------------------------------
   checkVideo: function () {

      var video = window.localStorage.getItem('video');
      if (video !== null) {
         var v = "<video controls='controls'>"
         v += "<source src='" + video + "' type='video/mp4'>";
         v += "</video>";

         $('#capture-btn').after(v);
      }
   },

   // capture callback
   captureSuccess: function (mediaFiles) {

      var storage = window.localStorage;
      var path = mediaFiles[0].fullPath;
      var v = "<video controls='controls'>"
      v += "<source src='" + path + "' type='video/mp4'>";
      v += "</video>";

      storage.setItem('video', path);
      $('#capture-btn').after(v);
   },

   // capture error callback
   captureError: function (error) {
      alert('Caméra non disponible ou inexistante');
   },

   initcapture: function () {
      // start video capture
      navigator.device.capture.captureVideo(app.captureSuccess, app.captureError, {
         limit: 1
      });
   },

   //Starter photo
   //-----------------------------------
   profilPicture: function () {

      var pictureSource;
      pictureSource = Camera.PictureSourceType.SAVEDPHOTOALBUM;

      $('#ProfilPicture').click(function () {
         var $self = $(this);

         $(".picture-btn").removeClass('hide-btn');
         $self.addClass('hide-btn');
      })

      $('#CameraShot').click(function () {
         app.takePicture();
      });
      $('#CameraAlbum').click(function () {
         app.getPhoto(pictureSource);
      });

   },

   // Starter Globalization
   //-----------------------------------
   langSelect: function () {
      navigator.globalization.getPreferredLanguage(
         function (language) {

            var lang = language.value;
            var $checkLang = $('.checkLang');

            if (lang == 'fr-US' || lang == 'fr-FR') {
               $checkLang.html('V&eacute;rifier la langue');
               $('#contact-btn a').html('Trouver des amis');
            } else {
               $checkLang.html('Check language');
               $('#contact-btn a').html('Find friends');
            }

            $checkLang.on('click', function () {
               alert(lang);
            });
         },

         function () {
            alert('Error getting language\n');
         }
      );
   },

   // Starter Photo
   //-----------------------------------
   takePicture: function () {
      navigator.camera.getPicture(onSuccess, onFail, {
         quality: 50,
         destinationType: Camera.DestinationType.FILE_URI
      });

      function onSuccess(imageURI) {
         var image = $('#Image')[0];
         image.src = imageURI;
      };

      function onFail(message) {
         alert('Failed because: ' + message);
      };
   },

   getPhoto: function (source) {
      //document.getElementById('timestamp').innerHTML = new Date();
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, {
         quality: 50,
         targetWidth: 500,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: source
      });

      function onPhotoURISuccess(imageURI) {

         var galleryImage = $('#Image')[0];
         galleryImage.style.display = 'block';
         galleryImage.src = imageURI;
      };

      function onFail(message) {
         alert('Failed because: ' + message);
      };
   },

   //Starter Network
   //--------------------------------------------
   checkConnection: function () {

      var networkState = navigator.connection.type;
      var states = {};
      states[Connection.UNKNOWN] = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI] = 'WiFi connection';
      states[Connection.CELL_2G] = 'Cell 2G connection';
      states[Connection.CELL_3G] = 'Cell 3G connection';
      states[Connection.CELL_4G] = 'Cell 4G connection';
      states[Connection.CELL] = 'Cell generic connection';
      states[Connection.NONE] = 'No network connection';
      alert('Connection type: ' + states[networkState]);

   },

   //Starter Orientation
   //--------------------------------------------
   checkDeviceOrientation: function () {

      window.addEventListener("orientationchange", orientationChange, true);

      function orientationChange(e) {

         var currentOrientation = "portrait";

         if (window.orientation == 0) {
            currentOrientation = "portrait";
         } else if (window.orientation == 90) {
            currentOrientation = "landscape";
         } else if (window.orientation == -90) {
            currentOrientation = "landscape";
         } else if (window.orientation == 180) {
            currentOrientation = "portrait";
         }

         alert(currentOrientation);

      }
   },

   //Starter Geolocation
   //---------------------------
   geolocationTuto: function () {

      navigator.geolocation.getCurrentPosition(geolocationSuccess, onGeolocError);

      //onSuccess Geolocation
      function geolocationSuccess(position) {

         var element = document.getElementById('geolocation');

         element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
            'Longitude: ' + position.coords.longitude + '<br />' +
            'Altitude: ' + position.coords.altitude + '<br />' +
            'Accuracy: ' + position.coords.accuracy + '<br />' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
            'Heading: ' + position.coords.heading + '<br />' +
            'Speed: ' + position.coords.speed + '<br />' +
            'Timestamp: ' + position.timestamp + '<br />';
      };

      // onError Callback receives a PositionError object
      function onGeolocError(error) {

         alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
      };
   },

   //Starter Contacts
   //-----------------------------------
   findContacts: function () {

      var listNumber;

      $.ajax({
         url: 'js/base.json',
         success: function (data) {
            //it works, do something with the data
            var donnees = $.parseJSON(data);
            listNumber = donnees.numeros;
            displayContacts();
         },
         error: function () {
            //something went wrong, handle the error and display a message
            $('.titrelistcontacts').text("error");
         }
      });

      var displayContacts = function () {
         $('.titrelistcontacts').text("Liste de vos contacts utilisant l'application");

         //lecture de tout le tab
         for (var i = 0; i < listNumber.length; i++) {
            var finder = listNumber[i];

            function onSuccess(contacts) {
               var text = '';

               if (!!contacts[0].name.givenName) {
                  text = contacts[0].name.givenName;
               }

               if (!!contacts[0].name.familyName) {
                  text = text + ' ' + contacts[0].name.familyName;
               }

               $('#list').append("<li>" + text + ' | ' + contacts[0].phoneNumbers[0].value + "</li>");
               $('.nombrelistcontacts').text($('#list li').length + " de vos contacts utilisent l'application.");
            };

            function onError(contactError) {
               alert('onError!');
            };

            //find all contacts
            var options = new ContactFindOptions();
            options.filter = finder;
            var fields = ["displayName", "name", "phoneNumbers"];
            navigator.contacts.find(fields, onSuccess, onError, options);
         }
      }
   },
   //-----------------------------------
   //-----------------------------------

   // Update DOM on a Received Event
   receivedEvent: function (id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
   }
};

app.initialize();



//ionic
//-----------------------------------
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function ($ionicPlatform) {
   $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
         cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
         cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
         // org.apache.cordova.statusbar required
         StatusBar.styleDefault();
      }
   });
})

.config(function ($stateProvider, $urlRouterProvider) {
   $stateProvider

      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
   })

   .state('app.contact', {
      url: '/contact',
      views: {
         'menuContent': {
            templateUrl: 'templates/contact.html'
         }
      }
   })

   .state('app.video', {
      url: '/video',
      views: {
         'menuContent': {
            templateUrl: 'templates/video.html'
         }
      }
   })

   .state('app.home', {
      url: '/home',
      views: {
         'menuContent': {
            templateUrl: 'templates/home.html'
         }
      }
   });

   // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/app/home');
});