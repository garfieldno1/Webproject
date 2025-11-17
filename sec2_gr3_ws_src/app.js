// ไฟล์: app.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// เรียกใช้ Routes ที่แยกไว้
const userRoutes = require('./routes/userRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const equipmentrentalRoutes = require('./routes/equipmentrentalRoutes');
const searchingFacilityRoutes = require('./routes/searchingfacilityRoutes');
const searchingTournamentRoutes = require('./routes/searchingtournamentRoutes');

const app = express();
const port = process.env.PORT || 8000; 

const corsOptions = {
    origin: 'http://localhost:3000' // << ใส่ Port ของ Front-end ที่คุณตั้งใจจะรัน
};

// --- Middleware ---
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// --- API Routes ---
// API ทั้งหมดจะขึ้นต้นด้วย /api เช่น /api/users, /api/admin/login
app.use(userRoutes); 
app.use(facilityRoutes);
app.use(equipmentRoutes);
app.use(tournamentRoutes);
app.use(bookingRoutes);
app.use(equipmentrentalRoutes);
app.use(searchingFacilityRoutes);
app.use(searchingTournamentRoutes);




// --- Start Server ---
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);

});
