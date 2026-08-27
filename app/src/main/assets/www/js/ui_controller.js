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
    const btnCamReset = document.getElementById('btn-cam-reset');
    const btnCamOverview = document.getElementById('btn-cam-overview');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');

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

    // Touch Joystick Virtual Controls
    this.setupJoystick();
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
    }

    this.modalBackdrop.classList.add('open');
    if (window.soundEngine) window.soundEngine.init();
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

  // 2. ANIMAL RANCH SHEET
  renderAnimalsSheet() {
    const animalItems = [
      { id: 'cow', name: 'Dairy Cows Pen', icon: '🐄', cost: 250, yield: 'Fresh Milk (+60 🪙/cycle)' },
      { id: 'chicken', name: 'Cluck Chickens Pen', icon: '🐔', cost: 150, yield: 'Fresh Eggs (+35 🪙/cycle)' },
      { id: 'sheep', name: 'Wool Sheep Meadow', icon: '🐑', cost: 600, yield: 'Soft Wool (+140 🪙/cycle)' }
    ];

    animalItems.forEach(item => {
      const isUnlocked = this.gameState.unlockedAnimals.includes(item.id);
      const canBuy = this.gameState.coins >= item.cost;

      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `
        <div class="card-icon">${item.icon}</div>
        <div class="card-details">
          <div class="card-name">${item.name}</div>
          <div class="card-desc">${item.yield}</div>
          <div class="card-stat">${isUnlocked ? '✅ Producing Goods' : 'Available for purchase'}</div>
        </div>
        <div>
          ${isUnlocked
            ? `<button class="buy-btn" id="feed-${item.id}">Feed (+Boost 🌾)</button>`
            : `<button class="buy-btn ${canBuy ? '' : 'disabled'}" id="buy-animal-${item.id}">
                <span>Buy</span>
                <span class="btn-price">${item.cost} 🪙</span>
               </button>`
          }
        </div>
      `;

      this.sheetBody.appendChild(card);

      if (isUnlocked) {
        card.querySelector(`#feed-${item.id}`).addEventListener('click', () => {
          this.gameState.addCoins(item.id === 'cow' ? 60 : item.id === 'chicken' ? 35 : 140);
          this.gameState.addItem(item.id === 'cow' ? 'milk' : item.id === 'chicken' ? 'eggs' : 'wool', 1);
          if (window.soundEngine) window.soundEngine.playAnimal(item.id);
          this.showFloatNum(`Fed! +Bonus Goods 📦`, window.innerWidth / 2, window.innerHeight / 2);
        });
      } else if (canBuy) {
        card.querySelector(`#buy-animal-${item.id}`).addEventListener('click', () => {
          this.gameState.coins -= item.cost;
          this.gameState.unlockedAnimals.push(item.id);
          this.gameState.save();
          this.updateTopBar();
          const p = this.farmWorld.animals.find(a => a.type === item.id);
          if (p) p.unlocked = true;
          if (window.soundEngine) window.soundEngine.playUpgrade();
          this.renderAnimalsSheet();
        });
      }
    });
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
}

window.UIController = UIController;
