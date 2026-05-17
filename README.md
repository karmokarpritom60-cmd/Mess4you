# Mess4you - Hostel Mess Management System

A complete, production-ready web application for managing hostel mess operations including student registrations, meal tracking, expense management, payments, and billing.

**Built with:** React 18 + TypeScript + Vite + Tailwind CSS + Firebase (Firestore + Auth + Storage)

## Features

### For Students
- View personal mess bill with breakdown (base amount, extra charges, payments, balance)
- Update meal preferences (veto breakfast/lunch/dinner before cutoff times)
- View meal history for the current month
- Upload payment proofs with QR code / UPI options
- Track payment status (pending/verified/rejected)
- Edit profile and change password
- See total monthly expense and their calculated deficit share

### For Admins
- Add/edit/remove students
- Override locked meals with reason logging
- Verify or reject payment screenshots with rejection reasons
- Add/edit/delete expenses with categories
- Update weekly meal menu (inline editing)
- Send notifications to all students or unpaid students only
- View real-time meal counts (eating/vetoed) for today
- Generate monthly bills for all students automatically
- Export reports to Excel/CSV
- View complete audit log of all actions

### For Cooks
- See real-time count of meals needed for breakfast/lunch/dinner
- View veg and non-veg meal split
- See which students are absent/vetoed
- View today's menu
- Auto-refreshes every 2 minutes

### For Super Admins
- All admin features PLUS:
- Manage other admins (add/remove)
- Configure meal cutoff times
- Set base monthly amount
- Upload payment QR code image
- Set UPI ID and payment phone
- Change any user's role
- Freeze monthly reports
- View full audit logs

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- A Firebase account (free tier works)

### Installation

1. **Clone and install:**
   ```bash
   npm install
   ```

2. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

3. **Setup Firebase:**
   - Follow the detailed steps in `SETUP.md`
   - Add your Firebase credentials to `.env`

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, BottomNav, OfflineBanner
│   └── ui/              # Reusable UI components
├── contexts/            # Auth and Toast context
├── pages/
│   ├── LoginPage
│   ├── student/         # Student dashboard tabs
│   ├── admin/           # Admin pages
│   ├── cook/            # Cook dashboard
│   └── superadmin/      # Settings page
├── services/
│   ├── firestore.ts     # All Firestore operations
│   └── audit.ts         # Audit logging
├── types/               # TypeScript interfaces
└── utils/               # Helpers and utilities
```

## Documentation

- **SETUP.md** - Complete Firebase setup guide with screenshots
- **FIRESTORE_SECURITY_RULES.txt** - Security rules for Firestore collections
- **.env.example** - Environment variables template

## Database Schema (Firestore)

### Collections

| Collection | Purpose | Access |
|-----------|---------|--------|
| `users` | User accounts and profiles | Auth required, role-based |
| `meals` | Daily meal records (eating/vetoed/locked) | Students own, admins all |
| `payments` | Payment records with screenshots | Students own, admins verify |
| `expenses` | Mess expenses by category | Admin write, all read |
| `menu` | Weekly meal menu | Admin write, all read |
| `notifications` | System notifications | Target-based access |
| `settings` | System configuration | Superadmin write, all read |
| `monthlyReports` | Bill reports and calculations | Admin write, all read |
| `auditLogs` | Action audit trail | User read own, admin read all |

## Key Features Detail

### Real-Time Updates
- Cook dashboard auto-refreshes meal counts
- Admin payment queue updates as students submit
- Settings changes apply immediately

### Bill Calculation
```
Deficit = Total Expense - (Base Amount × Active Students)
Per Meal Rate = Deficit ÷ Total Meals
Student Bill = Base Amount + (Student Meals × Per Meal Rate) - Amount Paid
```

### Meal Cutoff System
- Admin sets cutoff times for each meal
- Students can only modify meals before cutoff
- Past meals are automatically locked
- Countdown timer shows time remaining

### Payment Verification
- Students upload screenshot of payment
- Admin sees pending payments with thumbnail
- Click to view full image
- One-click verify or reject with optional reason

### Audit Logging
Every critical action is logged:
- User who performed the action
- Action type
- Old and new values
- Timestamp
- Superadmin can export audit logs

## Security

- Firebase Authentication with email/password
- Firestore Security Rules enforce role-based access
- Students can only see their own data
- Admins can manage students and verify payments
- Superadmins have full system access
- All changes are audited and logged

## Offline Support

- App shows cached data when offline
- Yellow banner indicates offline state
- Actions are queued for sync when back online
- Real-time sync resumes automatically

## Environment Variables

Required:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional (for payment reminders):
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Android Chrome (tested on Android 9+)

## Performance

- Responsive design: 360px to 1920px screens
- Automatic code splitting with Vite
- Real-time database listeners with Firestore
- Optimized images and CSS
- ~180kb gzip after minification

## Troubleshooting

### Firebase Configuration Error
Check that `.env` file has all required Firebase credentials from Firebase Console.

### Permission Denied Errors
Ensure Firestore security rules are deployed and your user has the correct role in the `users` collection.

### Can't Create Students
Only admins/superadmins can create students. Login as admin first.

### Payments Not Showing
Check that payment documents in Firestore have the correct `studentId` matching the logged-in user.

### Offline Features Not Working
Enable browser offline support in DevTools (Application > Storage).

## Future Enhancements

- [ ] SMS reminders for pending payments
- [ ] Automated expense tracking with photos
- [ ] Student leave management system
- [ ] Monthly financial reports PDF export
- [ ] Multi-hostel support
- [ ] Mobile app with React Native
- [ ] Recurring expense templates
- [ ] Meal rating and feedback system

## License

Created by Pritom Karmokar © 2025

## Support

For issues or questions:
1. Check the SETUP.md for detailed configuration
2. Review browser console for error messages (F12)
3. Verify Firestore rules are deployed
4. Ensure all environment variables are set correctly

## Contributing

This is a complete application. For features or bug reports, please reach out to the maintainer.

---

**Happy hostel managing!** 🍽️
