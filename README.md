README
======


Installation
------------

When everything's ready for prime time, there will be a stable release in the
Chrome Web Store.

### Windows

    git clone http://github.com/bryanmckelvey/vim_ratings
    cd vim_ratings
    "%AppData%\..\Local\Google\Chrome\Application\chrome.exe" ^
      --pack-extension="%cd%\src" ^
      --no-message-box
    copy /y src.crx vimratings.crx
    del src.crx
    "%AppData%\..\Local\Google\Chrome\Application\chrome.exe" ^
      "%cd%\vimratings.crx"
    

### Linux
