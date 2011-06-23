#!/bin/sh
echo "Packing into Chrome extension..."
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd "$DIR/.."
if [ -f "vim_ratings.pem" ]; then
  /opt/google/chrome/chrome --pack-extension="${PWD}/src" --pack-extension-key="${PWD}/vim_ratings.pem" --no-message-box;
else
  /opt/google/chrome/chrome --pack-extension="${PWD}/src" --no-message-box;
fi

echo "Renaming Chrome extension and private key..."
if [ -f "src.pem" ]; then
  mv src.pem vim_ratings.pem;
fi
mv src.crx vim_ratings.crx

echo "Opening in Chrome..."
/opt/google/chrome/chrome "${PWD}/vim_ratings.crx"

echo "Done!"
