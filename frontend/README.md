# echoCorner Frontend

A React Native Web application built with Expo.

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd echoCorner/frontend

# Install dependencies
npm install

# Start the web version
npm run web
```

## Folder Structure

```
frontend/
├── assets/          # Contains static assets like images and the style guide
├── src/             # Source code
│   ├── screens/     # Screen components
│   │   ├── HomeScreen.js  # Main "Hello World" screen
│   │   └── LoginScreen.js # Authentication screen
│   └── config/      # Configuration files
│       └── auth.js  # AWS Amplify/Cognito configuration
├── tests/           # Playwright E2E tests
│   ├── home.spec.ts        # Home screen tests
│   ├── login.spec.ts       # Login screen tests
│   ├── runtime-errors.spec.ts # Tests for detecting runtime errors
│   └── auth-config.spec.ts    # Tests for AWS Amplify configuration
├── app.json         # Expo configuration
├── App.js           # Main application component with navigation setup
├── package.json     # Dependencies and scripts
└── playwright.config.ts # Playwright configuration
```

## Features

- React Native Web support for cross-platform development
- React Navigation for screen navigation
- AWS Cognito authentication with AWS Amplify
- Follows the echoCorner styleguide for consistent UI
- E2E testing with Playwright

## Authentication

The application uses Amazon Cognito for user authentication. Authentication configuration is stored in:
- `src/config/auth.js`

This configuration file reads Cognito settings from `/infrastructure/outputs/cognito.json` and initializes AWS Amplify.

### Login Screen

The login screen (`src/screens/LoginScreen.js`) provides:
- Email and password input fields
- Form validation
- Error feedback for authentication issues
- Loading indicators

### Test Credentials

For testing purposes, use the credentials located in:
- `/infrastructure/outputs/test-credentials.secret.json`

## Development

To run the development server:

```bash
# For web
npm run web

# For iOS (requires macOS)
npm run ios

# For Android
npm run android
```

## Testing

The application uses Playwright for end-to-end testing of the web version.

### Running Tests

1. Start the development server in one terminal:
   ```bash
   cd frontend
   npm run web
   ```

2. Run the tests in another terminal:
   ```bash
   cd frontend
   npm test
   ```

### Test Structure

```
tests/
├── home.spec.ts     # Tests for the Home screen
│                    # - Verifies the app loads correctly
│                    # - Validates "Hello World" is displayed
├── login.spec.ts    # Tests for the Login screen
│                    # - Verifies login form renders properly
│                    # - Tests form validation
│                    # - Validates input fields work correctly
├── runtime-errors.spec.ts # Tests for detecting runtime errors
│                    # - Captures JavaScript exceptions
│                    # - Monitors console errors
│                    # - Specifically checks for Amplify/loginWith errors
└── auth-config.spec.ts # Tests for AWS Amplify configuration
                     # - Specifically monitors auth configuration
                     # - Detects the "loginWith undefined" error
                     # - Validates Amplify initialization
```

### Runtime Error Detection

The application includes specialized tests to detect runtime errors in the JavaScript code:

- **Runtime Error Test**: Monitors for any uncaught exceptions or errors in the console
- **AWS Amplify Error Detection**: Specifically watches for errors related to AWS Amplify initialization
- **TypeError Detection**: Catches "Cannot read properties of undefined" type errors

This ensures that critical runtime errors (like the AWS Amplify `loginWith` undefined error) are caught early in the development process.

### AWS Amplify Configuration Testing

A dedicated test for AWS Amplify configuration validates that:

- The authentication module initializes correctly
- No "loginWith undefined" errors occur during startup
- AWS Cognito integration is properly configured

This test should be run after any changes to the authentication configuration to prevent regression issues.

### Test Results

When tests are run successfully, you should see output similar to:

```
Running 2 tests using 1 worker
  ✓ loads the application page
  ✓ displays Hello World on homepage
  2 passed
```

## Created By

Tomasz Kopacki (tomasz@kopacki.eu)