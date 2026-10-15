from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json

root = Path(__file__).resolve().parent.parent
files = sorted(root.glob('Personal/**/*.png'))
flags = []
iso = []
for path in files:
    with Image.open(path) as image:
        image.load()
        gray = image.convert('RGB').convert('L')
        bbox = gray.point(lambda p: 255 if p < 235 else 0).getbbox()
        if not bbox:
            flags.append({'path': str(path.relative_to(root)), 'reason': 'blank'})
        elif min(bbox[0], bbox[1], image.width-bbox[2], image.height-bbox[3]) < 12:
            flags.append({'path': str(path.relative_to(root)), 'reason': 'near_border', 'bbox':bbox})
        if path.name.endswith('_Isometric.png'):
            iso.append(path)
cols = 4
tilew, tileh = 480, 355
rows = (len(iso)+cols-1)//cols
sheet = Image.new('RGB', (cols*tilew, max(rows,1)*tileh), '#e7e7e7')
draw = ImageDraw.Draw(sheet)
for i, path in enumerate(iso):
    x, y = (i%cols)*tilew, (i//cols)*tileh
    with Image.open(path) as image:
        tile = ImageOps.contain(image.convert('RGB'), (470,313))
        sheet.paste(tile, (x+(tilew-tile.width)//2,y+5))
    name = path.name.replace('_Isometric.png','')
    draw.text((x+8,y+321), name[:54], fill='black')
    draw.text((x+8,y+336), str(path.parent.parent.relative_to(root))[:64], fill='#444444')
sheet.save(root / '_automation' / 'quality-review.png')
(root / '_automation' / 'image-check.json').write_text(json.dumps({'image_count':len(files),'flags':flags},indent=2))
print(json.dumps({'image_count':len(files),'flags':flags},indent=2))
