#!/bin/zsh

# Cd into controller's root dir
cd controller

# Build the project
npm run build

# Navigate to the dist directory
cd dist

# Find and replace absolute paths with relative paths in index.html (prepare for Electron)
sed -i 's|href="/|href="./|g' index.html
sed -i 's|src="/|src="./|g' index.html
