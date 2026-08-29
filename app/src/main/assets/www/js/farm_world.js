// 3D Farm Environment, Buildings, Crops, Animals, Tractor & NPCs

class FarmWorld {
  constructor(scene) {
    this.scene = scene;
    this.plots = [];
    this.animals = [];
    this.workers = [];
    this.customers = [];
    this.nightLights = [];
    this.sleepBubbles = [];
    this.decorations = [];
    this.interactiveObjects = [];

    // Materials Library
    this.materials = {
      grass: new THREE.MeshLambertMaterial({ color: 0x558b2f }),
      grassDark: new THREE.MeshLambertMaterial({ color: 0x33691e }),
      dirt: new THREE.MeshLambertMaterial({ color: 0x5d4037 }),
      soilTilled: new THREE.MeshLambertMaterial({ color: 0x4e342e }),
      stonePath: new THREE.MeshLambertMaterial({ color: 0x78909c }),
      water: new THREE.MeshLambertMaterial({ color: 0x29b6f6, transparent: true, opacity: 0.85 }),
      woodDark: new THREE.MeshLambertMaterial({ color: 0x4e342e }),
      woodPlank: new THREE.MeshLambertMaterial({ color: 0x8d6e63 }),
      woodLight: new THREE.MeshLambertMaterial({ color: 0xbcaaa4 }),
      roofRed: new THREE.MeshLambertMaterial({ color: 0xb71c1c }),
      roofBlue: new THREE.MeshLambertMaterial({ color: 0x1565c0 }),
      roofModern: new THREE.MeshLambertMaterial({ color: 0x263238 }),
      villaWall: new THREE.MeshLambertMaterial({ color: 0xeeeeee }),
      glass: new THREE.MeshLambertMaterial({ color: 0xb3e5fc, transparent: true, opacity: 0.65 }),
      glassGlow: new THREE.MeshBasicMaterial({ color: 0xffd54f, transparent: true, opacity: 0.85 }),
      solarPanel: new THREE.MeshLambertMaterial({ color: 0x0d47a1 }),
      wheat: new THREE.MeshLambertMaterial({ color: 0xfbc02d }),
      corn: new THREE.MeshLambertMaterial({ color: 0x7cb342 }),
      cornCob: new THREE.MeshLambertMaterial({ color: 0xffd54f }),
      carrot: new THREE.MeshLambertMaterial({ color: 0xff6d00 }),
      strawberry: new THREE.MeshLambertMaterial({ color: 0xe53935 }),
      pumpkin: new THREE.MeshLambertMaterial({ color: 0xf57c00 }),
      leaves: new THREE.MeshLambertMaterial({ color: 0x2e7d32 }),
      leavesLight: new THREE.MeshLambertMaterial({ color: 0x66bb6a }),
      trunk: new THREE.MeshLambertMaterial({ color: 0x5d4037 }),
      fence: new THREE.MeshLambertMaterial({ color: 0xa1887f }),
      cowWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
      cowBlack: new THREE.MeshLambertMaterial({ color: 0x212121 }),
      cowCaramel: new THREE.MeshLambertMaterial({ color: 0xa0522d }),
      cowGold: new THREE.MeshLambertMaterial({ color: 0xffd700 }),
      chickenWhite: new THREE.MeshLambertMaterial({ color: 0xfff9c4 }),
      chickenBeak: new THREE.MeshLambertMaterial({ color: 0xff9800 }),
      chickenComb: new THREE.MeshLambertMaterial({ color: 0xd32f2f }),
      chickenSilkie: new THREE.MeshLambertMaterial({ color: 0x9fa8da }),
      chickenPhoenix: new THREE.MeshLambertMaterial({ color: 0xff6d00 }),
      sheepWool: new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
      sheepPink: new THREE.MeshLambertMaterial({ color: 0xf8bbd0 }),
      sheepRainbow: new THREE.MeshLambertMaterial({ color: 0x4dd0e1 }),
      strawBed: new THREE.MeshLambertMaterial({ color: 0xd7ccc8 }),
      heartPink: new THREE.MeshBasicMaterial({ color: 0xff4081 }),
      tractorRed: new THREE.MeshLambertMaterial({ color: 0xc62828 }),
      tractorGreen: new THREE.MeshLambertMaterial({ color: 0x2e7d32 }),
      tractorMetal: new THREE.MeshLambertMaterial({ color: 0x37474f }),
      tractorTire: new THREE.MeshLambertMaterial({ color: 0x212121 }),
      tractorRim: new THREE.MeshLambertMaterial({ color: 0xffeb3b }),
      lampGlow: new THREE.MeshBasicMaterial({ color: 0xffe082 }),
      lampOff: new THREE.MeshLambertMaterial({ color: 0x455a64 }),
      coinGold: new THREE.MeshLambertMaterial({ color: 0xffc107 }),
      milkWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
      workerHat: new THREE.MeshLambertMaterial({ color: 0xffe082 }),
      workerDenim: new THREE.MeshLambertMaterial({ color: 0x1976d2 }),
      workerShirt: new THREE.MeshLambertMaterial({ color: 0xef5350 }),
      skinTone: new THREE.MeshLambertMaterial({ color: 0xb88265 })
    };

    this.houseGroup = new THREE.Group();
    this.scene.add(this.houseGroup);

    this.tractorGroup = new THREE.Group();
    this.scene.add(this.tractorGroup);

    this.workersGroup = new THREE.Group();
    this.scene.add(this.workersGroup);

    this.customersGroup = new THREE.Group();
    this.scene.add(this.customersGroup);

    this.lightsGroup = new THREE.Group();
    this.scene.add(this.lightsGroup);

    this.buildBaseTerrain();
    this.buildFarmHouse(1);
    this.buildCropPlots();
    this.buildAnimalPens();
    this.buildWindmill();
    this.buildWaterWell();
    this.buildMarketShop();
    this.buildTractor();
    this.buildDecorations();
    this.buildStreetLamps();
    this.initNPCWorkers();
    this.initCustomerNPCs();
  }

  buildBaseTerrain() {
    // 1. Full Infinite Green Grass Ground Plane to prevent any void/blue gaps
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMesh = new THREE.Mesh(groundGeo, this.materials.grass);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.02;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);

    // 2. Large Stylized Farm Island with chamfered rim
    const islandGeo = new THREE.CylinderGeometry(32, 34, 2.8, 36);
    const islandMesh = new THREE.Mesh(islandGeo, this.materials.grass);
    islandMesh.position.y = -1.4;
    islandMesh.receiveShadow = true;
    this.scene.add(islandMesh);

    // 3. River / Pond on the left
    const pondGeo = new THREE.CylinderGeometry(4.8, 4.8, 0.4, 22);
    const pondMesh = new THREE.Mesh(pondGeo, this.materials.water);
    pondMesh.position.set(-14, 0.05, 12);
    this.scene.add(pondMesh);

