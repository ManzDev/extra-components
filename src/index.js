CSS.registerProperty({
  name: "--loading",
  syntax: "<percentage>",
  inherits: true,
  initialValue: "0%"
});

const MAX_PIXELS = 1000;
const PIXEL_SIZE = 3;
const pixelLoader = document.querySelector("pixel-loader");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const pixels = [];

// 0 .. 35
// 0 .. 10 --> poco probable
// 10 .. 25 --> muy probable
// 25 .. 35 --> poco probable

const getCoords = () => {
  const x = Math.floor(Math.random() * canvas.width);
  // const y = Math.floor(Math.random() * 35);

  // Math.floor(Math.random() * (max-min) + min)
  const y = Math.random() > 0.2 ?
    (10 + Math.random() * 15) :
    (Math.random() > 0.5 ? 20 : 5) + Math.random() * 10;

  return { x, y };
}

const initLoader = () => {
  canvas.width = parseFloat(getComputedStyle(pixelLoader).width);
  canvas.height = 35;

  for (let i = 0; i < MAX_PIXELS; i++) {
    const { x, y } = getCoords();
    const fading = false;
    const opacity = Math.min(0.5 + Math.random(), 1);
    pixels.push({ x, y, opacity });
  }
  window.pixels = pixels;
}

const update = () => {
  pixels.forEach(pixel => {
    if (pixel.opacity === 0) {
      pixel.fading = false;
      pixel.opacity = Math.min(0.25 + Math.random(), 1);
      const { x, y } = getCoords();
      pixel.x = x;
      pixel.y = y;
    }

    if (Math.random() > 0.5)
      pixel.fading = true;

    if (pixel.fading && Math.random() > 0.6) {
      pixel.opacity = Math.max(0, pixel.opacity - 0.005);
      if (Math.random() > 0.9) {
        if (Math.random() > 0.5) {
          pixel.y += 1;
        } else {
          pixel.y -= 1;
        }
      }
    }
  });
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pixels.forEach(({ x, y, opacity }) => {
    ctx.fillStyle = `rgb(255, 255, 255, ${opacity})`;
    ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
  });
}

const gameLoop = () => {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

initLoader();
gameLoop();

// pixelLoader.style.setProperty("--loading", "100%");
// canvas.animate({ opacity: [1, 0] }, { duration: 2000, fill: "forwards" })
