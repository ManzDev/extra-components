export const getContextCanvasFromImage = (image) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  return ctx;
}

export const getPixelColor = (ctx, x, y) => {
  const imageData = ctx.getImageData(x, y, 1, 1);
  const [r,g,b] = imageData.data;
  return { r, g, b };
}
