# Web Hosting Infrastructure Documentation

This document provides an overview of the web hosting infrastructure set up for the Echo Corner application.

## Architecture Overview

The web application is hosted using the following AWS resources:

1. **S3 Bucket**: For storing the static web content (HTML, CSS, JavaScript, images, etc.)
2. **CloudFront**: CDN service that securely delivers the content with low latency and high transfer speeds
3. **IAM**: Deployment user and policies for secure content management

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │
│   User    │────▶│CloudFront │────▶│  S3 Bucket│
│           │     │           │     │           │
└───────────┘     └───────────┘     └───────────┘
```

## Components

### S3 Bucket

- Configured for static website hosting
- Accessible only via CloudFront (not directly)
- CORS enabled to allow requests from any origin
- Configured with index.html as the default document and error.html for error handling

### CloudFront Distribution

- Uses the S3 bucket as origin
- Employs Origin Access Identity to secure the S3 bucket
- HTTP/2 and IPv6 enabled
- Redirects HTTP to HTTPS
- Optimized caching configuration:
  - Default TTL: 1 day (86400 seconds)
  - Maximum TTL: 1 year (31536000 seconds)
- Custom error responses to enable SPA routing (returns index.html for 403/404 errors)

### IAM Configuration

- Dedicated deployment user with restricted permissions
- Access key for CI/CD deployment process
- Policy allowing:
  - S3 bucket content management
  - CloudFront invalidation creation

## Deployment

### Deploying the Infrastructure

Deploy the infrastructure using the AWS CloudFormation template:

```bash
aws cloudformation create-stack \
  --stack-name echoCorner-WebHosting \
  --template-body file://infrastructure/templates/web_hosting.yaml \
  --capabilities CAPABILITY_NAMED_IAM
```

### Getting Deployment Information

To retrieve the deployment information:

```bash
aws cloudformation describe-stacks \
  --stack-name echoCorner-WebHosting \
  --query "Stacks[0].Outputs"
```

## Deployment Process (for Frontend Team)

1. Build your static assets
2. Upload the built assets to the S3 bucket:
   ```bash
   aws s3 sync ./build/ s3://BUCKET_NAME/ --delete
   ```
3. Create CloudFront invalidation to clear the cache:
   ```bash
   aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
   ```

## Security Considerations

- Direct access to the S3 bucket is blocked - all content is served via CloudFront
- HTTPS is enforced for all requests
- Deployment credentials should be stored securely and not committed to version control
- Access permissions follow the principle of least privilege 