@echo off
REM Script to deploy the Cognito User Pool CloudFormation stack
REM Usage: deploy_cognito.bat [stack-name] [admin-email]

SET STACK_NAME=%1
IF "%STACK_NAME%"=="" SET STACK_NAME=echoCorner-auth

SET ADMIN_EMAIL=%2
IF "%ADMIN_EMAIL%"=="" SET ADMIN_EMAIL=admin@example.com

SET TEMPLATE_PATH=..\templates\cognito_userpool_basic.yaml
SET USER_POOL_NAME=echoCorner-UserPool

echo Deploying Cognito User Pool stack: %STACK_NAME%
echo Using admin email: %ADMIN_EMAIL%

REM Validate the template first
aws cloudformation validate-template --template-body file://%TEMPLATE_PATH% --profile sandbox

REM Deploy the stack
aws cloudformation deploy ^
  --template-file %TEMPLATE_PATH% ^
  --stack-name %STACK_NAME% ^
  --parameter-overrides ^
    UserPoolName=%USER_POOL_NAME% ^
    AdminEmail=%ADMIN_EMAIL% ^
  --capabilities CAPABILITY_IAM ^
  --profile sandbox

REM If deployment successful, get the outputs
IF %ERRORLEVEL% EQU 0 (
  echo Deployment successful! Retrieving stack outputs...
  
  REM Get region
  FOR /F "tokens=*" %%g IN ('aws configure get region --profile sandbox') do (SET REGION=%%g)
  
  REM Get outputs and save to a temporary file
  aws cloudformation describe-stacks --stack-name %STACK_NAME% --query "Stacks[0].Outputs" --output json --profile sandbox > temp_outputs.json
  
  REM Use PowerShell to extract values (as Windows batch doesn't have good JSON parsing)
  FOR /F "tokens=*" %%g IN ('powershell -Command "(Get-Content temp_outputs.json | ConvertFrom-Json | Where-Object { $_.OutputKey -eq 'UserPoolId' }).OutputValue"') do (SET USER_POOL_ID=%%g)
  FOR /F "tokens=*" %%g IN ('powershell -Command "(Get-Content temp_outputs.json | ConvertFrom-Json | Where-Object { $_.OutputKey -eq 'UserPoolClientId' }).OutputValue"') do (SET CLIENT_ID=%%g)
  FOR /F "tokens=*" %%g IN ('powershell -Command "(Get-Content temp_outputs.json | ConvertFrom-Json | Where-Object { $_.OutputKey -eq 'UserPoolDomainUrl' }).OutputValue"') do (SET DOMAIN_URL=%%g)
  
  REM Clean up temp file
  del temp_outputs.json
  
  REM Create or update the cognito.json output file
  echo Saving Cognito configuration to outputs/cognito.json
  
  echo { > ..\outputs\cognito.json
  echo   "userPoolId": "%USER_POOL_ID%", >> ..\outputs\cognito.json
  echo   "clientId": "%CLIENT_ID%", >> ..\outputs\cognito.json
  echo   "region": "%REGION%", >> ..\outputs\cognito.json
  echo   "domainUrl": "%DOMAIN_URL%" >> ..\outputs\cognito.json
  echo } >> ..\outputs\cognito.json
  
  echo Configuration saved to outputs/cognito.json
  echo Cognito User Pool ID: %USER_POOL_ID%
  echo Cognito Client ID: %CLIENT_ID%
  echo Cognito Domain URL: %DOMAIN_URL%
  echo AWS Region: %REGION%
) ELSE (
  echo Deployment failed!
  exit /b 1
) 