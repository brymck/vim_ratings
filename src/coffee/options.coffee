class Options
  constructor: ->
    bg      = chrome.extension.getBackgroundPage()
    $form   = $("#options_form")

    $form.find("input[name=#{key}]").val(value) for key, value of bg.background.options
    $form.submit ->
      for input in $form.find "input[type=text]"
        $input = $(input)
        key    = $input.attr "name"
        value  = $input.val()
        localStorage[key] = JSON.stringify value
      bg.background.reset()
      alert "Saved!"
      false

options = new Options
