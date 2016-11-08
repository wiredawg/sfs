# Simple HTTPS Static File Server

This script serves a directory over HTTPS.

```bash
# Generate a self-signed HTTPS certificate
$ mkdir ~/.sfs && cd ~/.sfs
$ openssl -x509 -sha256 -newkey rsa:4096 -days 3650 -nodes -keyout key -out crt

# Setup passwd file for username and password
$ echo "{'name':'test', 'pass':'pass'}" > passwd
$ chmod -R go-rwx .

$ cd /path/to/content

# Serve the 'public' directory
$ ./sfs.js

# Serve a different directory
$ ./sfs.js /path/to/your/stuff
```

