// Audio Synthesizer Engine using Web Audio API
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicPlaying = false;
    this.musicInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicPlaying = false;
    } else if (this.enabled && !this.musicPlaying) {
      this.startAmbientMusic();
    }
    return this.enabled;
  }

  playCoin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, t + 0.08); // E6

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  playGem() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.05);

      gain.gain.setValueAtTime(0.2, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.3);
    });
  }

  playHarvest() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 0.09);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  playPlant() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(740, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  playUpgrade() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.25, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.4);
    });
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const chord = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const t = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.18, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.6);
    });
  }

  playStep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.04);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playAnimal(type) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'cow') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.4);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    } else if (type === 'chicken') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.15);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.linearRampToValueAtTime(220, t + 0.25);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  startRainSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.rainPlaying) return;

    try {
      this.rainPlaying = true;
      // Synthesize soothing rain noise using Web Audio buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02; // Pink noise filter
        lastOut = output[i];
        output[i] *= 3.5;
      }

      this.rainNoise = this.ctx.createBufferSource();
      this.rainNoise.buffer = noiseBuffer;
      this.rainNoise.loop = true;

      // Bandpass / Lowpass filter for soft rainfall tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.rainGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);

      this.rainNoise.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      this.rainNoise.start();
    } catch (e) {
      console.warn("Rain sound error", e);
    }
  }

  stopRainSound() {
    if (!this.rainPlaying || !this.rainGain || !this.ctx) return;
    try {
      this.rainGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
      setTimeout(() => {
        if (this.rainNoise) {
          try { this.rainNoise.stop(); } catch(e){}
          this.rainNoise.disconnect();
          this.rainNoise = null;
        }
        this.rainPlaying = false;
      }, 1100);
    } catch (e) {
      this.rainPlaying = false;
    }
  }

  startAmbientMusic() {
    if (!this.enabled || this.musicPlaying) return;
    this.musicPlaying = true;

    // Gentle relaxing pentatonic progression
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4 D4 E4 G4 A4 C5
    let beat = 0;

    this.musicInterval = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      if (Math.random() > 0.4) {
        const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, t);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 1.6);
      }
      beat++;
    }, 900);
  }
}

window.soundEngine = new SoundEngine();
