
# Simba Systems

Simba Systems is a full-stack school management system built using **React.js** for the frontend and **Node.js + Express.js + MongoDB** for the backend. It offers features such as account management, employee records, events, inventory, and more.

---

## 🧱 Project Structure

```
Simba-Systems-main/
│
├── .gitignore
├── package.json
├── .vscode/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── frontend/
    ├── public/
    └── src/
        ├── assets/
        ├── components/
        ├── pages/
        ├── App.js
        └── index.js
```

---

## 🚀 Features

- User Authentication (JWT)
- Student and Employee Management
- Event Scheduling
- Inventory Tracking
- Payroll Management
- Class and Subject Management
- Fee and Payment Records
- Notification System

---

## 🛠️ Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/simba
JWT_SECRET=your_jwt_secret
```

4. Start the server:

```bash
npm start
```

The backend should now be running at `http://localhost:5000`.

---

## 🖥️ Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend should now be running at `http://localhost:3000`.

---

## 🌐 Connecting Frontend to Backend

In `frontend/src/config.js` (or directly in services or axios setup), ensure API base URL points to the backend:

```js
const API_BASE_URL = "http://localhost:5000/api";
```

Use this for making all API requests using Axios or Fetch.

---

## 🗃️ Database

This system uses MongoDB. Ensure you have MongoDB running locally or in the cloud.

To start MongoDB locally:

```bash
mongod
```

---

## 📦 API Overview

Each route in `/backend/routes` maps to a controller:

- `/api/accounts` → `accountController.js`
- `/api/employees` → `employeeController.js`
- `/api/events` → `eventController.js`
- `/api/inventory` → `inventoryController.js`
- and more...

---

## 🔒 Authentication

Implemented using JWT:
- Login returns a token.
- Protected routes require the token in `Authorization: Bearer <token>` header.

Middleware is located in `backend/middleware/auth.js`.

---

## 🧪 Testing

Use Postman or Insomnia to test backend APIs. Ensure token is included for protected routes.

---

## 📄 License

This project is licensed for educational and institutional use only.

---

## 👨‍💻 Author

Kiprotich Kipchumba  
[GitHub](https://github.com/0Deen) | [Portfolio](https://portfolio-01-u3hl.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/kipchumba-kiprotich-2b10b5279/)
