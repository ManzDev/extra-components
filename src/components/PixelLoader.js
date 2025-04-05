import styles from "./PixelLoader.css?inline";
import getCoords from "../modules/getCoords.js";
import { getContextCanvasFromImage, getPixelColor } from "../modules/getPixelColor.js";

const MAX_PIXELS = 1500;
const PIXEL_SIZE = 3;
const COLOR_OFFSET = 100;
const PIXEL_ZONE_HEIGHT = 5;

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
    this.loaded = false;
  }

  static get styles() {
    return styles;
  }

  init() {
    if (this.children[0].complete) {
      this.loaded = true;
      this.style.setProperty("--width", this.children[0].width + "px");
      this.style.setProperty("--height", this.children[0].height + "px");
    }
    this.canvas = document.createElement("canvas");
    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    this.append(this.canvas, this.overlay);
    this.ctx = this.canvas.getContext("2d");
    this.pixels = [];
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", () => {
      this.initLoader();
      this.gameLoop();
      setTimeout(() => this.setLoad(110), 500);
    });
  }

  createPixel() {
    const percentage = parseInt(getComputedStyle(this).getPropertyValue("--loading"));
    const value = Math.trunc(this.canvas.height * (percentage / 100));
    const { x, y } = getCoords(this.canvas.width, PIXEL_ZONE_HEIGHT);
    const fading = false;
    const opacity = Math.min(0.25 + Math.random(), 1);
    return { x, y, fading, opacity, value }
  }

  initLoader() {
    this.canvas.width = parseFloat(getComputedStyle(this).width);
    this.canvas.height = parseFloat(getComputedStyle(this).height);
    this.ctxImage = getContextCanvasFromImage(this.children[0]);

    for (let i = 0; i < MAX_PIXELS; i++) {
      const incr = Math.random() > 0.5 ? 1 : -1;
      const { x, y, value, fading, opacity } = this.createPixel();
      this.pixels.push({ x, y: y + value, opacity, incr });
    }
  }

  update() {
    this.pixels.forEach(pixel => {
      if (pixel.opacity === 0) {
        const { x, y, value, fading, opacity } = this.createPixel();
        pixel.fading = fading;
        pixel.opacity = opacity;
        pixel.x = x;
        pixel.y = y + value;
      }

      if (Math.random() > 0.5)
        pixel.fading = true;

      if (pixel.fading && Math.random() > 0.01) {
        pixel.opacity = Math.max(0, pixel.opacity - 0.005);
        if (Math.random() > 0.8) {
          pixel.y += pixel.incr;
        }
      }
    });
  }

  setLoad(percentage) {
    this.style.setProperty("--loading", `${percentage}%`);
  }

  // off() {
  //   const keyframes = {
  //     opacity: [1, 0]
  //   };
  //   const options = {
  //     duration: 2000,
  //     fill: "forwards"
  //   };
  //   this.canvas.animate(keyframes, options);
  // }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pixels.forEach(({ x, y, opacity }) => {
      const { r, g, b } = getPixelColor(this.ctxImage, x, y);
      this.ctx.fillStyle = `rgb(${r + COLOR_OFFSET}, ${g + COLOR_OFFSET}, ${b + COLOR_OFFSET}, ${opacity})`;
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
