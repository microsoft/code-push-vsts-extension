/*
  Copyright (c) Microsoft. All rights reserved.  
  Licensed under the MIT license. See LICENSE file in the project root for full license information.
*/

var path = require("path"),
  fs = require("fs"),
  Q = require ("q"),
  exec = Q.nfbind(require("child_process").exec);

function installTasks() {
  var promise = Q();
  var taskPath = path.join(process.cwd(), "code-push-vsts-task");
  promise = promise.then(function() {
      console.log("Uploading task code-push-vsts-task");
      process.chdir(taskPath);
      return npmInstall();
    })
    .then(tfxUpload);
  return promise;
}

function npmInstall() {
  console.log("Installing npm dependencies for task...");
  return exec("npm install --only=prod").then(logExecReturn);
}

function tfxUpload() {
  console.log("Transferring...")
  return exec("tfx build tasks upload . --overwrite true").then(logExecReturn);
}

function logExecReturn(result) {
  console.log(result[0]);
  if (result[1] !== "") {
    console.error(result[1]);
  }
}

installTasks()
  .done(function() {
    console.log("Upload complete!");
  }, function(input) {
    console.log("Upload failed!");
  });