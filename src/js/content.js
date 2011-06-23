var VimRatings = (function() {
  var RPD_DECIMALS = 3;
  var RPR_DECIMALS = 2;

  function stripTags(str) {
    return str.replace(/<[^>]+>/g, "");
  }

  function colspan($node) {
    return parseInt($node.attr("colspan") || 1);
  }

  function matchUrl(search) {
    return (window.location.href.match(search) !== null);
  }

  function addToSearchResults() {
    if (matchUrl("script_search_results.php")) {
      // Get table based upon "Search Results" string
      var $results = $("h1:contains('Search Results')").next("table");

      // Calculate location of rating and downloads column
      var $header = $("tr.tableheader th", $results);
      var counter = 0;
      var ratingCol;
      var downloadsCol;
      $header.each(function(i, th) {
        var $th = $(th);
        counter += colspan($th);
        switch (stripTags($th.text()).toLowerCase()) {
          case "rating":
            ratingCol = counter;
            break;
          case "downloads":
            downloadsCol = counter;
            break;
          default:
            break;
        }
      });

      // Place new ratings/download column after both have appeared
      var isOddRow = true;

      $("tr", $results).each(function(i, tr) {
        var $tr = $(tr);
        var $tds = $("td, th", $tr);
        var rating;
        var downloads;
        var $lastTd;
        var counter = 0;
        var $rpd;

        $tds.each(function(j, td) {
          var $td = $(td);
          counter += colspan($td);
          if (counter === ratingCol) {
            rating = parseInt($td.text());
            if (ratingCol > downloadsCol) {
              $lastTd = $td;
              return false;
            }
          } else if (counter === downloadsCol) {
            downloads = parseInt($td.text());
            if (downloadsCol > ratingCol) {
              $lastTd = $td;
              return false;
            }
          }
        });

        if (typeof $tds.eq(0).attr("colspan") !== "undefined") {
          $rpd = $("<td>");
        } else if ($tr.hasClass("tableheader")) {
            $rpd = $("<th>").html("Rating/<br>Download");
        } else {
          $rpd = $("<td>").addClass(isOddRow ? "rowodd" : "roweven").attr("align", "right")
            .text((rating / downloads).toFixed(RPD_DECIMALS));
          isOddRow = !isOddRow;
        }
        
        $lastTd.after($rpd);
      });
    }
  }

  function addToScriptKarma() {
    if (matchUrl("script.php")) {
      var $karma = $("b:contains('script karma')").closest("table");
      var $rating = $("td:contains('Rating')", $karma);
      var text = $rating.text();
      var numbers = [];
      var re = /-?\d+/g;
      var match;
      while (match = re.exec(text)) {
        numbers.push(match);
      }
      $rating.html($rating.html().replace(",", " (" + (numbers[0] / numbers[1]).toFixed(RPR_DECIMALS) + "),") +
                                               " (" + (numbers[0] / numbers[2]).toFixed(RPD_DECIMALS) + ")"); 
    }
  }

  return {
    init: function() {
            addToSearchResults();
            addToScriptKarma();
          }
  };
})();

VimRatings.init();
