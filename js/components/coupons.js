/**
 * Scratch-off coupons. Each card has a pink canvas on top;
 * scratching erases it, and once ~half is gone the coupon reveals itself.
 * They start covered again on every visit.
 */

import { escapeHtml } from "../utils/dom.js";
import { burstFrom } from "../utils/effects.js";

const BRUSH = 44;
const REVEAL_AT = 0.5;

function createScratchLayer(canvas, onReveal) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let drawing = false;
  let last = null;
  let strokes = 0;
  let done = false;
  let paintedWidth = 0;

  function paint() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (!w || !h || done) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintedWidth = w;

    ctx.globalCompositeOperation = "source-over";
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#ff8fab");
    gradient.addColorStop(1, "#e63e72");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255, 255, 255, .18)";
    ctx.font = "18px serif";
    for (let y = 18, row = 0; y < h + 10; y += 34, row++) {
      for (let x = (row % 2) * 20 + 8; x < w; x += 40) ctx.fillText("♥", x, y);
    }

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 32px Caveat, cursive";
    ctx.fillText("scratch me 💗", w / 2, h / 2 - 8);
    ctx.font = "500 13px 'DM Sans', sans-serif";
    ctx.fillText("(finger or mouse)", w / 2, h / 2 + 22);
  }

  const pointFrom = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function scratch(point) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = BRUSH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo((last || point).x, (last || point).y + (last ? 0 : 0.1));
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    last = point;
    if (++strokes % 12 === 0) checkProgress();
  }

  function checkProgress() {
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      sampled++;
      if (data[i] === 0) cleared++;
    }
    if (sampled && cleared / sampled >= REVEAL_AT) reveal();
  }

  function reveal() {
    if (done) return;
    done = true;
    canvas.classList.add("is-revealed");
    onReveal();
    setTimeout(() => canvas.remove(), 700);
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (done) return;
    drawing = true;
    last = null;
    canvas.setPointerCapture(e.pointerId);
    scratch(pointFrom(e));
  });
  canvas.addEventListener("pointermove", (e) => drawing && scratch(pointFrom(e)));
  const stop = () => {
    if (!drawing) return;
    drawing = false;
    checkProgress();
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  // Keyboard users: Enter / Space reveals instantly.
  canvas.tabIndex = 0;
  canvas.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      reveal();
    }
  });

  paint();

  // Paint (again) whenever the card gets a real size or changes width,
  // so the cover never ends up invisible.
  new ResizeObserver(() => {
    if (!done && canvas.offsetWidth && canvas.offsetWidth !== paintedWidth) paint();
  }).observe(canvas);

  return { repaint: () => paint() };
}

export function initCoupons(grid, coupons) {
  // Coupons start covered on every visit, so he can scratch them again and again.
  grid.innerHTML = coupons
    .map(
      (c, i) => `
      <div class="coupon reveal" data-index="${i}">
        <div class="coupon__content">
          <span class="coupon__emoji" aria-hidden="true">${c.emoji}</span>
          <h3>${escapeHtml(c.title)}</h3>
          <p>${escapeHtml(c.text)}</p>
        </div>
        <canvas class="coupon__scratch" aria-label="Scratch to reveal this coupon (or press Enter)"></canvas>
      </div>`
    )
    .join("");

  const layers = [...grid.querySelectorAll(".coupon__scratch")].map((canvas) => {
    const card = canvas.closest(".coupon");
    return createScratchLayer(canvas, () => {
      card.classList.add("is-revealed");
      burstFrom(card, 12);
    });
  });

  // Repaint once the handwriting font has loaded.
  document.fonts?.ready.then(() => layers.forEach((l) => l.repaint()));
}
