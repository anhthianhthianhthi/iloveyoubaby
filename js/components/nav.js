/** Highlights the nav link of the section currently on screen. */

export function initNav(links, sections) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = `#${entry.target.id}`;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === target));
      }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}
