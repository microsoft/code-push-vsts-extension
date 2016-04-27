param (
    [string]$authType,
    [string]$accessKey,
    [string]$serviceEndpointCodePush,
    [string]$serviceEndpointHockeyApp,
    [string]$appName,
    [string]$deploymentName,
    [string]$releaseLabel,
    [string]$description,
    [string]$isMandatory,
    [string]$isDisabled,
    [string]$rollout
    [string]$appStoreVersion
) 
  
$env:INPUT_authType = $authType
$env:INPUT_accessKey = $accessKey
$env:INPUT_serviceEndpointCodePush = $serviceEndpointCodePush
$env:INPUT_serviceEndpointHockeyApp = $serviceEndpointHockeyApp
$env:INPUT_appName = $appName
$env:INPUT_deploymentName = $deploymentName
$env:INPUT_releaseLabel = $releaseLabel
$env:INPUT_description = $description
$env:INPUT_isMandatory = $isMandatory
$env:INPUT_isDisabled = $isDisabled
$env:INPUT_rolloutput = $rollout
$env:INPUT_appStoreVersion = $appStoreVersion

node codepush-release.js