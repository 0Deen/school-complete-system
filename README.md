
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
