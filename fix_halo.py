import sys
from PIL import Image

def fix_white_halo(img_path, out_path):
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening {img_path}: {e}")
        return
    data = img.getdata()
    
    new_data = []
    for r, g, b, a in data:
        # Ignore already transparent pixels
        if a == 0:
            new_data.append((r, g, b, a))
            continue
            
        brightness = (r + g + b) / 3.0
        diff = max(abs(r-g), abs(g-b), abs(r-b))
        
        # If it's a bright, unsaturated pixel (near white or light grey)
        if brightness > 210 and diff < 25:
            if brightness > 245:
                new_data.append((r, g, b, 0))
            else:
                # Calculate alpha: 210 -> 255, 245 -> 0
                alpha = int(255 * (245 - brightness) / 35.0)
                # Assume it's a halo from a black outline, so turn the pixel dark
                new_data.append((0, 0, 0, alpha))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Fixed and saved to {out_path}")

if __name__ == "__main__":
    fix_white_halo(sys.argv[1], sys.argv[2])
