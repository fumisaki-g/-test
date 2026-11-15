export type FlowerId = "marigold" | "lotus" | "jasmine";

export const FLOWERS: { id: FlowerId; label: string }[] = [
  { id: "marigold", label: "ดาวเรือง" },
  { id: "lotus", label: "บัว" },
  { id: "jasmine", label: "มะลิ" },
];

const BLESSINGS = [
  "สุขกายสุขใจ",
  "ครอบครัวอบอุ่น",
  "สมหวังดังตั้งใจ",
  "เจอแต่สิ่งดีๆ",
  "พ้นทุกข์พ้นโศก",
  "ร่ำรวยน้ำใจ",
  "หลับฝันดี",
  "ด้วยหัวใจ",
];

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  kind: "dot" | "plus" | "ring";
  tint: number;
};

type Krathong = {
  depth: number;
  lane: number;
  wish: string;
  flower: FlowerId;
  phase: number;
  speed: number;
  born: number;
  mine: boolean;
};

type Lantern = {
  x0: number;
  y: number;
  vy: number;
  phase: number;
  size: number;
  pink: boolean;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  gravity: number;
  drag: number;
};

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  pink: boolean;
  w: number;
};

type Fly = { x: number; y: number; phase: number; drift: number };

type Wisp = { x: number; y: number; vx: number; life: number; r: number };

type Ripple = { x: number; y: number; r: number; life: number };

type Shooter = { x: number; y: number; vx: number; vy: number; life: number };

export type Scene = {
  w: number;
  h: number;
  t: number;
  reduce: boolean;
  stars: Star[];
  krathongs: Krathong[];
  lanterns: Lantern[];
  sparks: Spark[];
  petals: Petal[];
  flies: Fly[];
  wisps: Wisp[];
  ripples: Ripple[];
  shooters: Shooter[];
  nextBoom: number;
  nextParade: number;
  released: number;
  lanternsLit: number;
  booms: number;
  serial: number;
};

type Bloom = "peony" | "ring" | "willow";

const FLOWER_PAINT: Record<FlowerId, { petal: string; heart: string; n: number; r: number }> = {
  marigold: { petal: "#ffb703", heart: "#e85d04", n: 7, r: 6.5 },
  lotus: { petal: "#ff8fab", heart: "#fb6f92", n: 6, r: 8.2 },
  jasmine: { petal: "#fff8ee", heart: "#ffe08a", n: 8, r: 5.2 },
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function horizonOf(h: number) {
  return h * 0.44;
}

function makeStars(w: number, h: number): Star[] {
  const n = clamp(Math.round((w * h) / 11000), 110, 240);
  const stars: Star[] = [];
  for (let i = 0; i < n; i++) {
    const roll = Math.random();
    stars.push({
      x: Math.random(),
      y: Math.random() * 0.56,
      r: roll < 0.12 ? rand(2.2, 3.4) : rand(0.7, 1.7),
      phase: Math.random() * Math.PI * 2,
      kind: roll < 0.1 ? "plus" : roll > 0.97 ? "ring" : "dot",
      tint: Math.random(),
    });
  }
  return stars;
}

function makeLantern(scene: Scene, xNorm: number): Lantern {
  return {
    x0: clamp(xNorm, 0.08, 0.92) * scene.w,
    y: horizonOf(scene.h) + rand(0, 24),
    vy: -rand(22, 40),
    phase: Math.random() * Math.PI * 2,
    size: rand(0.75, 1.25),
    pink: Math.random() < 0.28,
  };
}

export function createScene(w: number, h: number, reduce: boolean): Scene {
  const scene: Scene = {
    w,
    h,
    t: 0,
    reduce,
    stars: makeStars(w, h),
    krathongs: [],
    lanterns: [],
    sparks: [],
    petals: [],
    flies: [],
    wisps: [],
    ripples: [],
    shooters: [],
    nextBoom: 2.2,
    nextParade: 8,
    released: 0,
    lanternsLit: 0,
    booms: 0,
    serial: 1,
  };

  const ambient: FlowerId[] = ["marigold", "lotus", "jasmine", "marigold", "lotus", "jasmine", "marigold"];
  ambient.forEach((flower, i) => {
    scene.krathongs.push({
      depth: 0.08 + (i / ambient.length) * 0.78,
      lane: Math.sin(i * 1.7) * 0.55,
      wish: BLESSINGS[i % BLESSINGS.length] ?? "สุขใจ",
      flower,
      phase: Math.random() * Math.PI * 2,
      speed: rand(0.006, 0.014),
      born: 1,
      mine: false,
    });
  });

  if (w > 2 && h > 2) {
    for (let i = 0; i < 9; i++) {
      const lantern = makeLantern(scene, rand(0.12, 0.88));
      lantern.y = rand(h * 0.06, h * 0.42);
      lantern.size = rand(1.05, 1.7);
      scene.lanterns.push(lantern);
    }
    for (let i = 0; i < 8; i++) {
      scene.flies.push({
        x: rand(w * 0.05, w * 0.95),
        y: rand(h * 0.5, h * 0.72),
        phase: Math.random() * Math.PI * 2,
        drift: rand(-8, 8),
      });
    }
    for (let i = 0; i < 26; i++) {
      scene.petals.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-8, 10),
        vy: rand(12, 32),
        rot: Math.random() * Math.PI,
        vr: rand(-1.2, 1.2),
        pink: Math.random() < 0.45,
        w: rand(3, 6),
      });
    }
    if (!reduce) {
      burst(scene, w * 0.22, h * 0.16, "peony");
      burst(scene, w * 0.5, h * 0.12, "ring");
      burst(scene, w * 0.74, h * 0.2, "willow");
      for (const spark of scene.sparks) {
        const age = spark.max * 0.42;
        spark.x += spark.vx * age;
        spark.y += spark.vy * age;
        spark.vy += spark.gravity * age;
        spark.life -= age;
      }
    }
  }

  return scene;
}

