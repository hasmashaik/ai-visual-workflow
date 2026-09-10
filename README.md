#  VisualForge AI

<div align="center">

### Create. Review. Approve. Deliver.

**AI-powered product visual production workflow platform for e-commerce teams**

</div>

---

##  Overview

VisualForge AI is a full-stack web application that streamlines the product visual creation workflow using AI.

It enables product teams to **generate, review, approve, and deliver** high-quality product visuals efficiently.

---

##  Key Features

*  **Authentication** — Secure JWT-based authentication with 24-hour session expiry
*  **Project Management** — Create, edit, delete, and archive projects
*  **Product Management** — Manage products within projects with SKU and categories
*  **Asset Library** — Upload, preview, and manage product images
*  **AI Generation** — Generate product visuals using AI with mock mode support
*  **Review System** — Approve, reject, or request revisions for generated images
*  **Analytics Dashboard** — Track project metrics and generation activity
*  **History Timeline** — Complete activity log of user actions

---

##  Technology Stack

### Frontend

| Technology      | Version | Purpose                         |
| --------------- | ------- | ------------------------------- |
| Next.js         | 14.0.4  | React framework with App Router |
| React           | 18.2.0  | UI library                      |
| TypeScript      | 5.3.3   | Type safety                     |
| Tailwind CSS    | 3.3.6   | Styling                         |
| React Hook Form | 7.48.2  | Form handling                   |
| Zod             | 3.22.4  | Schema validation               |
| Axios           | 1.6.2   | HTTP client                     |
| Lucide React    | 0.294.0 | Icons                           |
| Sonner          | 1.3.1   | Toast notifications             |

### Backend

| Technology | Version | Purpose        |
| ---------- | ------- | -------------- |
| Node.js    | 18+     | Runtime        |
| Express.js | 4.18.2  | API framework  |
| TypeScript | 5.3.3   | Type safety    |
| Prisma     | 5.7.0   | ORM            |
| PostgreSQL | -       | Database       |
| JWT        | -       | Authentication |
| Cloudinary | -       | Image storage  |
| Multer     | -       | File upload    |

---

##  Project Structure

```text
visualforge-ai/
│
├── frontend/                         # Next.js frontend
│   ├── app/
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   │
│   │   ├── (dashboard)/              # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── generate/
│   │   │   ├── assets/
│   │   │   ├── reviews/
│   │   │   ├── history/
│   │   │   └── settings/
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── lib/
│   │   └── api.ts                    # API client
│   │
│   ├── middleware.ts                 # Authentication middleware
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── cloudinary.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── projectController.ts
│   │   │   ├── imageController.ts
│   │   │   └── generationController.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── upload.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   ├── imageRoutes.ts
│   │   │   └── generationRoutes.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm or yarn
* PostgreSQL database — Neon recommended
* Cloudinary account

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/visualforge-ai.git
cd visualforge-ai
```

### 2. Install Dependencies

```bash
npm run install:all
```

---

##  Environment Variables

### Backend

Create a `.env` file inside the `backend` folder:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
CLIENT_URL="http://localhost:3000"
PORT=5000

# AI Mode
AI_MODE="mock"
```

### Frontend

Create `.env.local` inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

>  Never commit `.env` or `.env.local` files to GitHub.

---

## 🗄️ Database Setup

Navigate to the backend:

```bash
cd backend
```

Generate the Prisma client:

```bash
npx prisma generate
```

Push the schema to the database:

```bash
npx prisma db push
```

Open Prisma Studio:

```bash
npx prisma studio
```

Prisma Studio will be available at:

```text
http://localhost:5555
```

---

##  Running Locally

### Start Both Frontend & Backend

From the project root:

```bash
npm run dev
```

### Start Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:3000
```

### API

```text
http://localhost:5000/api
```

---

##  Application Flow

### 1. Authentication Flow

```text
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Sign Up   │ ───▶ │    Login    │ ───▶ │  Dashboard  │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                   JWT Token (24hr expiry)
                            │
                            ▼
                  HTTP-only Cookie
```

### 2. Project Workflow

```text
┌─────────────────┐
│  Create Project │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Add Products   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Upload Images  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Generation  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Review System  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Final Delivery │
└─────────────────┘
```

### 3. AI Generation Flow

```text
Upload Product
      │
      ▼
Select Project
      │
      ▼
Select Product
      │
      ▼
Enter Prompt
      │
      ▼
Generate AI Visual
      │
      ▼
Save Asset
      │
      ▼
Review Asset
      │
      ▼
Approve / Reject
      │
      ▼
Deliver
```

---

##  Authentication & Security

### Login Flow

1. User submits email and password
2. Backend validates credentials
3. JWT token is generated with 24-hour expiry
4. Token is stored in an HTTP-only cookie
5. User is redirected to the dashboard

### Session Expiry

When the JWT expires:

1. Protected APIs return `401`
2. Frontend clears authentication state
3. User is redirected to the login page
4. User sees a session-expired message

### Security Features

*  Bcrypt password hashing
*  JWT authentication
*  HTTP-only cookies
*  24-hour session expiry
*  CORS configuration
*  Helmet security headers
*  Rate limiting
*  Zod request validation
*  File type and size validation
*  Authorization middleware
*  Resource ownership checks

---

## 📡 API Documentation

