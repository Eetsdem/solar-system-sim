/*
//================================================================
// File: app.js
// Project: solar-system-sim
// Location: /app.js
// Canon Version: 1.0
// Description:
//     Physics simulation engine for the Solar System creation disk.
//
//     Responsibilities:
//       - Initializes bodies orbiting a central Sun.
//       - Applies Newtonian gravity from the Sun with configurable mass and effect.
//       - Updates render loop and simulation stats.
//
//     Canon 1.0 changes:
//       - Initial N-body-lite simulation with Sun controls and reset behavior.
// ================================================================
*/

const canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");

const massSlider = document.getElementById("sun-mass");
const gravitySlider = document.getElementById("gravity-factor");
const massValue = document.getElementById("sun-mass-value");
const gravityValue = document.getElementById("gravity-factor-value");
const resetButton = document.getElementById("reset-disk");
const stats = document.getElementById("stats");

const G_BASE = 0.2;
const SUN_DRAW_RADIUS = 16;
const BODY_COUNT = 28;

const sim = {
  sunMass: 1.0,
  gravityFactor: 1.0,
  bodies: [],
  lastTs: 0,
};

function fitCanvasToDisplay() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * window.devicePixelRatio);
  canvas.height = Math.floor(rect.height * window.devicePixelRatio);
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createDiskBodies() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;

  sim.bodies = Array.from({ length: BODY_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 70 + Math.random() * Math.min(width, height) * 0.42;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;

    const tangential = angle + Math.PI / 2;
    const circularV = Math.sqrt((G_BASE * sim.sunMass * sim.gravityFactor) / Math.max(radius, 1)) * 60;

    return {
      id: i + 1,
      mass: 0.01 + Math.random() * 0.06,
      radius: 2 + Math.random() * 2.8,
      x: px,
      y: py,
      vx: Math.cos(tangential) * circularV,
      vy: Math.sin(tangential) * circularV,
      color: `hsl(${170 + Math.random() * 130}, 80%, 72%)`,
      trail: [],
    };
  });
}

function updateBodies(dt) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const g = G_BASE * sim.gravityFactor;

  for (const body of sim.bodies) {
    const dx = cx - body.x;
    const dy = cy - body.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);

    const softening = 200;
    const accel = (g * sim.sunMass) / (distSq + softening);

    body.vx += (dx / (dist || 1)) * accel * dt;
    body.vy += (dy / (dist || 1)) * accel * dt;

    body.x += body.vx * dt;
    body.y += body.vy * dt;

    body.trail.push({ x: body.x, y: body.y });
    if (body.trail.length > 36) body.trail.shift();
  }
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;

  ctx.fillStyle = "rgba(3, 6, 16, 0.34)";
  ctx.fillRect(0, 0, width, height);

  for (const body of sim.bodies) {
    ctx.beginPath();
    body.trail.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = "rgba(160, 200, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = body.color;
    ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const pulse = 0.9 + Math.sin(performance.now() / 320) * 0.08;
  ctx.beginPath();
  ctx.fillStyle = "#ffcf66";
  ctx.arc(cx, cy, SUN_DRAW_RADIUS * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 214, 122, 0.35)";
  ctx.arc(cx, cy, SUN_DRAW_RADIUS * 2.7 * pulse, 0, Math.PI * 2);
  ctx.fill();
}

function updateStats() {
  const avgSpeed =
    sim.bodies.reduce((sum, b) => sum + Math.hypot(b.vx, b.vy), 0) /
    Math.max(sim.bodies.length, 1);

  stats.innerHTML = `
    <strong>Creation Disk Telemetry</strong><br>
    Bodies: ${sim.bodies.length}<br>
    Sun Weight: ${sim.sunMass.toFixed(2)}<br>
    Gravity Effect: ${sim.gravityFactor.toFixed(2)}<br>
    Avg Orbital Speed: ${avgSpeed.toFixed(2)} px/s
  `;
}

function animate(ts) {
  if (!sim.lastTs) sim.lastTs = ts;
  const dt = Math.min((ts - sim.lastTs) / 1000, 0.033);
  sim.lastTs = ts;

  updateBodies(dt);
  draw();
  updateStats();

  requestAnimationFrame(animate);
}

function setSunMass(value) {
  sim.sunMass = Number(value);
  massValue.textContent = sim.sunMass.toFixed(2);
}

function setGravityFactor(value) {
  sim.gravityFactor = Number(value);
  gravityValue.textContent = sim.gravityFactor.toFixed(2);
}

massSlider.addEventListener("input", (event) => {
  setSunMass(event.target.value);
});

gravitySlider.addEventListener("input", (event) => {
  setGravityFactor(event.target.value);
});

resetButton.addEventListener("click", () => {
  createDiskBodies();
});

window.addEventListener("resize", () => {
  fitCanvasToDisplay();
  createDiskBodies();
});

setSunMass(1.0);
setGravityFactor(1.0);
fitCanvasToDisplay();
createDiskBodies();
requestAnimationFrame(animate);
