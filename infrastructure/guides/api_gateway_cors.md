# API Gateway CORS Configuration Guide

This guide explains how to enable Cross-Origin Resource Sharing (CORS) on your AWS API Gateway to allow requests from development environments like localhost.

## Why CORS is Needed

CORS is a security mechanism implemented by browsers that restricts web applications from making requests to a different domain than the one that served the web application. When developing locally, your frontend runs on a domain like `http://localhost:8081`, but API Gateway has a different domain (`https://m97gq044y3.execute-api.eu-central-1.amazonaws.com`).

Without proper CORS configuration, browsers will block requests from your local development environment to the API Gateway.

## How to Enable CORS on API Gateway

There are two main approaches to enabling CORS:

### Option 1: Using AWS Console

1. Log in to the AWS Console
2. Navigate to API Gateway
3. Select your API
4. Select "Resources" from the left panel
5. Select a resource (e.g., `/notifications`)
6. Click "Actions" → "Enable CORS"
7. Enter the allowed origins (e.g., `http://localhost:8081`)
8. Click "Enable CORS and replace existing CORS headers"
9. Click "Yes, replace existing values"
10. Deploy the API by clicking "Actions" → "Deploy API"

### Option 2: Using the Provided Scripts

We've created scripts that automate the CORS configuration process:

#### For Linux/Mac:

```bash
cd infrastructure/scripts
chmod +x update_api_cors.sh
./update_api_cors.sh m97gq044y3
```

#### For Windows:

```cmd
cd infrastructure\scripts
update_api_cors.bat m97gq044y3
```

These scripts will:

1. Add OPTIONS methods to all resources
2. Configure response headers to allow requests from localhost
3. Redeploy the API to apply the changes

## Verifying CORS Configuration

After enabling CORS, you can verify the configuration by:

1. Opening your browser's developer tools
2. Making a request to the API from your local development environment
3. Checking that the response includes the following headers:
   - `Access-Control-Allow-Origin: http://localhost:8081`
   - `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`

## Troubleshooting CORS Issues

If you continue to experience CORS issues:

1. **Check Response Headers**: Make sure the API responses include the necessary CORS headers.
2. **Preflight Requests**: Ensure OPTIONS methods are handled correctly for preflight requests.
3. **API Deployment**: Ensure you've redeployed the API after making CORS changes.
4. **Browser Cache**: Clear your browser cache and try again.
5. **Frontend Configuration**: Ensure your frontend is not sending credentials for cross-origin requests when using `fetch` or `axios`.

## Frontend Code Considerations

When making requests from your frontend, ensure your code handles CORS correctly:

```javascript
// Using fetch with no credentials for development
fetch('https://api.example.com/data', {
  credentials: 'omit', // Don't send cookies for cross-origin requests
  headers: {
    'Content-Type': 'application/json'
  }
})
```

In our project, the `ApiService` is configured to automatically adjust CORS settings based on the environment:

```javascript
// In ApiService constructor
this.withCredentials = typeof config.withCredentials !== 'undefined' ? 
  config.withCredentials : !this.isDev;
```

## Important Security Considerations

1. **Production Security**: For production, specify exact allowed origins rather than using wildcards.
2. **Authorization**: CORS doesn't replace proper authorization. Always implement proper authentication and authorization.
3. **Exposed Resources**: Be aware that enabling CORS makes your API accessible from specified domains.

## Reference Documentation

- [AWS API Gateway CORS Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 