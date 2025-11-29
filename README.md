# Grocab Landing Page - Infrastructure & Deployment Guide

Complete infrastructure, backend, database, and deployment setup for the Grocab landing page.

## 📁 Project Structure

```
/app
  /api/joinWaitlist/route.ts    # Waitlist API endpoint
  /layout.tsx                    # Root layout
  /page.tsx                      # Landing page (with waitlist form)
  /globals.css                   # Global styles with Tailwind
/components                      # Reusable components (empty for now)
/lib
  /firebase.ts                   # Firebase Admin SDK initialization
  /validators.ts                 # Email validation utilities
.env.example                     # Environment variables template
next.config.js                   # Next.js configuration
tailwind.config.js               # Tailwind CSS configuration
tsconfig.json                    # TypeScript configuration
package.json                     # Dependencies
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

Follow the [Firebase Setup](#firebase-setup) section below to configure Firebase and get your credentials.

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Firebase credentials and Google Analytics ID in `.env.local`.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your landing page.

---

## 📊 Google Analytics Setup

### Step 1: Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Start measuring"** or select your account
3. Create a new **Property** (if you don't have one)
4. Fill in property details:
   - Property name: `Grocab Landing`
   - Reporting time zone: Your timezone
   - Currency: Your currency
5. Click **"Create"**

### Step 2: Set Up Data Stream

1. Select **"Web"** as your platform
2. Enter your website URL: `https://grocab.app`
3. Enter a stream name: `Grocab Landing Page`
4. Click **"Create stream"**

### Step 3: Get Your Measurement ID

1. After creating the stream, you'll see your **Measurement ID**
2. It will look like: `G-XXXXXXXXXX` (starts with `G-`)
3. Copy this ID

### Step 4: Add to Environment Variables

1. Open your `.env.local` file
2. Add the following line:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID

### Step 5: Verify Installation

1. Restart your dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Open browser DevTools → Network tab
4. Look for requests to `google-analytics.com` or `googletagmanager.com`
5. In Google Analytics, go to **Reports** → **Realtime** to see live visitors

**Note:** Google Analytics is automatically disabled if `NEXT_PUBLIC_GA_ID` is not set, so it won't break your app in development.

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter project name: `grocab` (or your preferred name)
4. Follow the setup wizard (disable Google Analytics if not needed)
5. Click **"Create project"**

### Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set security rules later)
4. Select a location closest to your users (e.g., `us-central1`)
5. Click **"Enable"**

### Step 3: Create Service Account

1. In Firebase Console, go to **Project Settings** (gear icon) → **Service accounts**
2. Click **"Generate new private key"**
3. A JSON file will download - **keep this secure!**
4. Open the JSON file and extract:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and `\n` characters)

### Step 3.5: Grant Firestore Permissions (IMPORTANT)

The service account needs IAM permissions to write to Firestore. Follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (`grocablanding` or your project name)
3. Navigate to **IAM & Admin** → **IAM**
4. Find the service account email (e.g., `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com`)
5. Click the **pencil icon** (Edit) next to the service account
6. Click **"ADD ANOTHER ROLE"**
7. Add the following role: **"Cloud Datastore User"** (or **"Firestore Service Agent"**)
8. Click **"SAVE"**

**Alternative:** If you can't find the role, search for **"Firestore"** in the role dropdown and select any Firestore-related role that includes write permissions.

**Note:** It may take a few minutes for permissions to propagate. If you still get permission errors, wait 2-3 minutes and try again.

