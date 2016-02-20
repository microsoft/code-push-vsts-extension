[CodePush](http://microsoft.github.io/code-push/) is a cloud service that enables Cordova and React Native developers to deploy mobile app updates directly to their users’ devices. It works by acting as a central repository that developers can publish certain updates to (e.g. JS, HTML, CSS and image changes), and that apps can query for updates from using our provided client SDKs for [Cordova](https://github.com/Microsoft/cordova-plugin-code-push) and [React Native](https://github.com/Microsoft/react-native-code-push). 

# Visual Studio Team Services Extension for CodePush

This extension contains a set of deployment tasks which allow you to automate the release of app updates via CodePush from your CI environment. This can reduce the effort needed to keep your dev/alpha/beta/etc. deployments up-to-date, since you can simply push changes to the configured source control branches, and let your automated build take care of the rest. No need to manually release or promote from the CodePush CLI!

These tasks can be used with either VSTS or TFS 2015 on-prem servers (see below) and are intended to work with any Cordova or React Native project. Additionally, the tasks can be paired nicely with the [Cordova Command task](https://marketplace.visualstudio.com/items/ms-vsclient.cordova-extension) and/or the [React Native Bundle task](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.react-native-extension), which allow you to easily "prepare" the platform-specific assets that can be subsequently released to CodePush.

![CodePush Task + Cordova](images/task-example.png)

## Quick Start

1. Using the [CodePush CLI](http://microsoft.github.io/code-push/docs/cli.html), generate a new access key whose description indicates it will be used for VSTS CI builds (e.g. `code-push access-key create "VSTS CI"`)

2. Install the CodePush extension from the [VSTS Marketplace](https://marketplace.visualstudio.com/items/ms-vsclient.code-push)

3. Go to your Visual Studio Team Services or TFS project, click on the **Build** tab, and create a new build definition (the "+" icon) that is hooked up to your project's appropriate source repo

4. Click **Add build step...** and select the neccessary tasks to generate your release assets (e.g. **Gulp**, **Cordova Build**)

5. Click **Add build step...** and select **CodePush Release** from the **Deploy** category

6. Configure the deploy step with the access key created in step #1, specifying your app name, deployment name and app store version, and pointing to the output of the task(s) you added in step #4 (e.g. the directory containing your compiled/processed JS/HTML/CSS) 

7. Click the **Queue Build** button or push a change to your repo in order to run the newly defined build pipeline

8. Run your CodePush-ified app to see the change that was automatically deployed!

## Configuring Your CodePush Credentials

In addition to specifying your access key directly within a build task instance (as illustrated in step #4 above), you can also configure your CodePush credentials globally and refer to them within each build or release definition as needed. To do this, perform the following steps:

1. Generate your access key as described above

2. Go into your Visual Studio Team Services or TFS project and click on the gear icon in the upper right corner

3. Click on the **Services** tab

4. Click on **New Service Endpoint** and select **CodePush**

5. Give the new endpoint a name and enter the access key you generated in step#1

6. Select this endpoint via the name you chose in #5 whenever you add either the **CodePush Release** or **CodePush Promote** tasks to a build or release definition

## Task Option Reference

In addition to the custom service endpoint, this extension also contributes the following two build and release tasks:

### CodePush Release

The **CodePush Release** task allows you to release an update to the CodePush server, and includes the following options:

1. **Access Key** (String) or **Service Endpoint** - The access key to use to authenticate with the CodePush service. This value can be generated using the [CodePush CLI](https://github.com/Microsoft/code-push/tree/master/cli#authentication) and provided either directly to the task (via the `Access Key` authentication method), or configured within a service endpoint that you reference from the task (via the `Service Endpoint` authentication method).

2. **App Name** (String, Required) - The name of the app you want to release the update for.

3. **Update Contents Path** (File path, Required) - Path to the file or directory that contains the content(s) you want to release. For Cordova this should be the platform-specific `www` folder (e.g `platforms/ios/www`) and for React Native this should point to either your generated JS bundle file (e.g. `ios/main.jsbundle`) or a directory containing your JS bundle and assets, depending on if you're using the React Native assets system. View the [CLI docs](http://microsoft.github.io/code-push/docs/cli.html#update-contents-parameter) for more details.

4. **Target Binary Version** (String, Required) - The binary version that this release is targeting. The value must be [semver](http://semver.org/) compliant. View the [CLI docs](http://microsoft.github.io/code-push/docs/cli.html#target-binary-version-parameter) for more details.

5. **Deployment** (String) - Name of the deployment you want to release the update to. Defaults to `Staging`.

6. **Description** (String) - Description of the update being released. When this task is used within a VSTS release definition, this field can be set to the `$(Release.ReleaseDescription)` variable in order to inherit the description that was given to the release.

7. **Mandatory** (Boolean) - Specifies whether the release should be considered mandatory or not. Defaults to `false`.

### CodePush Promote

The **CodePush Promote** task allows you to promote a previously released update from one deployment to another, and includes the following options:

1. **Access Key** (String) or **Service Endpoint** - The access key to use to authenticate with the CodePush service. This value can be generated using the [CodePush CLI](https://github.com/Microsoft/code-push/tree/master/cli#authentication) and provided either directly to the task (via the `Access Key` authentication method), or configured within a service endpoint that you reference from the task (via the `Service Endpoint` authentication method).

2. **App Name** (String, Required) - The name of the app that has the deployments you are targetting for promotion.

3. **Source Deployment** (String) - Name of the deployment you want to promote the latest release from. Defaults to `Staging`.

4. **Destination Deployment** (String) - Name of the deployment you want to promote the release to. Defaults to `Production`.

##Installation

### Visual Studio Team Services / Visual Studio Online

1. Install the [Visual Studio Team Services Extension for CodePush](https://marketplace.visualstudio.com/items/ms-vsclient.code-push)

2. You will now find the **CodePush Release** and **CodePush Promote** tasks underneath the **Deploy** category

### TFS 2015 Update 1 or Earlier

1. [Enable basic auth](http://go.microsoft.com/fwlink/?LinkID=699518) in your TFS instance

2. Install the tfx-cli and login

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	npm install -g tfx-cli
	tfx login --authType basic 
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

3. Enter your collection URL (Ex: https://localhost:8080/tfs/DefaultCollection) and user name and password 

4. Download the [latest release](https://github.com/Microsoft/code-push-vsts-extension/releases) of the CodePush tasks locally and unzip it

5. Type the following from the root of the repo from Windows:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	upload
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	Or from a Mac:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	sh upload.sh
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

6. Live long and prosper!

## Contact Us
* [Email us your questions](mailto:codepushfeed@microsoft.com)
* [Ask for help on StackOverflow](https://stackoverflow.com/questions/tagged/codepush)
* [Follow the CodePush blog](http://microsoft.github.io/code-push/blog/index.html)
