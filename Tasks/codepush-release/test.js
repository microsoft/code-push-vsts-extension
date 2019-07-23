var sinon = require("sinon");
var assert = require("assert");
var tl = require("azure-pipelines-task-lib");
var CodePush = require("./codepush-release");

const ACCESS_KEY        = "key123";
const APP_NAME          = "TestApp";
const PACKAGE_PATH      = "TestApp/www";
const APP_STORE_VERSION = "1.0.0";
const DEPLOYMENT_NAME   = "TestDeployment";
const DESCRIPTION       = "This is a Test App";
const ROLLOUT           = "25";
const IS_MANDATORY      = false;
const IS_DISABLED       = true;

describe("CodePush Deploy Task", function() {
  var spies = [];
  
  before(function() {
    // Silence console output from the build task.
    sinon.stub(CodePush, "log").callsFake(function() { });
  });
  
  afterEach(function() {
    // Restore all spied methods.
    spies.forEach(function(spy) {
      spy.restore();
    });
    spies = [];
  });
  
  function stubExecToFailOnCommandType(commandType) {
    // If commandType not specified, all will succeed.
    var execStub = sinon.stub(global, "exec").callsFake(function(command) {
      return {
        code: !commandType || command.indexOf(commandType) == -1 ? 0 : 1,
        output: command
      }
    });
    
    spies.push(global.exec);
    return execStub;
  }
  
  function checkCommandsEqual(expectedCommands, execStub) {
    assert.equal(execStub.callCount, expectedCommands.length, "Expected " + expectedCommands.length + " commands, but executed " + execStub.callCount);
    expectedCommands.forEach(function(expectedCommand, i) {
      var actualCommand = execStub.getCall(i).args[0].substring(CodePush.commandPrefix.length + /*space*/1);
      assert.equal(expectedCommand, actualCommand, "Expected: " + expectedCommand + " Got: " + actualCommand);
    });
  }
  
  function performDeployTask(shouldFail) {
    var performDeployTaskSpy = sinon.spy(CodePush, "performDeployTask");
    spies.push(CodePush.performDeployTask)
    
    var tlSetResultSpy = sinon.stub(tl, "setResult").callsFake(function() {});
    spies.push(tl.setResult);
    
    try {
      CodePush.performDeployTask(ACCESS_KEY, APP_NAME, PACKAGE_PATH, APP_STORE_VERSION, DEPLOYMENT_NAME, DESCRIPTION, ROLLOUT, IS_MANDATORY, IS_DISABLED);
    } catch (e) {
      assert(shouldFail, "Threw an unexpected error");
    }
    
    if (shouldFail) {
      assert(performDeployTaskSpy.threw(), "Did not throw an error");
      assert.equal(tlSetResultSpy.called && tlSetResultSpy.firstCall.args[0], 1, "Did not set task result to 1 on failure");
    } else {
      assert(!tlSetResultSpy.called, "Should not set task result if task succeeds");
    }
  }
  
  
  it("Should invoke CLI to logout, login, release (with provided arguments), and logout", function() {
    var execStub = stubExecToFailOnCommandType(/*all succeed*/);
    
    performDeployTask(); 
    
    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "release \"" + APP_NAME + "\" \"" + PACKAGE_PATH + "\" \"" + APP_STORE_VERSION + "\" --deploymentName \"" + DEPLOYMENT_NAME + "\" --description \"" + DESCRIPTION + "\" --rollout \"" + ROLLOUT + "\" --disabled",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
  
  
  it("Logout failure should not cause task to terminate", function() {
    var execStub = stubExecToFailOnCommandType("logout");
    
    performDeployTask();
    
    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "release \"" + APP_NAME + "\" \"" + PACKAGE_PATH + "\" \"" + APP_STORE_VERSION + "\" --deploymentName \"" + DEPLOYMENT_NAME + "\" --description \"" + DESCRIPTION + "\" --rollout \"" + ROLLOUT + "\" --disabled",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
  
  
  it("Should logout and throw error if login fails", function() {
    var execStub = stubExecToFailOnCommandType("login")
    
    performDeployTask(/*shouldFail*/ true);
    
    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
  
  
  it("Should logout and throw error if release fails", function() {
    var execStub = stubExecToFailOnCommandType("release");
    
    performDeployTask(/*shouldFail*/ true);

    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
});