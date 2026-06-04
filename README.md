# TaskFlow — Premium Task Management System

A beautiful, modern, full-stack Task Management System featuring collaboration, task assignment, progress status controls, and real-time dashboard analytics.

---

## 📋 Table of Contents
1. [Getting Started & Setup Instructions](#-getting-started--setup-instructions)
2. [Database Schema & ER Diagram](#-database-schema--er-diagram)
3. [API Documentation](#-api-documentation)
4. [Postman Collection Guide](#-postman-collection-guide)

---

## 🚀 Getting Started & Setup Instructions

### Prerequisites
* **Python 3.11+**
* **Node.js 18+**
* **Git**

### Database Configuration
The application is pre-configured to run against a cloud-hosted Neon PostgreSQL database (`taskdb`). If you prefer to run against your local PostgreSQL instance:
1. Create a database named `taskdb`.
2. Open [backend/.env](file:///f:/github/task%20man%20sys/backend/.env) (and modify [backend/.env.example](file:///f:/github/task%20man%20sys/backend/.env.example)).
3. Update `DATABASE_URL` with your local credentials:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/taskdb
   ```

---

### 🔧 Running the Backend

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Set up Python Virtual Environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**:
   * **Windows**: `.\venv\Scripts\activate`
   * **macOS/Linux**: `source venv/bin/activate`

4. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run Alembic Migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Seed Demo Users** (Optional but highly recommended):
   ```bash
   python create_demo_users.py
   ```
   This creates:
   * **Manager**: `demo@example.com` | `Password123`
   * **Employee**: `assignee@example.com` | `Password123`

7. **Start the FastAPI Dev Server**:
   ```bash
   uvicorn app.main:app --port 8000
   ```
   * **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   * **Alternative ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 💻 Running the Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   * **Local App URL**: [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Database Schema & ER Diagram

The database utilizes PostgreSQL and is structured with two main tables: `users` and `tasks` with a 1-to-many relationship mapping creator and assignee roles.

### ER Diagram (Visual)

![TaskFlow ER Diagram](image.png)

### Schema Code (Mermaid)

```mermaid
erDiagram
    users {
        uuid id PK "uuid.uuid4"
        string username UNIQUE "index"
        string email UNIQUE "index"
        string hashed_password "String"
        string full_name "String(100)"
        text profile_picture "Text, NULL"
        boolean is_active "Boolean, Default: True"
        string role "String(20), Default: employee"
        timestamp created_at "DateTime, server_default: now()"
        timestamp updated_at "DateTime, onupdate: now()"
    }
    tasks {
        uuid id PK "uuid.uuid4"
        string title "String(255)"
        text description "Text, NULL"
        string status "Enum(TaskStatus), Default: pending"
        string priority "Enum(TaskPriority), Default: medium"
        timestamp due_date "DateTime, NULL"
        uuid creator_id FK "users.id, CASCADE"
        uuid assignee_id FK "users.id, SET NULL"
        timestamp created_at "DateTime, server_default: now()"
        timestamp updated_at "DateTime, onupdate: now()"
    }

    users ||--o{ tasks : "creates (creator_id)"
    users ||--o{ tasks : "assigned_to (assignee_id)"
```

### Table Details: `users`
* `role`: Determines RBAC capabilities (`manager` or `employee`).
* `profile_picture`: Stores base64-encoded profile images or URL paths.

### Table Details: `tasks`
* `status` (Enum): `pending`, `in_progress`, `completed`, `cancelled`.
* `priority` (Enum): `low`, `medium`, `high`.

---

## 🔌 API Documentation

### 🔐 Authentication

#### 1. Register User
* **Method & Path**: `POST /auth/register`
* **Auth Required**: No
* **Request Body** (`application/json`):
  ```json
  {
    "full_name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirm_password": "SecurePass123",
    "role": "employee"
  }
  ```
* **Success Response** (`201 Created`):
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "employee",
    "profile_picture": null,
    "is_active": true
  }
  ```

#### 2. Login User (OAuth2 Password flow)
* **Method & Path**: `POST /auth/login`
* **Auth Required**: No
* **Request Body** (`application/x-www-form-urlencoded`):
  * `username`: `demo@example.com` (Accepts email)
  * `password`: `Password123`
* **Success Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer"
  }
  ```

---

### 👤 User Endpoints

#### 1. Get All Users
* **Method & Path**: `GET /users`
* **Auth Required**: Yes (Bearer Token)
* **RBAC Requirement**: **Managers Only** (Employees get `403 Forbidden`)
* **Success Response** (`200 OK`):
  ```json
  [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "email": "john@example.com",
      "full_name": "John Doe",
      "role": "employee",
      "profile_picture": null
    }
  ]
  ```

#### 2. Get Current User Profile
* **Method & Path**: `GET /users/me`
* **Auth Required**: Yes (Bearer Token)
* **Success Response** (`200 OK`): Same as Register User response.

#### 3. Update User Profile
* **Method & Path**: `PUT /users/me`
* **Auth Required**: Yes (Bearer Token)
* **Request Body** (`application/json`, all fields optional):
  ```json
  {
    "full_name": "John Updated",
    "username": "johnupdated",
    "email": "johnnew@example.com",
    "profile_picture": "data:image/png;base64,..."
  }
  ```
* **Success Response** (`200 OK`): Updated user profile object.

#### 4. Get My Created Tasks
* **Method & Path**: `GET /users/me/tasks/created`
* **Auth Required**: Yes (Bearer Token)
* **Success Response** (`200 OK`): List of task objects created by the logged-in user.

#### 5. Get My Assigned Tasks
* **Method & Path**: `GET /users/me/tasks/assigned`
* **Auth Required**: Yes (Bearer Token)
* **Success Response** (`200 OK`): List of task objects assigned to the logged-in user.

---

### 📋 Task Endpoints

#### 1. List Tasks
* **Method & Path**: `GET /tasks`
* **Auth Required**: Yes (Bearer Token)
* **Query Parameters (Optional)**:
  * `status`: `pending` | `in_progress` | `completed` | `cancelled`
  * `priority`: `low` | `medium` | `high`
  * `assignee_id`: UUID (Manager only)
* **RBAC & Logic**:
  * **Manager**: Can view all tasks in the system.
  * **Employee**: Can only view tasks assigned to them.
* **Success Response** (`200 OK`): Array of tasks.

#### 2. Create Task
* **Method & Path**: `POST /tasks`
* **Auth Required**: Yes (Bearer Token)
* **RBAC Requirement**: **Managers Only** (Employees get `403 Forbidden`)
* **Request Body** (`application/json`):
  ```json
  {
    "title": "Fix Login Bug",
    "description": "Investigate database session timeout",
    "priority": "high",
    "due_date": "2026-12-31T23:59:59Z",
    "assignee_id": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
* **Success Response** (`201 Created`): Created Task details with generated UUID.

#### 3. Get Task by ID
* **Method & Path**: `GET /tasks/{task_id}`
* **Auth Required**: Yes (Bearer Token)
* **RBAC & Logic**:
  * **Manager**: Can view any task.
  * **Employee**: Can only view the task if assigned to them (otherwise `403 Forbidden`).

#### 4. Update Task (Full Edit)
* **Method & Path**: `PUT /tasks/{task_id}`
* **Auth Required**: Yes (Bearer Token)
* **RBAC Requirement**: **Managers Only** (Must also be the creator of the task).
* **Request Body** (`application/json`): Same structure as Create Task.
* **Success Response** (`200 OK`): Updated Task details.

#### 5. Delete Task
* **Method & Path**: `DELETE /tasks/{task_id}`
* **Auth Required**: Yes (Bearer Token)
* **RBAC Requirement**: **Managers Only** (Must also be the creator of the task).
* **Success Response** (`204 No Content`)

#### 6. Quick Assign Task
* **Method & Path**: `PATCH /tasks/{task_id}/assign`
* **Auth Required**: Yes (Bearer Token)
* **RBAC Requirement**: **Managers Only** (Must also be the creator of the task).
* **Request Body** (`application/json`):
  ```json
  {
    "assignee_id": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

#### 7. Update Task Status
* **Method & Path**: `PATCH /tasks/{task_id}/status`
* **Auth Required**: Yes (Bearer Token)
* **RBAC Requirement**: **Assignee Only** (Only the employee/manager assigned to the task can change its status).
* **Request Body** (`application/json`):
  ```json
  {
    "status": "in_progress"
  }
  ```

---

### 📊 Dashboard Summary

#### 1. Get Dashboard Summary Statistics
* **Method & Path**: `GET /summary`
* **Auth Required**: Yes (Bearer Token)
* **RBAC Requirement**: **Managers Only**
* **Success Response** (`200 OK`):
  ```json
  {
    "total_users": 5,
    "total_tasks": 12,
    "pending_tasks": 4,
    "in_progress_tasks": 5,
    "completed_tasks": 3,
    "tasks_created_by_me": 10,
    "tasks_assigned_to_me": 0
  }
  ```

---

## 📮 Postman Collection Guide

A complete Postman Collection is provided in the repository root as [TaskFlow_API.postman_collection.json](file:///f:/github/task%20man%20sys/TaskFlow_API.postman_collection.json).

### How to Import & Use

1. **Import the Collection**:
   * Open Postman.
   * Click **Import** in the top left.
   * Select and upload the [TaskFlow_API.postman_collection.json](file:///f:/github/task%20man%20sys/TaskFlow_API.postman_collection.json) file.

2. **Collection Variables**:
   The collection uses pre-defined variables:
   * `base_url`: Defaults to `http://127.0.0.1:8000`.
   * `token`: Stored JWT auth token.
   * `task_id`: Tracks the current active task UUID.

3. **Automatic Authentication Setup**:
   * The **Login (get token)** request includes a **Test Script** that automatically parses the JSON response and sets the collection-level `token` variable.
   * All authorized requests under the **Users**, **Tasks**, and **Summary** folders automatically inherit the `Bearer {{token}}` credentials from the collection variables. No manual token copying is required!
