#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 user@host [remote_dir=/home/ubuntu/app]"
  exit 1
fi

TARGET="$1"
REMOTE_DIR="${2:-/home/ubuntu/app}"

echo "Deploying to $TARGET:$REMOTE_DIR"

# Sync project (exclude node_modules and .git)
rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='.env.local' . "$TARGET:$REMOTE_DIR"

ssh "$TARGET" bash -s <<'EOF'
set -euo pipefail
REMOTE_DIR="/home/ubuntu/app"
cd "$REMOTE_DIR"
echo "Installing dependencies..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
echo "Checking for .next build..."
if [ -d .next ]; then
  echo ".next exists — skipping build"
else
  echo "Building Next.js app..."
  npm run build
fi
echo "Setting up systemd service..."
if [ -f infra/systemd/video-dashboard.service ]; then
  sudo cp infra/systemd/video-dashboard.service /etc/systemd/system/video-dashboard.service
  sudo systemctl daemon-reload
  sudo systemctl enable video-dashboard
  sudo systemctl restart video-dashboard
  echo "Systemd service started."
fi
echo "Setting up nginx..."
if [ -f infra/nginx/video-dashboard.conf ]; then
  sudo cp infra/nginx/video-dashboard.conf /etc/nginx/sites-available/video-dashboard
  sudo ln -sf /etc/nginx/sites-available/video-dashboard /etc/nginx/sites-enabled/video-dashboard
  sudo nginx -t
  sudo systemctl restart nginx
  echo "Nginx restarted."
fi
echo "Deployment complete!"
EOF

echo "Checking systemd status..."
ssh "$TARGET" sudo systemctl status video-dashboard || true
echo ""
echo "Checking nginx status..."
ssh "$TARGET" sudo systemctl status nginx || true
