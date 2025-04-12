@echo off
REM Simple script to enable CORS on API Gateway
REM Usage: update_api_cors_simple.bat

SET API_ID=m97gq044y3
SET STAGE_NAME=prod
SET LOCALHOST_URL=http://localhost:8081

echo === Enabling CORS for API Gateway (Simple Method) ===
echo API ID: %API_ID%
echo Stage: %STAGE_NAME%

REM Step 1: Enable CORS via the simple AWS CLI command
echo Enabling CORS for API root resource...
powershell -Command "aws apigateway get-resources --rest-api-id %API_ID% --profile sandbox | ConvertFrom-Json | Select-Object -ExpandProperty items | Where-Object { $_.path -eq '/' } | ForEach-Object { $resourceId = $_.id; Write-Host 'Root resource ID: ' $resourceId; aws apigateway put-method --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --profile sandbox; aws apigateway put-integration --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' --profile sandbox; aws apigateway put-integration-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"\\\"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\\\"\",\"method.response.header.Access-Control-Allow-Methods\":\"\\\"GET,POST,PUT,DELETE,OPTIONS\\\"\",\"method.response.header.Access-Control-Allow-Origin\":\"\\\"http://localhost:8081\\\"\"}' --profile sandbox; aws apigateway put-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":true,\"method.response.header.Access-Control-Allow-Methods\":true,\"method.response.header.Access-Control-Allow-Origin\":true}' --profile sandbox; }"

echo Enabling CORS for /notifications resource...
powershell -Command "aws apigateway get-resources --rest-api-id %API_ID% --profile sandbox | ConvertFrom-Json | Select-Object -ExpandProperty items | Where-Object { $_.path -eq '/notifications' } | ForEach-Object { $resourceId = $_.id; Write-Host 'Notifications resource ID: ' $resourceId; aws apigateway put-method --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --profile sandbox; aws apigateway put-integration --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' --profile sandbox; aws apigateway put-integration-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"\\\"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\\\"\",\"method.response.header.Access-Control-Allow-Methods\":\"\\\"GET,POST,PUT,DELETE,OPTIONS\\\"\",\"method.response.header.Access-Control-Allow-Origin\":\"\\\"http://localhost:8081\\\"\"}' --profile sandbox; aws apigateway put-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":true,\"method.response.header.Access-Control-Allow-Methods\":true,\"method.response.header.Access-Control-Allow-Origin\":true}' --profile sandbox; }"

REM Step 2: Deploy the API to apply changes
echo Creating new deployment...
aws apigateway create-deployment --rest-api-id %API_ID% --stage-name %STAGE_NAME% --description "CORS enabled for localhost" --profile sandbox

echo CORS configuration complete!
echo Your API should now accept requests from %LOCALHOST_URL%
echo Try accessing: https://%API_ID%.execute-api.eu-central-1.amazonaws.com/%STAGE_NAME%/notifications 