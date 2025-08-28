require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyparser.json({ limit: '10mb' }));
app.use(bodyparser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
const customerRoutes = require('./routes/customer');
const routeRoutes = require('./routes/route');
const bookingRoutes = require('./routes/booking');
const communityRoutes = require('./routes/community');
const notificationRoutes = require('./routes/notification');

// API Routes
app.use('/api', customerRoutes);
app.use('/api', routeRoutes);
app.use('/api', bookingRoutes);
app.use('/api/community', communityRoutes);
app.use('/api', notificationRoutes);

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tedbus')
.then(() => console.log("MongoDB connected"))
.catch(err => console.error('MongoDB connection error:', err))

app.get('/',(req,res)=>{
    res.send('Hello , Ted bus is working')
})

const PORT= 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
