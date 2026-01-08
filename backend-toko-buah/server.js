const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// 1. Perbaikan Koneksi: Tambahkan callback connect untuk memastikan DB siap
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'db_toko'
});

db.connect((err) => {
    if (err) {
        console.error("Gagal terhubung ke Database Toko:", err);
    } else {
        console.log("Koneksi Database db_toko Berhasil!");
    }
});

// [READ] Ambil data
app.get('/buah', (req, res) => {
    db.query('SELECT * FROM buah', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// [CREATE] Tambah data
app.post('/buah', (req, res) => {
    const { nama_buah, stok } = req.body;
    db.query('INSERT INTO buah (nama_buah, stok) VALUES (?, ?)', [nama_buah, stok], (err) => {
        if (err) return res.status(500).json({ message: "Gagal menambah data" });
        res.json({ message: "Buah ditambahkan" });
    });
});

// 2. PERBAIKAN UPDATE: Pastikan Parameter ID dan Stok diproses dengan benar
app.put('/buah/:id', (req, res) => {
    const { nama_buah, stok } = req.body;
    const { id } = req.params; // Mengambil ID dari URL agar spesifik baris mana yang diubah

    // Menggunakan query terstruktur dengan error handling
    db.query('UPDATE buah SET nama_buah = ?, stok = ? WHERE id = ?', [nama_buah, stok, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Gagal mengupdate database" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        res.json({ message: "Data diperbarui" });
    });
});

// [DELETE] Hapus data
app.delete('/buah/:id', (req, res) => {
    db.query('DELETE FROM buah WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Buah dihapus" });
    });
});

app.listen(3002, () => console.log("Toko Service lari di port 3002"));