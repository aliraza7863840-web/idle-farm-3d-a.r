// Dynamic 3D Weather System (Sunny, Cloudy, Rain) with Visual Effects & Crop Growth Influences

class WeatherSystem {
  constructor(scene, ambientLight, sunLight) {
    this.scene = scene;
    this.ambientLight = ambientLight;
    this.sunLight = sunLight;

    this.currentWeather = 'sunny'; // 'sunny', 'cloudy', 'rain'
    this.weatherTimer = 0;
    this.cycleDuration = 55; // Auto-cycle every 55 seconds
    this.weatherSequence = ['sunny', 'cloudy', 'rain', 'sunny'];
    this.sequenceIndex = 0;

    this.weatherConfigs = {
      sunny: {
        id: 'sunny',
        name: 'Sunny Day',
        icon: '☀️',
        growthMult: 1.3,
        badgeText: '☀️ Sun Boost (+30% Speed)',
        announcement: '☀️ Bright sunshine! Warm rays boost crop growth by +30%!',
        skyColor: new THREE.Color(0x64b5f6),
        fogColor: new THREE.Color(0x81d4fa),
        fogDensity: 0.013,
        ambColor: new THREE.Color(0xffffff),
        ambIntensity: 0.78,
        sunColor: new THREE.Color(0xfffaed),
        sunIntensity: 1.35
      },
      cloudy: {
        id: 'cloudy',
        name: 'Overcast Clouds',
        icon: '☁️',
        growthMult: 1.0,
        badgeText: '☁️ Overcast (1.0x Normal)',
        announcement: '☁️ Cool clouds roll in overhead with a gentle farm breeze.',
        skyColor: new THREE.Color(0x78909c),
        fogColor: new THREE.Color(0x90a4ae),
        fogDensity: 0.019,
        ambColor: new THREE.Color(0xdce7eb),
        ambIntensity: 0.68,
        sunColor: new THREE.Color(0xd7e0e8),
        sunIntensity: 0.85
      },
      rain: {
        id: 'rain',
        name: 'Nutrient Rain',
        icon: '🌧️',
        growthMult: 2.0,
        badgeText: '🌧️ Rain Boost (+100% Speed)',
        announcement: '🌧️ Gentle rain shower! Soil is hydrated — crops grow 2x faster (2.0x)!',
        skyColor: new THREE.Color(0x3e525f),
        fogColor: new THREE.Color(0x455a64),
        fogDensity: 0.025,
        ambColor: new THREE.Color(0x90a4ae),
        ambIntensity: 0.48,
        sunColor: new THREE.Color(0x78909c),
        sunIntensity: 0.55
      }
    };

    // Transition interpolation targets
    this.targetSky = new THREE.Color(0x64b5f6);
    this.targetFog = new THREE.Color(0x81d4fa);
    this.targetFogDensity = 0.013;
    this.targetAmbColor = new THREE.Color(0xffffff);
    this.targetAmbInt = 0.78;
    this.targetSunColor = new THREE.Color(0xfffaed);
    this.targetSunInt = 1.35;

    // Build 3D Visual Effects
    this.weatherGroup = new THREE.Group();
    this.scene.add(this.weatherGroup);

    this.initRainSystem();
    this.initCloudSystem();
    this.initSunSystem();

    // Start with sunny defaults
    this.setWeather('sunny', false);
  }

