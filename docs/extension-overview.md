[CodePush](http://microsoft.github.io/code-push/) is a cloud service that enables Cordova and React Native developers to deploy mobile app updates directly to their users’ devices. It works by acting as a central repository that developers can publish certain updates to (e.g. JS, HTML, CSS and image changes), and that apps can query for updates from using our provided client SDKs for [Cordova](https://github.com/Microsoft/cordova-plugin-code-push) and [React Native](https://github.com/Microsoft/react-native-code-push). 

# Visual Studio Team Services Extension for CodePush

This VSTS extension contains a deploy task that allows you to automate the release of app updates via CodePush from CI setup. It can be used with VSTS or TFS and is intended to work with any Cordova or React Native project. 
Under the hood, it invokes the [CodePush CLI](https://github.com/Microsoft/code-push/tree/master/cli) to run a release command. 
The deploy task can also be paired with a [Cordova build task](https://github.com/Microsoft/vso-cordova-tasks) (coming soon for React Native) which compiles and builds the platform specific packages that can then be released as an app update to CodePush using this task.

## Quick Start

1. Install the extension from the [VSTS Marketplace](https://marketplace.visualstudio.com/items/ms.vss-services-codepush), or upload the task using the [TFS Extensions Command Line Utility](https://www.npmjs.com/package/tfx-cli).
2. Go to your Visual Studio Team Services project, click on the **Build** tab, and create a new build definition (the "+" icon).
3. Click **Add build step...** and select **CodePush** from the **Deploy** category
4. Configure the build step - See the options detailed below.

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