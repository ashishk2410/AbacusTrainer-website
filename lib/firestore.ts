// Firestore helper functions - read/write to existing Firebase project
// Uses email IDs for joins as specified
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  setDoc,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Session, TeacherInvite, StudentPlan, Task } from './types';

// Users collection helpers
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log('Fetching user by email:', email);
    const userDoc = await getDoc(doc(db, 'users', email));
    if (userDoc.exists()) {
      const data = userDoc.data();
      // Ensure email field exists (use document ID if not present)
      const userData = { 
        ...data, 
        user_id: userDoc.id,
        email: data.email || userDoc.id // Use document ID as email if email field is missing
      } as User;
      console.log('User found:', userData);
      return userData;
    }
    console.warn('User document not found for email:', email);
    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

export async function getUsersByRole(role: string): Promise<User[]> {
  const q = query(collection(db, 'users'), where('role', '==', role));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      user_id: doc.id,
      email: data.email || doc.id // Use document ID as email if email field is missing
    };
  }) as User[];
}

export async function updateUser(email: string, updates: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', email), updates);
}

// Sessions collection helpers
export async function getSessionsByStudentEmail(studentEmail: string): Promise<Session[]> {
  const q = query(
    collection(db, 'sessions'),
    where('user_id', '==', studentEmail),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    session_id: doc.id
  })) as Session[];
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  try {
    console.log('Fetching session document:', sessionId);
    const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
    if (!sessionDoc.exists()) {
      console.log('Session document does not exist');
      return null;
    }
    const data = sessionDoc.data();
    console.log('Session data keys:', Object.keys(data));
    console.log('Questions in session:', data.questions);
    console.log('Questions type:', typeof data.questions);
    console.log('Questions is array:', Array.isArray(data.questions));
    if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
      console.log('First question in session:', data.questions[0]);
      console.log('First question keys:', Object.keys(data.questions[0]));
    }
    return {
      ...data,
      session_id: sessionDoc.id
    } as Session;
  } catch (error) {
    console.error('Error fetching session by ID:', error);
    throw error;
  }
}

export async function getSessionsByTeacherEmail(teacherEmail: string): Promise<Session[]> {
  const q = query(
    collection(db, 'sessions'),
    where('teacher_id', '==', teacherEmail),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    session_id: doc.id
  })) as Session[];
}

export async function getRecentSessions(studentEmail: string, days: number = 30): Promise<Session[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const q = query(
    collection(db, 'sessions'),
    where('user_id', '==', studentEmail),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const allSessions = querySnapshot.docs.map(doc => ({
    ...doc.data(),
    session_id: doc.id
  })) as Session[];
  
  // Filter by date in JavaScript since Firestore string comparison can be tricky
  return allSessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= cutoffDate;
  });
}