    // Pond Wooden Pier / Dock
    const dockGeo = new THREE.BoxGeometry(2.4, 0.15, 3.5);
    const dockMesh = new THREE.Mesh(dockGeo, this.materials.woodPlank);
    dockMesh.position.set(-12, 0.1, 10.5);
    dockMesh.rotation.y = 0.5;
    this.scene.add(dockMesh);

    // Cobblestone Pathways connecting farmhouse, fields, and animal pens
    const paths = [
      { x: 0, z: 0, w: 2.6, h: 26, rot: 0 }, // North-South main avenue
      { x: 2, z: 1, w: 26, h: 2.6, rot: 0 }, // East-West crossroad
      { x: -5, z: -3, w: 2.0, h: 8, rot: 0.4 },
      { x: 8, z: 8, w: 1.8, h: 9, rot: -0.2 },
      { x: 6, z: 12, w: 2.4, h: 6, rot: 0 } // Path leading to Roadside Market
    ];

    paths.forEach(p => {
      const pathGeo = new THREE.BoxGeometry(p.w, 0.04, p.h);
      const pathMesh = new THREE.Mesh(pathGeo, this.materials.stonePath);
      pathMesh.position.set(p.x, 0.02, p.z);
      pathMesh.rotation.y = p.rot;
      pathMesh.receiveShadow = true;
      this.scene.add(pathMesh);
    });
  }

  buildFarmHouse(level = 1) {
    // Clear existing house meshes & lights
    while (this.houseGroup.children.length > 0) {
      this.houseGroup.remove(this.houseGroup.children[0]);
    }

    this.houseGroup.position.set(-5.5, 0, -4.5);
    this.houseGroup.rotation.y = 0.35;
    this.houseLevel = level;

    if (level === 1) {
      // ----------------------------------------------------
      // STAGE 1: Cozy Wooden Cabin
      // ----------------------------------------------------
      const baseGeo = new THREE.BoxGeometry(4.5, 2.6, 4.0);
      const baseMesh = new THREE.Mesh(baseGeo, this.materials.woodPlank);
      baseMesh.position.y = 1.3;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      this.houseGroup.add(baseMesh);

      // Roof (Gabled Red Shingles)
      const roofGeo = new THREE.ConeGeometry(3.6, 2.2, 4);
      const roofMesh = new THREE.Mesh(roofGeo, this.materials.roofRed);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.position.y = 3.6;
      roofMesh.scale.set(1.1, 1.0, 1.0);
      roofMesh.castShadow = true;
      this.houseGroup.add(roofMesh);

      // Chimney with warm stone
      const chimGeo = new THREE.BoxGeometry(0.6, 1.6, 0.6);
      const chimMesh = new THREE.Mesh(chimGeo, this.materials.stonePath);
      chimMesh.position.set(1.2, 3.8, -0.6);
      chimMesh.castShadow = true;
      this.houseGroup.add(chimMesh);

      // Porch Door
      const doorGeo = new THREE.BoxGeometry(0.9, 1.6, 0.1);
      const doorMesh = new THREE.Mesh(doorGeo, this.materials.woodDark);
      doorMesh.position.set(0, 0.8, 2.05);
      this.houseGroup.add(doorMesh);

      // Front Window (Glowing glass)
      const winGeo = new THREE.BoxGeometry(0.8, 0.8, 0.08);
      const winMesh = new THREE.Mesh(winGeo, this.materials.glass);
      winMesh.position.set(1.3, 1.3, 2.02);
      this.houseGroup.add(winMesh);

      // Warm Porch Lantern
      const lampGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const lampMesh = new THREE.Mesh(lampGeo, this.materials.lampGlow);
      lampMesh.position.set(-0.8, 1.6, 2.15);
      this.houseGroup.add(lampMesh);

      const lampLight = new THREE.PointLight(0xffa726, 0, 8);
      lampLight.position.set(-7.8, 1.6, -5.8);
      this.lightsGroup.add(lampLight);
      this.nightLights.push({ light: lampLight, intensity: 1.6 });

    } else if (level === 2) {
      // ----------------------------------------------------
      // STAGE 2: Medium 2-Story Country Farmhouse
      // ----------------------------------------------------
      // Ground Floor
      const groundGeo = new THREE.BoxGeometry(5.8, 2.8, 4.8);
      const groundMesh = new THREE.Mesh(groundGeo, this.materials.woodLight);
      groundMesh.position.y = 1.4;
      groundMesh.castShadow = true;
      groundMesh.receiveShadow = true;
      this.houseGroup.add(groundMesh);

      // Second Floor
      const secondGeo = new THREE.BoxGeometry(5.2, 2.2, 4.4);
      const secondMesh = new THREE.Mesh(secondGeo, this.materials.woodPlank);
      secondMesh.position.y = 3.9;
      secondMesh.castShadow = true;
      this.houseGroup.add(secondMesh);

      // Gabled Blue Roof
      const roofGeo = new THREE.ConeGeometry(4.2, 2.4, 4);
      const roofMesh = new THREE.Mesh(roofGeo, this.materials.roofBlue);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.position.y = 6.2;
      roofMesh.scale.set(1.15, 1.0, 1.15);
      roofMesh.castShadow = true;
      this.houseGroup.add(roofMesh);

      // Balcony & Railings
      const balconyGeo = new THREE.BoxGeometry(3.2, 0.15, 1.2);
      const balconyMesh = new THREE.Mesh(balconyGeo, this.materials.woodDark);
      balconyMesh.position.set(0, 2.75, 2.9);
      this.houseGroup.add(balconyMesh);

      const railGeo = new THREE.BoxGeometry(3.2, 0.7, 0.08);
      const railMesh = new THREE.Mesh(railGeo, this.materials.fence);
      railMesh.position.set(0, 3.15, 3.45);
      this.houseGroup.add(railMesh);

      // Double Chimney
      const chim1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.7), this.materials.stonePath);
      chim1.position.set(1.6, 6.2, -0.8);
      this.houseGroup.add(chim1);

      // Multiple Glowing Windows & Flower Boxes
      [[-1.6, 1.4], [1.6, 1.4], [-1.4, 3.9], [1.4, 3.9]].forEach(pos => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.1), this.materials.glass);
        win.position.set(pos[0], pos[1], 2.45);
        this.houseGroup.add(win);

        // Flower box
        const box = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.3), this.materials.woodDark);
        box.position.set(pos[0], pos[1] - 0.55, 2.5);
        this.houseGroup.add(box);

        const flower = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.2), this.materials.strawberry);
        flower.position.set(pos[0], pos[1] - 0.45, 2.5);
        this.houseGroup.add(flower);
      });

      // Front Door
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 0.1), this.materials.woodDark);
      door.position.set(0, 0.9, 2.45);
      this.houseGroup.add(door);

      // Dual Porch Lanterns
      const l1 = new THREE.PointLight(0xffa726, 0, 10);
      l1.position.set(-8.5, 2.0, -5.5);
      this.lightsGroup.add(l1);
      this.nightLights.push({ light: l1, intensity: 2.0 });

      const l2 = new THREE.PointLight(0xffd54f, 0, 10);
      l2.position.set(-5.5, 4.2, -5.5);
      this.lightsGroup.add(l2);
      this.nightLights.push({ light: l2, intensity: 1.8 });

    } else {
      // ----------------------------------------------------
      // STAGE 3: Big Modern Luxury Farm Villa
      // ----------------------------------------------------
      // Main Modern Structure (Crisp white villa & cedar wood)
      const baseGeo = new THREE.BoxGeometry(7.2, 3.0, 5.6);
      const baseMesh = new THREE.Mesh(baseGeo, this.materials.villaWall);
      baseMesh.position.y = 1.5;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      this.houseGroup.add(baseMesh);

      // Floor-to-ceiling Panoramic Glass Front
      const glassWall = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.4, 0.1), this.materials.glass);
      glassWall.position.set(0, 1.5, 2.85);
      this.houseGroup.add(glassWall);

      // Upper Modern Cantilever Suite
      const upperGeo = new THREE.BoxGeometry(6.4, 2.4, 4.8);
      const upperMesh = new THREE.Mesh(upperGeo, this.materials.woodPlank);
      upperMesh.position.set(0.6, 4.2, 0.2);
      upperMesh.castShadow = true;
      this.houseGroup.add(upperMesh);

      // Rooftop Terrace with Pergola & Solar Panels
      const roofDeck = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.25, 5.2), this.materials.roofModern);
      roofDeck.position.set(0.6, 5.5, 0.2);
      this.houseGroup.add(roofDeck);

      // Solar Panels
      [-1.2, 0.4, 2.0].forEach(px => {
        const solar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 2.0), this.materials.solarPanel);
        solar.position.set(px, 5.7, -0.4);
        solar.rotation.x = 0.1;
        this.houseGroup.add(solar);
      });

      // Wooden Modern Pergola Beams
      for (let b = 0; b < 5; b++) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 3.4), this.materials.woodDark);
        beam.position.set(-1.8 + b * 0.9, 3.2, 3.6);
        this.houseGroup.add(beam);
      }

      // Outdoor Lounge Patio Deck
      const patio = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.2, 2.4), this.materials.stonePath);
      patio.position.set(0, 0.1, 4.0);
      this.houseGroup.add(patio);

      // Modern Lounge Sofa
      const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.9), this.materials.woodDark);
      sofa.position.set(1.2, 0.35, 4.2);
      this.houseGroup.add(sofa);

      // Ambient Villa Night Illumination
      const vLight1 = new THREE.PointLight(0xffb74d, 0, 14);
      vLight1.position.set(-7, 2.2, -5.2);
      this.lightsGroup.add(vLight1);
      this.nightLights.push({ light: vLight1, intensity: 2.6 });

      const vLight2 = new THREE.PointLight(0x4fc3f7, 0, 12);
      vLight2.position.set(-6, 4.5, -6.0);
      this.lightsGroup.add(vLight2);
      this.nightLights.push({ light: vLight2, intensity: 2.0 });
    }
  }

  buildCropPlots() {
    const plotConfigs = [
      { id: 0, name: 'Wheat Field #1', x: 5, z: -8, type: 'wheat', unlocked: true },
      { id: 1, name: 'Corn Field #2', x: 11, z: -8, type: 'corn', unlocked: true },
      { id: 2, name: 'Carrot Field #3', x: 5, z: -14, type: 'carrot', unlocked: false },
      { id: 3, name: 'Strawberry Field #4', x: 11, z: -14, type: 'strawberry', unlocked: false },
      { id: 4, name: 'Pumpkin Field #5', x: 17, z: -8, type: 'pumpkin', unlocked: false },
      { id: 5, name: 'Royal Grain Field #6', x: 17, z: -14, type: 'wheat', unlocked: false }
    ];

    plotConfigs.forEach(cfg => {
      const plotGroup = new THREE.Group();
      plotGroup.position.set(cfg.x, 0, cfg.z);

      // Soil Bed (Raised Brown Mound)
      const soilGeo = new THREE.BoxGeometry(4.2, 0.25, 4.2);
      const soilMesh = new THREE.Mesh(soilGeo, this.materials.soilTilled);
      soilMesh.position.y = 0.12;
      soilMesh.receiveShadow = true;
      plotGroup.add(soilMesh);

      // Tilled Furrows
      for (let f = -1.5; f <= 1.5; f += 0.75) {
        const furrowGeo = new THREE.BoxGeometry(3.8, 0.08, 0.35);
        const furrow = new THREE.Mesh(furrowGeo, this.materials.dirt);
        furrow.position.set(0, 0.26, f);
        plotGroup.add(furrow);
      }

      // Wooden Edge Border
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.3, 0.12), this.materials.woodDark);
      b1.position.set(0, 0.15, 2.15);
      plotGroup.add(b1);
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.3, 0.12), this.materials.woodDark);
      b2.position.set(0, 0.15, -2.15);
      plotGroup.add(b2);
      const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 4.4), this.materials.woodDark);
      b3.position.set(2.15, 0.15, 0);
      plotGroup.add(b3);
      const b4 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 4.4), this.materials.woodDark);
      b4.position.set(-2.15, 0.15, 0);
      plotGroup.add(b4);

      // Spawn Plant Models in a 4x4 Grid
      const cropsArray = [];
      for (let row = -1.3; row <= 1.3; row += 0.85) {
        for (let col = -1.3; col <= 1.3; col += 0.85) {
          const plantGroup = new THREE.Group();
          plantGroup.position.set(col, 0.25, row);

          if (cfg.type === 'wheat') {
            const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 5), this.materials.wheat);
            stalk.position.y = 0.32;
            plantGroup.add(stalk);

            const head = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 6), this.materials.wheat);
            head.position.y = 0.65;
            plantGroup.add(head);

          } else if (cfg.type === 'corn') {
            const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 6), this.materials.corn);
            stalk.position.y = 0.45;
            plantGroup.add(stalk);

            const cob = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 6), this.materials.cornCob);
            cob.position.set(0.1, 0.65, 0);
            cob.rotation.z = -0.3;
            plantGroup.add(cob);

          } else if (cfg.type === 'carrot') {
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 6), this.materials.leavesLight);
            leaves.position.y = 0.25;
            plantGroup.add(leaves);

            const root = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.02, 0.35, 6), this.materials.carrot);
            root.position.y = 0.08;
            plantGroup.add(root);

          } else if (cfg.type === 'strawberry') {
            const bush = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 6), this.materials.leaves);
            bush.position.y = 0.2;
            plantGroup.add(bush);

            const berry = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 5), this.materials.strawberry);
            berry.position.set(0.15, 0.22, 0.15);
            plantGroup.add(berry);

          } else if (cfg.type === 'pumpkin') {
            const pumpkin = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), this.materials.pumpkin);
            pumpkin.scale.set(1.2, 0.9, 1.2);
            pumpkin.position.y = 0.25;
            plantGroup.add(pumpkin);

            const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 0.15), this.materials.leaves);
            leaf.position.y = 0.45;
            plantGroup.add(leaf);
          }

          plotGroup.add(plantGroup);
          cropsArray.push(plantGroup);
        }
      }

      // Unlock Sign / Lock Cage
      const lockGroup = new THREE.Group();
      const lockSign = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.1), this.materials.woodPlank);
      lockSign.position.y = 1.2;
      lockGroup.add(lockSign);

      const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), this.materials.woodDark);
      signPost.position.y = 0.6;
      lockGroup.add(signPost);

      plotGroup.add(lockGroup);
      lockGroup.visible = !cfg.unlocked;

      this.scene.add(plotGroup);

      this.plots.push({
        ...cfg,
        group: plotGroup,
        crops: cropsArray,
        lockGroup: lockGroup,
        growth: 1.0,
        growthSpeed: 0.15,
        ready: true
      });
    });
  }

  buildAnimalPens() {
    const penConfigs = [
      { type: 'cow', name: 'Dairy Cows', x: -6, z: -14, count: 2, unlocked: true },
      { type: 'chicken', name: 'Cluck Chickens', x: -13, z: -14, count: 3, unlocked: true },
      { type: 'sheep', name: 'Wool Sheep', x: -14, z: -6, count: 2, unlocked: false }
    ];

    penConfigs.forEach(pen => {
      const penGroup = new THREE.Group();
      penGroup.position.set(pen.x, 0, pen.z);

      // Wooden Fence Perimeter (4.6 x 4.6)
      const fenceMat = this.materials.fence;
      const f1 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.8, 0.1), fenceMat);
      f1.position.set(0, 0.4, 2.3);
      penGroup.add(f1);
      const f2 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.8, 0.1), fenceMat);
      f2.position.set(0, 0.4, -2.3);
      penGroup.add(f2);
      const f3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 4.6), fenceMat);
      f3.position.set(2.3, 0.4, 0);
      penGroup.add(f3);
      const f4 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 4.6), fenceMat);
      f4.position.set(-2.3, 0.4, 0);
      penGroup.add(f4);

      // Feeding Trough
      const trough = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.6), this.materials.woodDark);
      trough.position.set(0, 0.2, -1.5);
      penGroup.add(trough);

      // Shelter / Shed roof corner
      const shedRoof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 2.0), this.materials.roofRed);
      shedRoof.position.set(1.0, 1.6, -1.1);
      shedRoof.rotation.z = -0.15;
      penGroup.add(shedRoof);

      // Nursery Nest / Cradle for active breeding & newborn babies
      const nurseryGroup = new THREE.Group();
      nurseryGroup.position.set(-1.3, 0.05, -1.3);

      const nestBase = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 0.16, 12), this.materials.strawBed);
      nurseryGroup.add(nestBase);

      const heartMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), this.materials.heartPink);
      heartMesh.position.set(0, 0.55, 0);
      nurseryGroup.add(heartMesh);

      nurseryGroup.visible = false;
      penGroup.add(nurseryGroup);

      // Initial animal meshes placeholder
      const animalMeshes = [];
      for (let i = 0; i < pen.count; i++) {
        let animalMesh;
        if (pen.type === 'cow') {
          animalMesh = this.createCow('holstein', false);
        } else if (pen.type === 'chicken') {
          animalMesh = this.createChicken('leghorn', false);
        } else {
          animalMesh = this.createSheep('merino', false);
        }
        animalMesh.userData = { isAnimalMesh: true };
        animalMesh.position.set((i - 0.5) * 1.5, 0, (Math.random() - 0.5) * 1.5);
        penGroup.add(animalMesh);

        // Sleep indicator / zZz bubble
        const zBubble = this.createSleepBubble();
        zBubble.position.set(0, 1.8, 0);
        zBubble.visible = false;
        animalMesh.add(zBubble);

        animalMeshes.push({ mesh: animalMesh, bubble: zBubble, basePosY: 0 });
      }

      this.scene.add(penGroup);
      this.animals.push({
        ...pen,
        group: penGroup,
        nurseryGroup: nurseryGroup,
        nurseryHeart: heartMesh,
        animals: animalMeshes,
        productTimer: 0,
        productInterval: pen.type === 'cow' ? 10 : pen.type === 'chicken' ? 6 : 14
      });
    });
  }

  syncAnimals(animalsData) {
    if (!animalsData || !Array.isArray(animalsData)) return;

    this.animals.forEach(pen => {
      // Remove previously spawned animal meshes
      const toRemove = [];
      pen.group.children.forEach(child => {
        if (child.userData && child.userData.isAnimalMesh) {
          toRemove.push(child);
        }
      });
      toRemove.forEach(c => pen.group.remove(c));

      // Filter animals data for this pen
      const penAnimals = animalsData.filter(a => a.penType === pen.type);
      pen.animals = [];

      penAnimals.forEach((anim, idx) => {
        let animalMesh;
        if (pen.type === 'cow') {
          animalMesh = this.createCow(anim.breed || 'holstein', anim.isBaby);
        } else if (pen.type === 'chicken') {
          animalMesh = this.createChicken(anim.breed || 'leghorn', anim.isBaby);
        } else {
          animalMesh = this.createSheep(anim.breed || 'merino', anim.isBaby);
        }
        animalMesh.userData = { isAnimalMesh: true, id: anim.id, data: anim };

        // Position spread across pen ground
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        const posX = (col - 0.5) * 1.4 + (Math.sin(idx * 1.7) * 0.3);
        const posZ = (row - 0.5) * 1.3 + (Math.cos(idx * 2.3) * 0.3);
        animalMesh.position.set(posX, 0, posZ);
        pen.group.add(animalMesh);

        // Sleep bubble
        const zBubble = this.createSleepBubble();
        zBubble.position.set(0, anim.isBaby ? 1.0 : 1.8, 0);
        zBubble.visible = false;
        animalMesh.add(zBubble);

        pen.animals.push({
          data: anim,
          mesh: animalMesh,
          bubble: zBubble,
          basePosY: 0,
          basePosX: posX,
          basePosZ: posZ
        });
      });
    });
  }

  createCow(breed = 'holstein', isBaby = false) {
    const cow = new THREE.Group();
    if (isBaby) {
      cow.scale.set(0.5, 0.5, 0.5);
    }

    const isJersey = breed === 'jersey';
    const isCelestial = breed === 'celestial';

    const bodyMat = isCelestial ? this.materials.cowGold : isJersey ? this.materials.cowCaramel : this.materials.cowWhite;
    const patchMat = isCelestial ? this.materials.coinGold : isJersey ? this.materials.woodDark : this.materials.cowBlack;
    const snoutMat = isCelestial ? this.materials.lampGlow : isJersey ? this.materials.cowBlack : this.materials.woodLight;

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.6), bodyMat);
    body.position.y = 0.85;
    body.castShadow = true;
    cow.add(body);

    // Patch on flank
    const patch = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.5, 0.7), patchMat);
    patch.position.set(0, 0.9, 0.2);
    cow.add(patch);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.7), bodyMat);
    head.position.set(0, 1.2, 0.95);
    cow.add(head);

    // Snout / Nose
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.3), snoutMat);
    snout.position.set(0, 1.05, 1.35);
    cow.add(snout);

    // Horns
    [-0.25, 0.25].forEach(hx => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 6), isCelestial ? this.materials.coinGold : this.materials.woodDark);
      horn.position.set(hx, 1.55, 0.85);
      horn.rotation.z = hx > 0 ? -0.4 : 0.4;
      cow.add(horn);
    });

    // If Celestial Legendary Mutation, add crown star
    if (isCelestial) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), this.materials.lampGlow);
      star.position.set(0, 1.85, 0.95);
      cow.add(star);
    }

    // 4 Legs
    [[-0.4, -0.5], [0.4, -0.5], [-0.4, 0.5], [0.4, 0.5]].forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), bodyMat);
      leg.position.set(pos[0], 0.3, pos[1]);
      leg.castShadow = true;
      cow.add(leg);
    });

    return cow;
  }

  createChicken(breed = 'leghorn', isBaby = false) {
    const chicken = new THREE.Group();
    const scale = isBaby ? 0.38 : 0.65;
    chicken.scale.set(scale, scale, scale);

    const isSilkie = breed === 'silkie';
    const isPhoenix = breed === 'phoenix';

    const bodyMat = isPhoenix ? this.materials.chickenPhoenix : isSilkie ? this.materials.chickenSilkie : this.materials.chickenWhite;
    const combMat = isPhoenix ? this.materials.coinGold : isSilkie ? this.materials.glassGlow : this.materials.chickenComb;

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), bodyMat);
    body.position.y = 0.5;
    body.castShadow = true;
    chicken.add(body);

    // Head & Comb
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), bodyMat);
    head.position.set(0, 0.85, 0.25);
    chicken.add(head);

    const comb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.22), combMat);
    comb.position.set(0, 1.05, 0.25);
    chicken.add(comb);

    // Beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 6), this.materials.chickenBeak);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.85, 0.45);
    chicken.add(beak);

    // Tail Feathers for Phoenix
    if (isPhoenix) {
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 4), this.materials.coinGold);
      tail.position.set(0, 0.7, -0.4);
      tail.rotation.x = -Math.PI / 3;
      chicken.add(tail);
    }

    // Legs
    [-0.15, 0.15].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6), this.materials.chickenBeak);
      leg.position.set(lx, 0.15, 0);
      chicken.add(leg);
    });

    return chicken;
  }

  createSheep(breed = 'merino', isBaby = false) {
    const sheep = new THREE.Group();
    if (isBaby) {
      sheep.scale.set(0.46, 0.46, 0.46);
    }

    const isPink = breed === 'cotton_candy';
    const isRainbow = breed === 'prism';

    const woolMat = isRainbow ? this.materials.sheepRainbow : isPink ? this.materials.sheepPink : this.materials.sheepWool;
    const faceMat = isRainbow ? this.materials.lampGlow : isPink ? this.materials.woodLight : this.materials.cowBlack;

    // Fluffy Wool Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), woolMat);
    body.position.y = 0.75;
    body.scale.set(1.0, 0.9, 1.3);
    body.castShadow = true;
    sheep.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), faceMat);
    head.position.set(0, 0.95, 0.85);
    sheep.add(head);

    // Horns for Rainbow Prism
    if (isRainbow) {
      [-0.2, 0.2].forEach(hx => {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.25, 4), this.materials.coinGold);
        horn.position.set(hx, 1.25, 0.75);
        horn.rotation.z = hx > 0 ? -0.5 : 0.5;
        sheep.add(horn);
      });
    }

    // 4 Legs
    [[-0.35, -0.4], [0.35, -0.4], [-0.35, 0.4], [0.35, 0.4]].forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 6), faceMat);
      leg.position.set(pos[0], 0.25, pos[1]);
      sheep.add(leg);
    });

    return sheep;
  }

  createSleepBubble() {
    const bubble = new THREE.Group();

    // 3D Animated "Z" Letters
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#90caf9';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('zZz', 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.4, 1.4, 1.4);
    bubble.add(sprite);

    return bubble;
  }

  buildTractor() {
    // Red Farm Tractor Model with Physics & Wheels
    this.tractorGroup.position.set(8, 0, -4);

    // Tractor Body / Bonnet
    const bonnet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.85, 1.9), this.materials.tractorRed);
    bonnet.position.set(0, 0.8, 0.45);
    bonnet.castShadow = true;
    this.tractorGroup.add(bonnet);

    // Yellow Racing Stripe on hood
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.12, 1.5), this.materials.tractorRim);
    stripe.position.set(0, 1.1, 0.45);
    this.tractorGroup.add(stripe);

    // Cab / Roll Cage
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.15, 1.0), this.materials.tractorMetal);
    cab.position.set(0, 1.35, -0.6);
    cab.castShadow = true;
    this.tractorGroup.add(cab);

    // Steering Wheel & Driver Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.5), this.materials.woodDark);
    seat.position.set(0, 1.0, -0.5);
    this.tractorGroup.add(seat);

    // Exhaust Pipe (Smokes when moving)
    this.tractorExhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.1, 8), this.materials.tractorMetal);
    this.tractorExhaust.position.set(0.48, 1.5, 0.9);
    this.tractorGroup.add(this.tractorExhaust);

    // Harvesting Cutter Blade on Front
    const bladeBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 0.4), this.materials.tractorMetal);
    bladeBar.position.set(0, 0.3, 1.5);
    this.tractorGroup.add(bladeBar);

    this.tractorWheels = [];

    // Front Wheels
    [-0.7, 0.7].forEach(wx => {
      const wGroup = new THREE.Group();
      wGroup.position.set(wx, 0.38, 0.95);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.24, 14), this.materials.tractorTire);
      tire.rotation.z = Math.PI / 2;
      wGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.26, 10), this.materials.tractorRim);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      this.tractorGroup.add(wGroup);
      this.tractorWheels.push(wGroup);
    });

    // Rear Big Wheels
    [-0.78, 0.78].forEach(wx => {
      const wGroup = new THREE.Group();
      wGroup.position.set(wx, 0.68, -0.65);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.36, 16), this.materials.tractorTire);
      tire.rotation.z = Math.PI / 2;
      wGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.38, 12), this.materials.tractorRim);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      this.tractorGroup.add(wGroup);
      this.tractorWheels.push(wGroup);
    });

    // Waypoint patrol route for autonomous crop harvesting
    this.tractorWaypoints = [
      { x: 5, z: -8 },
      { x: 11, z: -8 },
      { x: 17, z: -8 },
      { x: 17, z: -14 },
      { x: 11, z: -14 },
      { x: 5, z: -14 }
    ];
    this.currentTractorWP = 0;
    this.tractorActionTimer = 0;
    this.tractorVelocity = new THREE.Vector3();
  }

  buildMarketShop() {
    this.shopGroup = new THREE.Group();
    this.shopGroup.position.set(6, 0, 12);

    // Main Market Wooden Stall Structure
    const floor = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 3.4), this.materials.woodPlank);
    floor.position.y = 0.1;
    this.shopGroup.add(floor);

    // Counter Table
    const counter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 1.4), this.materials.woodPlank);
    counter.position.set(0, 0.65, 0.5);
    counter.castShadow = true;
    this.shopGroup.add(counter);

    // Wooden Back Shelves
    const backShelf = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 0.6), this.materials.woodDark);
    backShelf.position.set(0, 1.3, -1.2);
    this.shopGroup.add(backShelf);

    // Awning Canopy (Red & White Striped Vibe)
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.15, 3.2), this.materials.roofRed);
    canopy.position.set(0, 2.6, 0.2);
    canopy.rotation.x = 0.12;
    this.shopGroup.add(canopy);

    // Display Crates on counter with farm produce
    const cWheat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.5), this.materials.wheat);
    cWheat.position.set(-1.2, 1.3, 0.5);
    this.shopGroup.add(cWheat);

    const cCorn = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.5), this.materials.cornCob);
    cCorn.position.set(-0.3, 1.3, 0.5);
    this.shopGroup.add(cCorn);

    const cCarrot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.5), this.materials.carrot);
    cCarrot.position.set(0.6, 1.3, 0.5);
    this.shopGroup.add(cCarrot);

    const cBerry = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.5), this.materials.strawberry);
    cBerry.position.set(1.5, 1.3, 0.5);
    this.shopGroup.add(cBerry);

    // Milk Canister & Wool sack on shelves
    const milkCan = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.6, 8), this.materials.milkWhite);
    milkCan.position.set(-1.2, 1.8, -1.0);
    this.shopGroup.add(milkCan);

    const woolSack = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), this.materials.sheepWool);
    woolSack.position.set(1.2, 1.7, -1.0);
    this.shopGroup.add(woolSack);

    // Market Lantern
    const mLight = new THREE.PointLight(0xffa726, 0, 10);
    mLight.position.set(6, 2.2, 12.5);
    this.lightsGroup.add(mLight);
    this.nightLights.push({ light: mLight, intensity: 1.8 });

    this.scene.add(this.shopGroup);
  }

  buildWindmill() {
    this.windmillGroup = new THREE.Group();
    this.windmillGroup.position.set(16, 0, 7);

    // Tower
    const towerGeo = new THREE.CylinderGeometry(1.6, 2.4, 7.2, 10);
    const towerMesh = new THREE.Mesh(towerGeo, this.materials.woodLight);
    towerMesh.position.y = 3.6;
    towerMesh.castShadow = true;
    this.windmillGroup.add(towerMesh);

    // Red Cap
    const capGeo = new THREE.ConeGeometry(2.1, 1.8, 10);
    const capMesh = new THREE.Mesh(capGeo, this.materials.roofRed);
    capMesh.position.y = 8.1;
    this.windmillGroup.add(capMesh);

    // 4 Blades
    this.windmillBlades = new THREE.Group();
    this.windmillBlades.position.set(0, 6.8, 1.75);

    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), this.materials.woodDark);
    this.windmillBlades.add(hub);

    for (let b = 0; b < 4; b++) {
      const bladeArm = new THREE.Group();
      bladeArm.rotation.z = (b * Math.PI) / 2;

      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.4, 0.08), this.materials.woodPlank);
      blade.position.y = 1.8;
      bladeArm.add(blade);
      this.windmillBlades.add(bladeArm);
    }

    this.windmillGroup.add(this.windmillBlades);
    this.scene.add(this.windmillGroup);
  }

  buildWaterWell() {
    const wellGroup = new THREE.Group();
    wellGroup.position.set(-2, 0, -4);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.9, 12), this.materials.stonePath);
    base.position.y = 0.45;
    wellGroup.add(base);

    const water = new THREE.Mesh(new THREE.CircleGeometry(1.0, 12), this.materials.water);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.7;
    wellGroup.add(water);

    [-0.9, 0.9].forEach(px => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6), this.materials.woodDark);
      post.position.set(px, 1.35, 0);
      wellGroup.add(post);
    });

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.0, 4), this.materials.roofRed);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 2.4;
    wellGroup.add(roof);

    // Well Lantern
    const wLight = new THREE.PointLight(0xffb74d, 0, 7);
    wLight.position.set(-2, 1.8, -4);
    this.lightsGroup.add(wLight);
    this.nightLights.push({ light: wLight, intensity: 1.2 });

    this.scene.add(wellGroup);
  }

  buildStreetLamps() {
    const lampPositions = [
      { x: 0, z: 6 },
      { x: 0, z: -6 },
      { x: -7, z: 0 },
      { x: 7, z: 0 }
    ];

    lampPositions.forEach(lp => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.8, 8), this.materials.woodDark);
      post.position.set(lp.x, 1.4, lp.z);
      this.scene.add(post);

      const lampHead = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), this.materials.lampGlow);
      lampHead.position.set(lp.x, 2.9, lp.z);
      this.scene.add(lampHead);

      const pLight = new THREE.PointLight(0xffb74d, 0, 9);
      pLight.position.set(lp.x, 2.9, lp.z);
      this.lightsGroup.add(pLight);
      this.nightLights.push({ light: pLight, intensity: 1.5 });
    });
  }

  buildDecorations() {
    const treePositions = [
      { x: -16, z: 4, type: 'apple' },
      { x: -17, z: -3, type: 'pine' },
      { x: -14, z: -17, type: 'pine' },
      { x: 2, z: -18, type: 'apple' },
      { x: 18, z: -14, type: 'pine' },
      { x: 19, z: 0, type: 'apple' },
      { x: 17, z: 15, type: 'pine' },
      { x: -2, z: 18, type: 'apple' }
    ];

    treePositions.forEach(tp => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tp.x, 0, tp.z);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 1.8, 8), this.materials.trunk);
      trunk.position.y = 0.9;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      if (tp.type === 'apple') {
        const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 8), this.materials.leaves);
        foliage.position.y = 2.6;
        foliage.scale.set(1.1, 0.9, 1.1);
        foliage.castShadow = true;
        treeGroup.add(foliage);

        for (let a = 0; a < 6; a++) {
          const apple = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), this.materials.strawberry);
          const angle = (a / 6) * Math.PI * 2;
          apple.position.set(Math.cos(angle) * 1.1, 2.4 + (a % 2) * 0.4, Math.sin(angle) * 1.1);
          treeGroup.add(apple);
        }
      } else {
        for (let l = 0; l < 3; l++) {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(1.6 - l * 0.35, 1.4, 7), this.materials.leaves);
          cone.position.y = 2.0 + l * 0.9;
          cone.castShadow = true;
          treeGroup.add(cone);
        }
      }

      this.scene.add(treeGroup);
    });
  }

  // --- EMPLOYEE SYSTEM (FARMER, ANIMAL CARETAKER, SHOPKEEPER) ---
  initNPCWorkers() {
    // 1. Farmer Jack (Straw Hat, Denim Overalls, Watering Can)
    const farmer = this.createStylizedWorker('farmer', 0xffe082, 0x1976d2, 0xef5350);
    farmer.position.set(5, 0, -8);
    this.workersGroup.add(farmer);

    // 2. Animal Caretaker Maya (Bandana, Yellow Dungarees, Feed Bucket)
    const rancher = this.createStylizedWorker('rancher', 0xe91e63, 0xfbc02d, 0x4caf50);
    rancher.position.set(-6, 0, -14);
    this.workersGroup.add(rancher);

    // 3. Shopkeeper Leo (Cap, White Shirt, Brown Apron)
    const merchant = this.createStylizedWorker('merchant', 0x5d4037, 0x795548, 0xffffff);
    merchant.position.set(6, 0, 11);
    this.workersGroup.add(merchant);

    this.npcWorkers = {
      farmer: {
        type: 'farmer',
        mesh: farmer,
        target: { x: 5, z: -8 },
        waypoints: [{ x: 5, z: -8 }, { x: 11, z: -8 }, { x: 17, z: -8 }, { x: 11, z: -14 }],
        currentWP: 0,
        actionTimer: 0,
        state: 'walk'
      },
      rancher: {
        type: 'rancher',
        mesh: rancher,
        target: { x: -6, z: -14 },
        waypoints: [{ x: -6, z: -14 }, { x: -13, z: -14 }, { x: -14, z: -6 }, { x: -6, z: -10 }],
        currentWP: 0,
        actionTimer: 0,
        state: 'walk'
      },
      merchant: {
        type: 'merchant',
        mesh: merchant,
        target: { x: 6, z: 11 },
        waypoints: [{ x: 6, z: 11 }],
        currentWP: 0,
        actionTimer: 0,
        state: 'idle'
      }
    };
  }

  createStylizedWorker(type, hatColor, pantsColor, shirtColor) {
    const group = new THREE.Group();
    group.scale.set(0.85, 0.85, 0.85);

    const hatMat = new THREE.MeshLambertMaterial({ color: hatColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: pantsColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: shirtColor });

    // Hips & Legs
    const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.7, 8), pantsMat);
    legs.position.y = 0.35;
    legs.castShadow = true;
    group.add(legs);

    // Torso & Shirt
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.3), shirtMat);
    torso.position.y = 0.95;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), this.materials.skinTone);
    head.position.y = 1.4;
    group.add(head);

    // Hat / Cap
    if (type === 'farmer') {
      const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 12), hatMat);
      hatBrim.position.y = 1.55;
      group.add(hatBrim);

      const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.25, 10), hatMat);
      hatCrown.position.y = 1.7;
      group.add(hatCrown);
    } else if (type === 'rancher') {
      const bandana = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 6, 12), hatMat);
      bandana.position.y = 1.5;
      bandana.rotation.x = Math.PI / 2;
      group.add(bandana);
    } else {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), hatMat);
      cap.position.y = 1.5;
      group.add(cap);
    }

    return group;
  }

  // --- CUSTOMER NPCs VISITING MARKET ---
  initCustomerNPCs() {
    for (let c = 0; c < 2; c++) {
      const cust = this.createStylizedWorker('customer', 0x9c27b0, 0x3f51b5, 0x00bcd4);
      cust.position.set(0, 0, 20 + c * 6);
      this.customersGroup.add(cust);

      this.customers.push({
        mesh: cust,
        state: 'walking_to_shop', // 'walking_to_shop', 'shopping', 'leaving'
        timer: 0,
        speed: 2.2 + Math.random() * 0.5
      });
    }
  }

  // Update Environment, Animals, Tractor, Lights, Workers & Weather-Influenced Crops
  update(delta, isNight, gameState, weatherSystem = null) {
    // 1. Windmill Spin
    if (this.windmillBlades) {
      this.windmillBlades.rotation.z += delta * 1.2;
    }

    // 2. Day-Night Lighting Adjustments
    this.nightLights.forEach(item => {
      const targetInt = isNight ? item.intensity : 0;
      item.light.intensity += (targetInt - item.light.intensity) * delta * 3.0;
    });

    // 3. Animal Behaviors (Grazing vs Sleeping & Baby Hops) & Breeding Nursery
    this.animals.forEach(pen => {
      // Nursery breeding visualization
      const isBreeding = gameState && gameState.activeBreedings && gameState.activeBreedings.some(b => b.penType === pen.type);
      if (pen.nurseryGroup) {
        pen.nurseryGroup.visible = !!isBreeding;
        if (isBreeding && pen.nurseryHeart) {
          const ht = Date.now() * 0.004;
          pen.nurseryHeart.rotation.y += delta * 2.5;
          pen.nurseryHeart.position.y = 0.55 + Math.sin(ht) * 0.12;
          const hScale = 1.0 + Math.sin(ht * 2) * 0.15;
          pen.nurseryHeart.scale.set(hScale, hScale, hScale);
        }
      }

      if (pen.unlocked) {
        pen.animals.forEach((item, idx) => {
          const t = Date.now() * 0.002 + idx * 2.0;
          const isBaby = item.data && item.data.isBaby;

          if (isNight) {
            // Animals lie down on the grass and sleep
            item.mesh.position.y = Math.max(-0.25, item.mesh.position.y - delta * 0.5);
            item.mesh.rotation.z = Math.sin(t * 0.3) * 0.05 + 0.1;
            item.mesh.rotation.x = 0.1;
            item.bubble.visible = true;
            item.bubble.position.y = (isBaby ? 1.0 : 1.6) + Math.sin(t * 1.5) * 0.12;
          } else {
            // Wake up, stand, and graze
            let targetY = 0;
            if (isBaby) {
              // Cute energetic baby hopping
              targetY = Math.abs(Math.sin(t * 3.5)) * 0.16;
            }
            item.mesh.position.y = targetY;
            item.mesh.rotation.z = 0;
            item.mesh.rotation.x = 0;
            item.mesh.rotation.y = Math.sin(t * 0.7) * 0.35;
            item.bubble.visible = false;
          }
        });
      }
    });

    // 4. Crop Growth (Dynamically influenced by Weather System)
    const weatherMult = (weatherSystem && weatherSystem.getGrowthMultiplier) ? weatherSystem.getGrowthMultiplier() : 1.0;
    this.plots.forEach(plot => {
      if (plot.unlocked && plot.growth < 1.0) {
        plot.growth = Math.min(1.0, plot.growth + delta * plot.growthSpeed * weatherMult);
        const stage = 0.3 + plot.growth * 0.7;
        plot.crops.forEach(crop => {
          crop.scale.set(stage, stage, stage);
          crop.position.y = 0.18 * stage;
        });
        if (plot.growth >= 1.0) {
          plot.ready = true;
        }
      }
    });

    // 5. Tractor Auto-Farming AI
    if (gameState && gameState.tractorUnlocked && this.tractorGroup) {
      this.tractorGroup.visible = true;
      const targetWP = this.tractorWaypoints[this.currentTractorWP];
      const tPos = this.tractorGroup.position;
      const dir = new THREE.Vector3(targetWP.x - tPos.x, 0, targetWP.z - tPos.z);
      const dist = dir.length();

      if (dist > 0.4) {
        dir.normalize();
        const moveSpeed = 3.6 * (gameState.tractorLevel || 1);
        tPos.addScaledVector(dir, moveSpeed * delta);

        // Smooth steering angle
        const targetRot = Math.atan2(dir.x, dir.z);
        let diff = targetRot - this.tractorGroup.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.tractorGroup.rotation.y += diff * 6.0 * delta;

        // Rotate wheels
        this.tractorWheels.forEach(w => {
          w.rotation.x += delta * 12.0;
        });

      } else {
        // Arrived at plot: Harvest / Plant action
        this.tractorActionTimer += delta;
        if (this.tractorActionTimer >= 1.2) {
          this.tractorActionTimer = 0;
          this.currentTractorWP = (this.currentTractorWP + 1) % this.tractorWaypoints.length;

          // Auto-harvest current plot
          const currentPlot = this.plots[this.currentTractorWP];
          if (currentPlot && currentPlot.unlocked && currentPlot.ready) {
            currentPlot.growth = 0.1;
            currentPlot.ready = false;
            gameState.addCoins(30 * (gameState.tractorLevel || 1));
            gameState.addItem(currentPlot.type, 2);
          }
        }
      }
    } else if (this.tractorGroup) {
      // Parked
      this.tractorGroup.position.set(8, 0, -4);
      this.tractorGroup.rotation.y = 0;
    }

    // 6. NPC Workers AI (Farmer & Caretaker)
    if (gameState && this.npcWorkers) {
      // Farmer Jack
      const farmerData = this.npcWorkers.farmer;
      farmerData.mesh.visible = gameState.workers.farmer.hired;
      if (gameState.workers.farmer.hired) {
        const wp = farmerData.waypoints[farmerData.currentWP];
        const fPos = farmerData.mesh.position;
        const dir = new THREE.Vector3(wp.x - fPos.x, 0, wp.z - fPos.z);
        const dist = dir.length();

        if (dist > 0.3) {
          dir.normalize();
          fPos.addScaledVector(dir, 2.4 * delta);
          farmerData.mesh.rotation.y = Math.atan2(dir.x, dir.z);
          farmerData.mesh.position.y = Math.abs(Math.sin(Date.now() * 0.008)) * 0.08;
        } else {
          farmerData.actionTimer += delta;
          if (farmerData.actionTimer > 2.0) {
            farmerData.actionTimer = 0;
            farmerData.currentWP = (farmerData.currentWP + 1) % farmerData.waypoints.length;
          }
        }
      }

      // Caretaker Maya
      const rancherData = this.npcWorkers.rancher;
      rancherData.mesh.visible = gameState.workers.rancher.hired;
      if (gameState.workers.rancher.hired) {
        const wp = rancherData.waypoints[rancherData.currentWP];
        const rPos = rancherData.mesh.position;
        const dir = new THREE.Vector3(wp.x - rPos.x, 0, wp.z - rPos.z);
        const dist = dir.length();

        if (dist > 0.3) {
          dir.normalize();
          rPos.addScaledVector(dir, 2.2 * delta);
          rancherData.mesh.rotation.y = Math.atan2(dir.x, dir.z);
          rancherData.mesh.position.y = Math.abs(Math.sin(Date.now() * 0.008)) * 0.08;
        } else {
          rancherData.actionTimer += delta;
          if (rancherData.actionTimer > 2.5) {
            rancherData.actionTimer = 0;
            rancherData.currentWP = (rancherData.currentWP + 1) % rancherData.waypoints.length;
          }
        }
      }

      // Shopkeeper Leo
      const merchantData = this.npcWorkers.merchant;
      merchantData.mesh.visible = gameState.workers.merchant.hired;
      if (gameState.workers.merchant.hired) {
        merchantData.mesh.rotation.y = Math.sin(Date.now() * 0.002) * 0.2;
      }
    }

    // 7. Customer NPCs walking to Market
    this.customers.forEach((cust, idx) => {
      const cPos = cust.mesh.position;

      if (cust.state === 'walking_to_shop') {
        const targetZ = 13.5 + idx * 1.5;
        const targetX = 6.0;
        const dir = new THREE.Vector3(targetX - cPos.x, 0, targetZ - cPos.z);
        const dist = dir.length();

        if (dist > 0.3) {
          dir.normalize();
          cPos.addScaledVector(dir, cust.speed * delta);
          cust.mesh.rotation.y = Math.atan2(dir.x, dir.z);
          cust.mesh.position.y = Math.abs(Math.sin(Date.now() * 0.006 + idx)) * 0.06;
        } else {
          cust.state = 'shopping';
          cust.timer = 0;
        }

      } else if (cust.state === 'shopping') {
        cust.timer += delta;
        cust.mesh.rotation.y = 0; // facing shop counter

        if (cust.timer > 3.5) {
          cust.state = 'leaving';
          if (gameState && gameState.workers.merchant.hired) {
            gameState.addCoins(40);
          }
        }

      } else if (cust.state === 'leaving') {
        cPos.z += cust.speed * delta;
        cust.mesh.rotation.y = Math.PI;
        cust.mesh.position.y = Math.abs(Math.sin(Date.now() * 0.006 + idx)) * 0.06;

        if (cPos.z > 28) {
          cPos.set(0, 0, 22 + idx * 5);
          cust.state = 'walking_to_shop';
        }
      }
    });
  }
}

window.FarmWorld = FarmWorld;
