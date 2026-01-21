import json
import os

def normalize_animal(animal):
    """Normalize animal names to match the ChineseAnimal type."""
    return animal.strip()

def make_key(animal1, animal2):
    """Create a canonical key for two animals."""
    animals = sorted([normalize_animal(animal1), normalize_animal(animal2)])
    return f"{animals[0]}-{animals[1]}"

def generate_chinese_ts():
    """Generate chineseConnectionBlurbs.ts with heading, tagline, and description."""
    
    with open("output/chinese_compat_full.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Start building the TypeScript file
    lines = []
    lines.append('// AUTO-GENERATED - Do not edit manually')
    lines.append('// Generated from AstroLab compatibility descriptions')
    lines.append('')
    lines.append('export type ChineseAnimal =')
    lines.append('  | "Rat" | "Ox" | "Tiger" | "Rabbit"')
    lines.append('  | "Dragon" | "Snake" | "Horse" | "Goat"')
    lines.append('  | "Monkey" | "Rooster" | "Dog" | "Pig";')
    lines.append('')
    lines.append('export interface ChineseCompatibilityBlurb {')
    lines.append('  heading: string;')
    lines.append('  tagline: string;')
    lines.append('  description: string;')
    lines.append('}')
    lines.append('')
    lines.append('export const chineseConnectionBlurbs: Record<string, ChineseCompatibilityBlurb> = {')
    
    # Sort keys for consistency
    sorted_keys = sorted(data.keys())
    
    for i, key in enumerate(sorted_keys):
        entry = data[key]
        # Escape quotes and newlines in strings
        heading = entry['heading'].replace('"', '\\"').replace('\n', ' ')
        tagline = entry['tagline'].replace('"', '\\"').replace('\n', ' ')
        description = entry['description'].replace('"', '\\"').replace('\n', ' ')
        
        lines.append(f'  "{key}": {{')
        lines.append(f'    heading: "{heading}",')
        lines.append(f'    tagline: "{tagline}",')
        lines.append(f'    description: "{description}"')
        
        # Add comma except for last entry
        if i < len(sorted_keys) - 1:
            lines.append('  },')
        else:
            lines.append('  }')
    
    lines.append('};')
    lines.append('')
    lines.append('function makeChineseKey(a: ChineseAnimal, b: ChineseAnimal): string {')
    lines.append('  const animals = [a, b].sort();')
    lines.append('  return `${animals[0]}-${animals[1]}`;')
    lines.append('}')
    lines.append('')
    lines.append('export function getChineseConnectionBlurb(')
    lines.append('  a: ChineseAnimal,')
    lines.append('  b: ChineseAnimal')
    lines.append('): ChineseCompatibilityBlurb | null {')
    lines.append('  const key = makeChineseKey(a, b);')
    lines.append('  return chineseConnectionBlurbs[key] || null;')
    lines.append('}')
    
    return '\n'.join(lines)

def main():
    # Generate TypeScript file
    ts_content = generate_chinese_ts()
    
    output_path = "/Users/scottwhite/Desktop/AstroMatch1/lib/astrology/chineseConnectionBlurbs.ts"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
    
    print(f"Generated {output_path}")

if __name__ == "__main__":
    main()

