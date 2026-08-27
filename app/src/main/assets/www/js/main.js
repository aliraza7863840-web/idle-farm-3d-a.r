// Main Game Loop, Three.js Rendering & Interaction Controller

function initGame() {
  // --- Three.js Setup with Fallbacks & Optimization ---
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'default',
      precision: 'mediump',
      alpha: false,
      preserveDrawingBuffer: false
    });
  } catch (err) {
    console.warn("WebGL high performance failed, falling back", err);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  }

  const width = window.innerWidth || 360;
  const height = window.innerHeight || 640;
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn("WebGL Context Lost");
  }, false);

  canvas.addEventListener('webglcontextrestored', () => {
    console.log("WebGL Context Restored");
  }, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x81d4fa);
  scene.fog = new THREE.Fog(0x81d4fa, 45, 100);

  // Isometric / Perspective Camera centered on Farm
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
  camera.position.set(10, 11, 14);
  camera.lookAt(0, 0.5, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.minDistance = 6;
  controls.maxDistance = 50;
  controls.target.set(0, 0.5, 0);
  controls.update();

  // --- Lighting & Day-Night System ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffaed, 1.25);
  sunLight.position.set(25, 35, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 512;
  sunLight.shadow.mapSize.height = 512;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 80;
  const d = 26;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  let isNight = false;
  let dayNightTimer = 0;
  const cycleDuration = 90; // 90 seconds full day-night cycle

  window.toggleDayNight = () => {
    isNight = !isNight;
    applyDayNight(isNight ? 1 : 0);
    return isNight;
  };

  function applyDayNight(nightFactor) {
    const daySky = new THREE.Color(0x81d4fa);
    const nightSky = new THREE.Color(0x0a1128);
    const currentSky = daySky.clone().lerp(nightSky, nightFactor);

    scene.background.copy(currentSky);
    scene.fog.color.copy(currentSky);

    const dayAmb = new THREE.Color(0xffffff);
    const nightAmb = new THREE.Color(0x334466);
    ambientLight.color.copy(dayAmb.clone().lerp(nightAmb, nightFactor));
    ambientLight.intensity = 0.78 - nightFactor * 0.4;

    const daySun = new THREE.Color(0xfffaed);
    const nightSun = new THREE.Color(0x90caf9);
    sunLight.color.copy(daySun.clone().lerp(nightSun, nightFactor));
    sunLight.intensity = 1.25 - nightFactor * 0.75;
  }

  // --- Initialize Audio Engine ---
  window.soundEngine = new SoundEngine();

  // --- Initialize Dynamic Weather System ---
  const weatherSystem = new WeatherSystem(scene, ambientLight, sunLight);
  window.weatherSystem = weatherSystem;

  // --- Initialize Game Subsystems ---
  const gameState = new GameState();
  const farmWorld = new FarmWorld(scene);
  const player = new PlayerCharacter(scene);
  player.speed = gameState.playerSpeed;

  // Build Farm House to saved stage
  farmWorld.buildFarmHouse(gameState.houseLevel);

  // Sync unlocked plots and animals
  gameState.unlockedPlots.forEach(pid => {
    if (farmWorld.plots[pid]) {
      farmWorld.plots[pid].unlocked = true;
      if (farmWorld.plots[pid].lockGroup) farmWorld.plots[pid].lockGroup.visible = false;
    }
  });
  gameState.unlockedAnimals.forEach(aid => {
    const p = farmWorld.animals.find(a => a.type === aid);
    if (p) p.unlocked = true;
  });

  const uiController = new UIController(gameState, farmWorld, player, weatherSystem);
  window.uiController = uiController;

  // --- Particles: Chimney Smoke ---
  const smokeParticles = [];
  const smokeGeo = new THREE.SphereGeometry(0.15, 6, 6);
  const smokeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

  for (let i = 0; i < 15; i++) {
    const p = new THREE.Mesh(smokeGeo, smokeMat.clone());
    p.position.set(-4.5, 3.8 + Math.random() * 2, -5.0);
    scene.add(p);
    smokeParticles.push({
      mesh: p,
      life: Math.random(),
      speed: 0.8 + Math.random() * 0.4
    });
  }

  // --- Camera helper functions ---
  window.focusCameraOnPlayer = () => {
    const p = player.group.position;
    controls.target.set(p.x, p.y + 0.5, p.z);
    camera.position.set(p.x + 9, p.y + 10, p.z + 12);
  };

  window.setCameraOverview = () => {
    controls.target.set(0, 0, 0);
    camera.position.set(16, 20, 22);
  };

  window.zoomCamera = (delta) => {
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const len = dir.length();
    const newLen = Math.max(6, Math.min(50, len + delta));
    dir.setLength(newLen);
    camera.position.copy(controls.target).add(dir);
  };

  // --- Raycasting for Clicking & Interacting ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let pointerDownTime = 0;
  let pointerDownPos = { x: 0, y: 0 };

  window.addEventListener('pointerdown', (e) => {
    pointerDownTime = Date.now();
    pointerDownPos = { x: e.clientX, y: e.clientY };
    if (window.soundEngine) window.soundEngine.init();
  });

  window.addEventListener('pointerup', (e) => {
    const dx = Math.abs(e.clientX - pointerDownPos.x);
    const dy = Math.abs(e.clientY - pointerDownPos.y);
    if (dx > 10 || dy > 10 || (Date.now() - pointerDownTime) > 350) return;

    if (e.target.closest('.top-bar, .side-controls, .bottom-nav, .modal-backdrop, .popup-modal, .joystick-zone')) {
      return;
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
      // Check if clicked close to a crop plot
      let clickedPlot = null;
      farmWorld.plots.forEach(plot => {
        if (plot.unlocked) {
          const d = intersectPoint.distanceTo(plot.group.position);
          if (d < 3.0) clickedPlot = plot;
        }
      });

      if (clickedPlot) {
        // Move character to plot
        player.moveTo(clickedPlot.group.position.x, clickedPlot.group.position.z);

        if (clickedPlot.state === 'empty' || clickedPlot.growth === 0) {
          // Plant Seeds Cycle Action
          setTimeout(() => {
            player.triggerPlant();
            clickedPlot.plant();
            uiController.showFloatingText('🌱 Sowed Wheat Seeds!', e.clientX, e.clientY);
          }, 150);
        } else if (clickedPlot.ready) {
          // Harvest Ripe Wheat Cycle Action
          setTimeout(() => {
            player.triggerHarvest();
            clickedPlot.harvest();

            const reward = clickedPlot.type === 'wheat' ? 25 :
                           clickedPlot.type === 'corn' ? 45 :
                           clickedPlot.type === 'carrot' ? 90 :
                           clickedPlot.type === 'strawberry' ? 180 : 350;

            gameState.addCoins(reward, e.clientX, e.clientY);
            gameState.addXP(10);
            gameState.addItem(clickedPlot.type, 1);
            uiController.showFloatingText(`+${reward} 🪙 Wheat Harvested!`, e.clientX, e.clientY);
          }, 150);
        } else {
          // Nurture / Water Growing Crop (+25% Growth boost)
          setTimeout(() => {
            player.triggerPlant();
            clickedPlot.growth = Math.min(1.0, clickedPlot.growth + 0.25);
            if (window.soundEngine) window.soundEngine.playHarvest();
            uiController.showFloatingText('💧 Watered (+25% Growth)', e.clientX, e.clientY);
          }, 150);
        }
      } else {
        // Move character to target ground location
        player.moveTo(intersectPoint.x, intersectPoint.z);
      }
    }
  });

  // --- Main Animation & Simulation Loop ---
  let lastTime = performance.now();
  let saveTicker = 0;

  function animate(now) {
    requestAnimationFrame(animate);

    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Automated Day-Night Progression
    dayNightTimer += delta;
    const cycleProgress = (dayNightTimer % cycleDuration) / cycleDuration;
    const smoothNight = Math.sin(cycleProgress * Math.PI * 2);
    const autoNightFactor = Math.max(0, -smoothNight);

    const activeNight = isNight || autoNightFactor > 0.4;
    applyDayNight(isNight ? 1 : autoNightFactor);

    // Update Subsystems
    weatherSystem.update(delta, activeNight);
    player.update(delta);
    farmWorld.update(delta, activeNight, gameState, weatherSystem);
    gameState.update(delta);

    // Proximity Auto-Plant & Auto-Harvest
    farmWorld.plots.forEach(plot => {
      if (!plot.unlocked) return;
      const dist = player.group.position.distanceTo(plot.group.position);

      if (dist <= gameState.harvestRadius) {
        if (plot.ready) {
          // Proximity Auto-Harvest
          plot.harvest();
          player.triggerHarvest();
          const reward = plot.type === 'wheat' ? 25 :
                         plot.type === 'corn' ? 45 :
                         plot.type === 'carrot' ? 90 :
                         plot.type === 'strawberry' ? 180 : 350;
          gameState.addCoins(reward, window.innerWidth / 2, window.innerHeight / 2 - 40);
          gameState.addXP(10);
          gameState.addItem(plot.type, 1);
        } else if (plot.state === 'empty' && player.state === 'idle') {
          // Proximity Auto-Plant
          plot.plant();
          player.triggerPlant();
        }
      }
    });

    // Animate Chimney Smoke
    smokeParticles.forEach(p => {
      p.life += delta * p.speed * 0.4;
      p.mesh.position.y += delta * 0.8;
      p.mesh.position.x += Math.sin(p.life * 4) * 0.01;
      p.mesh.scale.setScalar(1.0 + p.life * 1.5);
      p.mesh.material.opacity = Math.max(0, 0.6 - p.life * 0.5);

      if (p.life >= 1.2) {
        p.life = 0;
        p.mesh.position.set(-4.5, 3.8, -5.0);
      }
    });

    // Periodic Save
    saveTicker += delta;
    if (saveTicker >= 5.0) {
      saveTicker = 0;
      gameState.save();
    }

    controls.update();
    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

