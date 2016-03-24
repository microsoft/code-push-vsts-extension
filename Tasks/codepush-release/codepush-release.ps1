param (
    [string]$authType,
    [string]$accessKey,
    [string]$serviceEndpointCodePush,
    [string]$serviceEndpointHockeyApp,
    [string]$appName,
    [string]$packagePath,
    [string]$appStoreVersion,
    [string]$deploymentName,
    [string]$description,
    [string]$rollout,
    [string]$isMandatory,
    [string]$isDisabled
) 
  
$env:INPUT_authType = $authType
$env:INPUT_accessKey = $accessKey
$env:INPUT_serviceEndpointCodePush = $serviceEndpointCodePush
$env:INPUT_serviceEndpointHockeyApp = $serviceEndpointHockeyApp
$env:INPUT_appName = $appName
$env:INPUT_packagePath = $packagePath
$env:INPUT_appStoreVersion = $appStoreVersion
$env:INPUT_deploymentName = $deploymentName
$env:INPUT_description = $description
$env:INPUT_rolloutput = $rollout
$env:INPUT_isMandatory = $isMandatory
$env:INPUT_isDisabled = $isDisabled

node codepush-release.js