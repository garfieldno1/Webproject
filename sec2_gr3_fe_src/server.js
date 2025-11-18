const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');
const app = express();



// --- ตั้งค่า Port ---
// เลือก Port สำหรับ Front-end (ต้องไม่ชนกับ Back-end)
const PORT = 3000;
const fullUrl = `http://localhost:${PORT}`;

// --- 2. ตั้งค่า Proxy ---
// บอกว่าถ้าเจอ /api ให้ส่งต่อไปที่ Back-end (ที่รันอยู่ Port 8000)
app.use('/api', createProxyMiddleware({ 

    target: 'http://localhost:8000', // <-- ‼️ ถ้า Back-end รัน Port อื่น ให้เปลี่ยนเลขตรงนี้
    changeOrigin: true ,
    pathRewrite: {
        '^/api': '', // ลบ /api ออกจาก path ก่อนส่งต่อ
    }
}));


// --- ชี้ไปที่ไฟล์ Static (CSS, JS, Images) ---
// นี่คือส่วนที่สำคัญที่สุด
// บอกให้ Express เสิร์ฟไฟล์ทั้งหมดในโฟลเดอร์ปัจจุบัน (__dirname)
// เมื่อมีคนเรียก /css/style.css มันก็จะไปหาไฟล์จากโฟลเดอร์ /css/style.css ให้
app.use(express.static(__dirname));

// --- ตั้งค่า Route สำหรับไฟล์ HTML ---

// 1. หน้าหลัก (เช่น Landing.html)
app.get('/', (req, res) => {
    // path.join จะหาไฟล์ Landing.html ในโฟลเดอร์ปัจจุบัน
    res.sendFile(path.join(__dirname, 'Landing.html'));
});
// 2. หน้าอื่นๆ (ถ้าคุณต้องการให้ URL สวยขึ้น)
app.get('/admin_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Admin_login.html'));
});
app.get('/facility', (req, res) => {
    res.sendFile(path.join(__dirname, 'Facility.html'));
});
app.get('/tournament', (req, res) => {
    res.sendFile(path.join(__dirname, 'Tournament.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'Contact.html'));
});
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'Search.html'));
});
app.get('/choose_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Choose_login.html'));
});
app.get('/register_page1', (req, res) => {
    res.sendFile(path.join(__dirname, 'Register_page1.html'));
});
app.get('/register_page2', (req, res) => {
    res.sendFile(path.join(__dirname, 'Register_page2.html'));
});
app.get('/register_page3', (req, res) => {
    res.sendFile(path.join(__dirname, 'Register_page3.html'));
});
app.get('/detail_facility', (req, res) => {
    res.sendFile(path.join(__dirname, 'Detail_facility.html')); 
});
app.get('/detail_tournament', (req, res) => {
    res.sendFile(path.join(__dirname, 'Detail_tournament.html')); 
});



app.get('/manageuser', (req, res) => {
    res.sendFile(path.join(__dirname, 'manageuser.html')); 
});
app.get('/adduser', (req, res) => {
    res.sendFile(path.join(__dirname, 'AddUser.html')); 
});
app.get('/addadmin', (req, res) => {
    res.sendFile(path.join(__dirname, 'AddAdmin.html')); 
});
app.get('/edituser', (req, res) => {
    res.sendFile(path.join(__dirname, 'Edituser.html')); 
});



app.get('/mainfacility', (req, res) => {
    res.sendFile(path.join(__dirname, 'Mainfacility.html')); 
});
app.get('/editfacility', (req, res) => {
    res.sendFile(path.join(__dirname, 'Editfacility.html')); 
});
app.get('/addnewfacility', (req, res) => {
    res.sendFile(path.join(__dirname, 'Addnewfacility.html')); 
});





app.get('/mainequipment', (req, res) => {
    res.sendFile(path.join(__dirname, 'Mainequipment.html')); 
});
app.get('/editequipment', (req, res) => {
    res.sendFile(path.join(__dirname, 'Editequipment.html')); 
});
app.get('/addnewequipment', (req, res) => {
    res.sendFile(path.join(__dirname, 'Addnewequipment.html')); 
});




app.get('/maintournament', (req, res) => {
    res.sendFile(path.join(__dirname, 'Maintournament.html')); 
});
app.get('/edittournament', (req, res) => {
    res.sendFile(path.join(__dirname, 'Edittournament.html')); 
});
app.get('/addtournament', (req, res) => {
    res.sendFile(path.join(__dirname, 'Addtournament.html')); 
});



app.get('/mainbooking', (req, res) => {
    res.sendFile(path.join(__dirname, 'Mainbooking.html')); 
});
app.get('/editbooking', (req, res) => {
    res.sendFile(path.join(__dirname, 'Editbooking.html')); 
});
app.get('/paymentbooking', (req, res) => {
    res.sendFile(path.join(__dirname, 'PaymentBooking.html')); 
});
app.get('/addbooking', (req, res) => {
    res.sendFile(path.join(__dirname, 'Addbooking.html')); 
});




app.get('/mainequipmentrental', (req, res) => {
    res.sendFile(path.join(__dirname, 'Mainequipmentrental.html')); 
});
app.get('/editequipmentrental', (req, res) => {
    res.sendFile(path.join(__dirname, 'Editequipmentrental.html')); 
});
app.get('/paymentequipmentrental', (req, res) => {
    res.sendFile(path.join(__dirname, 'PaymentEquipmentRental.html')); 
});
app.get('/addequipmentrental', (req, res) => {
    res.sendFile(path.join(__dirname, 'Addequipmentrental.html')); 
});




app.get('/forget_password', (req, res) => {
    res.sendFile(path.join(__dirname, 'Forget_password.html')); 
});



// --- รัน Server ---
app.listen(PORT, async () => {
    console.log(`🚀 Front-end server (fe_src) is running on http://localhost:${PORT}`);
    try {
        // ใช้ dynamic import แทน require
        const open = (await import('open')).default; 
        open(fullUrl);  
    } catch (err) {
        console.error("❌ Failed to open browser:", err);
    }

});

