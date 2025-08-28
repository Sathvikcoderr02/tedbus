const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification.controller');
const auth = require('../middleware/auth');

// Send booking confirmation notification
router.post('/notifications/booking-confirmation', auth, notificationController.sendBookingConfirmation);

// Add more notification routes as needed
// router.post('/notifications/booking-cancellation', auth, notificationController.sendBookingCancellation);
// router.post('/notifications/reminder', auth, notificationController.sendReminder);
// router.post('/notifications/promotional', auth, notificationController.sendPromotional);

module.exports = router;
