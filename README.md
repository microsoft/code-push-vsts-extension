<table style="width: 100%; border-style: none;"><tr>
<td style="width: 140px; text-align: center;"><img src="codepush_default.png" /></td>
<td><strong>Visual Studio Team Services Extension for CodePush</strong><br />
<i>Provides build/release tasks that enable performing continuous delivery to the CodePush service from an automated VSTS build or release definition</i><br />
<a href="https://marketplace.visualstudio.com/items/ms-vsclient.code-push">Install now!</a>
</td>
</tr></table>

[CodePush](http://microsoft.github.io/code-push/) is a cloud service that enables Cordova and React Native developers to deploy mobile app updates directly to their users’ devices. It works by acting as a central repository that developers can publish certain updates to (e.g. JS, HTML, CSS and image changes), and that apps can query for updates from using our provided client SDKs for [Cordova](https://github.com/Microsoft/cordova-plugin-code-push) and [React Native](https://github.com/Microsoft/react-native-code-push). 

# Visual Studio Team Services Extension for CodePush

This extension contains a set of deployment tasks which allow you to automate the release of app updates via CodePush from your CI environment. This can reduce the effort needed to keep your dev/alpha/beta/etc. deployments up-to-date, since you can simply push changes to the configured source control branches, and let your automated build take care of the rest. No need to manually release, promote or rollout from the CodePush CLI!

These tasks can be used with either VSTS or TFS 2015 on-prem servers (see below) and are intended to work with any Cordova or React Native project. Additionally, the tasks can be paired nicely with the [Cordova Command task](https://marketplace.visualstudio.com/items/ms-vsclient.cordova-extension) and/or the [React Native Bundle task](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.react-native-extension), which allow you to easily "prepare" the platform-specific assets that can be subsequently released to CodePush.

![CodePush Task + Cordova](images/task-example.png)

## Quick Start

1. Using the [CodePush CLI](http://microsoft.github.io/code-push/docs/cli.html), generate a new access key whose description indicates it will be used for VSTS CI builds (e.g. `code-push access-key create "VSTS CI"`)

    *NOTE: If you provisioned your CodePush account from HockeyApp, you can use the API key that is displayed in the HockeyApp portal, and don't need to generate an additional key via the CodePush CLI.*
    
2. Install the CodePush extension from the [VSTS Marketplace](https://marketplace.visualstudio.com/items/ms-vsclient.code-push)

3. Go to your Visual Studio Team Services or TFS project, click on the **Build** tab, and create a new build definition (the "+" icon) that is hooked up to your project's appropriate source repo

4. Click **Add build step...** and select the neccessary tasks to generate your release assets (e.g. **Gulp**, **Cordova Build**, **React Native Prepare**)

5. Click **Add build step...** and select **CodePush Release** from the **Deploy** category

6. Configure the deploy step with the access key created in step #1, specifying your app name, deployment name and target binary version, and pointing to the output of the task(s) you added in step #4 (e.g. the directory containing your compiled/processed JS/HTML/CSS) 

7. Click the **Queue Build** button or push a change to your repo in order to run the newly defined build pipeline

8. Run your CodePush-ified app to see the change that was automatically deployed!

## Globally Configuring Your Credentials

In addition to specifying your access key directly within a build task instance (as illustrated in step #4 of the getting started section), you can also configure your CodePush credentials globally and refer to them within each build or release definition as needed. This can simplify the use of CodePush across a team, and increase security, since every build and release definition doesn't need to manually configure the account credentials. To do this, simply perform the following steps:

1. Generate or retrieve your access key as described above

    *NOTE: If you need to retrieve a previously generated access key, you can run the `code-push access-key ls` command and look for the key with the description you specified when initially creating it.*

2. Go into your Visual Studio Team Services or TFS project and click on the gear icon in the upper right corner

3. Click on the **Services** tab

4. Click on **New Service Endpoint** and select **CodePush** or **HockeyApp**

5. Give the new endpoint a name (e.g. "MyApp-CodePush") and enter the access key you generated in step #1

6. Select this endpoint via the name you chose in #5 whenever you add either the **CodePush Release** or **CodePush Promote** tasks to a build or release definition

7. Release app updates!

## Task Option Reference

In addition to the custom service endpoint, this extension also contributes the following two build and release tasks:

### CodePush - Release

The **CodePush - Release** task allows you to release an update to the CodePush server, and includes the following options:

1. **Authentication Method** - Specifies how you would like to authenticate with the CodePush server. The available options are:

    1. **Access Key** - Allows you to directly specify an access key to the task. This value can either have been generated by the CodePush CLI, or provided to you by the HockeyApp portal after you auto-provisioned your CodePush account and app.
    
    2. **Service Endpoint (CodePush)** - Allows you to reference a globally configured CodePush service endpoint.
    
    4. **Service Endpoint (HockeyApp)** - Allows you to reference a globally configured HockeyApp service endpoint.

2. **App Name** *(String, Required)* - The name of the app you want to release the update for.

3. **Update Contents Path** *(File path, Required)* - Path to the file or directory that contains the content(s) you want to release. For Cordova this should be the platform-specific `www` folder (e.g `platforms/ios/www`) and for React Native this should point to either your generated JS bundle file (e.g. `ios/main.jsbundle`) or a directory containing your JS bundle and assets, depending on if you're using the React Native assets system. View the [CLI docs](http://microsoft.github.io/code-push/docs/cli.html#update-contents-parameter) for more details.

4. **Target Binary Version** *(String, Required)* - The binary version that this release is targeting. The value must be [semver](http://semver.org/) compliant. View the [CLI docs](http://microsoft.github.io/code-push/docs/cli.html#target-binary-version-parameter) for more details.

5. **Deployment** *(String)* - Name of the deployment you want to release the update to. Defaults to `Staging`.

6. **Description** *(String)* - Description of the update being released. When this task is used within a VSTS release definition, this field can be set to the `$(Release.ReleaseDescription)` variable in order to inherit the description that was given to the release.

#### Advanced

In addition to the basic release properties, the follow options provide more advanced control over the update and how it will be distributed to your end users:

1. **Rollout** *(String)* - Percentage of users you want this update to be available for, specified as a number between `1` and `100` (you can optionally specify a "%" suffix). Defaults to `null`, which is equivalent to `100`, and therefore, makes the release available to everyone.

2. **Mandatory** *(Boolean)* - Specifies whether the release should be considered mandatory or not. Defaults to `false`.

3. **Disabled** *(Boolean)* - Specifies whether the release should be disabled, and therefore, not immediately downloadable by end-users. Defaults to `false`.

### CodePush - Promote

The **CodePush - Promote** task allows you to promote a previously released update from one deployment to another, and includes the following options:

1. **Authentication Method** - Specifies how you would like to authenticate with the CodePush server. The available options are:

    1. **Access Key** - Allows you to directly specify an access key to the task. This value can either have been generated by the CodePush CLI, or provided to you by the HockeyApp portal after you auto-provisioned your CodePush account and app.
    
    2. **Service Endpoint (CodePush)** - Allows you to reference a globally configured CodePush service endpoint.
    
    4. **Service Endpoint (HockeyApp)** - Allows you to reference a globally configured HockeyApp service endpoint.

2. **App Name** *(String, Required)* - The name of the app that has the deployments you are targeting for promotion.

3. **Source Deployment** *(String)* - Name of the deployment you want to promote the latest release from. Defaults to `Staging`.

4. **Destination Deployment** *(String)* - Name of the deployment you want to promote the release to. Defaults to `Production`.

#### Advanced

By default, when a release is promoted from one deployment to another, the newly created release will "inherit" not just the update contents, but also the metadata (e.g. `description`). This ensures that what is being promoted is the exact same thing that you tested in the source deployment. However, if you need to override one or more properties in the newly created release within the target deployment (e.g. because you use `mandatory` differently between environments), you can use the following fields:

1. **Rollout** *(String)* - Percentage of users you want this update to be available for, specified as a number between `1` and `100` (you can optionally specify a "%" suffix). Note that the rollout property will not be inherited from the release being promoted. Defaults to `null`, which is equivalent to `100`, and therefore, makes the release available to everyone.

2. **Description** *(String)* - Description of the update being released. Leaving this field blank will result in the update inheriting the description from the release being promoted. When this task is used within a VSTS release definition, this field can be set to the `$(Release.ReleaseDescription)` variable in order to inherit the description that was given to the release.

3. **Mandatory** *(Boolean)* - Specifies whether the release should be considered mandatory. Selecting `Inherit` will use the value from the release being promoted. Defaults to `Inherit`.

4. **Disabled** *(Boolean)* - Specifies whether the release should be disabled, and therefore, not immediately downloadable by end-users. Selecting `Inherit` will use the value from the release being promoted. Defaults to `Inherit`.

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

## Terms of Use

By downloading and running this project, you agree to the license terms of the third party application software, Microsoft products, and components to be installed. 

The third party software and products are provided to you by third parties. You are responsible for reading and accepting the relevant license terms for all software that will be installed. Microsoft grants you no rights to third party software.

## Testing

Make sure Mocha is installed ```npm install -g mocha```

To run tests, go to the [code-push-vsts-task](code-push-vsts-task) folder and run ```mocha test.js```

## License

```
The MIT License (MIT)

Copyright (c) Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```