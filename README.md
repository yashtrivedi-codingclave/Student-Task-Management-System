# Student Task Management System (MERN Stack)

A full-stack web application that lets students register, log in, and manage their
own academic tasks. Every logged-in student can only view and manage **their own**
tasks. Built as a beginner-friendly project for a 45-day MERN Stack training.

---

## Features

- Student registration and secure login (JWT authentication)
- Password hashing with bcryptjs
- Protected frontend routes and protected backend APIs
- Create, read, update and delete tasks (full CRUD)
- Task status (Pending / In Progress / Completed)
- Task priority (Low / Medium / High)
- Due dates with overdue detection
- Search, filter (status & priority) and sort tasks
- Dashboard with statistics and a simple progress bar
- Recent tasks, upcoming deadlines and overdue tasks
- Profile page with basic stats
- Delete confirmation modal
- Toast notifications, loaders and empty states
- Fully responsive UI (mobile, tablet, laptop, desktop)

---

## Technology Stack

**Frontend:** React.js (Vite), React Router DOM, Axios, Tailwind CSS, React Icons,
React Toastify, Context API.

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JSON Web Token, bcryptjs,
dotenv, cors, express-validator.

**Database:** MongoDB Atlas or local MongoDB.

---

## Screenshots

> Add your screenshots here after running the app (Home, Login, Dashboard, Tasks, etc.).
>
> ```
> screenshots/
> ├── home.png
> ├── login.png
> ├── dashboard.png
> └── tasks.png
> ```

---

## Project Structure

```
Student Task Management System/
├── backend/
│   ├── config/db.js
│   ├── controllers/{authController.js, taskController.js}
│   ├── middleware/{authMiddleware.js, errorMiddleware.js}
│   ├── models/{User.js, Task.js}
│   ├── routes/{authRoutes.js, taskRoutes.js}
│   ├── utils/generateToken.js
│   ├── .env, .gitignore, package.json, server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/axiosInstance.js
│   │   ├── components/  (Navbar, Sidebar, ProtectedRoute, TaskCard, TaskForm,
│   │   │                 StatCard, Loader, EmptyState, ConfirmModal)
│   │   ├── context/AuthContext.jsx
│   │   ├── layouts/DashboardLayout.jsx
│   │   ├── pages/  (Home, Register, Login, Dashboard, Tasks, AddTask,
│   │   │            EditTask, TaskDetails, Profile, NotFound)
│   │   ├── services/{authService.js, taskService.js}
│   │   ├── utils/formatDate.js
│   │   ├── App.jsx, main.jsx, index.css
│   ├── .env, .gitignore, package.json, vite.config.js,
│   │   tailwind.config.js, postcss.config.js, index.html
│
├── postman_collection.json
└── README.md
```

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> `.env` files are ignored by git. Use the provided `.env.example` files as a template.

---

## Installation & Setup

You need **Node.js**, **npm**, and **MongoDB** (local or an Atlas connection string).

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

---

## API Endpoints

Base URL: `/api`

### Authentication

| Method | Endpoint             | Description                | Protected |
| ------ | -------------------- | -------------------------- | --------- |
| POST   | `/api/auth/register` | Register a new student     | No        |
| POST   | `/api/auth/login`    | Log in a student           | No        |
| GET    | `/api/auth/profile`  | Get logged-in user profile | Yes       |

### Tasks (all protected)

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| POST   | `/api/tasks`             | Create a task             |
| GET    | `/api/tasks`             | Get all of the user's tasks |
| GET    | `/api/tasks/:id`         | Get a single task         |
| PUT    | `/api/tasks/:id`         | Update a task             |
| DELETE | `/api/tasks/:id`         | Delete a task             |
| PATCH  | `/api/tasks/:id/status`  | Update only the status    |

**Query parameters for `GET /api/tasks`:**
`?status=Pending` · `?priority=High` · `?search=react` · `?sort=dueDate`

Protected requests must include the header:
`Authorization: Bearer <JWT_TOKEN>`

---

## Postman Collection

Import `postman_collection.json` into Postman.

1. Set the `baseUrl` variable (default `http://localhost:5000/api`).
2. Run **Register** or **Login** and copy the returned `token`.
3. Paste it into the collection's `token` variable.
4. All protected requests use `Authorization: Bearer {{token}}`.

---

## Manual Testing Checklist

**Authentication**
- Register with valid details / existing email / invalid email / mismatched passwords
- Login with correct and incorrect credentials
- Access a protected page without a token (should redirect to login)
- Logout

**Tasks**
- Create a task (and with missing fields)
- View all tasks / a single task
- Edit a task / delete a task / change status
- Search and filter tasks
- Confirm overdue badge appears correctly
- Confirm one user cannot access another user's tasks

---

## Deployment

- **Frontend:** Vercel or Netlify
- **Backend:** Render or Railway
- **Database:** MongoDB Atlas

After deploying:
1. Add the deployed frontend URL to the backend `CLIENT_URL` (CORS).
2. Add the deployed backend API URL to the frontend `VITE_API_URL`.
3. Test registration, login and task operations on the live app.

---

## Demo Login Credentials

- **Email:** demo@example.com
- **Password:** 123456

> Re-seed anytime from the backend folder: `npm run seed`

---

## Repository & Live Links

- Frontend repository: _add link_
- Backend repository: _add link_
- Live frontend URL: _add link_
- Live backend API URL: _add link_

---

## Author

- **Name:** _Your name_
- **Training:** 45-Day MERN Stack Training

---

## License

This project is released under the MIT License.
