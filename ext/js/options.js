(function() {
  var Options, options;
  Options = (function() {
    function Options() {
      var $form, bg, key;
      bg = chrome.extension.getBackgroundPage();
      $form = $("#options_form");
      for (key in bg.background.options()) {
        $form.find("input[name=" + key + "]").val(key);
      }
      $form.submit(function() {
        var $input, input, value, _i, _len, _ref;
        _ref = $form.find("input[type=text]");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
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
