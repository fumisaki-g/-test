type AudioCtor = typeof AudioContext;

export type FestivalAudio = {
  setAudible: (on: boolean) => void;
  chime: (kind: "krathong" | "lantern") => void;
  boom: () => void;
  dispose: () => void;
};

export function createFestivalAudio(): FestivalAudio {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let water: AudioBufferSourceNode | null = null;

  function context(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (ctx) return ctx;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const seconds = 2;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < data.length; i++) {
      brown = (brown + (Math.random() * 2 - 1) * 0.04) * 0.98;
      data[i] = brown * 3.2;
    }
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const gain = ctx.createGain();
    gain.gain.value = 0.22;
    water = ctx.createBufferSource();
    water.buffer = buffer;
    water.loop = true;
    water.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    water.start();
    return ctx;
  }

  function tone(freq: number, dur: number, type: OscillatorType, peak: number) {
    const c = context();
    if (!c || !master) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.62), c.currentTime + dur);
    gain.gain.setValueAtTime(0.0001, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(peak, c.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    osc.stop(c.currentTime + dur + 0.02);
  }

  return {
    setAudible(on) {
      const c = context();
      if (!c || !master) return;
      if (c.state === "suspended") void c.resume();
      master.gain.setTargetAtTime(on ? 0.9 : 0, c.currentTime, 0.06);
    },
    chime(kind) {
      if (kind === "lantern") {
        tone(880, 1.1, "sine", 0.05);
        tone(1318, 0.8, "triangle", 0.02);
        return;
      }
      tone(523.25, 1.35, "sine", 0.07);
      tone(783.99, 1.15, "triangle", 0.035);
    },
    boom() {
      const c = context();
      if (!c || !master) return;
      tone(140, 0.45, "sine", 0.12);
      const frames = Math.floor(c.sampleRate * 0.25);
      const buffer = c.createBuffer(1, frames, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
      const src = c.createBufferSource();
      src.buffer = buffer;
      const filter = c.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 900;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.16, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.28);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      src.start();
    },
    dispose() {
      water?.stop();
      void ctx?.close();
      ctx = null;
      master = null;
      water = null;
    },
  };
}
