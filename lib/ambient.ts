/**
 * Бүрэн өөрийн үүсгэсэн (generative) зөөлөн ambient дуу — гадны аудио файл, зохиогчийн эрхтэй материал ашиглахгүй.
 * Web Audio API-аар: удаан хөдөлдөг дулаан "pad" + зөөлөн төгөлдөр хуурын төстэй ганц нотууд + урт reverb.
 * Хэрэглэгч товч дарсны дараа л эхэлнэ (autoplay байхгүй).
 */

type Ctx = AudioContext;

// A minor-ийн уянгалаг дараалал: Am9 → Fmaj7 → Cmaj7 → G6
const CHORDS: number[][] = [
  [110.0, 164.81, 220.0, 261.63, 329.63], // Am add9-ish
  [87.31, 130.81, 174.61, 220.0, 329.63], // Fmaj7
  [130.81, 196.0, 246.94, 329.63, 392.0], // Cmaj7
  [98.0, 146.83, 196.0, 246.94, 329.63], // G6
];

// Дээд октавын зөөлөн нотууд (A minor pentatonic + 9)
const MELODY = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0];

const CHORD_SECONDS = 9;

function makeImpulse(ctx: Ctx, seconds = 4.2, decay = 3.2): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buf;
}

export class AmbientPlayer {
  private ctx: Ctx | null = null;
  private master!: GainNode;
  private dry!: GainNode;
  private wet!: GainNode;
  private timer: number | null = null;
  private nextChordAt = 0;
  private nextNoteAt = 0;
  private chordIndex = 0;
  private noteIndex = 0;
  playing = false;

  private ensure(): Ctx {
    if (this.ctx) return this.ctx;
    const Ctor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    const convolver = ctx.createConvolver();
    convolver.buffer = makeImpulse(ctx);
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.7;
    this.dry = ctx.createGain();
    this.dry.gain.value = 0.55;

    this.dry.connect(this.master);
    this.wet.connect(convolver);
    convolver.connect(this.master);
    return ctx;
  }

  private pad(freqs: number[], when: number) {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 780;
    filter.Q.value = 0.4;
    filter.connect(this.dry);
    filter.connect(this.wet);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(0.075, when + 3.2);
    env.gain.setValueAtTime(0.075, when + CHORD_SECONDS - 1.2);
    env.gain.exponentialRampToValueAtTime(0.0001, when + CHORD_SECONDS + 3.2);
    env.connect(filter);

    freqs.forEach((f, i) => {
      for (const detune of [-5, 5]) {
        const o = ctx.createOscillator();
        o.type = i < 2 ? "sine" : "triangle";
        o.frequency.value = f;
        o.detune.value = detune;
        const g = ctx.createGain();
        g.gain.value = i < 2 ? 0.34 : 0.17;
        o.connect(g);
        g.connect(env);
        o.start(when);
        o.stop(when + CHORD_SECONDS + 3.4);
      }
    });
  }

  private note(freq: number, when: number, velocity = 1) {
    const ctx = this.ctx!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(0.11 * velocity, when + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 4.2);

    const pan = ctx.createStereoPanner();
    pan.pan.value = (Math.random() - 0.5) * 0.7;
    env.connect(pan);
    pan.connect(this.dry);
    pan.connect(this.wet);

    // Үндсэн + 2-р гармоник + бага зэрэг 3-р → төгөлдөр хуурын зөөлөн өнгө
    const partials: Array<[number, number, OscillatorType]> = [
      [1, 1, "sine"],
      [2, 0.28, "sine"],
      [3, 0.08, "sine"],
    ];
    partials.forEach(([mul, amp, type]) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq * mul;
      const g = ctx.createGain();
      g.gain.value = amp;
      o.connect(g);
      g.connect(env);
      o.start(when);
      o.stop(when + 4.4);
    });
  }

  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    const horizon = ctx.currentTime + 2.5;

    while (this.nextChordAt < horizon) {
      this.pad(CHORDS[this.chordIndex % CHORDS.length], this.nextChordAt);
      this.chordIndex++;
      this.nextChordAt += CHORD_SECONDS;
    }
    while (this.nextNoteAt < horizon) {
      // Эгшиг бүрт 1–2 нот, зарим үед чимээгүй зай үлдээнэ
      const f = MELODY[(this.noteIndex * 2 + (this.noteIndex % 3)) % MELODY.length];
      if (this.noteIndex % 5 !== 4) this.note(f, this.nextNoteAt, 0.75 + (this.noteIndex % 3) * 0.12);
      this.noteIndex++;
      this.nextNoteAt += 2.4 + (this.noteIndex % 4) * 0.7;
    }
  };

  async start() {
    const ctx = this.ensure();
    if (ctx.state === "suspended") await ctx.resume();
    if (this.playing) return;
    this.playing = true;
    const now = ctx.currentTime;
    this.nextChordAt = now + 0.1;
    this.nextNoteAt = now + 2.8;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.9, now + 3.5);
    this.schedule();
    this.timer = window.setInterval(this.schedule, 800);
  }

  stop() {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    this.playing = false;
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 1.4);
    // Дараа нь бүх зүйлийг зогсооно (олон oscillator үлдэхгүй)
    window.setTimeout(() => {
      if (!this.playing) {
        void ctx.close();
        this.ctx = null;
      }
    }, 1600);
  }

  pauseForHidden() {
    if (this.ctx && this.playing) void this.ctx.suspend();
  }

  resumeFromHidden() {
    if (this.ctx && this.playing) void this.ctx.resume();
  }
}
