# Mess4you - Quick Start Guide

Get Mess4you running in 5 minutes!

## Step 1: Setup Firebase (1 minute)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project called "mess4you"
3. Enable **Authentication** → **Email/Password**
4. Create **Firestore Database** → Choose **Test Mode**
5. Enable **Cloud Storage**
6. Go to **Project Settings** and copy your Firebase config values

## Step 2: Configure Environment (2 minutes)

1. In project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Firebase values:
   ```env
   VITE_FIREBASE_API_KEY=your_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 3: Deploy Security Rules (1 minute)

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Copy all content from `FIRESTORE_SECURITY_RULES.txt` in project root
3. Paste into Firebase Rules editor
4. Click **Publish**

## Step 4: Install & Run (1 minute)

```bash
npm install
npm run dev
```

App opens at `http://localhost:5173`

## Step 5: Create First Admin User (2 minutes)

1. In Firebase Console, go to **Authentication**
2. Click **Add User**
3. Email: `admin@example.com`
4. Password: `TestPassword@123`
5. Note the **User ID** that appears

6. Go to **Firestore Database**
7. Create new collection: `users`
8. Create new document with ID = the User ID from step 5
9. Add these fields:
   ```
   name: "Admin User"
   email: "admin@example.com"
   phone: "9876543210"
   role: "superadmin"
   roomNumber: "Admin"
   vegPreference: "veg"
   isActive: true
   createdAt: (server timestamp)
   hostelId: "default-hostel"
   ```

## Step 6: Login & Test

1. Go to http://localhost:5173
2. Login with: 
   - Email: `admin@example.com`
   - Password: `TestPassword@123`
3. You should see the admin dashboard!

## Common Issues

### "Firebase configuration is incomplete"
- Check `.env` file has all 6 Firebase keys
- Restart dev server after updating `.env`

### "Permission Denied" errors
- Ensure Firestore rules are deployed (published in Firebase Console)
- Check your user document has the correct `role` field in Firestore

### Can't login
- Verify user exists in Firebase Authentication
- Check user document exists in Firestore `users` collection
- Check email and password match

## Next Steps

### Add More Users
Once logged in as admin, you can add students through the app (when UI is connected).

For now, manually create them in Firestore:
1. Go to **Firestore Database** → `users` collection
2. Add new document with fields:
   ```
   name: "Student Name"
   email: "student@example.com"
   phone: "9876543210"
   role: "student"
   roomNumber: "101"
   vegPreference: "veg"
   isActive: true
   createdAt: (server timestamp)
   hostelId: "default-hostel"
   ```

3. Go to **Authentication**
4. Create user with same email and a password
5. Note the User ID
6. Use that User ID as the document ID in Firestore

### Add Expenses
1. Go to **Firestore Database** → Create collection `expenses`
2. Add sample expenses:
   ```
   category: "Rice"
   amount: 4500
   date: "2025-05-01"
   month: "2025-05"
   note: "50kg Rice"
   addedBy: "[your-admin-uid]"
   createdAt: (server timestamp)
   ```

### Set Meal Menu
1. Create collection `menu`
2. Add documents for each day (monday, tuesday, etc.):
   ```
   day: "monday"
   breakfast: "Idli, Sambar, Chutney"
   lunch: "Rice, Dal, Sabzi, Roti"
   dinner: "Chapati, Paneer, Rice"
   updatedAt: (server timestamp)
   updatedBy: "[your-admin-uid]"
   ```

## For Full Documentation

- **SETUP.md** - Detailed Firebase setup with images
- **README.md** - Complete feature documentation
- **FIRESTORE_SECURITY_RULES.txt** - Database security rules
- **IMPLEMENTATION_SUMMARY.md** - What was built and why

---

**You're all set!** 🎉 Mess4you is running with real Firebase.

Need help? Check the documentation files or review browser console for errors (F12).
