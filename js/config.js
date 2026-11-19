/**
 * Site-wide settings. Change these freely.
 */

/** Password for the secret page (not case-sensitive). */
export const SECRET_PASSWORD = "cookie";

/** Hint shown under the password box. */
export const SECRET_HINT = "hint: the name of our massive child 🧸 (lowercase)";

/** How every "open when" letter is signed. */
export const LETTER_SIGN_OFF = "love you always, your girl ♡";

/** Lines the hero subtitle types out, on repeat. */
export const TYPED_LINES = [
  "the calmest, funniest, most handsome man I know.",
  "the one who made me feel safe from day one.",
  "a Counter-Strike pro and a certified genius. 🎯",
  "Cookie's other parent. 🧸",
  "my love, my bro, my everything.",
  "the love of my life. ♡",
];

/**
 * Greeting at the top of the page, depending on the time of day.
 * `from` / `to` are hours (24h). The first match wins.
 */
export const GREETINGS = [
  { from: 0, to: 5, text: "bro why are you awake, go sleep 😤 (ok fine, I miss you too)" },
  { from: 5, to: 11, text: "good morninggg my love ☀️" },
  { from: 11, to: 14, text: "hi my love, did you eat yet? 🍽️" },
  { from: 14, to: 18, text: "good afternoon handsome 🌷" },
  { from: 18, to: 22, text: "good evening my love 🌙" },
  { from: 22, to: 24, text: "it's late bro… go sleep soon okayyy 😴" },
];

/**
 * Our song. If the mp3 isn't there, the music button simply doesn't show up.
 * Timed lyrics are fetched automatically from lrclib.net using title + artist,
 * so to change the song you only change these lines (and the mp3).
 *
 * lyricsOffset: "auto" shifts the lyrics by however much longer your mp3 is
 * than the official track (e.g. a music-video intro). If they're still off,
 * put a number of seconds instead: bigger = lyrics show later.
 */
export const SONG = {
  src: "audio/nothing.mp3",
  title: "Nothing",
  artist: "Bruno Major",
  lyricsOffset: "auto",
};
