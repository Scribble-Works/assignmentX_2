# User Onboarding Guide System - Documentation

## Overview

This onboarding system provides first-time users with a comprehensive, interactive tour of the AssignmentX platform. It helps new users understand the app's features, navigation, and functionality through a multi-step guided experience.

## Components Created

### 1. **useOnboardingGuide.js** (Composable)

**Location:** `/composables/useOnboardingGuide.js`

A Vue composable that manages the onboarding guide state using localStorage to track whether a user has completed or skipped the tour.

**Key Features:**

- Tracks if user has seen the guide
- Manages current step in the tour
- Persists state in localStorage
- Provides methods to start, skip, complete, and reset the guide

**Methods:**

- `checkGuideStatus()` - Checks if user has completed the guide
- `startGuide()` - Initiates the guide
- `nextStep()` / `previousStep()` - Navigate through steps
- `skipGuide()` - Skip the tour
- `completeGuide()` - Mark tour as completed
- `resetGuide()` - Reset for testing or replay

### 2. **onboardingGuide.vue** (Main Tour Component)

**Location:** `/components/onboardingGuide.vue`

An interactive, multi-step modal dialog that walks users through platform features.

**Steps Included:**

1. **Welcome** - Introduction to the tour
2. **Learning Modules** - Explains workbooks, strands, and substrands
3. **Interactive Features** - Showcases quizzes, flip cards, videos, and concept notes
4. **Progress & Bookmarks** - How to track progress and save content
5. **Facilitator Resources** - Resources for educators and parents
6. **Navigation Tips** - How to use menus, search, and breadcrumbs
7. **Get Started** - Final step with next actions

**Features:**

- Progress indicator with visual step markers
- Navigation buttons (Previous/Next/Skip)
- Responsive design for mobile and desktop
- Rich content with icons, images, and cards
- Can be replayed anytime

### 3. **welcomeModal.vue** (Initial Prompt)

**Location:** `/components/welcomeModal.vue`

A friendly welcome dialog that appears after signup, asking users if they want to take the tour.

**Features:**

- Clear value proposition for taking the tour
- Time estimate (2 minutes)
- Option to start tour or skip
- Reminder that tour can be accessed later

## Integration Points

### 1. **Completed Page** (After Onboarding Flow)

**Location:** `/pages/completed.vue`

**Changes:**

- Added welcome modal trigger for first-time users
- Shows after user completes role/accessibility questions
- Automatically displays guide option with slight delay
- Seamless transition from onboarding to learning modules

### 2. **Learning Modules Page**

**Location:** `/pages/learning-modules/index.vue`

**Changes:**

- Auto-triggers welcome modal for first-time users
- Added "Need Help? Take the Tour" button for repeat access
- Button positioned at top-right for easy visibility
- Works for users who navigate directly to learning modules

### 3. **Edit Profile Page**

**Location:** `/pages/edit-profile.vue`

**Changes:**

- Added help section with "Start Tour" button
- Prominent blue banner explaining the feature
- Allows users to replay the guide anytime
- Positioned at top of profile page for visibility

### 4. **Complete Signup Page**

**Location:** `/pages/complete-signup.vue`

**Changes:**

- Added informational message about the tour
- Sets expectations for post-login experience

## User Flow

### For New Users:

1. User creates account → sees "Signup Complete" page
2. User confirms email → logs in
3. User goes through onboarding (role, accessibility, location)
4. User reaches "Completed" page → **Welcome Modal appears**
5. User chooses to:
   - **Start Tour**: Opens interactive guide
   - **Skip**: Can access tour later from learning modules or profile

### For Returning Users:

1. "Need Help? Take the Tour" button on Learning Modules page
2. "Start Tour" button in Edit Profile page
3. Manual trigger available anytime

## Technical Details

### State Management

- **localStorage keys:**
  - `onboarding_guide_completed`: Set to 'true' when tour is completed
  - `onboarding_guide_skipped`: Set to 'true' when tour is skipped
- **Reactive state:**
  - `isGuideActive`: Boolean for showing/hiding guide
  - `currentStep`: Number tracking current step (0-6)
  - `hasCompletedGuide`: Boolean computed from localStorage

### Styling

- Uses Vuetify components (v-dialog, v-card, v-btn, etc.)
- Tailwind CSS for layout and spacing
- Responsive design with breakpoints
- Color scheme matches AssignmentX branding (green primary)

### Dependencies

- Vue 3 Composition API
- Vuetify 3
- Tailwind CSS
- Nuxt 3

## Customization

### Adding New Steps

To add a new step to the tour:

1. Update `totalSteps` in `onboardingGuide.vue`
2. Add a new `v-if="step === X"` section in the content area
3. Update step counter display
4. Add appropriate content, icons, and images

### Modifying Content

Each step is self-contained in a `v-if` block. Edit the HTML content, images, and text as needed.

### Changing Trigger Conditions

Modify `checkGuideStatus()` in the composable to change when the guide appears (e.g., based on user role, page visits, etc.)

## Testing

### To Test the Guide:

1. Clear localStorage in browser dev tools
2. Navigate to `/learning-modules/` or `/completed`
3. Welcome modal should appear
4. Complete or skip the tour
5. Verify localStorage keys are set

### To Reset for Testing:

```javascript
// In browser console:
localStorage.removeItem("onboarding_guide_completed");
localStorage.removeItem("onboarding_guide_skipped");
```

Or use the `resetGuide()` method from the composable.

## Future Enhancements

Potential improvements:

1. **Analytics Integration**: Track which steps users view/skip
2. **Contextual Tips**: Show tooltips on actual page elements
3. **Video Walkthrough**: Add embedded video tutorials
4. **Personalized Paths**: Different tours for students vs. educators
5. **Progress Persistence**: Track partially completed tours
6. **Interactive Hotspots**: Highlight actual UI elements during tour
7. **Multi-language Support**: Translate tour content
8. **Gamification**: Add badges/rewards for completing tour

## Maintenance Notes

- Images used in tour should exist in `/public/img/` directory
- Update tour content when new features are added to platform
- Test tour on mobile devices after any UI changes
- Keep tour concise (currently ~2 minutes)
- Review localStorage usage for GDPR compliance

## Support

For questions or issues with the onboarding system:

1. Check browser console for errors
2. Verify all component imports are correct
3. Ensure Vuetify is properly configured
4. Test localStorage availability (private browsing may block)

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Maintainer:** AssignmentX Development Team
