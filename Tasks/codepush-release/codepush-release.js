var path = require("path");
var tl = require("vsts-task-lib");
require("shelljs/global");

// Global variables.
var codePushCommandPrefix = "node " + path.join(__dirname, "node_modules", "code-push-cli", "script", "cli");

// Export for unit testing.
function log(message) {
  console.log(message);
}

// Helper functions.
function buildCommand(cmd, positionArgs, optionFlags) {
  var command = codePushCommandPrefix + " " + cmd;
  
  positionArgs && positionArgs.forEach(function(positionArg) {
    command = command + " \"" + positionArg + "\"";
  });
  
  for (var flag in optionFlags) {
    // If the value is falsey, the option flag doesn't have to be specified.
    if (optionFlags[flag]) {
      var flagValue = "" + optionFlags[flag];
      
      command = command + " --" + flag;
      // For boolean flags, the presence of the flag is enough to indicate its value.
      if (flagValue != "true" && flagValue != "false") {
        command = command + " \"" + flagValue + "\"";
      }
    }
  }

  return command;
}

function executeCommandAndHandleResult(cmd, positionArgs, optionFlags) {
  var command = buildCommand(cmd, positionArgs, optionFlags);
  
  var result = exec(command, { silent: true });
  
  if (result.code == 0) {
    module.exports.log(result.output);
  } else {
    tl.setResult(1, result.output);
    ensureLoggedOut();
    throw new Error(result.output);
  }
  
  return result;
}

function ensureLoggedOut() {
  exec(buildCommand("logout"), { silent: true });
}

// The main function to be executed.
function performDeployTask(accessKey, appName, packagePath, appStoreVersion, deploymentName, description, rollout, isMandatory, isDisabled) {
  // If function arguments are provided (e.g. during test), use those, else, get user inputs provided by VSTS.
  var authType = tl.getInput("authType", false);
  if (authType === "AccessKey") {
      accessKey = tl.getInput("accessKey", true);
  } else if (authType === "ServiceEndpointCodePush" || authType === "ServiceEndpointHockeyApp") {
      var serviceAccount = tl.getEndpointAuthorization(tl.getInput(authType, true));
      accessKey = serviceAccount.parameters.password;
  }

  appName         = appName || tl.getInput("appName", true);
  packagePath     = packagePath || tl.getPathInput("packagePath", true);
  appStoreVersion = appStoreVersion || tl.getInput("appStoreVersion", true);
  deploymentName  = deploymentName || tl.getInput("deploymentName", false);
  description     = description || tl.getInput("description", false);
  rollout         = rollout || tl.getInput("rollout", false);
  isMandatory     = isMandatory || tl.getBoolInput("isMandatory", false);
  isDisabled      = isDisabled || tl.getBoolInput("isDisabled", false);
  
  if (!accessKey) {
      console.error("Access key required");
      tl.setResult(1, "Access key required");
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
      rollout: rollout,
      mandatory: isMandatory,
      disabled: isDisabled
    }
  );
  
  // Log out.
  ensureLoggedOut();
}

module.exports = {
  buildCommand: buildCommand,
  commandPrefix: codePushCommandPrefix,
  ensureLoggedOut: ensureLoggedOut,
  executeCommandAndHandleResult: executeCommandAndHandleResult,
  log: log,
  performDeployTask: performDeployTask
}

if (require.main === module) {
  // Only run the deploy task if the script is being run directly, and not imported as a module (eg. during test)
  performDeployTask();
}
