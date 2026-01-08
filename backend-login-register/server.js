const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database: 'db_users'
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO admin (username, email, password) VALUES (?, ?, ?)', 
    [username, email, hashed], (err) => {
        if (err) return res.status(500).json({ message: "Gagal Register/Username sudah ada" });
        res.json({ message: "Registrasi Berhasil! Silakan Login." });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM admin WHERE username = ?', [username], async (err, result) => {
        if (err || result.length === 0 || !(await bcrypt.compare(password, result[0].password))) {
            return res.status(401).json({ message: "Username atau Password Salah" });
        }
        res.json({ message: "Login Berhasil! Selamat datang " + username });
    });
});

app.listen(3001, () => console.log("Auth Service lari di port 3001"));