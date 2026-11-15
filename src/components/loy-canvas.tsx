import { useEffect, useImperativeHandle, useRef, type PointerEvent, type Ref } from "react";
import { createFestivalAudio, type FestivalAudio } from "@/lib/festival/audio";
import {
  afloatCount,
  burst,
  createScene,
  drawScene,
  horizonOf,
  launchLantern,
  releaseKrathong,
  resizeScene,
  updateScene,
  type FlowerId,
  type Scene,
} from "@/lib/festival/scene";

export type LoyHandle = {
  release: (wish: string, flower: FlowerId, xNorm?: number) => string;
  lantern: (xNorm?: number) => void;
  setAudible: (on: boolean) => void;
};

export type SceneStats = {
  afloat: number;
  booms: number;
  lanterns: number;
  released: number;
};

type Props = {
  ref?: Ref<LoyHandle>;
  flower: FlowerId;
  wish: string;
  audible: boolean;
  onRelease: (text: string, flower: FlowerId, wrote: boolean) => void;
  onStats: (stats: SceneStats) => void;
};

export function LoyCanvas({ ref, flower, wish, audible, onRelease, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const audioRef = useRef<FestivalAudio | null>(null);
  const flowerRef = useRef(flower);
  const wishRef = useRef(wish);
  const audibleRef = useRef(audible);
  const onReleaseRef = useRef(onRelease);
  const onStatsRef = useRef(onStats);
  flowerRef.current = flower;
  wishRef.current = wish;
  audibleRef.current = audible;
  onReleaseRef.current = onRelease;
  onStatsRef.current = onStats;

  useImperativeHandle(ref, () => ({
    release(text, nextFlower, xNorm) {
      const scene = sceneRef.current;
      if (!scene) return text;
      const wrote = text.trim().length > 0;
      const shown = releaseKrathong(scene, text, nextFlower, xNorm ?? 0.5);
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
    },
  }));

  useEffect(() => {
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

    const frame = (now: number) => {
      const dt = (now - last) / 1000;
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
              released: scene.released,
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

  function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (y < horizonOf(scene.h)) {
      burst(scene, x, y, y < horizonOf(scene.h) * 0.55 ? "peony" : "willow");
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

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      className="absolute inset-0 h-full w-full touch-none"
    />
  );
}
