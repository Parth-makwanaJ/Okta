const express = require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const { URL } = require('url');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

const oidc = new ExpressOIDC({
    issuer: process.env.OKTA_ISSUER,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: process.env.OKTA_REDIRECT_URI,
    appBaseUrl: process.env.APP_BASE_URL,
    scope: 'openid profile',
});

app.use(oidc.router);

PORT = process.env.PORT || 4000;
APPURL = process.env.URL || '127.0.0.1';

oidc.on('ready', () => {
    app.listen(PORT, APPURL, () => {
        console.log(`app is running on port http://${APPURL}:${PORT}`);
    });
});

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'login.html'), (err, data) => {
        if (err) throw err;
        res.end(data);
    });
});

app.get('/secure', oidc.ensureAuthenticated(), (req, res) => {
    res.send('You are authenticated!');
});

/*
npm i -D @oktadev/schematics
schematics @oktadev/schematics:add-auth --issuer=https://dev-63215033.okta.com --clientId=0oaguc40n0hX5I6Mt5d7 --clientSecret=QqoY6awBseQgWD2sCZSQyUqKfiGRXHhTksE-dYZBKSDkR7BsUxoIOT6g7VJalm7U


Okta URL (https://dev-63215033.okta.com)
*/