### Step 4: Configure Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Waitlist collection - only allow server-side writes
    match /waitlist/{document} {
      // Deny all client-side access
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

**Note:** These rules deny all client-side access because we're using Firebase Admin SDK server-side only. This is the secure approach for API routes.

### Step 5: Create Firestore Index (Optional)

If you expect high traffic, create a composite index:

1. Go to **Firestore Database** → **Indexes**
2. Click **"Create Index"**
3. Collection ID: `waitlist`
4. Fields:
   - `email` (Ascending)
5. Click **"Create"**

### Step 6: Test Locally

1. Add your credentials to `.env.local`
2. Run `npm run dev`
3. Submit a test email through the form
4. Check Firestore Console → **Firestore Database** → **Data** to see the entry

---

## 🌐 Vercel Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Grocab landing page infrastructure"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/grocab-landing.git

# Push to GitHub
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

### Step 3: Configure Environment Variables

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add each variable from `.env.example`:

```
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_CLIENT_EMAIL=your-actual-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Important for `FIREBASE_PRIVATE_KEY`:**
- Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters as literal newlines
- Vercel will handle the escaping automatically

**For `NEXT_PUBLIC_GA_ID`:**
- Replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID
- This is optional - if not set, Google Analytics will be disabled

3. Select **"Production"**, **"Preview"**, and **"Development"** environments
4. Click **"Save"**

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Your site will be live at `your-project.vercel.app`

---

## 🔥 Firebase Hosting Setup (Alternative to Vercel)

**Note:** Firebase Hosting works best for static sites. Since your app uses Next.js API routes (`/api/joinWaitlist`), you have two options:

1. **Recommended:** Continue using Vercel (best for Next.js with API routes)
2. **Alternative:** Use Firebase Hosting + Cloud Functions (more complex setup)

If you want to use Firebase Hosting, follow the steps below. Otherwise, Vercel is the recommended hosting solution for Next.js applications.

### Option A: Firebase Hosting with Cloud Functions (For API Routes)

This setup uses Firebase Hosting for static assets and Cloud Functions for API routes.

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase

```bash
firebase login
```

#### Step 3: Initialize Firebase in Your Project

```bash
cd /Users/nathananil/GrocabLanding
firebase init
```

Select:
- **Hosting:** Configure files for Firebase Hosting
- **Functions:** Configure a Cloud Functions directory

#### Step 4: Configure Firebase Hosting

When prompted:
- **Public directory:** `out` (we'll export Next.js as static)
- **Single-page app:** `Yes`
- **Set up automatic builds:** `No` (we'll handle this manually)

#### Step 5: Update Next.js Config for Static Export

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable API routes in static export
  // You'll need to move API logic to Cloud Functions
}

module.exports = nextConfig
```

**⚠️ Important:** Static export disables API routes. You'll need to:
1. Create Cloud Functions for your API endpoints
2. Update your frontend to call Cloud Functions instead of `/api/joinWaitlist`

#### Step 6: Create Cloud Function for Waitlist API

Create `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateEmail } from './validators'; // Copy validators to functions

admin.initializeApp();

export const joinWaitlist = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = req.body;
    const validation = validateEmail(email);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error || 'Invalid email address',
      });
      return;
    }

    const db = admin.firestore();
    const normalizedEmail = validation.data!;

    // Check for duplicates
    const existing = await db
      .collection('waitlist')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      res.json({
        success: true,
        message: "You're already on the list!",
      });
      return;
    }

    // Save to Firestore
    await db.collection('waitlist').add({
      email: normalizedEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: "You're on the list!",
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again later.',
    });
  }
});
```

#### Step 7: Build and Deploy

```bash
# Build Next.js static export
npm run build

# Deploy to Firebase
firebase deploy --only hosting,functions
```

#### Step 8: Update Frontend to Use Cloud Functions

Update `app/page.tsx` to call the Cloud Function:

```typescript
const response = await fetch('https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/joinWaitlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email }),
});
```

### Option B: Static Export Only (No API Routes)

If you want to remove API functionality and use Firebase Hosting for a static site only:

1. Remove API routes
2. Use a third-party service for form submissions (e.g., Formspree, Netlify Forms)
3. Follow Firebase Hosting setup above

### Firebase Hosting Configuration Files

Create `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

### Connect Custom Domain to Firebase Hosting

1. In Firebase Console, go to **Hosting** → **Add custom domain**
2. Enter `grocab.app`
3. Follow DNS setup instructions (similar to Vercel)
4. Firebase will provide A records or CNAME records
5. SSL certificates are automatically provisioned

### Firebase Hosting vs Vercel

| Feature | Firebase Hosting | Vercel |
|---------|------------------|--------|
| Next.js Support | Requires static export | Full support (SSR, API routes) |
| API Routes | Need Cloud Functions | Native support |
| Setup Complexity | More complex | Simple |
| Performance | Good | Excellent |
| Cost | Pay-as-you-go | Generous free tier |
| **Recommendation** | Use for static sites | **Best for Next.js** |

**Recommendation:** For Next.js applications with API routes, Vercel is the better choice. Use Firebase Hosting if you need Firebase-specific features or are already heavily invested in the Firebase ecosystem.

---

## 🔗 Connect Custom Domain (grocab.app)

### Step 1: Add Domain in Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Enter `grocab.app` and click **"Add"**
3. Also add `www.grocab.app` (Vercel will handle redirects)

### Step 2: Configure DNS Records

Go to your domain registrar (where you purchased `grocab.app`) and add these DNS records:

#### For Root Domain (grocab.app):

**Type:** `A`  
**Name:** `@` (or leave blank)  
**Value:** `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)

**OR use CNAME (recommended):**

**Type:** `CNAME`  
**Name:** `@` (or leave blank - some registrars require `grocab.app`)  
**Value:** `cname.vercel-dns.com`

#### For WWW Subdomain (www.grocab.app):

**Type:** `CNAME`  
**Name:** `www`  
**Value:** `cname.vercel-dns.com`

**Note:** Vercel will show you the exact DNS records needed in the Domains settings page.

### Step 3: Enable SSL

1. Vercel automatically provisions SSL certificates via Let's Encrypt
2. Wait 1-24 hours for DNS propagation and SSL certificate generation
3. Check SSL status in **Settings** → **Domains**

### Step 4: Configure Redirects

Vercel automatically handles:
- `www.grocab.app` → `grocab.app` (or vice versa, based on your preference)
- HTTP → HTTPS redirects

To customize, add to `next.config.js`:

