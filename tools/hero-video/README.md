# Hero flythrough

The homepage hero video is generated, not filmed: a night massing model of a
city, an alley, a lit side door, and a factory floor with the operating line
running through it. `scene.html` builds the scene in three.js and exposes
`renderFrame(seconds)`; `render.mjs` steps it frame by frame in headless
Chromium and encodes the result with ffmpeg.

```
npm i -D three            # already in devDependencies
npx playwright install chromium   # or point CHROMIUM at a binary
FFMPEG=/path/to/ffmpeg node tools/hero-video/render.mjs out 30 24
```

Outputs `hero-flythrough.mp4`, `hero-flythrough.webm`, and `hero-poster.jpg`
in `out/`. Copy the mp4 and poster into `public/media/`, plus a 480p encode
for phones:

```
ffmpeg -i out/hero-flythrough.mp4 -vf scale=854:480 -c:v libx264 -crf 26 \
  -pix_fmt yuv420p -movflags +faststart -an public/media/hero-flythrough-480.mp4
```

Rendering takes about 20 minutes in software GL. Edit the camera keyframes
(`P` and `T` in `scene.html`) to change the flight.
