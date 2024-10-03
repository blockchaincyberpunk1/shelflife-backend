const nodemailer = require('nodemailer');  // Import Nodemailer for sending emails
const ejs = require('ejs');  // Import ejs for email templating (if you want to use templating)
const path = require('path');  // Import path to resolve file paths
const logger = require('./logger');  // Import the Winston logger

require('dotenv').config();  // Import dotenv to load environment variables

// Setup the Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,  // SMTP host (e.g., smtp.gmail.com)
  port: process.env.SMTP_PORT || 587,  // SMTP port (587 is commonly used for TLS)
  secure: false,  // Use TLS (secure:false for port 587)
  auth: {
    user: process.env.SMTP_USER,  // SMTP username (your email)
    pass: process.env.SMTP_PASSWORD,  // SMTP password (your email password or app password)
  },
});

/**
 * Send an email using the given options
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version of the email
 * @param {string} [options.html] - HTML version of the email (optional)
 * @returns {Promise<void>}
 */
exports.sendEmail = async (options) => {
  try {
    // Define the email options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,  // Sender address (your email address or app's email)
      to: options.to,  // Recipient email address
      subject: options.subject,  // Subject of the email
      text: options.text,  // Plain text version of the email
      html: options.html,  // Optional HTML version of the email
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);
    // Log the successful email sending
    logger.info(`Email successfully sent to ${options.to}`);
  } catch (err) {
    // Log the error
    logger.error(`Failed to send email to ${options.to}: ${err.message}`);
    throw new Error('Email could not be sent');
  }
};

/**
 * Send a password reset email to a user
 * @param {string} to - The recipient's email address
 * @param {string} resetToken - The password reset token
 * @returns {Promise<void>}
 */
exports.sendPasswordResetEmail = async (to, resetToken) => {
  try {
    // Generate the password reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const supportUrl = process.env.SUPPORT_URL || 'https://example.com/support';

    // Render the email template (if using templating, otherwise use simple text)
    const htmlTemplate = await ejs.renderFile(
      path.join(__dirname, '../templates/passwordResetTemplate.ejs'),
      // The reset URL for password reset
      // Optional support URL
      { resetUrl, supportUrl }
    );

    // Send the password reset email
    await exports.sendEmail({
      to,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click here to reset your password: ${resetUrl}`,
      html: htmlTemplate,  // Use the rendered HTML template
    });

    // Log the successful password reset email sending
    logger.info(`Password reset email sent to ${to}`);
  } catch (err) {
    // Log the error
    logger.error(`Failed to send password reset email to ${to}: ${err.message}`);
    throw new Error('Password reset email could not be sent');
  }
};
