const mailjet = require('node-mailjet');
const keys = require('../config/keys');

class Mailer {
  constructor({ subject, recipients }, content) {
    this.mailjet = mailjet.apiConnect(
      keys.mailjetPublicKey,
      keys.mailjetPrivateKey
    );
    this.fromEmail = 'no-reply@emaily.com';
    this.subject = subject;
    this.content = content;
    this.recipients = this.formatAddresses(recipients);
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return { Email: email };
    });
  }

  async send() {
    const messages = [
      {
        From: {
          Email: this.fromEmail,
        },
        To: this.recipients,
        Subject: this.subject,
        HTMLPart: this.content,
      },
    ];
  
    const request = this.mailjet
      .post('send', { version: 'v3.1' })
      .request({ Messages: messages });
  
    try {
      const response = await request;
      return response.body;
    } catch (err) {
      throw err;
    }
  }
  
}

module.exports = Mailer;
