#!/bin/bash

# Script to enable CORS on API Gateway
# Usage: ./update_api_cors.sh <api-id>

API_ID=${1:-"m97gq044y3"}
STAGE_NAME="prod"
STACK_NAME="api-gateway-cors-update"
TEMPLATE_PATH="../templates/api_gateway_cors.yaml"

echo "=== Enabling CORS for API Gateway ==="
echo "API ID: $API_ID"
echo "Stage: $STAGE_NAME"

# Get the root resource ID for the API Gateway
echo "Retrieving root resource ID..."
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
  --rest-api-id $API_ID \
  --query "items[?path=='/'].id" \
  --output text \
  --profile sandbox)

# If we can't get the root resource ID via API, use AWS console
if [ -z "$ROOT_RESOURCE_ID" ]; then
  echo "Could not retrieve root resource ID automatically."
  echo "Please find it in the AWS console and enter it now:"
  read ROOT_RESOURCE_ID
fi

echo "Root Resource ID: $ROOT_RESOURCE_ID"

# Create a temporary export values file for CloudFormation
echo "Creating CloudFormation export values..."
cat > ./temp-exports.yaml << EOF
Resources:
  DummyResource:
    Type: 'AWS::CloudFormation::WaitConditionHandle'
Outputs:
  ApiGatewayRootResourceId:
    Value: $ROOT_RESOURCE_ID
    Export:
      Name: ApiGatewayRootResourceId
EOF

# Deploy the export values stack
echo "Deploying export values stack..."
aws cloudformation deploy \
  --template-file ./temp-exports.yaml \
  --stack-name api-gateway-exports \
  --profile sandbox

# Wait for exports to be available
echo "Waiting for exports to be available..."
sleep 10

# Deploy the CORS update stack
echo "Deploying CORS update stack..."
aws cloudformation deploy \
  --template-file $TEMPLATE_PATH \
  --stack-name $STACK_NAME \
  --parameter-overrides \
    ApiGatewayId=$API_ID \
    StageName=$STAGE_NAME \
  --profile sandbox

# Clean up temporary files
echo "Cleaning up..."
rm ./temp-exports.yaml

# If deployment successful, add specific allowed origins
if [ $? -eq 0 ]; then
  echo "Deployment successful!"
  echo "Adding specific CORS configuration via API Gateway API..."
  
  # Add localhost origins to specific resources directly using AWS CLI
  echo "Enabling CORS for all resources..."
  resources=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query "items[].id" \
    --output text \
    --profile sandbox)
  
  for resource_id in $resources; do
    echo "Enabling CORS for resource $resource_id..."
    # Get resource methods
    methods=$(aws apigateway get-resource \
      --rest-api-id $API_ID \
      --resource-id $resource_id \
      --query "resourceMethods" \
      --output text \
      --profile sandbox)
    
    # Skip if this resource has no methods
    if [ -z "$methods" ]; then
      echo "No methods found for resource $resource_id, skipping..."
      continue
    fi
    
    # Add OPTIONS method if it doesn't exist
    if [[ ! $methods =~ "OPTIONS" ]]; then
      echo "Adding OPTIONS method to resource $resource_id..."
      aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --authorization-type NONE \
        --profile sandbox
        
      # Add MOCK integration
      aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json":"{\"statusCode\": 200}"}' \
        --profile sandbox
        
      # Add integration response
      aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
          "method.response.header.Access-Control-Allow-Headers": "'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'",
          "method.response.header.Access-Control-Allow-Methods": "'"'GET,POST,PUT,DELETE,OPTIONS'"'",
          "method.response.header.Access-Control-Allow-Origin": "'"'http://localhost:8081'"'"
        }' \
        --profile sandbox
        
      # Add method response
      aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
          "method.response.header.Access-Control-Allow-Headers": true,
          "method.response.header.Access-Control-Allow-Methods": true,
          "method.response.header.Access-Control-Allow-Origin": true
        }' \
        --profile sandbox
    fi
    
    # Update all non-OPTIONS methods with CORS headers
    for method in $methods; do
      # Skip OPTIONS as we've already handled it
      if [ "$method" = "OPTIONS" ]; then
        continue
      fi
      
      echo "Adding CORS to $method method for resource $resource_id..."
      
      # Add CORS headers to integration responses for existing methods
      aws apigateway update-integration-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $method \
        --status-code 200 \
        --patch-operations '[
          {
            "op": "add",
            "path": "/responseParameters/method.response.header.Access-Control-Allow-Origin",
            "value": "'"'http://localhost:8081'"'"
          }
        ]' \
        --profile sandbox
        
      # Update method response to allow CORS headers
      aws apigateway update-method-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $method \
        --status-code 200 \
        --patch-operations '[
          {
            "op": "add",
            "path": "/responseParameters/method.response.header.Access-Control-Allow-Origin",
            "value": "true"
          }
        ]' \
        --profile sandbox
    done
  done
  
  # Deploy the API to make changes effective
  echo "Deploying API changes..."
  aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE_NAME \
    --description "Added CORS support for localhost" \
    --profile sandbox
    
  echo "CORS configuration complete!"
  echo "Your API now supports requests from http://localhost:8081"
else
  echo "Deployment failed!"
  exit 1
fi 