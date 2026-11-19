/** Types each line, pauses, deletes it, moves on. Loops forever. */

export function initTypewriter(el, lines, { typeSpeed = 55, deleteSpeed = 25, pause = 2000 } = {}) {
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function step() {
    const line = lines[lineIndex];
    el.textContent = line.slice(0, charIndex);

    if (!deleting && charIndex < line.length) {
      charIndex++;
      setTimeout(step, typeSpeed);
    } else if (!deleting) {
      deleting = true;
      setTimeout(step, pause);
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(step, deleteSpeed);
    } else {
      deleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      setTimeout(step, 400);
    }
  }

  step();
}
