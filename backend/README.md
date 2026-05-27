# ResumAIte Backend

Backend API for ResumAIte, a collaborative AI-powered resume builder.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv
- Nodemon

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend folder:
```
PORT=5000
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb://127.0.0.1:27017/resumaite
```

3. Start the server:
```bash
npm run dev
```

---

## Database Entities

### 1. User

| Field | Type | Notes |
|---|---|---|
| name | String | Required |
| email | String | Required, unique |
| password | String | Required, hashed with bcrypt |
| role | String | student, coach, admin |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

### 2. Resume

| Field | Type | Notes |
|---|---|---|
| user | ObjectId | Owner - ref to User |
| title | String | Required |
| fullName | String | Required |
| summary | String | |
| experience | Array | Array of experience objects |
| education | Array | Array of education objects |
| skills | [String] | |
| template | String | Default: modern |
| atsScore | Number | Default: 0 |
| status | String | draft or complete |
| collaborators | Array | Array of collaborator objects |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

Experience entry structure:
```json
{
  "company": "Google",
  "role": "Software Engineer",
  "startDate": "2022-06",
  "endDate": "2024-01",
  "description": "Built backend services."
}
```

Education entry structure:
```json
{
  "institution": "Cairo University",
  "degree": "BSc",
  "field": "Computer Science",
  "startDate": "2018-09",
  "endDate": "2022-06"
}
```

Collaborator entry structure:
```json
{
  "user": "<User ObjectId>",
  "role": "editor",
  "addedAt": "2026-05-11T00:00:00.000Z"
}
```

---

## API Endpoints

### Authentication Routes

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register a new user |
| POST | /api/auth/login | No | Login and receive JWT token |
| GET | /api/auth/me | Yes | Get logged-in user profile |

### Resume Routes

All resume routes require Authorization: Bearer <token> header.

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/resumes | Create a new resume |
| GET | /api/resumes | Get all resumes (owned + shared with you) |
| GET | /api/resumes/:id | Get one resume by ID |
| PUT | /api/resumes/:id | Update resume (owner or editor collaborator) |
| DELETE | /api/resumes/:id | Delete resume (owner only) |

### Collaboration Routes

All collaboration routes require Authorization: Bearer <token> header.

| Method | Endpoint | Who Can Use | Description |
|---|---|---|---|
| POST | /api/resumes/:id/collaborators | Owner only | Invite a user by email |
| GET | /api/resumes/:id/collaborators | Owner + collaborators | List all collaborators |
| PUT | /api/resumes/:id/collaborators/:userId | Owner only | Change a collaborator role |
| DELETE | /api/resumes/:id/collaborators/:userId | Owner or self | Remove a collaborator |

Invite body: { "email": "coach@example.com", "role": "editor" }
Role options: "editor" (read + edit) or "viewer" (read only)

---

## How Collaboration Works

1. A student creates a resume - they become the owner.
2. The student invites a coach using the coach's registered email.
3. The coach can now see the resume in their resume list and open it.
4. If the coach's role is editor, they can update the resume.
5. The owner can change the coach's role or remove them at any time.
6. The coach can remove themselves from the resume.

---

## Middleware

| File | Purpose |
|---|---|
| authMiddleware.js | Verifies JWT token on protected routes |
| loggerMiddleware.js | Logs every request with method, URL, timestamp |
| errorMiddleware.js | Catches 404s and all unhandled server errors |