```javascript
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'host',
            value: 'www.grocab.app',
          },
        ],
        destination: 'https://grocab.app/:path*',
        permanent: true,
      },
    ];
  },
};
```

### Step 5: Verify

1. Visit `https://grocab.app` (wait for DNS/SSL propagation)
2. Test the waitlist form
3. Check Firestore to confirm entries are being saved

---

## 🔒 Production Hardening

### 1. CORS Restrictions

The API route is server-side only, so CORS is handled by Next.js. To add explicit CORS headers, modify `app/api/joinWaitlist/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  // ... existing code ...
  
  const response = NextResponse.json({ ... });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://grocab.app');
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
```

### 2. API Rate Limiting

The current implementation uses in-memory rate limiting (resets on server restart). For production, implement one of:

**Option A: Upstash Redis (Recommended)**

```bash
npm install @upstash/ratelimit @upstash/redis
```

Update `app/api/joinWaitlist/route.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
});

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests' },
      { status: 429 }
    );
  }
  // ... rest of code
}
```

**Option B: Vercel Edge Config**

Use Vercel's Edge Config for distributed rate limiting.

### 3. Error Logging

Add error logging service:

**Option A: Sentry**

```bash
npm install @sentry/nextjs
```

**Option B: Logtail / Better Stack**

```bash
npm install @logtail/node
```

Update error handling in `app/api/joinWaitlist/route.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    // ... existing code
  } catch (error) {
    Sentry.captureException(error);
    // ... existing error handling
  }
}
```

### 4. Private Key Security

- ✅ Never commit `.env.local` or `.env` to git
- ✅ Use Vercel Environment Variables (encrypted at rest)
- ✅ Rotate service account keys periodically
- ✅ Use least-privilege IAM roles in Firebase
- ✅ Monitor Firebase usage in Firebase Console

### 5. Firestore Indexes

If you need to query waitlist by date or other fields, create composite indexes in Firebase Console:

1. Go to **Firestore Database** → **Indexes**
2. Click **"Create Index"**
3. Add fields you query on (e.g., `createdAt`, `email`)

### 6. Monitoring & Alerts

Set up monitoring:

1. **Vercel Analytics:** Enable in Vercel dashboard
2. **Firebase Monitoring:** Check Firestore usage in Firebase Console
3. **Uptime Monitoring:** Use services like UptimeRobot or Pingdom
4. **Error Alerts:** Configure Sentry or similar for error notifications

---

## 🧪 Testing the API

### Using cURL

```bash
# Success case
curl -X POST https://grocab.app/api/joinWaitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Invalid email
curl -X POST https://grocab.app/api/joinWaitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}'

# Rate limit test (run 6 times quickly)
for i in {1..6}; do
  curl -X POST https://grocab.app/api/joinWaitlist \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@example.com"}'
done
```

### Expected Responses

**Success:**
```json
{
  "success": true,
  "message": "You're on the list!"
}
```

**Duplicate:**
```json
{
  "success": true,
  "message": "You're already on the list!"
}
```

**Invalid Email:**
```json
{
  "success": false,
  "error": "Please enter a valid email address"
}
```

**Rate Limited:**
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

---

## 📊 Frontend → Backend State Flow

The frontend (`app/page.tsx`) implements the following state machine:

1. **Idle** → User enters email, form is ready
2. **Loading** → On submit:
   - Button shows spinner
   - Button is disabled
   - Form submission is prevented if already loading
3. **Success** → API returns success:
   - Button shows checkmark
   - Success message appears
   - Email field is cleared
   - State resets to idle after user interaction
4. **Error** → API returns error:
   - Error message appears below form
   - User can retry

All transitions use Tailwind CSS transitions for smooth animations.

---

## 🛠️ Troubleshooting

### Firebase Connection Issues

- Verify environment variables are set correctly in Vercel
- Check that `FIREBASE_PRIVATE_KEY` includes the full key with `\n` characters
- Ensure service account has Firestore permissions

### Rate Limiting Not Working

- In-memory rate limiting resets on serverless function cold starts
- Implement Redis-based rate limiting for production (see Production Hardening)

### Domain Not Resolving

- Wait 24-48 hours for DNS propagation
- Use `dig grocab.app` or `nslookup grocab.app` to check DNS
- Verify DNS records match Vercel's requirements

### SSL Certificate Issues

- Wait up to 24 hours for Let's Encrypt certificate generation
- Ensure DNS is properly configured before SSL generation
- Check Vercel Domains page for SSL status

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Yes | Service account email |
| `FIREBASE_PRIVATE_KEY` | Yes | Service account private key (with `\n`) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics Measurement ID (e.g., `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_FIREBASE_*` | No | Only needed if using client-side Firebase |

---

## 🎯 Next Steps

- [ ] Implement Redis-based rate limiting
- [ ] Add error logging (Sentry/Logtail)
- [ ] Set up monitoring and alerts
- [ ] Create admin dashboard to view waitlist entries
- [ ] Add email verification (optional)
- [x] Implement analytics tracking (Google Analytics)

---

## 📄 License

MIT
