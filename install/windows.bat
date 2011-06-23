@echo off
echo Packing extension into .crx ...
cd vim_ratings
"%AppData%\..\Local\Google\Chrome\Application\chrome.exe" --pack-extension="%cd%\src" --pack-extension-key="%cd%\vimratings.pem" --no-message-box
set counter=0

:test
if exist "src.crx" goto finish
set /a counter+=1
if counter==10 goto error
goto wait

:wait
ping 127.0.0.1 -n 1
goto test

:error
echo Error installing!
goto exit

:finish
copy /y src.crx vimratings.crx
del src.crx
"%AppData%\..\Local\Google\Chrome\Application\chrome.exe" "%cd%\vimratings.crx"
echo Done!

:exit
