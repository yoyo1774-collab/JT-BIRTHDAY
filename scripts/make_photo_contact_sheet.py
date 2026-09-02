from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont, ImageOps


source = Path(sys.argv[1])
output = Path(sys.argv[2])
files = sorted(
    [path for path in source.iterdir() if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}],
    key=lambda path: path.name,
)

columns = 4
rows = 4
cell_width = 340
cell_height = 270
image_height = 235
font = ImageFont.load_default()
output.mkdir(parents=True, exist_ok=True)

for page_index in range(0, len(files), columns * rows):
    page_files = files[page_index : page_index + columns * rows]
    sheet = Image.new("RGB", (columns * cell_width, rows * cell_height), "#071820")
    draw = ImageDraw.Draw(sheet)
    for local_index, path in enumerate(page_files):
        global_index = page_index + local_index + 1
        x = (local_index % columns) * cell_width
        y = (local_index // columns) * cell_height
        with Image.open(path) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            thumb = ImageOps.contain(image, (cell_width - 12, image_height - 10))
        image_x = x + (cell_width - thumb.width) // 2
        image_y = y + 5 + (image_height - 10 - thumb.height) // 2
        sheet.paste(thumb, (image_x, image_y))
        draw.rectangle((x, y, x + cell_width - 1, y + cell_height - 1), outline="#24484a")
        draw.text((x + 10, y + image_height + 5), f"{global_index:02d}", fill="#8FE3C5", font=font)
    sheet.save(output / f"photo-sheet-{page_index // (columns * rows) + 1}.jpg", quality=88)

for index, path in enumerate(files, 1):
    print(f"{index:02d}\t{path.name}")
