const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const mailgun = require('mailgun-js');
const keys = require('../config/keys');

const Survey = mongoose.model('surveys');
const mg = mailgun({ apiKey: keys.mailGunKey, domain: keys.mailgunDomain });

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    try {
      const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false });
      res.send(surveys);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send(); // Send email using Mailgun
      await survey.save(); // Create the new survey in the MongoDB database
      req.user.credits -= 1; // Reduce the number of credits
      const user = await req.user.save(); // Update the user's credits
      res.send(user); // Update the balance in the header
    } catch (error) {
      res.status(422).send(error);
    }
  });
};