class Background
  DEFAULTS =
    rMin:       0
    rMax:    1000
    dlMin:      0
    dlMax:  10000
    rprDec:     2
    rprMin:    -1
    rprMax:     4
    rpdDec:     3
    rpdMin:    -0.05
    rpdMax:     0.25
  
  reset: ->
    # Set default for local storage keys that don't exist
    for key of DEFAULTS
      localStorage[key] = JSON.stringify DEFAULTS[key] unless key of localStorage
      @options[key]     = JSON.parse localStorage[key]

    # Clear deprecated keys in local storage
    for key of localStorage
      delete localStorage[key] unless key of DEFAULTS

  constructor: ->
    @options = {}
    @reset()
    chrome.extension.onRequest.addListener (request, sender, sendResponse) =>
      switch request
        when "options" then sendResponse { options: @options }
        else sendResponse {}

window.background = new Background
