param (
    [string]$accessKey,
    [string]$serviceEndpoint,
    [string]$appName,
    [string]$packagePath,
    [string]$appStoreVersion,
    [string]$deploymentName,
    [string]$description,
    [string]$isMandatory
) 
  
$env:INPUT_accessKey = $accessKey
$env:INPUT_serviceEndpoint = $serviceEndpoint
$env:INPUT_appName = $appName
$env:INPUT_packagePath = $packagePath
$env:INPUT_appStoreVersion = $appStoreVersion
$env:INPUT_deploymentName = $deploymentName
$env:INPUT_description = $description
$env:INPUT_isMandatory = $isMandatory

node CodePush.js