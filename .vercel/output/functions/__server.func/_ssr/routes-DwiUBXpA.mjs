import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Volume2, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DwiUBXpA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function createFestivalAudio() {
	let ctx = null;
	let master = null;
	let water = null;
	function context() {
		if (typeof window === "undefined") return null;
		if (ctx) return ctx;
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
		master = ctx.createGain();
		master.gain.value = 0;
		master.connect(ctx.destination);
		const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		let brown = 0;
		for (let i = 0; i < data.length; i++) {
			brown = (brown + (Math.random() * 2 - 1) * .04) * .98;
			data[i] = brown * 3.2;
		}
		const filter = ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 420;
		const gain = ctx.createGain();
		gain.gain.value = .22;
		water = ctx.createBufferSource();
		water.buffer = buffer;
		water.loop = true;
		water.connect(filter);
		filter.connect(gain);
		gain.connect(master);
		water.start();
		return ctx;
	}
	function tone(freq, dur, type, peak) {
		const c = context();
		if (!c || !master) return;
		const osc = c.createOscillator();
		const gain = c.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, c.currentTime);
		osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * .62), c.currentTime + dur);
		gain.gain.setValueAtTime(1e-4, c.currentTime);
		gain.gain.exponentialRampToValueAtTime(peak, c.currentTime + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + dur);
		osc.connect(gain);
		gain.connect(master);
		osc.start();
		osc.stop(c.currentTime + dur + .02);
	}
	return {
		setAudible(on) {
			const c = context();
			if (!c || !master) return;
			if (c.state === "suspended") c.resume();
			master.gain.setTargetAtTime(on ? .9 : 0, c.currentTime, .06);
		},
		chime(kind) {
			if (kind === "lantern") {
				tone(880, 1.1, "sine", .05);
				tone(1318, .8, "triangle", .02);
				return;
			}
			tone(523.25, 1.35, "sine", .07);
			tone(783.99, 1.15, "triangle", .035);
		},
		boom() {
			const c = context();
			if (!c || !master) return;
			tone(140, .45, "sine", .12);
			const frames = Math.floor(c.sampleRate * .25);
			const buffer = c.createBuffer(1, frames, c.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
			const src = c.createBufferSource();
			src.buffer = buffer;
			const filter = c.createBiquadFilter();
			filter.type = "highpass";
			filter.frequency.value = 900;
			const gain = c.createGain();
			gain.gain.setValueAtTime(.16, c.currentTime);
			gain.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + .28);
			src.connect(filter);
			filter.connect(gain);
			gain.connect(master);
			src.start();
		},
		dispose() {
			water?.stop();
			ctx?.close();
			ctx = null;
			master = null;
			water = null;
		}
	};
}
var FLOWERS = [
	{
		id: "marigold",
		label: "ดาวเรือง"
	},
	{
		id: "lotus",
		label: "บัว"
	},
	{
		id: "jasmine",
		label: "มะลิ"
	}
];
var BLESSINGS = [
	"สุขกายสุขใจ",
	"ครอบครัวอบอุ่น",
	"สมหวังดังตั้งใจ",
	"เจอแต่สิ่งดีๆ",
	"พ้นทุกข์พ้นโศก",
	"ร่ำรวยน้ำใจ",
	"หลับฝันดี",
	"ด้วยหัวใจ"
];
var FLOWER_PAINT = {
	marigold: {
		petal: "#ffb703",
		heart: "#e85d04",
		n: 7,
		r: 6.5
	},
	lotus: {
		petal: "#ff8fab",
		heart: "#fb6f92",
		n: 6,
		r: 8.2
	},
	jasmine: {
		petal: "#fff8ee",
		heart: "#ffe08a",
		n: 8,
		r: 5.2
	}
};
function rand(a, b) {
	return a + Math.random() * (b - a);
}
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function horizonOf(h) {
	return h * .44;
}
function makeStars(w, h) {
	const n = clamp(Math.round(w * h / 11e3), 110, 240);
	const stars = [];
	for (let i = 0; i < n; i++) {
		const roll = Math.random();
		stars.push({
			x: Math.random(),
			y: Math.random() * .56,
			r: roll < .12 ? rand(2.2, 3.4) : rand(.7, 1.7),
			phase: Math.random() * Math.PI * 2,
			kind: roll < .1 ? "plus" : roll > .97 ? "ring" : "dot",
			tint: Math.random()
		});
	}
	return stars;
}
function makeLantern(scene, xNorm) {
	return {
		x0: clamp(xNorm, .08, .92) * scene.w,
		y: horizonOf(scene.h) + rand(0, 24),
		vy: -rand(22, 40),
		phase: Math.random() * Math.PI * 2,
		size: rand(.75, 1.25),
		pink: Math.random() < .28
	};
}
function createScene(w, h, reduce) {
	const scene = {
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
		serial: 1
	};
	const ambient = [
		"marigold",
		"lotus",
		"jasmine",
		"marigold",
		"lotus",
		"jasmine",
		"marigold"
	];
	ambient.forEach((flower, i) => {
		scene.krathongs.push({
			depth: .08 + i / ambient.length * .78,
			lane: Math.sin(i * 1.7) * .55,
			wish: BLESSINGS[i % BLESSINGS.length] ?? "สุขใจ",
			flower,
			phase: Math.random() * Math.PI * 2,
			speed: rand(.006, .014),
			born: 1,
			mine: false
		});
	});
	if (w > 2 && h > 2) {
		for (let i = 0; i < 9; i++) {
			const lantern = makeLantern(scene, rand(.12, .88));
			lantern.y = rand(h * .06, h * .42);
			lantern.size = rand(1.05, 1.7);
			scene.lanterns.push(lantern);
		}
		for (let i = 0; i < 8; i++) scene.flies.push({
			x: rand(w * .05, w * .95),
			y: rand(h * .5, h * .72),
			phase: Math.random() * Math.PI * 2,
			drift: rand(-8, 8)
		});
		for (let i = 0; i < 26; i++) scene.petals.push({
			x: Math.random() * w,
			y: Math.random() * h,
			vx: rand(-8, 10),
			vy: rand(12, 32),
			rot: Math.random() * Math.PI,
			vr: rand(-1.2, 1.2),
			pink: Math.random() < .45,
			w: rand(3, 6)
		});
		if (!reduce) {
			burst(scene, w * .22, h * .16, "peony");
			burst(scene, w * .5, h * .12, "ring");
			burst(scene, w * .74, h * .2, "willow");
			for (const spark of scene.sparks) {
				const age = spark.max * .42;
				spark.x += spark.vx * age;
				spark.y += spark.vy * age;
				spark.vy += spark.gravity * age;
				spark.life -= age;
			}
		}
	}
	return scene;
}
function resizeScene(scene, w, h) {
	if (w < 2 || h < 2 || scene.w === w && scene.h === h) return;
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
function project(scene, k) {
	const hy = horizonOf(scene.h);
	const near = scene.h * .64;
	const yBase = lerp(hy + 8, near, 1 - k.depth);
	const bob = Math.sin(scene.t * 1.7 + k.phase) * lerp(1.5, 6, 1 - k.depth);
	const half = scene.w * lerp(.12, .4, 1 - k.depth);
	const x = scene.w * .5 + k.lane * half;
	const scale = lerp(.26, 1.08, 1 - k.depth) * clamp(scene.w / 860, .72, 1.2);
	return {
		x,
		y: yBase + bob,
		scale
	};
}
function defaultBlessing(serial) {
	return BLESSINGS[serial % BLESSINGS.length] ?? "ด้วยหัวใจ";
}
function releaseKrathong(scene, wish, flower, xNorm = .5) {
	const text = wish.trim().slice(0, 36) || defaultBlessing(scene.serial);
	const krathong = {
		depth: .02,
		lane: clamp((xNorm - .5) * 1.7, -.72, .72),
		wish: text,
		flower,
		phase: Math.random() * Math.PI * 2,
		speed: rand(.008, .016),
		born: 0,
		mine: true
	};
	scene.krathongs.push(krathong);
	scene.released += 1;
	scene.serial += 1;
	if (scene.krathongs.length > 36) {
		const far = scene.krathongs.reduce((i, k, idx, arr) => k.depth > arr[i].depth ? idx : i, 0);
		scene.krathongs.splice(far, 1);
	}
	const p = project(scene, krathong);
	scene.ripples.push({
		x: p.x,
		y: p.y + 6,
		r: 8,
		life: 1
	});
	splash(scene, p.x, p.y);
	if (!scene.reduce && scene.sparks.length < 380) {
		burst(scene, scene.w * rand(.22, .4), scene.h * rand(.12, .24), "peony");
		burst(scene, scene.w * rand(.6, .8), scene.h * rand(.1, .22), "willow");
	}
	return text;
}
function launchLantern(scene, xNorm) {
	const x = xNorm ?? rand(.2, .8);
	scene.lanterns.push(makeLantern(scene, x));
	scene.lanternsLit += 1;
	if (scene.lanterns.length > 28) scene.lanterns.shift();
}
function burst(scene, x, y, kind) {
	if (scene.sparks.length > 520) scene.sparks.splice(0, 120);
	const count = kind === "willow" ? 54 : kind === "ring" ? 42 : 72;
	const palette = kind === "willow" ? [
		"#ffe08a",
		"#ffb703",
		"#fff4c8"
	] : kind === "ring" ? [
		"#fff6d8",
		"#f0a0c0",
		"#ffffff"
	] : [
		"#fff4c8",
		"#ffd166",
		"#ff8fab",
		"#ffffff",
		"#ff9f1c"
	];
	for (let i = 0; i < count; i++) {
		const angle = kind === "ring" ? i / count * Math.PI * 2 : rand(0, Math.PI * 2);
		const speed = kind === "ring" ? rand(70, 92) : kind === "willow" ? rand(28, 70) : rand(40, 150);
		const color = palette[i % palette.length] ?? "#fff4c8";
		scene.sparks.push({
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life: kind === "willow" ? rand(1.3, 1.9) : rand(.7, 1.25),
			max: kind === "willow" ? 1.7 : 1.05,
			color,
			size: kind === "willow" ? rand(1.1, 1.8) : rand(1.2, 2.2),
			gravity: kind === "willow" ? 46 : 28,
			drag: kind === "willow" ? .55 : .18
		});
	}
	scene.booms += 1;
}
function splash(scene, x, y) {
	for (let i = 0; i < 16; i++) {
		const angle = rand(-Math.PI, 0);
		const speed = rand(20, 70);
		scene.sparks.push({
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life: rand(.35, .7),
			max: .7,
			color: "#ffe08a",
			size: 1.4,
			gravity: 80,
			drag: .2
		});
	}
}
function updateScene(scene, dt) {
	const step = scene.reduce ? Math.min(dt, .05) * .35 : Math.min(dt, .033);
	scene.t += step;
	for (const k of scene.krathongs) {
		k.depth += step * (.02 + k.speed);
		k.lane += Math.sin(scene.t * .45 + k.phase) * step * .035;
		k.lane = clamp(k.lane, -.78, .78);
		k.born = Math.min(1, k.born + step * 1.8);
		if (!scene.reduce && k.depth < .72 && Math.random() < step * 2.2) {
			const p = project(scene, k);
			scene.wisps.push({
				x: p.x + 10 * p.scale,
				y: p.y - 26 * p.scale,
				vx: rand(-6, 6),
				life: 1,
				r: rand(2, 5)
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
	if (!scene.reduce && scene.petals.length < 40 && Math.random() < step * 8) scene.petals.push({
		x: Math.random() * scene.w,
		y: -6,
		vx: rand(-10, 12),
		vy: rand(14, 36),
		rot: Math.random() * Math.PI,
		vr: rand(-1.4, 1.4),
		pink: Math.random() < .45,
		w: rand(3, 6)
	});
	for (const fly of scene.flies) {
		fly.phase += step * 2.2;
		fly.x += Math.sin(scene.t * .7 + fly.phase) * 10 * step + fly.drift * step;
		fly.y += Math.cos(scene.t * .5 + fly.phase) * 6 * step;
		if (fly.x < 0) fly.x = scene.w;
		if (fly.x > scene.w) fly.x = 0;
	}
	for (const wisp of scene.wisps) {
		wisp.life -= step * .45;
		wisp.y -= 18 * step;
		wisp.x += wisp.vx * step;
		wisp.r += 6 * step;
	}
	scene.wisps = scene.wisps.filter((w) => w.life > 0);
	if (scene.wisps.length > 80) scene.wisps.splice(0, scene.wisps.length - 80);
	for (const ripple of scene.ripples) {
		ripple.life -= step * .55;
		ripple.r += 46 * step;
	}
	scene.ripples = scene.ripples.filter((r) => r.life > 0);
	for (const shooter of scene.shooters) {
		shooter.life -= step;
		shooter.x += shooter.vx * step;
		shooter.y += shooter.vy * step;
	}
	scene.shooters = scene.shooters.filter((s) => s.life > 0);
	if (!scene.reduce && scene.shooters.length < 1 && Math.random() < step * .18) scene.shooters.push({
		x: rand(scene.w * .35, scene.w * .95),
		y: rand(scene.h * .04, scene.h * .22),
		vx: -rand(420, 680),
		vy: rand(80, 180),
		life: rand(.45, .75)
	});
	if (!scene.reduce && scene.t > scene.nextBoom) {
		scene.nextBoom = scene.t + rand(4.2, 7.2);
		const kinds = [
			"peony",
			"ring",
			"willow"
		];
		const kind = kinds[scene.booms % kinds.length] ?? "peony";
		burst(scene, rand(scene.w * .15, scene.w * .85), rand(scene.h * .08, scene.h * .3), kind);
	}
	if (!scene.reduce && scene.t > scene.nextParade) {
		scene.nextParade = scene.t + rand(14, 22);
		for (let i = 0; i < 5; i++) launchLantern(scene, .16 + i * .16);
	}
	if (scene.lanterns.length < 4 && !scene.reduce) launchLantern(scene);
}
function starColor(tint, alpha) {
	if (tint > .82) return `rgba(255, 196, 120, ${alpha})`;
	if (tint > .62) return `rgba(255, 214, 230, ${alpha})`;
	return `rgba(255, 248, 236, ${alpha})`;
}
function drawSky(ctx, scene) {
	const { w, h } = scene;
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, "#1a0a48");
	g.addColorStop(.28, "#34146e");
	g.addColorStop(.48, "#5c248c");
	g.addColorStop(.62, "#a24a78");
	g.addColorStop(.74, "#2a1458");
	g.addColorStop(1, "#120a28");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
}
function drawStars(ctx, scene) {
	for (const star of scene.stars) {
		const x = star.x * scene.w;
		const y = star.y * scene.h;
		const alpha = (.62 + .38 * (.5 + .5 * Math.sin(scene.t * 1.6 + star.phase))) * (star.kind === "dot" ? .9 : 1);
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
function moonCenter(scene) {
	return {
		x: scene.w * .78,
		y: scene.h * .17,
		r: Math.min(scene.w * .13, scene.h * .18, 128)
	};
}
function drawMoon(ctx, scene) {
	const { x, y, r } = moonCenter(scene);
	const pulse = .92 + .08 * Math.sin(scene.t * .7);
	ctx.save();
	ctx.globalCompositeOperation = "lighter";
	const halo = ctx.createRadialGradient(x, y, r * .6, x, y, r * 4.2 * pulse);
	halo.addColorStop(0, "rgba(255, 206, 110, 0.38)");
	halo.addColorStop(.35, "rgba(255, 170, 70, 0.08)");
	halo.addColorStop(1, "rgba(255, 160, 60, 0)");
	ctx.fillStyle = halo;
	ctx.beginPath();
	ctx.arc(x, y, r * 4.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	const disc = ctx.createRadialGradient(x - r * .28, y - r * .32, r * .15, x, y, r);
	disc.addColorStop(0, "#fff6d2");
	disc.addColorStop(.45, "#ffd56a");
	disc.addColorStop(1, "#e39a2e");
	ctx.fillStyle = disc;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(176, 112, 36, 0.22)";
	for (const [cx, cy, rx, ry] of [
		[
			-.22,
			-.08,
			.18,
			.14
		],
		[
			.28,
			.16,
			.12,
			.1
		],
		[
			.05,
			.32,
			.1,
			.08
		],
		[
			-.32,
			.28,
			.08,
			.07
		]
	]) {
		ctx.beginPath();
		ctx.ellipse(x + cx * r, y + cy * r, rx * r, ry * r, .4, 0, Math.PI * 2);
		ctx.fill();
	}
}
function drawShooters(ctx, scene) {
	ctx.save();
	ctx.globalCompositeOperation = "lighter";
	ctx.lineWidth = 2;
	for (const s of scene.shooters) {
		ctx.strokeStyle = `rgba(255, 244, 220, ${clamp(s.life * 2, 0, 1)})`;
		ctx.beginPath();
		ctx.moveTo(s.x, s.y);
		ctx.lineTo(s.x - s.vx * .08, s.y - s.vy * .08);
		ctx.stroke();
	}
	ctx.restore();
}
function ridge(ctx, scene, base, amp, color, seed) {
	const hy = horizonOf(scene.h);
	ctx.beginPath();
	ctx.moveTo(0, base);
	const steps = Math.ceil(scene.w / 10);
	for (let i = 0; i <= steps; i++) {
		const x = i / steps * scene.w;
		const n = Math.sin(x * .008 + seed) * amp + Math.sin(x * .02 + seed * 1.7) * amp * .45 + Math.sin(x * .041 + seed) * amp * .18;
		ctx.lineTo(x, base - n);
	}
	ctx.lineTo(scene.w, hy + 6);
	ctx.lineTo(0, hy + 6);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}
function drawChedi(ctx, x, y, s) {
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
function drawMountains(ctx, scene) {
	const hy = horizonOf(scene.h);
	ridge(ctx, scene, hy + 8, scene.h * .055, "#140826", 1.2);
	ridge(ctx, scene, hy + 16, scene.h * .03, "#0c0618", 2.4);
	drawChedi(ctx, scene.w * .2, hy + 4, clamp(scene.w / 700, .7, 1.35));
	drawChedi(ctx, scene.w * .58, hy + 10, clamp(scene.w / 1100, .45, .85));
}
function drawRiver(ctx, scene) {
	const { w, h } = scene;
	const hy = horizonOf(h);
	const water = ctx.createLinearGradient(0, hy, 0, h);
	water.addColorStop(0, "#7a4aaa");
	water.addColorStop(.16, "#3a2070");
	water.addColorStop(.45, "#1a1244");
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
	const column = ctx.createLinearGradient(moon.x, hy, moon.x, hy + h * .42);
	column.addColorStop(0, "rgba(255, 214, 130, 0.38)");
	column.addColorStop(1, "rgba(255, 214, 130, 0)");
	ctx.fillStyle = column;
	ctx.beginPath();
	const wobble = Math.sin(scene.t * 1.3) * 10;
	ctx.moveTo(moon.x - 8 + wobble * .2, hy);
	ctx.quadraticCurveTo(moon.x + 22, hy + h * .16, moon.x + wobble, hy + h * .4);
	ctx.quadraticCurveTo(moon.x - 26, hy + h * .2, moon.x - 6, hy);
	ctx.fill();
	ctx.restore();
	ctx.lineWidth = 1;
	const bands = 16;
	for (let i = 0; i < bands; i++) {
		const t = i / bands;
		const y = hy + 10 + t * t * (h - hy) * .92;
		if (y > h) break;
		ctx.beginPath();
		const amp = 1.4 + t * 5;
		for (let x = 0; x <= w; x += 10) {
			const yy = y + Math.sin(x * .012 + scene.t * .9 + i * .6) * amp;
			if (x === 0) ctx.moveTo(x, yy);
			else ctx.lineTo(x, yy);
		}
		ctx.strokeStyle = `rgba(230, 210, 255, ${.08 + (1 - t) * .16})`;
		ctx.stroke();
	}
	for (const ripple of scene.ripples) {
		ctx.beginPath();
		ctx.ellipse(ripple.x, ripple.y, ripple.r, ripple.r * .32, 0, 0, Math.PI * 2);
		ctx.strokeStyle = `rgba(255, 220, 160, ${ripple.life * .45})`;
		ctx.stroke();
	}
}
function drawBanks(ctx, scene) {
	const hy = horizonOf(scene.h);
	const { w, h } = scene;
	ctx.fillStyle = "#0a0614";
	const inset = w * .1;
	ctx.beginPath();
	ctx.moveTo(0, hy - 2);
	ctx.lineTo(inset * .25, hy + 4);
	ctx.lineTo(inset, h);
	ctx.lineTo(0, h);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(w, hy - 2);
	ctx.lineTo(w - inset * .25, hy + 4);
	ctx.lineTo(w - inset, h);
	ctx.lineTo(w, h);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#140a1c";
	for (const side of [-1, 1]) for (let i = 0; i < 7; i++) {
		const y = hy + 18 + i * i * 6;
		if (y > h) break;
		const x = side < 0 ? inset * (.15 + i * .08) : w - inset * (.15 + i * .08);
		const s = 6 + i * 2.2;
		ctx.beginPath();
		ctx.moveTo(x, y - s * 2.1);
		ctx.lineTo(x + s, y);
		ctx.lineTo(x - s, y);
		ctx.closePath();
		ctx.fill();
	}
}
function blossom(ctx, x, y, r, petal, heart) {
	for (let i = 0; i < 5; i++) {
		const a = i / 5 * Math.PI * 2 - Math.PI / 2;
		ctx.beginPath();
		ctx.ellipse(x + Math.cos(a) * r * .5, y + Math.sin(a) * r * .42, r * .52, r * .34, a, 0, Math.PI * 2);
		ctx.fillStyle = petal;
		ctx.fill();
	}
	ctx.beginPath();
	ctx.arc(x, y, r * .32, 0, Math.PI * 2);
	ctx.fillStyle = heart;
	ctx.fill();
}
function drawKrathongShape(ctx, flower, scale, flick) {
	ctx.scale(scale, scale);
	ctx.fillStyle = "rgba(0,0,0,0.28)";
	ctx.beginPath();
	ctx.ellipse(0, 12, 48, 11, 0, 0, Math.PI * 2);
	ctx.fill();
	const leaf = ctx.createLinearGradient(-70, -10, 70, 16);
	leaf.addColorStop(0, "#2f6a34");
	leaf.addColorStop(.45, "#d9c07a");
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
	bowl.addColorStop(.55, "#c9843a");
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
		const a = i / paint.n * Math.PI - Math.PI * .15;
		blossom(ctx, Math.cos(a) * 18, -8 + Math.sin(a) * 6, paint.r, paint.petal, paint.heart);
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
	flame.addColorStop(.45, "#ffb020");
	flame.addColorStop(1, "rgba(255, 90, 20, 0)");
	ctx.fillStyle = flame;
	ctx.beginPath();
	ctx.moveTo(0, -14);
	ctx.bezierCurveTo(7, -22, 4, -28 - fh * .2, 0, -18 - fh);
	ctx.bezierCurveTo(-4, -28 - fh * .2, -7, -22, 0, -14);
	ctx.fill();
}
function drawKrathongs(ctx, scene) {
	const ordered = [...scene.krathongs].sort((a, b) => b.depth - a.depth);
	for (const k of ordered) {
		const p = project(scene, k);
		const alpha = (k.depth < .84 ? 1 : clamp(1 - (k.depth - .84) / .2, 0, 1)) * k.born;
		const flick = .5 + .5 * Math.sin(scene.t * 9 + k.phase * 3);
		ctx.save();
		ctx.globalAlpha = alpha * .85;
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
		ctx.rotate(Math.sin(scene.t * .45 + k.phase) * .08);
		drawKrathongShape(ctx, k.flower, p.scale, flick);
		ctx.restore();
		const reflH = 28 * p.scale;
		const grad = ctx.createLinearGradient(p.x, p.y + 8, p.x, p.y + reflH);
		grad.addColorStop(0, `rgba(255, 186, 70, ${.28 * alpha})`);
		grad.addColorStop(1, "rgba(255, 186, 70, 0)");
		ctx.fillStyle = grad;
		ctx.fillRect(p.x - 2 * p.scale, p.y + 6, Math.max(2, 4 * p.scale), reflH);
		if (k.wish && p.scale > .4 && alpha > .35) {
			ctx.save();
			ctx.globalAlpha = alpha;
			const size = Math.max(12, Math.round(13 * p.scale));
			ctx.font = `600 ${size}px Sarabun, Loma, FreeSerif, sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			const label = k.wish.length > 22 ? `${k.wish.slice(0, 21)}…` : k.wish;
			const bw = ctx.measureText(label).width + 20;
			const bh = size + 10;
			const bx = p.x - bw / 2;
			const by = p.y - 58 * p.scale - bh;
			ctx.fillStyle = "rgba(16, 8, 24, 0.62)";
			roundRect(ctx, bx, by, bw, bh, 8);
			ctx.fill();
			ctx.strokeStyle = "rgba(240, 193, 75, 0.45)";
			ctx.stroke();
			ctx.fillStyle = "#f7f1e8";
			ctx.fillText(label, p.x, by + bh / 2 + .5);
			ctx.restore();
		}
	}
}
function roundRect(ctx, x, y, w, h, r) {
	const radius = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + w, y, x + w, y + h, radius);
	ctx.arcTo(x + w, y + h, x, y + h, radius);
	ctx.arcTo(x, y + h, x, y, radius);
	ctx.arcTo(x, y, x + w, y, radius);
	ctx.closePath();
}
function drawLanterns(ctx, scene) {
	const ordered = [...scene.lanterns].sort((a, b) => b.y - a.y);
	for (const lantern of ordered) {
		const x = lantern.x0 + Math.sin(scene.t * .85 + lantern.phase) * 16;
		const y = lantern.y;
		const s = lantern.size * clamp(scene.w / 900, .75, 1.15);
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
		ctx.moveTo(0, -bodyH * .7);
		ctx.lineTo(0, -bodyH * .7 - 10 * s);
		ctx.stroke();
		const paper = ctx.createLinearGradient(0, -bodyH / 2, 0, bodyH / 2);
		if (lantern.pink) {
			paper.addColorStop(0, "#ffd0dc");
			paper.addColorStop(.5, "#ff8fab");
			paper.addColorStop(1, "#e0567a");
		} else {
			paper.addColorStop(0, "#fff1c9");
			paper.addColorStop(.48, "#ffc14d");
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
		ctx.moveTo(-bodyW * .45, -bodyH * .2);
		ctx.quadraticCurveTo(0, bodyH * .15, bodyW * .45, -bodyH * .2);
		ctx.stroke();
		const flame = .65 + .35 * Math.sin(scene.t * 10 + lantern.phase);
		ctx.fillStyle = `rgba(255, 244, 210, ${.75 + flame * .25})`;
		ctx.beginPath();
		ctx.ellipse(0, 2 * s, 2.4 * s, 4.5 * s * flame, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}
function drawWisps(ctx, scene) {
	for (const wisp of scene.wisps) {
		ctx.beginPath();
		ctx.fillStyle = `rgba(230, 220, 240, ${wisp.life * .18})`;
		ctx.arc(wisp.x, wisp.y, wisp.r, 0, Math.PI * 2);
		ctx.fill();
	}
}
function drawPetals(ctx, scene) {
	for (const petal of scene.petals) {
		ctx.save();
		ctx.translate(petal.x, petal.y);
		ctx.rotate(petal.rot);
		ctx.fillStyle = petal.pink ? "rgba(240, 160, 192, 0.85)" : "rgba(255, 196, 90, 0.88)";
		ctx.beginPath();
		ctx.ellipse(0, 0, petal.w, petal.w * .45, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}
function drawSparks(ctx, scene) {
	ctx.save();
	ctx.globalCompositeOperation = "lighter";
	ctx.lineCap = "round";
	for (const spark of scene.sparks) {
		const alpha = clamp(spark.life / spark.max, 0, 1);
		ctx.strokeStyle = hexAlpha(spark.color, alpha);
		ctx.lineWidth = spark.size;
		ctx.beginPath();
		ctx.moveTo(spark.x, spark.y);
		ctx.lineTo(spark.x - spark.vx * .035, spark.y - spark.vy * .035);
		ctx.stroke();
	}
	ctx.restore();
}
function hexAlpha(hex, alpha) {
	const h = hex.replace("#", "");
	return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${alpha})`;
}
function drawFlies(ctx, scene) {
	ctx.save();
	ctx.globalCompositeOperation = "lighter";
	for (const fly of scene.flies) {
		ctx.fillStyle = `rgba(214, 255, 170, ${.15 + .85 * Math.abs(Math.sin(fly.phase))})`;
		ctx.beginPath();
		ctx.arc(fly.x, fly.y, 1.7, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}
function drawVignette(ctx, scene) {
	const { w, h } = scene;
	const v = ctx.createRadialGradient(w * .5, h * .42, h * .2, w * .5, h * .48, h * .78);
	v.addColorStop(0, "rgba(0,0,0,0)");
	v.addColorStop(1, "rgba(0,0,0,0.28)");
	ctx.fillStyle = v;
	ctx.fillRect(0, 0, w, h);
}
function drawScene(ctx, scene) {
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
function afloatCount(scene) {
	return scene.krathongs.length;
}
function LoyCanvas({ ref, flower, wish, audible, onRelease, onStats }) {
	const canvasRef = (0, import_react.useRef)(null);
	const sceneRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const flowerRef = (0, import_react.useRef)(flower);
	const wishRef = (0, import_react.useRef)(wish);
	const audibleRef = (0, import_react.useRef)(audible);
	const onReleaseRef = (0, import_react.useRef)(onRelease);
	const onStatsRef = (0, import_react.useRef)(onStats);
	flowerRef.current = flower;
	wishRef.current = wish;
	audibleRef.current = audible;
	onReleaseRef.current = onRelease;
	onStatsRef.current = onStats;
	(0, import_react.useImperativeHandle)(ref, () => ({
		release(text, nextFlower, xNorm) {
			const scene = sceneRef.current;
			if (!scene) return text;
			const wrote = text.trim().length > 0;
			const shown = releaseKrathong(scene, text, nextFlower, xNorm ?? .5);
			if (audibleRef.current) audioRef.current?.chime("krathong");
			onReleaseRef.current(shown, nextFlower, wrote);
			return shown;
		},
		lantern(xNorm) {
			const scene = sceneRef.current;
			if (!scene) return;
			launchLantern(scene, xNorm);
			if (audibleRef.current) audioRef.current?.chime("lantern");
		},
		setAudible(on) {
			audibleRef.current = on;
			audioRef.current?.setAudible(on);
		}
	}));
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const parent = canvas?.parentElement;
		if (!canvas || !parent) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const scene = createScene(parent.clientWidth || 390, parent.clientHeight || 700, reduce);
		sceneRef.current = scene;
		const audio = createFestivalAudio();
		audioRef.current = audio;
		if (audibleRef.current) audio.setAudible(true);
		let raf = 0;
		let last = performance.now();
		let stamp = "";
		let statsAt = 0;
		const frame = (now) => {
			const dt = (now - last) / 1e3;
			last = now;
			const w = parent.clientWidth;
			const h = parent.clientHeight;
			if (w > 2 && h > 2) {
				const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
				const bw = Math.floor(w * dpr);
				const bh = Math.floor(h * dpr);
				if (canvas.width !== bw || canvas.height !== bh) {
					canvas.width = bw;
					canvas.height = bh;
				}
				resizeScene(scene, w, h);
				updateScene(scene, dt);
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				drawScene(ctx, scene);
				if (now - statsAt > 350) {
					statsAt = now;
					const next = `${afloatCount(scene)}:${scene.booms}:${scene.lanterns.length}:${scene.released}`;
					if (next !== stamp) {
						stamp = next;
						onStatsRef.current({
							afloat: afloatCount(scene),
							booms: scene.booms,
							lanterns: scene.lanterns.length,
							released: scene.released
						});
					}
				}
			}
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
		return () => {
			cancelAnimationFrame(raf);
			audio.dispose();
			sceneRef.current = null;
		};
	}, []);
	function onPointerDown(event) {
		const scene = sceneRef.current;
		const canvas = canvasRef.current;
		if (!scene || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		if (rect.width < 2 || rect.height < 2) return;
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		if (y < horizonOf(scene.h)) {
			burst(scene, x, y, y < horizonOf(scene.h) * .55 ? "peony" : "willow");
			if (audibleRef.current) audioRef.current?.boom();
			return;
		}
		const xNorm = Math.max(0, Math.min(1, x / rect.width));
		const text = wishRef.current;
		const wrote = text.trim().length > 0;
		const shown = releaseKrathong(scene, text, flowerRef.current, xNorm);
		if (audibleRef.current) audioRef.current?.chime("krathong");
		onReleaseRef.current(shown, flowerRef.current, wrote);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		"aria-hidden": "true",
		onPointerDown,
		className: "absolute inset-0 h-full w-full touch-none"
	});
}
var WISH_KEY = "loy-krathong-wishes";
function readWishes() {
	try {
		const raw = localStorage.getItem(WISH_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
	} catch {
		return [];
	}
}
function Home() {
	const stage = (0, import_react.useRef)(null);
	const [wish, setWish] = (0, import_react.useState)("");
	const [flower, setFlower] = (0, import_react.useState)("marigold");
	const [open, setOpen] = (0, import_react.useState)(true);
	const [audible, setAudible] = (0, import_react.useState)(false);
	const [journalOn, setJournalOn] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)([]);
	const [toast, setToast] = (0, import_react.useState)("");
	const [announce, setAnnounce] = (0, import_react.useState)("");
	const [counts, setCounts] = (0, import_react.useState)({
		mine: 0,
		lantern: 0,
		boom: 0,
		afloat: 0
	});
	const toastTimer = (0, import_react.useRef)(0);
	function remember(text, next, wrote) {
		setOpen(false);
		setWish("");
		setAnnounce(`ปล่อยกระทงแล้ว ${text}`);
		window.clearTimeout(toastTimer.current);
		setToast(text);
		toastTimer.current = window.setTimeout(() => setToast(""), 2800);
		if (!wrote) return;
		setSaved((prev) => {
			const nextSaved = [{
				text,
				flower: next,
				at: Date.now()
			}, ...prev].slice(0, 30);
			localStorage.setItem(WISH_KEY, JSON.stringify(nextSaved));
			return nextSaved;
		});
	}
	function begin(withSound) {
		setAudible(withSound);
		setOpen(false);
		setSaved(readWishes());
		stage.current?.setAudible(withSound);
	}
	function toggleSound() {
		const next = !audible;
		setAudible(next);
		stage.current?.setAudible(next);
	}
	function onStats(stats) {
		setCounts((current) => current.afloat === stats.afloat && current.boom === stats.booms && current.lantern === stats.lanterns && current.mine === stats.released ? current : {
			afloat: stats.afloat,
			boom: stats.booms,
			lantern: stats.lanterns,
			mine: stats.released
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-night text-mist",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoyCanvas, {
				ref: stage,
				flower,
				wish,
				audible,
				onRelease: remember,
				onStats
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: announce
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl leading-none text-gold",
							children: "ลอยกระทง"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "คืนเพ็ญ · เดือนสิบสอง"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm leading-snug text-mist",
							children: [
								"สายน้ำ ",
								counts.afloat,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: " · "
								}),
								"โคม ",
								counts.lantern,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: " · "
								}),
								"พลุ ",
								counts.boom
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: toggleSound,
					"aria-pressed": audible,
					"aria-label": audible ? "ปิดเสียง" : "เปิดเสียงสายน้ำ",
					className: "pointer-events-auto grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-veil/80 text-gold transition-transform duration-150 ease-out active:scale-[0.96]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative h-6 w-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
							className: "absolute inset-0 h-6 w-6 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] " + (audible ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
							className: "absolute inset-0 h-6 w-6 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] " + (audible ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"),
							"aria-hidden": "true"
						})]
					})
				})]
			}),
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute top-24 left-1/2 z-20 max-w-[80vw] -translate-x-1/2 truncate rounded-full border border-gold/35 bg-veil/85 px-4 py-2 text-sm text-mist",
				children: toast
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 pt-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "pointer-events-auto w-full max-w-md rounded-2xl border border-gold/35 bg-veil/80 px-5 py-6 text-center backdrop-blur-md sm:px-6 sm:py-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rise text-sm text-gold",
							children: "เทศกาลสายน้ำ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "rise rise-2 mt-2 font-display text-3xl leading-tight text-gold sm:text-5xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: "สุขสันต์วัน"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: "ลอยกระทง"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rise rise-3 mx-auto mt-3 max-w-xs text-base leading-relaxed text-mist",
							children: "เขียนคำอธิษฐาน ปล่อยกระทงลงสายน้ำ ลอยโคมขึ้นฟ้า แล้วแตะท้องฟ้าเพื่อจุดพลุ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rise rise-3 mt-6 flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => begin(true),
								className: "h-12 flex-1 rounded-xl bg-gold px-4 text-base font-semibold text-night transition-transform duration-150 ease-out active:scale-[0.96]",
								children: "เริ่มพร้อมเสียง"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => begin(false),
								className: "h-12 flex-1 rounded-xl border border-gold/40 px-4 text-base text-mist transition-transform duration-150 ease-out active:scale-[0.96]",
								children: "เข้าเงียบๆ"
							})]
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "absolute inset-x-0 bottom-0 z-20 p-3 sm:p-5 " + (open ? "hidden" : ""),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-3xl rounded-2xl border border-gold/30 bg-veil/80 p-3 backdrop-blur-md sm:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex gap-2",
							children: FLOWERS.map((item) => {
								const selected = flower === item.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": selected,
									onClick: () => setFlower(item.id),
									className: "flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border text-sm whitespace-nowrap transition-transform duration-150 ease-out active:scale-[0.96] " + (selected ? "border-gold bg-gold/15 text-gold" : "border-muted/30 text-mist"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-3 w-3 shrink-0 rounded-full " + (item.id === "lotus" ? "bg-lotus" : item.id === "jasmine" ? "bg-mist" : "bg-gold"),
										"aria-hidden": "true"
									}), item.label]
								}, item.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "grid grid-cols-2 gap-2",
							onSubmit: (event) => {
								event.preventDefault();
								stage.current?.release(wish, flower);
								setOpen(false);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "sr-only",
									htmlFor: "wish",
									children: "คำอธิษฐาน"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "wish",
									value: wish,
									maxLength: 36,
									onChange: (event) => setWish(event.target.value),
									placeholder: "เขียนคำอธิษฐาน แล้วปล่อยลงน้ำ",
									className: "col-span-2 h-12 rounded-xl border border-gold/25 bg-night/75 px-4 text-base text-mist outline-none placeholder:text-muted focus-visible:border-gold"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "h-12 rounded-xl bg-gold text-base font-semibold text-night transition-transform duration-150 ease-out active:scale-[0.96]",
									children: "ปล่อยกระทง"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										stage.current?.lantern();
										setOpen(false);
									},
									className: "h-12 rounded-xl border border-gold/40 text-base text-gold transition-transform duration-150 ease-out active:scale-[0.96]",
									children: "ลอยโคม"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "min-w-0 text-sm leading-snug text-muted",
								children: "แตะฟ้าจุดพลุ · แตะน้ำปล่อยกระทง"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setSaved(readWishes());
									setJournalOn((value) => !value);
								},
								"aria-expanded": journalOn,
								className: "h-11 shrink-0 rounded-full px-2 text-sm text-gold",
								children: ["คำอธิษฐาน", saved.length > 0 ? ` ${saved.length}` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden transition-[max-height] duration-200 ease-out " + (journalOn ? "max-h-40" : "max-h-0"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "max-h-36 space-y-2 overflow-y-auto pt-3",
								children: saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-sm text-muted",
									children: "ยังไม่มีคำที่เขียนไว้ — พิมพ์แล้วปล่อยกระทง"
								}) : saved.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 rounded-xl bg-night/55 px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate text-mist",
										children: item.text
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-muted",
										children: FLOWERS.find((entry) => entry.id === item.flower)?.label
									})]
								}, item.at))
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Home as component };
