const notificationService = require('../services/notification.service');

class NotificationController {
  /**
   * Send booking confirmation notification
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async sendBookingConfirmation(req, res) {
    try {
      const { user, booking } = req.body;
      
      if (!user || !booking) {
        return res.status(400).json({
          success: false,
          message: 'User and booking details are required'
        });
      }

      const results = await notificationService.sendBookingConfirmation(user, booking);
      
      res.status(200).json({
        success: true,
        message: 'Booking confirmation sent',
        results
      });
    } catch (error) {
      console.error('Error in sendBookingConfirmation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send booking confirmation',
        error: error.message
      });
    }
  }

  // Add more controller methods for other notification types
  // ...
}

module.exports = new NotificationController();
