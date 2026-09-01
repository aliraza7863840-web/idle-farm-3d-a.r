// UI Controller & Modal Sheet Management

class UIController {
  constructor(gameState, farmWorld, player, weatherSystem = null) {
    this.gameState = gameState;
    this.farmWorld = farmWorld;
    this.player = player;
    this.weatherSystem = weatherSystem;

    // Cache DOM Elements
    this.coinsDisplay = document.getElementById('coins-display');
    this.gemsDisplay = document.getElementById('gems-display');
    this.levelBadge = document.getElementById('level-badge');
    this.xpBarFill = document.getElementById('xp-bar-fill');
    this.xpText = document.getElementById('xp-text');
    this.floatingNotifs = document.getElementById('floating-notifs');
    this.farmBanner = document.getElementById('farm-banner');
    this.bannerText = document.getElementById('banner-text');
    this.btnWeather = document.getElementById('btn-weather');
    this.hudWeatherBadge = document.getElementById('hud-weather-badge');

    // Modals
    this.modalBackdrop = document.getElementById('modal-backdrop');
    this.sheetTitle = document.getElementById('sheet-title');
    this.sheetBody = document.getElementById('sheet-body');
    this.sheetCloseBtn = document.getElementById('sheet-close-btn');

    this.offlineModal = document.getElementById('offline-modal');
    this.offlineTime = document.getElementById('offline-time');
    this.offlineCoins = document.getElementById('offline-coins');
    this.offlineGems = document.getElementById('offline-gems');
    this.btnClaimOffline = document.getElementById('btn-claim-offline');

    this.levelUpToast = document.getElementById('level-up-toast');
    this.lvlUpText = document.getElementById('lvl-up-text');

    this.setupListeners();
    this.updateTopBar();

    if (this.weatherSystem) {
      this.updateWeatherUI(this.weatherSystem.getCurrentConfig());
    }

    // Check if offline earnings are available
    if (this.gameState.offlineEarnings) {
      this.showOfflineModal(this.gameState.offlineEarnings);
    }
  }

