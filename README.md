# PeerNode

A student collaboration platform designed for the GDGOC MCKVIE TechSprint.

## Features

- **Onboarding**: Clean login screen with Google Sign In
- **Academic Profile**: Form for students to enter their major, subjects, and learning style
- **Smart Matching**: Dashboard showing active study pods based on academic profiles
- **AI Search**: Upload syllabus PDFs and use Gemini AI to find matching study partners

## Tech Stack

- React with TypeScript
- Firebase (Authentication and Data Storage)
- Gemini API (AI Matching)
- Tailwind CSS (Styling)
- shadcn/ui (UI Components)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components for each route
├── lib/           # Utility functions
├── hooks/         # Custom React hooks
└── App.tsx        # Main application component with routing
```

## Screens

1. **Onboarding** (`/onboarding`) - Google Sign In
2. **Academic Profile** (`/academic-profile`) - Profile setup form
3. **Smart Matching** (`/smart-matching`) - Study pod dashboard
4. **AI Search** (`/ai-search`) - Syllabus upload and AI analysis

## Color Palette

- Primary: Light Blue (#ADD8E6)
- Secondary: White (#FFFFFF)
- Background: Light Blue Gradient
- Text: Dark Gray (#333333)

## MVP Goals

- Students can create profiles with academic information
- Students can find study partners within 3 clicks
- AI-powered matching based on syllabus content
- Mobile-responsive design for on-the-go studying