### Authentication Routes

| Method | Endpoint             | Description       | Auth |
| ------ | -------------------- | ----------------- | ---- |
| `POST` | `/api/auth/register` | Register new user | ❌    |
| `POST` | `/api/auth/login`    | Login user        | ❌    |
| `POST` | `/api/auth/logout`   | Logout user       | ✅    |
| `GET`  | `/api/auth/me`       | Get current user  | ✅    |

### Project Routes

| Method   | Endpoint            | Description      | Auth |
| -------- | ------------------- | ---------------- | ---- |
| `GET`    | `/api/projects`     | Get all projects | ✅    |
| `POST`   | `/api/projects`     | Create project   | ✅    |
| `PUT`    | `/api/projects/:id` | Update project   | ✅    |
| `DELETE` | `/api/projects/:id` | Delete project   | ✅    |

### Image Routes

| Method   | Endpoint             | Description    | Auth |
| -------- | -------------------- | -------------- | ---- |
| `GET`    | `/api/images`        | Get all images | ✅    |
| `POST`   | `/api/images/upload` | Upload image   | ✅    |
| `DELETE` | `/api/images/:id`    | Delete image   | ✅    |

### Generation Routes

| Method | Endpoint           | Description      | Auth |
| ------ | ------------------ | ---------------- | ---- |
| `POST` | `/api/generations` | Generate visuals | ✅    |
| `GET`  | `/api/generations` | Get generations  | ✅    |

---

##  Design System

### Colors

| Role                 | Hex       |
| -------------------- | --------- |
| Primary Background   | `#070A12` |
| Secondary Background | `#0D111C` |
| Card Background      | `#111827` |
| Elevated Card        | `#151D2E` |
| Primary Accent       | `#7C3AED` |
| Secondary Accent     | `#06B6D4` |
| Primary Text         | `#F8FAFC` |
| Secondary Text       | `#94A3B8` |
| Muted Text           | `#64748B` |
| Border               | `#1E293B` |
| Input Background     | `#0B1220` |

### Typography

* **Font:** Inter
* **Headings:** Bold / Semibold
* **Body:** Regular
* **Labels:** Medium
* **Buttons:** Medium / Semibold

---

##  Services Setup

### Cloudinary

1. Create a Cloudinary account
2. Get your Cloud Name
3. Get your API Key
4. Get your API Secret
5. Add them to `backend/.env`

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Neon PostgreSQL

1. Create a Neon account
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add it to `backend/.env`

```env
DATABASE_URL="your-neon-connection-string"
```

---

##  AI Configuration

VisualForge AI supports two AI modes.

### Mock Mode

No AI API key is required.

```env
AI_MODE="mock"
```

Mock mode:

* Simulates AI generation
* Returns demo results
* Useful for development and testing

### Real Mode

For actual AI generation:

```env
AI_MODE="real"
AI_API_KEY="your-ai-api-key"
```

---

## Review Workflow

VisualForge AI includes a complete review pipeline.

### How It Works

1. **Generate** an image from the Generate page
2. A **review record** is automatically created with `PENDING` status
3. Go to **Reviews** to approve, reject, or request revisions
4. Each action is logged and displayed in **History**

### Review States

| Status               | Meaning            | Action                   |
| -------------------- | ------------------ | ------------------------ |
| `PENDING`            | Waiting for review | Default after generation |
| `APPROVED`           | Ready to use       | Mark as final            |
| `REJECTED`           | Discarded          | Remove from workflow     |
| `REVISION_REQUESTED` | Needs changes      | Add revision comment     |

### Current Scope

* Single-user review workflow
* Filter reviews by status
* Comments on revisions
* Complete activity log

### Future Enhancements

* [ ] Multi-user roles — Creator / Reviewer
* [ ] Email notifications via Resend
* [ ] Bulk approve / reject
* [ ] Slack integration

---

##  Database Schema

```text
User
 │
 ├── Project
 │    │
 │    └── Image
 │         │
 │         └── Review
 │
 └── Activity

Image
 │
 └── Activity
```

### Database Models

| Model        | Purpose                            |
| ------------ | ---------------------------------- |
| **User**     | Account owner                      |
| **Project**  | Groups related images              |
| **Image**    | Stores Cloudinary URL and metadata |
| **Review**   | Approval workflow state            |
| **Activity** | Audit log for the History page     |

---

##  Deployment

### Frontend — Vercel

Build the frontend:

```bash
cd frontend
npm run build
```

Then deploy the `frontend` application to Vercel.

### Backend — Render / Railway

Build the backend:

```bash
cd backend
npm run build
```

Then deploy the backend to your preferred hosting platform.

Make sure all required environment variables are configured in the deployment platform.

---

##  Contributing

Contributions are welcome.

### Steps

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m "Add AmazingFeature"

# Push the branch
git push origin feature/AmazingFeature
```

Then open a Pull Request.

---

## Recent Implementation

The review workflow includes:

* `Review` database model and relations
* Automatic review creation after image generation
* Review CRUD operations
* Review API routes
* Review filtering and status counts
* Approve / Reject / Revision actions
* Activity history integration

---

##  License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

##  Author

**Your Name**

GitHub: `@yourusername`

LinkedIn: `Your Name`

---

<div align="center">

### Made with ❤️ by VisualForge AI Team

</div>
