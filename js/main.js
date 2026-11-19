/**
 * Entry point: wires the data into each component.
 * Content lives in /js/data, settings in /js/config.js.
 */

import { $, $$ } from "./utils/dom.js";
import { initReveal } from "./utils/effects.js";

import { SECRET_PASSWORD, SECRET_HINT, LETTER_SIGN_OFF, TYPED_LINES, GREETINGS, SONG } from "./config.js";
import { DATE_IDEAS } from "./data/date-ideas.js";
import { initGreeting } from "./components/greeting.js";
import { initMusic } from "./components/music.js";
import { initDateWheel } from "./components/date-wheel.js";
import { TIMELINE } from "./data/timeline.js";
import { PHOTOS } from "./data/photos.js";
import { LETTERS } from "./data/letters.js";
import { REASONS } from "./data/reasons.js";
import { SECRET_LETTER } from "./data/secret-letter.js";
import { COUPONS } from "./data/coupons.js";
import { PRO_CARD, PRO_STATS, KILL_FEED, PRO_NOTE, PRO_SIGN } from "./data/pro.js";
import { initProPlayer } from "./components/pro-player.js";

import { initHeartsBackground } from "./components/hearts-background.js";
import { initTypewriter } from "./components/typewriter.js";
import { initNav } from "./components/nav.js";
import { initModal } from "./components/modal.js";
import { renderTimeline } from "./components/timeline.js";
import { renderGallery } from "./components/gallery.js";
import { renderLetters } from "./components/letters.js";
import { initReasons } from "./components/reasons.js";
import { initSecret } from "./components/secret.js";
import { initIntro } from "./components/intro.js";
import { initCoupons } from "./components/coupons.js";
import { initSushiGame } from "./components/sushi-game.js";
import { initPumpkinHunt } from "./components/pumpkin-hunt.js";

initMusic(SONG); // before the intro, so the "Yes" click can start the song
initIntro();
initHeartsBackground($("#hearts-bg"));
initGreeting($("#greeting"), GREETINGS);
initTypewriter($("#typed"), TYPED_LINES);
initModal();

renderTimeline($("#timeline"), TIMELINE);
renderGallery($("#gallery-grid"), PHOTOS);
initProPlayer({ card: PRO_CARD, stats: PRO_STATS, feed: KILL_FEED, note: PRO_NOTE, sign: PRO_SIGN });
renderLetters($("#letters-grid"), LETTERS, LETTER_SIGN_OFF);
initReasons(REASONS);
initCoupons($("#coupons-grid"), COUPONS);
initDateWheel(DATE_IDEAS);
initSushiGame();
initSecret({ password: SECRET_PASSWORD, hint: SECRET_HINT, letter: SECRET_LETTER });
initPumpkinHunt(); // after the timeline renders, since a pumpkin hides inside it

initNav($$(".nav__links a"), $$("main section"));
initReveal();
