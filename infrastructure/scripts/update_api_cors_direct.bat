@echo off
REM Script to directly enable CORS on API Gateway for Windows without CloudFormation
REM Usage: update_api_cors_direct.bat [api-id]

SET API_ID=%1
IF "%API_ID%"=="" SET API_ID=m97gq044y3
SET STAGE_NAME=prod

echo === Enabling CORS for API Gateway (Direct Method) ===
echo API ID: %API_ID%
echo Stage: %STAGE_NAME%

REM Update the API Gateway directly using AWS CLI
echo Getting all resources in the API...
aws apigateway get-resources --rest-api-id %API_ID% --profile sandbox > api_resources.json

REM Process each resource using PowerShell
echo Processing resources to add CORS support...
powershell -Command "^
  $resources = Get-Content api_resources.json | ConvertFrom-Json;^
  foreach ($item in $resources.items) {^
    $resourceId = $item.id;^
    $path = $item.path;^
    Write-Host \"Processing resource: $path (ID: $resourceId)\";^
    ^
    # Get existing methods for this resource^
    $resourceData = aws apigateway get-resource --rest-api-id %API_ID% --resource-id $resourceId --profile sandbox | ConvertFrom-Json;^
    ^
    # Check if this resource has methods^
    if ($resourceData.resourceMethods) {^
      $methodNames = $resourceData.resourceMethods | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name;^
      Write-Host \"  Methods found: $methodNames\";^
      ^
      # Add OPTIONS method if it doesn't exist^
      if (-not ($methodNames -contains 'OPTIONS')) {^
        Write-Host \"  Adding OPTIONS method...\";^
        aws apigateway put-method --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --profile sandbox;^
        ^
        # Add MOCK integration for OPTIONS method^
        Write-Host \"  Adding MOCK integration for OPTIONS...\";^
        aws apigateway put-integration --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' --profile sandbox;^
        ^
        # Add integration response for OPTIONS method^
        Write-Host \"  Adding integration response for OPTIONS...\";^
        aws apigateway put-integration-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"\\\"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\\\"\",\"method.response.header.Access-Control-Allow-Methods\":\"\\\"GET,POST,PUT,DELETE,OPTIONS\\\"\",\"method.response.header.Access-Control-Allow-Origin\":\"\\\"http://localhost:8081\\\"\"}' --profile sandbox;^
        ^
        # Add method response for OPTIONS method^
        Write-Host \"  Adding method response for OPTIONS...\";^
        aws apigateway put-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":true,\"method.response.header.Access-Control-Allow-Methods\":true,\"method.response.header.Access-Control-Allow-Origin\":true}' --profile sandbox;^
      }^
      ^
      # Update all non-OPTIONS methods to include CORS headers^
      foreach ($method in $methodNames) {^
        if ($method -ne 'OPTIONS') {^
          Write-Host \"  Adding CORS headers to $method method...\";^
          ^
          # Get method response for this method^
          $hasResponse = $false;^
          try {^
            $methodResponse = aws apigateway get-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method $method --status-code 200 --profile sandbox;^
            $hasResponse = $true;^
          } catch {^
            Write-Host \"  No 200 response found for $method, creating one...\";^
            aws apigateway put-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method $method --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Origin\":true}' --profile sandbox;^
          }^
          ^
          if ($hasResponse) {^
            # Update existing response to add CORS headers^
            Write-Host \"  Updating existing method response for $method...\";^
            aws apigateway update-method-response --rest-api-id %API_ID% --resource-id $resourceId --http-method $method --status-code 200 --patch-operations '[{\"op\":\"add\",\"path\":\"/responseParameters/method.response.header.Access-Control-Allow-Origin\",\"value\":\"true\"}]' --profile sandbox;^
          }^
          ^
          # Get integration response for this method^
          $hasIntegrationResponse = $false;^
          try {^
            $integrationResponse = aws apigateway get-integration-response --rest-api-id %API_ID% --resource-id $resourceId --http-method $method --status-code 200 --profile sandbox;^
            $hasIntegrationResponse = $true;^
          } catch {^
            Write-Host \"  No integration response found for $method, skipping...\";^
          }^
          ^
          if ($hasIntegrationResponse) {^
            # Update integration response to add CORS headers^
            Write-Host \"  Updating integration response for $method...\";^
            aws apigateway update-integration-response --rest-api-id %API_ID% --resource-id $resourceId --http-method $method --status-code 200 --patch-operations '[{\"op\":\"add\",\"path\":\"/responseParameters/method.response.header.Access-Control-Allow-Origin\",\"value\":\"\\\"http://localhost:8081\\\"\"}]' --profile sandbox;^
          }^
        }^
      }^
    } else {^
      Write-Host \"  No methods found for this resource, skipping...\";^
    }^
  }^
"

REM Deploy the API to make changes effective
echo Creating new deployment...
aws apigateway create-deployment --rest-api-id %API_ID% --stage-name %STAGE_NAME% --description "CORS configured for localhost access" --profile sandbox

REM Clean up temporary files
echo Cleaning up...
del api_resources.json

echo CORS configuration complete!
echo Your API now supports requests from http://localhost:8081
echo Try accessing: https://%API_ID%.execute-api.eu-central-1.amazonaws.com/%STAGE_NAME%/notifications 