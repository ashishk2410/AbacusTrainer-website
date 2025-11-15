# Centre & Teacher Management Web App - Complete Implementation Plan

## Repository Information
- **Web App Path**: `/Users/ashishdubey/Abacus/AbacusTrainer-website`
- **Android App Path**: `/Users/ashishdubey/Abacus/AbacusTrainer` (DO NOT MODIFY)
- **Firebase Project**: `myabacustrainer-51e6a`
- **Project Number**: `212406982856`
- **Browser API Key**: `AIzaSyA-68vf1Ot5lZ33_7sxGAOlHQAbtv9mBNM`
- **Android API Key**: `AIzaSyA6NaiPtlFKpfuvE_E_KPKJlpQIBFumEkc` (for reference only)

## Technology Stack Recommendation

### Recommended: **Next.js 14+ with TypeScript**

**Why Next.js:**
- ✅ Built on React.js (you get React + more)
- ✅ Built-in routing (no need for React Router)
- ✅ Server-side rendering (better performance)
- ✅ Easy deployment (Vercel, Firebase Hosting)
- ✅ Responsive design support (CSS Modules, Tailwind)
- ✅ TypeScript support out of the box
- ✅ API routes (if needed for backend)
- ✅ Optimized for production
- ✅ Great Firebase integration

**Recommended Stack:**
- **Framework**: Next.js 14+ (App Router)
- **UI Framework**: Tailwind CSS (for responsive design)
- **Component Library**: shadcn/ui or Material-UI (responsive components)
- **State Management**: React Context + Firebase real-time listeners
- **Forms**: React Hook Form
- **Charts**: Recharts or Chart.js (responsive charts)

### Responsive Design Strategy

**Breakpoints (Tailwind CSS):**
- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md, lg)
- **Desktop**: `> 1024px` (xl, 2xl)

**Responsive Components:**
- **Dashboard**: Grid layout (1 col mobile, 2-3 cols tablet, 4 cols desktop)
- **Student List**: Cards (1 col mobile, 2 cols tablet, 3 cols desktop)
- **Charts**: Responsive containers with mobile-friendly tooltips
- **Forms**: Full width on mobile, centered on desktop
- **Tables**: Horizontal scroll on mobile, full table on desktop

## Complete User Flow

### 1. Login Page (`/login`)
**Two Login Options:**
- **Centre Login**: Centre head/admin authentication (role: "centre")
- **Teacher Login**: Teacher email/password authentication (role: "teacher")

**Implementation:**
- Single login form with role selector
- Authenticate with Firebase Auth
- Check user role from Firestore `users/{email}` document
- Redirect based on role:
  - Centre → `/centre/dashboard`
  - Teacher → `/teacher/dashboard`

### 2. Centre Dashboard (`/centre/dashboard`)

**Features:**

#### 2.1 Add Teacher
- Input field for teacher email
- On submit:
  - Create invite record in `teacher_invites` collection
  - Generate unique token
  - Set expiry: 48 hours from creation
  - Send email with acceptance link
  - Show success message

#### 2.2 Teacher List View
- Query all users where `role == "teacher"`
- Display:
  - Teacher name
  - Teacher email
  - Number of students (count where `teacher_email == teacher.email`)
  - Acceptance status (from `teacher_invites`)
  - Last active date (from `lastUpdated` field)
- Click teacher → Show their students

#### 2.3 Student View (by Teacher)
- Click teacher → Display their students
- **Quick Summary Chart** (default view):
  - High-level performance metrics
  - Student count per teacher
  - Average accuracy across all students
  - Average efficiency
  - Performance trend chart
- **Full Details View** (toggle button):
  - Switch to detailed view (same as teacher view)
  - See individual student details

#### 2.4 Student Management
- **Move Students**:
  - Select student(s)
  - Choose target teacher (or Centre head)
  - Update `teacher_email` and `teacher_id` in student document
  - Update `teacher_id` in all student sessions
