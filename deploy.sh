#!/bin/bash

# Deployment script for Admin Dashboard
# Usage: ./deploy.sh [user@host]

set -e

VPS_USER_HOST=${1:-"root@your-vps-ip"}
DEPLOY_PATH="/var/www/projects.app.com"
BUILD_DIR="dist"

echo "🚀 Starting deployment..."

# Build the application
echo "📦 Building application..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory not found!"
    exit 1
fi

# Upload files to VPS
echo "📤 Uploading files to $VPS_USER_HOST..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    "$BUILD_DIR/" "$VPS_USER_HOST:$DEPLOY_PATH/"

# Set permissions on VPS
echo "🔐 Setting permissions..."
ssh "$VPS_USER_HOST" "sudo chown -R www-data:www-data $DEPLOY_PATH && sudo chmod -R 755 $DEPLOY_PATH"

echo "✅ Deployment complete!"
echo "🌐 Visit https://projects.app.com"

