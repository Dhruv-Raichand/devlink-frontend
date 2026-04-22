#!/bin/bash
set -e

# Load nvm
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Use your node version
nvm use node

cd ~/devlink-frontend

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Deploying to Nginx..."
rm -rf /var/www/html/*
cp -r dist/* /var/www/html

echo "Frontend deployed!"