export function resizeScene(scene: Scene, w: number, h: number) {
  if (w < 2 || h < 2 || (scene.w === w && scene.h === h)) return;
  const sx = scene.w > 2 ? w / scene.w : 1;
  const sy = scene.h > 2 ? h / scene.h : 1;
  for (const spark of scene.sparks) {
    spark.x *= sx;
    spark.y *= sy;
    spark.vx *= sx;
    spark.vy *= sy;
  }
  for (const lantern of scene.lanterns) {
    lantern.x0 *= sx;
    lantern.y *= sy;
  }
  for (const petal of scene.petals) {
    petal.x *= sx;
    petal.y *= sy;
  }
  for (const fly of scene.flies) {
    fly.x *= sx;
    fly.y *= sy;
  }
  for (const wisp of scene.wisps) {
    wisp.x *= sx;
    wisp.y *= sy;
  }
  for (const ripple of scene.ripples) {
    ripple.x *= sx;
    ripple.y *= sy;
  }
  for (const shooter of scene.shooters) {
    shooter.x *= sx;
    shooter.y *= sy;
    shooter.vx *= sx;
    shooter.vy *= sy;
  }
  scene.w = w;
  scene.h = h;
  if (scene.stars.length < 40) scene.stars = makeStars(w, h);
}

function project(scene: Scene, k: Krathong) {
  const hy = horizonOf(scene.h);
  const near = scene.h * 0.64;
  const yBase = lerp(hy + 8, near, 1 - k.depth);
  const bob = Math.sin(scene.t * 1.7 + k.phase) * lerp(1.5, 6, 1 - k.depth);
  const half = scene.w * lerp(0.12, 0.4, 1 - k.depth);
  const x = scene.w * 0.5 + k.lane * half;
  const scale = lerp(0.26, 1.08, 1 - k.depth) * clamp(scene.w / 860, 0.72, 1.2);
  return { x, y: yBase + bob, scale };
}

export function defaultBlessing(serial: number) {
  return BLESSINGS[serial % BLESSINGS.length] ?? "ด้วยหัวใจ";
}

