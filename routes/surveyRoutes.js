const mongoose = require('mongoose');
const requireCredits = require('../middlewares/requireCredits');
const  requireLogin = require('../middlewares/requireLogin');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.pust('/api/surveys', requireLogin, requireCredits, (req, res) => {//reference function requireLogin
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey ({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({email:email.trim()})),
            _user: req.user.id,
            dataSent: Date.now(),

        });
    });
};