from collections import deque
from pathlib import Path
import sys

from PIL import Image, ImageFilter


workspace = Path(__file__).resolve().parents[1]
source_path = Path(sys.argv[1]) if len(sys.argv) > 1 else workspace / "public" / "pochacco" / "login-terminal-pixel.png"
image_path = workspace / "public" / "pochacco" / "login-terminal-pixel.png"
image = Image.open(source_path).convert("RGBA")
pixels = image.load()
width, height = image.size


def is_background(x: int, y: int) -> bool:
    red, green, blue, _ = pixels[x, y]
    return max(red, green, blue) - min(red, green, blue) <= 4 and min(red, green, blue) >= 228


barrier = Image.new("L", image.size)
barrier_pixels = barrier.load()
for y in range(height):
    for x in range(width):
        if not is_background(x, y):
            barrier_pixels[x, y] = 255

# The character contains large cream-white regions similar to the generated
# checkerboard. Closing tiny outline gaps keeps those regions inside the art.
barrier = barrier.filter(ImageFilter.MaxFilter(9))
barrier_pixels = barrier.load()

queue: deque[tuple[int, int]] = deque()
visited: set[tuple[int, int]] = set()

for x in range(width):
    queue.extend(((x, 0), (x, height - 1)))
for y in range(height):
    queue.extend(((0, y), (width - 1, y)))

while queue:
    x, y = queue.popleft()
    if (x, y) in visited or barrier_pixels[x, y]:
        continue
    visited.add((x, y))
    if x:
        queue.append((x - 1, y))
    if x + 1 < width:
        queue.append((x + 1, y))
    if y:
        queue.append((x, y - 1))
    if y + 1 < height:
        queue.append((x, y + 1))

for x, y in visited:
    pixels[x, y] = (*pixels[x, y][:3], 0)

image.save(image_path, optimize=True)
print(f"Removed {len(visited):,} connected checkerboard pixels from {image_path.name}")
