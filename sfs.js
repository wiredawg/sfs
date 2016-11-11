#!/usr/bin/env node
/****************************************************************************/
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const express = require('express');
const serveIndex = require('serve-index')
const auth = require('basic-auth')

/****************************************************************************/

var enable_ssl = true;
var enable_auth = true;
var port = process.env.SFS_HTTP_PORT || 8080;

/* Directory to serve */
var static_dir = 'public';

/* Options */
var args = process.argv.slice(2);
while (args.length > 0) {
    var a = args.shift();
    switch (a) {
        case '-U':
        case '--unsecure':
            enable_ssl = false;
            enable_auth = false;
            break;
        case '--no-ssl':
            enable_ssl = false;
            break;
        case '-d':
        case '--dir':
            static_dir = args.shift();
            static_dir = (static_dir === '.') ? process.cwd() : static_dir;
            break;
        case '-p':
        case '--port':
            port = args.shift();
            break;
        case '-h':
        case '--help':
            console.log(usage());
            process.exit(0);
            break;
        default:
            console.log('-error- Invalid option: ' + a);
            console.log(usage());
            process.exit(-1);
    }
}

/* Basic authentication user credentials */
var passwd_file = process.env.SFS_PASSWD_FILE || process.env.HOME + '/.sfs/passwd';
var user = JSON.parse(fs.readFileSync(passwd_file, 'utf8'));

/* Basic authentication middleware */
function basic_auth(req, res, next) {

    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };
 
    var u = auth(req);
    if (!u || u.name !== user.name || u.pass !== user.pass) {
        return unauthorized(res);
    } else {
        return next();
    };
};

/* Express app */
var app = express();

if (enable_auth) {
    app.use(basic_auth);
}
app.use(serveIndex(static_dir, {'view': 'details', 'icons': true}));
app.use(express.static(static_dir));

if (enable_ssl) {
    /* HTTPS Credentials */
    var key_file = process.env.SFS_HTTPS_KEY || process.env.HOME + '/.sfs/key.pem';
    var crt_file = process.env.SFS_HTTPS_CRT || process.env.HOME + '/.sfs/crt.pem';

    if ( !key_file || !crt_file ) {
        console.log('-error- You must set $HTTPS_KEY and $HTTPS_CRT');
        process.exit(-1);
    }

    var key = fs.readFileSync(key_file, 'utf8');
    var crt = fs.readFileSync(crt_file, 'utf8');

    var server = https.createServer({'key': key, 'cert': crt}, app);
    port = process.env.SFS_HTTPS_PORT || 9090;
} else {
    var server = http.createServer(app);
}

server.listen(port);
console.log('Starting '+((enable_auth)?'':'un')+'authenticating server on http'+((enable_ssl)?'s':'')+'://localhost:' + port + ', serving: ' + static_dir);


function usage() {
    return "usage: sfs [options]\n" +
           "\n" +
           "options:\n" +
           "  -d, --dir DIRNAME     Path to serve\n" +
           "  -h, --help            Print this message to STDOUT\n" +
           "  -p, --port PORT       Port to serve from\n" +
           "  -u, --unsecure        No authentication, not ssl\n" +
           "  --no-ssl              Disable SSL";
}
