import styles from "./PixelLoader.css?inline";
import getCoords from "../modules/getCoords.js";

const MAX_PIXELS = 1000;
const PIXEL_SIZE = 3;

CSS.registerProperty({
  name: "--loading",
  syntax: "<percentage>",
  inherits: true,
  initialValue: "0%"
});

class PixelLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.init();
  }

  static get styles() {
    return styles;
  }

  init() {
    this.canvas = document.createElement("canvas");
    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    this.append(this.canvas, this.overlay);
    this.ctx = this.canvas.getContext("2d");
    this.pixels = [];
  }

  connectedCallback() {
    this.render();
    this.initLoader();
    this.gameLoop();
  }

  initLoader() {
    this.canvas.width = parseFloat(getComputedStyle(this).width);
    this.canvas.height = 35;

    for (let i = 0; i < MAX_PIXELS; i++) {
      const { x, y } = getCoords(this.canvas.width);
      const fading = false;
      const opacity = Math.min(0.5 + Math.random(), 1);
      this.pixels.push({ x, y, opacity });
    }
  }

  update() {
    this.pixels.forEach(pixel => {
      if (pixel.opacity === 0) {
        pixel.fading = false;
        pixel.opacity = Math.min(0.25 + Math.random(), 1);
        const { x, y } = getCoords(this.canvas.width);
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

  setLoad(percentage) {
    this.style.setProperty("--loading", `${percentage}%`);
  }

  off() {
    const keyframes = {
      opacity: [1, 0]
    };
    const options = {
      duration: 2000,
      fill: "forwards"
    };
    this.canvas.animate(keyframes, options);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pixels.forEach(({ x, y, opacity }) => {
      this.ctx.fillStyle = `rgb(255, 255, 255, ${opacity})`;
      this.ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    });
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  render() {
    this.shadowRoot.setHTMLUnsafe(/* html */`
    <style>${PixelLoader.styles}</style>
    <slot></slot>`);
  }
}

customElements.define("pixel-loader", PixelLoader);
