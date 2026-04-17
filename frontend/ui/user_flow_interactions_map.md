# Remote Work Hub - User Flow & Interactions

This document outlines the primary user journeys and the functional connections between the screens in our current design.

## Core User Flows

### 1. Discovery to Details
*   **Entry Point:** User arrives at the **Job Board** ({{DATA:SCREEN:SCREEN_15}}).
*   **Action:** User browses listings or uses the search/filter functionality.
*   **Transition:** Clicking "View Details" on a job card navigates the user to the **Job Details** screen ({{DATA:SCREEN:SCREEN_5}}).

### 2. Saving Opportunities
*   **Action:** From the **Job Board** or **Job Details**, the user clicks "Save Job".
*   **Transition:** The job is added to the **Saved Jobs** collection ({{DATA:SCREEN:SCREEN_6}}).
*   **Interaction:** The user can navigate to "Saved" via the Top Navigation Bar.

### 3. Application & Tracking
*   **Entry Point:** **Job Details** ({{DATA:SCREEN:SCREEN_5}}).
*   **Action:** User clicks "Apply Now".
*   **Transition:** After a successful application (simulated), the user is prompted or automatically navigated to the **Application Pipeline** ({{DATA:SCREEN:SCREEN_2}}).
*   **Management:** In the Pipeline, users can move cards between stages (Applied, Interview, Offer, Rejected).

### 4. Authentication Loop
*   **Scenario:** A guest user tries to "Save" or "Apply".
*   **Transition:** User is redirected to the **Authentication** screen ({{DATA:SCREEN:SCREEN_13}}).
*   **Recovery:** Once logged in, the user returns to their previous context (Job Board or Details).

## Shared Navigation (TopNavBar)
All screens (except Auth) utilize a consistent Top Navigation Bar:
*   **Jobs:** Links back to the **Job Board**.
*   **Saved:** Links to the **Saved Jobs** view.
*   **Tracker:** Links to the **Application Pipeline**.
*   **Profile/Account:** Accessible via the trailing icon actions.

## Interaction Principles
*   **Visual Feedback:** All buttons and interactive cards should have clear hover and active states.
*   **Seamless Transitions:** Navigation between views should feel instant, maintaining the professional "Curated Authority" aesthetic.
*   **State Persistence:** Actions like saving a job should reflect immediately across the interface (e.g., the "Saved" count in the header).