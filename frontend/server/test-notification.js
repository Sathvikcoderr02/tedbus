// Test script for notification system
const notificationService = require('./services/notification.service');
require('dotenv').config();

// Test data
const testUser = {
  email: 'test@example.com', // Replace with a real email for testing
  phone: '+1234567890',     // Replace with a real phone number for testing (with country code)
  fcmToken: 'test-fcm-token' // Replace with a real FCM token for testing
};

const testBooking = {
  bookingId: 'TEST' + Math.random().toString(36).substr(2, 8).toUpperCase(),
  from: 'Test City A',
  to: 'Test City B',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  seatNumber: 'A12'
};

// Test notification
async function testNotifications() {
  console.log('Starting notification tests...');
  
  try {
    console.log('Sending booking confirmation...');
    const results = await notificationService.sendBookingConfirmation(testUser, testBooking);
    
    console.log('Notification results:');
    results.forEach((result, index) => {
      const types = ['Email', 'SMS', 'Push Notification'];
      console.log(`\n${types[index]} Test:`);
      console.log('Status:', result.status);
      if (result.status === 'fulfilled') {
        console.log('Result:', result.value);
      } else {
        console.error('Error:', result.reason);
      }
    });
    
    console.log('\nAll notification tests completed!');
  } catch (error) {
    console.error('Error in notification test:', error);
  }
}

// Run tests
testNotifications().catch(console.error);
