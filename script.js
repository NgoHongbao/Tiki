const CONFIG = {
  typeText: "Nếu mỗi lần nhớ em là một vì sao, chắc bầu trời của anh sáng mất rồi. ✨",
  rainWords: ["♥", "♡", "love", "💗", "A Lương", "Bắp", "forever", "♥"],
};

const $ = (s) => document.querySelector(s);
const introBtn = $("#startBtn");
const heartBtn = $("#heartBtn");
const typeLine = $("#typeLine");
const heartRain = $("#heartRain");

let rainTimer = null;
let finished = false;

function rand(min, max) { return Math.random() * (max - min) + min; }

function spawnHeart() {
  const el = document.createElement("span");
  el.className = "falling-heart";
  el.textContent = CONFIG.rainWords[Math.floor(Math.random() * CONFIG.rainWords.length)];
  el.style.left = rand(0, 100) + "vw";
  el.style.fontSize = rand(11, 27) + "px";
  el.style.opacity = rand(.22, .82);
  el.style.setProperty("--drift", rand(-80, 80) + "px");
  el.style.setProperty("--spin", rand(-160, 160) + "deg");
  el.style.animationDuration = rand(5.5, 10.5) + "s";
  heartRain.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

function startRain() {
  for (let i = 0; i < 16; i++) setTimeout(spawnHeart, i * 90);
  rainTimer = setInterval(spawnHeart, 260);
}

async function typeWriter(text) {
  typeLine.textContent = "";
  for (let i = 0; i < text.length; i++) {
    typeLine.textContent += text[i];
    await new Promise(r => setTimeout(r, text[i] === " " ? 26 : rand(34, 67)));
  }
}

function heartBurst(count = 26) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.className = "burst-heart";
    h.textContent = Math.random() > .22 ? "♥" : "✦";
    const angle = (Math.PI * 2 * i) / count + rand(-.12, .12);
    const dist = rand(90, 250);
    h.style.setProperty("--x", Math.cos(angle) * dist + "px");
    h.style.setProperty("--y", Math.sin(angle) * dist + "px");
    h.style.setProperty("--r", rand(-120, 120) + "deg");
    h.style.fontSize = rand(14, 30) + "px";
    document.body.appendChild(h);
    h.addEventListener("animationend", () => h.remove(), { once: true });
  }
}

introBtn.addEventListener("click", async () => {
  document.body.classList.add("started");
  startRain();
  heartBurst(18);
  await new Promise(r => setTimeout(r, 620));
  typeWriter(CONFIG.typeText);
});

heartBtn.addEventListener("click", () => {
  heartBurst(34);
  if (finished) return;
  finished = true;
  setTimeout(() => document.body.classList.add("finished"), 650);
});

document.addEventListener("pointerdown", (e) => {
  if (!document.body.classList.contains("started")) return;
  if (e.target.closest("button")) return;
  const h = document.createElement("span");
  h.className = "burst-heart";
  h.textContent = "♥";
  h.style.left = e.clientX + "px";
  h.style.top = e.clientY + "px";
  h.style.setProperty("--x", rand(-25, 25) + "px");
  h.style.setProperty("--y", rand(-80, -35) + "px");
  h.style.setProperty("--r", rand(-30, 30) + "deg");
  document.body.appendChild(h);
  h.addEventListener("animationend", () => h.remove(), { once: true });
});

const canvas = $("#stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.floor((innerWidth * innerHeight) / 7200) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: rand(.35, 1.45),
    a: rand(.16, .75),
    s: rand(.002, .012)
  }));
}

function drawStars(t = 0) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const g = ctx.createRadialGradient(innerWidth * .5, innerHeight * .42, 0, innerWidth * .5, innerHeight * .42, Math.max(innerWidth, innerHeight) * .75);
  g.addColorStop(0, "#26101f");
  g.addColorStop(.48, "#100713");
  g.addColorStop(1, "#050207");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  for (const st of stars) {
    const alpha = Math.max(.05, st.a + Math.sin(t * st.s) * .18);
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,230,241,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

addEventListener("resize", resize);
resize();
requestAnimationFrame(drawStars);