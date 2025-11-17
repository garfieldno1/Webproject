// ไฟล์: routes/searchingtournamentRoutes.js
const express = require('express');
const router = express.Router();
const dbPool = require('../db'); // ‼️ ตรวจสอบว่า Path นี้ถูกต้อง

// GET /search/tournament
router.get('/search/tournament', async (req, res) => {
    try {
        const { name, type, date } = req.query;

        // ค้นหาจาก Table 'Tournament'
        let sql = 'SELECT * FROM Tournament WHERE 1=1'; 
        const params = [];

        if (name) {
            sql += ' AND Name LIKE ?'; //
            params.push(`%${name}%`);
        }
        if (type) {
            sql += ' AND SportType = ?'; //
            params.push(type);
        }
        if (date) {
            // ค้นหาว่า 'date' อยู่ระหว่าง 'StartDate' กับ 'EndDate'
            sql += ' AND ? BETWEEN StartDate AND EndDate'; 
            params.push(date);
        }

       // --- ⬇️ เปลี่ยนมาใช้ Callback ตรงนี้ ⬇️ ---
        dbPool.execute(sql, params, (error, rows) => {
            if (error) {
                // ถ้า Query มีปัญหา
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Failed to search tournaments' });
                return; // จบการทำงาน
            }
            
            // ถ้าสำเร็จ ส่งข้อมูล 'rows' กลับไป
            res.json(rows);
        });
        // --- ⬆️ สิ้นสุดส่วน Callback ⬆️ ---

    } catch (error) {
        // Error นี้จะจับเฉพาะความผิดพลาดก่อนที่จะรัน dbPool.execute
        console.error('Error searching tournaments:', error);
        res.status(500).json({ error: 'Failed to search tournaments' });
    }
});

// GET /tournament/:id (เช่น /tournament/T0000001)
router.get('/tournament/:id', (req, res) => { // <-- ลบ 'async'
    try {
        const { id } = req.params; // <-- ใช้ req.params เพื่อดึง :id

        //
        let sql = 'SELECT * FROM Tournament WHERE Tournament_ID = ?';
        const params = [id];

        // --- ใช้ Callback ---
        dbPool.execute(sql, params, (error, rows) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Failed to fetch tournament' });
                return;
            }
            // ส่งข้อมูลแถวแรกที่เจอ (หรือ null ถ้าไม่เจอ)
            res.json(rows[0] || null);
        });

    } catch (error) {
        console.error('Error fetching tournament:', error);
        res.status(500).json({ error: 'Failed to fetch tournament' });
    }
});

// GET /tournaments (ดึง Tournament ทั้งหมด)
router.get('/tournaments', (req, res) => { // <-- ไม่มี 'async'
    try {
        let sql = 'SELECT * FROM Tournament'; //
        const params = [];

        // --- ใช้ Callback ---
        dbPool.execute(sql, params, (error, rows) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Failed to fetch tournaments' });
                return;
            }
            res.json(rows); // ส่งข้อมูลทั้งหมดกลับไป
        });

    } catch (error) {
        console.error('Error fetching tournaments:', error);
        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});
module.exports = router;