export function releaseKrathong(scene: Scene, wish: string, flower: FlowerId, xNorm = 0.5) {
  const text = wish.trim().slice(0, 36) || defaultBlessing(scene.serial);
  const lane = clamp((xNorm - 0.5) * 1.7, -0.72, 0.72);
  const krathong: Krathong = {
    depth: 0.02,
    lane,
    wish: text,
    flower,
    phase: Math.random() * Math.PI * 2,
    speed: rand(0.008, 0.016),
    born: 0,
    mine: true,
  };
  scene.krathongs.push(krathong);
  scene.released += 1;
  scene.serial += 1;
  if (scene.krathongs.length > 36) {
    const far = scene.krathongs.reduce((i, k, idx, arr) => (k.depth > arr[i]!.depth ? idx : i), 0);
    scene.krathongs.splice(far, 1);
  }
  const p = project(scene, krathong);
  scene.ripples.push({ x: p.x, y: p.y + 6, r: 8, life: 1 });
  splash(scene, p.x, p.y);
  if (!scene.reduce && scene.sparks.length < 380) {
    burst(scene, scene.w * rand(0.22, 0.4), scene.h * rand(0.12, 0.24), "peony");
    burst(scene, scene.w * rand(0.6, 0.8), scene.h * rand(0.1, 0.22), "willow");
  }
  return text;
}

export function launchLantern(scene: Scene, xNorm?: number) {
  const x = xNorm ?? rand(0.2, 0.8);
  scene.lanterns.push(makeLantern(scene, x));
  scene.lanternsLit += 1;
  if (scene.lanterns.length > 28) scene.lanterns.shift();
}

export function burst(scene: Scene, x: number, y: number, kind: Bloom) {
  if (scene.sparks.length > 520) scene.sparks.splice(0, 120);
  const count = kind === "willow" ? 54 : kind === "ring" ? 42 : 72;
  const palette =
    kind === "willow"
      ? ["#ffe08a", "#ffb703", "#fff4c8"]
      : kind === "ring"
        ? ["#fff6d8", "#f0a0c0", "#ffffff"]
        : ["#fff4c8", "#ffd166", "#ff8fab", "#ffffff", "#ff9f1c"];
  for (let i = 0; i < count; i++) {
    const angle = kind === "ring" ? (i / count) * Math.PI * 2 : rand(0, Math.PI * 2);
    const speed =
      kind === "ring" ? rand(70, 92) : kind === "willow" ? rand(28, 70) : rand(40, 150);
    const color = palette[i % palette.length] ?? "#fff4c8";
    scene.sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: kind === "willow" ? rand(1.3, 1.9) : rand(0.7, 1.25),
      max: kind === "willow" ? 1.7 : 1.05,
      color,
      size: kind === "willow" ? rand(1.1, 1.8) : rand(1.2, 2.2),
      gravity: kind === "willow" ? 46 : 28,
      drag: kind === "willow" ? 0.55 : 0.18,
    });
  }
  scene.booms += 1;
}

function splash(scene: Scene, x: number, y: number) {
  for (let i = 0; i < 16; i++) {
    const angle = rand(-Math.PI, 0);
    const speed = rand(20, 70);
    scene.sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: rand(0.35, 0.7),
      max: 0.7,
      color: "#ffe08a",
      size: 1.4,
      gravity: 80,
      drag: 0.2,
    });
  }
}

