// ไฟล์: routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // เรียกใช้ db.js

// --- 1. GET /bookings (Search) ---
router.get('/bookings', (req, res) => {
    // รับค่า query params
    const { username, facilityName, status } = req.query;

    // นี่คือ SQL หลักที่ JOIN 3 ตาราง
    let sql = `
        SELECT 
            B.Booking_ID, 
            U.username, 
            F.Name AS FacilityName, 
            B.Status
        FROM Booking B
        JOIN users U ON B.User_ID = U.User_ID
        JOIN Facility F ON B.Facility_ID = F.Facility_ID
        WHERE 1=1
    `;
    
    const searchParams = [];

    if (username) {
        sql += " AND U.username LIKE ?";
        searchParams.push(`%${username}%`);
    }
    if (facilityName) {
        sql += " AND F.Name LIKE ?";
        searchParams.push(`%${facilityName}%`);
    }
    if (status) {
        sql += " AND B.Status LIKE ?";
        searchParams.push(`%${status}%`);
    }

    sql += " ORDER BY B.BookingDateTime ASC";

    db.query(sql, searchParams, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
        res.json(results);
    });
});

// --- 2. GET /bookings/:id (Get Single) ---
router.get('/bookings/:id', (req, res) => {
    const id = req.params.id;
    // เราจะ SELECT ข้อมูลดิบจากตาราง Booking
    const sql = 'SELECT * FROM Booking WHERE Booking_ID = ?';

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Booking not found' });
        res.json(results[0]);
    });
});

// --- 🔥 เพิ่มใหม่: GET /bookings/:id/payments ---
// (ดึงข้อมูล Payment ทั้งหมดที่เกี่ยวกับ Booking ID นี้)
router.get('/bookings/:id/payments', (req, res) => {
    const bookingId = req.params.id;
    
    // เลือกทุกคอลัมน์จากตาราง PaymentBooking
    const sql = 'SELECT * FROM PaymentBooking WHERE Booking_ID = ? ORDER BY PaymentDate ASC';

    db.query(sql, [bookingId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
        // หน้านี้จะส่งข้อมูลกลับไปเป็น Array (เพราะ 1 booking อาจมีหลาย payment)
        res.json(results);
    });
});
// --- (จบส่วนที่เพิ่มใหม่) ---


// --- 3. POST /bookings (Create) ---
// (โค้ดเดิมของคุณ)
router.post('/bookings', (req, res) => {
    // ดึงข้อมูลจาก Form
    const { User_ID, Facility_ID, BookingDateTime, StartDateTime, EndDateTime, Status } = req.body;

    // สร้าง Booking_ID ใหม่ (เช่น B0000001)
    db.query('SELECT MAX(Booking_ID) as maxId FROM Booking', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        let newBookingId = 'B0000001';
        if (results[0].maxId) {
            const currentMax = parseInt(results[0].maxId.substring(1));
            const nextId = currentMax + 1;
            newBookingId = 'B' + nextId.toString().padStart(7, '0');
        }

        const sql = `INSERT INTO Booking 
                     (Booking_ID, User_ID, Facility_ID, BookingDateTime, StartDateTime, EndDateTime, Status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [newBookingId, User_ID, Facility_ID, BookingDateTime, StartDateTime, EndDateTime, Status];

        db.query(sql, values, (insertErr) => {
            if (insertErr) {
                return res.status(500).json({ success: false, message: 'เพิ่มข้อมูลไม่สำเร็จ: ' + insertErr.message });
            }
            res.json({ success: true, message: 'เพิ่ม Booking สำเร็จ' });
        });
    });
});

// --- 4. PUT /bookings/:id (Update) ---
// (โค้ดเดิมของคุณ)
router.put('/bookings/:id', (req, res) => {
    const id = req.params.id;
   const { User_ID, Facility_ID, StartDateTime, EndDateTime, Status } = req.body;

   const sql = `UPDATE Booking SET 
                    User_ID = ?,
                    Facility_ID = ?,
                    StartDateTime = ?, 
                    EndDateTime = ?, 
                    Status = ? 
                 WHERE Booking_ID = ?`;
    
    const values = [User_ID, Facility_ID, StartDateTime, EndDateTime, Status, id];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Update failed: ' + err.message });
        res.json({ success: true, message: 'Booking updated successfully' });
    });
});

// --- 5. DELETE /bookings/:id (Delete) ---
// (โค้ดเดิมของคุณ)
router.delete('/bookings/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM Booking WHERE Booking_ID = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Cannot delete (Foreign Key constraint)' });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    });
});

module.exports = router;