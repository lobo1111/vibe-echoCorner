# AWS Console Instructions for Enabling CORS on API Gateway

Since the CLI scripts are encountering issues, here are manual steps to enable CORS using the AWS Management Console:

## Step 1: Log in to AWS Console

1. Go to https://console.aws.amazon.com/
2. Sign in with your AWS credentials
3. Make sure you're in the eu-central-1 region (Frankfurt)

## Step 2: Navigate to API Gateway

1. In the search bar at the top, type "API Gateway" and select it from the results
2. Click on the API with ID `m97gq044y3` from the list of APIs

## Step 3: Enable CORS for the /notifications Resource

1. In the left sidebar, click on "Resources"
2. In the resources tree, find and select the `/notifications` resource
3. Click on the "Actions" dropdown button
4. Select "Enable CORS" from the dropdown menu
5. In the "Enable CORS" form:
   - For "Access-Control-Allow-Origin" field, enter: `http://localhost:8081`
   - Leave the other fields with their default values
   - Check all the methods that should support CORS (GET, POST, PUT, OPTIONS, etc.)
6. Click the "Enable CORS and replace existing CORS headers" button
7. In the confirmation dialog, click "Yes, replace existing values"

## Step 4: Deploy the API to Apply Changes

1. Click on the "Actions" dropdown button again
2. Select "Deploy API" from the dropdown menu
3. In the "Deploy API" dialog:
   - For "Deployment stage", select "prod" from the dropdown
   - For "Deployment description", enter "CORS enabled for localhost"
4. Click the "Deploy" button

## Step 5: Verify CORS Configuration

1. In the left sidebar, click on "Stages"
2. Select the "prod" stage
3. Copy the "Invoke URL" displayed at the top of the stage details
4. Add `/notifications` to the end of the URL
5. This is the URL your frontend should be able to access now: 
   `https://m97gq044y3.execute-api.eu-central-1.amazonaws.com/prod/notifications`

## Troubleshooting CORS Issues

If you still encounter CORS issues after following these steps:

1. **Check Response Headers**: Use browser dev tools to examine the response headers. Make sure the API responses include:
   - `Access-Control-Allow-Origin: http://localhost:8081`
   - `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`

2. **Clear Browser Cache**: Try clearing your browser cache and reloading the page.

3. **Frontend Configuration**: Make sure your frontend service is properly configured:
   ```javascript
   // In your NotificationService.js constructor
   super(baseUrl, {
     withCredentials: false // Set to false for cross-origin requests
   });
   ```

4. **Test with a Simple CURL Command**:
   ```
   curl -i -X OPTIONS https://m97gq044y3.execute-api.eu-central-1.amazonaws.com/prod/notifications -H "Origin: http://localhost:8081"
   ```
   You should see the CORS headers in the response. 