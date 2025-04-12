# Infrastructure

This directory contains infrastructure-as-code templates and resources.

## AWS Cognito User Pool

A basic AWS Cognito User Pool configuration is available for authentication services.

### Features

- Admin-only user creation (users cannot self-register)
- Email/password authentication
- Default Cognito email delivery

### Deployment Instructions

#### Prerequisites

- AWS CLI installed and configured
- Active AWS SSO session with the `sandbox` profile

#### Deploying the Cognito User Pool

1. Navigate to the root directory of the project

2. Deploy the CloudFormation stack:

```bash
aws cloudformation deploy \
  --template-file infrastructure/templates/cognito_userpool_basic.yaml \
  --stack-name cognito-basic-userpool \
  --region <aws-region> \
  --parameter-overrides UserPoolName=YourUserPoolName AdminEmail=tomasz@kopacki.eu \
  --profile sandbox
```

Replace `<aws-region>` with your desired AWS region (e.g., `us-east-1`).

3. After deployment, you can retrieve the stack outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name cognito-basic-userpool \
  --query "Stacks[0].Outputs" \
  --profile sandbox
```

### Test User Credentials

A test user has been created in the Cognito User Pool for development and testing purposes:

- Username: testuser@example.com
- The test user credentials are stored in `infrastructure/outputs/test-credentials.secret.json`

⚠️ **IMPORTANT**: The credentials file is marked as secret and should **NEVER** be committed to version control. It has been added to the `.gitignore` file to prevent accidental commits.

This file is intended for use by the Frontend Agent during development and testing only.

### Important Considerations

1. **Admin User Creation**: After deployment, you'll need to create users through the AWS Console or using the AWS CLI:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <user-pool-id> \
  --username user@example.com \
  --temporary-password 'TempPassword123!' \
  --profile sandbox
```

2. **Security**: The template includes standard password policies. Adjust these based on your security requirements.

3. **Integration**: To integrate with applications:
   - Use the UserPoolId and UserPoolClientId from the stack outputs
   - Configure your application's authentication flows accordingly

4. **Custom Email**: For production, consider configuring custom email settings instead of the Cognito default.

5. **Modification**: To modify the stack, update the template and redeploy using the same commands.
