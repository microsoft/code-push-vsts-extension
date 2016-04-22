param (
    [string]$authType,
    [string]$accessKey,
    [string]$serviceEndpointCodePush,
    [string]$serviceEndpointHockeyApp,
    [string]$appName,
    [string]$deploymentName,
    [string]$platform,
    [string]$shouldBuild,
    [string]$appStoreVersion,
    [string]$rollout,
    [string]$description,
    [string]$isMandatory,
    [string]$isDisabled
) 
  
$env:INPUT_authType = $authType
$env:INPUT_accessKey = $accessKey
$env:INPUT_serviceEndpointCodePush = $serviceEndpointCodePush
$env:INPUT_serviceEndpointHockeyApp = $serviceEndpointHockeyApp
$env:INPUT_appName = $appName
$env:INPUT_deploymentName = $deploymentName
$env:INPUT_platform = $platform
$env:INPUT_shouldBuild = $shouldBuild
$env:INPUT_appStoreVersion = $appStoreVersion
$env:INPUT_rolloutput = $rollout
$env:INPUT_description = $description
$env:INPUT_isMandatory = $isMandatory
$env:INPUT_isDisabled = $isDisabled

node codepush-release.js