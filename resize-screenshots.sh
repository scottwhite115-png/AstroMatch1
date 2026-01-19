#!/bin/bash

# AstroMatch Screenshot Resizer for App Store Connect
# Resizes screenshots to required App Store dimensions

set -e

echo "📸 AstroMatch Screenshot Resizer"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if sips is available (built into macOS)
if ! command -v sips &> /dev/null; then
    echo "❌ Error: sips command not found. This script requires macOS."
    exit 1
fi

# Check if ImageMagick is available (optional, better quality)
HAS_IMAGEMAGICK=false
if command -v convert &> /dev/null; then
    HAS_IMAGEMAGICK=true
    echo "✅ ImageMagick found (will use for better quality)"
else
    echo "ℹ️  Using built-in sips (ImageMagick optional for better quality)"
fi

# Required dimensions (stored as variables, not array)
# 6.7-inch: 1242x2688 (portrait), 2688x1242 (landscape)
# 6.5-inch: 1284x2778 (portrait), 2778x1284 (landscape)

# Function to resize image
resize_image() {
    local input_file="$1"
    local output_file="$2"
    local width="$3"
    local height="$4"
    
    echo "  Resizing: $(basename "$input_file") → ${width}x${height}"
    
    if [ "$HAS_IMAGEMAGICK" = true ]; then
        # Use ImageMagick for better quality
        convert "$input_file" -resize "${width}x${height}" -quality 95 "$output_file"
    else
        # Use sips (built into macOS)
        sips -z "$height" "$width" "$input_file" --out "$output_file" > /dev/null 2>&1
    fi
    
    if [ -f "$output_file" ]; then
        echo -e "  ${GREEN}✅ Created: $output_file${NC}"
    else
        echo "  ❌ Failed to create: $output_file"
    fi
}

# Ask for input directory
echo "Where are your screenshots located?"
echo "1. Desktop"
echo "2. Downloads"
echo "3. Custom path"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        INPUT_DIR="$HOME/Desktop"
        ;;
    2)
        INPUT_DIR="$HOME/Downloads"
        ;;
    3)
        read -p "Enter full path to screenshots folder: " INPUT_DIR
        ;;
    *)
        echo "Invalid choice. Using Desktop..."
        INPUT_DIR="$HOME/Desktop"
        ;;
esac

if [ ! -d "$INPUT_DIR" ]; then
    echo "❌ Error: Directory not found: $INPUT_DIR"
    exit 1
fi

echo ""
echo "📁 Input directory: $INPUT_DIR"
echo ""

# Create output directory
OUTPUT_DIR="$INPUT_DIR/App_Store_Screenshots"
mkdir -p "$OUTPUT_DIR"

# Create subdirectories for each size
mkdir -p "$OUTPUT_DIR/6.7-inch-portrait"
mkdir -p "$OUTPUT_DIR/6.7-inch-landscape"
mkdir -p "$OUTPUT_DIR/6.5-inch-portrait"
mkdir -p "$OUTPUT_DIR/6.5-inch-landscape"

echo "📂 Output directory: $OUTPUT_DIR"
echo ""

# Find image files
IMAGES=$(find "$INPUT_DIR" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | head -20)

if [ -z "$IMAGES" ]; then
    echo "❌ No image files found in $INPUT_DIR"
    echo ""
    echo "Please place your screenshots in: $INPUT_DIR"
    exit 1
fi

echo "Found $(echo "$IMAGES" | wc -l | tr -d ' ') image(s)"
echo ""

# Ask which sizes to generate
echo "Which screenshot sizes do you need?"
echo "1. All sizes (recommended)"
echo "2. 6.7-inch portrait only (1242x2688)"
echo "3. 6.5-inch portrait only (1284x2778)"
echo "4. Both portrait sizes"
read -p "Enter choice (1-4): " size_choice

case $size_choice in
    1)
        GENERATE_67_PORTRAIT=true
        GENERATE_67_LANDSCAPE=true
        GENERATE_65_PORTRAIT=true
        GENERATE_65_LANDSCAPE=true
        ;;
    2)
        GENERATE_67_PORTRAIT=true
        GENERATE_67_LANDSCAPE=false
        GENERATE_65_PORTRAIT=false
        GENERATE_65_LANDSCAPE=false
        ;;
    3)
        GENERATE_67_PORTRAIT=false
        GENERATE_67_LANDSCAPE=false
        GENERATE_65_PORTRAIT=true
        GENERATE_65_LANDSCAPE=false
        ;;
    4)
        GENERATE_67_PORTRAIT=true
        GENERATE_67_LANDSCAPE=false
        GENERATE_65_PORTRAIT=true
        GENERATE_65_LANDSCAPE=false
        ;;
    *)
        GENERATE_67_PORTRAIT=true
        GENERATE_67_LANDSCAPE=false
        GENERATE_65_PORTRAIT=true
        GENERATE_65_LANDSCAPE=false
        ;;
esac

echo ""
echo "🔄 Resizing screenshots..."
echo ""

COUNTER=1
for img in $IMAGES; do
    BASENAME=$(basename "$img" | sed 's/\.[^.]*$//')
    
    echo "Processing: $(basename "$img")"
    
    if [ "$GENERATE_67_PORTRAIT" = true ]; then
        OUTPUT="$OUTPUT_DIR/6.7-inch-portrait/${BASENAME}_6.7_portrait.png"
        resize_image "$img" "$OUTPUT" 1242 2688
    fi
    
    if [ "$GENERATE_67_LANDSCAPE" = true ]; then
        OUTPUT="$OUTPUT_DIR/6.7-inch-landscape/${BASENAME}_6.7_landscape.png"
        resize_image "$img" "$OUTPUT" 2688 1242
    fi
    
    if [ "$GENERATE_65_PORTRAIT" = true ]; then
        OUTPUT="$OUTPUT_DIR/6.5-inch-portrait/${BASENAME}_6.5_portrait.png"
        resize_image "$img" "$OUTPUT" 1284 2778
    fi
    
    if [ "$GENERATE_65_LANDSCAPE" = true ]; then
        OUTPUT="$OUTPUT_DIR/6.5-inch-landscape/${BASENAME}_6.5_landscape.png"
        resize_image "$img" "$OUTPUT" 2778 1284
    fi
    
    echo ""
    ((COUNTER++))
done

echo "=================================="
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "📂 Resized screenshots saved to:"
echo "   $OUTPUT_DIR"
echo ""
echo "📱 For App Store Connect:"
echo "   • 6.7-inch Display: Use files from '6.7-inch-portrait' folder"
echo "   • 6.5-inch Display: Use files from '6.5-inch-portrait' folder"
echo ""
echo "💡 Tip: Upload at least 3 screenshots per size to App Store Connect"
echo ""

