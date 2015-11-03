var path = require('path');
var tl = require('vso-task-lib');
var CodePushCommandExecutor = require("code-push-cli/script/command-executor");
var CodePushSdk = require("code-push");
var CodePushCommandTypes = require("code-push-cli/definitions/cli").CommandType;

// User inputs
var accessKey       = tl.getInput("accessKey", true);
var appName         = tl.getInput("appName", true);
var packagePath     = tl.getPathInput("packagePath", true);
var appStoreVersion = tl.getInput("appStoreVersion", true);
var deploymentName  = tl.getInput("deploymentName", false);
var description     = tl.getInput("description", false);
var isMandatory     = tl.getInput("isMandatory", false);

// Constants
var SERVER_URL = "https://codepush.azurewebsites.net";

CodePushCommandExecutor.loginWithAccessToken = function () {
    CodePushCommandExecutor.sdk = new CodePushSdk.AccountManager(SERVER_URL);
    return CodePushCommandExecutor.sdk.loginWithAccessToken(accessKey);
};

CodePushCommandExecutor.execute({
    type: CodePushCommandTypes.release,
    appName: appName,
    deploymentName: deploymentName,
    description: description,
    mandatory: isMandatory,
    appStoreVersion: appStoreVersion,
    package: packagePath
}).catch(function(error) {
    console.error(error);
    tl.exit(0);
}).done();
