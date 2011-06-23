var VimRatings = (function() {
  var options = {};

  function stripTags(str) {
    return str.replace(/<[^>]+>/g, "");
  }

  function colspan($node) {
    return parseInt($node.attr("colspan") || 1);
  }

  function getColor(value, decimals, min, max, tag) {
    var html = "<" + tag;
    if (xlcs) {
      html += " style='background-color:" + xlcs.convert(value, min, max) + "'";
    }
    html += ">" + value.toFixed(decimals) + "</" + tag + ">";
    return html;
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

      var isOddRow = true;

      $("tr", $results).each(function(i, tr) {
        var $tr = $(tr);
        var $tds = $("td, th", $tr);
        var rating;
        var downloads;
        var $lastTd;
        var scriptId;
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
          $lastTd.after($("<td>")).after($("<td>"));
        } else if ($tr.hasClass("tableheader")) {
          $lastTd.after($("<th>").html("Rating/<br>Download"))
                 .after($("<th>").html("Average<br>Rating"));
        } else {
          scriptId = $("a:first", $tr).attr("href").match(/script_id=(\d+)/)[1];
          $tds.eq(ratingCol - 1).css("backgroundColor", xlcs.convert(rating, options.rMin, options.rMax));
          $tds.eq(downloadsCol - 1).css("backgroundColor", xlcs.convert(downloads, options.dlMin, options.dlMax));
          $lastTd.after($(getColor(rating / downloads, options.rpdDec, options.rpdMin, options.rpdMax, "td")).attr("align", "right"))
                 .after($("<td>").addClass(isOddRow ? "rowodd" : "roweven"));
          $.get("http://www.vim.org/scripts/script.php", { script_id: scriptId }, function(data) {
            var numbers = data.match(/<b>(-?\d+)\/(\d+)<\/b>/);
            var rpr = (numbers[1] === "0" ? 0 : parseInt(numbers[1], 10) / parseInt(numbers[2], 10));
            $lastTd.next("td").replaceWith(
              $(getColor(rpr, options.rprDec, options.rprMin, options.rprMax, "td")).attr("align", "right")
            );
          });
          isOddRow = !isOddRow;
        }
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
      $rating.html($rating.html().replace(",", " (" + getColor(numbers[0] / numbers[1], options.rpdDec, options.rpdMin, options.rpdMax, "span") + "),") +
                                               " (" + getColor(numbers[0] / numbers[2], options.rprDec, options.rprMin, options.rprMax, "span") + ")"); 
    }
  }

  return {
    init: function() {
      chrome.extension.sendRequest("options", function(response) {
        options = response.options;
        addToSearchResults();
        addToScriptKarma();
      });
    }
  };
})();

VimRatings.init();
