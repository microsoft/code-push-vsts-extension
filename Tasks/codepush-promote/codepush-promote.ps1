param (
    [string]$authType,
    [string]$accessKey,
    [string]$serviceEndpointCodePush,
    [string]$serviceEndpointHockeyApp,
    [string]$appName,
    [string]$sourceDeploymentName,
    [string]$targetDeploymentName,
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
$env:INPUT_sourceDeploymentName = $sourceDeploymentName
$env:INPUT_targetDeploymentName = $targetDeploymentName
$env:INPUT_rolloutput = $rollout
$env:INPUT_description = $description
$env:INPUT_isMandatory = $isMandatory
$env:INPUT_isDisabled = $isDisabled

node codepush-promote.js