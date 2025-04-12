# Backend Services

## Mock Notifications API

A CloudFormation stack that creates an API Gateway REST API with a mock integration to return a list of mock notifications.

### API Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | /notifications | Returns a hardcoded JSON array of 15 mock notifications. Requires Cognito authentication. |

### Deployment Steps

To deploy the API Gateway stack:

```bash
aws cloudformation deploy \
  --template-file backend/stepfunctions/api-notification-restapi.yaml \
  --stack-name mock-notification-api \
  --capabilities CAPABILITY_NAMED_IAM \
  --profile sandbox
```

For Windows:

```bash
aws cloudformation deploy ^
  --template-file backend/stepfunctions/api-notification-restapi.yaml ^
  --stack-name mock-notification-api ^
  --capabilities CAPABILITY_NAMED_IAM ^
  --profile sandbox
```

### Testing the API

After deployment, you can test the API using the following curl command with a valid JWT token:

```bash
curl -H "Authorization: <Cognito_ID_Token>" \
  https://<api-id>.execute-api.<region>.amazonaws.com/prod/notifications
```

Replace `<api-id>` and `<region>` with the actual values from the stack outputs.

To get the API endpoint from the stack:

```bash
aws cloudformation describe-stacks --stack-name mock-notification-api --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" --output text --profile sandbox
```

### Authentication with Cognito

The API is secured with Amazon Cognito User Pool authentication. To access the API:

1. Obtain a JWT token by authenticating with the Cognito User Pool:
   - Use the Amplify SDK in the frontend application
   - Or use the Cognito API directly:

```bash
# Get a token using the AWS CLI
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id <client_id> \
  --auth-parameters USERNAME=<username>,PASSWORD=<password> \
  --profile sandbox
```

2. Extract the ID token from the response
3. Include the ID token in the Authorization header when making requests to the API

### Cognito User Pool Configuration

The API uses the Cognito User Pool defined in:
- File: `/infrastructure/outputs/cognito.json`
- Current User Pool ID: `eu-central-1_KYoRPR6pm`

### Shared API Endpoint Information

The API endpoint URL is stored in a shared location for cross-agent access:

- **File Location**: `/backend/outputs/notification-api.json`
- **Format**:
  ```json
  {
    "notificationApiUrl": "https://<api-id>.execute-api.<region>.amazonaws.com/prod"
  }
  ```

This file contains the base URL for the notifications API and is available for the Frontend Agent to read (but not modify). The actual notifications endpoint is available at `{notificationApiUrl}/notifications`.
