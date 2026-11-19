/**
 * "Feed me sushi" — catch falling food with 😋, dodge 😤 ragebait.
 * 30 seconds, 3 hearts. Best score is saved.
 */

import { $, replayAnimation } from "../utils/dom.js";
import { storage } from "../utils/storage.js";
import { burstFrom } from "../utils/effects.js";

const GOOD = ["🍣", "🍙", "🍤", "🍱"];
const BONUS = "💗";
const BAD = "😤";
const PLAYER = "😋";

const DURATION = 30;
const LIVES = 3;
const BEST_KEY = "sushiBest";
const KEY_SPEED = 520;

const endMessage = (score) => {
  if (score >= 40) return "Chef's kiss. You can feed me forever, love.";
  if (score >= 25) return "I'm full and in love. Good job, my love.";
  if (score >= 12) return "Not bad, bro… but I'm still a little hungry.";
  return "I'm starvinggg. Is this ragebait?";
};

export function initSushiGame() {
  const stage = $("#game-stage");
  const canvas = $("#game-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = $("#game-overlay");
  const title = $("#game-title");
  const text = $("#game-text");
  const startBtn = $("#game-start");
  const bestEl = $("#game-best");
  const scoreEl = $("#game-score");
  const timeEl = $("#game-time");
  const livesEl = $("#game-lives");

  let width = 0;
  let height = 0;
  let playerX = 0;
  let items = [];
  let popups = [];
  let score = 0;
  let lives = LIVES;
  let timeLeft = DURATION;
  let spawnTimer = 0;
  let lastTime = 0;
  let running = false;
  const keys = { left: false, right: false };
  let best = storage.get(BEST_KEY, 0);

  const playerY = () => height - 36;
  const clampPlayer = () => (playerX = Math.min(Math.max(playerX, 30), width - 30));

  /* ---------- drawing ---------- */
  function drawPlayer() {
    ctx.font = "48px serif";
    ctx.fillText(PLAYER, playerX, playerY());
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 1;

    ctx.font = "34px serif";
    for (const item of items) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(Math.sin(item.spin) * 0.4);
      ctx.fillText(item.emoji, 0, 0);
      ctx.restore();
    }

    drawPlayer();

    ctx.font = "700 22px 'DM Sans', sans-serif";
    for (const p of popups) {
      ctx.globalAlpha = Math.min(1, p.life / 0.5);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y - (0.8 - p.life) * 60);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
  }

  function updateHud() {
    scoreEl.textContent = score;
    timeEl.textContent = Math.ceil(timeLeft);
    livesEl.textContent = "💗".repeat(lives) + "🤍".repeat(LIVES - lives);
  }

  const showBest = () => (bestEl.textContent = best ? `Best score: ${best} 🍣` : "");

  /* ---------- game logic ---------- */
  function spawn() {
    const roll = Math.random();
    let type = "good";
    let emoji = GOOD[Math.floor(Math.random() * GOOD.length)];
    if (roll < 0.07) { type = "bonus"; emoji = BONUS; }
    else if (roll < 0.27) { type = "bad"; emoji = BAD; }

    const progress = 1 - timeLeft / DURATION; // gets faster over time
    items.push({
      x: 24 + Math.random() * (width - 48),
      y: -30,
      speed: (140 + Math.random() * 80) * (1 + progress * 0.9),
      spin: Math.random() * Math.PI,
      emoji,
      type,
    });
  }

  const popup = (text, item, color = "#e63e72") => popups.push({ text, x: item.x, y: item.y, life: 0.8, color });

  function collect(item) {
    if (item.type === "good") {
      score += 1;
      popup("+1", item);
    } else if (item.type === "bonus") {
      score += 3;
      popup("+3 💗", item);
    } else {
      lives -= 1;
      popup("ragebait!", item, "#a4133c");
      replayAnimation(stage, "is-hit");
      if (lives <= 0) end();
    }
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      end();
      return;
    }

    if (keys.left) playerX -= KEY_SPEED * dt;
    if (keys.right) playerX += KEY_SPEED * dt;
    clampPlayer();

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawn();
      spawnTimer = Math.max(0.28, 0.75 - (1 - timeLeft / DURATION) * 0.45);
    }

    const catchY = playerY();
    for (const item of items) {
      item.y += item.speed * dt;
      item.spin += dt * 3;
      const inReach = item.y > catchY - 30 && item.y < catchY + 20 && Math.abs(item.x - playerX) < 42;
      if (!item.gone && inReach) {
        item.gone = true;
        collect(item);
      }
      if (item.y > height + 40) item.gone = true;
    }
    items = items.filter((i) => !i.gone);
    popups = popups.filter((p) => (p.life -= dt) > 0);

    draw();
    updateHud();
    if (running) requestAnimationFrame(tick);
  }

  function start() {
    items = [];
    popups = [];
    score = 0;
    lives = LIVES;
    timeLeft = DURATION;
    spawnTimer = 0;
    running = true;
    overlay.hidden = true;
    updateHud();
    lastTime = performance.now();
    requestAnimationFrame(tick);
  }

  function end() {
    if (!running) return;
    running = false;
    updateHud();
    if (score > best) {
      best = score;
      storage.set(BEST_KEY, best);
    }
    title.textContent = `You fed me ${score} ${score === 1 ? "piece" : "pieces"}!`;
    text.textContent = endMessage(score);
    startBtn.textContent = "Play again 🍣";
    showBest();
    overlay.hidden = false;
    burstFrom(stage, score >= 25 ? 24 : 10);
  }

  /* ---------- setup ---------- */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = stage.clientWidth;
    height = stage.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!playerX) playerX = width / 2;
    clampPlayer();
    if (!running) draw();
  }

  const followPointer = (e) => {
    playerX = e.clientX - canvas.getBoundingClientRect().left;
    clampPlayer();
  };
  canvas.addEventListener("pointermove", followPointer);
  canvas.addEventListener("pointerdown", followPointer);

  document.addEventListener("keydown", (e) => {
    if (!running) return;
    if (e.key === "ArrowLeft") { keys.left = true; e.preventDefault(); }
    if (e.key === "ArrowRight") { keys.right = true; e.preventDefault(); }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
  });

  startBtn.addEventListener("click", start);
  window.addEventListener("resize", resize);
  showBest();
  updateHud();
  resize();
}
