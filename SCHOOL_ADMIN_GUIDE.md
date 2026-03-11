# School Admin Portal - Quick Start Guide

## Overview

The School Admin Portal is a comprehensive management system that allows schools to:

- **Enroll students** in learning modules
- **Manage student access** to different workbooks
- **Monitor progress** across all learning activities
- **Generate reports** and analytics

## Getting Started

### 1. School Registration

Administrators can register their school at `/school-signup`:

**Required Information:**

- School name and address
- District and school type
- Administrator contact details
- Email and password for login

**Process:**

1. Navigate to `/school-signup`
2. Fill in school information
3. Fill in administrator details
4. Create account
5. Verify email (if email verification is enabled)

### 2. Logging In

Once registered, admins can log in at `/school-login`:

- Use the email and password created during registration
- Access is restricted to school admin accounts only
- Students should use the regular `/login` page

## Main Features

### Dashboard (`/school-admin/dashboard`)

The dashboard provides an at-a-glance overview:

- **Total Students** - Number of enrolled students
- **Active Students** - Students currently engaged
- **Learning Modules** - Available workbooks (6 total)
- **Average Progress** - Overall class progress percentage

**Quick Actions:**

- Add new students
- View student progress
- Manage module access

### Student Management (`/school-admin/students`)

Add, edit, and manage your school's students:

**Add a Student:**

1. Click "Add Student" button
2. Enter student information:
   - First and Last Name
   - Email address
   - Student ID (unique identifier)
   - Grade Level
   - Status (Active/Inactive/Suspended)
3. Click "Save"

**Edit a Student:**

- Click the pencil icon next to any student
- Update information
- Save changes

**Remove a Student:**

- Click the delete icon
- Confirm deletion

**Search & Filter:**

- Use the search bar to find specific students
- Search by name, email, or student ID

### Progress Tracking (`/school-admin/progress`)

Monitor how students are performing:

**Features:**

- **Overall progress** for each student
- **Module completion** statistics
- **Last activity** timestamps
- **Top performers** leaderboard

**Viewing Details:**

- Click on any student card to see detailed module breakdown
- View progress for each of the 6 workbooks:
  - Pre-Assignment Workbook 1, 2, 3
  - Assignment Workbook 1, 2, 3

**Filters:**

- Search by student name or ID
- Filter by grade level
- View specific date ranges

### Manage Access (`/school-admin/access`)

Control which modules students can access:

**Available Modules:**

1. Pre-Assignment Workbook 1 - Foundation concepts
2. Pre-Assignment Workbook 2 - Intermediate preparation
3. Pre-Assignment Workbook 3 - Advanced preparation
4. Assignment Workbook 1 - Core content level 1
5. Assignment Workbook 2 - Core content level 2
6. Assignment Workbook 3 - Core content level 3

**Granting Access:**

1. Find the student
2. Click "Edit Access" or "Manage Access"
3. Toggle access for each module ON/OFF
4. Or use "Grant All Access" to enable all modules
5. Click "Save Changes"

**Revoking Access:**

- Toggle specific modules OFF
- Or use "Revoke All Access" to disable all modules
- Click "Save Changes"

### Reports & Analytics (`/school-admin/reports`)

Generate comprehensive reports:

**Report Types:**

1. **School Overview**
   - Total enrolled students
   - Active student count
   - Average progress across all students

2. **Progress Report**
   - Detailed module-by-module breakdown
   - Average completion rates
   - Individual student performance

3. **Engagement Report**
   - Daily active users
   - Average session time
   - Activity patterns

4. **Completion Report**
   - Total modules completed
   - Completion rate percentage
   - Achievement statistics

**Export Options:**

- Export to Excel (.xlsx)
- Export to PDF

**Filters:**

- Date range (Last 7 days, 30 days, 3 months, year, all time)
- Grade level filter
- Custom date selection

## Learning Modules Structure

### Pre-Assignment Workbooks

These are foundational modules that prepare students:

- **Workbook 1** - Basic concepts and introduction
- **Workbook 2** - Intermediate skills development
- **Workbook 3** - Advanced preparation for main content

### Assignment Workbooks

Main learning content divided into three levels:

- **Workbook 1** - Core curriculum level 1
- **Workbook 2** - Core curriculum level 2
- **Workbook 3** - Core curriculum level 3

Each workbook contains:

- Video lessons
- Concept notes
- Sample questions
- Worked examples
- Interactive activities
- Progress tracking

## Best Practices

### Student Management

✅ **Use unique student IDs** for easy tracking
✅ **Keep contact information updated**
✅ **Regularly review student status**
✅ **Archive inactive students** rather than deleting

### Access Control

✅ **Start with limited access** and gradually unlock modules
✅ **Use sequential access** - unlock next workbook after completing previous
✅ **Grant access based on grade level** and readiness
✅ **Review access permissions** regularly

### Progress Monitoring

✅ **Check progress weekly** to identify struggling students
✅ **Celebrate top performers** to encourage others
✅ **Intervene early** when students fall behind
✅ **Export reports** for school records

### Data Security

✅ **Use strong passwords** for admin accounts
✅ **Log out** when not using the system
✅ **Regularly update** student information
✅ **Backup reports** periodically

## Troubleshooting

### Can't Log In

- Verify you're using the school admin login at `/school-login`
- Students should use `/login` instead
- Check if email and password are correct
- Try password reset if needed

### Student Not Showing Up

- Verify student was added successfully
- Check if student status is "Active"
- Refresh the page
- Search by student ID or email

### Access Not Working

- Confirm access was granted and saved
- Check if student has correct email
- Verify module ID matches
- Try toggling access off and on again

### Progress Not Updating

- Student must be logged in for progress to track
- Check if student has access to the module
- Verify student is using the correct account
- Progress updates after completing activities

## Support

For technical issues or questions:

- Check the [Database Schema Documentation](./SCHOOL_ADMIN_SCHEMA.md)
- Review the code in `/pages/school-admin/` directory
- Contact system administrator

## Navigation Quick Reference

| Page          | URL                       | Purpose             |
| ------------- | ------------------------- | ------------------- |
| School Signup | `/school-signup`          | Register new school |
| School Login  | `/school-login`           | Admin login         |
| Dashboard     | `/school-admin/dashboard` | Overview & stats    |
| Students      | `/school-admin/students`  | Manage students     |
| Progress      | `/school-admin/progress`  | Monitor learning    |
| Access        | `/school-admin/access`    | Control modules     |
| Reports       | `/school-admin/reports`   | Analytics & export  |

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Valid school email address
- Supabase account with required tables configured

## Next Steps

1. ✅ Complete school registration
2. ✅ Add your first students
3. ✅ Grant access to appropriate modules
4. ✅ Monitor student progress
5. ✅ Generate your first report

---

**Note:** This system integrates with the existing learning modules. All student progress is tracked automatically as they complete lessons, quizzes, and activities.
