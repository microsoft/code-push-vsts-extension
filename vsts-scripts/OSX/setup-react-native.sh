#!/bin/sh
source setup-node-local.sh

if [ "$(which react-native)" == "" ] 
then
	npm install -g react-native-cli
fi

echo "Command \"react-native\" installed."