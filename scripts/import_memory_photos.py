from pathlib import Path
import shutil
import sys

from PIL import Image, ImageOps


source = Path(sys.argv[1])
destination = Path(sys.argv[2])
destination.mkdir(parents=True, exist_ok=True)

images = sorted(
    [path for path in source.iterdir() if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}],
    key=lambda path: path.name,
)

for index, path in enumerate(images, 1):
    target = destination / f"memory-{index:02d}.jpg"
    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        image.save(target, "JPEG", quality=84, optimize=True, progressive=True)
    print(f"{target.name}: {target.stat().st_size / 1024:.0f} KB")

for path in source.iterdir():
    if path.suffix.lower() != ".mov":
        continue
    target_name = "video-guanghua.mov" if "光華" in path.name else "video-karaoke.mov"
    shutil.copy2(path, destination / target_name)
    print(f"{target_name}: copied")
