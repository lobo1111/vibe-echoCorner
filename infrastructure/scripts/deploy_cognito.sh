#!/bin/bash

# Script to deploy the Cognito User Pool CloudFormation stack
# Usage: ./deploy_cognito.sh <stack-name> <admin-email>

STACK_NAME=${1:-"echoCorner-auth"}
ADMIN_EMAIL=${2:-"admin@example.com"}
TEMPLATE_PATH="../templates/cognito_userpool_basic.yaml"
USER_POOL_NAME="echoCorner-UserPool"

echo "Deploying Cognito User Pool stack: $STACK_NAME"
echo "Using admin email: $ADMIN_EMAIL"

# Validate the template first
aws cloudformation validate-template \
  --template-body file://$TEMPLATE_PATH \
  --profile sandbox

# Deploy the stack
aws cloudformation deploy \
  --template-file $TEMPLATE_PATH \
  --stack-name $STACK_NAME \
  --parameter-overrides \
    UserPoolName=$USER_POOL_NAME \
    AdminEmail=$ADMIN_EMAIL \
  --capabilities CAPABILITY_IAM \
  --profile sandbox

# If deployment successful, get the outputs
if [ $? -eq 0 ]; then
  echo "Deployment successful! Retrieving stack outputs..."
  
  # Get stack outputs
  outputs=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query "Stacks[0].Outputs" \
    --output json \
    --profile sandbox)
  
  # Extract relevant output values
  user_pool_id=$(echo $outputs | jq -r '.[] | select(.OutputKey=="UserPoolId") | .OutputValue')
  client_id=$(echo $outputs | jq -r '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue')
  domain_url=$(echo $outputs | jq -r '.[] | select(.OutputKey=="UserPoolDomainUrl") | .OutputValue')
  region=$(aws configure get region --profile sandbox)
  
  # Create or update the cognito.json output file
  echo "Saving Cognito configuration to outputs/cognito.json"
  cat > ../outputs/cognito.json << EOF
{
  "userPoolId": "$user_pool_id",
  "clientId": "$client_id",
  "region": "$region",
  "domainUrl": "$domain_url"
}
EOF

  echo "Configuration saved to outputs/cognito.json"
  echo "Cognito User Pool ID: $user_pool_id"
  echo "Cognito Client ID: $client_id"
  echo "Cognito Domain URL: $domain_url"
  echo "AWS Region: $region"
else
  echo "Deployment failed!"
  exit 1
fi 