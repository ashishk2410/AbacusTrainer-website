# Firestore Security Rules for Web App

## Required Security Rules

Add these rules to your Firestore security rules in the Firebase Console or in `/Users/ashishdubey/Abacus/AbacusTrainer/firestore.rules`.

### Complete Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Helper function to get user email
    function getUserEmail() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email;
    }
    
    // Helper function to check if user exists
    function userExists() {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    // Users Collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.firebaseUid || 
         request.auth.token.email == userId);
      
      // Centre can read all teachers and students
      allow read: if request.auth != null && 
        userExists() &&
        getUserRole() == 'centre';
      
      // Teachers can read their own students
      allow read: if request.auth != null && 
        userExists() &&
        getUserRole() == 'teacher' &&
        resource.data.teacher_email == getUserEmail();
      
      // Centre can update student teacher assignments
      allow update: if request.auth != null && 
        userExists() &&
        getUserRole() == 'centre' &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['teacher_id', 'teacher_email', 'lastUpdated']);
      
      // Users can update their own document (limited fields)
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.firebaseUid || 
         request.auth.token.email == userId) &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'lastUpdated']);
    }

    // Sessions Collection
    match /sessions/{sessionId} {
      // Students can read their own sessions
      allow read: if request.auth != null && 
        resource.data.user_id == request.auth.token.email;
      
      // Teachers can read sessions for their students
      allow read: if request.auth != null && 
        userExists() &&
        getUserRole() == 'teacher' &&
        exists(/databases/$(database)/documents/users/$(resource.data.user_id)) &&
        get(/databases/$(database)/documents/users/$(resource.data.user_id)).data.teacher_email == getUserEmail();
      
      // Centre can read all sessions
      allow read: if request.auth != null && 
        userExists() &&
        getUserRole() == 'centre';
      
      // Students can create their own sessions
      allow create: if request.auth != null && 
        request.resource.data.user_id == request.auth.token.email;
      
      // Students can update their own sessions
      allow update: if request.auth != null && 
        resource.data.user_id == request.auth.token.email;
    }

    // Teacher Invites Collection
    match /teacher_invites/{inviteId} {
      // Centre can create invites
      allow create: if request.auth != null && 
        userExists() &&
        getUserRole() == 'centre';
      
      // Centre can update/revoke invites
      allow update: if request.auth != null && 
        userExists() &&
        getUserRole() == 'centre';
      
      // Teacher can read their invites
      allow read: if request.auth != null && 
        resource.data.teacherEmail == request.auth.token.email;
      
      // Teacher can update their invite status (accept/decline)
      allow update: if request.auth != null && 
        resource.data.teacherEmail == request.auth.token.email &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'acceptedAt', 'declinedAt']);
    }

    // Student Plans Collection
    match /student_plans/{planId} {
      // Teacher can read/write plans for their students
      allow read, write: if request.auth != null && 
        userExists() &&
        getUserRole() == 'teacher' &&
        resource.data.teacherId == getUserEmail();
      
      // Centre can read all plans
      allow read: if request.auth != null && 
        userExists() &&
        getUserRole() == 'centre';
      
      // Allow creation if teacherId matches
      allow create: if request.auth != null && 
        userExists() &&
        getUserRole() == 'teacher' &&
        request.resource.data.teacherId == getUserEmail();
    }
  }
}
```

## Important Notes

1. **User Document Lookup**: The rules use `request.auth.uid` to look up the user document in the `users` collection. Make sure your `users` collection documents have a `firebaseUid` field that matches the Firebase Auth UID.

2. **Email-based Access**: Since the app uses email addresses as document IDs, the rules also check `request.auth.token.email` for email-based access.

3. **Testing**: After updating the rules, test with:
   - Teacher account accessing student data
   - Centre account accessing all data
   - Student account accessing their own data

4. **Deployment**: Deploy these rules in the Firebase Console under Firestore Database > Rules, or use the Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Alternative: Simplified Rules (for testing)

If you need to test quickly, you can temporarily use these less restrictive rules (NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORARY: Allow authenticated users to read/write
    // REMOVE THIS IN PRODUCTION!
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING**: The simplified rules above are for testing only. They allow any authenticated user to read/write all data. Use the complete rules above for production.


