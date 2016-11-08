# Simple HTTPS Static File Server

This script serves a directory over HTTPS.

```bash
# Generate a self-signed HTTPS certificate
$ mkdir ~/.certs && cd ~/.certs
$ openssl -x509 -sha26 -newkey rsa:4096 -days 3650 -nodes -keyout server.key -out server.crt
$ chmod -R go-rwx .

# Set envrionment variables pointing to certificates
$ export HTTPS_KEY=$HOME/.certs/server.key
$ export HTTPS_CRT=$HOME/.certs/server.crt

$ cd /path/to/content

# Serve the 'public' directory
$ ./sfs.js

# Serve a different directory
$ ./sfs.js /path/to/your/stuff
```

