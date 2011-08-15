(function() {
  var Options, options;
  Options = (function() {
    function Options() {
      var $form, bg, key, value, _ref;
      bg = chrome.extension.getBackgroundPage();
      $form = $("#options_form");
      _ref = bg.background.options;
      for (key in _ref) {
        value = _ref[key];
        $form.find("input[name=" + key + "]").val(value);
      }
      $form.submit(function() {
        var $input, input, _i, _len, _ref2;
        _ref2 = $form.find("input[type=text]");
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          input = _ref2[_i];
          $input = $(input);
          key = $input.attr("name");
          value = $input.val();
          localStorage[key] = JSON.stringify(value);
        }
        bg.background.reset();
        alert("Saved!");
        return false;
      });
    }
    return Options;
  })();
  options = new Options;
}).call(this);
