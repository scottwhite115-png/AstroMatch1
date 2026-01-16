#!/bin/bash
echo "Checking server status..."
echo ""

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✓ Port 3000 is in use (server is running)"
else
    echo "✗ Port 3000 is NOT in use (server is NOT running)"
fi

echo ""
echo "Network interfaces:"
ifconfig | grep "inet " | grep -v 127.0.0.1

echo ""
echo "Try accessing from mobile using one of these IPs on port 3000:"
echo "Example: http://[IP_ADDRESS]:3000"

