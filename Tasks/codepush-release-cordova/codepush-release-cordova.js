var path = require("path");
var tl = require("azure-pipelines-task-lib");
var execSync = require("child_process").execSync;
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

    positionArgs && positionArgs.forEach(function (positionArg) {
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

    tl.debug("Finished Building Command: " + command);
    return command;
}

function executeCommandAndHandleResult(cmd, positionArgs, optionFlags) {
    var command = buildCommand(cmd, positionArgs, optionFlags);

    tl.debug("Attempting execution of command: " + command);
    try {
        var result = execSync(command, { stdio: 'inherit' });
    } catch (e) {
        ensureLoggedOut();
        tl.setResult(e.status, "Command failed: " + cmd);
        throw e;
    }

    return result;
}

function ensureLoggedOut(silent) {
    execSync(buildCommand("logout"), { stdio: (silent ? "inherit" : "ignore") });
}

// The main function to be executed.
function performDeployTask(accessKey, appName, appStoreVersion, platform, deploymentName, description, rollout, isMandatory, isDisabled, shouldBuild) {
    var cwd = tl.getVariable("BUILD_SOURCEDIRECTORY", false) || tl.getVariable("BUILD_SOURCESDIRECTORY", false);
    tl.debug("Swapping to working directory: " + cwd);
    process.chdir(cwd);

    if (process.cwd() != cwd) {
        tl.debug("Working directories do not match: ");
        tl.debug("cwd: " + process.cwd());
        tl.debug("expected cwd: " + cwd);
        tl.debug("task will likely fail");
    }

    // If function arguments are provided (e.g. during test), use those, else, get user inputs provided by VSTS.
    var authType = tl.getInput("authType", false);
    if (authType === "AccessKey") {
        accessKey = tl.getInput("accessKey", true);
    } else if (authType === "ServiceEndpointCodePush" || authType === "ServiceEndpointHockeyApp") {
        var serviceAccount = tl.getEndpointAuthorization(tl.getInput(authType, true));
        accessKey = serviceAccount.parameters.password;
    }

    appName = appName || tl.getInput("appName", true);
    deploymentName = deploymentName || tl.getInput("deploymentName", false);
    platform = platform || tl.getInput("platform", true);
    shouldBuild = shouldBuild || tl.getBoolInput("shouldBuild", false);

    appStoreVersion = appStoreVersion || tl.getInput("appStoreVersion", false);
    rollout = rollout || tl.getInput("rollout", false);
    description = description || tl.getInput("description", false);
    isMandatory = isMandatory || tl.getBoolInput("isMandatory", false);
    isDisabled = isDisabled || tl.getBoolInput("isDisabled", false);

    if (!accessKey) {
        console.error("Access key required");
        tl.setResult(1, "Access key required");
    }

    // Ensure all other users are logged out.
    try {
        ensureLoggedOut();
    } catch (e) {
        // not logged in
    }


    // Log in to the CodePush CLI.
    executeCommandAndHandleResult("login", /*positionArgs*/ null, { accessKey: accessKey });

    // Always pull a local cordova. This is to work around a point in time issue with the hosted agents having a broken globally resolved cordova command.
    var originalPath = process.env["PATH"];
    process.env["PATH"] = path.join(process.cwd(), "node_modules", ".bin") + (process.platform == "win32" ? ";" : ":") + originalPath;
    console.log("Installing local cordova cli...");
    execSync("npm install cordova", { stdio: "inherit" });

    // Run release command.
    executeCommandAndHandleResult(
        "release-cordova",
        [appName, platform],
        {
            targetBinaryVersion: (appStoreVersion == "autodetect" ? false : appStoreVersion),
            deploymentName: deploymentName,
            description: description,
            rollout: rollout,
            mandatory: isMandatory,
            disabled: isDisabled,
            build: shouldBuild
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
