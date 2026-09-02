from pathlib import Path
import sys

from PIL import Image, ImageOps


workspace = Path(sys.argv[1])
generated_terminal = Path(sys.argv[2])
source_photo = Path(sys.argv[3])
source_meme = Path(sys.argv[4])


def save_png(source: Path, target: Path, max_size: int) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        image.save(target, "PNG", optimize=True)


def save_jpeg(source: Path, target: Path, max_size: int = 1800) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        image.save(target, "JPEG", quality=84, optimize=True, progressive=True)


save_png(generated_terminal, workspace / "public/pochacco/login-terminal-pixel.png", 1400)
save_jpeg(source_photo, workspace / "public/photos/memories/nerdy-youtube.jpg")
save_png(source_meme, workspace / "public/meme/meme.png", 1600)

for relative in (
    "public/pochacco/login-terminal-pixel.png",
    "public/photos/memories/nerdy-youtube.jpg",
    "public/meme/meme.png",
):
    path = workspace / relative
    print(f"{relative}: {path.stat().st_size / 1024:.0f} KB")