- **Assign to Centre Head**:
  - Centre head can assign themselves as teacher
  - Update student `teacher_email` to centre email

#### 2.5 Invite Management
- View all pending invites
- **Revoke Invite** (within 48 hours):
  - Update invite status to "revoked"
  - Set `revokedAt` timestamp
  - Send notification email to teacher

### 3. Teacher Dashboard (`/teacher/dashboard`)

**Features:**

#### 3.1 Student List
- Query students where `teacher_email == authenticated_teacher_email`
- Display:
  - Student name
  - Student email
  - Assigned level
  - AI suggested level
  - Student status
  - Subscription expiry
  - Total sessions
  - Last session date
  - Quick performance indicator
- Click student → Student Details Page

#### 3.2 Notifications
- **Invite Notifications**:
  - Query `teacher_invites` where:
    - `teacherEmail == authenticated_email`
    - `status == "pending"`
    - `expiresAt > now()`
  - Display as notification badge
  - Show "Accept" and "Decline" buttons
  - Auto-hide after 48 hours
  - Allow changing decision within 48 hours

### 4. Student Details Page (`/student/:studentId`)

**Sections:**

#### 4.1 Stats Overview
- **Metrics:**
  - Accuracy (0-100%)
  - Efficiency (prompts per minute)
  - Streak (current streak count)
  - Total Sessions
  - Average Score
  - Last Active Date
- **Performance Trends Chart:**
  - Accuracy trend (last 30 days)
  - Speed trend
  - Overall progress indicator

#### 4.2 Strengths
- List of student strengths (from `StudentAnalytics.strengths`)
- Core concept strengths
- Cognitive strengths
- Display as cards with icons

#### 4.3 Weaknesses
- List of identified weaknesses (from `StudentAnalytics.weaknesses`)
- Areas needing improvement
- Display with priority indicators

#### 4.4 Areas of Improvement (with Priority)
- **HIGH Priority** items (red/orange)
- **MEDIUM Priority** items (yellow)
- **LOW Priority** items (blue)
- Each item shows:
  - Title
  - Description
  - Priority badge
  - Action steps

#### 4.5 Targetable & Achievable Plan (Task Form)
**Task Fields:**
- Task ID (auto-generated)
- Title/Description
- Priority: HIGH / MEDIUM / LOW
- Target Date (date picker)
- Achievable Date (date picker)
- Status: Not Started / In Progress / Completed / Cancelled / Closed
- % Completion (0-100, slider or input)
- Remarks/Notes (textarea)
- Created By (teacher email)
- Created At (timestamp)
- Updated At (timestamp)

**Actions:**
- **Add Task**: Create new task in `student_plans` collection
- **Edit Task**: Update existing task
- **Mark % Completed**: Update completion percentage
- **Cancel Task**: Set status to "cancelled", require remarks
- **Close Task**: Set status to "closed", require remarks

**Display:**
- Task list with cards
- Progress bars for each task
- Status badges
- Date indicators
- Filter by status
- Sort by priority or date

## Data Structures

### Firestore Collections

#### 1. Users Collection (`users/{userId}`)
```typescript
{
  user_id: string  // Email address (document ID)
  role: "teacher" | "student" | "individual" | "centre"
  name: string
  email: string
  teacher_id?: string  // For students: teacher's Firebase UID
  teacher_email?: string  // For students: teacher's email
  teacher_assigned_level?: number  // 1-10 scale
  ai_suggested_level?: number
  student_status?: "active" | "inactive" | "suspended"
  subscription_expiry?: string  // ISO date format
  plan_name: "trial" | "premium" | "teacher"
  plan_status: "active" | "expired" | "cancelled"
  firebaseUid: string
  createdAt: Timestamp
  lastUpdated: Timestamp
}
```

