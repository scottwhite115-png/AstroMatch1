#!/bin/bash
echo "=== Finding Your Mac's IP Address ==="
echo ""
echo "WiFi IP addresses:"
ifconfig | grep -A 1 "en0\|wlan0" | grep "inet " | grep -v 127.0.0.1
echo ""
echo "All network interfaces:"
ifconfig | grep "inet " | grep -v 127.0.0.1
echo ""
echo "=== Server Status ==="
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✓ Server is running on port 3000"
    echo "✓ Server should be accessible at: http://[IP_ABOVE]:3000"
else
    echo "✗ Server is NOT running on port 3000"
    echo "  Run: npm run dev"
fi

