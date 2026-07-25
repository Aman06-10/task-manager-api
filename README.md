# Task Manager API

A RESTful Task Manager API built with **Node.js**, **Express.js**, and **PostgreSQL**. The application allows users to register, authenticate using JWT stored in **HttpOnly cookies**, and securely manage their own tasks.

---

## Features

### Authentication

* User Registration
* Automatic Login After Registration
* User Login
* User Logout
* JWT Authentication
* HttpOnly Cookie Authentication
* Password Hashing using bcrypt

### User Management

* Register a New User
* Get the Current User
* Update User Profile
* Delete User Account

### Task Management

* Create a Task
* View All Personal Tasks
* View a Task by ID
* Update a Task
* Delete a Task

### Additional Features

* Search Tasks by Title
* Filter Tasks
* Sort Tasks
* Pagination
* Request Validation
* Ownership-Based Authorization
* Parameterized SQL Queries to Prevent SQL Injection

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT (jsonwebtoken)
* bcrypt
* cookie-parser
* dotenv

---

## Project Structure

```text
task-manager-api/
│
├── controllers/
│   ├── authController.js
│   ├── logoutController.js
│   ├── tasksController.js
│   └── usersController.js
│
├── databases/
│   └── db.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── tasksRoutes.js
│   └── usersRoutes.js
│
├── utils/
│   └── jwt.js
│
├── validators/
│   ├── authValidator.js
│   ├── tasksValidator.js
│   └── usersValidator.js
│
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

### Directory Overview

| Directory        | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| **controllers/** | Contains the business logic for handling API requests.               |
| **databases/**   | PostgreSQL database connection and configuration.                    |
| **middleware/**  | Express middleware for authentication and request processing.        |
| **routes/**      | Defines API endpoints and maps them to their respective controllers. |
| **utils/**       | Utility functions such as JWT generation and verification.           |
| **validators/**  | Validation logic for authentication, users, and tasks.               |

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Aman06-10/task-manager-api.git

cd task-manager-api
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a reference.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=task_manager

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Start the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

---

## Authentication

Authentication is implemented using **JWT stored in HttpOnly cookies**.

After a successful registration or login:

* A JWT is generated.
* The JWT is stored in an HttpOnly cookie.
* The browser automatically sends the cookie with future requests.
* Protected routes verify the JWT before processing incoming requests.

---

## API Endpoints

### Authentication

| Method | Endpoint       | Description                               |
| ------ | -------------- | ----------------------------------------- |
| POST   | `/auth/login`  | Authenticate a user and create a session. |
| POST   | `/auth/logout` | Log out the authenticated user.           |

### Users

| Method | Endpoint    | Description                                          |
| ------ | ----------- | ---------------------------------------------------- |
| POST   | `/users`    | Register a new user.                                 |
| GET    | `/users/me` | Retrieve the currently authenticated user's profile. |
| PATCH  | `/users/me` | Update the authenticated user's profile.             |
| DELETE | `/users/me` | Delete the authenticated user's account.             |

### Tasks

| Method | Endpoint     | Description                                             |
| ------ | ------------ | ------------------------------------------------------- |
| POST   | `/tasks`     | Create a new task.                                      |
| GET    | `/tasks`     | Retrieve all tasks belonging to the authenticated user. |
| GET    | `/tasks/:id` | Retrieve a specific task by its ID.                     |
| PATCH  | `/tasks/:id` | Update a specific task.                                 |
| DELETE | `/tasks/:id` | Delete a specific task.                                 |

The `GET /tasks` endpoint supports:

* Search by title
* Filtering by task attributes
* Sorting
* Pagination

---

## Security

* Passwords are securely hashed using bcrypt.
* Authentication is implemented using JWT.
* JWTs are stored in HttpOnly cookies.
* Parameterized SQL queries protect against SQL injection attacks.
* Incoming requests are validated before processing.
* Users can only view, update, and delete their own tasks.
* User identity is determined from the authenticated JWT rather than client-provided IDs.

---

## Future Improvements

* Refresh Token Authentication
* Centralized Error Handling
* Rate Limiting
* Helmet Security Headers
* CORS Configuration
* Swagger/OpenAPI Documentation
* Unit and Integration Testing
* Role-Based Authorization

---


## Contact

* Author : Aman
* LinkedIn : www.linkedin.com/in/aman-24958137b
* Github : https://github.com/Aman06-10/task-manager-api

---
