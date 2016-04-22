var app = {
   // Application Constructor
   initialize: function () {
      this.bindEvents();
   },


   // Bind Event Listeners
   //
   // Bind any events that are required on startup. Common events are:
   // 'load', 'deviceready', 'offline', and 'online'.
   bindEvents: function () {
      document.addEventListener('deviceready', this.onDeviceReady, false);
   },


   // deviceready Event Handler
   //
   // The scope of 'this' is the event. In order to call the 'receivedEvent'
   // function, we must explicitly call 'app.receivedEvent(...);'
   onDeviceReady: function () {
      StatusBar.hide();
      app.checkDeviceOrientation();

      document.addEventListener("offline", app.checkConnection, false);
      document.addEventListener("online", app.checkConnection, false);


      app.receivedEvent('deviceready');

      //Call function for profil picture
      app.profilPicture();
      $('#contact-btn').click(function () {
         app.findContacts();
      });

      //Call Geolocation feature
      $('#geolocation-btn').click(function () {
         app.geolocationTuto();
      });

      app.langSelect();
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

   // GLOBALIZATION ---------------------------------------------------

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

   // END GLOBALIZATION

   takePicture: function () {
      // Take picture using device camera and retrieve image as base64-encoded string
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
   //-----------------------------------
   // END starter photo

   //STARTER NETWORK INFORMATION
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
   //END NETWORK INFORMATION---------------------------------

   //STARTER DEVICE ORIENTATION
   //--------------------------------------------

   checkDeviceOrientation: function () {

      //      navigator.compass.getCurrentHeading(compassSuccess, compassError);
      //
      //      function compassSuccess(heading) {
      //         alert('Heading: ' + heading.magneticHeading);
      //      };
      //
      //      function compassError(error) {
      //         alert('CompassError: ' + error.code);
      //      };

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

   //END DEVICE ORIENTATION---------------------------------

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
      //
      function onGeolocError(error) {
         alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
      };
   },
   //---------------------------
   //End Starter Geolocation

   //Starter Contacts
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
   //End Contacts

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