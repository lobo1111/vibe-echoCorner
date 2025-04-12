@echo off
REM Script to enable CORS on API Gateway for Windows
REM Usage: update_api_cors.bat [api-id]

SET API_ID=%1
IF "%API_ID%"=="" SET API_ID=m97gq044y3
SET STAGE_NAME=prod

echo === Enabling CORS for API Gateway ===
echo API ID: %API_ID%
echo Stage: %STAGE_NAME%

REM Get the root resource ID for the API Gateway
echo Retrieving root resource ID...
FOR /F "tokens=*" %%g IN ('aws apigateway get-resources --rest-api-id %API_ID% --query "items[?path=='/'].id" --output text --profile sandbox') do (SET ROOT_RESOURCE_ID=%%g)

REM If we can't get the root resource ID via API, use AWS console
IF "%ROOT_RESOURCE_ID%"=="" (
  echo Could not retrieve root resource ID automatically.
  echo Please find it in the AWS console and enter it now:
  set /p ROOT_RESOURCE_ID=
)

echo Root Resource ID: %ROOT_RESOURCE_ID%

REM Create a temporary export values file for CloudFormation
echo Creating CloudFormation export values...
echo Resources: > temp-exports.yaml
echo   DummyResource: >> temp-exports.yaml
echo     Type: 'AWS::CloudFormation::WaitConditionHandle' >> temp-exports.yaml
echo Outputs: >> temp-exports.yaml
echo   ApiGatewayRootResourceId: >> temp-exports.yaml
echo     Value: %ROOT_RESOURCE_ID% >> temp-exports.yaml
echo     Export: >> temp-exports.yaml
echo       Name: ApiGatewayRootResourceId >> temp-exports.yaml

REM Deploy the export values stack
echo Deploying export values stack...
aws cloudformation deploy --template-file temp-exports.yaml --stack-name api-gateway-exports --profile sandbox

REM Wait for exports to be available
echo Waiting for exports to be available...
ping -n 11 127.0.0.1 > nul

REM Deploy the CORS update stack
echo Deploying CORS update stack...
aws cloudformation deploy --template-file ..\templates\api_gateway_cors.yaml --stack-name api-gateway-cors-update --parameter-overrides ApiGatewayId=%API_ID% StageName=%STAGE_NAME% --profile sandbox

REM Clean up temporary files
echo Cleaning up...
del temp-exports.yaml

REM If deployment successful, add specific allowed origins
IF %ERRORLEVEL% EQU 0 (
  echo Deployment successful!
  echo Adding specific CORS configuration via API Gateway API...
  
  REM Update the API Gateway directly using AWS CLI to add specific CORS settings for localhost
  powershell -Command "aws apigateway get-resources --rest-api-id %API_ID% --profile sandbox | ConvertFrom-Json | Select-Object -ExpandProperty items | ForEach-Object { $resourceId = $_.id; Write-Host \"Enabling CORS for resource $resourceId...\"; $methods = aws apigateway get-resource --rest-api-id %API_ID% --resource-id $resourceId --profile sandbox | ConvertFrom-Json | Select-Object -ExpandProperty resourceMethods; if ($methods -eq $null) { Write-Host \"No methods found for resource $resourceId, skipping...\" } else { $methodNames = $methods | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name; if (!($methodNames -contains 'OPTIONS')) { Write-Host \"Adding OPTIONS method to resource $resourceId...\"; aws apigateway put-method --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --profile sandbox; aws apigateway put-integration --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' --profile sandbox; aws apigateway put-integration-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"\\\"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\\\"\",\"method.response.header.Access-Control-Allow-Methods\":\"\\\"GET,POST,PUT,DELETE,OPTIONS\\\"\",\"method.response.header.Access-Control-Allow-Origin\":\"\\\"http://localhost:8081\\\"\"}' --profile sandbox; aws apigateway put-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":true,\"method.response.header.Access-Control-Allow-Methods\":true,\"method.response.header.Access-Control-Allow-Origin\":true}' --profile sandbox } foreach ($method in $methodNames) { if ($method -ne 'OPTIONS') { Write-Host \"Adding CORS to $method method for resource $resourceId...\"; try { aws apigateway update-integration-response --rest-api-id %API_ID% --resource-id $resourceId --http-method $method --status-code 200 --patch-operations '[{\"op\":\"add\",\"path\":\"/responseParameters/method.response.header.Access-Control-Allow-Origin\",\"value\":\"\\\"http://localhost:8081\\\"\"}]' --profile sandbox; aws apigateway update-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method $method --status-code 200 --patch-operations '[{\"op\":\"add\",\"path\":\"/responseParameters/method.response.header.Access-Control-Allow-Origin\",\"value\":\"true\"}]' --profile sandbox } catch { Write-Host \"Error updating method $method for resource $resourceId\" } } } } }"
  
  REM Deploy the API to make changes effective
  echo Deploying API changes...
  aws apigateway create-deployment --rest-api-id %API_ID% --stage-name %STAGE_NAME% --description "Added CORS support for localhost" --profile sandbox
  
  echo CORS configuration complete!
  echo Your API now supports requests from http://localhost:8081
) ELSE (
  echo Deployment failed!
  exit /b 1
) 