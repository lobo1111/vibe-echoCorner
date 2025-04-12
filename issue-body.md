## Issue Description

The application header is currently rendered at the bottom of the page instead of the top.

Additionally, the header is missing key elements:
- Software title ('echoCorner')
- Welcome message

## Expected Behavior
- Header should be at the top of the page
- Header should display the software title
- Header should include a welcome message

## Current Implementation Issues
- Header component exists but is not properly used in App.js
- Only ProfileIcon is being rendered directly
- Header positioning needs to be fixed 