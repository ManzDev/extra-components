// width = ancho
// height = alto del fragmento activo de pixels
export default (width, height = 10) => {
  const x = Math.floor(Math.random() * width);

  const isCenter = Math.random() > 0.05;
  const half = Math.floor(height / 2);

  const y = isCenter ?
    Math.random() * height :
    half + Math.random() * half;

  return { x, y };
}
