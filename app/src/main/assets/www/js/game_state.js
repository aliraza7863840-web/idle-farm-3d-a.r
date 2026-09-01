// Game State & Idle Empire Progression Engine

class GameState {
  constructor() {
    this.coins = 150;
    this.gems = 10;
    this.level = 1;
    this.xp = 0;
    this.xpRequired = 100;
    this.totalEarnings = 0;

    // Upgrades
    this.houseLevel = 1; // 1: Small Wooden Cabin, 2: Medium Country House, 3: Modern Farm Villa
    this.playerSpeed = 4.8;
    this.harvestRadius = 3.8;
    this.harvestMultiplier = 1.0;
    this.critChance = 0.12; // 12% chance for 5x coins
    this.farmingPower = 1; // Multiplier on crop & product yield
    this.carryCapacity = 20;

    // Tractor Auto-Farming & Player Driveable Vehicles
    this.tractorUnlocked = false;
    this.tractorLevel = 1;
    this.tractorSpeed = 1.0;

    // Free Starter Tools & Gear
    this.tools = {
      hoe: { id: 'hoe', name: 'Starter Steel Hoe', owned: true, level: 1 },
      waterCan: { id: 'waterCan', name: 'Brass Watering Can', owned: true, level: 1 },
      sickle: { id: 'sickle', name: 'Harvest Sickle', owned: true, level: 1 },
      fishingRod: { id: 'fishingRod', name: 'Bamboo Fishing Rod', owned: true, level: 1 },
      starterPackClaimed: true
    };

    // Free Starter Seed Pouches
    this.seeds = {
      wheat: 25,
      corn: 15,
      carrot: 12,
      strawberry: 8,
      pumpkin: 5
    };

    // Player Driveable Vehicles (Bike is 100% Free Starter Vehicle!)
    this.vehicles = {
      bike: { id: 'bike', name: 'City Cruiser Bike', icon: '🚲', unlocked: true, speed: 12.0, turnSpeed: 4.5, desc: 'Nimble & fast bicycle for exploring forests and hills.' },
      buggy: { id: 'buggy', name: 'Dune Sand Buggy', icon: '🏎️', unlocked: false, cost: 800, speed: 19.5, turnSpeed: 4.8, desc: 'Ultra-fast off-road buggy with roll cage and turbo acceleration!' },
      tractor: { id: 'tractor', name: 'Field Master Tractor', icon: '🚜', unlocked: false, cost: 500, speed: 7.5, turnSpeed: 2.8, desc: 'Heavy diesel tractor. Automatically tills and harvests crop fields while driving!' },
      pickup: { id: 'pickup', name: 'Farm Pickup Truck', icon: '🛻', unlocked: false, cost: 1200, speed: 15.5, turnSpeed: 3.5, desc: 'High-speed 4x4 truck with large cargo bed and headlights.' },
      sedan: { id: 'sedan', name: 'Country Town Sedan', icon: '🚗', unlocked: false, cost: 950, speed: 16.0, turnSpeed: 3.8, desc: 'Smooth highway cruising sedan with comfy cabin.' },
      quad: { id: 'quad', name: 'All-Terrain Quad ATV', icon: '🏍️', unlocked: false, cost: 650, speed: 14.0, turnSpeed: 4.2, desc: 'Rugged 4-wheel ATV perfect for climbing mountain trails.' },
      cart: { id: 'cart', name: 'Pony Cargo Cart', icon: '🐎', unlocked: false, cost: 350, speed: 9.0, turnSpeed: 3.2, desc: 'Charming wooden wagon pulled along country trails.' }
    };
    this.currentVehicle = null; // null or 'bike' | 'buggy' | 'tractor' | 'pickup' | 'sedan' | 'quad' | 'cart'

    // Fishing System & Freshwater Catch Records
    this.fishInventory = {
      bass: 0,
      trout: 0,
      catfish: 0,
      salmon: 0,
      golden_koi: 0
    };
    this.totalFishCaught = 0;

    // Inventory of Raw Farm Goods
    this.inventory = {
      wheat: 10,
      corn: 5,
      carrot: 5,
      strawberry: 2,
      pumpkin: 0,
      milk: 0,
      buffalo_butter: 0,
      goat_milk: 0,
      eggs: 0,
      horsehair: 0,
      wool: 0
    };

    // Employees (Farmer, Animal Caretaker, Shop Keeper, Manager)
    this.workers = {
      farmer: { name: 'Farmer Jack', role: 'Crop Harvester', hired: false, level: 1, cost: 200, yield: 12, timer: 0 },
      rancher: { name: 'Caretaker Maya', role: 'Animal Caretaker', hired: false, level: 1, cost: 400, yield: 24, timer: 0 },
      merchant: { name: 'Shopkeeper Leo', role: 'Market Salesman', hired: false, level: 1, cost: 650, yield: 45, timer: 0 },
      manager: { name: 'Manager Alex', role: 'Farm Director', hired: false, level: 1, cost: 1500, yield: 90, timer: 0 }
    };

    // Unlocked Plots & Animal Pens
    this.unlockedPlots = [0, 1]; // plot IDs
    this.unlockedAnimals = ['cow_buffalo', 'goat', 'chicken', 'horse', 'dog', 'cow'];

    // Hot Weather Care System
    this.isHotWeather = false;
    this.animalsSheltered = false;
    this.hotCareNoticeGiven = false;
    this.animalYieldTimer = 0;

    // Chicken Night Routine & Locking System
    this.chickenCoopLocked = false;
    this.chickensInCoop = false;

    // Tutorial Progression
    this.tutorialActive = true;
    this.tutorialStep = 0;
    this.tutorialCompleted = false;

    // Animal Breeding System & Livestock Roster (Separated into Pens)
    this.animalsData = [
      // 1. Cows and Buffaloes (Big Pen near crops)
      { id: 'cow_1', type: 'cow', penType: 'cow_buffalo', name: 'Bessie', breed: 'holstein', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'cow_2', type: 'cow', penType: 'cow_buffalo', name: 'Daisy', breed: 'jersey', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'buf_1', type: 'buffalo', penType: 'cow_buffalo', name: 'Buraq', breed: 'murrah', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'buf_2', type: 'buffalo', penType: 'cow_buffalo', name: 'Bahadur', breed: 'nili_ravi', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },

      // 2. Goats Pen (Mountain-style pen near crops)
      { id: 'goat_1', type: 'goat', penType: 'goat', name: 'Billy', breed: 'alpine', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'goat_2', type: 'goat', penType: 'goat', name: 'Nanny', breed: 'boer', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },

      // 3. Chickens Area (Scratch area & elevated coop near crops)
      { id: 'chk_1', type: 'chicken', penType: 'chicken', name: 'Pip', breed: 'leghorn', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'chk_2', type: 'chicken', penType: 'chicken', name: 'Clucky', breed: 'silkie', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'chk_3', type: 'chicken', penType: 'chicken', name: 'Penny', breed: 'phoenix', rarity: 'legendary', isBaby: false, growth: 1.0, cooldown: 0 },

      // 4. Horses Space (Equestrian paddock near crops)
      { id: 'hrs_1', type: 'horse', penType: 'horse', name: 'Spirit', breed: 'mustang', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'hrs_2', type: 'horse', penType: 'horse', name: 'Thunder', breed: 'appaloosa', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },

      // 5. Dog Kennel (Farm protector doghouse)
      { id: 'dog_1', type: 'dog', penType: 'dog', name: 'Barnaby', breed: 'shepherd', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 }
    ];

    this.activeBreedings = []; // Active breeding sessions

    this.lastSaveTime = Date.now();
    this.offlineEarnings = null;

    this.load();
    this.initAutoSave();
  }

