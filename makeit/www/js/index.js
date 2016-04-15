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
      app.receivedEvent('deviceready');

      //Call function for profil picture
      app.profilPicture();
      app.findContacts();
      //Call Geolocation feature
      $('#geolocation-btn').click(function () {
         app.geolocationTuto();
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