@ECHO OFF
SET NODE_VERSION=4.2.1
SET NPM_VERSION=2.14.9
SET NODIST_PREFIX=%CD%\nodist
SET NODIST_BIN=%NODIST_PREFIX%\bin
SET NODE_PATH=%NODIST_PREFIX%\v\nodev%NODE_VERSION%
SET NPM_PREFIX=%NODE_PATH%\npm
SET NPM_GLOBAL_CMD=%NPM_PREFIX%

IF EXIST "%NODIST_PREFIX%" (GOTO instl)
git clone git://github.com/marcelklehr/nodist.git

:instl
IF EXIST %NODE_PATH% (GOTO done)

ECHO Installing Node %NODE_VERSION%...
CALL "%NODIST_BIN%\nodist.cmd" add v%NODE_VERSION%
ECHO @"%NODE_PATH%\node.exe" %%* > node.cmd

ECHO Installing npm %NPM_VERSION%...
CALL .\node.cmd "%NODIST_BIN%\node_modules\npm\bin\npm-cli.js" install -g npm@%NPM_VERSION% --prefix "%NPM_PREFIX%
ECHO @"%NPM_GLOBAL_CMD%\npm.cmd" --prefix "%NPM_PREFIX%" %%* > npm.cmd

:done
ECHO Adding %NPM_GLOBAL_CMD% to path.. 
SET PATH=%NPM_GLOBAL_CMD%;%PATH%
 
