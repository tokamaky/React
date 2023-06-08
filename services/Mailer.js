const SibApiV3Sdk = require('sib-api-v3-sdk');
const keys = require('../config/keys');

class Mailer {
  constructor({ subject, recipients }, content) {
    this.sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();
    this.apiKey = keys.sendinblueApiKey;
    this.from = { email: 'no-reply@emaily.com' };
    this.subject = subject;
    this.htmlContent = content;
    this.recipients = this.formatAddresses(recipients);
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => ({ email }));
  }

  async send() {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = this.from;
    sendSmtpEmail.subject = this.subject;
    sendSmtpEmail.htmlContent = this.htmlContent;
    sendSmtpEmail.to = this.recipients;

    const sendEmailOptions = {
      sendSmtpEmail,
    };

    try {
      const response = await this.sendinblue.sendTransacEmail(sendEmailOptions, this.apiKey);
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = Mailer;