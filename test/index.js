const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3002;
const SECRET_KEY = 'my_secret_key';

app.use(express.static('public'));
app.use(cookieParser());
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const token = jwt.sign({ user: { email, password } }, SECRET_KEY, { expiresIn: '2h' });
        res.cookie('authtoken', token, { httpOnly: true, secure: false, sameSite: 'Strict' });

        return res.status(200).json({ message: "Operation successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/home', async (req, res) => {
    try {
        const token = req.cookies.authtoken;

        if (!token) {
            return res.status(400).json({ error: "Unauthorized operation" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = decoded.user;

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Invalid or expired token" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});