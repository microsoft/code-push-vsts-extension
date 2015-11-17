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

## Options

1. **Access Key** (string, required) - An access key used to authenticate with the CodePush service. If you don't have an access key, you can [generate one using the CLI](https://github.com/Microsoft/code-push/tree/master/cli#authentication).
2. **App Name** (string, required) - Name of the app you want to release an update for.
3. **Package Path** (filePath, required) - Path to the file or directory that contains the content you want to release.
4. **App Store Version** (string, required) - The app store version that this release depends on (must be semver compliant).
5. **Deployment Name** (string) - Name of the deployment under the app which you want to push the release to.
6. **Package** Description (string) - Description of the package to be released.
7. **Mandatory** (boolean) - Specifies whether the release should be considered mandatory.

## Contact Us

[Email us your questions](mailto:codepushfeed@microsoft.com)
