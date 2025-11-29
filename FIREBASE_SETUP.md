# Firebase Setup for Lohoba Luxury Blog

## Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it "lohoba-luxury"
4. Disable Google Analytics (not needed)
5. Click "Create project"

### 2. Enable Firestore Database
1. In your Firebase console, click "Firestore Database"
2. Click "Create database"
3. **Choose your mode:**
   - **Test Mode**: Anyone can read/write (30 days) - Good for development
   - **Production Mode**: Requires authentication - Good for live sites
4. **For quick setup, choose "Test Mode"**
5. Select your preferred location
6. Click "Done"

### 3. Get Your Config
1. Click the gear icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon "</>"
4. Register your app as "Lohoba Luxury"
5. Copy the firebaseConfig object

### 4. Update Your Files
Replace the dummy config in both `admin.html` and `blog.html`:

```javascript
const firebaseConfig = {
  // Replace with your actual config
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase without Analytics
firebase.initializeApp(firebaseConfig);
```

### 5. Test It
1. Go to your admin panel
2. Add a blog post
3. Check your blog page - all users will see it!

## After 30 Days - Update Security Rules
When test mode expires, update Firestore rules:

**Option 1: Public Read, No Write (Recommended)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogPosts/{document} {
      allow read: if true;  // Anyone can read blog posts
      allow write: if false; // No one can write (admin uses different method)
    }
  }
}
```

**Option 2: Extend Test Mode**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if true; // Keep test mode forever (not secure)
  }
}
```

## Firebase Pricing - FREE for Your Blog!

### Spark Plan (Free Forever)
- ✅ **50,000 document reads/day**
- ✅ **20,000 document writes/day** 
- ✅ **1 GB storage**
- ✅ **Perfect for small blogs**

### Your Blog Usage (Estimated)
- **~100-1000 reads/day** (visitors reading posts)
- **~1-10 writes/day** (admin adding posts)
- **Way under free limits!**

### After 30 Days
- ❌ **Test mode expires** (not Firebase itself)
- ✅ **Firebase remains FREE**
- ✅ **Just update security rules**
- ✅ **No payment required**

## Without Firebase
If you don't want to use Firebase, the blog will work with localStorage only, but posts won't sync between users.