export function updateScene(scene: Scene, dt: number) {
  const step = scene.reduce ? Math.min(dt, 0.05) * 0.35 : Math.min(dt, 0.033);
  scene.t += step;

  for (const k of scene.krathongs) {
    k.depth += step * (0.02 + k.speed);
    k.lane += Math.sin(scene.t * 0.45 + k.phase) * step * 0.035;
    k.lane = clamp(k.lane, -0.78, 0.78);
    k.born = Math.min(1, k.born + step * 1.8);
    if (!scene.reduce && k.depth < 0.72 && Math.random() < step * 2.2) {
      const p = project(scene, k);
      scene.wisps.push({
        x: p.x + 10 * p.scale,
        y: p.y - 26 * p.scale,
        vx: rand(-6, 6),
        life: 1,
        r: rand(2, 5),
      });
    }
  }
  scene.krathongs = scene.krathongs.filter((k) => k.depth < 1.05);

  for (const lantern of scene.lanterns) lantern.y += lantern.vy * step;
  scene.lanterns = scene.lanterns.filter((l) => l.y > -80);

  for (const spark of scene.sparks) {
    spark.life -= step;
    spark.vx *= 1 - spark.drag * step;
    spark.vy = spark.vy * (1 - spark.drag * step) + spark.gravity * step;
    spark.x += spark.vx * step;
    spark.y += spark.vy * step;
  }
  scene.sparks = scene.sparks.filter((s) => s.life > 0);

  for (const petal of scene.petals) {
    petal.x += petal.vx * step + Math.sin(scene.t + petal.rot) * 8 * step;
    petal.y += petal.vy * step;
    petal.rot += petal.vr * step;
    if (petal.y > scene.h + 8) {
      petal.y = -8;
      petal.x = Math.random() * scene.w;
    }
  }
  if (!scene.reduce && scene.petals.length < 40 && Math.random() < step * 8) {
    scene.petals.push({
      x: Math.random() * scene.w,
      y: -6,
      vx: rand(-10, 12),
      vy: rand(14, 36),
      rot: Math.random() * Math.PI,
      vr: rand(-1.4, 1.4),
      pink: Math.random() < 0.45,
      w: rand(3, 6),
    });
  }

  for (const fly of scene.flies) {
    fly.phase += step * 2.2;
    fly.x += Math.sin(scene.t * 0.7 + fly.phase) * 10 * step + fly.drift * step;
    fly.y += Math.cos(scene.t * 0.5 + fly.phase) * 6 * step;
    if (fly.x < 0) fly.x = scene.w;
    if (fly.x > scene.w) fly.x = 0;
  }

  for (const wisp of scene.wisps) {
    wisp.life -= step * 0.45;
    wisp.y -= 18 * step;
    wisp.x += wisp.vx * step;
    wisp.r += 6 * step;
  }
  scene.wisps = scene.wisps.filter((w) => w.life > 0);
  if (scene.wisps.length > 80) scene.wisps.splice(0, scene.wisps.length - 80);

  for (const ripple of scene.ripples) {
    ripple.life -= step * 0.55;
    ripple.r += 46 * step;
  }
  scene.ripples = scene.ripples.filter((r) => r.life > 0);

  for (const shooter of scene.shooters) {
    shooter.life -= step;
    shooter.x += shooter.vx * step;
    shooter.y += shooter.vy * step;
  }
  scene.shooters = scene.shooters.filter((s) => s.life > 0);

  if (!scene.reduce && scene.shooters.length < 1 && Math.random() < step * 0.18) {
    scene.shooters.push({
      x: rand(scene.w * 0.35, scene.w * 0.95),
      y: rand(scene.h * 0.04, scene.h * 0.22),
      vx: -rand(420, 680),
      vy: rand(80, 180),
      life: rand(0.45, 0.75),
    });
  }

  if (!scene.reduce && scene.t > scene.nextBoom) {
    scene.nextBoom = scene.t + rand(4.2, 7.2);
    const kinds: Bloom[] = ["peony", "ring", "willow"];
    const kind = kinds[scene.booms % kinds.length] ?? "peony";
    burst(scene, rand(scene.w * 0.15, scene.w * 0.85), rand(scene.h * 0.08, scene.h * 0.3), kind);
  }

  if (!scene.reduce && scene.t > scene.nextParade) {
    scene.nextParade = scene.t + rand(14, 22);
    for (let i = 0; i < 5; i++) launchLantern(scene, 0.16 + i * 0.16);
  }

  if (scene.lanterns.length < 4 && !scene.reduce) launchLantern(scene);
}

function starColor(tint: number, alpha: number) {
  if (tint > 0.82) return `rgba(255, 196, 120, ${alpha})`;
  if (tint > 0.62) return `rgba(255, 214, 230, ${alpha})`;
  return `rgba(255, 248, 236, ${alpha})`;
}

