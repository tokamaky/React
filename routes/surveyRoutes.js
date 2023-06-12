const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const mailjet = require('node-mailjet');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');


const Survey = mongoose.model('surveys');

module.exports = (app) => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
  
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients
        .split(',')
        .map((email) => ({ Email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });
  
    // Send email using Mailjet
    const mailjetClient = mailjet.apiConnect('keys.mailjetPublicKey', 'keys.mailjetPrivateKey');
    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'no-reply@emaily.com',
          },
          To: survey.recipients,
          Subject: survey.subject,
          HTMLPart: surveyTemplate(survey),
        },
      ],
    });
  
    try {
      await request;
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
  
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
  
};