  setupListeners() {
    // Navigation Buttons
    const navCrops = document.getElementById('nav-btn-crops');
    const navAnimals = document.getElementById('nav-btn-animals');
    const navUpgrade = document.getElementById('nav-btn-upgrade');
    const navWorkers = document.getElementById('nav-btn-workers');
    const navShop = document.getElementById('nav-btn-shop');

    if (navCrops) navCrops.addEventListener('click', () => this.openSheet('crops'));
    if (navAnimals) navAnimals.addEventListener('click', () => this.openSheet('animals'));
    if (navUpgrade) navUpgrade.addEventListener('click', () => this.openSheet('upgrades'));
    if (navWorkers) navWorkers.addEventListener('click', () => this.openSheet('workers'));
    if (navShop) navShop.addEventListener('click', () => this.openSheet('market'));

    // Modal Close
    if (this.sheetCloseBtn) {
      this.sheetCloseBtn.addEventListener('click', () => this.closeSheet());
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) this.closeSheet();
      });
    }

    // Weather Button: Toggle / Open Weather Control
    if (this.btnWeather) {
      this.btnWeather.addEventListener('click', () => {
        this.openSheet('weather');
      });
    }

    // Tutorial Helper Button
    const btnTutorial = document.getElementById('btn-tutorial');
    if (btnTutorial) {
      btnTutorial.addEventListener('click', () => {
        if (window.tutorialSystem) {
          window.tutorialSystem.restartTutorial();
        }
      });
    }

    // Offline Claim Button
    if (this.btnClaimOffline) {
      this.btnClaimOffline.addEventListener('click', () => {
        if (this.gameState.offlineEarnings) {
          this.gameState.coins += this.gameState.offlineEarnings.coins;
          this.gameState.gems += this.gameState.offlineEarnings.gems;
          this.gameState.offlineEarnings = null;
          this.gameState.save();
          this.updateTopBar();
          if (window.soundEngine) window.soundEngine.playCoin();
        }
        this.offlineModal.style.display = 'none';
      });
    }

    // Camera Buttons
    const btnCamMode = document.getElementById('btn-cam-mode');
    const btnCamReset = document.getElementById('btn-cam-reset');
    const btnCamOverview = document.getElementById('btn-cam-overview');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');

    if (btnCamMode) btnCamMode.addEventListener('click', () => window.cycleCameraMode && window.cycleCameraMode());
    if (btnCamReset) btnCamReset.addEventListener('click', () => window.focusCameraOnPlayer && window.focusCameraOnPlayer());
    if (btnCamOverview) btnCamOverview.addEventListener('click', () => window.setCameraOverview && window.setCameraOverview());
    if (btnZoomIn) btnZoomIn.addEventListener('click', () => window.zoomCamera && window.zoomCamera(-5));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => window.zoomCamera && window.zoomCamera(5));

    // Day/Night & Audio Toggle
    const btnDayNight = document.getElementById('btn-daynight');
    if (btnDayNight) {
      btnDayNight.addEventListener('click', () => {
        const isNight = window.toggleDayNight ? window.toggleDayNight() : false;
        btnDayNight.textContent = isNight ? '🌙' : '☀️';
      });
    }

    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        if (window.soundEngine) {
          const enabled = window.soundEngine.toggle();
          btnAudio.textContent = enabled ? '🔊' : '🔇';
        }
      });
    }

    // Animal Care HUD Quick Action (Hot Weather & Night Coop)
    const hudCareBtn = document.getElementById('hud-care-action-btn');
    if (hudCareBtn) {
      hudCareBtn.addEventListener('click', () => {
        if (this.gameState.isHotWeather) {
          this.gameState.toggleAnimalsShelter();
        } else if (this.gameState.chickensInCoop) {
          this.gameState.toggleChickenCoopLock();
        }
        this.updateCareHUD();
        if (this.isAnimalsSheetOpen) {
          this.sheetBody.innerHTML = '';
          this.renderAnimalsSheet();
        }
      });
    }

    // --- Action HUD Cluster (Jump, Ride, Horn/Bell, Fish) ---
    this.setupActionHUD();

    // Touch Joystick Virtual Controls
    this.setupJoystick();

    // Keyboard & Mouse Controls (WASD, Arrows, Space, B, T, H, F, V)
    this.setupKeyboardControls();
  }

  setupActionHUD() {
    const btnJump = document.getElementById('btn-action-jump');
    const btnMount = document.getElementById('btn-action-mount');
    const btnHorn = document.getElementById('btn-action-horn');
    const btnFish = document.getElementById('btn-action-fish');
    const btnReel = document.getElementById('btn-fishing-reel');
    const btnSit = document.getElementById('btn-action-sit');
    const btnLie = document.getElementById('btn-action-lie');
    const btnGtaEnter = document.getElementById('btn-gta-enter');

    if (btnJump) {
      btnJump.addEventListener('click', () => {
        if (window.triggerPlayerJump) window.triggerPlayerJump();
        else if (this.player) this.player.jump();
      });
    }

    if (btnSit) {
      btnSit.addEventListener('click', () => {
        if (window.toggleSit) window.toggleSit();
      });
    }

    if (btnLie) {
      btnLie.addEventListener('click', () => {
        if (window.toggleLieDown) window.toggleLieDown();
      });
    }

    if (btnGtaEnter) {
      btnGtaEnter.addEventListener('click', () => {
        if (window.toggleEnterExitVehicle) window.toggleEnterExitVehicle();
      });
    }

    if (btnMount) {
      btnMount.addEventListener('click', () => {
        if (window.toggleEnterExitVehicle) {
          window.toggleEnterExitVehicle();
        } else if (this.player) {
          if (this.player.mountedVehicle) {
            this.player.dismount();
            this.updateVehicleHUD();
            this.showFloatNum('🚶 On Foot', window.innerWidth / 2, window.innerHeight / 2 - 20);
          } else {
            const activeVeh = this.gameState.activeVehicle || 'bike';
            this.player.mount(activeVeh);
            this.updateVehicleHUD();
            const vehName = activeVeh === 'tractor' ? '🚜 Tractor' : activeVeh === 'pickup' ? '🛻 Pickup' : activeVeh === 'cart' ? '🐴 Cart' : '🚲 Cruiser Bike';
            this.showFloatNum(`Riding ${vehName}!`, window.innerWidth / 2, window.innerHeight / 2 - 20);
          }
        }
      });
    }

    if (btnHorn) {
      btnHorn.addEventListener('click', () => {
        if (this.player && this.player.mountedVehicle) {
          if (this.player.mountedVehicle === 'bike') {
            if (window.soundEngine) window.soundEngine.playBikeBell();
            this.showFloatNum('🔔 Ring Ring!', window.innerWidth / 2, window.innerHeight / 2 - 40);
          } else {
            if (window.soundEngine) window.soundEngine.playHorn();
            this.showFloatNum('📯 Honk Honk!', window.innerWidth / 2, window.innerHeight / 2 - 40);
          }
        } else {
          // If on foot, open Garage / Vehicles Sheet!
          this.openSheet('vehicles');
        }
      });
    }

    if (btnFish) {
      btnFish.addEventListener('click', () => {
        this.handleFishingAction();
      });
    }

    if (btnReel) {
      btnReel.addEventListener('click', () => {
        this.finishFishingCatch();
      });
    }
  }

  updateInteractionHUD(nearbyVeh, nearbyFurn, mountedVehicle, isSitting, isLying) {
    // 1. GTA-Style Take Vehicle Prompt
    const gtaPrompt = document.getElementById('gta-vehicle-prompt');
    const gtaIcon = document.getElementById('gta-vehicle-icon');
    const gtaTitle = document.getElementById('gta-vehicle-title');

    if (gtaPrompt) {
      if (!mountedVehicle && nearbyVeh) {
        gtaPrompt.style.display = 'block';
        if (gtaIcon) gtaIcon.textContent = nearbyVeh.icon || '🏎️';
        if (gtaTitle) gtaTitle.textContent = `Take ${nearbyVeh.name}`;
      } else {
        gtaPrompt.style.display = 'none';
      }
    }

    // 2. Sit & Lie Button Active Indicators
    const btnSit = document.getElementById('btn-action-sit');
    const btnLie = document.getElementById('btn-action-lie');
    if (btnSit) btnSit.classList.toggle('active-action', !!isSitting);
    if (btnLie) btnLie.classList.toggle('active-action', !!isLying);
  }

  updateVehicleHUD() {
    const btnMount = document.getElementById('btn-action-mount');
    const iconMount = document.getElementById('icon-action-mount');
    const labelMount = document.getElementById('label-action-mount');
    const iconHorn = document.getElementById('icon-action-horn');
    const labelHorn = document.getElementById('label-action-horn');

    if (!btnMount) return;

    if (this.player && this.player.mountedVehicle) {
      btnMount.classList.add('mounted');
      const v = this.player.mountedVehicle;
      if (iconMount) iconMount.textContent = '🚶';
      if (labelMount) labelMount.textContent = 'Dismount';

      if (iconHorn) iconHorn.textContent = v === 'bike' ? '🔔' : '📯';
      if (labelHorn) labelHorn.textContent = v === 'bike' ? 'Bell' : 'Horn';
    } else {
      btnMount.classList.remove('mounted');
      const active = this.gameState.activeVehicle || 'bike';
      if (iconMount) iconMount.textContent = active === 'tractor' ? '🚜' : active === 'pickup' ? '🛻' : active === 'cart' ? '🐴' : '🚲';
      if (labelMount) labelMount.textContent = 'Ride';

      if (iconHorn) iconHorn.textContent = '🚗';
      if (labelHorn) labelHorn.textContent = 'Garage';
    }
  }

  handleFishingAction() {
    if (!this.player || !this.farmWorld) return;

    if (this.player.isFishing) {
      // Reel line in early or catch
      this.finishFishingCatch();
      return;
    }

    const pPos = this.player.group.position;
    const fishCheck = this.farmWorld.isNearFishingSpot(pPos.x, pPos.z);

    if (!fishCheck.near && !this.player.inWater) {
      this.showFloatNum('🎣 Walk closer to River or Fishing Dock!', window.innerWidth / 2, window.innerHeight / 2 - 20);
      return;
    }

    // Cast fishing line
    this.player.startFishing();
    const btnFish = document.getElementById('btn-action-fish');
    const fishCard = document.getElementById('fishing-hud-card');
    const fishStatus = document.getElementById('fishing-hud-status');

    if (btnFish) btnFish.classList.add('active-fishing');
    if (fishCard) fishCard.style.display = 'flex';
    if (fishStatus) fishStatus.textContent = '🎣 Cast line... Waiting for a bite!';

    // Trigger fish bite timer between 2.5s and 4.5s
    if (this.fishingBiteTimeout) clearTimeout(this.fishingBiteTimeout);
    this.fishingBiteTimeout = setTimeout(() => {
      if (this.player && this.player.isFishing) {
        if (window.soundEngine) window.soundEngine.playFishBite();
        if (fishStatus) fishStatus.textContent = '⚡ FISH ON THE HOOK! REEL IN NOW!';
        if (fishCard) fishCard.style.borderColor = '#FF3D00';
      }
    }, 2800);
  }

  finishFishingCatch() {
    if (!this.player) return;

    const btnFish = document.getElementById('btn-action-fish');
    const fishCard = document.getElementById('fishing-hud-card');
    if (btnFish) btnFish.classList.remove('active-fishing');
    if (fishCard) {
      fishCard.style.display = 'none';
      fishCard.style.borderColor = '#00E5FF';
    }
    if (this.fishingBiteTimeout) clearTimeout(this.fishingBiteTimeout);

    const fishData = this.gameState.recordFishCatch();
    this.player.stopFishing();
    this.updateTopBar();

    if (window.soundEngine) window.soundEngine.playFishCatch();
    this.showFloatNum(`${fishData.icon} Caught a ${fishData.rarity} ${fishData.name}! (+${fishData.coins} 🪙)`, window.innerWidth / 2, window.innerHeight / 2 - 30);
    this.player.triggerCheer();
  }

  setupKeyboardControls() {
    const keysDown = {};

    window.addEventListener('keydown', (e) => {
      keysDown[e.key.toLowerCase()] = true;
      keysDown[e.code] = true;

      // Space -> Jump
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (window.triggerPlayerJump) window.triggerPlayerJump();
        else if (this.player) this.player.jump();
      }

      // E -> GTA Style Enter / Exit Vehicle
      if (e.key.toLowerCase() === 'e' || e.code === 'KeyE') {
        if (window.toggleEnterExitVehicle) window.toggleEnterExitVehicle();
      }

      // C -> Cycle Camera Mode (3rd Person -> 1st Person -> Drone Map)
      if (e.key.toLowerCase() === 'c' || e.code === 'KeyC') {
        if (window.cycleCameraMode) window.cycleCameraMode();
      }

      // X -> Sit Down / Stand Up
      if (e.key.toLowerCase() === 'x' || e.code === 'KeyX') {
        if (window.toggleSit) window.toggleSit();
      }

      // Z -> Lie Down / Stand Up
      if (e.key.toLowerCase() === 'z' || e.code === 'KeyZ') {
        if (window.toggleLieDown) window.toggleLieDown();
      }

      // B -> Bike toggle
      if (e.key.toLowerCase() === 'b') {
        if (this.player) {
          if (this.player.mountedVehicle === 'bike') {
            if (window.soundEngine) window.soundEngine.playBikeBell();
          } else if (this.player.mountedVehicle) {
            this.player.dismount();
            this.updateVehicleHUD();
          } else {
            this.player.mount('bike');
            this.updateVehicleHUD();
          }
        }
      }

      // T -> Tractor toggle
      if (e.key.toLowerCase() === 't') {
        if (this.player) {
          if (this.player.mountedVehicle === 'tractor') {
            if (window.soundEngine) window.soundEngine.playHorn();
          } else {
            this.player.mount('tractor');
            this.updateVehicleHUD();
          }
        }
      }

      // H -> Bell or Horn
      if (e.key.toLowerCase() === 'h') {
        if (this.player && this.player.mountedVehicle === 'bike') {
          if (window.soundEngine) window.soundEngine.playBikeBell();
        } else if (this.player && this.player.mountedVehicle) {
          if (window.soundEngine) window.soundEngine.playHorn();
        }
      }

      // F -> Fishing
      if (e.key.toLowerCase() === 'f') {
        this.handleFishingAction();
      }

      // V -> Vehicles Garage
      if (e.key.toLowerCase() === 'v') {
        this.openSheet('vehicles');
      }
    });

    window.addEventListener('keyup', (e) => {
      keysDown[e.key.toLowerCase()] = false;
      keysDown[e.code] = false;
    });

    // Process movement keys in requestAnimationFrame loop
    const processKeyMovement = () => {
      if (this.player) {
        let dx = 0;
        let dz = 0;

        if (keysDown['w'] || keysDown['arrowup']) dz -= 1;
        if (keysDown['s'] || keysDown['arrowdown']) dz += 1;
        if (keysDown['a'] || keysDown['arrowleft']) dx -= 1;
        if (keysDown['d'] || keysDown['arrowright']) dx += 1;

        if (dx !== 0 || dz !== 0) {
          const len = Math.sqrt(dx * dx + dz * dz);
          dx /= len;
          dz /= len;
          const p = this.player.group.position;
          const speedMultiplier = this.player.mountedVehicle ? 1.8 : 1.0;
          this.player.moveTo(p.x + dx * 3.5 * speedMultiplier, p.z + dz * 3.5 * speedMultiplier);
        }
      }
      requestAnimationFrame(processKeyMovement);
    };
    requestAnimationFrame(processKeyMovement);
  }

  setupJoystick() {
    const zone = document.getElementById('joystick-zone');
    const thumb = document.getElementById('joystick-thumb');
    if (!zone || !thumb) return;

    let isTouching = false;
    let startX = 0;
    let startY = 0;
    const maxRadius = 38;

    const handleStart = (clientX, clientY) => {
      isTouching = true;
      const rect = zone.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
      handleMove(clientX, clientY);
    };

    const handleMove = (clientX, clientY) => {
      if (!isTouching) return;
      let dx = clientX - startX;
      let dy = clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      thumb.style.transform = `translate(${dx}px, ${dy}px)`;

      // Move player character based on vector
      const forward = -dy / maxRadius;
      const right = dx / maxRadius;

      if (this.player) {
        const p = this.player.group.position;
        this.player.moveTo(p.x + right * 2.5, p.z - forward * 2.5);
      }
    };

    const handleEnd = () => {
      isTouching = false;
      thumb.style.transform = `translate(0px, 0px)`;
      if (this.player && this.player.state === 'walk') {
        this.player.targetPos = null;
        this.player.state = 'idle';
      }
    };

    zone.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      handleStart(t.clientX, t.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isTouching) {
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  }

  updateTopBar() {
    this.coinsDisplay.textContent = this.formatNumber(this.gameState.coins);
    this.gemsDisplay.textContent = this.formatNumber(this.gameState.gems);
    this.levelBadge.textContent = this.gameState.level;

    const pct = Math.min(100, Math.floor((this.gameState.xp / this.gameState.xpRequired) * 100));
    this.xpBarFill.style.width = `${pct}%`;
    this.xpText.textContent = `${this.gameState.xp} / ${this.gameState.xpRequired} XP`;
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  }

  showFloatNum(text, x, y) {
    const el = document.createElement('div');
    el.className = 'float-num';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    this.floatingNotifs.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1100);
  }

  showFloatingText(text, x, y) {
    this.showFloatNum(text, x || window.innerWidth / 2, y || window.innerHeight / 2 - 40);
  }

  openSheet(type) {
    this.sheetBody.innerHTML = '';

    if (type === 'crops') {
      this.sheetTitle.textContent = '🌱 Crop Fields Management';
      this.renderCropsSheet();
    } else if (type === 'animals') {
      this.sheetTitle.textContent = '🐄 Animal Ranch & Barns';
      this.renderAnimalsSheet();
    } else if (type === 'upgrades') {
      this.sheetTitle.textContent = '⚡ Farm & Character Upgrades';
      this.renderUpgradesSheet();
    } else if (type === 'workers') {
      this.sheetTitle.textContent = '👥 Employee Management';
      this.renderWorkersSheet();
    } else if (type === 'market') {
      this.sheetTitle.textContent = '🏪 Roadside Farm Market';
      this.renderMarketSheet();
    } else if (type === 'weather') {
      this.sheetTitle.textContent = '🌦️ Farm Weather Forecast';
      this.renderWeatherSheet();
    } else if (type === 'vehicles') {
      this.sheetTitle.textContent = '🚗 Farm Garage & Rideable Vehicles';
      this.renderVehiclesSheet();
    }

    this.modalBackdrop.classList.add('open');
    if (window.soundEngine) window.soundEngine.init();
  }

  // ----------------------------------------------------
  // 6. FARM GARAGE & VEHICLES MANAGEMENT SHEET
  // ----------------------------------------------------
  renderVehiclesSheet() {
    const vList = [
      {
        id: 'bike',
        name: 'Classic Cruiser Bike',
        icon: '🚲',
        desc: 'Speedy two-wheeler with agile steering and a cheerful brass handlebar bell!',
        speed: '+120% Speed (Fast)',
        cost: 0,
        unlocked: this.gameState.vehicles.bike.unlocked
      },
      {
        id: 'tractor',
        name: 'Heavy Field Tractor',
        icon: '🚜',
        desc: 'Heavy-duty diesel farm tractor with power plowing and automatic furrow harvesting!',
        speed: '+35% Speed (Heavy)',
        cost: 100,
        unlocked: this.gameState.vehicles.tractor.unlocked || this.gameState.tractorUnlocked
      },
      {
        id: 'pickup',
        name: 'Country Cargo Pickup Truck',
        icon: '🛻',
        desc: 'Rugged 4x4 flatbed pickup truck for rapid long-distance hauling across the vast map!',
        speed: '+150% Speed (Turbo)',
        cost: 350,
        unlocked: this.gameState.vehicles.pickup.unlocked
      },
      {
        id: 'cart',
        name: 'Rustic Pony Passenger Cart',
        icon: '🐴',
        desc: 'Charming wooden horse-drawn wagon for leisurely tours through the forest and mountains!',
        speed: '+80% Speed (Moderate)',
        cost: 220,
        unlocked: this.gameState.vehicles.cart.unlocked
      }
    ];

    const currentRiding = this.player ? this.player.mountedVehicle : null;

    const grid = document.createElement('div');
    grid.className = 'vehicle-grid';

    vList.forEach(v => {
      const isRiding = currentRiding === v.id;
      const canBuy = !v.unlocked && this.gameState.coins >= v.cost;

      const card = document.createElement('div');
      card.className = `vehicle-card ${isRiding ? 'active-ride' : ''}`;
      card.innerHTML = `
        <div class="vehicle-info">
          <span class="vehicle-avatar">${v.icon}</span>
          <div>
            <div class="vehicle-name">${v.name} ${isRiding ? '<span style="color:#7CFF01;font-size:0.72rem;font-weight:900;">(RIDING NOW)</span>' : ''}</div>
            <div class="vehicle-desc">${v.desc}</div>
            <div style="font-size:0.74rem; font-weight:800; color:#81d4fa; margin-top:3px;">⚡ ${v.speed}</div>
          </div>
        </div>
        <div>
          ${v.unlocked
            ? `<button class="vehicle-btn-action" id="btn-ride-${v.id}">
                ${isRiding ? 'Dismount 🚶' : 'Ride ' + v.icon}
               </button>`
            : `<button class="buy-btn ${canBuy ? '' : 'disabled'}" id="btn-unlock-${v.id}">
                <span>Unlock</span>
                <span class="btn-price">${v.cost} 🪙</span>
               </button>`
          }
        </div>
      `;
      grid.appendChild(card);

      if (v.unlocked) {
        card.querySelector(`#btn-ride-${v.id}`).addEventListener('click', () => {
          if (isRiding) {
            this.player.dismount();
            this.showFloatNum('🚶 Dismounted to walk', window.innerWidth / 2, window.innerHeight / 2 - 20);
          } else {
            this.player.mount(v.id);
            this.showFloatNum(`Riding ${v.name}! ${v.icon}`, window.innerWidth / 2, window.innerHeight / 2 - 20);
          }
          this.updateVehicleHUD();
          this.closeSheet();
        });
      } else if (canBuy) {
        card.querySelector(`#btn-unlock-${v.id}`).addEventListener('click', () => {
          if (this.gameState.unlockVehicle(v.id)) {
            this.updateTopBar();
            if (window.soundEngine) window.soundEngine.playUpgrade();
            this.showFloatNum(`🎉 Unlocked ${v.name}!`, window.innerWidth / 2, window.innerHeight / 2 - 20);
            this.sheetBody.innerHTML = '';
            this.renderVehiclesSheet();
          }
        });
      }
    });

    this.sheetBody.appendChild(grid);
  }

  closeSheet() {
    this.modalBackdrop.classList.remove('open');
  }

  // 1. CROPS MANAGEMENT SHEET
  renderCropsSheet() {
    const crops = [
      { id: 0, name: 'Golden Wheat Plot #1', icon: '🌾', cost: 0, levelReq: 1, yield: 25 },
      { id: 1, name: 'Sweet Corn Plot #2', icon: '🌽', cost: 0, levelReq: 1, yield: 45 },
      { id: 2, name: 'Crisp Carrots Plot #3', icon: '🥕', cost: 180, levelReq: 2, yield: 90 },
      { id: 3, name: 'Red Strawberries Plot #4', icon: '🍓', cost: 500, levelReq: 3, yield: 180 },
      { id: 4, name: 'Giant Pumpkins Plot #5', icon: '🎃', cost: 1200, levelReq: 4, yield: 350 },
      { id: 5, name: 'Royal Grain Field #6', icon: '✨', cost: 3000, levelReq: 5, yield: 800 }
    ];

    crops.forEach(crop => {
      const isUnlocked = this.gameState.unlockedPlots.includes(crop.id);
      const canUnlock = this.gameState.level >= crop.levelReq && this.gameState.coins >= crop.cost;

      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `
        <div class="card-icon">${crop.icon}</div>
        <div class="card-details">
          <div class="card-name">${crop.name}</div>
          <div class="card-desc">Produces ${crop.yield} coins per harvest</div>
          <div class="card-stat">${isUnlocked ? '✅ Active Field' : `Requires Level ${crop.levelReq}`}</div>
        </div>
        <div>
          ${isUnlocked
            ? `<button class="buy-btn disabled">Unlocked</button>`
            : `<button class="buy-btn ${canUnlock ? '' : 'disabled'}" id="unlock-crop-${crop.id}">
                <span>Unlock</span>
                <span class="btn-price">${crop.cost} 🪙</span>
               </button>`
          }
        </div>
      `;

      this.sheetBody.appendChild(card);

      if (!isUnlocked && canUnlock) {
        card.querySelector(`#unlock-crop-${crop.id}`).addEventListener('click', () => {
          this.gameState.coins -= crop.cost;
          this.gameState.unlockedPlots.push(crop.id);
          this.gameState.save();
          this.updateTopBar();
          if (this.farmWorld.plots[crop.id]) {
            this.farmWorld.plots[crop.id].unlocked = true;
            this.farmWorld.plots[crop.id].lockGroup.visible = false;
          }
          if (window.soundEngine) window.soundEngine.playUpgrade();
          this.renderCropsSheet();
        });
      }
    });
  }

  // 2. ANIMAL RANCH & BREEDING SANCTUARY SHEET
  selectBreedingPen(penType) {
    this.animalSheetTab = 'breeding';
    this.selectedBreedingPen = penType;
    this.parent1Id = null;
    this.parent2Id = null;
    if (this.currentSheet === 'animals') {
      this.renderAnimalsSheet();
    }
  }

  showBreedingSuccessModal(baby) {
    const popup = document.createElement('div');
    popup.className = 'level-up-toast';
    popup.style.background = baby.rarity === 'legendary'
      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.96), rgba(255, 111, 0, 0.96))'
      : baby.rarity === 'rare'
      ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.96), rgba(233, 30, 99, 0.96))'
      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.96), rgba(0, 150, 136, 0.96))';
    popup.innerHTML = `
      <div class="lvl-toast-content">
        <div class="lvl-star">${baby.rarity === 'legendary' ? '⭐' : baby.rarity === 'rare' ? '✨' : '🐣'}</div>
        <div>
          <h3>🎉 Baby Animal Born!</h3>
          <p><strong>${baby.name}</strong> • ${baby.breed.toUpperCase()} (${baby.rarity.toUpperCase()})</p>
          <p style="font-size:0.75rem; opacity:0.95;">${baby.rarity === 'legendary' ? '🌟 Legendary Mutation Discovered!' : baby.rarity === 'rare' ? '✨ Rare Breed Offspring!' : 'Healthy Baby joined the farm!'}</p>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 4200);
  }

  renderAnimalsSheet() {
    if (!this.animalSheetTab) this.animalSheetTab = 'livestock';
    if (!this.selectedBreedingPen) this.selectedBreedingPen = 'cow_buffalo';

    // Top Tabs: Livestock Pens vs Breeding Sanctuary
    const tabHeader = document.createElement('div');
    tabHeader.className = 'sheet-tab-header';
    const activeCount = this.gameState.activeBreedings.length;
    tabHeader.innerHTML = `
      <button class="sheet-tab-btn ${this.animalSheetTab === 'livestock' ? 'active' : ''}" id="tab-btn-livestock">
        🐄 Livestock Pens
      </button>
      <button class="sheet-tab-btn ${this.animalSheetTab === 'breeding' ? 'active' : ''}" id="tab-btn-breeding">
        💕 Breeding Sanctuary ${activeCount > 0 ? `<span class="tab-badge">${activeCount}</span>` : ''}
      </button>
    `;
    this.sheetBody.appendChild(tabHeader);

    tabHeader.querySelector('#tab-btn-livestock').addEventListener('click', () => {
      this.animalSheetTab = 'livestock';
      this.sheetBody.innerHTML = '';
      this.renderAnimalsSheet();
    });
    tabHeader.querySelector('#tab-btn-breeding').addEventListener('click', () => {
      this.animalSheetTab = 'breeding';
      this.sheetBody.innerHTML = '';
      this.renderAnimalsSheet();
    });

    // Hot Weather Care & Night Chicken Coop Routine Controls
    const isHot = this.gameState.isHotWeather;
    const sheltered = this.gameState.animalsSheltered;
    const coopLocked = this.gameState.chickenCoopLocked;
    const chickensInCoop = this.gameState.chickensInCoop;

    const careBox = document.createElement('div');
    careBox.className = 'animal-care-control-box';
    careBox.innerHTML = `
      <div class="care-card ${isHot ? 'care-card-urgent' : ''}">
        <div class="care-card-icon">${isHot ? '☀️' : '🛖'}</div>
        <div class="care-card-body">
          <div class="care-card-title">${isHot ? 'Afternoon Heat Care (URGENT)' : 'Animal Weather Shelters'}</div>
          <div class="care-card-desc">
            ${isHot
              ? (sheltered
                  ? '✅ All animals resting safely in shaded shelters! Full production preserved.'
                  : '⚠️ Blazing sun! Move animals into shaded shelters or yields drop by 55%!')
              : (sheltered
                  ? 'Animals are currently resting inside their shaded shelters.'
                  : 'Animals are grazing happily in outdoor pastures.')
            }
          </div>
        </div>
        <button class="buy-btn" id="care-shelter-btn" style="background:${sheltered ? 'linear-gradient(135deg, #4caf50, #2e7d32)' : 'linear-gradient(135deg, #ff9800, #f57c00)'}; white-space:nowrap; padding:8px 12px; font-size:0.8rem;">
          ${sheltered ? '🌿 Let Roam' : '🛖 Move to Shelters'}
        </button>
      </div>

      <div class="care-card">
        <div class="care-card-icon">🐔</div>
        <div class="care-card-body">
          <div class="care-card-title">Night Chicken Coop & Security</div>
          <div class="care-card-desc">
            ${chickensInCoop
              ? (coopLocked
                  ? '🔒 Coop securely locked shut for the night. Chickens are safe!'
                  : '🚪 Chickens are roosting inside. Lock the coop at night for safety.')
              : (coopLocked
                  ? '⚠️ Coop door is locked! Unlock it to let chickens out into scratch yard.'
                  : '🌿 Chickens are roaming and pecking in the scratch yard.')
            }
          </div>
        </div>
        <button class="buy-btn" id="care-coop-btn" style="background:${coopLocked ? 'linear-gradient(135deg, #e91e63, #c2185b)' : 'linear-gradient(135deg, #2196f3, #1976d2)'}; white-space:nowrap; padding:8px 12px; font-size:0.8rem;">
          ${coopLocked ? '🔓 Unlock Coop' : '🔒 Lock Coop'}
        </button>
      </div>
    `;
    this.sheetBody.appendChild(careBox);

    careBox.querySelector('#care-shelter-btn').addEventListener('click', () => {
      this.gameState.toggleAnimalsShelter();
      this.updateCareHUD();
      this.sheetBody.innerHTML = '';
      this.renderAnimalsSheet();
    });

    careBox.querySelector('#care-coop-btn').addEventListener('click', () => {
      this.gameState.toggleChickenCoopLock();
      this.updateCareHUD();
      this.sheetBody.innerHTML = '';
      this.renderAnimalsSheet();
    });

    if (this.animalSheetTab === 'livestock') {
      this.renderLivestockTab();
    } else {
      this.renderBreedingTab();
    }

    // Sync 3D animals in farm world
    if (this.farmWorld && this.farmWorld.syncAnimals) {
      this.farmWorld.syncAnimals(this.gameState.animalsData);
    }
  }

  renderLivestockTab() {
    const animalItems = [
      {
        id: 'cow_buffalo',
        name: '🐄 Cows & Buffaloes Pasture',
        icon: '🐄',
        cost: 250,
        shelter: 'Big Shaded Shed with Hay Bales',
        yield: 'Fresh Milk, Butter & Dairy (+70 🪙/cycle)'
      },
      {
        id: 'goat',
        name: '🐐 Mountain Goats Pen',
        icon: '🐐',
        cost: 300,
        shelter: 'Covered Lean-to & Rock Mound',
        yield: 'Goat Milk & Mountain Cheese (+55 🪙/cycle)'
      },
      {
        id: 'chicken',
        name: '🐔 Chickens Scratch Yard',
        icon: '🐔',
        cost: 150,
        shelter: 'Elevated Coop with Ramp & Nesting Boxes',
        yield: 'Farm-Fresh Brown Eggs (+35 🪙/cycle)'
      },
      {
        id: 'horse',
        name: '🐎 Horses Equestrian Paddock',
        icon: '🐎',
        cost: 500,
        shelter: 'Wooden Stable Stall & Hay Troughs',
        yield: 'Equestrian Agility & Speed (+90 🪙/cycle)'
      },
      {
        id: 'dog',
        name: '🐕 Farm Dog Watchpost',
        icon: '🐕',
        cost: 180,
        shelter: 'Picket Fence Kennel & Dish',
        yield: 'Farm Watchdog Security (+30 🪙/cycle)'
      }
    ];

    animalItems.forEach(item => {
      const isUnlocked = this.gameState.unlockedAnimals.includes(item.id) || (item.id === 'cow_buffalo' && (this.gameState.unlockedAnimals.includes('cow') || this.gameState.unlockedAnimals.includes('cow_buffalo')));
      const canBuy = this.gameState.coins >= item.cost;
      const penAnimals = this.gameState.animalsData.filter(a => a.penType === item.id || (item.id === 'cow_buffalo' && (a.penType === 'cow' || a.penType === 'cow_buffalo')));

      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'stretch';

      let inner = `
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="card-icon">${item.icon}</div>
            <div class="card-details">
              <div class="card-name">${item.name}</div>
              <div class="card-desc" style="color:#81d4fa; font-size:0.72rem; font-weight:700;">🛖 Shelter: ${item.shelter}</div>
              <div class="card-desc">${item.yield}</div>
              <div class="card-stat">${isUnlocked ? `✅ ${penAnimals.length} Animals Living Here` : 'Available for purchase'}</div>
            </div>
          </div>
          <div>
            ${isUnlocked
              ? `<div style="display:flex; flex-direction:column; gap:6px;">
                   <button class="buy-btn" id="feed-${item.id}">Feed (+Boost 🌾)</button>
                   ${item.id !== 'dog' ? `<button class="buy-btn" id="go-breed-${item.id}" style="background:linear-gradient(135deg, #e91e63, #c2185b);">Breed 💕</button>` : ''}
                 </div>`
              : `<button class="buy-btn ${canBuy ? '' : 'disabled'}" id="buy-animal-${item.id}">
                  <span>Buy</span>
                  <span class="btn-price">${item.cost} 🪙</span>
                 </button>`
            }
          </div>
        </div>
      `;

      if (isUnlocked && penAnimals.length > 0) {
        inner += `<div class="pen-animals-list">`;
        penAnimals.forEach(anim => {
          const chipClass = anim.rarity === 'legendary' ? 'chip-legendary' : anim.rarity === 'rare' ? 'chip-rare' : 'chip-common';
          const rarityLabel = anim.rarity === 'legendary' ? '⭐ Legendary' : anim.rarity === 'rare' ? '✨ Rare' : '🌾 Common';
          const animalEmoji = anim.type === 'buffalo' ? '🐃' :
                              anim.type === 'goat' ? '🐐' :
                              anim.type === 'horse' ? '🐎' :
                              anim.type === 'dog' ? '🐕' :
                              anim.penType === 'cow_buffalo' ? (anim.isBaby ? '🐮' : '🐄') :
                              anim.penType === 'chicken' ? (anim.isBaby ? '🐣' : '🐔') :
                              anim.penType === 'goat' ? '🐐' :
                              anim.penType === 'horse' ? '🐎' :
                              anim.penType === 'dog' ? '🐕' : (anim.isBaby ? '🐮' : '🐄');

          inner += `
            <div class="animal-subcard">
              <div class="animal-subcard-info">
                <div class="animal-subcard-title">
                  <span>${animalEmoji}</span>
                  <span>${anim.name}</span>
                  <span class="rarity-chip ${chipClass}">${rarityLabel} (${anim.breed})</span>
                </div>
                <div class="animal-subcard-status">
                  ${anim.isBaby
                    ? `🍼 Baby (${Math.floor(anim.growth * 100)}% Grown)
                       <div class="mini-progress-bar">
                         <div class="mini-progress-fill" style="width:${Math.floor(anim.growth * 100)}%"></div>
                       </div>`
                    : anim.cooldown > 0
                    ? `⏳ Resting from breeding (${Math.ceil(anim.cooldown)}s)`
                    : `💖 Adult • Healthy & Active`
                  }
                </div>
              </div>
              <div>
                ${anim.isBaby
                  ? `<button class="buy-btn" id="feed-baby-${anim.id}" style="padding:6px 12px; font-size:0.75rem; background:linear-gradient(135deg, #4caf50, #2e7d32);">
                       <span>Feed 🍼</span>
                       <span class="btn-price">25 🪙</span>
                     </button>`
                  : ''
                }
              </div>
            </div>
          `;
        });
        inner += `</div>`;
      }

      card.innerHTML = inner;
      this.sheetBody.appendChild(card);

      if (isUnlocked) {
        card.querySelector(`#feed-${item.id}`).addEventListener('click', () => {
          let earnCoins = 30;
          let product = 'milk';
          if (item.id === 'cow_buffalo') { earnCoins = 70; product = 'milk'; }
          else if (item.id === 'goat') { earnCoins = 55; product = 'cheese'; }
          else if (item.id === 'chicken') { earnCoins = 35; product = 'eggs'; }
          else if (item.id === 'horse') { earnCoins = 90; product = 'wheat'; }
          else if (item.id === 'dog') { earnCoins = 30; product = 'bone'; }

          // Heat penalty if hot weather and not sheltered
          if (this.gameState.isHotWeather && !this.gameState.animalsSheltered) {
            earnCoins = Math.floor(earnCoins * 0.45);
            this.showFloatNum(`⚠️ Heat Stress! Reduced Yield: +${earnCoins}🪙`, window.innerWidth / 2, window.innerHeight / 2);
          } else {
            this.showFloatNum(`Fed! +${earnCoins} 🪙 +Goods 📦`, window.innerWidth / 2, window.innerHeight / 2);
          }

          this.gameState.addCoins(earnCoins);
          this.gameState.addItem(product, 1);
          if (window.soundEngine) {
            window.soundEngine.playAnimal(item.id === 'cow_buffalo' ? 'cow' : item.id);
          }
        });

        const breedBtn = card.querySelector(`#go-breed-${item.id}`);
        if (breedBtn) {
          breedBtn.addEventListener('click', () => {
            this.selectBreedingPen(item.id);
          });
        }

        penAnimals.forEach(anim => {
          if (anim.isBaby) {
            const feedBtn = card.querySelector(`#feed-baby-${anim.id}`);
            if (feedBtn) {
              feedBtn.addEventListener('click', () => {
                const fed = this.gameState.feedBaby(anim.id);
                if (fed) {
                  this.updateTopBar();
                  if (window.soundEngine) window.soundEngine.playHarvest();
                  this.showFloatNum(`Fed baby! Growth accelerated! 🍼`, window.innerWidth / 2, window.innerHeight / 2);
                  if (this.farmWorld && this.farmWorld.syncAnimals) {
                    this.farmWorld.syncAnimals(this.gameState.animalsData);
                  }
                  this.sheetBody.innerHTML = '';
                  this.renderAnimalsSheet();
                } else {
                  this.showFloatNum('Need 25 Coins! 🪙', window.innerWidth / 2, window.innerHeight / 2);
                }
              });
            }
          }
        });
      } else if (canBuy) {
        card.querySelector(`#buy-animal-${item.id}`).addEventListener('click', () => {
          this.gameState.coins -= item.cost;
          if (!this.gameState.unlockedAnimals.includes(item.id)) {
            this.gameState.unlockedAnimals.push(item.id);
          }
          this.gameState.save();
          this.updateTopBar();
          const p = this.farmWorld.animals.find(a => a.type === item.id);
          if (p) p.unlocked = true;
          if (window.soundEngine) window.soundEngine.playUpgrade();
          if (this.farmWorld && this.farmWorld.syncAnimals) {
            this.farmWorld.syncAnimals(this.gameState.animalsData);
          }
          this.sheetBody.innerHTML = '';
          this.renderAnimalsSheet();
        });
      }
    });
  }

  renderBreedingTab() {
    // 1. Species Pill Selector
    const speciesRow = document.createElement('div');
    speciesRow.className = 'species-pills-row';
    const speciesOptions = [
      { id: 'cow_buffalo', name: '🐄 Cows & Buffaloes' },
      { id: 'goat', name: '🐐 Goats' },
      { id: 'chicken', name: '🐔 Chickens' },
      { id: 'horse', name: '🐎 Horses' }
    ];
    speciesRow.innerHTML = speciesOptions.map(sp => `
      <button class="species-pill ${this.selectedBreedingPen === sp.id ? 'active' : ''}" id="sp-btn-${sp.id}">
        ${sp.name}
      </button>
    `).join('');
    this.sheetBody.appendChild(speciesRow);

    speciesOptions.forEach(sp => {
      speciesRow.querySelector(`#sp-btn-${sp.id}`).addEventListener('click', () => {
        this.selectedBreedingPen = sp.id;
        this.parent1Id = null;
        this.parent2Id = null;
        if (window.soundEngine) {
          window.soundEngine.playBreedingSelect(sp.id === 'cow_buffalo' ? 'cow' : sp.id);
        }
        this.sheetBody.innerHTML = '';
        this.renderAnimalsSheet();
      });
    });

    // 2. Active Incubation Cradle (if any)
    const activeBreedings = this.gameState.activeBreedings.filter(b => b.penType === this.selectedBreedingPen);
    if (activeBreedings.length > 0) {
      activeBreedings.forEach(b => {
        const isReady = b.ready || b.remaining <= 0;
        const progressPct = Math.min(100, Math.floor((1 - b.remaining / b.totalDuration) * 100));

        const incCard = document.createElement('div');
        incCard.className = 'incubation-card';
        incCard.innerHTML = `
          <div class="incubation-header">
            <div class="incubation-parents">
              <span>🐣</span>
              <span>${b.parent1Name} & ${b.parent2Name}</span>
            </div>
            <div class="incubation-timer">
              ${isReady ? '🎉 READY TO HATCH!' : `⏳ ${Math.ceil(b.remaining)}s left`}
            </div>
          </div>
          <div class="incubation-bar-wrap">
            <div class="incubation-bar-fill" style="width:${progressPct}%"></div>
          </div>
          <div class="incubation-actions">
            ${isReady
              ? `<button class="claim-baby-btn" id="claim-baby-${b.id}">
                   <span>🎉 Claim Baby Animal</span>
                 </button>`
              : `<button class="speed-up-btn" id="speed-up-${b.id}">
                   <span>⚡ Speed Up (1 💎)</span>
                 </button>`
            }
          </div>
        `;
        this.sheetBody.appendChild(incCard);

        if (isReady) {
          incCard.querySelector(`#claim-baby-${b.id}`).addEventListener('click', () => {
            const baby = this.gameState.claimBaby(b.id);
            if (baby) {
              if (window.soundEngine) window.soundEngine.playBabyBirth();
              this.showBreedingSuccessModal(baby);
              this.updateTopBar();
              if (this.farmWorld && this.farmWorld.syncAnimals) {
                this.farmWorld.syncAnimals(this.gameState.animalsData);
              }
              this.sheetBody.innerHTML = '';
              this.renderAnimalsSheet();
            }
          });
        } else {
          incCard.querySelector(`#speed-up-${b.id}`).addEventListener('click', () => {
            const sped = this.gameState.speedUpBreeding(b.id);
            if (sped) {
              this.updateTopBar();
              if (window.soundEngine) window.soundEngine.playUpgrade();
              this.sheetBody.innerHTML = '';
              this.renderAnimalsSheet();
            } else {
              this.showFloatNum('Need 1 Gem! 💎', window.innerWidth / 2, window.innerHeight / 2);
            }
          });
        }
      });
    }

    // 3. Breeding Pair Selection Box
    const allPenAnimals = this.gameState.animalsData.filter(a => a.penType === this.selectedBreedingPen || (this.selectedBreedingPen === 'cow_buffalo' && (a.penType === 'cow' || a.penType === 'cow_buffalo')));
    const adultAnimals = allPenAnimals.filter(a => !a.isBaby);

    const pairBox = document.createElement('div');
    pairBox.className = 'breeding-pair-box';

    if (adultAnimals.length < 2) {
      pairBox.innerHTML = `
        <div class="breeding-pair-title">💕 Select Breeding Pair</div>
        <p style="font-size:0.82rem; color:var(--text-sub); line-height:1.4;">
          You need at least 2 adult animals in this pen to initiate breeding.
          Unlock the pen or wait for babies to mature!
        </p>
      `;
      this.sheetBody.appendChild(pairBox);
    } else {
      // Default to first two if not set
      if (!this.parent1Id || !adultAnimals.some(a => a.id === this.parent1Id)) {
        this.parent1Id = adultAnimals[0].id;
      }
      if (!this.parent2Id || !adultAnimals.some(a => a.id === this.parent2Id) || this.parent2Id === this.parent1Id) {
        this.parent2Id = adultAnimals[1] ? adultAnimals[1].id : null;
      }

      const p1 = adultAnimals.find(a => a.id === this.parent1Id);
      const p2 = adultAnimals.find(a => a.id === this.parent2Id);

      const isSameParent = this.parent1Id && this.parent2Id && this.parent1Id === this.parent2Id;
      const p1Resting = p1 && p1.cooldown > 0;
      const p2Resting = p2 && p2.cooldown > 0;
      const canBreed = p1 && p2 && !isSameParent && !p1Resting && !p2Resting && this.gameState.coins >= 60;

      // Estimate mutation odds based on parents
      let mutChance = 10;
      let rareChance = 22;
      if ((p1 && p1.rarity === 'legendary') || (p2 && p2.rarity === 'legendary')) {
        mutChance += 18;
      }
      if ((p1 && p1.rarity === 'rare') || (p2 && p2.rarity === 'rare')) {
        rareChance += 15;
      }
      const commonChance = Math.max(0, 100 - mutChance - rareChance);

      pairBox.innerHTML = `
        <div class="breeding-pair-title">💕 Select Breeding Pair</div>
        <div class="parent-select-row">
          <div class="parent-select-card">
            <div class="parent-select-label">Parent 1 (Adult)</div>
            <select class="parent-dropdown" id="parent1-select">
              ${adultAnimals.map(a => `
                <option value="${a.id}" ${a.id === this.parent1Id ? 'selected' : ''}>
                  ${a.name} (${a.breed} - ${a.rarity}) ${a.cooldown > 0 ? `[Resting ${Math.ceil(a.cooldown)}s]` : '✓ Ready'}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="parent-select-card">
            <div class="parent-select-label">Parent 2 (Adult)</div>
            <select class="parent-dropdown" id="parent2-select">
              ${adultAnimals.map(a => `
                <option value="${a.id}" ${a.id === this.parent2Id ? 'selected' : ''}>
                  ${a.name} (${a.breed} - ${a.rarity}) ${a.cooldown > 0 ? `[Resting ${Math.ceil(a.cooldown)}s]` : '✓ Ready'}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="genetics-box">
          <div style="font-size:0.78rem; font-weight:800; color:#ff80ab; margin-bottom:6px;">🧬 Genetic Odds & Potential Breeds:</div>
          <div class="genetics-row">
            <span>🌾 Common Breed:</span>
            <span style="color:#cfd8dc; font-weight:800;">${commonChance}%</span>
          </div>
          <div class="genetics-row">
            <span>✨ Rare Breed (e.g. Jersey/Silkie/Mustang):</span>
            <span style="color:#e1bee7; font-weight:800;">${rareChance}%</span>
          </div>
          <div class="genetics-row">
            <span>⭐ Legendary Mutation (Celestial/Pegasus/Prism):</span>
            <span style="color:#ffd54f; font-weight:800;">${mutChance}%</span>
          </div>
          <div class="genetics-row" style="margin-top:6px; padding-top:6px; border-top:1px dashed rgba(255,255,255,0.1);">
            <span>Incubation Duration:</span>
            <span style="color:#FFFFFF; font-weight:800;">12 Seconds</span>
          </div>
        </div>

        <div style="margin-bottom:12px; font-size:0.76rem;">
          ${isSameParent
            ? `<span style="color:#ef5350; font-weight:800;">⚠️ Please choose two different animals.</span>`
            : p1Resting || p2Resting
            ? `<span style="color:#ffa726; font-weight:800;">⏳ One or both parents are resting from a previous breeding.</span>`
            : `<span style="color:#66bb6a; font-weight:800;">✅ Compatible Adult Pair ready to mate!</span>`
          }
        </div>

        <button class="buy-btn ${canBreed ? '' : 'disabled'}" id="start-breed-btn" style="width:100%; padding:14px; font-size:0.95rem; background:linear-gradient(135deg, #e91e63, #c2185b);">
          <span>Start Breeding 💕</span>
          <span class="btn-price">60 🪙</span>
        </button>
      `;

      this.sheetBody.appendChild(pairBox);

      pairBox.querySelector('#parent1-select').addEventListener('change', (e) => {
        this.parent1Id = e.target.value;
        const chosen = adultAnimals.find(a => a.id === this.parent1Id);
        if (window.soundEngine && chosen) {
          window.soundEngine.playBreedingSelect(chosen.type || (this.selectedBreedingPen === 'cow_buffalo' ? 'cow' : this.selectedBreedingPen));
        }
        this.sheetBody.innerHTML = '';
        this.renderAnimalsSheet();
      });
      pairBox.querySelector('#parent2-select').addEventListener('change', (e) => {
        this.parent2Id = e.target.value;
        const chosen = adultAnimals.find(a => a.id === this.parent2Id);
        if (window.soundEngine && chosen) {
          window.soundEngine.playBreedingSelect(chosen.type || (this.selectedBreedingPen === 'cow_buffalo' ? 'cow' : this.selectedBreedingPen));
        }
        this.sheetBody.innerHTML = '';
        this.renderAnimalsSheet();
      });

      if (canBreed) {
        pairBox.querySelector('#start-breed-btn').addEventListener('click', () => {
          const res = this.gameState.startBreeding(this.selectedBreedingPen, this.parent1Id, this.parent2Id);
          if (res.success) {
            this.updateTopBar();
            if (window.soundEngine) window.soundEngine.playBreeding();
            this.showFloatNum('💕 Breeding Initiated in Nursery Cradle! (12s)', window.innerWidth / 2, window.innerHeight / 2);
            if (this.farmWorld && this.farmWorld.syncAnimals) {
              this.farmWorld.syncAnimals(this.gameState.animalsData);
            }
            this.sheetBody.innerHTML = '';
            this.renderAnimalsSheet();
          } else {
            this.showFloatNum(res.reason || 'Cannot breed yet', window.innerWidth / 2, window.innerHeight / 2);
          }
        });
      }
    }

    // 4. Baby Nursery List
    const babyAnimals = allPenAnimals.filter(a => a.isBaby);
    if (babyAnimals.length > 0) {
      const babyCard = document.createElement('div');
      babyCard.className = 'upgrade-card';
      babyCard.style.flexDirection = 'column';
      babyCard.style.alignItems = 'stretch';
      babyCard.innerHTML = `
        <div style="font-size:0.88rem; font-weight:800; color:#4caf50; margin-bottom:8px;">🍼 Nursery Babies Growing</div>
        <div class="pen-animals-list">
          ${babyAnimals.map(b => `
            <div class="animal-subcard">
              <div class="animal-subcard-info">
                <div class="animal-subcard-title">
                  <span>🍼</span>
                  <span>${b.name}</span>
                  <span class="rarity-chip ${b.rarity === 'legendary' ? 'chip-legendary' : b.rarity === 'rare' ? 'chip-rare' : 'chip-common'}">${b.breed} (${b.rarity})</span>
                </div>
                <div class="animal-subcard-status">
                  Growing into adult (${Math.floor(b.growth * 100)}%)
                  <div class="mini-progress-bar">
                    <div class="mini-progress-fill" style="width:${Math.floor(b.growth * 100)}%"></div>
                  </div>
                </div>
              </div>
              <button class="buy-btn" id="feed-nursery-baby-${b.id}" style="padding:6px 12px; font-size:0.75rem; background:linear-gradient(135deg, #4caf50, #2e7d32);">
                <span>Feed 🍼</span>
                <span class="btn-price">25 🪙</span>
              </button>
            </div>
          `).join('')}
        </div>
      `;
      this.sheetBody.appendChild(babyCard);

      babyAnimals.forEach(b => {
        babyCard.querySelector(`#feed-nursery-baby-${b.id}`).addEventListener('click', () => {
          const fed = this.gameState.feedBaby(b.id);
          if (fed) {
            this.updateTopBar();
            if (window.soundEngine) window.soundEngine.playHarvest();
            this.showFloatNum('Fed baby! +40% Growth! 🍼', window.innerWidth / 2, window.innerHeight / 2);
            if (this.farmWorld && this.farmWorld.syncAnimals) {
              this.farmWorld.syncAnimals(this.gameState.animalsData);
            }
            this.sheetBody.innerHTML = '';
            this.renderAnimalsSheet();
          } else {
            this.showFloatNum('Need 25 Coins! 🪙', window.innerWidth / 2, window.innerHeight / 2);
          }
        });
      });
    }
  }

  // 3. UPGRADES SHEET (FARMHOUSE, TRACTOR & CHARACTER)
  renderUpgradesSheet() {
    const upgrades = [
      {
        id: 'tractor',
        name: this.gameState.tractorUnlocked ? `Autonomous Tractor (LVL ${this.gameState.tractorLevel})` : 'Unlock Auto-Farming Tractor',
        icon: '🚜',
        desc: this.gameState.tractorUnlocked
          ? `Upgrades patrol speed & harvesting capacity (+${this.gameState.tractorLevel * 35} 🪙/cycle)`
          : 'Drives automatically across fields, planting seeds & harvesting ripe crops!',
        cost: this.gameState.tractorUnlocked ? Math.floor(350 * Math.pow(1.5, this.gameState.tractorLevel - 1)) : 300,
        maxed: this.gameState.tractorLevel >= 5
      },
      {
        id: 'house',
        name: `Farm House (Stage ${this.gameState.houseLevel}/3)`,
        icon: '🏡',
        desc: this.gameState.houseLevel === 1
          ? 'Upgrade Small Wooden Cabin to 2-Story Country Farmhouse (+25% All Income & Porch Lights)'
          : this.gameState.houseLevel === 2
          ? 'Upgrade to Luxury Modern Farm Villa (+60% All Income & Solar Roof)'
          : 'Max Level Luxury Modern Farm Villa!',
        cost: this.gameState.houseLevel === 1 ? 500 : this.gameState.houseLevel === 2 ? 1600 : 0,
        maxed: this.gameState.houseLevel >= 3
      },
      {
        id: 'speed',
        name: 'Boy Athletic Speed (Character Upgrade)',
        icon: '👟',
        desc: 'Sprint faster across farm fields (+20% Sprint Speed)',
        cost: Math.floor(100 * (this.gameState.playerSpeed / 4.8)),
        maxed: this.gameState.playerSpeed >= 9.6
      },
      {
        id: 'radius',
        name: 'Backpack & Harvest Radius (Character Upgrade)',
        icon: '🎒',
        desc: 'Enlarges 3D backpack carry capacity & magnetic harvest reach',
        cost: Math.floor(120 * (this.gameState.harvestRadius / 3.8)),
        maxed: this.gameState.harvestRadius >= 8.5
      },
      {
        id: 'farmingPower',
        name: 'Golden Touch & Farming Power (Character Upgrade)',
        icon: '⚡',
        desc: `Multiplier on all crop & product drops (Current: ${this.gameState.farmingPower}x)`,
        cost: 280 * this.gameState.farmingPower,
        maxed: this.gameState.farmingPower >= 5
      }
    ];

    upgrades.forEach(up => {
      const canBuy = !up.maxed && this.gameState.coins >= up.cost;
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `
        <div class="card-icon">${up.icon}</div>
        <div class="card-details">
          <div class="card-name">${up.name}</div>
          <div class="card-desc">${up.desc}</div>
        </div>
        <div>
          ${up.maxed
            ? `<button class="buy-btn disabled">MAX</button>`
            : `<button class="buy-btn ${canBuy ? '' : 'disabled'}" id="up-btn-${up.id}">
                <span>${up.id === 'tractor' && !this.gameState.tractorUnlocked ? 'Buy' : 'Upgrade'}</span>
                <span class="btn-price">${up.cost} 🪙</span>
               </button>`
          }
        </div>
      `;
      this.sheetBody.appendChild(card);

      if (!up.maxed && canBuy) {
        card.querySelector(`#up-btn-${up.id}`).addEventListener('click', () => {
          this.gameState.coins -= up.cost;

          if (up.id === 'tractor') {
            if (!this.gameState.tractorUnlocked) {
              this.gameState.tractorUnlocked = true;
              this.gameState.tractorLevel = 1;
            } else {
              this.gameState.tractorLevel += 1;
            }
          } else if (up.id === 'house') {
            this.gameState.houseLevel += 1;
            this.farmWorld.buildFarmHouse(this.gameState.houseLevel);
            this.gameState.harvestMultiplier += 0.3;
            if (window.tutorialSystem) {
              window.tutorialSystem.onFarmhouseUpgraded(this.gameState.houseLevel);
            }
          } else if (up.id === 'speed') {
            this.gameState.playerSpeed += 1.0;
            this.player.speed = this.gameState.playerSpeed;
          } else if (up.id === 'radius') {
            this.gameState.harvestRadius += 1.0;
            this.gameState.carryCapacity += 10;
            if (this.player && this.player.backpackGroup) {
              this.player.backpackGroup.scale.set(1.2, 1.2, 1.2);
            }
          } else if (up.id === 'farmingPower') {
            this.gameState.farmingPower += 1;
            this.gameState.critChance += 0.05;
          }

          this.gameState.save();
          this.updateTopBar();
          if (window.soundEngine) window.soundEngine.playUpgrade();
          this.player.triggerCheer();
          this.renderUpgradesSheet();
        });
      }
    });
  }

  // 4. EMPLOYEE SYSTEM SHEET (FARMER, CARETAKER, SHOPKEEPER)
  renderWorkersSheet() {
    const workerKeys = ['farmer', 'rancher', 'merchant', 'manager'];

    workerKeys.forEach(key => {
      const w = this.gameState.workers[key];
      const upgradeCost = w.cost * w.level;
      const canHire = !w.hired && this.gameState.coins >= w.cost;
      const canUpgrade = w.hired && this.gameState.coins >= upgradeCost;

      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `
        <div class="card-icon">${key === 'farmer' ? '👨‍🌾' : key === 'rancher' ? '👩‍🌾' : key === 'merchant' ? '🤵' : '👔'}</div>
        <div class="card-details">
          <div class="card-name">${w.name} ${w.hired ? `(LVL ${w.level})` : ''}</div>
          <div class="card-desc">${
            key === 'farmer' ? 'Walks between crop plots planting & harvesting automatic produce' :
            key === 'rancher' ? 'Walks between animal pens feeding livestock & collecting milk/eggs/wool' :
            key === 'merchant' ? 'Staffs the roadside market stall selling goods to town customers' :
            'Farm Director (+50% Empire efficiency multiplier)'
          }</div>
          <div class="card-stat">${w.hired ? `⚡ Generates +${w.yield * w.level} 🪙 periodically` : 'Available for hire'}</div>
        </div>
        <div>
          ${w.hired
            ? `<button class="buy-btn ${canUpgrade ? '' : 'disabled'}" id="lvl-worker-${key}">
                <span>Level Up</span>
                <span class="btn-price">${upgradeCost} 🪙</span>
               </button>`
            : `<button class="buy-btn ${canHire ? '' : 'disabled'}" id="hire-worker-${key}">
                <span>Hire</span>
                <span class="btn-price">${w.cost} 🪙</span>
               </button>`
          }
        </div>
      `;
      this.sheetBody.appendChild(card);

      if (w.hired && canUpgrade) {
        card.querySelector(`#lvl-worker-${key}`).addEventListener('click', () => {
          this.gameState.coins -= upgradeCost;
          w.level += 1;
          this.gameState.save();
          this.updateTopBar();
          if (window.soundEngine) window.soundEngine.playUpgrade();
          this.renderWorkersSheet();
        });
      } else if (!w.hired && canHire) {
        card.querySelector(`#hire-worker-${key}`).addEventListener('click', () => {
          this.gameState.coins -= w.cost;
          w.hired = true;
          this.gameState.save();
          this.updateTopBar();
          if (window.soundEngine) window.soundEngine.playUpgrade();
          this.player.triggerCheer();
          if (window.tutorialSystem) {
            window.tutorialSystem.onWorkerHired(key);
          }
          this.renderWorkersSheet();
        });
      }
    });
  }

  // 5. ROADSIDE SHOP & SELLING SYSTEM SHEET
  renderMarketSheet() {
    const items = [
      { id: 'wheat', name: 'Golden Wheat', icon: '🌾', price: 15, count: this.gameState.inventory.wheat },
      { id: 'corn', name: 'Sweet Corn', icon: '🌽', price: 25, count: this.gameState.inventory.corn },
      { id: 'carrot', name: 'Crisp Carrots', icon: '🥕', price: 40, count: this.gameState.inventory.carrot },
      { id: 'strawberry', name: 'Red Strawberries', icon: '🍓', price: 75, count: this.gameState.inventory.strawberry },
      { id: 'pumpkin', name: 'Giant Pumpkins', icon: '🎃', price: 150, count: this.gameState.inventory.pumpkin },
      { id: 'milk', name: 'Fresh Milk Jugs', icon: '🥛', price: 90, count: this.gameState.inventory.milk },
      { id: 'eggs', name: 'Farm Eggs Crates', icon: '🥚', price: 60, count: this.gameState.inventory.eggs },
      { id: 'wool', name: 'Soft Wool Sacks', icon: '🧶', price: 180, count: this.gameState.inventory.wool }
    ];

    let totalStockValue = 0;
    items.forEach(it => {
      totalStockValue += it.count * it.price;
    });

    const sellAllCard = document.createElement('div');
    sellAllCard.className = 'upgrade-card';
    sellAllCard.style.background = 'linear-gradient(135deg, rgba(255,152,0,0.2), rgba(255,215,0,0.2))';
    sellAllCard.innerHTML = `
      <div class="card-icon">📦</div>
      <div class="card-details">
        <div class="card-name">Quick Sell All Inventory</div>
        <div class="card-desc">Sell all harvested crops, dairy, eggs & wool with +15% bulk bonus</div>
        <div class="card-stat">Total Value: ${Math.floor(totalStockValue * 1.15)} 🪙</div>
      </div>
      <div>
        <button class="buy-btn ${totalStockValue > 0 ? '' : 'disabled'}" id="btn-sell-all">
          <span>Sell All</span>
          <span class="btn-price">+${Math.floor(totalStockValue * 1.15)} 🪙</span>
        </button>
      </div>
    `;
    this.sheetBody.appendChild(sellAllCard);

    if (totalStockValue > 0) {
      sellAllCard.querySelector('#btn-sell-all').addEventListener('click', () => {
        const gain = Math.floor(totalStockValue * 1.15);
        this.gameState.addCoins(gain);
        items.forEach(it => {
          this.gameState.inventory[it.id] = 0;
        });
        this.gameState.save();
        this.updateTopBar();
        if (window.soundEngine) window.soundEngine.playCoin();
        this.showFloatNum(`Sold All Goods! +${gain} 🪙`, window.innerWidth / 2, window.innerHeight / 2);
        this.renderMarketSheet();
      });
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `
        <div class="card-icon">${item.icon}</div>
        <div class="card-details">
          <div class="card-name">${item.name}</div>
          <div class="card-desc">In Stock: ${item.count} units (${item.price} 🪙/unit)</div>
          <div class="card-stat">Value: ${item.count * item.price} 🪙</div>
        </div>
        <div>
          <button class="buy-btn ${item.count > 0 ? '' : 'disabled'}" id="sell-${item.id}">
            <span>Sell</span>
            <span class="btn-price">+${item.count * item.price} 🪙</span>
          </button>
        </div>
      `;
      this.sheetBody.appendChild(card);

      if (item.count > 0) {
        card.querySelector(`#sell-${item.id}`).addEventListener('click', () => {
          const gain = item.count * item.price;
          this.gameState.addCoins(gain);
          this.gameState.inventory[item.id] = 0;
          this.gameState.save();
          this.updateTopBar();
          if (window.soundEngine) window.soundEngine.playCoin();
          this.renderMarketSheet();
        });
      }
    });
  }

  // 6. WEATHER FORECAST & CROP GROWTH SYSTEM
  renderWeatherSheet() {
    const weatherList = [
      {
        id: 'sunny',
        name: 'Bright Sunny Day',
        icon: '☀️',
        growth: '+30% Faster Growth (1.3x)',
        desc: 'Solar rays provide optimal photosynthesis. Golden sparkles & glowing sun disc in the 3D sky.',
        bgColor: 'linear-gradient(135deg, rgba(255, 193, 7, 0.18), rgba(255, 152, 0, 0.18))',
        statColor: '#FFD54F'
      },
      {
        id: 'rain',
        name: 'Hydrating Nutrient Rain',
        icon: '🌧️',
        growth: '+100% Double Speed (2.0x Boost!)',
        desc: '3D raindrops shower over crops & soil with puddle splash rings and soothing rainfall ambiance. Maximum growth boost!',
        bgColor: 'linear-gradient(135deg, rgba(3, 169, 244, 0.18), rgba(0, 229, 255, 0.18))',
        statColor: '#00E5FF'
      },
      {
        id: 'cloudy',
        name: 'Overcast & Drifting Clouds',
        icon: '☁️',
        growth: 'Standard Growth (1.0x Normal)',
        desc: 'Low-poly fluffy clouds drift gracefully across the sky with soft diffused lighting across the farm.',
        bgColor: 'linear-gradient(135deg, rgba(144, 164, 174, 0.18), rgba(120, 144, 156, 0.18))',
        statColor: '#B0BEC5'
      }
    ];

    const currentKey = this.weatherSystem ? this.weatherSystem.currentWeather : 'sunny';

    weatherList.forEach(w => {
      const isActive = currentKey === w.id;
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.style.background = w.bgColor;
      card.innerHTML = `
        <div class="card-icon" style="font-size: 2.2rem;">${w.icon}</div>
        <div class="card-details">
          <div class="card-name">${w.name} ${isActive ? '<span style="color:#7CFF01;font-size:0.75rem;font-weight:900;">(ACTIVE)</span>' : ''}</div>
          <div class="card-desc">${w.desc}</div>
          <div class="card-stat" style="color: ${w.statColor}; font-weight: 900;">⚡ Crop Speed: ${w.growth}</div>
        </div>
        <div>
          ${isActive
            ? `<button class="buy-btn disabled">Active</button>`
            : `<button class="buy-btn" id="set-weather-${w.id}">
                <span>Summon</span>
                <span class="btn-price">${w.icon} Cast</span>
               </button>`
          }
        </div>
      `;
      this.sheetBody.appendChild(card);

      if (!isActive) {
        card.querySelector(`#set-weather-${w.id}`).addEventListener('click', () => {
          if (this.weatherSystem) {
            this.weatherSystem.setWeather(w.id, true);
          }
          if (window.soundEngine) window.soundEngine.playUpgrade();
          this.renderWeatherSheet();
        });
      }
    });
  }

  updateWeatherUI(cfg) {
    if (!cfg) return;
    if (this.btnWeather) {
      this.btnWeather.textContent = cfg.icon;
      this.btnWeather.title = `${cfg.name} (${cfg.growthMult}x Speed)`;
    }
    if (this.hudWeatherBadge) {
      this.hudWeatherBadge.textContent = cfg.badgeText;
    }
    if (this.bannerText) {
      this.bannerText.textContent = `${cfg.icon} ${cfg.name} Active`;
    }
  }

  // OFFLINE PROGRESS MODAL
  showOfflineModal(data) {
    const mins = Math.floor(data.secs / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;

    this.offlineTime.textContent = hrs > 0 ? `${hrs}h ${remMins}m` : `${mins}m`;
    this.offlineCoins.textContent = `+${this.formatNumber(data.coins)} 🪙`;
    this.offlineGems.textContent = `+${data.gems} 💎`;
    this.offlineModal.style.display = 'flex';
  }

  // LEVEL UP TOAST
  showLevelUpModal(lvl) {
    this.lvlUpText.textContent = `You reached Farm Level ${lvl}! New plots & perks unlocked!`;
    this.levelUpToast.style.display = 'block';
    if (this.player) this.player.triggerLevelUp();

    setTimeout(() => {
      this.levelUpToast.style.display = 'none';
    }, 3500);
  }

  // ANIMAL WEATHER & NIGHT CARE HUD SYSTEM
  showHotWeatherAlert(isHot) {
    this.updateCareHUD();
  }

  updateCareHUD() {
    const hudCareCard = document.getElementById('hud-care-card');
    const hudCareIcon = document.getElementById('hud-care-icon');
    const hudCareTitle = document.getElementById('hud-care-title');
    const hudCareDesc = document.getElementById('hud-care-desc');
    const hudCareBtn = document.getElementById('hud-care-action-btn');
    if (!hudCareCard || !hudCareBtn) return;

    if (this.gameState.isHotWeather) {
      hudCareCard.style.display = 'flex';
      hudCareCard.style.borderColor = '#ff9800';
      if (hudCareIcon) hudCareIcon.textContent = '☀️';
      if (hudCareTitle) hudCareTitle.textContent = 'Scorching Afternoon Sun!';
      if (this.gameState.animalsSheltered) {
        if (hudCareDesc) hudCareDesc.textContent = '✅ Animals resting in shade! Full production preserved.';
        hudCareBtn.textContent = '🌿 Let Roam';
        hudCareBtn.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
      } else {
        if (hudCareDesc) hudCareDesc.textContent = '⚠️ Move animals into shaded shelters or yields drop by 55%!';
        hudCareBtn.textContent = '🛖 Move to Shelter';
        hudCareBtn.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
      }
    } else if (this.gameState.chickensInCoop) {
      hudCareCard.style.display = 'flex';
      hudCareCard.style.borderColor = '#29b6f6';
      if (hudCareIcon) hudCareIcon.textContent = '🐔';
      if (hudCareTitle) hudCareTitle.textContent = 'Night Chicken Coop & Safety';
      if (this.gameState.chickenCoopLocked) {
        if (hudCareDesc) hudCareDesc.textContent = '🔒 Coop locked securely! Chickens protected overnight.';
        hudCareBtn.textContent = '🔓 Unlock Coop';
        hudCareBtn.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
      } else {
        if (hudCareDesc) hudCareDesc.textContent = '🚪 Chickens are roosting inside. Lock the coop at night!';
        hudCareBtn.textContent = '🔒 Lock Coop';
        hudCareBtn.style.background = 'linear-gradient(135deg, #e91e63, #c2185b)';
      }
    } else {
      hudCareCard.style.display = 'none';
    }
  }
}

window.UIController = UIController;
