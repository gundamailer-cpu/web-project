const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'password123',
    database: 'web_project_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', (req, res) => {
    res.send('백엔드 서버 정상 작동 중');
});

app.get('/api/posts', (req, res) => {
    db.query("SELECT * FROM posts ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    db.query("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)", [title, content, author], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "글 작성 성공!" });
    });
});
app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM posts WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "글 삭제 성공!" });
    });
});
app.listen(5000, () => console.log('백엔드 서버 작동 중 (포트 5000)'));