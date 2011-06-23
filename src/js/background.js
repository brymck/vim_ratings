var Background = (function() {
  var DEFAULTS = {
    rMin: 0,
    rMax: 1000,
    dlMin: 0,
    dlMax: 10000,
    rprDec: 2,
    rprMin: -1,
    rprMax: 4,
    rpdDec: 3,
    rpdMin: -0.05,
    rpdMax: 0.25
  }
  var options = {};

  function getOptions() {
    // Set default for local storage keys that don't exist
    for (var key in DEFAULTS) {
      if (!(key in localStorage)) {
        localStorage[key] = JSON.stringify(DEFAULTS[key]);
      }
      options[key] = JSON.parse(localStorage[key]);
    }

    // Clear deprecated keys in local storage
    for (var key in localStorage) {
      if (!(key in DEFAULTS)) {
        delete localStorage[key];
      }
    }
  }

  return {
    init: function() {
      getOptions();
      chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        switch (request) {
          case "options":
            sendResponse({options: options});
            break;
          default:
            sendResponse({});
            break;
        }
      });
    },

    options: function() {
      return options;
    },

    reset: function() {
      getOptions();
    }
  }
})();

Background.init();
