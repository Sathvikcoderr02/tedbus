const nodemailer = require('nodemailer');
const twilio = require('twilio');
const admin = require('firebase-admin');

class NotificationService {
  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Initialize Twilio client
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Initialize Firebase Admin SDK if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
    }
  }

  /**
   * Send email notification
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - HTML content of the email
   */
  async sendEmail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: `"TedBus" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS notification
   * @param {string} to - Recipient phone number (with country code)
   * @param {string} message - SMS message
   */
  async sendSMS(to, message) {
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
      console.log('SMS sent:', result.sid);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send push notification
   * @param {string} token - FCM token of the device
   * @param {object} notification - Notification object { title, body }
   * @param {object} data - Additional data to send with the notification
   */
  async sendPushNotification(token, notification, data = {}) {
    try {
      const message = {
        notification,
        data,
        token
      };

      const response = await admin.messaging().send(message);
      console.log('Push notification sent:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send booking confirmation
   * @param {object} user - User object { email, phone, fcmToken }
   * @param {object} booking - Booking details
   */
  async sendBookingConfirmation(user, booking) {
    const emailHtml = `
      <h1>Booking Confirmed!</h1>
      <p>Your booking with ID ${booking.bookingId} has been confirmed.</p>
      <p>From: ${booking.from}</p>
      <p>To: ${booking.to}</p>
      <p>Date: ${new Date(booking.date).toLocaleDateString()}</p>
      <p>Seat: ${booking.seatNumber}</p>
    `;

    const smsMessage = `Your TedBus booking (${booking.bookingId}) is confirmed. ${booking.from} to ${booking.to} on ${new Date(booking.date).toLocaleDateString()}. Seat: ${booking.seatNumber}`;

    const pushNotification = {
      title: 'Booking Confirmed!',
      body: `Your booking ${booking.bookingId} is confirmed.`
    };

    // Send all notifications in parallel
    const results = await Promise.allSettled([
      user.email ? this.sendEmail(user.email, 'Booking Confirmed', emailHtml) : Promise.resolve(),
      user.phone ? this.sendSMS(user.phone, smsMessage) : Promise.resolve(),
      user.fcmToken ? this.sendPushNotification(user.fcmToken, pushNotification, { type: 'booking', id: booking.bookingId }) : Promise.resolve()
    ]);

    return results;
  }

  // Add more notification methods for cancellations, reminders, etc.
  // ...
}

module.exports = new NotificationService();
