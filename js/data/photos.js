/**
 * Every photo on the site.
 * - `id` is used by the timeline to show a photo inside a chapter.
 * - The gallery shows them all, in this order.
 * To add a photo: drop it in /images and add a line here.
 */
export const PHOTOS = [
  { id: "first-date",         src: "images/first-date.jpeg",         caption: "our first date ♡" },
  { id: "terras-date",        src: "images/terras-date.jpeg",        caption: "another terrace date ☀️" },
  { id: "second-date",        src: "images/second-date.jpeg",        caption: "date #2 in Ommen 🍦" },
  { id: "sushi-date",         src: "images/sushi-date.jpeg",         caption: "date #3 in Zwolle 🥢" },
  { id: "flowers",            src: "images/flowers.jpeg",            caption: "purple flowers for my purple boy 💜" },
  { id: "pink-flowers",       src: "images/pink-flowers.jpeg",       caption: "my pink flowers 🌸" },
  { id: "my-fav",             src: "images/my-fav.jpeg",             caption: "my fav ♡" },
  { id: "photograph-skill",   src: "images/photograph-skill.jpeg",   caption: "your photography skills >>>" },
  { id: "skill",              src: "images/skill.jpeg",              caption: "another masterpiece by you 📸" },
  { id: "greek-restaurant",   src: "images/greek-restaurant.jpeg",   caption: "Greek dinner date (photo by you)" },
  { id: "lacubanita",         src: "images/lacubanita.jpeg",         caption: "La Cubanita 🍹 (photo by you)" },
  { id: "first-promise-ring", src: "images/first-promise-ring.jpeg", caption: "our first promise ring (a hair tie)" },
  { id: "airport",            src: "images/airport.jpeg",            caption: "welcome home from Portugal ✈️" },
  { id: "birthday",           src: "images/birthday.jpeg",           caption: "my birthday & Cookie 🧸" },
  { id: "the-ring",           src: "images/the-ring.jpeg",           caption: "our rings 💍" },
  { id: "his-wallet",         src: "images/his-wallet.jpeg",         caption: "me, in your wallet" },
  { id: "alcohol",            src: "images/alcohol.jpeg",            caption: "first drinks at your place 🍷 (it was all downhill from here)" },
  { id: "club",               src: "images/club.jpeg",               caption: "drinks night 🍸" },
  { id: "sleeping-angel",     src: "images/sleeping-angel.jpeg",     caption: "sleeping angel 😴" },
  { id: "first-movie",        src: "images/first-movie.jpeg",        caption: "movie night (we did not finish it) 🎬" },
  { id: "handsome",           src: "images/handsome.jpeg",           caption: "so handsome it should be illegal" },
  { id: "gangster",           src: "images/gangster.jpeg",           caption: "gangster mode 😎" },
  { id: "sassy",              src: "images/sassy.jpeg",              caption: "your sassy girl 💅" },
  { id: "favorite-view",      src: "images/favorite-view.jpeg",      caption: "my favorite view" },
];

/** Look up photos by id. Unknown ids are skipped. */
export const getPhotos = (ids = []) =>
  ids.map((id) => PHOTOS.find((p) => p.id === id)).filter(Boolean);
