(function() {
  var VimRatings, vimRatings;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  VimRatings = (function() {
    var RATINGS_PER_DOWNLOAD;
    RATINGS_PER_DOWNLOAD = /<b>(-?\d+)\/(\d+)<\/b>/;
    VimRatings.prototype.stripTags = function(str) {
      return str.replace(/<[^>]+>/g, "");
    };
    VimRatings.prototype.colspan = function($node) {
      return parseInt($node.attr("colspan") || 1);
    };
    VimRatings.prototype.getColor = function(value, decimals, min, max, tag) {
      if (xlcs) {
        return "<" + tag + " style='background-color:" + (xlcs.convert(value, min, max)) + "'>" + (value.toFixed(decimals)) + "</" + tag + ">";
      } else {
        return "<" + tag + ">" + (value.toFixed(decimals)) + "</" + tag + ">";
      }
    };
    VimRatings.prototype.matchUrl = function(search) {
      return window.location.href.match(search) !== null;
    };
    VimRatings.prototype.averageRating = function(scriptId, $node) {
      return $.get("http://www.vim.org/scripts/script.php", {
        script_id: scriptId
      }, __bind(function(data) {
        var numbers, rpr;
        numbers = data.match(RATINGS_PER_DOWNLOAD);
        rpr = numbers[1] === "0" ? 0 : parseInt(numbers[1], 10) / parseInt(numbers[2], 10);
        return $node.next("td").replaceWith($(this.getColor(rpr, this.options.rprDec, this.options.rprMin, this.options.rprMax, "td")).attr("align", "right"));
      }, this));
    };
    VimRatings.prototype.addToSearchResults = function() {
      var $lastTd, $results, $td, $tds, $th, $tr, counter, downloads, downloadsCol, isOddRow, rating, ratingCol, scriptId, td, th, tr, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _results;
      if (this.matchUrl("script_search_results.php")) {
        $results = $("h1:contains('Search Results')").next("table");
        counter = 0;
        _ref = $results.find("tr.tableheader th");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          th = _ref[_i];
          $th = $(th);
          counter += this.colspan($th);
          switch (this.stripTags($th.text()).toLowerCase()) {
            case "rating":
              ratingCol = counter;
              break;
            case "downloads":
              downloadsCol = counter;
          }
        }
        isOddRow = true;
        _ref2 = $results.find("tr");
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          tr = _ref2[_j];
          $tr = $(tr);
          $tds = $tr.find("td, th");
          counter = 0;
          for (_k = 0, _len3 = $tds.length; _k < _len3; _k++) {
            td = $tds[_k];
            $td = $(td);
            counter += this.colspan($td);
            if (counter === ratingCol) {
              rating = parseInt($td.text());
              if (ratingCol > downloadsCol) {
                $lastTd = $td;
                break;
              }
            } else if (counter === downloadsCol) {
              downloads = parseInt($td.text());
              if (downloadsCol > ratingCol) {
                $lastTd = $td;
                break;
              }
            }
          }
          _results.push(typeof $tds.eq(0).attr("colspan") !== "undefined" ? $lastTd.after("<td>").after("<td>") : $tr.hasClass("tableheader") ? $lastTd.after("<th>Rating/<br>Download</th>").after("<th>Average<br>Rating</th>") : (scriptId = $("a:first", $tr).attr("href").match(/script_id=(\d+)/)[1], $tds.eq(ratingCol - 1).css("backgroundColor", xlcs.convert(rating, this.options.rMin, this.options.rMax)), $tds.eq(downloadsCol - 1).css("backgroundColor", xlcs.convert(downloads, this.options.dlMin, this.options.dlMax)), $lastTd.after($(this.getColor(rating / downloads, this.options.rpdDec, this.options.rpdMin, this.options.rpdMax, "td")).attr("align", "right")).after($("<td>").addClass(isOddRow != null ? isOddRow : {
            "rowodd": "roweven"
          })), this.averageRating(scriptId, $lastTd), isOddRow = !isOddRow));
        }
        return _results;
      }
    };
    VimRatings.prototype.addToScriptKarma = function() {
      var $karma, $rating, dl, match, numbers, re, rpd, text;
      if (this.matchUrl("script.php")) {
        $karma = $("b:contains('script karma')").closest("table");
        $rating = $karma.find("td:contains('Rating')");
        text = $rating.text();
        numbers = [];
        re = /-?\d+/g;
        while (match = re.exec(text)) {
          numbers.push(match);
        }
        rpd = " (" + (this.getColor(numbers[0] / numbers[1], this.options.rpdDec, this.options.rpdMin, this.options.rpdMax, "span")) + ") ";
        dl = "(" + (this.getColor(numbers[0] / numbers[2], this.options.rprDec, this.options.rprMin, this.options.rprMax, "span")) + ") ";
        $rating.children("b").after(rpd);
        return $rating.contents().eq(5).after(dl);
      }
    };
    function VimRatings() {
      chrome.extension.sendRequest("options", __bind(function(response) {
        this.options = response.options;
        this.addToSearchResults();
        return this.addToScriptKarma();
      }, this));
    }
    return VimRatings;
  })();
  vimRatings = new VimRatings;
}).call(this);
