#!/bin/bash

# Quick screenshot resizer for App Store Connect
# Usage: ./quick-resize.sh /path/to/screenshot.png

if [ -z "$1" ]; then
    echo "Usage: ./quick-resize.sh /path/to/screenshot.png"
    echo ""
    echo "Or drag and drop your screenshot file onto this script in Terminal"
    exit 1
fi

INPUT="$1"
BASENAME=$(basename "$INPUT" | sed 's/\.[^.]*$//')
DIR=$(dirname "$INPUT")

echo "📸 Resizing screenshot: $(basename "$INPUT")"
echo ""

# Resize to 6.7-inch (1242x2688)
OUTPUT_67="${DIR}/${BASENAME}_6.7inch_1242x2688.png"
sips -z 2688 1242 "$INPUT" --out "$OUTPUT_67" > /dev/null 2>&1
if [ -f "$OUTPUT_67" ]; then
    echo "✅ Created: $OUTPUT_67"
else
    echo "❌ Failed: $OUTPUT_67"
fi

# Resize to 6.5-inch (1284x2778)
OUTPUT_65="${DIR}/${BASENAME}_6.5inch_1284x2778.png"
sips -z 2778 1284 "$INPUT" --out "$OUTPUT_65" > /dev/null 2>&1
if [ -f "$OUTPUT_65" ]; then
    echo "✅ Created: $OUTPUT_65"
else
    echo "❌ Failed: $OUTPUT_65"
fi

echo ""
echo "📂 Files saved to: $DIR"
echo ""
echo "📱 For App Store Connect:"
echo "   • 6.7-inch Display: Use files ending in '_6.7inch_1242x2688.png'"
echo "   • 6.5-inch Display: Use files ending in '_6.5inch_1284x2778.png'"

