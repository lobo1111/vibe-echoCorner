#!/bin/bash

# Script to directly enable CORS on API Gateway without CloudFormation
# Usage: ./update_api_cors_direct.sh <api-id>

API_ID=${1:-"m97gq044y3"}
STAGE_NAME="prod"

echo "=== Enabling CORS for API Gateway (Direct Method) ==="
echo "API ID: $API_ID"
echo "Stage: $STAGE_NAME"

# Update the API Gateway directly using AWS CLI
echo "Getting all resources in the API..."
aws apigateway get-resources \
  --rest-api-id $API_ID \
  --profile sandbox > api_resources.json

# Process each resource
echo "Processing resources to add CORS support..."
resources=$(cat api_resources.json | jq -r '.items[] | @base64')

for b64_resource in $resources; do
  resource=$(echo $b64_resource | base64 --decode)
  
  # Extract resource ID and path
  resource_id=$(echo $resource | jq -r '.id')
  path=$(echo $resource | jq -r '.path')
  
  echo "Processing resource: $path (ID: $resource_id)"
  
  # Get resource details
  aws apigateway get-resource \
    --rest-api-id $API_ID \
    --resource-id $resource_id \
    --profile sandbox > resource_details.json
  
  # Check if resource has methods
  if jq -e '.resourceMethods' resource_details.json > /dev/null; then
    # Get methods for this resource
    methods=$(jq -r '.resourceMethods | keys[]' resource_details.json)
    echo "  Methods found: $methods"
    
    # Check if OPTIONS method exists
    if ! echo "$methods" | grep -q "OPTIONS"; then
      echo "  Adding OPTIONS method..."
      aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --authorization-type NONE \
        --profile sandbox
      
      echo "  Adding MOCK integration for OPTIONS..."
      aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json":"{\"statusCode\": 200}"}' \
        --profile sandbox
      
      echo "  Adding integration response for OPTIONS..."
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
      
      echo "  Adding method response for OPTIONS..."
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
    
    # Update all non-OPTIONS methods
    for method in $methods; do
      if [ "$method" != "OPTIONS" ]; then
        echo "  Adding CORS headers to $method method..."
        
        # Check if method has a 200 response
        if aws apigateway get-method-response \
          --rest-api-id $API_ID \
          --resource-id $resource_id \
          --http-method $method \
          --status-code 200 \
          --profile sandbox > /dev/null 2>&1; then
          
          # Update existing response to add CORS headers
          echo "  Updating existing method response for $method..."
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
        else
          # Create a new 200 response with CORS headers
          echo "  No 200 response found for $method, creating one..."
          aws apigateway put-method-response \
            --rest-api-id $API_ID \
            --resource-id $resource_id \
            --http-method $method \
            --status-code 200 \
            --response-parameters '{
              "method.response.header.Access-Control-Allow-Origin": true
            }' \
            --profile sandbox
        fi
        
        # Check if method has integration response
        if aws apigateway get-integration-response \
          --rest-api-id $API_ID \
          --resource-id $resource_id \
          --http-method $method \
          --status-code 200 \
          --profile sandbox > /dev/null 2>&1; then
          
          # Update integration response to add CORS headers
          echo "  Updating integration response for $method..."
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
        else
          echo "  No integration response found for $method, skipping..."
        fi
      fi
    done
  else
    echo "  No methods found for this resource, skipping..."
  fi
done

# Deploy the API to make changes effective
echo "Creating new deployment..."
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name $STAGE_NAME \
  --description "CORS configured for localhost access" \
  --profile sandbox

# Clean up temporary files
echo "Cleaning up..."
rm api_resources.json resource_details.json

echo "CORS configuration complete!"
echo "Your API now supports requests from http://localhost:8081"
echo "Try accessing: https://$API_ID.execute-api.eu-central-1.amazonaws.com/$STAGE_NAME/notifications" 