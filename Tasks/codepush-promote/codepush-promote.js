var tl = require("azure-pipelines-task-lib");
var CodePushSdk = require("code-push");

// The main function to be executed.
function performPromoteTask(accessKey, appName, sourceDeploymentName, targetDeploymentName, appStoreVersion, description, rollout, isMandatory, isDisabled) {
    // If function arguments are provided (e.g. during test), use those, else, get user inputs provided by VSTS.
    var authType = tl.getInput("authType", false);
    if (authType === "AccessKey") {
        accessKey = tl.getInput("accessKey", true);
    } else if (authType === "ServiceEndpointCodePush" || authType === "ServiceEndpointHockeyApp") {
        var serviceAccount = tl.getEndpointAuthorization(tl.getInput(authType, true));
        accessKey = serviceAccount.parameters.password;
    }

    appName              = appName || tl.getInput("appName", true);
    sourceDeploymentName = sourceDeploymentName || tl.getInput("sourceDeploymentName", true);
    targetDeploymentName = targetDeploymentName || tl.getInput("targetDeploymentName", true);
    appStoreVersion      = appStoreVersion || tl.getInput("appStoreVersion", false);
    description          = description || tl.getInput("description", false);
    rollout              = rollout || tl.getInput("rollout", false);
    isMandatory          = isMandatory || tl.getInput("isMandatory", true);
    isDisabled           = isDisabled || tl.getInput("isDisabled", true);
  
    if (!accessKey) {
        console.error("Access key required");
        tl.setResult(1, "Access key required");
    }
  
    var updateMetadata = {
        targetBinaryVersion: appStoreVersion === "Inherit" ? null : appStoreVersion,
        description: description === "Inherit" ? null : description,
        disabled: isDisabled === "Inherit" ? null : isDisabled,        
        mandatory: isMandatory === "Inherit" ? null : isMandatory,
        rollout: parseInt(rollout.replace("%", ""))        
    };
    
    var codePushSdk = new CodePushSdk(accessKey);
    return codePushSdk.promote(appName, sourceDeploymentName, targetDeploymentName, updateMetadata)
        .done(function() {
            console.log("Successfully promoted the \"" + sourceDeploymentName + "\" deployment of the \"" + appName + "\" app to the \"" + targetDeploymentName + "\" deployment.");
        }, function(error) {
            tl.setResult(1, error.message);
            throw error;
        });
}

module.exports = {
    performPromoteTask: performPromoteTask
}

if (require.main === module) {
    // Only run the deploy task if the script is being run directly, and not imported as a module (eg. during test)
    performPromoteTask();
}
