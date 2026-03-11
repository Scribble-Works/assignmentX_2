# School Admin Portal - Database Schema

This document outlines the database schema required for the School Admin Portal system.

## Overview

The School Admin Portal allows school administrators to:

- Register their schools
- Add and manage students
- Control student access to learning modules
- Monitor student progress across all workbooks
- Generate reports and analytics

## Required Database Tables

### 1. `schools` table

Stores information about registered schools.

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  address TEXT,
  district VARCHAR(255),
  school_type VARCHAR(100),
  estimated_students INTEGER,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `profiles` table (Update existing table)

Add a `role` field and `school_id` to the existing profiles table.

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Roles can be: 'student', 'school_admin', 'facilitator'
```

### 3. `school_students` table

Stores students enrolled by schools.

```sql
CREATE TABLE school_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  student_id VARCHAR(100) UNIQUE NOT NULL,
  grade_level VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
  access_permissions JSONB DEFAULT '{}', -- Stores module access permissions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_school_students_school_id ON school_students(school_id);
CREATE INDEX idx_school_students_status ON school_students(status);
```

### 4. `student_module_access` table

Tracks which modules each student can access.

```sql
CREATE TABLE student_module_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES school_students(id) ON DELETE CASCADE NOT NULL,
  module_id VARCHAR(100) NOT NULL, -- e.g., 'assignment_workbook1', 'preassignment_workbook2'
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional: for time-limited access
  UNIQUE(student_id, module_id)
);

CREATE INDEX idx_student_module_access_student_id ON student_module_access(student_id);
CREATE INDEX idx_student_module_access_module_id ON student_module_access(module_id);
```

### 5. `student_progress` table

Tracks student progress across different modules (integrates with existing quiz progress).

```sql
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES school_students(id) ON DELETE CASCADE NOT NULL,
  module_id VARCHAR(100) NOT NULL,
  content_id VARCHAR(100), -- Specific content/lesson within module
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_module_id ON student_progress(module_id);
```

### 6. `school_activity_log` table (Optional)

Logs important activities for auditing purposes.

```sql
CREATE TABLE school_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL, -- e.g., 'student_added', 'access_granted', 'student_removed'
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_school_id ON school_activity_log(school_id);
CREATE INDEX idx_activity_log_created_at ON school_activity_log(created_at);
```

## Row Level Security (RLS) Policies

Enable RLS on all tables and create appropriate policies:

### Schools Table Policies

```sql
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- School admins can view their own school
CREATE POLICY "School admins can view their school"
  ON schools FOR SELECT
  USING (admin_id = auth.uid());

-- School admins can update their own school
CREATE POLICY "School admins can update their school"
  ON schools FOR UPDATE
  USING (admin_id = auth.uid());
```

### School Students Table Policies

```sql
ALTER TABLE school_students ENABLE ROW LEVEL SECURITY;

-- School admins can manage students in their school
CREATE POLICY "School admins can view their students"
  ON school_students FOR SELECT
  USING (
    school_id IN (
      SELECT id FROM schools WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "School admins can insert students"
  ON school_students FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT id FROM schools WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "School admins can update their students"
  ON school_students FOR UPDATE
  USING (
    school_id IN (
      SELECT id FROM schools WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "School admins can delete their students"
  ON school_students FOR DELETE
  USING (
    school_id IN (
      SELECT id FROM schools WHERE admin_id = auth.uid()
    )
  );
```

### Student Module Access Table Policies

```sql
ALTER TABLE student_module_access ENABLE ROW LEVEL SECURITY;

-- School admins can manage module access for their students
CREATE POLICY "School admins can manage student module access"
  ON student_module_access FOR ALL
  USING (
    student_id IN (
      SELECT id FROM school_students
      WHERE school_id IN (
        SELECT id FROM schools WHERE admin_id = auth.uid()
      )
    )
  );

-- Students can view their own module access
CREATE POLICY "Students can view their module access"
  ON student_module_access FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM school_students WHERE email = auth.email()
    )
  );
```

### Student Progress Table Policies

```sql
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- School admins can view progress of their students
CREATE POLICY "School admins can view student progress"
  ON student_progress FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM school_students
      WHERE school_id IN (
        SELECT id FROM schools WHERE admin_id = auth.uid()
      )
    )
  );

-- Students can view and update their own progress
CREATE POLICY "Students can manage their progress"
  ON student_progress FOR ALL
  USING (
    student_id IN (
      SELECT id FROM school_students WHERE email = auth.email()
    )
  );
```

## Integration with Existing Quiz System

### Linking School Students to User Accounts

To allow school students to log in and track their progress:

1. When a student is added, optionally create a user account for them
2. Link the `school_students.id` to the user's progress tracking
3. Update the existing `useQuizProgress` composable to check for school student access

### Example Integration in Content Pages

```javascript
// In learning module pages, check if user has access
const checkModuleAccess = async (moduleId) => {
  const { data: student } = await client
    .from("school_students")
    .select("*, student_module_access(*)")
    .eq("email", user.value.email)
    .single();

  if (!student) return true; // Not a school student, grant access

  // Check if student has access to this module
  const hasAccess = student.student_module_access.some(
    (access) => access.module_id === moduleId,
  );

  return hasAccess;
};
```

## Setup Instructions

1. Run the SQL commands above in your Supabase SQL editor
2. Enable RLS policies as shown
3. Test the signup flow with a school admin account
4. Add test students and verify access controls work correctly

## Navigation Routes

The following routes are available:

### Public Routes

- `/school-signup` - School admin registration
- `/school-login` - School admin login

### Protected Routes (School Admin Only)

- `/school-admin/dashboard` - Main dashboard with overview
- `/school-admin/students` - Student management (add/edit/remove)
- `/school-admin/progress` - View student progress across modules
- `/school-admin/access` - Manage student module access
- `/school-admin/reports` - Generate reports and analytics

## Features

✅ School registration with admin accounts
✅ Add/remove students
✅ Manage student access to specific learning modules
✅ Monitor student progress in real-time
✅ View detailed analytics and reports
✅ Export reports (Excel/PDF)
✅ Role-based access control
✅ Secure data with Row Level Security

## Future Enhancements

- Email invitations for students
- Automated progress reports
- Parent portal access
- Bulk student import (CSV)
- Custom learning paths
- Achievement badges
- Comparative analytics
- Integration with school information systems