function drawSky(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { w, h } = scene;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1a0a48");
  g.addColorStop(0.28, "#34146e");
  g.addColorStop(0.48, "#5c248c");
  g.addColorStop(0.62, "#a24a78");
  g.addColorStop(0.74, "#2a1458");
  g.addColorStop(1, "#120a28");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawStars(ctx: CanvasRenderingContext2D, scene: Scene) {
  for (const star of scene.stars) {
    const x = star.x * scene.w;
    const y = star.y * scene.h;
    const tw = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(scene.t * 1.6 + star.phase));
    const alpha = tw * (star.kind === "dot" ? 0.9 : 1);
    ctx.strokeStyle = starColor(star.tint, alpha);
    ctx.fillStyle = starColor(star.tint, alpha);
    if (star.kind === "plus") {
      const s = star.r * 2.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - s, y);
      ctx.lineTo(x + s, y);
      ctx.moveTo(x, y - s);
      ctx.lineTo(x, y + s);
      ctx.stroke();
    } else if (star.kind === "ring") {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, star.r * 2.1, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function moonCenter(scene: Scene) {
  return {
    x: scene.w * 0.78,
    y: scene.h * 0.17,
    r: Math.min(scene.w * 0.13, scene.h * 0.18, 128),
  };
}

function drawMoon(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { x, y, r } = moonCenter(scene);
  const pulse = 0.92 + 0.08 * Math.sin(scene.t * 0.7);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const halo = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 4.2 * pulse);
  halo.addColorStop(0, "rgba(255, 206, 110, 0.38)");
  halo.addColorStop(0.35, "rgba(255, 170, 70, 0.08)");
  halo.addColorStop(1, "rgba(255, 160, 60, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, r * 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const disc = ctx.createRadialGradient(x - r * 0.28, y - r * 0.32, r * 0.15, x, y, r);
  disc.addColorStop(0, "#fff6d2");
  disc.addColorStop(0.45, "#ffd56a");
  disc.addColorStop(1, "#e39a2e");
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(176, 112, 36, 0.22)";
  const craters: [number, number, number, number][] = [
    [-0.22, -0.08, 0.18, 0.14],
    [0.28, 0.16, 0.12, 0.1],
    [0.05, 0.32, 0.1, 0.08],
    [-0.32, 0.28, 0.08, 0.07],
  ];
  for (const [cx, cy, rx, ry] of craters) {
    ctx.beginPath();
    ctx.ellipse(x + cx * r, y + cy * r, rx * r, ry * r, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShooters(ctx: CanvasRenderingContext2D, scene: Scene) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = 2;
  for (const s of scene.shooters) {
    const alpha = clamp(s.life * 2, 0, 1);
    ctx.strokeStyle = `rgba(255, 244, 220, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * 0.08, s.y - s.vy * 0.08);
    ctx.stroke();
  }
  ctx.restore();
}

function ridge(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  base: number,
  amp: number,
  color: string,
  seed: number,
) {
  const hy = horizonOf(scene.h);
  ctx.beginPath();
  ctx.moveTo(0, base);
  const steps = Math.ceil(scene.w / 10);
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * scene.w;
    const n =
      Math.sin(x * 0.008 + seed) * amp +
      Math.sin(x * 0.02 + seed * 1.7) * amp * 0.45 +
      Math.sin(x * 0.041 + seed) * amp * 0.18;
    ctx.lineTo(x, base - n);
  }
  ctx.lineTo(scene.w, hy + 6);
  ctx.lineTo(0, hy + 6);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawChedi(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = "#120818";
  ctx.fillRect(x - 22 * s, y - 6 * s, 44 * s, 8 * s);
  ctx.beginPath();
  ctx.moveTo(x - 16 * s, y - 6 * s);
  ctx.lineTo(x - 8 * s, y - 34 * s);
  ctx.lineTo(x + 8 * s, y - 34 * s);
  ctx.lineTo(x + 16 * s, y - 6 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 3.2 * s, y - 34 * s);
  ctx.lineTo(x, y - 68 * s);
  ctx.lineTo(x + 3.2 * s, y - 34 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 206, 120, 0.85)";
  ctx.fillRect(x - 1.1 * s, y - 18 * s, 2.2 * s, 3 * s);
}

function drawMountains(ctx: CanvasRenderingContext2D, scene: Scene) {
  const hy = horizonOf(scene.h);
  ridge(ctx, scene, hy + 8, scene.h * 0.055, "#140826", 1.2);
  ridge(ctx, scene, hy + 16, scene.h * 0.03, "#0c0618", 2.4);
  drawChedi(ctx, scene.w * 0.2, hy + 4, clamp(scene.w / 700, 0.7, 1.35));
  drawChedi(ctx, scene.w * 0.58, hy + 10, clamp(scene.w / 1100, 0.45, 0.85));
}

function drawRiver(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { w, h } = scene;
  const hy = horizonOf(h);
  const water = ctx.createLinearGradient(0, hy, 0, h);
  water.addColorStop(0, "#7a4aaa");
  water.addColorStop(0.16, "#3a2070");
  water.addColorStop(0.45, "#1a1244");
  water.addColorStop(1, "#100a22");
  ctx.fillStyle = water;
  ctx.fillRect(0, hy, w, h - hy);

  ctx.strokeStyle = "rgba(255, 196, 140, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, hy);
  ctx.lineTo(w, hy);
  ctx.stroke();

  const moon = moonCenter(scene);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, hy, w, h - hy);
  ctx.clip();
  const column = ctx.createLinearGradient(moon.x, hy, moon.x, hy + h * 0.42);
  column.addColorStop(0, "rgba(255, 214, 130, 0.38)");
  column.addColorStop(1, "rgba(255, 214, 130, 0)");
  ctx.fillStyle = column;
  ctx.beginPath();
  const wobble = Math.sin(scene.t * 1.3) * 10;
  ctx.moveTo(moon.x - 8 + wobble * 0.2, hy);
  ctx.quadraticCurveTo(moon.x + 22, hy + h * 0.16, moon.x + wobble, hy + h * 0.4);
  ctx.quadraticCurveTo(moon.x - 26, hy + h * 0.2, moon.x - 6, hy);
  ctx.fill();
  ctx.restore();

  ctx.lineWidth = 1;
  const bands = 16;
  for (let i = 0; i < bands; i++) {
    const t = i / bands;
    const y = hy + 10 + t * t * (h - hy) * 0.92;
    if (y > h) break;
    ctx.beginPath();
    const amp = 1.4 + t * 5;
    for (let x = 0; x <= w; x += 10) {
      const yy = y + Math.sin(x * 0.012 + scene.t * 0.9 + i * 0.6) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    const alpha = 0.08 + (1 - t) * 0.16;
    ctx.strokeStyle = `rgba(230, 210, 255, ${alpha})`;
    ctx.stroke();
  }

  for (const ripple of scene.ripples) {
    ctx.beginPath();
    ctx.ellipse(ripple.x, ripple.y, ripple.r, ripple.r * 0.32, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 220, 160, ${ripple.life * 0.45})`;
    ctx.stroke();
  }
}

function drawBanks(ctx: CanvasRenderingContext2D, scene: Scene) {
  const hy = horizonOf(scene.h);
  const { w, h } = scene;
  ctx.fillStyle = "#0a0614";
  const inset = w * 0.1;
  ctx.beginPath();
  ctx.moveTo(0, hy - 2);
  ctx.lineTo(inset * 0.25, hy + 4);
  ctx.lineTo(inset, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w, hy - 2);
  ctx.lineTo(w - inset * 0.25, hy + 4);
  ctx.lineTo(w - inset, h);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#140a1c";
  for (const side of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      const y = hy + 18 + i * i * 6;
      if (y > h) break;
      const x = side < 0 ? inset * (0.15 + i * 0.08) : w - inset * (0.15 + i * 0.08);
      const s = 6 + i * 2.2;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 2.1);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x - s, y);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function blossom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  petal: string,
  heart: string,
) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(a) * r * 0.5,
      y + Math.sin(a) * r * 0.42,
      r * 0.52,
      r * 0.34,
      a,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = petal;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, r * 0.32, 0, Math.PI * 2);
  ctx.fillStyle = heart;
  ctx.fill();
}

function drawKrathongShape(
  ctx: CanvasRenderingContext2D,
  flower: FlowerId,
  scale: number,
  flick: number,
) {
  ctx.scale(scale, scale);

  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(0, 12, 48, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  const leaf = ctx.createLinearGradient(-70, -10, 70, 16);
  leaf.addColorStop(0, "#2f6a34");
  leaf.addColorStop(0.45, "#d9c07a");
  leaf.addColorStop(1, "#3e7a3a");
  ctx.fillStyle = leaf;

  ctx.beginPath();
  ctx.moveTo(-6, 2);
  ctx.bezierCurveTo(-36, -20, -78, -6, -68, 8);
  ctx.bezierCurveTo(-54, 18, -28, 14, -4, 8);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, 2);
  ctx.bezierCurveTo(36, -20, 78, -6, 68, 8);
  ctx.bezierCurveTo(54, 18, 28, 14, 4, 8);
  ctx.closePath();
  ctx.fill();

  const bowl = ctx.createLinearGradient(0, -12, 0, 22);
  bowl.addColorStop(0, "#f3e2b0");
  bowl.addColorStop(0.55, "#c9843a");
  bowl.addColorStop(1, "#6d4a22");
  ctx.fillStyle = bowl;
  ctx.beginPath();
  ctx.moveTo(-36, 0);
  ctx.bezierCurveTo(-42, 18, -12, 24, 0, 22);
  ctx.bezierCurveTo(12, 24, 42, 18, 36, 0);
  ctx.bezierCurveTo(18, -12, -18, -12, -36, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 236, 190, 0.55)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.strokeStyle = "rgba(90, 52, 20, 0.28)";
  ctx.lineWidth = 1;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 8, 2);
    ctx.quadraticCurveTo(side * 24, 8, side * 34, 4);
    ctx.stroke();
  }

  const paint = FLOWER_PAINT[flower];
  for (let i = 0; i < paint.n; i++) {
    const a = (i / paint.n) * Math.PI - Math.PI * 0.15;
    const rx = Math.cos(a) * 18;
    const ry = -8 + Math.sin(a) * 6;
    blossom(ctx, rx, ry, paint.r, paint.petal, paint.heart);
  }

  ctx.fillStyle = "#f7f3ea";
  ctx.fillRect(-3.2, -16, 6.4, 16);
  ctx.strokeStyle = "#5c4033";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(9, -2);
  ctx.lineTo(16, -20);
  ctx.moveTo(13, -1);
  ctx.lineTo(22, -16);
  ctx.stroke();

  const fh = 12 + flick * 5;
  const flame = ctx.createRadialGradient(0, -22, 1, 0, -24, fh);
  flame.addColorStop(0, "#fff8dc");
  flame.addColorStop(0.45, "#ffb020");
  flame.addColorStop(1, "rgba(255, 90, 20, 0)");
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.bezierCurveTo(7, -22, 4, -28 - fh * 0.2, 0, -18 - fh);
  ctx.bezierCurveTo(-4, -28 - fh * 0.2, -7, -22, 0, -14);
  ctx.fill();
}

