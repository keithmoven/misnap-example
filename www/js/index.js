var TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
var SERVER_URL = 'http://54.226.156.250/';
var serverRequestInput = {};
var app = {
    initialize: function() {
        this.bindEvents();
        console.log('app.initialize called');
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        captureFrontButton.addEventListener('click', this.captureFront, false);
        captureBackButton.addEventListener('click', this.captureBack, false);
        sendToServerButton.addEventListener('click', this.sendToServer, false);
        startOverButton.addEventListener('click', this.startOver, false);
    },
    onDeviceReady: function() {
        console.log('app.onDeviceReady called');
        $(document).ready(function(){
            console.log('jquery initialized');
        });
    },
    captureFront: function() {
        console.log('captureFront called');

        // transparent pixel
        licenseImage.src = TRANSPARENT_PIXEL;

        var success = function(results) {
            console.log('captureFront results: ' + JSON.stringify(Object.keys(results)));
            var encodedImage = results.encodedImage;
            console.log("received encoded image: " + encodedImage);
            licenseImage.src = 'data:image/jpeg;base64, ' + encodedImage;
            serverRequestInput.driversLicenseFront = encodedImage;
            serverRequestInput.mibiData = results.mibiData;
            captureFrontButton.style.display = 'none';
            captureBackButton.style.display = 'inline';
        };
        var failure = function(resultCode) {
            if (resultCode === "Cancelled") {
                console.log("User cancelled image capture.");
            } else {
                console.log("image capture failed: " + resultCode);
                alert("Image capture failed " + resultCode);
            }
        };
        misnap.captureDriversLicenseFront(success, failure);
    },
    captureBack: function() {
        console.log('captureBack called');
        var success = function(results) {
            var pdfData = results.encodedImage;
            console.log("received pdf data", pdfData);
            serverRequestInput.driversLicenseBack = pdfData;
            licenseImage.src = TRANSPARENT_PIXEL;
            captureBackButton.style.display = 'none';
            sendToServerButton.style.display = 'inline';
        };
        var failure = function(resultCode) {
            if (resultCode === "Cancelled") {
                console.log("user cancelled capture back");
            } else {
                console.log("bar code capture failed: " + resultCode);
                alert("Bar code capture failed " + resultCode);
            }
        };
        misnap.captureDriversLicenseBack(success, failure);
    },
    sendToServer: function() {
        console.log('sendToServer called: ' + JSON.stringify(serverRequestInput));
        sendToServerButton.style.display = 'none';
        var resultsDiv = document.getElementById('resultsDiv');
        resultsDiv.innerHTML = 'Sending to server...';
        var results = {};
        $.ajax({
          method: 'POST',
          url: SERVER_URL,
          data: JSON.stringify(serverRequestInput),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
          .done(function(response) {
            console.log('sendToServer success: ' + JSON.stringify(response));
            results = response;
          })
          .fail(function(jqXHR, textStatus) {
            console.log('sendToServer failure: ' + textStatus);
            results.returnCode = jqXHR.status;
            results.errorMessage = 'XmlHttpRequest error: ' + jqXHR.responseText;
            results.isDriversLicenseVerified = null;
          })
          .always(function(jqXHR, textStatus) {
            var message = '<ul><li>Status: ' + results.status + '</li>';
            for (var i = 0; i < results.errors.length; i++) {
               message += '<li>Error: ' + results.errors[i].errorMessage + ' ' + results.errors[i].errorMessage + '</li>';
            }
            message += '<li>DataMatchScore: ' + results.dataMatchScore + '</li>';
            message += '<li>Verification: ' + results.verification + '</li>';
            message += '<li>Approved by Moven? ' + results.isDriversLicenseValidWithMoven + '</li></ul>';
            resultsDiv.innerHTML = message;
          });
    },
    startOver: function() {
        console.log('startOver called');
        licenseImage.src = TRANSPARENT_PIXEL;
        captureFrontButton.style.display = 'inline';
        captureBackButton.style.display = 'none';
        sendToServerButton.style.display = 'none';
        document.getElementById('resultsDiv').innerHTML = '';
    }
};

app.initialize();
