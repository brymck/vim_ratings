(function() {
  var Background;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Background = (function() {
    var DEFAULTS;
    DEFAULTS = {
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
    };
    Background.prototype.reset = function() {
      var key, _results;
      for (key in DEFAULTS) {
        if (!(key in localStorage)) {
          localStorage[key] = JSON.stringify(DEFAULTS[key]);
        }
        this.options[key] = JSON.parse(localStorage[key]);
      }
      _results = [];
      for (key in localStorage) {
        _results.push(!(key in DEFAULTS) ? delete localStorage[key] : void 0);
      }
      return _results;
    };
    function Background() {
      this.options = {};
      this.reset();
      chrome.extension.onRequest.addListener(__bind(function(request, sender, sendResponse) {
        switch (request) {
          case "options":
            return sendResponse({
              options: this.options
            });
          default:
            return sendResponse({});
        }
      }, this));
    }
    return Background;
  })();
  window.background = new Background;
}).call(this);