  initAutoSave() {
    // 1. Regular 4-second auto-save interval
    this.autoSaveInterval = setInterval(() => {
      this.save(true);
    }, 4000);

    // 2. Lifecycle event hooks for mobile/Android webview resilience
    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.save(true);
        }
      });
      window.addEventListener('beforeunload', () => {
        this.save(true);
      });
      window.addEventListener('pagehide', () => {
        this.save(true);
      });
    }
  }

  save(isAutoSave = false) {
    const data = {
      coins: this.coins,
      gems: this.gems,
      level: this.level,
      xp: this.xp,
      xpRequired: this.xpRequired,
      houseLevel: this.houseLevel,
      playerSpeed: this.playerSpeed,
      harvestRadius: this.harvestRadius,
      harvestMultiplier: this.harvestMultiplier,
      critChance: this.critChance,
      farmingPower: this.farmingPower,
      carryCapacity: this.carryCapacity,
      tractorUnlocked: this.tractorUnlocked,
      tractorLevel: this.tractorLevel,
      inventory: this.inventory,
      workers: this.workers,
      unlockedPlots: this.unlockedPlots,
      unlockedAnimals: this.unlockedAnimals,
      tutorialActive: this.tutorialActive,
      tutorialStep: this.tutorialStep,
      tutorialCompleted: this.tutorialCompleted,
      animalsData: this.animalsData,
      activeBreedings: this.activeBreedings,
      tools: this.tools,
      seeds: this.seeds,
      vehicles: this.vehicles,
      fishInventory: this.fishInventory,
      totalFishCaught: this.totalFishCaught,
      lastSaveTime: Date.now()
    };
    try {
      localStorage.setItem('idle_farm_empire_save', JSON.stringify(data));
      this.lastSaveTime = Date.now();
      if (!isAutoSave) {
        console.log("Game state manually saved.");
      }
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem('idle_farm_empire_save');
      if (raw) {
        const d = JSON.parse(raw);
        if (d.coins !== undefined) this.coins = d.coins;
        if (d.gems !== undefined) this.gems = d.gems;
        if (d.level !== undefined) this.level = d.level;
        if (d.xp !== undefined) this.xp = d.xp;
        if (d.xpRequired !== undefined) this.xpRequired = d.xpRequired;
        if (d.houseLevel !== undefined) this.houseLevel = d.houseLevel;
        if (d.playerSpeed !== undefined) this.playerSpeed = d.playerSpeed;
        if (d.harvestRadius !== undefined) this.harvestRadius = d.harvestRadius;
        if (d.harvestMultiplier !== undefined) this.harvestMultiplier = d.harvestMultiplier;
        if (d.critChance !== undefined) this.critChance = d.critChance;
        if (d.farmingPower !== undefined) this.farmingPower = d.farmingPower;
        if (d.carryCapacity !== undefined) this.carryCapacity = d.carryCapacity;
        if (d.tractorUnlocked !== undefined) this.tractorUnlocked = d.tractorUnlocked;
        if (d.tractorLevel !== undefined) this.tractorLevel = d.tractorLevel;
        if (d.inventory) this.inventory = { ...this.inventory, ...d.inventory };
        if (d.tools) this.tools = { ...this.tools, ...d.tools };
        if (d.seeds) this.seeds = { ...this.seeds, ...d.seeds };
        if (d.vehicles) this.vehicles = { ...this.vehicles, ...d.vehicles };
        if (d.fishInventory) this.fishInventory = { ...this.fishInventory, ...d.fishInventory };
        if (d.totalFishCaught !== undefined) this.totalFishCaught = d.totalFishCaught;
        if (d.workers) this.workers = { ...this.workers, ...d.workers };
        if (d.unlockedPlots) this.unlockedPlots = d.unlockedPlots;
        if (d.unlockedAnimals) {
          this.unlockedAnimals = d.unlockedAnimals;
          if (!this.unlockedAnimals.includes('cow_buffalo')) this.unlockedAnimals.push('cow_buffalo');
          if (!this.unlockedAnimals.includes('goat')) this.unlockedAnimals.push('goat');
          if (!this.unlockedAnimals.includes('horse')) this.unlockedAnimals.push('horse');
          if (!this.unlockedAnimals.includes('dog')) this.unlockedAnimals.push('dog');
        }
        if (d.tutorialActive !== undefined) this.tutorialActive = d.tutorialActive;
        if (d.tutorialStep !== undefined) this.tutorialStep = d.tutorialStep;
        if (d.tutorialCompleted !== undefined) this.tutorialCompleted = d.tutorialCompleted;
        if (d.animalsData && Array.isArray(d.animalsData) && d.animalsData.length > 0) {
          d.animalsData.forEach(a => {
            if (a.penType === 'cow') a.penType = 'cow_buffalo';
          });
          this.animalsData = d.animalsData;

          // Ensure all required species (buffalo, goat, horse, dog) are present
          const existingIds = new Set(this.animalsData.map(a => a.id));
          const missingDefaults = [
            { id: 'buf_1', type: 'buffalo', penType: 'cow_buffalo', name: 'Buraq', breed: 'murrah', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
            { id: 'buf_2', type: 'buffalo', penType: 'cow_buffalo', name: 'Bahadur', breed: 'nili_ravi', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },
            { id: 'goat_1', type: 'goat', penType: 'goat', name: 'Billy', breed: 'alpine', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
            { id: 'goat_2', type: 'goat', penType: 'goat', name: 'Nanny', breed: 'boer', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },
            { id: 'hrs_1', type: 'horse', penType: 'horse', name: 'Spirit', breed: 'mustang', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
            { id: 'hrs_2', type: 'horse', penType: 'horse', name: 'Thunder', breed: 'appaloosa', rarity: 'rare', isBaby: false, growth: 1.0, cooldown: 0 },
            { id: 'dog_1', type: 'dog', penType: 'dog', name: 'Barnaby', breed: 'shepherd', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 }
          ];
          missingDefaults.forEach(def => {
            if (!existingIds.has(def.id) && !this.animalsData.some(a => a.type === def.type)) {
              this.animalsData.push(def);
            }
          });
        }
        if (d.activeBreedings && Array.isArray(d.activeBreedings)) {
          this.activeBreedings = d.activeBreedings;
        }
        if (d.lastSaveTime) this.checkOfflineProgress(d.lastSaveTime);
      }
    } catch (e) {
      console.warn("Storage load error", e);
    }
  }

  checkOfflineProgress(lastTime) {
    const now = Date.now();
    const elapsedSecs = Math.min(86400, Math.max(0, Math.floor((now - lastTime) / 1000)));

    // Minimum 30 seconds away to trigger offline calculation
    if (elapsedSecs > 30) {
      let ratePerSec = 0;
      let cropsEarned = 0;
      let animalProducts = 0;

      // Base farm passive yield
      ratePerSec += 2 * this.houseLevel;

      // Tractor auto-farming rate
      if (this.tractorUnlocked) {
        ratePerSec += 8 * this.tractorLevel;
        cropsEarned += Math.floor(elapsedSecs / 15) * this.tractorLevel;
      }

      // Workers
      if (this.workers.farmer.hired) {
        ratePerSec += this.workers.farmer.level * 6;
        cropsEarned += Math.floor(elapsedSecs / 20) * this.workers.farmer.level;
      }
      if (this.workers.rancher.hired) {
        ratePerSec += this.workers.rancher.level * 10;
        animalProducts += Math.floor(elapsedSecs / 25) * this.workers.rancher.level;
      }
      if (this.workers.merchant.hired) {
        ratePerSec += this.workers.merchant.level * 18;
      }
      if (this.workers.manager.hired) {
        ratePerSec *= 1.5;
      }

      // Farmhouse upgrade multiplier
      const houseMult = this.houseLevel === 1 ? 1.0 : this.houseLevel === 2 ? 1.25 : 1.6;
      ratePerSec *= houseMult;

      const earnedCoins = Math.floor(elapsedSecs * ratePerSec * 0.6);
      const earnedGems = Math.min(60, Math.floor(elapsedSecs / 1200) + 1);

      this.offlineEarnings = {
        secs: elapsedSecs,
        coins: Math.max(50, earnedCoins),
        gems: earnedGems,
        crops: cropsEarned,
        products: animalProducts
      };
    }
  }

  addCoins(amount, x = null, y = null, isCritical = false) {
    let multiplier = this.harvestMultiplier;
    let houseMult = this.houseLevel === 1 ? 1.0 : this.houseLevel === 2 ? 1.25 : 1.6;
    multiplier *= houseMult;

    let isCrit = isCritical || (Math.random() < this.critChance);
    if (isCrit) multiplier *= 5;

    const total = Math.max(1, Math.floor(amount * multiplier * this.farmingPower));
    this.coins += total;
    this.totalEarnings += total;

    this.addXP(Math.ceil(total * 0.25));

    if (window.uiController) {
      window.uiController.updateTopBar();
      if (x !== null && y !== null) {
        window.uiController.showFloatNum(isCrit ? `⚡ 5X CRIT! +${total} 🪙` : `+${total} 🪙`, x, y);
      }
    }

    if (window.soundEngine) {
      window.soundEngine.playCoin();
    }
  }

  addGems(amount, x = null, y = null) {
    this.gems += amount;
    if (window.uiController) {
      window.uiController.updateTopBar();
      if (x !== null && y !== null) {
        window.uiController.showFloatNum(`+${amount} 💎`, x, y);
      }
    }
    if (window.soundEngine) {
      window.soundEngine.playGem();
    }
  }

  addItem(type, count = 1) {
    if (this.inventory[type] !== undefined) {
      this.inventory[type] += count;
      this.save();
    }
  }

  addXP(amount) {
    this.xp += amount;
    while (this.xp >= this.xpRequired) {
      this.xp -= this.xpRequired;
      this.levelUp();
    }
    if (window.uiController) {
      window.uiController.updateTopBar();
    }
  }

  levelUp() {
    this.level += 1;
    this.xpRequired = Math.floor(this.xpRequired * 1.35);
    this.addGems(5);

    // Automatic unlocks based on character & farm mastery
    if (this.level >= 2 && !this.unlockedPlots.includes(2)) {
      this.unlockedPlots.push(2);
    }
    if (this.level >= 3 && !this.unlockedPlots.includes(3)) {
      this.unlockedPlots.push(3);
    }
    if (this.level >= 4 && !this.unlockedPlots.includes(4)) {
      this.unlockedPlots.push(4);
    }
    if (this.level >= 5 && !this.unlockedPlots.includes(5)) {
      this.unlockedPlots.push(5);
    }
    if (this.level >= 3 && !this.unlockedAnimals.includes('sheep')) {
      this.unlockedAnimals.push('sheep');
    }

    if (window.uiController) {
      window.uiController.showLevelUpModal(this.level);
    }
    if (window.soundEngine) {
      window.soundEngine.playLevelUp();
    }

    this.save();
  }

  update(delta) {
    // Automated Workers Loop
    let workerEarnings = 0;

    // Farmer auto-harvests
    if (this.workers.farmer.hired) {
      this.workers.farmer.timer += delta;
      if (this.workers.farmer.timer >= 4.0 / this.workers.farmer.level) {
        this.workers.farmer.timer = 0;
        workerEarnings += 16 * this.workers.farmer.level;
      }
    }

    // Caretaker auto-feeds animals & collects goods
    if (this.workers.rancher.hired) {
      this.workers.rancher.timer += delta;
      if (this.workers.rancher.timer >= 5.5 / this.workers.rancher.level) {
        this.workers.rancher.timer = 0;
        let rancherEarn = 30 * this.workers.rancher.level;
        // Hot weather care penalty: 50% loss if player doesn't shelter animals!
        if (this.isHotWeather && !this.animalsSheltered) {
          rancherEarn = Math.floor(rancherEarn * 0.45);
        }
        workerEarnings += rancherEarn;
      }
    }

    // Shopkeeper auto-sells market goods
    if (this.workers.merchant.hired) {
      this.workers.merchant.timer += delta;
      if (this.workers.merchant.timer >= 3.8 / this.workers.merchant.level) {
        this.workers.merchant.timer = 0;
        workerEarnings += 50 * this.workers.merchant.level;
      }
    }

    // Tractor Auto-Harvests bonus
    if (this.tractorUnlocked) {
      workerEarnings += 4 * this.tractorLevel * delta;
    }

    if (workerEarnings > 0) {
      if (this.workers.manager.hired) {
        workerEarnings *= 1.5;
      }
      const finalCoin = Math.floor(workerEarnings);
      if (finalCoin > 0) {
        this.coins += finalCoin;
        this.addXP(Math.ceil(finalCoin * 0.15));
        if (window.uiController) window.uiController.updateTopBar();
      }
    }

    // Animal Goods Yield Cycle (Milk, Eggs, Wool, Coins)
    this.animalYieldTimer += delta;
    if (this.animalYieldTimer >= 14.0) {
      this.animalYieldTimer = 0;
      let totalYieldCoins = 0;
      let milkYield = 0;
      let eggsYield = 0;
      let otherYield = 0;

      // Penalty applied if hot weather and player did NOT move animals to shelter!
      const penaltyMult = (this.isHotWeather && !this.animalsSheltered) ? 0.45 : 1.0;

      this.animalsData.forEach(a => {
        if (a.isBaby) return;
        if (a.penType === 'cow_buffalo') {
          totalYieldCoins += Math.floor((a.type === 'buffalo' ? 32 : 25) * penaltyMult);
          if (Math.random() < 0.6 * penaltyMult) milkYield++;
        } else if (a.penType === 'chicken') {
          totalYieldCoins += Math.floor(16 * penaltyMult);
          if (Math.random() < 0.7 * penaltyMult) eggsYield++;
        } else if (a.penType === 'goat') {
          totalYieldCoins += Math.floor(22 * penaltyMult);
          if (Math.random() < 0.5 * penaltyMult) otherYield++;
        } else if (a.penType === 'horse') {
          totalYieldCoins += Math.floor(30 * penaltyMult);
        } else if (a.penType === 'dog') {
          totalYieldCoins += Math.floor(12 * penaltyMult);
        }
      });

      if (totalYieldCoins > 0) {
        this.coins += totalYieldCoins;
        if (milkYield > 0) this.addItem('milk', milkYield);
        if (eggsYield > 0) this.addItem('eggs', eggsYield);
        if (otherYield > 0) this.addItem('wool', otherYield);

        if (window.uiController) {
          window.uiController.updateTopBar();
          if (this.isHotWeather && !this.animalsSheltered) {
            window.uiController.showFloatingText(`⚠️ Heat Stress! Yields reduced by 55%! Move animals to shelter!`, window.innerWidth / 2, window.innerHeight / 2 - 40);
          } else if (this.isHotWeather && this.animalsSheltered) {
            window.uiController.showFloatingText(`🛖 Sheltered Animals Safe in Shade: +${totalYieldCoins}🪙 +Goods!`, window.innerWidth / 2, window.innerHeight / 2 - 40);
          }
        }
      }
    }

    // Animal Cooldowns & Baby Growth Loop
    let animalsChanged = false;
    this.animalsData.forEach(a => {
      if (a.cooldown > 0) {
        a.cooldown = Math.max(0, a.cooldown - delta);
      }
      if (a.isBaby) {
        a.growth += delta / 40.0; // 40s to grow to adult
        if (a.growth >= 1.0) {
          a.isBaby = false;
          a.growth = 1.0;
          animalsChanged = true;
          if (window.uiController) {
            window.uiController.showFloatingText(`🎉 ${a.name} Grew Into an Adult!`, window.innerWidth / 2, window.innerHeight / 2 - 40);
          }
        }
      }
    });

    if (animalsChanged && window.farmWorld && window.farmWorld.syncAnimals) {
      window.farmWorld.syncAnimals(this.animalsData);
    }

    // Active Breedings Progress
    let breedingReadyNotice = false;
    this.activeBreedings.forEach(b => {
      if (!b.ready && b.remaining > 0) {
        b.remaining = Math.max(0, b.remaining - delta);
        if (b.remaining <= 0) {
          b.ready = true;
          breedingReadyNotice = true;
        }
      }
    });

    if (breedingReadyNotice) {
      if (window.uiController) {
        window.uiController.showFloatingText(`🎉 A Baby Animal is Ready in the Nursery!`, window.innerWidth / 2, window.innerHeight / 2 - 40);
        if (window.uiController.isAnimalsSheetOpen) {
          window.uiController.renderAnimalsSheet();
        }
      }
      if (window.soundEngine && window.soundEngine.playBabyBirth) {
        window.soundEngine.playBabyBirth();
      }
    }
  }

  // --- ANIMAL BREEDING ENGINE ---
  startBreeding(penType, parent1Id, parent2Id) {
    const parent1 = this.animalsData.find(a => a.id === parent1Id);
    const parent2 = this.animalsData.find(a => a.id === parent2Id);

    if (!parent1 || !parent2) return { success: false, reason: 'Please select two adult animals.' };
    if (parent1.id === parent2.id) return { success: false, reason: 'Select two distinct animals.' };
    if (parent1.type !== parent2.type || parent1.type !== penType) return { success: false, reason: 'Parents must be of the exact same species!' };
    if (parent1.isBaby || parent2.isBaby) return { success: false, reason: 'Baby animals cannot breed until fully matured.' };
    if (parent1.cooldown > 0 || parent2.cooldown > 0) {
      const waitTime = Math.max(parent1.cooldown, parent2.cooldown).toFixed(0);
      return { success: false, reason: `One of the animals is resting! Wait ${waitTime}s.` };
    }

    // Breeding cost: 60 coins
    const cost = 60;
    if (this.coins < cost) {
      return { success: false, reason: `Requires ${cost} 🪙 for breeding feed!` };
    }

    this.coins -= cost;
    parent1.cooldown = 25.0; // 25s breeding cooldown
    parent2.cooldown = 25.0;

    // Offspring genetics with mutation chance
    const roll = Math.random();
    let rarity = 'common';
    let breedKey = '';

    const p1Rarity = parent1.rarity || 'common';
    const p2Rarity = parent2.rarity || 'common';

    // Base mutation rates:
    let mutationThreshold = 0.10; // 10% chance for Legendary Mutation
    let rareThreshold = 0.32;     // 22% chance for Rare

    if (p1Rarity === 'rare' || p2Rarity === 'rare') {
      mutationThreshold += 0.06;
      rareThreshold += 0.18;
    }
    if (p1Rarity === 'legendary' || p2Rarity === 'legendary') {
      mutationThreshold += 0.16;
      rareThreshold += 0.20;
    }

    if (roll < mutationThreshold) {
      rarity = 'legendary';
      if (penType === 'cow' || penType === 'cow_buffalo') breedKey = 'celestial';
      else if (penType === 'goat') breedKey = 'nebula_goat';
      else if (penType === 'chicken') breedKey = 'phoenix';
      else if (penType === 'horse') breedKey = 'pegasus_flame';
      else breedKey = 'prism';
    } else if (roll < rareThreshold) {
      rarity = 'rare';
      if (penType === 'cow' || penType === 'cow_buffalo') breedKey = 'jersey';
      else if (penType === 'goat') breedKey = 'boer';
      else if (penType === 'chicken') breedKey = 'silkie';
      else if (penType === 'horse') breedKey = 'appaloosa';
      else breedKey = 'cotton_candy';
    } else {
      rarity = 'common';
      if (penType === 'cow' || penType === 'cow_buffalo') breedKey = 'holstein';
      else if (penType === 'goat') breedKey = 'alpine';
      else if (penType === 'chicken') breedKey = 'leghorn';
      else if (penType === 'horse') breedKey = 'mustang';
      else breedKey = 'merino';
    }

    const duration = 12.0; // 12 seconds breeding incubation
    const breedingId = 'brd_' + Date.now();

    const breeding = {
      id: breedingId,
      penType: penType,
      parent1Id: parent1Id,
      parent2Id: parent2Id,
      parent1Name: parent1.name,
      parent2Name: parent2.name,
      duration: duration,
      remaining: duration,
      resultBreed: breedKey,
      resultRarity: rarity,
      ready: false
    };

    this.activeBreedings.push(breeding);
    this.save();

    if (window.uiController) {
      window.uiController.updateTopBar();
      window.uiController.showFloatingText('💕 Breeding Initiated! (12s)', window.innerWidth / 2, window.innerHeight / 2 - 40);
    }
    if (window.soundEngine && window.soundEngine.playBreeding) {
      window.soundEngine.playBreeding();
    }

    return { success: true, breeding };
  }

  speedUpBreeding(breedingId) {
    const b = this.activeBreedings.find(x => x.id === breedingId);
    if (!b || b.ready) return false;
    if (this.gems < 1) {
      if (window.uiController) {
        window.uiController.showFloatingText('💎 Need 1 Gem to speed up!', window.innerWidth / 2, window.innerHeight / 2 - 40);
      }
      return false;
    }

    this.gems -= 1;
    b.remaining = 0;
    b.ready = true;
    this.save();
    if (window.uiController) {
      window.uiController.updateTopBar();
      window.uiController.showFloatingText('⚡ Breeding Finished!', window.innerWidth / 2, window.innerHeight / 2 - 40);
    }
    return true;
  }

  claimBaby(breedingId) {
    const idx = this.activeBreedings.findIndex(b => b.id === breedingId);
    if (idx === -1) return null;
    const b = this.activeBreedings[idx];
    if (!b.ready && b.remaining > 0) return null;

    this.activeBreedings.splice(idx, 1);

    const babyNames = {
      cow: ['Buttercup', 'Milky Way', 'Spot', 'Clover', 'Toffee', 'Honey', 'Luna', 'Nova', 'Cocoa'],
      cow_buffalo: ['Buttercup', 'Milky Way', 'Spot', 'Bhim', 'Thunder', 'Shadow', 'Sultan', 'Toffee'],
      buffalo: ['Titan', 'Bhim', 'Thunder', 'Shadow', 'Sultan', 'Ranger', 'Bullock'],
      goat: ['Kiddo', 'Pip', 'Ziggy', 'Nutmeg', 'Clover', 'Bambi', 'Buttons', 'Whiskers'],
      chicken: ['Nugget', 'Sunny', 'Peep', 'Feather', 'Goldie', 'Chirpy', 'Pico', 'Ruby'],
      horse: ['Star', 'Flash', 'Comet', 'Blaze', 'Copper', 'Duchess', 'Champion', 'Peggy'],
      dog: ['Buddy', 'Max', 'Scout', 'Rocky', 'Bailey', 'Cooper', 'Rusty'],
      sheep: ['Fluffy', 'Cloud', 'Marshmallow', 'Pom-Pom', 'Snowball', 'Sugar', 'Candy', 'Pixie']
    };
    const namePool = babyNames[b.penType] || ['Baby'];
    const chosenName = namePool[Math.floor(Math.random() * namePool.length)];

    const newAnimal = {
      id: `${b.penType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: b.penType === 'cow_buffalo' ? 'cow' : b.penType,
      penType: b.penType,
      name: chosenName,
      breed: b.resultBreed,
      rarity: b.resultRarity,
      isBaby: true,
      growth: 0.0,
      cooldown: 0
    };

    this.animalsData.push(newAnimal);
    this.addXP(b.resultRarity === 'legendary' ? 80 : b.resultRarity === 'rare' ? 40 : 20);
    if (b.resultRarity === 'legendary') {
      this.addGems(3);
    }
    this.save();

    if (window.farmWorld && window.farmWorld.syncAnimals) {
      window.farmWorld.syncAnimals(this.animalsData);
    }

    // Play sparkling 'New Life' chime when baby is spawned
    if (window.soundEngine && window.soundEngine.playNewLifeChime) {
      window.soundEngine.playNewLifeChime();
    } else if (window.soundEngine && window.soundEngine.playBabyBirth) {
      window.soundEngine.playBabyBirth();
    }

    return newAnimal;
  }

  // Hot Weather Care System
  setHotWeather(isHot) {
    if (this.isHotWeather === isHot) return;
    this.isHotWeather = isHot;
    if (isHot) {
      if (window.uiController && !this.hotCareNoticeGiven) {
        this.hotCareNoticeGiven = true;
        window.uiController.showHotWeatherAlert(true);
      }
    } else {
      this.hotCareNoticeGiven = false;
      if (window.uiController) {
        window.uiController.showHotWeatherAlert(false);
      }
    }
  }

  toggleAnimalsShelter(forceState = null) {
    this.animalsSheltered = forceState !== null ? forceState : !this.animalsSheltered;
    if (window.soundEngine && window.soundEngine.playShelterCall) {
      window.soundEngine.playShelterCall();
    }
    if (window.farmWorld && window.farmWorld.updateAnimalShelterPositions) {
      window.farmWorld.updateAnimalShelterPositions(this.animalsSheltered);
    }
    if (window.uiController && window.uiController.updateCareHUD) {
      window.uiController.updateCareHUD();
    }
    this.save();
    return this.animalsSheltered;
  }

  // Chicken Night Routine & Locking System
  toggleChickenCoopLock() {
    this.chickenCoopLocked = !this.chickenCoopLocked;
    if (window.soundEngine && window.soundEngine.playCoopLatch) {
      window.soundEngine.playCoopLatch(this.chickenCoopLocked);
    }
    if (window.farmWorld && window.farmWorld.updateChickenCoopState) {
      window.farmWorld.updateChickenCoopState(this.chickenCoopLocked, this.chickensInCoop);
    }
    if (window.uiController && window.uiController.updateCareHUD) {
      window.uiController.updateCareHUD();
    }
    this.save();
    return this.chickenCoopLocked;
  }

  setChickensInCoop(inCoop) {
    if (this.chickensInCoop === inCoop) return;
    this.chickensInCoop = inCoop;
    if (window.farmWorld && window.farmWorld.updateChickenCoopState) {
      window.farmWorld.updateChickenCoopState(this.chickenCoopLocked, this.chickensInCoop);
    }
    if (window.uiController && window.uiController.updateCareHUD) {
      window.uiController.updateCareHUD();
    }
  }

  feedBaby(animalId) {
    const animal = this.animalsData.find(a => a.id === animalId);
    if (!animal || !animal.isBaby) return false;

    // Feed cost: 25 coins
    if (this.coins < 25) {
      if (window.uiController) {
        window.uiController.showFloatingText('Need 25 🪙 for nutrient feed!', window.innerWidth / 2, window.innerHeight / 2);
      }
      return false;
    }

    this.coins -= 25;
    animal.growth = Math.min(1.0, animal.growth + 0.40); // +40% growth
    if (animal.growth >= 1.0) {
      animal.isBaby = false;
      animal.growth = 1.0;
    }
    this.save();

    if (window.uiController) {
      window.uiController.updateTopBar();
      window.uiController.showFloatingText(animal.isBaby ? '🍼 Fed Baby! (+40% Growth)' : '🎉 Baby Matured Into Adult!', window.innerWidth / 2, window.innerHeight / 2);
    }
    if (window.soundEngine && window.soundEngine.playHarvest) {
      window.soundEngine.playHarvest();
    }
    if (window.farmWorld && window.farmWorld.syncAnimals) {
      window.farmWorld.syncAnimals(this.animalsData);
    }
    return true;
  }

  // Driveable Vehicles Controller
  mountVehicle(vehicleId) {
    if (!this.vehicles[vehicleId] || !this.vehicles[vehicleId].unlocked) return false;
    this.currentVehicle = vehicleId;
    if (window.soundEngine) {
      if (vehicleId === 'bike') window.soundEngine.playBikeBell();
      else window.soundEngine.playHorn();
    }
    if (window.uiController) {
      window.uiController.updateVehicleHUD();
      window.uiController.showFloatingText(`Mounted ${this.vehicles[vehicleId].name}! ${this.vehicles[vehicleId].icon}`);
    }
    return true;
  }

  dismountVehicle() {
    if (!this.currentVehicle) return;
    const v = this.vehicles[this.currentVehicle];
    this.currentVehicle = null;
    if (window.uiController) {
      window.uiController.updateVehicleHUD();
      window.uiController.showFloatingText(`Dismounted ${v ? v.name : 'Vehicle'}`);
    }
  }

  unlockVehicle(vehicleId) {
    const v = this.vehicles[vehicleId];
    if (!v || v.unlocked) return false;
    if (this.coins < v.cost) {
      if (window.uiController) window.uiController.showFloatingText(`Need ${v.cost} 🪙 to unlock ${v.name}`);
      return false;
    }
    this.coins -= v.cost;
    v.unlocked = true;
    this.addXP(50);
    this.save();
    if (window.soundEngine && window.soundEngine.playLevelUp) {
      window.soundEngine.playLevelUp();
    }
    if (window.uiController) {
      window.uiController.updateTopBar();
      window.uiController.showFloatingText(`🎉 Unlocked ${v.name}! ${v.icon}`);
    }
    return true;
  }

  // Fishing System
  recordFishCatch(fishType) {
    const rewards = {
      bass: { name: 'Freshwater Bass', coins: 35, xp: 15, icon: '🐟' },
      trout: { name: 'Rainbow Trout', coins: 65, xp: 25, icon: '🐠' },
      catfish: { name: 'River Catfish', coins: 110, xp: 40, icon: '🐡' },
      salmon: { name: 'King Salmon', coins: 180, xp: 60, icon: '🦈' },
      golden_koi: { name: 'Golden Koi', coins: 450, xp: 120, icon: '✨🐟' }
    };
    const info = rewards[fishType] || rewards.bass;
    this.fishInventory[fishType] = (this.fishInventory[fishType] || 0) + 1;
    this.totalFishCaught++;
    this.addCoins(info.coins);
    this.addXP(info.xp);
    if (fishType === 'golden_koi') this.addGems(1);
    this.save();
    return info;
  }
}

window.GameState = GameState;
