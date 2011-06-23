@echo off
echo Packing into Chrome extension ...
set counter=0
if exist vim_ratings.pem (
  "%AppData%\..\Local\Google\Chrome\Application\chrome.exe" --pack-extension="%cd%\src" --pack-extension-key="%cd%\vim_ratings.pem" --no-message-box
  goto test
)
"%AppData%\..\Local\Google\Chrome\Application\chrome.exe" --pack-extension="%cd%\src" --no-message-box

:test
if exist src.crx goto finish
set /a counter+=1
if %counter%==10 goto error
goto wait

:wait
ping 1.1.1.1 -n 1 -w 1000 > nul
goto test

:error
echo Error installing!
goto exit

:finish
echo Renaming Chrome extension and private key...
copy /y src.crx vim_ratings.crx > nul
del src.crx
if exist src.pem (
  copy /y src.pem vim_ratings.pem > nul
  del src.pem
)

echo Opening in Chrome...
"%AppData%\..\Local\Google\Chrome\Application\chrome.exe" "%cd%\vim_ratings.crx"
echo Done!

:exit
