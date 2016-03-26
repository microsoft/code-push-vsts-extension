var sinon = require("sinon");
var assert = require("assert");
var tl = require("vsts-task-lib");
var CodePush = require("./codepush-promote");

const ACCESS_KEY               = "key123";
const APP_NAME                 = "TestApp";
const SOURCE_DEPLOYMENT_NAME   = "TestSourceDeployment";
const TARGET_DEPLOYMENT_NAME   = "TestTargetDeployment";
const DESCRIPTION              = "Inherit";
const ROLLOUT                  = "25%";
const IS_MANDATORY             = "false";
const IS_DISABLED              = "Inherit";

describe("CodePush Promote Task", function() {
  var spies = [];
  
  before(function() {
    // Silence console output from the build task.
    sinon.stub(CodePush, "log", function() { });
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
    var execStub = sinon.stub(global, "exec", function(command) {
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
  
  function performPromoteTask(shouldFail) {
    var performPromoteTaskSpy = sinon.spy(CodePush, "performPromoteTask");
    spies.push(CodePush.performPromoteTask)
    
    var tlSetResultSpy = sinon.stub(tl, "setResult", function() {});
    spies.push(tl.setResult);
    
    try {
      CodePush.performPromoteTask(ACCESS_KEY, APP_NAME, SOURCE_DEPLOYMENT_NAME, TARGET_DEPLOYMENT_NAME, DESCRIPTION, ROLLOUT, IS_MANDATORY, IS_DISABLED);
    } catch (e) {
      assert(shouldFail, "Threw an unexpected error");
    }
    
    if (shouldFail) {
      assert(performPromoteTaskSpy.threw(), "Did not throw an error");
      assert.equal(tlSetResultSpy.called && tlSetResultSpy.firstCall.args[0], 1, "Did not set task result to 1 on failure");
    } else {
      assert(!tlSetResultSpy.called, "Should not set task result if task succeeds");
    }
  }
  
  
  it("Should invoke CLI to logout, login, promote (with provided arguments), and logout", function() {
    var execStub = stubExecToFailOnCommandType(/*all succeed*/);
    
    performPromoteTask(); 
    
    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "promote " + APP_NAME + " " + SOURCE_DEPLOYMENT_NAME + " " + TARGET_DEPLOYMENT_NAME + " --mandatory \"false\" --rollout \"" + ROLLOUT + "\"",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
  
  
  it("Logout failure should not cause task to terminate", function() {
    var execStub = stubExecToFailOnCommandType("logout");
    
    performPromoteTask();
    
    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "promote " + APP_NAME + " " + SOURCE_DEPLOYMENT_NAME + " " + TARGET_DEPLOYMENT_NAME + " --mandatory \"false\" --rollout \"" + ROLLOUT + "\"",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
  
  
  it("Should logout and throw error if login fails", function() {
    var execStub = stubExecToFailOnCommandType("login");
    
    performPromoteTask(/*shouldFail*/ true);
    
    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
  
  
  it("Should logout and throw error if promote fails", function() {
    var execStub = stubExecToFailOnCommandType("promote");
    
    performPromoteTask(/*shouldFail*/ true);

    var expectedCommands = [
      "logout",
      "login --accessKey \"" + ACCESS_KEY + "\"",
      "logout"
    ];
    
    checkCommandsEqual(expectedCommands, execStub);
  });
});