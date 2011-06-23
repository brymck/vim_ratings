var VimRatings = (function() {
  var R_MIN = 0;
  var R_MAX = 1000;

  var DL_MIN = 0;
  var DL_MAX = 10000;

  var RPR_DECIMALS = 2;
  var RPR_MIN = -1;
  var RPR_MAX = 4;

  var RPD_DECIMALS = 3;
  var RPD_MIN = -0.05;
  var RPD_MAX = 0.25;

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
          $tds.eq(ratingCol - 1).css("backgroundColor", xlcs.convert(rating, R_MIN, R_MAX));
          $tds.eq(downloadsCol - 1).css("backgroundColor", xlcs.convert(downloads, DL_MIN, DL_MAX));
          $lastTd.after($(getColor(rating / downloads, RPD_DECIMALS, RPD_MIN, RPD_MAX, "td")).attr("align", "right"))
                 .after($("<td>").addClass(isOddRow ? "rowodd" : "roweven"));
          $.get("http://www.vim.org/scripts/script.php", { script_id: scriptId }, function(data) {
            var numbers = data.match(/<b>(-?\d+)\/(\d+)<\/b>/);
            var rpr = (numbers[1] === "0" ? 0 : parseInt(numbers[1], 10) / parseInt(numbers[2], 10));
            $lastTd.next("td").replaceWith(
              $(getColor(rpr, RPR_DECIMALS, RPR_MIN, RPR_MAX, "td")).attr("align", "right")
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
      $rating.html($rating.html().replace(",", " (" + getColor(numbers[0] / numbers[1], RPD_DECIMALS, RPD_MIN, RPD_MAX, "span") + "),") +
                                               " (" + getColor(numbers[0] / numbers[2], RPR_DECIMALS, RPR_MIN, RPR_MAX, "span") + ")"); 
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
