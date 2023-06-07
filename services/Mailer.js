const mailgun = require('mailgun-js');
const keys = require('../config/keys');

class Mailer {
  constructor({ subject, recipients }, content) {
    this.mailgun = mailgun({ apiKey: keys.mailGunKey, domain: keys.mailgunDomain });
    this.from = 'no-reply@emaily.com';
    this.subject = subject;
    this.html = content;
    this.recipients = this.formatAddresses(recipients);
    
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => email);
  }

  async send() {
    const data = {
      from: this.from,
      to: this.recipients.join(','),
      subject: this.subject,
      html: this.html
    };

    try {
      const response = await this.mailgun.messages().send(data);
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = Mailer;