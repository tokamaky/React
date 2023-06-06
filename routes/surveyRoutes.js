const mongoose = require('mongoose');
const requireCredits = require('../middlewares/requireCredits');
const  requireLogin = require('../middlewares/requireLogin');
const  Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.pust('/api/surveys', requireLogin, requireCredits, async (req, res) => {//reference function requireLogin
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey ({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({email:email.trim()})),
            _user: req.user.id,
            dataSent: Date.now(),

        });
        const mailer = new Mailer(survey, surveyTemplate(survey));
        mailer.send();
    });
};