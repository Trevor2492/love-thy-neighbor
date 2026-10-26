const WORDS = [
  "addicted", "incarcerated", "homeless", "annoying", "LGBTQ", "foreign",
  "straight", "gay", "queer", "transgender", "disabled", "different",
  "black", "white", "brown", "Asian", "loud",
  "quiet", "weird", "elderly", "ignorant", "angry", "shy",
  "poor", "rich", "liberal", "conservative",
  "immigrant", "undocumented", "Latino", "indigenous",
  "bisexual", "nonbinary", "autistic", "unemployed", "sick", "lonely",
  "grieving", "rural", "nosy", "stubborn", "selfish", "rude", "widowed",
  "wonderful", "brave", "strong", "resilient", "kind", "generous", "creative",
  "funny", "smart", "talented", "caring", "thoughtful",
  "compassionate", "loyal", "honest", "adventurous", "optimistic", "curious",
  "depressed", "lonely", "anxious", "overwhelmed", "stressed", "confused", "frustrated",
  "successful",
];

const INTERVAL_MS = 2000;
const OUT_MS = 500;
const IN_MS = 500;
const FINAL_OUT_MS = 900;
const DRIFT = "0.2em"; // how far the word slides; keep it subtle

const headline = document.querySelector(".headline");
const slot = document.querySelector(".slot");
const word = slot.querySelector(".slot__word:not(.slot__measure)");
const measure = slot.querySelector(".slot__measure");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stacked = window.matchMedia("(max-width: 40rem)"); // matches the phone media query in styles.css

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let order = shuffle(WORDS);
let index = 0;
let done = false;

function fitSlotTo(text) {
  measure.textContent = text;
  measure.style.fontSize = "";

  // When stacked, shrink long words to fit the screen; short ones keep full size
  let size = "";
  if (stacked.matches) {
    const scale = Math.min(1, headline.clientWidth / measure.offsetWidth);
    size = `${parseFloat(getComputedStyle(measure).fontSize) * scale}px`;
  }
  measure.style.fontSize = size;
  word.style.fontSize = size;

  slot.style.width = `${measure.offsetWidth}px`;
}

async function showNext() {
  const shift = reduceMotion ? "0" : DRIFT;

  await word.animate(
    [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: `translateX(${shift})` },
    ],
    { duration: OUT_MS, easing: "ease-in", fill: "forwards" }
  ).finished;

  index += 1;
  word.textContent = order[index];
  fitSlotTo(order[index]);

  await word.animate(
    [
      { opacity: 0, transform: `translateX(-${shift})` },
      { opacity: 1, transform: "translateX(0)" },
    ],
    { duration: IN_MS, easing: "ease-out", fill: "forwards" }
  ).finished;
}

// Width of one space in the headline, in em so it holds up when the font scales
function spaceWidthEm() {
  const probe = document.createElement("span");
  probe.textContent = "\u00a0";
  headline.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width / parseFloat(getComputedStyle(headline).fontSize);
}

// Fade the last word out and close the gap so only "Love thy neighbor" remains
async function finish() {
  clearInterval(timer);
  timer = null;
  done = true;
  toggle.disabled = true; // nothing to pause or replay until the fade ends

  const shift = reduceMotion ? "0" : DRIFT;
  await word.animate(
    [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: `translateX(${shift})` },
    ],
    { duration: FINAL_OUT_MS, easing: "ease-in", fill: "forwards" }
  ).finished;

  // The slot sits between two spaces; pull one back so a single space is left
  slot.style.width = "0px";
  slot.style.marginLeft = `-${spaceWidthEm()}em`;
  // When stacked, collapse the empty middle line instead
  if (stacked.matches) slot.style.height = "0px";

  headline.classList.add("is-done");
  toggle.classList.add("is-done");
  toggle.setAttribute("aria-label", "Replay");
  toggle.disabled = false;
}

// Reopen the slot and run through the words again in a new order
async function replay() {
  order = shuffle(WORDS);
  index = 0;
  done = false;
  toggle.disabled = true;
  toggle.classList.remove("is-done");
  headline.classList.remove("is-done");

  slot.style.marginLeft = "";
  slot.style.height = "";
  word.textContent = order[index];
  fitSlotTo(order[index]);

  const shift = reduceMotion ? "0" : DRIFT;
  await word.animate(
    [
      { opacity: 0, transform: `translateX(-${shift})` },
      { opacity: 1, transform: "translateX(0)" },
    ],
    { duration: IN_MS, easing: "ease-out", fill: "forwards" }
  ).finished;

  toggle.disabled = false;
  play();
}

function tick() {
  if (index === order.length - 1) finish();
  else showNext();
}

const toggle = document.querySelector(".toggle");
let timer = null;

function play() {
  clearInterval(timer);
  timer = setInterval(tick, INTERVAL_MS);
  toggle.classList.remove("is-paused");
  toggle.setAttribute("aria-label", "Pause");
}

function pause() {
  clearInterval(timer);
  timer = null;
  toggle.classList.add("is-paused");
  toggle.setAttribute("aria-label", "Play");
}

toggle.addEventListener("click", () => {
  if (done) replay();
  else if (timer) pause();
  else play();
});

window.addEventListener("resize", () => {
  if (!done) fitSlotTo(order[index]);
});

document.fonts.ready.then(() => {
  word.textContent = order[index];
  fitSlotTo(order[index]);
  play();
});
