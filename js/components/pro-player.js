/**
 * "My favorite pro player": player card with animated stat bars,
 * a looping kill feed, and a note.
 * Animations start when the section scrolls into view.
 */

import { $, escapeHtml, paragraphs } from "../utils/dom.js";

const FEED_INTERVAL = 1700;
const FEED_MAX = 5;

const statHtml = ({ label, value }) => {
  const overflow = value > 100;
  return `
    <li class="pro-stat${overflow ? " pro-stat--overflow" : ""}">
      <div class="pro-stat__row">
        <span>${escapeHtml(label)}</span>
        <b>${overflow ? "off the charts" : value}</b>
      </div>
      <div class="pro-stat__bar"><span data-fill="${Math.min(value, 100)}"></span></div>
    </li>`;
};

const feedLineHtml = ([who, target, how]) => `
  <li class="killfeed__line">
    <b class="killfeed__who">${escapeHtml(who)}</b>
    <span class="killfeed__icon" aria-hidden="true">⌖</span>
    <span class="killfeed__target">${escapeHtml(target)}</span>
    <em class="killfeed__how">${escapeHtml(how)}</em>
  </li>`;

export function initProPlayer({ card, stats, feed, note, sign }) {
  const section = $("#pro");

  $("#pro-card").innerHTML = `
    <div class="pro-card__top">
      <span class="pro-card__badge">${escapeHtml(card.badge)}</span>
      <span class="pro-card__rank">${escapeHtml(card.rank)}</span>
    </div>
    <div class="pro-card__avatar"><img src="${escapeHtml(card.photo)}" alt="My favorite player" loading="lazy" /></div>
    <h3 class="pro-card__name">${escapeHtml(card.name)}</h3>
    <p class="pro-card__role">${escapeHtml(card.role)}</p>
    <ul class="pro-card__stats">${stats.map(statHtml).join("")}</ul>`;

  $("#pro-note").innerHTML = `${paragraphs(note)}<p class="pro-note__sign">${escapeHtml(sign)}</p>`;

  const feedList = $("#killfeed");
  let feedIndex = 0;
  let feedTimer = null;

  const pushFeedLine = () => {
    feedList.insertAdjacentHTML("afterbegin", feedLineHtml(feed[feedIndex % feed.length]));
    feedIndex++;
    while (feedList.children.length > FEED_MAX) feedList.lastElementChild.remove();
  };

  const start = () => {
    section.querySelectorAll("[data-fill]").forEach((bar) => (bar.style.width = `${bar.dataset.fill}%`));
    if (feedTimer) return;
    for (let i = 0; i < 3; i++) pushFeedLine();
    feedTimer = setInterval(pushFeedLine, FEED_INTERVAL);
  };
  const stop = () => {
    clearInterval(feedTimer);
    feedTimer = null;
  };

  // Only run the kill feed while the section is on screen.
  new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0.2 }
  ).observe(section);
}
