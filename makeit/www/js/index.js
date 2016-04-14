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

   },

   //Starter photo
   //-----------------------------------

   profilPicture: function () {

      var pictureSource;
      pictureSource = Camera.PictureSourceType.SAVEDPHOTOALBUM;

      $('#ProfilPicture').click(function() {
         var $self = $(this);
         
         $(".picture-btn").removeClass('hide-btn');
         $self.addClass('hide-btn');
      })

      $('#CameraShot').click(function() {
         app.takePicture();
      });
      $('#CameraAlbum').click(function() {
         app.getPhoto(pictureSource);
      });

   },

   takePicture: function() {
    // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.FILE_URI });

        function onSuccess(imageURI) {
            var image = $('#Image')[0];
            image.src = imageURI;
        };

        function onFail(message) {
            alert('Failed because: ' + message);
        };
    },

    getPhoto: function(source) {
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