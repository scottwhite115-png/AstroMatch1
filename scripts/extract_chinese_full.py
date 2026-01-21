import os
import re
import json

def extract_chinese_compat(file_path):
    """Extract Chinese sign compatibility with heading, tagline, and description."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get the sign name from file path
    sign_name = file_path.split('/')[-2].capitalize()
    
    compat_data = {}
    
    # Find all compatibility sections
    # Pattern: <h3...>Sign1 × Sign2 — Classification</h3><p...>Tagline</p><p>Description</p>
    pattern = r'<h3[^>]*>\s*([^<]+?)\s*×\s*([^<]+?)\s*—\s*([^<]+?)\s*</h3>\s*<p[^>]*>\s*([^<]+?)\s*</p>\s*<p[^>]*>\s*(.+?)\s*</p>'
    
    matches = re.finditer(pattern, content, re.DOTALL)
    
    for match in matches:
        sign1 = match.group(1).strip()
        sign2 = match.group(2).strip()
        classification = match.group(3).strip()
        tagline = match.group(4).strip()
        description = match.group(5).strip()
        
        # Clean up the description (remove HTML tags if any)
        description = re.sub(r'<[^>]+>', '', description)
        description = ' '.join(description.split())
        
        # Create a key from the two signs
        key = f"{sign1}-{sign2}"
        
        compat_data[key] = {
            "heading": f"{sign1} × {sign2} — {classification}",
            "tagline": tagline,
            "description": description
        }
    
    return compat_data

def main():
    base_dir = "/Users/scottwhite/Desktop/AstroMatch1/app/astrology/guide/next"
    
    # Chinese animals
    chinese_animals = [
        "rat", "ox", "tiger", "rabbit", "dragon", "snake",
        "horse", "goat", "monkey", "rooster", "dog", "pig"
    ]
    
    all_chinese_compat = {}
    
    # Extract Chinese compatibility
    for animal in chinese_animals:
        file_path = os.path.join(base_dir, animal, "page.tsx")
        if os.path.exists(file_path):
            print(f"Processing {animal}...")
            compat = extract_chinese_compat(file_path)
            all_chinese_compat.update(compat)
    
    # Save to JSON
    os.makedirs("output", exist_ok=True)
    
    with open("output/chinese_compat_full.json", "w", encoding="utf-8") as f:
        json.dump(all_chinese_compat, f, indent=2, ensure_ascii=False)
    
    print(f"\nExtracted {len(all_chinese_compat)} Chinese compatibility entries")
    print("Saved to output/chinese_compat_full.json")

if __name__ == "__main__":
    main()

