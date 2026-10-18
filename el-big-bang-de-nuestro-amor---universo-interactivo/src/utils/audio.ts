/**
 * Web Audio API procedural sound engine.
 * Generates ambient celestial drones, romantic chimes, and Big Bang explosion rumble
 * without any external audio files.
 */

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private oscillators: OscillatorNode[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime, 0.2);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Starts warm, soothing celestial ambient chord progression
   */
  public startAmbient() {
    if (this.isAmbientPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
      master.connect(this.ctx.destination);
      this.ambientGain = master;

      // Romantic chord: Cmaj9 chord (C3, G3, B3, E4, G4)
      const frequencies = [130.81, 196.00, 246.94, 329.63, 392.00];

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Lowpass filter to give gentle space warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + idx * 80, this.ctx.currentTime);

        // Slow LFO for breathing effect
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.04, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);
        lfo.start();

        oscGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(master);

        osc.start();
        this.oscillators.push(osc);
      });

      this.isAmbientPlaying = true;
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Plays the cinematic Big Bang build-up and cosmic explosion
   */
  public playBigBang() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;

      // 1. Pre-bang high energy buildup (whine rising in frequency)
      const buildup = this.ctx.createOscillator();
      const buildupGain = this.ctx.createGain();
      buildup.type = 'sine';
      buildup.frequency.setValueAtTime(80, now);
      buildup.frequency.exponentialRampToValueAtTime(880, now + 1.8);

      buildupGain.gain.setValueAtTime(0.01, now);
      buildupGain.gain.linearRampToValueAtTime(0.3, now + 1.7);
      buildupGain.gain.linearRampToValueAtTime(0, now + 1.85);

      buildup.connect(buildupGain);
      buildupGain.connect(this.ctx.destination);
      buildup.start(now);
      buildup.stop(now + 1.9);

      // 2. Deep sub-bass boom (cosmic explosion)
      const bangTime = now + 1.8;
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, bangTime);
      sub.frequency.exponentialRampToValueAtTime(28, bangTime + 3.5);

      subGain.gain.setValueAtTime(0.7, bangTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, bangTime + 4.5);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(bangTime);
      sub.stop(bangTime + 4.5);

      // 3. Pink noise burst (cosmic shockwave dust)
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1200, bangTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(120, bangTime + 3.0);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, bangTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, bangTime + 3.5);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(bangTime);
      whiteNoise.stop(bangTime + 3.5);

      // 4. Stardust crystal sparkle cascade after explosion
      setTimeout(() => {
        this.playCosmicSparkles();
      }, 2100);

    } catch {
      // Audio fallback
    }
  }

  /**
   * Sparkle sound effect when zooming into a universe
   */
  public playUniverseChime(pitchModifier: number = 1.0) {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51].map(n => n * pitchModifier);

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 1.3);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Delicate cascade of high twinkling stardust notes
   */
  public playCosmicSparkles() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const arpeggio = [587.33, 739.99, 880.00, 1174.66, 1479.98, 1760.00];

      arpeggio.forEach((f, idx) => {
        if (!this.ctx) return;
        const t = now + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

        osc.connect(g);
        g.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.85);
      });
    } catch {
      // Ignore
    }
  }
}

export const cosmicAudio = new CosmicAudioEngine();
