const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const keys = require('../config/keys');

const Survey = mongoose.model('surveys');
const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = keys.sendinblueApiKey;

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
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = { email: mailer.from };
      sendSmtpEmail.subject = mailer.subject;
      sendSmtpEmail.htmlContent = mailer.html;
      sendSmtpEmail.to = mailer.recipients;

      const sendEmailOptions = {
        sendSmtpEmail,
      };

      await sendinblue.sendTransacEmail(sendEmailOptions, apiKey);
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (error) {
      res.status(422).send(error);
    }
  });
};
