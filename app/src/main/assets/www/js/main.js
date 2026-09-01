// Main Game Loop, Three.js Rendering & Interaction Controller

function initGame() {
  // --- Three.js Setup with Fallbacks & Optimization ---
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  let renderer;
  const rendererOptions = {
    canvas,
    antialias: false,
    powerPreference: 'default',
    precision: 'mediump',
    alpha: false,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false
  };

  try {
    renderer = new THREE.WebGLRenderer(rendererOptions);
  } catch (err) {
    console.warn("Standard WebGL creation failed, attempting basic fallback:", err);
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, failIfMajorPerformanceCaveat: false });
    } catch (fallbackErr) {
      console.warn("Second WebGL attempt failed, trying minimal attributes:", fallbackErr);
      try {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: false });
        }
      } catch (contextErr) {
        console.error("Critical: WebGL renderer could not be created:", contextErr);
      }
    }
  }

  if (!renderer) {
    console.error("WebGL is not supported or could not be initialized.");
    return;
  }

  const width = Math.max(window.innerWidth || 360, 360);
  const height = Math.max(window.innerHeight || 640, 640);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x81d4fa, 1.0);
  try {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
  } catch (shadowErr) {
    console.warn("Shadow map initialization skipped:", shadowErr);
  }

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn("WebGL Context Lost");
  }, false);

  canvas.addEventListener('webglcontextrestored', () => {
    console.log("WebGL Context Restored");
    renderer.setClearColor(0x81d4fa, 1.0);
  }, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x81d4fa);
  scene.fog = new THREE.Fog(0x81d4fa, 120, 650);

  // Isometric / Perspective Camera with expanded view distance for 600x600 world
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(10, 11, 13);
  camera.lookAt(0, 0.8, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 2.5;
  controls.maxDistance = 220;
  controls.target.set(0, 0.8, 0);
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
  const DAY_LENGTH = 180.0;  // 3 minutes daytime
  const NIGHT_LENGTH = 15.0; // 15 seconds night
  const TOTAL_CYCLE = DAY_LENGTH + NIGHT_LENGTH; // 195s cycle

  window.toggleDayNight = () => {
    isNight = !isNight;
    if (isNight) {
      dayNightTimer = DAY_LENGTH;
      applyDayNight(1.0);
    } else {
      dayNightTimer = 0;
      applyDayNight(0.0);
    }
    return isNight;
  };

  function applyDayNight(nightFactor) {
    const daySky = new THREE.Color(0x81d4fa);
    const duskSky = new THREE.Color(0xff8a65); // Warm sunset golden-orange
    const nightSky = new THREE.Color(0x0a1128);

    // Warm sunset gradient during transition
    let currentSky;
    if (nightFactor > 0.05 && nightFactor < 0.85) {
      const sunsetProgress = Math.sin(((nightFactor - 0.05) / 0.8) * Math.PI);
      currentSky = daySky.clone().lerp(duskSky, sunsetProgress * 0.75).lerp(nightSky, nightFactor);
    } else {
      currentSky = daySky.clone().lerp(nightSky, nightFactor);
    }

    scene.background.copy(currentSky);
    scene.fog.color.copy(currentSky);

    const dayAmb = new THREE.Color(0xffffff);
    const nightAmb = new THREE.Color(0x334466);
    ambientLight.color.copy(dayAmb.clone().lerp(nightAmb, nightFactor));
    ambientLight.intensity = 0.78 - nightFactor * 0.42;

    const daySun = new THREE.Color(0xfffaed);
    const nightSun = new THREE.Color(0x90caf9);
    sunLight.color.copy(daySun.clone().lerp(nightSun, nightFactor));
    sunLight.intensity = 1.25 - nightFactor * 0.8;
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

  // Initialize Step-by-Step Tutorial System
  const tutorialSystem = new TutorialSystem(gameState, farmWorld, player, uiController);
  window.tutorialSystem = tutorialSystem;

  // Sync initial 3D Animals
  farmWorld.syncAnimals(gameState.animalsData);

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

  // --- Multi-Camera Modes & Dynamic Perspective System ---
  // Modes: 'third' (3rd-person follow), 'first' (1st-person cockpit/POV), 'map' (panoramic drone overview)
  let cameraMode = 'third';

  const cameraTransition = {
    active: false,
    startTime: 0,
    duration: 0.85,
    mode: 'third',
    startCamPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    targetTarget: new THREE.Vector3(),
    targetCamPos: new THREE.Vector3()
  };

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function updateCameraUI() {
    const btnFocus = document.getElementById('btn-cam-reset');
    const btnMap = document.getElementById('btn-cam-overview');
    const btnMode = document.getElementById('btn-cam-mode');
    if (btnFocus) btnFocus.classList.toggle('active', cameraMode === 'third');
    if (btnMap) btnMap.classList.toggle('active', cameraMode === 'map');
    if (btnMode) {
      const modeLabels = { 'third': '🚜 3rd Person', 'first': '👁️ 1st Person', 'map': '🗺️ Drone Map' };
      btnMode.textContent = modeLabels[cameraMode] || '📹 Camera';
    }
  }

  function startCameraTransition(mode, duration = 0.75) {
    cameraMode = mode;
    updateCameraUI();

    if (window.soundEngine && window.soundEngine.playCameraSwoosh) {
      window.soundEngine.playCameraSwoosh();
    }

    cameraTransition.active = true;
    cameraTransition.startTime = performance.now();
    cameraTransition.duration = duration;
    cameraTransition.mode = mode;
    cameraTransition.startCamPos.copy(camera.position);
    cameraTransition.startTarget.copy(controls.target);

    const p = player.group.position;
    if (mode === 'third') {
      const distOffset = player.mountedVehicle ? 13 : 10.5;
      cameraTransition.targetTarget.set(p.x, p.y + 0.8, p.z);
      cameraTransition.targetCamPos.set(p.x + 9, p.y + distOffset, p.z + 12);
      if (window.uiController && window.uiController.showFloatNum) {
        window.uiController.showFloatNum('📹 3rd Person Follow', window.innerWidth / 2, 80);
      }
    } else if (mode === 'first') {
      const rot = player.group.rotation.y;
      const headY = player.mountedVehicle ? 1.6 : 1.7;
      const forwardX = Math.sin(rot);
      const forwardZ = Math.cos(rot);
      cameraTransition.targetCamPos.set(p.x + forwardX * 0.3, p.y + headY, p.z + forwardZ * 0.3);
      cameraTransition.targetTarget.set(p.x + forwardX * 10, p.y + headY * 0.9, p.z + forwardZ * 10);
      if (window.uiController && window.uiController.showFloatNum) {
        window.uiController.showFloatNum('👁️ 1st Person POV / Cockpit View', window.innerWidth / 2, 80);
      }
    } else {
      // Drone / Map Mode: High altitude panoramic view
      cameraTransition.targetTarget.set(p.x, 0.4, p.z);
      cameraTransition.targetCamPos.set(p.x + 22, 45, p.z + 32);
      if (window.uiController && window.uiController.showFloatNum) {
        window.uiController.showFloatNum('🗺️ Drone Overview Mode', window.innerWidth / 2, 80);
      }
    }
  }

  window.cycleCameraMode = () => {
    if (cameraMode === 'third') {
      startCameraTransition('first', 0.65);
    } else if (cameraMode === 'first') {
      startCameraTransition('map', 0.85);
    } else {
      startCameraTransition('third', 0.75);
    }
    return cameraMode;
  };

  window.setCameraMode = (mode) => {
    startCameraTransition(mode);
  };

  window.focusCameraOnPlayer = (duration = 0.75) => {
    startCameraTransition('third', duration);
  };

  window.setCameraOverview = (duration = 0.85) => {
    startCameraTransition('map', duration);
  };

  window.getCameraMode = () => cameraMode;

  window.zoomCamera = (delta) => {
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const currentLen = dir.length();
    const newLen = Math.max(3, Math.min(160, currentLen + delta));
    dir.setLength(newLen);
    const destCamPos = controls.target.clone().add(dir);

    cameraTransition.active = true;
    cameraTransition.startTime = performance.now();
    cameraTransition.duration = 0.22;
    cameraTransition.mode = cameraMode;
    cameraTransition.startCamPos.copy(camera.position);
    cameraTransition.startTarget.copy(controls.target);
    cameraTransition.targetTarget.copy(controls.target);
    cameraTransition.targetCamPos.copy(destCamPos);
  };

  // GTA-Style Take / Enter / Exit Vehicle Controller
  window.toggleEnterExitVehicle = () => {
    if (!player || !farmWorld) return;
    const p = player.group.position;

    if (player.mountedVehicle) {
      // Dismount vehicle and leave it parked in the world
      const vehType = player.mountedVehicle;
      const spawnX = p.x + Math.sin(player.group.rotation.y + Math.PI / 2) * 1.6;
      const spawnZ = p.z + Math.cos(player.group.rotation.y + Math.PI / 2) * 1.6;
      
      farmWorld.leaveWorldVehicle(vehType, spawnX, spawnZ, player.group.rotation.y);
      player.dismount();
      gameState.currentVehicle = null;

      if (window.soundEngine) window.soundEngine.playFootstep();
      if (window.uiController) {
        window.uiController.updateVehicleHUD();
        window.uiController.showFloatNum('🚶 Exited Vehicle', window.innerWidth / 2, window.innerHeight / 2 - 20);
      }
    } else {
      // Check if near any parked world vehicle
      const nearbyVeh = farmWorld.getNearbyWorldVehicle(p.x, p.z, 4.5);
      if (nearbyVeh) {
        // Take / Steal this specific world vehicle (GTA-Style)
        const vehType = nearbyVeh.type;
        const vehName = nearbyVeh.name;
        farmWorld.enterWorldVehicle(nearbyVeh);
        player.mount(vehType);
        gameState.currentVehicle = vehType;

        if (window.soundEngine) {
          if (vehType === 'bike') window.soundEngine.playBikeBell();
          else window.soundEngine.playHorn();
        }
        if (window.uiController) {
          window.uiController.updateVehicleHUD();
          window.uiController.showFloatNum(`🏎️ Driving ${vehName}! Press E or Dismount to exit.`, window.innerWidth / 2, window.innerHeight / 2 - 25);
        }
      } else {
        // Mount active garage vehicle (e.g. Starter Bike or Tractor)
        const activeVeh = gameState.activeVehicle || 'bike';
        player.mount(activeVeh);
        gameState.currentVehicle = activeVeh;
        if (window.uiController) {
          window.uiController.updateVehicleHUD();
          const name = gameState.vehicles[activeVeh] ? gameState.vehicles[activeVeh].name : 'Vehicle';
          window.uiController.showFloatNum(`Riding ${name}!`, window.innerWidth / 2, window.innerHeight / 2 - 20);
        }
      }
    }
  };

  // Player Jump Controller
  window.triggerPlayerJump = () => {
    if (player) {
      player.jump();
      if (window.soundEngine) window.soundEngine.playJump();
    }
  };

  // Sit & Lie Down Interaction Controllers
  window.toggleSit = () => {
    if (!player) return;
    if (player.isSitting) {
      player.standUp();
      if (window.uiController) window.uiController.showFloatNum('🧍 Stood Up', window.innerWidth / 2, window.innerHeight / 2 - 20);
    } else {
      const p = player.group.position;
      const furn = farmWorld.getNearbyFurniture ? farmWorld.getNearbyFurniture(p.x, p.z, 3.5) : null;
      if (furn && (furn.action === 'sit' || furn.action === 'bench' || furn.action === 'chair')) {
        player.group.position.set(furn.x, 0.45, furn.z);
        player.group.rotation.y = furn.rot;
        player.sit();
        if (window.uiController) window.uiController.showFloatNum(`🪑 Sitting on ${furn.name}`, window.innerWidth / 2, window.innerHeight / 2 - 20);
      } else {
        player.sit();
        if (window.uiController) window.uiController.showFloatNum('🪑 Sitting Down', window.innerWidth / 2, window.innerHeight / 2 - 20);
      }
    }
  };

  window.toggleLieDown = () => {
    if (!player) return;
    if (player.isLying) {
      player.standUp();
      if (window.uiController) window.uiController.showFloatNum('🧍 Stood Up', window.innerWidth / 2, window.innerHeight / 2 - 20);
    } else {
      const p = player.group.position;
      const furn = farmWorld.getNearbyFurniture ? farmWorld.getNearbyFurniture(p.x, p.z, 3.5) : null;
      if (furn && (furn.action === 'lie' || furn.action === 'bed' || furn.action === 'lounger')) {
        player.group.position.set(furn.x, 0.5, furn.z);
        player.group.rotation.y = furn.rot;
        player.lieDown();
        if (window.uiController) window.uiController.showFloatNum(`🛏️ Resting on ${furn.name}`, window.innerWidth / 2, window.innerHeight / 2 - 20);
      } else {
        player.lieDown();
        if (window.uiController) window.uiController.showFloatNum('🛏️ Lying Down to Rest', window.innerWidth / 2, window.innerHeight / 2 - 20);
      }
    }
  };

  // If user begins dragging orbit controls, yield camera transition
  controls.addEventListener('start', () => {
    if (cameraTransition.active) {
      cameraTransition.active = false;
    }
  });

  // Sync initial UI state
  updateCameraUI();

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
      // 1. Check if clicked close to an animal pen (Open Breeding / Livestock modal)
      let clickedPen = null;
      farmWorld.animals.forEach(pen => {
        if (pen.unlocked) {
          const d = intersectPoint.distanceTo(pen.group.position);
          if (d < 3.8) clickedPen = pen;
        }
      });

      if (clickedPen) {
        player.moveTo(clickedPen.group.position.x, clickedPen.group.position.z + 1.8);
        setTimeout(() => {
          uiController.openSheet('animals');
          uiController.selectBreedingPen(clickedPen.type);
        }, 220);
        return;
      }

      // 2. Check if clicked close to a crop plot
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
            tutorialSystem.onPlotPlanted(clickedPlot.id);
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
            tutorialSystem.onPlotHarvested(clickedPlot.id);
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
  let prevPlayerPos = null;

  function animate(now) {
    requestAnimationFrame(animate);

    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Automated Day-Night Progression (Day: 180s = 3 mins, Night: 15s = 0.25 mins)
    dayNightTimer = (dayNightTimer + delta) % TOTAL_CYCLE;

    let autoNightFactor = 0;
    if (dayNightTimer < DAY_LENGTH) {
      // Daytime: 0s to 180s
      if (dayNightTimer > DAY_LENGTH - 8.0) {
        // Smooth 8-second sunset transition into dusk and night
        autoNightFactor = (dayNightTimer - (DAY_LENGTH - 8.0)) / 8.0;
      } else {
        autoNightFactor = 0;
      }

      // Hot Weather Care System:
      // Around mid-afternoon (75s to 155s of daytime), the sun reaches peak heat!
      const isAfternoonHot = (dayNightTimer >= 75.0 && dayNightTimer <= 155.0);
      const isSunCondition = weatherSystem && (weatherSystem.currentWeather === 'sunny' || weatherSystem.currentWeather === 'partly_cloudy');
      gameState.setHotWeather(isAfternoonHot && isSunCondition);

      // Morning coop opening: if coop is not locked, chickens come out
      if (!gameState.chickenCoopLocked && dayNightTimer < 165.0) {
        gameState.setChickensInCoop(false);
      }
    } else {
      // Nighttime: 180s to 195s (15 seconds)
      const nightTime = dayNightTimer - DAY_LENGTH;
      if (nightTime > NIGHT_LENGTH - 3.0) {
        // Smooth quick 3-second dawn transition back into morning
        autoNightFactor = 1.0 - (nightTime - (NIGHT_LENGTH - 3.0)) / 3.0;
      } else {
        autoNightFactor = 1.0;
      }

      // Hot weather ends during cool night
      gameState.setHotWeather(false);

      // Night Chicken Routine: Chickens automatically go inside the coop to stay safe
      gameState.setChickensInCoop(true);
    }

    const activeNight = isNight || autoNightFactor > 0.35;
    applyDayNight(isNight ? 1 : autoNightFactor);

    // Keep Day/Night button icon synced
    const btnDayNight = document.getElementById('btn-daynight');
    if (btnDayNight && !isNight) {
      btnDayNight.textContent = activeNight ? '🌙' : '☀️';
    }

    // Update Subsystems
    weatherSystem.update(delta, activeNight);
    player.update(delta);
    farmWorld.update(delta, activeNight, gameState, weatherSystem);
    gameState.update(delta);
    tutorialSystem.update(delta);

    // Track movement for tutorial system
    if (!prevPlayerPos) {
      prevPlayerPos = player.group.position.clone();
    } else {
      const moved = player.group.position.distanceTo(prevPlayerPos);
      if (moved > 0.01) {
        tutorialSystem.onPlayerMove(moved);
        prevPlayerPos.copy(player.group.position);
      }
    }

    // Dynamic River Swimming & Water Physics Check
    if (player && farmWorld) {
      const pPos = player.group.position;
      const inWater = farmWorld.isPointInWater(pPos.x, pPos.z);
      if (inWater !== player.inWater) {
        player.inWater = inWater;
        player.isSwimming = inWater;
        if (inWater) {
          if (window.soundEngine) window.soundEngine.playSplash();
          // If driving into deep river, dismount vehicle
          if (player.mountedVehicle) {
            player.dismount();
            if (window.uiController) window.uiController.updateVehicleHUD();
          }
        }
      }
    }

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
          tutorialSystem.onPlotHarvested(plot.id);
        } else if (plot.state === 'empty' && player.state === 'idle') {
          // Proximity Auto-Plant
          plot.plant();
          player.triggerPlant();
          tutorialSystem.onPlotPlanted(plot.id);
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

    // Proximity Interaction Tracking (World Vehicles & Furniture)
    const pPos = player.group.position;
    const nearbyWorldVeh = farmWorld.getNearbyWorldVehicle(pPos.x, pPos.z, 4.2);
    const nearbyFurn = farmWorld.getNearbyFurniture ? farmWorld.getNearbyFurniture(pPos.x, pPos.z, 3.2) : null;
    if (window.uiController && window.uiController.updateInteractionHUD) {
      window.uiController.updateInteractionHUD(nearbyWorldVeh, nearbyFurn, player.mountedVehicle, player.isSitting, player.isLying);
    }

    // --- Camera Smoothing Transitions & Dynamic Perspectives ---
    if (cameraTransition.active) {
      const elapsed = (now - cameraTransition.startTime) / 1000;
      const progress = Math.min(1.0, elapsed / cameraTransition.duration);
      const t = easeInOutCubic(progress);

      const p = player.group.position;
      if (cameraTransition.mode === 'third') {
        const distOffset = player.mountedVehicle ? 13 : 10.5;
        cameraTransition.targetTarget.set(p.x, p.y + 0.8, p.z);
        cameraTransition.targetCamPos.set(p.x + 9, p.y + distOffset, p.z + 12);
      } else if (cameraTransition.mode === 'first') {
        const rot = player.group.rotation.y;
        const headY = player.mountedVehicle ? 1.55 : 1.65;
        const forwardX = Math.sin(rot);
        const forwardZ = Math.cos(rot);
        cameraTransition.targetCamPos.set(p.x + forwardX * 0.25, p.y + headY, p.z + forwardZ * 0.25);
        cameraTransition.targetTarget.set(p.x + forwardX * 12, p.y + headY * 0.9, p.z + forwardZ * 12);
      }

      camera.position.lerpVectors(cameraTransition.startCamPos, cameraTransition.targetCamPos, t);
      controls.target.lerpVectors(cameraTransition.startTarget, cameraTransition.targetTarget, t);

      if (progress >= 1.0) {
        cameraTransition.active = false;
        camera.position.copy(cameraTransition.targetCamPos);
        controls.target.copy(cameraTransition.targetTarget);
      }
    } else if (cameraMode === 'third') {
      // Third-person smooth follow with vehicle speed dynamics
      const p = player.group.position;
      const desiredTarget = new THREE.Vector3(p.x, p.y + 0.8, p.z);
      const targetDiff = desiredTarget.sub(controls.target);

      if (targetDiff.lengthSq() > 0.00005) {
        const followSpeed = Math.min(1.0, 5.5 * delta);
        const moveStep = targetDiff.multiplyScalar(followSpeed);
        controls.target.add(moveStep);
        camera.position.add(moveStep);
      }
    } else if (cameraMode === 'first') {
      // First-person driver / head perspective
      const p = player.group.position;
      const rot = player.group.rotation.y;
      const headY = player.mountedVehicle ? 1.55 : 1.65;
      const forwardX = Math.sin(rot);
      const forwardZ = Math.cos(rot);

      const eyePos = new THREE.Vector3(p.x + forwardX * 0.25, p.y + headY, p.z + forwardZ * 0.25);
      const lookAtPos = new THREE.Vector3(p.x + forwardX * 15, p.y + headY * 0.9, p.z + forwardZ * 15);

      camera.position.lerp(eyePos, Math.min(1.0, 12.0 * delta));
      controls.target.lerp(lookAtPos, Math.min(1.0, 12.0 * delta));
    } else if (cameraMode === 'map') {
      // Drone mode: follow player smoothly from high altitude
      const p = player.group.position;
      const desiredTarget = new THREE.Vector3(p.x, 0.4, p.z);
      const targetDiff = desiredTarget.sub(controls.target);

      if (targetDiff.lengthSq() > 0.00005) {
        const followSpeed = Math.min(1.0, 4.0 * delta);
        const moveStep = targetDiff.multiplyScalar(followSpeed);
        controls.target.add(moveStep);
        camera.position.add(moveStep);
      }
    }

    controls.update();
    if (renderer) {
      try {
        renderer.render(scene, camera);
      } catch (renderErr) {
        console.error("Three.js render pass error:", renderErr);
      }
    }
  }

  requestAnimationFrame(animate);

  // Resize & Orientation Change handler
  function handleWindowResize() {
    const w = Math.max(window.innerWidth || 360, 360);
    const h = Math.max(window.innerHeight || 640, 640);
    if (camera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    if (renderer) {
      renderer.setSize(w, h);
    }
  }

  window.addEventListener('resize', handleWindowResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleWindowResize, 100);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

