// ไฟล์: routes/searchingfacilityRoutes.js
const express = require('express');
const router = express.Router();
const dbPool = require('../db'); // ‼️ ตรวจสอบว่า Path นี้ถูกต้อง


// 1.1 Testing GET Facility (User Search)
// method: get
// URL: http://localhost:3000/api/search/facility

// 1.2 Testing GET Facility  (User Search)
// method: get
// URL: http://localhost:3000/api/search/facility?name=1&type=Football


// GET /search/facility
// (Front-End เรียก /search/facility -> Proxy ส่งมาที่นี่เป็น /search/facility)
router.get('/search/facility', async (req, res) => {
    try {
        const { name, type } = req.query;

        // ค้นหาจาก Table 'Facility'
        let sql = 'SELECT * FROM Facility WHERE 1=1'; 
        const params = [];

        if (name) {
            sql += ' AND Name LIKE ?'; //
            params.push(`%${name}%`);
        }
        if (type) {
            sql += ' AND Type = ?'; //
            params.push(type);
        }

// --- ⬇️ เปลี่ยนมาใช้ Callback ตรงนี้ ⬇️ ---
        dbPool.execute(sql, params, (error, rows) => {
            if (error) {
                // ถ้า Query มีปัญหา
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Failed to search facilities' });
                return; // จบการทำงาน
            }
            
            // ถ้าสำเร็จ ส่งข้อมูล 'rows' กลับไป
            res.json(rows);
        });
        // --- ⬆️ สิ้นสุดส่วน Callback ⬆️ ---

    } catch (error) {
        // Error นี้จะจับเฉพาะความผิดพลาดก่อนที่จะรัน dbPool.execute
        console.error('Error searching facilities:', error);
        res.status(500).json({ error: 'Failed to search facilities' });
    }
});


// 2.1 Testing GET Facility by ID (For Detail)
// method: get
// URL: http://localhost:3000/api/facility/F0000001

// 2.2 Testing GET Facility (For Detail)
// method: get
// URL: http://localhost:3000/api/facility/F0000002


// GET /facility/:id (เช่น /facility/F0000001)
// (Front-End เรียก /facility/F0000001 -> Proxy ส่งมาที่นี่)
router.get('/facility/:id', (req, res) => { // <-- ลบ 'async'
    try {
        const { id } = req.params; // <-- ใช้ req.params เพื่อดึง :id

        //
        let sql = 'SELECT * FROM Facility WHERE Facility_ID = ?'; 
        const params = [id];

        // --- ใช้ Callback ---
        dbPool.execute(sql, params, (error, rows) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Failed to fetch facility' });
                return;
            }
            // ส่งข้อมูลแถวแรกที่เจอ (หรือ null ถ้าไม่เจอ)
            res.json(rows[0] || null);
        });

    } catch (error) {
        console.error('Error fetching facility:', error);
        res.status(500).json({ error: 'Failed to fetch facility' });
    }
});

module.exports = router;