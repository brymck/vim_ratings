var Options = (function() {
  var bg = chrome.extension.getBackgroundPage();
  var $form = $("#options_form");
  var options = {};

  return {
    init: function() {
      options = bg.Background.options();

      for (var key in options) {
        $("input[name='" + key + "']", $form).val(options[key]);
      }
      
      $form.submit(function() {
        $("input[type=text]", $form).each(function() {
          var $input = $(this);
          var key = $input.attr("name");
          var value = $input.val();
          localStorage[key] = JSON.stringify(value);
        });
        bg.Background.reset();
        alert("Saved!");
        return false;
      });
    }
  }
})();

Options.init();