function drawKrathongs(ctx: CanvasRenderingContext2D, scene: Scene) {
  const ordered = [...scene.krathongs].sort((a, b) => b.depth - a.depth);
  for (const k of ordered) {
    const p = project(scene, k);
    const fade = k.depth < 0.84 ? 1 : clamp(1 - (k.depth - 0.84) / 0.2, 0, 1);
    const alpha = fade * k.born;
    const flick = 0.5 + 0.5 * Math.sin(scene.t * 9 + k.phase * 3);

    ctx.save();
    ctx.globalAlpha = alpha * 0.85;
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(p.x, p.y - 16 * p.scale, 0, p.x, p.y - 8 * p.scale, 36 * p.scale);
    glow.addColorStop(0, "rgba(255, 176, 64, 0.55)");
    glow.addColorStop(1, "rgba(255, 140, 40, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 10 * p.scale, 36 * p.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.sin(scene.t * 0.45 + k.phase) * 0.08);
    drawKrathongShape(ctx, k.flower, p.scale, flick);
    ctx.restore();

    const reflH = 28 * p.scale;
    const grad = ctx.createLinearGradient(p.x, p.y + 8, p.x, p.y + reflH);
    grad.addColorStop(0, `rgba(255, 186, 70, ${0.28 * alpha})`);
    grad.addColorStop(1, "rgba(255, 186, 70, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(p.x - 2 * p.scale, p.y + 6, Math.max(2, 4 * p.scale), reflH);

    if (k.wish && p.scale > 0.4 && alpha > 0.35) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const size = Math.max(12, Math.round(13 * p.scale));
      ctx.font = `600 ${size}px Sarabun, Loma, FreeSerif, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = k.wish.length > 22 ? `${k.wish.slice(0, 21)}…` : k.wish;
      const tw = ctx.measureText(label).width;
      const padX = 10;
      const bw = tw + padX * 2;
      const bh = size + 10;
      const bx = p.x - bw / 2;
      const by = p.y - 58 * p.scale - bh;
      ctx.fillStyle = "rgba(16, 8, 24, 0.62)";
      roundRect(ctx, bx, by, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(240, 193, 75, 0.45)";
      ctx.stroke();
      ctx.fillStyle = "#f7f1e8";
      ctx.fillText(label, p.x, by + bh / 2 + 0.5);
      ctx.restore();
    }
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawLanterns(ctx: CanvasRenderingContext2D, scene: Scene) {
  const ordered = [...scene.lanterns].sort((a, b) => b.y - a.y);
  for (const lantern of ordered) {
    const x = lantern.x0 + Math.sin(scene.t * 0.85 + lantern.phase) * 16;
    const y = lantern.y;
    const s = lantern.size * clamp(scene.w / 900, 0.75, 1.15);
    const bodyW = 14 * s;
    const bodyH = 20 * s;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 28 * s);
    glow.addColorStop(0, lantern.pink ? "rgba(255, 150, 180, 0.45)" : "rgba(255, 186, 80, 0.5)");
    glow.addColorStop(1, "rgba(255, 160, 60, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 28 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "rgba(255, 220, 170, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -bodyH * 0.7);
    ctx.lineTo(0, -bodyH * 0.7 - 10 * s);
    ctx.stroke();

    const paper = ctx.createLinearGradient(0, -bodyH / 2, 0, bodyH / 2);
    if (lantern.pink) {
      paper.addColorStop(0, "#ffd0dc");
      paper.addColorStop(0.5, "#ff8fab");
      paper.addColorStop(1, "#e0567a");
    } else {
      paper.addColorStop(0, "#fff1c9");
      paper.addColorStop(0.48, "#ffc14d");
      paper.addColorStop(1, "#e07a22");
    }
    ctx.fillStyle = paper;
    ctx.beginPath();
    ctx.ellipse(0, 0, bodyW, bodyH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(90, 40, 10, 0.35)";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -bodyH);
    ctx.lineTo(0, bodyH);
    ctx.moveTo(-bodyW * 0.45, -bodyH * 0.2);
    ctx.quadraticCurveTo(0, bodyH * 0.15, bodyW * 0.45, -bodyH * 0.2);
    ctx.stroke();

    const flame = 0.65 + 0.35 * Math.sin(scene.t * 10 + lantern.phase);
    ctx.fillStyle = `rgba(255, 244, 210, ${0.75 + flame * 0.25})`;
    ctx.beginPath();
    ctx.ellipse(0, 2 * s, 2.4 * s, 4.5 * s * flame, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawWisps(ctx: CanvasRenderingContext2D, scene: Scene) {
  for (const wisp of scene.wisps) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(230, 220, 240, ${wisp.life * 0.18})`;
    ctx.arc(wisp.x, wisp.y, wisp.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPetals(ctx: CanvasRenderingContext2D, scene: Scene) {
  for (const petal of scene.petals) {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.rot);
    ctx.fillStyle = petal.pink ? "rgba(240, 160, 192, 0.85)" : "rgba(255, 196, 90, 0.88)";
    ctx.beginPath();
    ctx.ellipse(0, 0, petal.w, petal.w * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawSparks(ctx: CanvasRenderingContext2D, scene: Scene) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  for (const spark of scene.sparks) {
    const alpha = clamp(spark.life / spark.max, 0, 1);
    ctx.strokeStyle = hexAlpha(spark.color, alpha);
    ctx.lineWidth = spark.size;
    ctx.beginPath();
    ctx.moveTo(spark.x, spark.y);
    ctx.lineTo(spark.x - spark.vx * 0.035, spark.y - spark.vy * 0.035);
    ctx.stroke();
  }
  ctx.restore();
}

function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawFlies(ctx: CanvasRenderingContext2D, scene: Scene) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const fly of scene.flies) {
    const a = 0.15 + 0.85 * Math.abs(Math.sin(fly.phase));
    ctx.fillStyle = `rgba(214, 255, 170, ${a})`;
    ctx.beginPath();
    ctx.arc(fly.x, fly.y, 1.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawVignette(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { w, h } = scene;
  const v = ctx.createRadialGradient(w * 0.5, h * 0.42, h * 0.2, w * 0.5, h * 0.48, h * 0.78);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

export function drawScene(ctx: CanvasRenderingContext2D, scene: Scene) {
  drawSky(ctx, scene);
  drawStars(ctx, scene);
  drawMoon(ctx, scene);
  drawShooters(ctx, scene);
  drawMountains(ctx, scene);
  drawRiver(ctx, scene);
  drawBanks(ctx, scene);
  drawKrathongs(ctx, scene);
  drawLanterns(ctx, scene);
  drawWisps(ctx, scene);
  drawPetals(ctx, scene);
  drawSparks(ctx, scene);
  drawFlies(ctx, scene);
  drawVignette(ctx, scene);
}

export function afloatCount(scene: Scene) {
  return scene.krathongs.length;
}
