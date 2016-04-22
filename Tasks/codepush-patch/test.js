var sinon = require("sinon");
var assert = require("assert");
var tl = require("vsts-task-lib");
var CodePush = require("./codepush-patch");

const ACCESS_KEY = "key123";
const APP_NAME = "TestApp";
const DEPLOYMENT_NAME = "TestDeployment";
const LABEL = "TestLabel"
const DESCRIPTION = "This is a Test App";
const IS_DISABLED = true;
const IS_MANDATORY = false;
const ROLLOUT = "25";
const APP_STORE_VERSION = "1.0.0";

describe("CodePush Deploy Task", function () {
    var spies = [];

    before(function () {
        // Silence console output from the build task.
        sinon.stub(CodePush, "log", function () { });
    });

    afterEach(function () {
        // Restore all spied methods.
        spies.forEach(function (spy) {
            spy.restore();
        });
        spies = [];
    });

    function stubExecToFailOnCommandType(commandType) {
        // If commandType not specified, all will succeed.
        var execStub = sinon.stub(global, "exec", function (command) {
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
        expectedCommands.forEach(function (expectedCommand, i) {
            var actualCommand = execStub.getCall(i).args[0].substring(CodePush.commandPrefix.length + /*space*/1);
            assert.equal(expectedCommand, actualCommand, "Expected: " + expectedCommand + " Got: " + actualCommand);
        });
    }

    function performPatchTask(shouldFail) {
        var performPatchTaskSpy = sinon.spy(CodePush, "performPatchTask");
        spies.push(CodePush.performPatchTask);

        var tlSetResultSpy = sinon.stub(tl, "setResult", function () { });
        spies.push(tl.setResult);

        try {
            CodePush.performPatchTask(ACCESS_KEY, APP_NAME, DEPLOYMENT_NAME, LABEL, DESCRIPTION, IS_DISABLED, IS_MANDATORY, ROLLOUT, APP_STORE_VERSION);
        } catch (e) {
            assert(shouldFail, "Threw an unexpected error");
        }

        if (shouldFail) {
            assert(performPatchTaskSpy.threw(), "Did not throw an error");
            assert.equal(tlSetResultSpy.called && tlSetResultSpy.firstCall.args[0], 1, "Did not set task result to 1 on failure");
        } else {
            assert(!tlSetResultSpy.called, "Should not set task result if task succeeds");
        }
    }


    it("Should invoke CLI to logout, login, patch (with provided arguments), and logout", function () {
        var execStub = stubExecToFailOnCommandType(/*all succeed*/);

        performPatchTask();

        var expectedCommands = [
            "logout",
            `login --accessKey "${ACCESS_KEY}"`,
            `patch "${APP_NAME}" "${DEPLOYMENT_NAME}" --label "${LABEL}" --description "${DESCRIPTION}" --disabled --rollout "${ROLLOUT}" --targetBinaryVersion "${APP_STORE_VERSION}"`,
            "logout"
        ];

        checkCommandsEqual(expectedCommands, execStub);
    });


    it("Logout failure should not cause task to terminate", function () {
        var execStub = stubExecToFailOnCommandType("logout");

        performPatchTask();

        var expectedCommands = [
            "logout",
            `login --accessKey "${ACCESS_KEY}"`,
            `patch "${APP_NAME}" "${DEPLOYMENT_NAME}" --label "${LABEL}" --description "${DESCRIPTION}" --disabled --rollout "${ROLLOUT}" --targetBinaryVersion "${APP_STORE_VERSION}"`,
            "logout"
        ];

        checkCommandsEqual(expectedCommands, execStub);
    });


    it("Should logout and throw error if login fails", function () {
        var execStub = stubExecToFailOnCommandType("login")

        performPatchTask(/*shouldFail*/ true);

        var expectedCommands = [
            "logout",
            `login --accessKey "${ACCESS_KEY}"`,
            "logout"
        ];

        checkCommandsEqual(expectedCommands, execStub);
    });


    it("Should logout and throw error if patch fails", function () {
        var execStub = stubExecToFailOnCommandType("patch");

        performPatchTask(/*shouldFail*/ true);

        var expectedCommands = [
            "logout",
            `login --accessKey "${ACCESS_KEY}"`,
            "logout"
        ];

        checkCommandsEqual(expectedCommands, execStub);
    });
});