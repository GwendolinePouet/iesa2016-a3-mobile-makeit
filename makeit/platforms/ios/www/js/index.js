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
      app.findContacts();
   },

   //Starter Contacts
   findContacts: function () {


      // tableau (base donnee) des numeros des utilisateurs enregistre
      var listNumber = ["0663567765", "0663567767", "0663567768", "0663567769", "0663567770", "0642800988", "0686616325", "0679100093", "0660619149"];

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