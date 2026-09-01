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

  playCameraSwoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.32);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(1600, t + 0.14);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.32);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.16, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
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
      // Warm resonant cow moo
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(115, t + 0.35);
      osc.frequency.linearRampToValueAtTime(95, t + 0.55);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    } else if (type === 'buffalo') {
      // Deep powerful buffalo bellow
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.linearRampToValueAtTime(78, t + 0.45);
      osc.frequency.linearRampToValueAtTime(65, t + 0.7);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.24, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.75);
    } else if (type === 'goat') {
      // Cheerful bleat ("meh-eh-eh")
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(360, t + 0.08);
      osc.frequency.linearRampToValueAtTime(290, t + 0.18);
      osc.frequency.linearRampToValueAtTime(330, t + 0.28);
      osc.frequency.linearRampToValueAtTime(270, t + 0.4);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.17, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.42);
    } else if (type === 'chicken') {
      // Perky cluck-cluck
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(940, t + 0.07);
      osc.frequency.exponentialRampToValueAtTime(480, t + 0.16);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.20, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    } else if (type === 'horse') {
      // Gentle friendly horse whinny
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.linearRampToValueAtTime(620, t + 0.12);
      osc.frequency.linearRampToValueAtTime(460, t + 0.24);
      osc.frequency.linearRampToValueAtTime(540, t + 0.36);
      osc.frequency.linearRampToValueAtTime(380, t + 0.52);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    } else if (type === 'dog') {
      // Playful friendly woof
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.14);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } else {
      // Default sheep baa
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.linearRampToValueAtTime(220, t + 0.28);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    }
  }

  // Breeding animal selection audio cue
  playBreedingSelect(type) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // 1. Sweet selection harp chime (love duo notes)
    [587.33, 880.00].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.05);

      gain.gain.setValueAtTime(0.16, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.25);
    });

    // 2. Pair with distinctive animal vocal cue shortly after
    setTimeout(() => {
      this.playAnimal(type);
    }, 70);
  }

  // Sparkling 'New Life' chime when a baby animal is spawned
  playNewLifeChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Uplifting multi-octave celestial chime arpeggio (C5 -> E5 -> G5 -> B5 -> C6 -> E6 -> G6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.055);

      gain.gain.setValueAtTime(0.24, t + i * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.055 + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.055);
      osc.stop(t + i * 0.055 + 0.55);
    });

    // Warm bell swell underneath
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(261.63, t); // C4
    bassGain.gain.setValueAtTime(0.18, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    bassOsc.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    bassOsc.start(t);
    bassOsc.stop(t + 0.8);
  }

  playBabyBirth() {
    this.playNewLifeChime();
  }

  // Chicken coop latch lock/unlock sound
  playCoopLatch(locked) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(locked ? 420 : 280, t);
    osc.frequency.exponentialRampToValueAtTime(locked ? 210 : 520, t + 0.08);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Whistle call to guide animals into or out of shelters
  playShelterCall() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.linearRampToValueAtTime(1174.66, t + 0.15);
    osc.frequency.linearRampToValueAtTime(987.77, t + 0.32);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
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

  playTutorialStep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Pleasant uplifting progression (C5 -> E5 -> G5 -> C6)
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);

      gain.gain.setValueAtTime(0.18, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.35);
    });
  }

  playBreeding() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Romantic romantic love harp ripple
    [440.0, 554.37, 659.25, 880.0, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);

      gain.gain.setValueAtTime(0.15, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.4);
    });
  }

  playBabyBirth() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Joyful celebration fanfare & baby bell chime
    [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.06);

      gain.gain.setValueAtTime(0.22, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.5);
    });
  }

  playJump() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.15);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playLand() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  playBikeBell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Classic double bell ding-ding! (1760Hz -> 2093Hz)
    [1760, 2093].forEach((f, i) => {
      const delay = i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + delay);
      gain.gain.setValueAtTime(0.2, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + delay);
      osc.stop(t + delay + 0.35);
    });
  }

  playHorn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Vehicle horn honk
    [329.63, 415.30].forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  playWaterSplash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Splash noise pulse
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.2);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playFishingCast() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.35);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playFishingBite() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Splash & tug
    this.playWaterSplash();
    [880, 1108].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.08);
      gain.gain.setValueAtTime(0.2, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.15);
    });
  }

  playFishingCatch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Catch triumph chime
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t + i * 0.09);
      gain.gain.setValueAtTime(0.2, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.45);
    });
  }
  playSplash() {
    this.playWaterSplash();
  }

  playFishBite() {
    this.playFishingBite();
  }

  playFishCatch() {
    this.playFishingCatch();
  }
}

window.soundEngine = new SoundEngine();