  // --- 1. Rain Particle & Splash System ---
  initRainSystem() {
    this.rainGroup = new THREE.Group();
    this.weatherGroup.add(this.rainGroup);

    const rainCount = 1400;
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60; // X
      positions[i * 3 + 1] = Math.random() * 35;         // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60; // Z

      velocities[i * 3 + 0] = 0.8 + Math.random() * 0.4; // slight wind X
      velocities[i * 3 + 1] = 28 + Math.random() * 8;    // fall speed Y
      velocities[i * 3 + 2] = 0.5 + Math.random() * 0.3; // wind Z
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.rainPositions = positions;
    this.rainVelocities = velocities;
    this.rainGeo = rainGeo;

    // Rain drop point texture (soft streak)
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(8, 0, 8, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.5, 'rgba(180, 225, 255, 0.6)');
    grad.addColorStop(1, 'rgba(230, 245, 255, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(6, 0, 4, 32);

    const rainTexture = new THREE.CanvasTexture(canvas);
    this.rainMat = new THREE.PointsMaterial({
      size: 0.75,
      map: rainTexture,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.rainMesh = new THREE.Points(rainGeo, this.rainMat);
    this.rainGroup.add(this.rainMesh);

    // Ground Puddle Splash Rings
    this.splashes = [];
    const splashGeo = new THREE.RingGeometry(0.08, 0.22, 8);
    const splashMat = new THREE.MeshBasicMaterial({
      color: 0xcde8ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });

    for (let s = 0; s < 25; s++) {
      const splashMesh = new THREE.Mesh(splashGeo, splashMat.clone());
      splashMesh.rotation.x = -Math.PI / 2;
      splashMesh.position.set(
        (Math.random() - 0.5) * 40,
        0.05,
        (Math.random() - 0.5) * 40
      );
      this.rainGroup.add(splashMesh);
      this.splashes.push({
        mesh: splashMesh,
        life: Math.random(),
        scale: 0.2
      });
    }

    this.rainGroup.visible = false;
  }

  // --- 2. Low-Poly 3D Cloud Cluster System ---
  initCloudSystem() {
    this.cloudsGroup = new THREE.Group();
    this.weatherGroup.add(this.cloudsGroup);

    this.clouds = [];
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xf5f9fc,
      transparent: true,
      opacity: 0.92
    });

    const cloudCount = 8;
    for (let c = 0; c < cloudCount; c++) {
      const cloud = new THREE.Group();
      const numPuffs = 5 + Math.floor(Math.random() * 4);

      for (let p = 0; p < numPuffs; p++) {
        const radius = 1.4 + Math.random() * 1.8;
        const puffGeo = new THREE.DodecahedronGeometry(radius, 1);
        const puff = new THREE.Mesh(puffGeo, cloudMat.clone());
        puff.position.set(
          (p - numPuffs / 2) * 1.8 + (Math.random() - 0.5) * 1.0,
          (Math.random() - 0.5) * 0.9,
          (Math.random() - 0.5) * 1.6
        );
        puff.scale.set(1.2, 0.75, 1.0);
        puff.castShadow = true;
        cloud.add(puff);
      }

      const startX = -40 + (c / cloudCount) * 80;
      const altitude = 18 + (c % 3) * 3.5;
      const zPos = -26 + (c % 4) * 16;
      cloud.position.set(startX, altitude, zPos);

      this.cloudsGroup.add(cloud);
      this.clouds.push({
        group: cloud,
        speed: 1.2 + Math.random() * 0.8,
        initialZ: zPos
      });
    }
  }

  // --- 3. Sunny Flare & Warm Sparkles ---
  initSunSystem() {
    this.sunGroup = new THREE.Group();
    this.weatherGroup.add(this.sunGroup);

    // Sun Disc in Sky
    const sunDiscGeo = new THREE.CircleGeometry(3.5, 24);
    const sunDiscMat = new THREE.MeshBasicMaterial({
      color: 0xfff3a8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    this.sunDisc = new THREE.Mesh(sunDiscGeo, sunDiscMat);
    this.sunDisc.position.set(32, 44, 26);
    this.sunDisc.lookAt(0, 0, 0);
    this.sunGroup.add(this.sunDisc);

    // Rotating Sun Ray Halo
    const rayHaloGeo = new THREE.RingGeometry(3.8, 7.5, 16);
    const rayHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffd54f,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.sunHalo = new THREE.Mesh(rayHaloGeo, rayHaloMat);
    this.sunHalo.position.copy(this.sunDisc.position);
    this.sunHalo.lookAt(0, 0, 0);
    this.sunGroup.add(this.sunHalo);

    // Warm Pollen / Golden Sparkles floating in the air
    const sparkleCount = 45;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3 + 0] = (Math.random() - 0.5) * 35;
      sparklePositions[i * 3 + 1] = 0.5 + Math.random() * 6;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    this.sparklePositions = sparklePositions;

    this.sparkleMat = new THREE.PointsMaterial({
      color: 0xffeb3b,
      size: 0.32,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    this.sparkleMesh = new THREE.Points(sparkleGeo, this.sparkleMat);
    this.sunGroup.add(this.sparkleMesh);
  }

  // Set weather directly (e.g. from UI toggle or auto-cycle)
  setWeather(weatherKey, announce = true) {
    if (!this.weatherConfigs[weatherKey]) return;

    this.currentWeather = weatherKey;
    const cfg = this.weatherConfigs[weatherKey];

    this.targetSky = cfg.skyColor;
    this.targetFog = cfg.fogColor;
    this.targetFogDensity = cfg.fogDensity;
    this.targetAmbColor = cfg.ambColor;
    this.targetAmbInt = cfg.ambIntensity;
    this.targetSunColor = cfg.sunColor;
    this.targetSunInt = cfg.sunIntensity;

    // Sound effects
    if (window.soundEngine) {
      if (weatherKey === 'rain') {
        window.soundEngine.startRainSound();
      } else {
        window.soundEngine.stopRainSound();
      }
    }

    // UI Updates & Notifications
    if (announce && window.uiController) {
      window.uiController.showFloatNum(
        `${cfg.icon} ${cfg.name}! x${cfg.growthMult} Speed`,
        window.innerWidth / 2,
        window.innerHeight / 2 - 60
      );
      window.uiController.updateWeatherUI(cfg);
    }
  }

  nextWeather() {
    this.sequenceIndex = (this.sequenceIndex + 1) % this.weatherSequence.length;
    const nextType = this.weatherSequence[this.sequenceIndex];
    this.setWeather(nextType, true);
    return this.currentWeather;
  }

  getGrowthMultiplier() {
    return this.weatherConfigs[this.currentWeather] ? this.weatherConfigs[this.currentWeather].growthMult : 1.0;
  }

  getCurrentConfig() {
    return this.weatherConfigs[this.currentWeather];
  }

  // Frame Update Loop
  update(delta, isNight) {
    // 1. Auto-cycle timer
    this.weatherTimer += delta;
    if (this.weatherTimer >= this.cycleDuration) {
      this.weatherTimer = 0;
      this.nextWeather();
    }

    // 2. Smooth Lighting & Sky Interpolation
    const lerpSpeed = delta * 2.2;
    const nightBlend = isNight ? 0.8 : 0.0;

    const baseSky = this.targetSky.clone().lerp(new THREE.Color(0x0a1128), nightBlend);
    const baseFog = this.targetFog.clone().lerp(new THREE.Color(0x0a1128), nightBlend);

    this.scene.background.lerp(baseSky, lerpSpeed);
    if (this.scene.fog) {
      this.scene.fog.color.lerp(baseFog, lerpSpeed);
      this.scene.fog.density += (this.targetFogDensity - this.scene.fog.density) * lerpSpeed;
    }

    const ambTarget = this.targetAmbColor.clone().lerp(new THREE.Color(0x223344), nightBlend);
    this.ambientLight.color.lerp(ambTarget, lerpSpeed);
    const ambIntTarget = isNight ? 0.35 : this.targetAmbInt;
    this.ambientLight.intensity += (ambIntTarget - this.ambientLight.intensity) * lerpSpeed;

    const sunTarget = this.targetSunColor.clone().lerp(new THREE.Color(0x607d8b), nightBlend);
    this.sunLight.color.lerp(sunTarget, lerpSpeed);
    const sunIntTarget = isNight ? 0.3 : this.targetSunInt;
    this.sunLight.intensity += (sunIntTarget - this.sunLight.intensity) * lerpSpeed;

    // 3. Update Rain Particle FX
    const isRain = this.currentWeather === 'rain';
    this.rainGroup.visible = true;
    const targetRainOpacity = isRain ? (isNight ? 0.45 : 0.75) : 0.0;
    this.rainMat.opacity += (targetRainOpacity - this.rainMat.opacity) * delta * 4.0;

    if (this.rainMat.opacity > 0.01) {
      const pos = this.rainPositions;
      const vel = this.rainVelocities;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 0] += vel[i * 3 + 0] * delta;
        pos[i * 3 + 1] -= vel[i * 3 + 1] * delta;
        pos[i * 3 + 2] += vel[i * 3 + 2] * delta;

        // Reset if reached ground level
        if (pos[i * 3 + 1] <= 0.2) {
          pos[i * 3 + 1] = 28 + Math.random() * 5;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 60;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
      }
      this.rainGeo.attributes.position.needsUpdate = true;

      // Puddle Splashes
      this.splashes.forEach(sp => {
        sp.life += delta * 2.5;
        if (sp.life >= 1.0) {
          sp.life = 0;
          sp.mesh.position.set(
            (Math.random() - 0.5) * 44,
            0.06,
            (Math.random() - 0.5) * 44
          );
          sp.scale = 0.2;
        }
        sp.scale = 0.2 + sp.life * 1.2;
        sp.mesh.scale.set(sp.scale, sp.scale, 1);
        sp.mesh.material.opacity = Math.max(0, (1.0 - sp.life) * (this.rainMat.opacity * 0.8));
      });
    }

    // 4. Update Cloud Drift FX
    const isCloudy = this.currentWeather === 'cloudy';
    this.clouds.forEach(cl => {
      cl.group.position.x += cl.speed * delta;
      if (cl.group.position.x > 45) {
        cl.group.position.x = -45;
      }
      // Puffy breathing effect
      const t = Date.now() * 0.001 + cl.initialZ;
      cl.group.position.y = (18 + Math.sin(t * 0.5) * 0.8);
      
      const targetOp = isCloudy ? 0.95 : isRain ? 0.85 : 0.4;
      cl.group.children.forEach(child => {
        if (child.material) {
          child.material.opacity += (targetOp - child.material.opacity) * delta * 2.0;
        }
      });
    });

    // 5. Update Sunny Flares & Floating Sparkles
    const isSunny = this.currentWeather === 'sunny';
    if (this.sunHalo) {
      this.sunHalo.rotation.z += delta * 0.2;
      const targetSunOp = isSunny && !isNight ? 0.35 : 0.0;
      this.sunHalo.material.opacity += (targetSunOp - this.sunHalo.material.opacity) * delta * 3.0;
      this.sunDisc.material.opacity += ((isSunny && !isNight ? 0.9 : 0.0) - this.sunDisc.material.opacity) * delta * 3.0;
    }

    if (this.sparkleMesh) {
      const targetSparkleOp = isSunny && !isNight ? 0.75 : 0.0;
      this.sparkleMat.opacity += (targetSparkleOp - this.sparkleMat.opacity) * delta * 3.0;

      if (this.sparkleMat.opacity > 0.01) {
        const sPos = this.sparklePositions;
        const sCount = sPos.length / 3;
        for (let s = 0; s < sCount; s++) {
          sPos[s * 3 + 1] += delta * (0.4 + (s % 3) * 0.2);
          sPos[s * 3 + 0] += Math.sin(Date.now() * 0.001 + s) * 0.02;
          if (sPos[s * 3 + 1] > 7.0) {
            sPos[s * 3 + 1] = 0.5;
            sPos[s * 3 + 0] = (Math.random() - 0.5) * 35;
            sPos[s * 3 + 2] = (Math.random() - 0.5) * 35;
          }
        }
        this.sparkleMesh.geometry.attributes.position.needsUpdate = true;
      }
    }
  }
}

window.WeatherSystem = WeatherSystem;
