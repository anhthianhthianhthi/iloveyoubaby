/** Soft floating hearts drawn on the fixed background canvas. */

const COLORS = ["#ffb3cb", "#ff8fab", "#ffd6e4", "#fb6f92", "#c9a7eb"];

export function initHeartsBackground(canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width, height, hearts;

  const spawn = (anywhere) => ({
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 20,
    size: 6 + Math.random() * 12,
    speed: 0.2 + Math.random() * 0.5,
    sway: Math.random() * Math.PI * 2,
    alpha: 0.18 + Math.random() * 0.3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  });

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(28, width / 45));
    hearts = Array.from({ length: count }, () => spawn(true));
  }

  function drawHeart({ size, color, alpha }, x, y) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.scale(size / 16, size / 16);
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-8, -2, -6, -10, 0, -5);
    ctx.bezierCurveTo(6, -10, 8, -2, 0, 5);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    for (const heart of hearts) {
      heart.y -= heart.speed;
      heart.sway += 0.01;
      if (heart.y < -20) Object.assign(heart, spawn(false));
      drawHeart(heart, heart.x + Math.sin(heart.sway) * 14, heart.y);
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
}
