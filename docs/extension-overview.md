[CodePush](http://microsoft.github.io/code-push/) is a cloud service that enables Cordova and React Native developers to deploy mobile app updates directly to their users’ devices. It works by acting as a central repository that developers can publish certain updates to (e.g. JS, HTML, CSS and image changes), and that apps can query for updates from using our provided client SDKs for [Cordova](https://github.com/Microsoft/cordova-plugin-code-push) and [React Native](https://github.com/Microsoft/react-native-code-push). 

# Visual Studio Team Services Extension for CodePush

This extension contains a deployment task which allows you to automate the release of app updates via CodePush from your CI environment. This can reduce the effort needed to keep your dev/alpha/beta/etc. deployments up-to-date, since you can simply push changes to the configured source control branches, and let your automated build take care of the rest. No need to manually release or promote from the CodePush CLI!

This task can be used with either VSTS or TFS 2015 on-prem servers (see below) and is intended to work with any Cordova or React Native project. Additionally, the task can be paired nicely with the [Cordova command task](https://marketplace.visualstudio.com/items/ms-vsclient.cordova-extension) (coming soon for React Native), which allows you to easily "prepare" the platform-specific web assets that can be subsequently released to CodePush using this task.

## Quick Start

1. Using the [CodePush CLI](http://microsoft.github.io/code-push/docs/cli.html), generate a new access key whose description indicates it will be used for VSTS CI builds (e.g `code-push access-key create "VSTS CI"`)

2. Install the CodePush extension from the [VSTS Marketplace](https://marketplace.visualstudio.com/items/ms-vsclient.code-push)

3. Go to your Visual Studio Team Services or TFS project, click on the **Build** tab, and create a new build definition (the "+" icon) that is hooked up to your project's appropriate source repo

4. Click **Add build step...** and select the neccessary tasks to generate your release assets (e.g. **Cordova Build**)

5. Click **Add build step...** and select **CodePush** from the **Deploy** category

6. Configure the deploy step with the access key created in #1, specifying the right app and deployment name, and pointing at the output of the task in step #4 - *Check out the tool tips for handy inline documentation.*

## Task Option Reference

The CodePush deploy task includes the following options which can be used to customize your release:

1. **Access Key** (String, required) - The access key to use to authenticate with the CodePush service. This value can be generated using the [CodePush CLI](https://github.com/Microsoft/code-push/tree/master/cli#authentication).

2. **App Name** (String, Required) - The name of the app you want to release the update for.

3. **Package Path** (File path, Required) - Path to the file or directory that contains the content(s) you want to release. For Cordova this should be the platform-specific `www` folder (e.g `platforms/ios/www`) and for React Native this should point to your generate JS bundle file (e.g. `ios/main.jsbundle`)

4. **App Store Version** (String, Required) - The app store version that the release depends on. The value must be [semver](http://semver.org/) compliant.

5. **Deployment Name** (String) - Name of the deployment that the update should be released to. Defaults to `Staging`.

6. **Package** Description (String) - Description of the update being released.

7. **Mandatory** (Boolean) - Specifies whether the release should be considered mandatory or not. Defaults to `false`.

##Installation for TFS 2015 Update 1 or Earlier

Refer to the [GitHub repo](https://github.com/Microsoft/code-push-vsts-extension) for instructions on installing the CodePush deployment task on TFS 2015 Update 1 or earlier.

## Contact Us
* [Email us your questions](mailto:codepushfeed@microsoft.com)
* [Ask for help on StackOverflow](https://stackoverflow.com/questions/tagged/codepush)
* [Follow the CodePush blog](http://microsoft.github.io/code-push/blog/index.html)
