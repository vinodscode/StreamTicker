#!/bin/bash

# Stock Market Monitor Setup Script
# This script helps set up the application for production deployment

echo "==== Setting up Stock Market Monitor Application ===="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18.x or higher first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js version 18.x or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies. Please check the error message above."
    exit 1
fi
echo "Dependencies installed successfully."
echo

# Build the application
echo "Building application for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "Failed to build the application. Please check the error message above."
    exit 1
fi
echo "Application built successfully."
echo

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing PM2..."
    npm install -g pm2
    if [ $? -ne 0 ]; then
        echo "Failed to install PM2. You'll need to start the application manually."
    else
        echo "PM2 installed successfully."
    fi
fi

# Ask if the user wants to start the application
read -p "Do you want to start the application now? (y/n): " start_app
if [[ $start_app == "y" || $start_app == "Y" ]]; then
    if command -v pm2 &> /dev/null; then
        echo "Starting application with PM2..."
        pm2 start npm --name "stock-monitor" -- run start
        echo "Application started. You can access it at http://localhost:5000"
        echo "To view logs: pm2 logs stock-monitor"
        echo "To stop the application: pm2 stop stock-monitor"
    else
        echo "Starting application with npm..."
        echo "The application will stop when you close this terminal."
        NODE_ENV=production npm run start
    fi
else
    echo "To start the application manually:"
    echo "  With PM2: pm2 start npm --name \"stock-monitor\" -- run start"
    echo "  With npm: NODE_ENV=production npm run start"
fi

echo
echo "==== Setup Complete ===="
echo "Refer to DEPLOYMENT.md for detailed deployment instructions."