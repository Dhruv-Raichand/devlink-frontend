#!/bin/bash
set -e

RELEASE_DIR="/var/www/frontend/releases/$(date +%Y%m%d-%H%M%S)"
CURRENT_LINK="/var/www/frontend/current"
KEEP_RELEASES=5

echo "Creating release directory..."
mkdir -p "$RELEASE_DIR"

echo "Extracting build..."
tar -xzf /tmp/frontend.tar.gz -C "$RELEASE_DIR"

echo "Switching symlink..."
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

echo "Cleaning old releases..."
cd /var/www/frontend/releases
ls -1t | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

echo "Cleaning up artifact..."
rm -f /tmp/frontend.tar.gz

echo "Frontend deployed!"