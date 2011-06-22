@echo off
echo Packing into vimratings.crx ...
%AppData%\..\Local\Google\Chrome\Application\chrome.exe --pack-extension=%cd%\src --pack-extension-key=%cd%\vimratings.pem --no-message-box
copy /y src.crx vimratings.crx
del src.crx
%AppData%\..\Local\Google\Chrome\Application\chrome.exe %cd%\vimratings.crx
