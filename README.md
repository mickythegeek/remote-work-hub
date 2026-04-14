# Remote Work Hub

**Version:** 1.0 (MVP)

## Product Overview
Remote Work Hub is a web application that enables job seekers to discover remote job opportunities, bookmark positions of interest, and track the progress of their job applications through a structured kanban-style pipeline.

It serves as the single hub where remote job seekers discover, save, and manage every step of their job search journey, utilizing the Remotive API to supply live remote job listings.

## Features
- **User Authentication:** Secure registration and login leveraging JWT and bcrypt.
- **Job Listings:** Browse active remote jobs, search by keywords, and filter by categories securely connected to the Remotive API feed.
- **Bookmark / Save Jobs:** Shortlist jobs directly from listings to review later and manage them on a Saved Jobs page.
- **Application Tracker:** Kanban-style pipeline to monitor status updates (Applied -> Interview -> Offer -> Rejected). Includes custom user notes and auto-stamped application dates.
- **Dashboard & Analytics:** Personalized view of the user's job search health, featuring total applications grouped by stage, a weekly timeline chart, and a recent activity feed.

## Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Routing:** React Router v6
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Charts:** Recharts

### Backend & Database
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Data Source:** Remotive API

### Infrastructure
- **Frontend Deployment:** Vercel
- **Backend & DB Deployment:** Render

## Project Structure
```text
remote-work-hub/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── api/            # API instance and endpoint helpers 
│   │   ├── components/     # UI Components (JobCard, BookmarkButton, etc.)
│   │   ├── hooks/          # React hooks for API management
│   │   ├── pages/          # Application views/pages
│   │   └── store/          # Zustand state management
│   └── vite.config.js
└── server/                 # Node.js backend application
    ├── prisma/             # Schema configuration
    └── src/
        ├── controllers/    # Request handlers
        ├── middleware/     # Auth and error middlewares
        ├── routes/         # Express endpoint definitions
        └── services/       # External service utilities (e.g. Remotive API proxy)
```

## Security & Non-Functional Requirements
- **Performance:** Designed to load pages within 2 seconds.
- **Responsiveness:** Mobile-first responsive design supporting minimum breakpoints down to 375px. 
- **Accessibility:** Targeted to meet WCAG 2.1 AA for color contrast and keyboard navigation.
- **Security:** Built with HTTPs enforcement, environment-managed secrets, CORS restrictions, secure JWT handlings, query input validation, and endpoint rate limiting.
