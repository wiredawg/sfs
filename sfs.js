#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const serveIndex = require('serve-index')
const auth = require('basic-auth')

/* Directory to serve */
var static_dir = (process.argv[2] === '.') ? process.cwd() : process.argv[2] || 'public';

/* HTTPS Credentials */
var key_file = process.env.HTTPS_KEY;
var crt_file = process.env.HTTPS_CRT;

if ( !key_file || !crt_file ) {
    console.log('-error- You must set $HTTPS_KEY and $HTTPS_CRT');
    process.exit(-1);
}

var key = fs.readFileSync(process.env.HTTPS_KEY, 'utf8');
var crt = fs.readFileSync(process.env.HTTPS_CRT, 'utf8');

/* Basic authentication middleware */
function basic_auth(req, res, next) {

    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };
 
    var user = auth(req);
    if (!user || user.name !== 'test' || user.pass !== 'pass') {
        return unauthorized(res);
    } else {
        return next();
    };
};

/* Express app */
var app = express();
app.use(basic_auth);
app.use(serveIndex(static_dir, {'view': 'details', 'icons': true}));
app.use(express.static(static_dir));
var server = https.createServer({'key': key, 'cert': crt}, app);
server.listen( 9090 );
console.log('Starting server on https://localhost:9090, serving: ' + static_dir);

