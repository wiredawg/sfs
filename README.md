# Simple HTTPS Static File Server

This script serves a directory over HTTPS.

```bash
# Install the dependencies and the script
$ git clone git@github.com:wiredawg/sfs.git
$ cd sfs
$ npm install
$ cd ~/bin # Or somewhere in your $PATH
$ ln -s /path/to/sfs.js sfs

# Generate a self-signed HTTPS certificate
$ mkdir ~/.sfs && cd ~/.sfs
$ openssl -x509 -sha256 -newkey rsa:4096 -days 3650 -nodes -keyout key -out crt

# Setup passwd file for username and password
$ echo "{'name':'test', 'pass':'pass'}" > passwd
$ chmod -R go-rwx .

$ cd /path/to/content

# Serve the 'public' directory
$ sfs

# Serve a different directory on a different port
$ sfs.js --dir /path/to/your/stuff --port 8081
```

