#!/bin/bash
set -e

# Install prerequisites
sudo dnf -y install unzip
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf -y install nodejs nginx
sudo systemctl enable --now nginx

# Prepare app
mkdir -p ~/app
unzip -o ~/video-dashboard-release.zip -d ~/app
cd ~/app
npm ci --omit=dev

# Copy configs and start service
sudo cp infra/nginx/video-dashboard.conf /etc/nginx/conf.d/
sudo cp infra/systemd/video-dashboard.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now video-dashboard

# Show recent logs and tail
sudo journalctl -u video-dashboard -n 200 -f --no-pager
