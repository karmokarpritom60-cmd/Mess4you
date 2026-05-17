# Mess4you Setup Guide

Complete setup instructions for the Mess4you hostel mess management application.

## Prerequisites

- Node.js 16+ and npm installed
- A Firebase account (free tier is sufficient)
- (Optional) EmailJS account for sending payment reminder emails

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `mess4you`
4. You can disable Google Analytics (optional)
5. Click "Create project" and wait for it to complete

### 1.2 Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Click on **Email/Password** provider
4. Enable it and click **Save**

### 1.3 Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Select **Start in test mode** (for development; secure it later with proper rules)
4. Choose your closest region
5. Click **Create**

### 1.4 Enable Cloud Storage

1. In Firebase Console, go to **Storage** (left sidebar)
2. Click **Get started**
3. Accept default security rules
4. Choose your closest region
5. Click **Done**

### 1.5 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon at top)
2. Scroll down to "Your apps" section
3. Click on the **Web** app (or create one if not exists)
4. Copy the Firebase configuration values

Your config should look like:
```javascript
{
  "apiKey": "AIza...",
  "authDomain": "mess4you-xxxxx.firebaseapp.com",
  "projectId": "mess4you-xxxxx",
  "storageBucket": "mess4you-xxxxx.appspot.com",
  "messagingSenderId": "xxxxxxxxxx",
  "appId": "1:xxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
}
```

## Step 2: Environment Variables Setup

### 2.1 Copy Environment Template

1. In the project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

### 2.2 Fill in Firebase Credentials

Edit `.env` and fill in your Firebase config values:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=mess4you-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mess4you-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=mess4you-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxx
VITE_FIREBASE_APP_ID=1:xxxxxxxxxx:web:xxxxxxxxxxxxxxxx
```

## Step 3: (Optional) EmailJS Setup for Payment Reminders

Only follow these steps if you want to enable payment reminder emails.

### 3.1 Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com)
2. Sign up for a free account
3. Verify your email

### 3.2 Setup Email Service

1. Go to **Email Services** in EmailJS dashboard
2. Click **Add Service**
3. Choose **Gmail** or **Outlook** (or your preferred provider)
4. Follow the instructions to connect your email account
5. Save the **Service ID** (you'll need this)

### 3.3 Create Email Template

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use this template:

**Template ID:** `payment_reminder`

**Subject:**
```
Payment Reminder - Mess4you Bill Due
```

**Email Content:**
```html
<p>Dear {{name}},</p>
<p>This is a reminder that your mess bill of <strong>Rs {{amount}}</strong> is pending for the month of <strong>{{month}}</strong>.</p>
<p>Please pay at the earliest to avoid any inconvenience.</p>
<hr>
<p><strong>Payment Details:</strong></p>
<p>UPI: {{upiId}}</p>
<p>Phone: {{paymentPhone}}</p>
<hr>
<p>Thank you,<br>Mess4you Management</p>
```

4. Click **Save**
5. Note your **Template ID**

### 3.4 Get Public Key

1. Go to **Account** in EmailJS dashboard
2. Copy your **Public Key**

### 3.5 Add to .env

Add these to your `.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=payment_reminder
VITE_EMAILJS_PUBLIC_KEY=xxxxx_xxxxx_xxxxx
```

## Step 4: Firestore Security Rules

### 4.1 Deploy Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click on **Rules** tab
3. Replace all content with rules from `SECURITY_RULES.txt`
4. Click **Publish**

**Important:** These rules restrict data access by role and ensure data security.

## Step 5: Install and Run

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or next available port).

### 5.3 Build for Production

```bash
npm run build
```

## Step 6: Create First Admin User

Since signup is disabled in the app (only admins can add students), you need to manually create the first admin user in Firebase:

### 6.1 Create Admin Account

1. In Firebase Console, go to **Authentication**
2. Click **Add user**
3. Enter email and password
4. Note the User ID
5. Go to **Firestore Database**
6. Create a new document in `users` collection with:
   - Document ID: (use the User ID from Firebase Auth)
   - Fields:
     ```
     name: "Your Name"
     email: "admin@example.com"
     phone: "9876543210"
     role: "superadmin"
     roomNumber: "Admin"
     vegPreference: "veg"
     isActive: true
     createdAt: (server timestamp)
     hostelId: "default-hostel"
     ```

### 6.2 Create Other Users

Once logged in as admin/superadmin, you can:
- Add new students through the app
- Create other admins through Settings > Admin Management

## Step 7: Initial Configuration

Once logged in as superadmin:

1. Go to **Settings**
2. Configure:
   - Meal cutoff times (breakfast, lunch, dinner)
   - Base monthly amount
   - Upload payment QR code
   - Enter UPI ID and payment phone
3. Add admins if needed

## Troubleshooting

### Firebase Configuration Error

**Error:** "Firebase configuration is incomplete"

**Solution:** Check that your `.env` file has all required fields and they're not empty.

### Authentication Error

**Error:** "auth/invalid-api-key"

**Solution:** Your Firebase API key is invalid. Copy it again from Firebase Console > Project Settings.

### Firestore Permission Denied

**Error:** "Missing or insufficient permissions"

**Solution:** 
1. Check your Firestore security rules are deployed
2. Make sure you're logged in with the correct user role
3. Check that user document exists in `users` collection with correct `role` field

### EmailJS Not Sending Emails

**Error:** Emails not delivered despite saving

**Solution:**
1. Check EmailJS credentials in `.env`
2. Verify email service is connected in EmailJS dashboard
3. Check spam folder for emails
4. Test EmailJS directly at their dashboard

## First Login

1. Open the app
2. Use the admin account you created in Firebase Authentication
3. You'll see the admin/superadmin dashboard

## First Time Setup Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Cloud Storage enabled
- [ ] Firebase config copied to `.env`
- [ ] Firestore security rules deployed
- [ ] First admin user created in Firestore
- [ ] (Optional) EmailJS configured
- [ ] Dependencies installed
- [ ] Dev server running successfully
- [ ] Can login as admin

## Support

For issues or questions:
1. Check Firebase error messages in browser console (F12)
2. Review Firestore rules for permission errors
3. Ensure all environment variables are correctly set
4. Check that you're using the correct Firebase project

## Security Notes

- **Do not commit `.env` to version control**
- Always use strong passwords for Firebase accounts
- Update Firestore rules before production deployment
- Restrict Firebase access by email domain in Authentication settings
- Enable Multi-Factor Authentication for admin accounts

## Next Steps

1. Add students through the app
2. Configure expenses categories
3. Set up the meal menu
4. Test payment verification workflow
5. Set up payment reminders via email
