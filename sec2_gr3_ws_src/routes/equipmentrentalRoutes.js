// ไฟล์: routes/equipmentrentalRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // เรียกใช้ db.js

// --- 1. GET /equipment-rentals (Search) ---
router.get('/equipment-rentals', (req, res) => {
    const { username, equipmentName, status } = req.query;
    let sql = `
        SELECT 
            ER.EquipmentRental_ID,
            U.username,
            E.Name AS EquipmentName,
            ER.Status
        FROM EquipmentRental ER
        JOIN users U ON ER.User_ID = U.User_ID
        JOIN Equipment E ON ER.Equipment_ID = E.Equipment_ID
        WHERE 1=1
    `;
    const searchParams = [];
    if (username) {
        sql += " AND U.username LIKE ?";
        searchParams.push(`%${username}%`);
    }
    if (equipmentName) {
        sql += " AND E.Name LIKE ?";
        searchParams.push(`%${equipmentName}%`);
    }
    if (status) {
        sql += " AND ER.Status LIKE ?";
        searchParams.push(`%${status}%`);
    }
    sql += " ORDER BY ER.RentalStartDateTime ASC"; // (แก้จาก ASC เป็น DESC ให้ข้อมูลใหม่สุดอยู่บน)
    db.query(sql, searchParams, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
        res.json(results);
    });
});

// --- 2. GET /equipment-rentals/:id (Get Single) ---
router.get('/equipment-rentals/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM EquipmentRental WHERE EquipmentRental_ID = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Rental not found' });
        res.json(results[0]);
    });
});

// --- 3. GET /equipment-rentals/:id/payments ---
router.get('/equipment-rentals/:id/payments', (req, res) => {
    const rentalId = req.params.id;
    const sql = 'SELECT * FROM PaymentEquipmentRental WHERE EquipmentRental_ID = ? ORDER BY PaymentDate DESC';
    db.query(sql, [rentalId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
        res.json(results);
    });
});

// --- 4. POST /equipment-rentals (Create) ---
router.post('/equipment-rentals', (req, res) => {
    let { User_ID, Equipment_ID, Quantity, RentalStartDateTime, RentalEndDateTime, ReturnDateTime, Status } = req.body;
    if (ReturnDateTime === '') {
        ReturnDateTime = null;
    }
    db.query('SELECT MAX(EquipmentRental_ID) as maxId FROM EquipmentRental', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        let newRentalId = 'ER000001';
        if (results[0].maxId) {
            const currentMax = parseInt(results[0].maxId.substring(2));
            const nextId = currentMax + 1;
            newRentalId = 'ER' + nextId.toString().padStart(6, '0');
        }
        const sql = `INSERT INTO EquipmentRental 
                     (EquipmentRental_ID, User_ID, Equipment_ID, Quantity, RentalStartDateTime, RentalEndDateTime, ReturnDateTime, Status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [newRentalId, User_ID, Equipment_ID, Quantity, RentalStartDateTime, RentalEndDateTime, ReturnDateTime, Status];
        db.query(sql, values, (insertErr) => {
            if (insertErr) {
                return res.status(500).json({ success: false, message: 'เพิ่มข้อมูลไม่สำเร็จ: ' + insertErr.message });
            }
            res.json({ success: true, message: 'เพิ่มข้อมูลการเช่าสำเร็จ' });
        });
    });
});


// ---  5. PUT /equipment-rentals/:id (Update) ---
router.put('/equipment-rentals/:id', (req, res) => {
    const id = req.params.id;
    
    // 1. รับค่า User_ID, Equipment_ID และ Status
    const { User_ID, Equipment_ID, Status } = req.body; 

    // 2. อัปเดต SQL 
    const sql = `UPDATE EquipmentRental SET 
                    User_ID = ?, 
                    Equipment_ID = ?, 
                    Status = ? 
                 WHERE EquipmentRental_ID = ?`;
    
    // 3. อัปเดต Values
    const values = [User_ID, Equipment_ID, Status, id];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Update failed: ' + err.message });
        res.json({ success: true, message: 'Rental updated successfully' });
    });
});



// --- 6. DELETE /equipment-rentals/:id (Delete) ---
router.delete('/equipment-rentals/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM EquipmentRental WHERE EquipmentRental_ID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Cannot delete (Foreign Key constraint)' });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    });
});

module.exports = router;