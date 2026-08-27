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

    // Tractor Auto-Farming
    this.tractorUnlocked = false;
    this.tractorLevel = 1;
    this.tractorSpeed = 1.0;

    // Inventory of Raw Farm Goods
    this.inventory = {
      wheat: 0,
      corn: 0,
      carrot: 0,
      strawberry: 0,
      pumpkin: 0,
      milk: 0,
      eggs: 0,
      wool: 0
    };

    // Employees (Farmer, Animal Caretaker, Shop Keeper, Manager)
    this.workers = {
      farmer: { name: 'Farmer Jack', role: 'Crop Harvester', hired: false, level: 1, cost: 200, yield: 12, timer: 0 },
      rancher: { name: 'Caretaker Maya', role: 'Animal Caretaker', hired: false, level: 1, cost: 400, yield: 24, timer: 0 },
      merchant: { name: 'Shopkeeper Leo', role: 'Market Salesman', hired: false, level: 1, cost: 650, yield: 45, timer: 0 },
      manager: { name: 'Manager Alex', role: 'Farm Director', hired: false, level: 1, cost: 1500, yield: 90, timer: 0 }
    };

    // Unlocked Plots & Animals
    this.unlockedPlots = [0, 1]; // plot IDs
    this.unlockedAnimals = ['cow', 'chicken'];

    this.lastSaveTime = Date.now();
    this.offlineEarnings = null;

    this.load();
  }

  save() {
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
      lastSaveTime: Date.now()
    };
    try {
      localStorage.setItem('idle_farm_empire_save', JSON.stringify(data));
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
        if (d.workers) this.workers = { ...this.workers, ...d.workers };
        if (d.unlockedPlots) this.unlockedPlots = d.unlockedPlots;
        if (d.unlockedAnimals) this.unlockedAnimals = d.unlockedAnimals;
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
        workerEarnings += 30 * this.workers.rancher.level;
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
  }
}

window.GameState = GameState;