#### 2. Sessions Collection (`sessions/{sessionId}`)
```typescript
{
  session_id: string
  user_id: string  // Student email
  date: string  // ISO date format
  accuracy: number  // 0-100
  speed: number
  efficiency: number  // prompts per minute
  questions_attempted: number
  streak: number
  teacher_id?: string
  username: string
  configuration: object
  questions: array
  completed: boolean
  score: number
  correctAnswers: number
  totalTimeSpent: number
  syncedAt: Timestamp
}
```

#### 3. Teacher Invites Collection (`teacher_invites/{inviteId}`)
```typescript
{
  inviteId: string
  teacherEmail: string
  centreId: string  // Centre's Firebase UID
  centreEmail: string
  status: "pending" | "accepted" | "declined" | "revoked" | "expired"
  token: string  // Unique acceptance token
  createdAt: Timestamp
  expiresAt: Timestamp  // createdAt + 48 hours
  acceptedAt?: Timestamp
  declinedAt?: Timestamp
  revokedAt?: Timestamp
  emailSent: boolean
  emailSentAt?: Timestamp
}
```

#### 4. Student Plans Collection (`student_plans/{planId}`)
```typescript
{
  planId: string
  studentId: string  // Student email
  teacherId: string  // Teacher email
  tasks: Task[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

Task {
  taskId: string
  title: string
  description: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  targetDate: string  // ISO date
  achievableDate: string  // ISO date
  status: "not_started" | "in_progress" | "completed" | "cancelled" | "closed"
  completionPercent: number  // 0-100
  remarks?: string
  createdBy: string  // Teacher email
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Calculated Student Analytics

**From Sessions Data:**
```typescript
StudentAnalytics {
  strengths: string[]
  weaknesses: string[]
  improvementAreas: ImprovementArea[]
  improvementPlan: ImprovementPlan
  performanceTrends: {
    accuracyTrend: DataPoint[]  // Last 30 days
    speedTrend: DataPoint[]
    overallProgress: number  // -100 to 100
  }
  cognitiveMetrics: {
    concentration: number  // 0-1
    memory: number
    visualization: number
    reactionTime: number
    mathAccuracy: number
    overallScore: number
  }
}

ImprovementArea {
  title: string
  description: string
  priority: "HIGH" | "MEDIUM" | "LOW"
}
```

## Firestore Security Rules Updates

**Add to `firestore.rules` in Android repo (`/Users/ashishdubey/Abacus/AbacusTrainer/firestore.rules`):**

```javascript
// Centre access
match /users/{userId} {
  // Allow centre to read all teachers and students
  allow read: if request.auth != null && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'centre';
  
  // Allow centre to update student teacher assignments
  allow update: if request.auth != null && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'centre' &&
    request.writeFields.hasOnly(['teacher_id', 'teacher_email']);
}

// Teacher invites
match /teacher_invites/{inviteId} {
  // Centre can create invites
  allow create: if request.auth != null && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'centre';
  
  // Centre can revoke within 48 hours
  allow update: if request.auth != null && 
    (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'centre') ||
    (resource.data.teacherEmail == request.auth.token.email);
  
  // Teacher can read their invites
  allow read: if request.auth != null && 
    resource.data.teacherEmail == request.auth.token.email;
}

