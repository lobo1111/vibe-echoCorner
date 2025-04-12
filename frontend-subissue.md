## Frontend Agent — Fix Header Position and Add Missing Elements

You are tasked with implementing a fix for the header component in the app.

### Current Issues
1. The header component is positioned at the bottom of the page instead of the top
2. The header is missing the software title "echoCorner"
3. The header is missing a welcome message for users

### Implementation Requirements
- Affects: `frontend/frontend/App.js` and `frontend/frontend/src/components/Header.js`
- Must follow: styling guidelines in styleguide.md (use existing color schemes)
- Use the existing Header component rather than just the ProfileIcon

### Steps to Complete
1. Update App.js to properly import and use the Header component at the top of the page
2. Ensure the Header component is positioned correctly on all screens (when authenticated)
3. Update the Header component to include:
   - Software title "echoCorner" (already present)
   - Add a welcome message (e.g., "Welcome to echoCorner!")
4. Ensure responsive layout works across web and mobile views

### Deliverables
- Updated App.js file with correct header positioning
- Enhanced Header.js component with all required elements
- Consistent styling matching the application's design system 