// Students collection helpers (using teacher_email for filtering)
export async function getStudentsByTeacherEmail(teacherEmail: string): Promise<User[]> {
  try {
    console.log('Fetching students for teacher email:', teacherEmail);
    
    // Try querying with teacher_email first
    const q = query(
      collection(db, 'users'), 
      where('teacher_email', '==', teacherEmail)
    );
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} students for teacher ${teacherEmail}`);
    
    // If no results, try also filtering by role to see if there are any students at all
    if (querySnapshot.docs.length === 0) {
      console.log('No students found with teacher_email. Checking all students...');
      const allStudentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );
      const allStudentsSnapshot = await getDocs(allStudentsQuery);
      console.log(`Total students in database: ${allStudentsSnapshot.docs.length}`);
      
      // Log a few sample student documents to see their structure
      allStudentsSnapshot.docs.slice(0, 3).forEach(doc => {
        const data = doc.data();
        console.log('Sample student document:', doc.id, {
          email: data.email,
          teacher_email: data.teacher_email,
          teacher_id: data.teacher_id,
          role: data.role
        });
      });
    }
    
    const students = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Student document:', doc.id, {
        email: data.email || doc.id,
        name: data.name,
        teacher_email: data.teacher_email,
        teacher_id: data.teacher_id,
        role: data.role
      });
      return {
        ...data,
        user_id: doc.id,
        email: data.email || doc.id // Ensure email field exists
      };
    }) as User[];
    
    return students;
  } catch (error) {
    console.error('Error fetching students by teacher email:', error);
    throw error;
  }
}

export async function updateStudentTeacher(
  studentEmail: string, 
  teacherEmail: string, 
  teacherId: string
): Promise<void> {
  await updateDoc(doc(db, 'users', studentEmail), {
    teacher_email: teacherEmail,
    teacher_id: teacherId,
    lastUpdated: Timestamp.now()
  });
  
  // Also update all student sessions
  const sessions = await getSessionsByStudentEmail(studentEmail);
  const batch = sessions.map(session => 
    updateDoc(doc(db, 'sessions', session.session_id), {
      teacher_id: teacherId
    })
  );
  await Promise.all(batch);
}

// Teacher invites collection helpers
export async function createTeacherInvite(
  teacherEmail: string,
  centreId: string,
  centreEmail: string
): Promise<string> {
  const token = crypto.randomUUID();
  const now = Timestamp.now();
  const expiresAt = new Date(now.toMillis() + 48 * 60 * 60 * 1000); // 48 hours
  
  const inviteData: Omit<TeacherInvite, 'inviteId'> = {
    teacherEmail,
    centreId,
    centreEmail,
    status: 'pending',
    token,
    createdAt: now,
    expiresAt: Timestamp.fromDate(expiresAt),
    emailSent: false
  };
  
  const docRef = await addDoc(collection(db, 'teacher_invites'), inviteData);
  return docRef.id;
}

export async function getPendingInvitesByTeacher(teacherEmail: string): Promise<TeacherInvite[]> {
  const q = query(
    collection(db, 'teacher_invites'),
    where('teacherEmail', '==', teacherEmail),
    where('status', '==', 'pending')
  );
  const querySnapshot = await getDocs(q);
  const now = Timestamp.now();
  
  const invites = querySnapshot.docs.map(doc => ({
    ...doc.data(),
    inviteId: doc.id
  })) as TeacherInvite[];
  
  return invites.filter(invite => invite.expiresAt.toMillis() > now.toMillis());
}

export async function getAllInvitesByTeacher(teacherEmail: string): Promise<TeacherInvite[]> {
  const q = query(
    collection(db, 'teacher_invites'),
    where('teacherEmail', '==', teacherEmail)
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    inviteId: doc.id
  })) as TeacherInvite[];
}

export async function updateInviteStatus(
  inviteId: string,
  status: TeacherInvite['status']
): Promise<void> {
  const updates: any = { status };
  if (status === 'accepted') {
    updates.acceptedAt = Timestamp.now();
  } else if (status === 'declined') {
    updates.declinedAt = Timestamp.now();
  } else if (status === 'revoked') {
    updates.revokedAt = Timestamp.now();
  }
  await updateDoc(doc(db, 'teacher_invites', inviteId), updates);
}

// Student plans collection helpers
export async function getStudentPlan(studentEmail: string, teacherEmail: string): Promise<StudentPlan | null> {
  const q = query(
    collection(db, 'student_plans'),
    where('studentId', '==', studentEmail),
    where('teacherId', '==', teacherEmail)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const planDoc = querySnapshot.docs[0];
  return {
    ...planDoc.data(),
    planId: planDoc.id
  } as StudentPlan;
}

export async function createOrUpdateStudentPlan(
  studentEmail: string,
  teacherEmail: string,
  task: Task
): Promise<string> {
  const existingPlan = await getStudentPlan(studentEmail, teacherEmail);
  
  if (existingPlan) {
    // Update existing plan
    const updatedTasks = [...existingPlan.tasks, task];
    await updateDoc(doc(db, 'student_plans', existingPlan.planId), {
      tasks: updatedTasks,
      updatedAt: Timestamp.now()
    });
    return existingPlan.planId;
  } else {
    // Create new plan
    const planData: Omit<StudentPlan, 'planId'> = {
      studentId: studentEmail,
      teacherId: teacherEmail,
      tasks: [task],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'student_plans'), planData);
    return docRef.id;
  }
}

export async function updateTaskInPlan(
  planId: string,
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  const planDoc = await getDoc(doc(db, 'student_plans', planId));
  if (!planDoc.exists()) return;
  
  const plan = planDoc.data() as StudentPlan;
  const updatedTasks = plan.tasks.map(task =>
    task.taskId === taskId ? { ...task, ...updates, updatedAt: Timestamp.now() } : task
  );
  
  await updateDoc(doc(db, 'student_plans', planId), {
    tasks: updatedTasks,
    updatedAt: Timestamp.now()
  });
}

