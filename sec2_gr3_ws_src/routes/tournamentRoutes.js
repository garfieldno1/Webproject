// ไฟล์: routes/tournamentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // เรียกใช้ db.js

// --- 1. GET /tournaments (Search) ---
router.get('/tournaments', (req, res) => {
    const { name, type, status } = req.query;

    // 🔥 แก้ไข 1: Tournaments -> Tournament
    let sql = 'SELECT Tournament_ID, Name, SportType, Status FROM Tournament WHERE 1=1';
    const searchParams = [];

    if (name) {
        sql += " AND Name LIKE ?";
        searchParams.push(`%${name}%`);
    }
    if (type) {
        sql += " AND SportType LIKE ?";
        searchParams.push(`%${type}%`);
    }
    if (status) {
        sql += " AND Status LIKE ?";
        searchParams.push(`%${status}%`);
    }

    sql += " ORDER BY Tournament_ID ASC"; 

    db.query(sql, searchParams, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json(results);
    });
});

// --- 2. GET /tournaments/:id (Get Single) ---
router.get('/tournaments/:id', (req, res) => {
    const id = req.params.id;
    // 🔥 แก้ไข 2: Tournaments -> Tournament
    const sql = 'SELECT * FROM Tournament WHERE Tournament_ID = ?';

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Tournament not found' });
        res.json(results[0]);
    });
});

// --- 3. POST /tournaments (Create) ---
router.post('/tournaments', (req, res) => {
    const { Name, SportType, StartDate, EndDate, RegistrationDeadline, Participants, Status } = req.body;

    // 🔥 แก้ไข 3: Tournaments -> Tournament
    db.query('SELECT MAX(Tournament_ID) as maxId FROM Tournament', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        let newTournamentId = 'T0000001';
        if (results[0].maxId) {
            const currentMax = parseInt(results[0].maxId.substring(1));
            const nextId = currentMax + 1;
            newTournamentId = 'T' + nextId.toString().padStart(7, '0');
        }

        // 🔥 แก้ไข 4: Tournaments -> Tournament
        const sql = `INSERT INTO Tournament 
                     (Tournament_ID, Name, SportType, StartDate, EndDate, RegistrationDeadline, Participants, Status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [newTournamentId, Name, SportType, StartDate, EndDate, RegistrationDeadline, Participants, Status];

        db.query(sql, values, (insertErr) => {
            if (insertErr) {
                return res.status(500).json({ success: false, message: 'เพิ่มข้อมูลไม่สำเร็จ: ' + insertErr.message });
            }
            res.json({ success: true, message: 'เพิ่ม Tournament สำเร็จ' });
        });
    });
});

// --- 4. PUT /tournaments/:id (Update) ---
router.put('/tournaments/:id', (req, res) => {
    const id = req.params.id;
    const { Name, SportType, StartDate, EndDate, RegistrationDeadline, Participants, Status } = req.body;

    // 🔥 แก้ไข 5: Tournaments -> Tournament
 // 🔥 แก้ไขที่ 2: เขียน SQL ใหม่ให้ SET ทุกคอลัมน์
    const sql = `UPDATE Tournament SET 
                    Name = ?, 
                    SportType = ?, 
                    StartDate = ?, 
                    EndDate = ?, 
                    RegistrationDeadline = ?, 
                    Participants = ?, 
                    Status = ? 
                 WHERE Tournament_ID = ?`;
    
    // 🔥 แก้ไขที่ 3: เพิ่มค่าทั้งหมดลงใน Values array (เรียงตามลำดับ ?)
    const values = [Name, SportType, StartDate, EndDate, RegistrationDeadline, Participants, Status, id];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Update failed' });
        res.json({ success: true, message: 'Tournament updated successfully' });
    });
});

// --- 5. DELETE /tournaments/:id (Delete) ---
router.delete('/tournaments/:id', (req, res) => {
    const id = req.params.id;
    // 🔥 แก้ไข 6: Tournaments -> Tournament (มี 2 ที่ในไฟล์ แต่คุณมี 5)
    const sql = 'DELETE FROM Tournament WHERE Tournament_ID = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Cannot delete (Foreign Key constraint)' });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    });
});

module.exports = router;    