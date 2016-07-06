var tl = require("vsts-task-lib");
var CodePushSdk = require("code-push");

// The main function to be executed.
function performPatchTask(accessKey, appName, deploymentName, label, description, isDisabled, isMandatory, rollout, appStoreVersion) {
    // If function arguments are provided (e.g. during test), use those, else, get user inputs provided by VSTS.
    var authType = tl.getInput("authType", false);
    if (authType === "AccessKey") {
        accessKey = tl.getInput("accessKey", true);
    } else if (authType === "ServiceEndpointCodePush" || authType === "ServiceEndpointHockeyApp") {
        var serviceAccount = tl.getEndpointAuthorization(tl.getInput(authType, true));
        accessKey = serviceAccount.parameters.password;
    }

    appName = appName || tl.getInput("appName", true);
    deploymentName = deploymentName || tl.getInput("deploymentName", true);
    label = label || tl.getInput("releaseLabel", false);
    description = description || tl.getInput("description", false);
    isDisabled = isDisabled || tl.getInput("isDisabled", false);
    isMandatory = isMandatory || tl.getInput("isMandatory", false);
    rollout = rollout || tl.getInput("rollout", false);
    appStoreVersion = appStoreVersion || tl.getInput("appStoreVersion", true);

    if (!accessKey) {
        console.error("Access key required");
        tl.setResult(1, "Access key required");
    }
    
    var codePushSdk = new CodePushSdk(accessKey);
    codePushSdk.patchRelease(
        appName, deploymentName, label, 
        {
            label: (label === "latest" ? false : label),
            description: (description === "noChange" ? false : description),
            disabled: (isDisabled === "noChange" ? false : isDisabled),
            mandatory: (isMandatory === "noChange" ? false : isMandatory),
            rollout: (rollout === "noChange" ? null : parseInt(rollout.replace("%", ""))),
            targetBinaryVersion: (appStoreVersion === "noChange" ? false : appStoreVersion)
        })
        .done(function() {
            tl.setResult(1, "Successfully patched " + appName + " - " + deploymentName + " (" + label + ")");
        }, function(error) {
            throw error;
        });
}

module.exports = {
    performPatchTask: performPatchTask
}

if (require.main === module) {
    // Only run the patch task if the script is being run directly, and not imported as a module (eg. during test)
    performPatchTask();
}
