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

    // Tutorial Progression
    this.tutorialActive = true;
    this.tutorialStep = 0;
    this.tutorialCompleted = false;

    // Animal Breeding System & Livestock Roster
    this.animalsData = [
      // Cows (Pen 0)
      { id: 'cow_1', type: 'cow', penType: 'cow', name: 'Bessie', breed: 'holstein', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'cow_2', type: 'cow', penType: 'cow', name: 'Daisy', breed: 'holstein', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      // Chickens (Pen 1)
      { id: 'chk_1', type: 'chicken', penType: 'chicken', name: 'Pip', breed: 'leghorn', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'chk_2', type: 'chicken', penType: 'chicken', name: 'Clucky', breed: 'leghorn', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'chk_3', type: 'chicken', penType: 'chicken', name: 'Penny', breed: 'leghorn', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      // Sheep (Pen 2)
      { id: 'shp_1', type: 'sheep', penType: 'sheep', name: 'Woolly', breed: 'merino', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 },
      { id: 'shp_2', type: 'sheep', penType: 'sheep', name: 'Cotton', breed: 'merino', rarity: 'common', isBaby: false, growth: 1.0, cooldown: 0 }
    ];

    this.activeBreedings = []; // Active breeding sessions

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
      tutorialActive: this.tutorialActive,
      tutorialStep: this.tutorialStep,
      tutorialCompleted: this.tutorialCompleted,
      animalsData: this.animalsData,
      activeBreedings: this.activeBreedings,
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
        if (d.tutorialActive !== undefined) this.tutorialActive = d.tutorialActive;
        if (d.tutorialStep !== undefined) this.tutorialStep = d.tutorialStep;
        if (d.tutorialCompleted !== undefined) this.tutorialCompleted = d.tutorialCompleted;
        if (d.animalsData && Array.isArray(d.animalsData) && d.animalsData.length > 0) {
          this.animalsData = d.animalsData;
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
      if (penType === 'cow') breedKey = 'celestial';
      else if (penType === 'chicken') breedKey = 'phoenix';
      else breedKey = 'prism';
    } else if (roll < rareThreshold) {
      rarity = 'rare';
      if (penType === 'cow') breedKey = 'jersey';
      else if (penType === 'chicken') breedKey = 'silkie';
      else breedKey = 'cotton_candy';
    } else {
      rarity = 'common';
      if (penType === 'cow') breedKey = 'holstein';
      else if (penType === 'chicken') breedKey = 'leghorn';
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
      chicken: ['Nugget', 'Sunny', 'Peep', 'Feather', 'Goldie', 'Chirpy', 'Pico', 'Ruby'],
      sheep: ['Fluffy', 'Cloud', 'Marshmallow', 'Pom-Pom', 'Snowball', 'Sugar', 'Candy', 'Pixie']
    };
    const namePool = babyNames[b.penType] || ['Baby'];
    const chosenName = namePool[Math.floor(Math.random() * namePool.length)];

    const newAnimal = {
      id: `${b.penType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: b.penType,
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

    if (window.soundEngine && window.soundEngine.playBabyBirth) {
      window.soundEngine.playBabyBirth();
    }

    return newAnimal;
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
}

window.GameState = GameState;
