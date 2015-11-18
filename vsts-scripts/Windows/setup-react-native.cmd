@ECHO OFF
CALL setup-node-local

CALL react-native --version 1>NUL 2>NUL
IF %ERRORLEVEL%==0 GOTO done
ECHO Installing react-native-cli...
CALL npm install -g react-native-cli

:done
ECHO Command "react-native" installed and in path.