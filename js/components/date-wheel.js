/**
 * Spin-the-wheel date picker drawn on a canvas.
 * The pointer sits at the top; the wheel eases out and lands on a random idea.
 */

import { $, escapeHtml, replayAnimation } from "../utils/dom.js";
import { burstFrom } from "../utils/effects.js";

const COLORS = ["#ff8fab", "#ffd6e4", "#fb6f92", "#ffe6ee", "#e63e72", "#ffb3cb"];
const DARK_TEXT = "#4a0f24";
const SPIN_MS = 4800;
const TAU = Math.PI * 2;

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export function initDateWheel(ideas) {
  const canvas = $("#wheel-canvas");
  const ctx = canvas.getContext("2d");
  const spinBtn = $("#wheel-spin");
  const result = $("#wheel-result");
  const arc = TAU / ideas.length;

  let size = 0;
  let rotation = 0;
  let spinning = false;

  function draw() {
    const r = size / 2;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(r, r);

    ideas.forEach((idea, i) => {
      const start = rotation - Math.PI / 2 + i * arc;
      const color = COLORS[i % COLORS.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r - 6, start, start + arc);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Label along the middle of the slice.
      ctx.save();
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const light = ["#ffd6e4", "#ffe6ee", "#ffb3cb"].includes(color);
      ctx.fillStyle = light ? DARK_TEXT : "#fff";
      ctx.font = `700 ${Math.max(11, size / 30)}px 'DM Sans', sans-serif`;
      ctx.fillText(idea.short, r - 22, 0);
      const labelWidth = ctx.measureText(idea.short).width;
      ctx.font = `${Math.max(14, size / 24)}px serif`;
      ctx.fillText(idea.emoji, r - 22 - labelWidth - 6, 0);
      ctx.restore();
    });

    // Outer ring + center hub.
    ctx.beginPath();
    ctx.arc(0, 0, r - 4, 0, TAU);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.09, 0, TAU);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(164, 19, 60, .35)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = `${size * 0.08}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💗", 0, 2);

    ctx.restore();
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function spin() {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    result.hidden = true;

    const target = Math.floor(Math.random() * ideas.length);
    // Rotation that puts the target slice's center under the top pointer,
    // plus a little wobble so it doesn't always land dead center.
    const jitter = (Math.random() - 0.5) * arc * 0.6;
    const targetMod = (((-(target + 0.5) * arc + jitter) % TAU) + TAU) % TAU;
    const currentMod = ((rotation % TAU) + TAU) % TAU;
    const delta = (targetMod - currentMod + TAU) % TAU;
    const startRotation = rotation;
    const endRotation = rotation + TAU * 6 + delta;
    const startTime = performance.now();

    const frame = (now) => {
      const t = Math.min(1, (now - startTime) / SPIN_MS);
      rotation = startRotation + (endRotation - startRotation) * easeOutQuart(t);
      draw();
      if (t < 1) return requestAnimationFrame(frame);

      spinning = false;
      spinBtn.disabled = false;
      spinBtn.textContent = "Spin again 🎡";
      showResult(ideas[target]);
    };
    requestAnimationFrame(frame);
  }

  function showResult(idea) {
    result.innerHTML = `
      <span class="wheel__result-emoji" aria-hidden="true">${idea.emoji}</span>
      <p class="wheel__result-kicker">our next date is…</p>
      <p class="wheel__result-text">${escapeHtml(idea.full)}</p>
      <p class="wheel__result-claim">screenshot this to claim it 📸</p>`;
    result.hidden = false;
    replayAnimation(result, "is-popping");
    burstFrom(result, 16);
  }

  spinBtn.addEventListener("click", spin);
  new ResizeObserver(resize).observe(canvas);
  document.fonts?.ready.then(draw);
  resize();
}
