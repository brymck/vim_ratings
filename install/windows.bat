@echo off
echo Packing extension into .crx ...
cd vim_ratings
"%AppData%\..\Local\Google\Chrome\Application\chrome.exe" --pack-extension="%cd%\src" --pack-extension-key="%cd%\vimratings.pem" --no-message-box

:test
if exist "src.crx" goto finish
else goto wait

:wait
ping 127.0.0.1 -n 1
goto test

:finish
copy /y src.crx vimratings.crx
del src.crx
"%AppData%\..\Local\Google\Chrome\Application\chrome.exe" "%cd%\vimratings.crx"
echo Done!
