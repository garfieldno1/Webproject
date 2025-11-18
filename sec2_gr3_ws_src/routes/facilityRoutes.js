const express = require('express');
const router = express.Router();
const db = require('../db'); 


// 1.1 Testing GET Facility (Admin Search)
// method: get
// URL: http://localhost:3000/api/facilities

// 1.2 Testing GET Facility (Admin Search)
// method: get
// URL: http://localhost:3000/api/facilities?name=&type=Football&status=Available


// --- 1. GET: ค้นหาและดึงข้อมูล Facility (Search) ---
router.get('/facilities', (req, res) => {
    const { name, type, status } = req.query;
    
    // เริ่มต้น SQL
    let sql = 'SELECT * FROM Facility WHERE 1=1';
    const params = [];

    // เงื่อนไขการค้นหา (ถ้ามี)
    if (name) {
        sql += ' AND Name LIKE ?';
        params.push(`%${name}%`);
    }
    if (type) {
        sql += ' AND Type LIKE ?';
        params.push(`%${type}%`);
    }
    if (status) {
        sql += ' AND Status LIKE ?';
        params.push(`%${status}%`);
    }

    sql += ' ORDER BY Facility_ID ASC';

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching facilities:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json(results);
    });
});


// 2.1 Testing Add Facility
// method: post
// URL: http://localhost:3000/api/facilities
// body: raw JSON
// 
//{
//    "Name": "Olympic Pool 1",
//    "Type": "Swimming",
//    "Description": "Standard 50m Olympic pool",
//    "Capacity": 50,
//    "OpenTime": "07:00:00",
//    "CloseTime": "20:00:00",
//    "PricePerHour": 200,
//    "Status": "Maintenance"
//}
//

// 2.2 Testing Add Facility
// method: post
// URL: http://localhost:3000/api/facilities
// body: raw JSON
// 
//{
//    "Name": "Football Field 4",
//    "Type": "Football",
//    "Description": "Premium artificial turf",
//    "Capacity": 22,
//    "OpenTime": "06:00:00",
//    "CloseTime": "22:00:00",
//    "PricePerHour": 800,
//    "Status": "Available"
//}
//

// --- 2. POST: เพิ่ม Facility ใหม่ (Auto Generate ID) ---
router.post('/facilities', (req, res) => {
    const { Name, Type, Description, Capacity, OpenTime, CloseTime, PricePerHour, Status } = req.body;

    db.query('SELECT MAX(Facility_ID) as maxId FROM Facility', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        let newId = 'F0000001';
        if (results[0].maxId) {
            const currentMax = parseInt(results[0].maxId.substring(1));
            const nextId = currentMax + 1;
            newId = 'F' + nextId.toString().padStart(7, '0');
        }

        const sql = `INSERT INTO Facility (Facility_ID, Name, Type, Description, Capacity, OpenTime, CloseTime, PricePerHour, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [newId, Name, Type, Description, Capacity, OpenTime, CloseTime, PricePerHour, Status];

        db.query(sql, values, (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Insert failed: ' + err.message });
            res.json({ success: true, message: 'Facility added successfully', id: newId });
        });
    });
});


// 3.1 Testing DELETE Facility
// method: delete
// URL: http://localhost:3000/api/facilities/F0000010


// 3.2 Testing DELETE Facility
// method: delete
// URL: http://localhost:3000/api/facilities/F0000011



// --- 3. DELETE: ลบ Facility ---
router.delete('/facilities/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Facility WHERE Facility_ID = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Cannot delete (Foreign Key constraint)' });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Data not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    });
});


// 4.1 Testing GET Facility by ID (For edit , delete)
// method: get
// URL: http://localhost:3000/api/facilities/F0000001

// 4.2 Testing GET Facility by ID (For edit , delete)
// method: get
// URL: http://localhost:3000/api/facilities/F0000002

// --- 4. GET: ดึงข้อมูล Facility 1 แห่ง (By ID) สำหรับหน้า Edit ---
router.get('/facilities/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM Facility WHERE Facility_ID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.json(results[0]);
    });
});


// 5.1 Testing Update Facility
// method: put
// URL: http://localhost:3000/api/facilities/F0000001
// body: raw JSON
// 
//{
//    "Name": "Football Field 1 (Renovated)",
//    "Type": "Football",
//    "Description": "Newly renovated grass field with lights",
//    "Capacity": 30,
//    "OpenTime": "05:00:00",
//   "CloseTime": "23:00:00",
//    "PricePerHour": 650,
//    "Status": "In Use"
//}
//

// 5.2 Testing Update Facility
// method: put
// URL:http://localhost:3000/api/facilities/F0000004 
// body: raw JSON
// 
//{
//    "Name": "Badminton Court 1 (VIP)",
//    "Type": "Badminton",
//    "Description": "Air-conditioned indoor court",
//    "Capacity": 4,
//    "OpenTime": "09:00:00",
//    "CloseTime": "21:00:00",
//    "PricePerHour": 450,
//    "Status": "Closed"
//}
//

// --- 5. PUT: แก้ไขข้อมูล Facility ---
router.put('/facilities/:id', (req, res) => {
    const id = req.params.id;
    const { Name, Type, Description, Capacity, OpenTime, CloseTime, PricePerHour, Status } = req.body;

    const sql = `UPDATE Facility SET Name=?, Type=?, Description=?, Capacity=?, OpenTime=?, CloseTime=?, PricePerHour=?, Status=? WHERE Facility_ID=?`;
    const values = [Name, Type, Description, Capacity, OpenTime, CloseTime, PricePerHour, Status, id];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Update failed: ' + err.message });
        res.json({ success: true, message: 'Facility updated successfully' });
    });
});

module.exports = router;