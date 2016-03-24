param (
    [string]$authType,
    [string]$accessKey,
    [string]$serviceEndpointCodePush,
    [string]$serviceEndpointHockeyApp,
    [string]$appName,
    [string]$sourceDeploymentName,
    [string]$targetDeploymentName
) 
  
$env:INPUT_authType = $authType
$env:INPUT_accessKey = $accessKey
$env:INPUT_serviceEndpointCodePush = $serviceEndpointCodePush
$env:INPUT_serviceEndpointHockeyApp = $serviceEndpointHockeyApp
$env:INPUT_appName = $appName
$env:INPUT_sourceDeploymentName = $sourceDeploymentName
$env:INPUT_targetDeploymentName = $targetDeploymentName

node codepush-promote.js