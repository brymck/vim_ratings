class VimRatings
  RATINGS_PER_DOWNLOAD = ///
                         <b>      # bold tag
                         (-?\d+)  # a series of numbers, possibly proceeded by a dash
                         /        # slash
                         (\d+)    # a series of numbers
                         </b>     # bold end tag
                         ///

  stripTags: (str) -> str.replace /<[^>]+>/g, ""
  colspan: ($node) -> parseInt $node.attr("colspan") || 1

  getColor: (value, decimals, min, max, tag) ->
    if xlcs
      "<#{tag} style='background-color:#{xlcs.convert value, min, max}'>#{value.toFixed(decimals)}</#{tag}>"
    else
      "<#{tag}>#{value.toFixed(decimals)}</#{tag}>"

  matchUrl: (search) -> window.location.href.match(search) isnt null

  averageRating: (scriptId, $node) ->
    $.get "http://www.vim.org/scripts/script.php", { script_id: scriptId }, (data) =>
      numbers = data.match RATINGS_PER_DOWNLOAD
      rpr = if numbers[1] is "0" then 0 else parseInt(numbers[1], 10) / parseInt(numbers[2], 10)
      $node.next("td").replaceWith(
        $(@getColor(rpr, @options.rprDec, @options.rprMin, @options.rprMax, "td")).attr("align", "right")
      )

  addToSearchResults: ->
    if @matchUrl "script_search_results.php"
      # Get table based upon "Search Results" string
      $results = $("h1:contains('Search Results')").next "table"

      # Calculate location of rating and downloads column
      counter = 0
      for th in $results.find "tr.tableheader th"
        $th      = $(th)
        counter += @colspan $th
        switch @stripTags($th.text()).toLowerCase()
          when "rating"    then ratingCol   = counter
          when "downloads" then downloadsCol = counter

      isOddRow = true

      for tr in $results.find "tr"
        $tr  = $(tr)
        $tds = $tr.find "td, th"
        counter = 0

        for td in $tds
          $td = $(td)
          counter += @colspan $td
          if counter is ratingCol
            rating = parseInt $td.text()
            if ratingCol > downloadsCol
              $lastTd = $td
              break
          else if counter is downloadsCol
            downloads = parseInt $td.text()
            if downloadsCol > ratingCol
              $lastTd = $td
              break

        if typeof $tds.eq(0).attr("colspan") isnt "undefined"
          $lastTd.after("<td>").after("<td>")
        else if $tr.hasClass "tableheader"
          $lastTd.after("<th>Rating/<br>Download</th>")
                 .after("<th>Average<br>Rating</th>")
        else
          scriptId = $("a:first", $tr).attr("href").match(/script_id=(\d+)/)[1]
          $tds.eq(ratingCol - 1).css("backgroundColor", xlcs.convert(rating, @options.rMin, @options.rMax))
          $tds.eq(downloadsCol - 1).css("backgroundColor", xlcs.convert(downloads, @options.dlMin, @options.dlMax))
          $lastTd.after($(@getColor(rating / downloads, @options.rpdDec, @options.rpdMin, @options.rpdMax, "td")).attr("align", "right"))
                 .after($("<td>").addClass(isOddRow ? "rowodd" : "roweven"))

          @averageRating scriptId, $lastTd
          isOddRow = !isOddRow

  addToScriptKarma: ->
    if @matchUrl "script.php"
      $karma  = $("b:contains('script karma')").closest "table"
      $rating = $karma.find "td:contains('Rating')"
      text    = $rating.text()
      numbers = []
      re      = /-?\d+/g
      numbers.push match while match = re.exec text
      rpd = " (#{@getColor numbers[0] / numbers[1], @options.rpdDec, @options.rpdMin, @options.rpdMax, "span"}) "
      dl  =  "(#{@getColor numbers[0] / numbers[2], @options.rprDec, @options.rprMin, @options.rprMax, "span"}) "
      $rating.children("b").after rpd
      $rating.contents().eq(5).after dl

  constructor: ->
    chrome.extension.sendRequest "options", (response) =>
      @options = response.options
      @addToSearchResults()
      @addToScriptKarma()

vimRatings = new VimRatings
