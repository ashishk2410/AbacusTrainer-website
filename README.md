# Abacus Trainer Website

Next.js website for Abacus Trainer with Centre & Teacher Management features.

## Features

- **Public Website**: Marketing site with features, pricing, and FAQ
- **Centre Dashboard**: Manage teachers, send invites, view students
- **Teacher Dashboard**: View assigned students, accept/decline invites
- **Student Details**: Analytics, performance trends, and improvement plans

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Existing CSS
- **Database**: Firebase Firestore (existing project)
- **Authentication**: Firebase Auth

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local` file (already created with values):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA-68vf1Ot5lZ33_7sxGAOlHQAbtv9mBNM
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=myabacustrainer-51e6a
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myabacustrainer-51e6a.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myabacustrainer-51e6a.firebasestorage.app
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── centre/dashboard/  # Centre dashboard
│   ├── teacher/dashboard/ # Teacher dashboard
│   └── student/[id]/      # Student details
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── LoginPage.tsx
│   ├── CentreDashboard.tsx
│   ├── TeacherDashboard.tsx
│   └── StudentDetails.tsx
├── lib/                   # Utilities
│   ├── firebase.ts        # Firebase config
│   ├── firestore.ts      # Firestore helpers
│   └── types.ts          # TypeScript types
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication context
└── public/               # Static assets
    └── images/          # Images
```

## Firebase Integration

This website connects to the **existing Firebase project** used by the Android app:
- **Project ID**: `myabacustrainer-51e6a`
- **Collections Used**:
  - `users` - User data (email as document ID)
  - `sessions` - Student practice sessions
  - `teacher_invites` - Teacher invitation system
  - `student_plans` - Student improvement plans

**Important**: This website only **reads/writes data** to the existing Firebase project. It does NOT modify the Android app's Firebase configuration.

## Data Structure

All data structures match the Android app's Firestore schema:
- Users use **email addresses** as document IDs (not Firebase UIDs)
- Student-teacher relationships use `teacher_email` field
- All joins and queries use email addresses

## Deployment

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Add all `NEXT_PUBLIC_*` variables in Netlify dashboard

### Vercel

1. Connect your GitHub repository
2. Vercel will auto-detect Next.js
3. Add environment variables in project settings

## Authentication

- **Login**: Email/password via Firebase Auth
- **Roles**: `centre` and `teacher` roles can access dashboards
- **Protected Routes**: Automatically redirect to login if not authenticated

## Key Features

### Centre Dashboard
- Send teacher invites (48-hour expiry)
- View all teachers
- View students by teacher
- Manage student assignments

### Teacher Dashboard
- View pending invites (accept/decline)
- View assigned students
- Navigate to student details

### Student Details
- Performance metrics (accuracy, efficiency, streak)
- Performance trends chart (last 30 days)
- Improvement plan with tasks
- Task management (create, update, track progress)

## Notes

- The existing `style.css` is imported in `globals.css` to preserve the original design
- Static HTML pages (faq.html, privacy-policy.html, terms.html) are preserved in the `public` folder
- The website is fully responsive and works on mobile, tablet, and desktop

## Development

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (recommended)

## Support

For issues or questions, contact: myabacustrainer@gmail.com
