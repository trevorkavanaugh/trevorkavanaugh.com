#!/bin/bash
# Deploy API to DigitalOcean droplet

set -e

DROPLET="naughtymoddy@64.23.250.139"
REMOTE_DIR="/home/naughtymoddy/trevorkavanaugh-api"

echo "Deploying API to $DROPLET..."

# Copy files
scp api/index.js api/package.json $DROPLET:$REMOTE_DIR/

# Install deps and restart
ssh $DROPLET "cd $REMOTE_DIR && npm install --production && pm2 restart trevorkavanaugh-api"

echo "Deploy complete! Testing health endpoint..."
curl -s https://api.trevorkavanaugh.com/api/health

echo ""
echo "Done!"
