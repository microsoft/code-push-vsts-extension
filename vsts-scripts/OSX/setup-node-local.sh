#!/bin/sh
NODE_VERSION="4.2.1"
if [ -d "$HOME/.nvm" ]
then
	echo "NVM already installed."
else
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
fi

if [ -z "${NVM_DIR+xxx}" ] 
then 
	NVM_DIR="$HOME/.nvm"
	export NVM_DIR
fi

# Init nvm just to be sure its ready to go
echo "NVM_DIR=$NVM_DIR"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install version if not installed
if [ "$(nvm version $NODE_VERSION)" == "N/A" ]
then
	nvm install $NODE_VERSION
else
	nvm use $NODE_VERSION
fi

NODE_PATH=$(dirname $(nvm which current))
echo $NODE_PATH
PATH=$NODE_PATH:$PATH
export PATH
