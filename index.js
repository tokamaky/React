const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
//{"web":{"client_id":"697800694604-qml98bfiv0pv3tes6a1njkk6dluvuegq.apps.googleusercontent.com",
//"project_id":"lateral-shore-385601",
//"auth_uri":"https://accounts.google.com/o/oauth2/auth",
//"token_uri":"https://oauth2.googleapis.com/token",
//"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","
//client_secret":"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","redirect_uris":["http://localhost:5000/auth/google/callback"],"javascript_origins":["http://localhost:5000"]}}
passport.use(new GoogleStrategy());

const PORT = process.env.PORT || 5000;
app.listen(PORT);
