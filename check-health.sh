#!/bin/bash

# Health Check Script for Stock Monitor

# Default to localhost if no hostname is provided
HOST=${1:-"localhost"}
PORT=${2:-"5000"}

echo "Checking health of Stock Monitor at http://$HOST:$PORT/health"
echo

# Try to fetch the health endpoint
response=$(curl -s -o response.txt -w "%{http_code}" http://$HOST:$PORT/health)
content=$(cat response.txt)
rm response.txt

# Check if the request was successful
if [ $response -eq 200 ]; then
    echo "✅ Health check successful (Status code: $response)"
    echo "Response: $content"
    echo
    echo "Server is running correctly!"
else
    echo "❌ Health check failed (Status code: $response)"
    if [ -n "$content" ]; then
        echo "Response: $content"
    else
        echo "No response received from server"
    fi
    echo
    echo "Please check if the server is running and accessible."
fi

# Check WebSocket connection
echo
echo "Checking WebSocket availability..."
wscat_installed=$(which wscat 2>/dev/null)

if [ -z "$wscat_installed" ]; then
    echo "wscat is not installed. Skipping WebSocket check."
    echo "To install wscat: npm install -g wscat"
else
    echo "Attempting to connect to WebSocket endpoint..."
    protocol="ws"
    if [ "$PORT" = "443" ]; then
        protocol="wss"
    fi
    
    # Just check if the endpoint is available, don't maintain a connection
    wscat -c "$protocol://$HOST:$PORT/ws" --connect-timeout 3 --no-color 2>&1 | grep -q "connected"
    
    if [ $? -eq 0 ]; then
        echo "✅ WebSocket endpoint is available"
    else
        echo "❌ WebSocket endpoint could not be reached"
        echo "Please check if WebSocket server is running correctly."
    fi
fi