/** Greets him differently depending on the time of day. Updates every minute. */

export function initGreeting(el, greetings) {
  const update = () => {
    const hour = new Date().getHours();
    const match = greetings.find((g) => hour >= g.from && hour < g.to);
    el.textContent = match ? match.text : "";
    el.hidden = !match;
  };
  update();
  setInterval(update, 60 * 1000);
}
