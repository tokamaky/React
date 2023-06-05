const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
    constructor ({ subject, recipients }, content) {
        //to make sure make sure that any constructor that is 
        //defined on the middle class gets executed 
        //like calling the super function so super right here.
        super();

        
        this.sgApi = sendgrid(keys.sendGridKey)
        this.from_email = new helper.Email('no-reply@emaily.com')
        this.subject = subject
        this.body = new helper.Content('text/html', content)
        this.recipients = this.formatAddresses(recipients)
    }

}

module.exports = Mailer;