// Student plans
match /student_plans/{planId} {
  // Teacher can read/write plans for their students
  allow read, write: if request.auth != null && 
    resource.data.teacherId == request.auth.token.email;
  
  // Centre can read all plans
  allow read: if request.auth != null && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'centre';
}
```

## Implementation Steps

### Phase 1: Setup (2-3 hours)
1. Create directory: `/Users/ashishdubey/Abacus/AbacusTrainer-website`
2. Initialize Next.js 14+ project with TypeScript and App Router
3. Install dependencies:
   - Firebase SDK (`firebase`)
   - Tailwind CSS (for responsive design)
   - shadcn/ui or Material-UI (responsive components)
   - React Hook Form (for forms)
   - Recharts (for responsive charts)
4. Configure Firebase with browser API key
5. Set up environment variables
6. Configure Tailwind for responsive breakpoints

### Phase 2: Authentication (3-4 hours)
1. Create login page with role selection
2. Implement Firebase Auth
3. Create role-based routing
4. Set up authentication context

### Phase 3: Centre Dashboard (6-8 hours)
1. Teacher list view
2. Add teacher form
3. Invite management
4. Student quick summary chart
5. Student list by teacher
6. Move student functionality

### Phase 4: Teacher Dashboard (4-5 hours)
1. Student list view
2. Notification system for invites
3. Accept/decline invite functionality

### Phase 5: Student Details (8-10 hours)
1. Stats overview with charts
2. Strengths/weaknesses display
3. Improvement areas with priority
4. Task form component
5. Task CRUD operations
6. Progress tracking

### Phase 6: Email Integration (3-4 hours)
1. Set up email service (Cloud Functions or third-party)
2. Email templates
3. Invite email sending
4. Notification emails

### Phase 7: Security & Testing (4-5 hours)
1. Update Firestore rules
2. Test all permissions
3. Security audit
4. User acceptance testing

**Total Estimated Time: 30-39 hours**

## Files to Create

### Web App Structure (Next.js 14 with App Router)
```
AbacusTrainer-website/
├── .env.local
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── firebase-config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with responsive container
│   │   ├── login/
│   │   │   └── page.tsx        # Responsive login page
│   │   ├── centre/
│   │   │   └── dashboard/
│   │   │       └── page.tsx   # Responsive centre dashboard
│   │   ├── teacher/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx   # Responsive teacher dashboard
│   │   │   └── accept-invite/
│   │   │       └── page.tsx
│   │   └── student/
│   │       └── [studentId]/
│   │           └── page.tsx   # Responsive student details
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (responsive)
│   │   ├── StudentCard.tsx     # Responsive card component
│   │   ├── StudentDetails.tsx
│   │   ├── ImprovementPlan.tsx
│   │   ├── TaskForm.tsx        # Responsive form
│   │   ├── NotificationBadge.tsx
│   │   └── QuickSummaryChart.tsx # Responsive chart
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── firestore.ts
│   │   ├── auth.ts
│   │   └── email.ts
│   └── types/
│       ├── user.ts
│       ├── student.ts
│       └── plan.ts
├── public/
└── README.md
```

### Package.json Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "firebase": "^10.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "recharts": "^2.10.0",
    "react-hook-form": "^7.48.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Environment Variables

Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA-68vf1Ot5lZ33_7sxGAOlHQAbtv9mBNM
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myabacustrainer-51e6a
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myabacustrainer-51e6a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myabacustrainer-51e6a.firebasestorage.app
```

## Key Implementation Notes

1. **Role Detection**: Check `users/{email}.role` after Firebase Auth
2. **Student Query**: Use `teacher_email` field for filtering
3. **Analytics Calculation**: Calculate from sessions data on-demand or cache
4. **48-Hour Expiry**: Use Firestore TTL or manual expiry check
5. **Token Generation**: Use `crypto.randomUUID()` or similar
6. **Email Service**: Use Firebase Cloud Functions or SendGrid/Mailgun API
7. **Responsive Design**: Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`)
8. **Charts**: Use Recharts with responsive container wrapper

## Next Steps

1. ✅ Plan document created in `/Users/ashishdubey/Abacus/AbacusTrainer-website/`
2. Initialize Next.js project: `npx create-next-app@latest . --typescript --tailwind --app`
3. Install Firebase: `npm install firebase`
4. Install UI dependencies: `npm install recharts react-hook-form date-fns`
5. Configure Firebase with browser API key
6. Implement authentication
7. Build Centre dashboard
8. Build Teacher dashboard
9. Build Student details page
10. Set up email service
11. Update Firestore rules in Android repo
12. Deploy and test

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Web Setup**: https://firebase.google.com/docs/web/setup
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts**: https://recharts.org/
- **shadcn/ui**: https://ui.shadcn.com/


