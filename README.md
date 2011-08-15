vim ratings
===========

Adds color codes and a few additional metrics to the search results and script
pages at vim.org, making it a little easier to figure out which new scripts
might be worth a try. The minimum and maximum for the color scale of each
metric can be configured on the options page.

Installation
------------

When everything's ready for prime time, there will be a stable release in the
Chrome Web Store.

A packed, unstable version will always be available via the
[Downloads](https://github.com/brymck/vim_ratings/archives/master) link above.

If you'd like to pack it from the source by yourself to ensure you have the
latest version, it requires the following

* [Ruby 1.9+](http://www.ruby-lang.org/en/)
  * [HAML](http://haml-lang.com/)
* [Node.js](http://nodejs.org/)
  * [CoffeeScript](http://jashkenas.github.com/coffee-script/)

If those are installed, you can just clone the repo and run `rake`:

    git clone git://github.com/brymck/vim_ratings.git
    rake
