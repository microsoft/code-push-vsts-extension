var path = require("path");
var tl = require("vso-task-lib");
require("shelljs/global");

// User inputs.
var accessKey       = tl.getInput("accessKey", true);
var appName         = tl.getInput("appName", true);
var packagePath     = tl.getPathInput("packagePath", true);
var appStoreVersion = tl.getInput("appStoreVersion", true);
var deploymentName  = tl.getInput("deploymentName", false);
var description     = tl.getInput("description", false);
var isMandatory     = tl.getInput("isMandatory", false);

// Other global variables.
var localNpmBinaries = exec("npm bin", { silent: true }).output.replace(/(\r\n|\n|\r)/gm, "");
var codePushCommandPrefix = path.join(localNpmBinaries, "code-push");

// Helper functions.
function buildCommand(cmd, positionArgs, optionFlags) {
  var command = codePushCommandPrefix + " " + cmd;
  
  positionArgs && positionArgs.forEach(function(positionArg) {
    command = command + " " + positionArg;
  });
  
  for (var flag in optionFlags) {
    // If the value is falsey, the option flag doesn't have to be specified.
    if (optionFlags[flag]) {
      var flagValue = "" + optionFlags[flag];
      // If the value contains spaces, wrap in double quotes.
      if (flagValue.indexOf(" ") >= 0) {
        flagValue = "\"" + flagValue + "\"";
      }
      command = command + " --" + flag + " " + flagValue;
    }
  } 

  return command;
}

function executeCommandAndHandleResult(cmd, positionArgs, optionFlags) {
  var command = buildCommand(cmd, positionArgs, optionFlags);
  
  var result = exec(command, { silent: true });
  
  if (result.code == 0) {
    console.log(result.output);
  } else {
    tl.setResult(1, result.output);
    ensureLoggedOut();
    throw new Error(result.output);
  }
  
  return result;
}

function ensureLoggedOut() {
  exec(buildCommand("logout", /*positionArgs*/ null, { local: true }), { silent: true });
}


// Ensure all other users are logged out.
ensureLoggedOut();

// Log in to the CodePush CLI.
executeCommandAndHandleResult("login", /*positionArgs*/ null, { accessKey: accessKey });

// Run release command.
executeCommandAndHandleResult(
  "release", 
  [appName, packagePath, appStoreVersion], 
  { 
    deploymentName: deploymentName,
    description: description,
    mandatory: isMandatory
  }
);

// Log out.
ensureLoggedOut();
