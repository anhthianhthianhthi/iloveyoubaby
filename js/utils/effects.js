/** Visual effects: heart bursts + scroll-reveal. */

const BURST_EMOJIS = ["💗", "💖", "💕", "🩷", "💘"];

/** Pop a little burst of hearts at screen position (x, y). */
export function burstHearts(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 90;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--dy", `${Math.sin(angle) * distance - 40}px`);
    heart.style.setProperty("--rot", `${Math.random() * 80 - 40}deg`);

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
  }
}

/** Burst from the center-top of an element. */
export function burstFrom(el, count) {
  const r = el.getBoundingClientRect();
  burstHearts(r.left + r.width / 2, Math.max(120, r.top + 60), count);
}

/** Fade in every `.reveal` element when it scrolls into view. */
export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
