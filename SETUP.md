# ResumAIte v2 — Setup & Demo Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas URI

---

## 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and set:
#   MONGO_URI=mongodb://localhost:27017/resumaite
#   JWT_SECRET=any_long_random_string_here
#   NODE_ENV=development
#   PORT=5000

npm install
npm run dev     # starts with nodemon on :5000
```

## 2. Frontend Setup

```bash
# In the root directory (not /backend)
npm install
npm start       # starts CRA dev server on :3000
```

CRA will proxy all `/api/*` calls to `localhost:5000` automatically.

---

## Demo Test Flow (for evaluation)

### ✅ Feature 1 — Registration with role selection
1. Go to `http://localhost:3000/auth`
2. Click **Create Account**
3. Fill in details — notice the **role picker** (Applicant 🎓 / Coach 🏅)
4. Register as an **Applicant**

### ✅ Feature 2 — Duplicate email error
1. Try registering with the **same email** again
2. You'll see: *"An account with this email already exists. Please log in instead."*
3. A "Switch to Login →" button appears that auto-navigates you

### ✅ Feature 3 — Different dashboards by role
- **Applicant** → `/dashboard` — shows your resumes, notifications, share button
- **Coach** → `/coach-dashboard` — shows only resumes shared with them

### ✅ Feature 4 — Forgot & Reset Password
1. On login tab → click **Forgot password?**
2. Enter your email → a reset token appears (demo mode — no email server needed)
3. Copy the token → click **I have a token**
4. Paste + enter new password → done

### ✅ Feature 5 — Applicant creates & manages resumes
1. Log in as Applicant
2. Click **New Resume** → fill in the form → Save
3. Only YOUR resumes appear in the dashboard

### ✅ Feature 6 — Share with Coach
1. On any resume card → click the **Share** button (📤)
2. Enter the coach's email address
3. The coach now sees it in their dashboard

### ✅ Feature 7 — Coach edits trigger notification
1. Log in as Coach → click **Review** on a shared resume
2. Edit any section (Summary, Experience, etc.)
3. Optionally add a note → **Save Edits & Notify Applicant**

### ✅ Feature 8 — Applicant sees notification + highlights
1. Log in as Applicant
2. **Bell icon** shows unread count (🔔 badge)
3. Click bell → see which resume was edited
4. The resume card shows a gold **"Coach left feedback"** banner
5. Click **Review Feedback** → open the builder
6. **Gold-bordered sections** show exactly what the coach changed, with diff
7. Click **Mark All as Read** → highlights disappear

---

## Architecture Summary

| Layer | Technology | Key decisions |
|-------|-----------|---------------|
| Frontend | React 18, React Router v6 | Role-based routing, AuthContext |
| Backend | Express 5, Node.js | JWT auth, role-enforced endpoints |
| Database | MongoDB + Mongoose | Embedded coachEdits subdocs |
| Auth | bcryptjs + jsonwebtoken | 7-day tokens, reset token flow |

