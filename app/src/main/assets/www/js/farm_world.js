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
      strawGolden: new THREE.MeshLambertMaterial({ color: 0xfbc02d }),
      heartPink: new THREE.MeshBasicMaterial({ color: 0xff4081 }),
      buffaloHide: new THREE.MeshLambertMaterial({ color: 0x2b2b2b }),
      buffaloHorn: new THREE.MeshLambertMaterial({ color: 0x141414 }),
      goatWhite: new THREE.MeshLambertMaterial({ color: 0xf5eedc }),
      goatBrown: new THREE.MeshLambertMaterial({ color: 0x8d6e63 }),
      goatHorn: new THREE.MeshLambertMaterial({ color: 0x424242 }),
      horseBrown: new THREE.MeshLambertMaterial({ color: 0x6d4c41 }),
      horseMane: new THREE.MeshLambertMaterial({ color: 0x3e2723 }),
      horseBlack: new THREE.MeshLambertMaterial({ color: 0x212121 }),
      horseWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
      horseGold: new THREE.MeshLambertMaterial({ color: 0xffd54f }),
      dogGolden: new THREE.MeshLambertMaterial({ color: 0xd79a47 }),
      dogCollar: new THREE.MeshLambertMaterial({ color: 0xd32f2f }),
      dogNose: new THREE.MeshLambertMaterial({ color: 0x111111 }),
      coopWood: new THREE.MeshLambertMaterial({ color: 0xa1887f }),
      equestrianWhite: new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
      rockGrey: new THREE.MeshLambertMaterial({ color: 0x78909c }),
      chickenWire: new THREE.MeshLambertMaterial({ color: 0x90a4ae }),
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
      skinTone: new THREE.MeshLambertMaterial({ color: 0xb88265 }),
      pineGreen: new THREE.MeshLambertMaterial({ color: 0x1b5e20 }),
      mountainGrey: new THREE.MeshLambertMaterial({ color: 0x546e7a }),
      mountainSnow: new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
      mountainRock: new THREE.MeshLambertMaterial({ color: 0x37474f }),
      crystalOre: new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.85 }),
      goldOre: new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.9 }),
      campfireWood: new THREE.MeshLambertMaterial({ color: 0x3e2723 }),
      campfireGlow: new THREE.MeshBasicMaterial({ color: 0xff3d00 }),
      bridgeWood: new THREE.MeshLambertMaterial({ color: 0x6d4c41 }),
      waterSparkle: new THREE.MeshLambertMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.85 }),
      waterDeep: new THREE.MeshLambertMaterial({ color: 0x0288d1, transparent: true, opacity: 0.9 }),
      lilyPad: new THREE.MeshLambertMaterial({ color: 0x33691e }),
      sproutGreen: new THREE.MeshLambertMaterial({ color: 0x8bc34a }),
      bikeRed: new THREE.MeshLambertMaterial({ color: 0xe53935 }),
      pickupBlue: new THREE.MeshLambertMaterial({ color: 0x1e88e5 }),
      buggyOrange: new THREE.MeshLambertMaterial({ color: 0xff6f00 }),
      sedanTeal: new THREE.MeshLambertMaterial({ color: 0x00838f }),
      quadGreen: new THREE.MeshLambertMaterial({ color: 0x33691e }),
      asphalt: new THREE.MeshLambertMaterial({ color: 0x2e353b }),
      roadLine: new THREE.MeshBasicMaterial({ color: 0xffeb3b }),
      crosswalk: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      tentCloth: new THREE.MeshLambertMaterial({ color: 0xd84315 }),
      brickWall: new THREE.MeshLambertMaterial({ color: 0xb71c1c }),
      roofBlue: new THREE.MeshLambertMaterial({ color: 0x1565c0 }),
      roofRed: new THREE.MeshLambertMaterial({ color: 0xc62828 }),
      gasYellow: new THREE.MeshLambertMaterial({ color: 0xfbc02d }),
      glassMat: new THREE.MeshLambertMaterial({ color: 0xb3e5fc, transparent: true, opacity: 0.65 })
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

    this.waterZones = [];
    this.fishingSpots = [];
    this.worldVehicles = [];
    this.furnitureSpots = [];

    this.buildBaseTerrain();
    this.buildNorthTownVillage();
    this.buildForestArea();
    this.buildMountainRange();
    this.buildRiverAndLakes();
    this.buildWorldVehicles();
    this.buildFarmHouse(1);
    this.buildCropPlots();
    this.buildAnimalPens();
    this.buildCropFences();
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
    // 1. Massive 600x600 Expansive Green Open World Canvas
    const groundGeo = new THREE.PlaneGeometry(600, 600, 30, 30);
    const groundMesh = new THREE.Mesh(groundGeo, this.materials.grass);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.02;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);

    // 2. Central Farm Island Plateau
    const islandGeo = new THREE.CylinderGeometry(38, 42, 2.8, 36);
    const islandMesh = new THREE.Mesh(islandGeo, this.materials.grass);
    islandMesh.position.y = -1.4;
    islandMesh.receiveShadow = true;
    this.scene.add(islandMesh);

    // 3. Paved Main Highway Road Network (GTA-Style Multi-lane Roads)
    const roadGroup = new THREE.Group();

    // North-South Main Highway (Farm to North Town: X: 4, Z: -150 to +250)
    const nsHighway = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.05, 400), this.materials.asphalt);
    nsHighway.position.set(4, 0.02, 50);
    nsHighway.receiveShadow = true;
    roadGroup.add(nsHighway);

    // North-South Yellow Center Dashed Lines
    for (let lz = -140; lz <= 240; lz += 8) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 4.0), this.materials.roadLine);
      line.position.set(4, 0.04, lz);
      roadGroup.add(line);
    }

    // East-West Town Boulevard (Crosses North Town: Z: 85, X: -180 to +180)
    const ewTownRoad = new THREE.Mesh(new THREE.BoxGeometry(360, 0.05, 8.5), this.materials.asphalt);
    ewTownRoad.position.set(0, 0.02, 85);
    ewTownRoad.receiveShadow = true;
    roadGroup.add(ewTownRoad);

    // East-West Yellow Center Dashed Lines
    for (let lx = -170; lx <= 170; lx += 8) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.06, 0.3), this.materials.roadLine);
      line.position.set(lx, 0.04, 85);
      roadGroup.add(line);
    }

    // Highway Intersection Crosswalks
    [-4, 4].forEach(offset => {
      for (let s = -3.5; s <= 3.5; s += 1.0) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 2.5), this.materials.crosswalk);
        stripe.position.set(4 + s, 0.04, 85 + offset * 1.5);
        roadGroup.add(stripe);
      }
    });

    this.scene.add(roadGroup);

    // 4. Cobblestone & Dirt Pathways Connecting Zones
    const paths = [
      { x: 0, z: 0, w: 2.8, h: 32, rot: 0 }, // North-South farm lane
      { x: 2, z: 1, w: 32, h: 2.8, rot: 0 }, // East-West crossroad
      { x: -5, z: -3, w: 2.2, h: 10, rot: 0.4 },
      { x: 8, z: 8, w: 2.0, h: 12, rot: -0.2 },
      { x: 6, z: 14, w: 2.6, h: 10, rot: 0 }, // Path leading to Roadside Market
      { x: -18, z: -15, w: 2.4, h: 42, rot: 0.5 }, // Trail leading toward North-West Pine Forest
      { x: 25, z: -5, w: 2.4, h: 38, rot: -0.4 }, // Trail leading up into Eastern Mountain Range
      { x: -14, z: 8, w: 2.4, h: 24, rot: 1.1 }, // Pathway connecting Farm to River Fishing Pier
      { x: 4, z: 45, w: 3.2, h: 55, rot: 0 }, // Scenic connection from farm to highway
      { x: 38, z: 65, w: 2.5, h: 50, rot: -0.6 }, // Mountain Pass winding trail
      { x: -32, z: 55, w: 2.8, h: 45, rot: 0.7 } // Lakeside Watermill trail
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

  // ----------------------------------------------------
  // MASSIVE EXPANDED WORLD: NORTH TOWN VILLAGE & PLAZA
  // ----------------------------------------------------
  buildNorthTownVillage() {
    this.townGroup = new THREE.Group();

    // 1. Town Central Plaza (X: 4, Z: 110)
    const plazaGeo = new THREE.CylinderGeometry(18, 19, 0.1, 28);
    const plaza = new THREE.Mesh(plazaGeo, this.materials.stonePath);
    plaza.position.set(4, 0.05, 110);
    plaza.receiveShadow = true;
    this.townGroup.add(plaza);

    // Central Multi-Tiered Water Fountain
    const fBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 0.6, 18), this.materials.rockGrey);
    fBase.position.set(4, 0.35, 110);
    this.townGroup.add(fBase);

    const fWater = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.1, 18), this.materials.waterSparkle);
    fWater.position.set(4, 0.65, 110);
    this.townGroup.add(fWater);

    const fPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 2.2, 12), this.materials.rockGrey);
    fPillar.position.set(4, 1.4, 110);
    this.townGroup.add(fPillar);

    const fBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.2, 0.4, 14), this.materials.rockGrey);
    fBowl.position.set(4, 2.2, 110);
    this.townGroup.add(fBowl);

    const fTopWater = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), this.materials.waterDeep);
    fTopWater.position.set(4, 2.6, 110);
    this.townGroup.add(fTopWater);

    // 4 Plaza Park Benches (Interactive Sit Spots!)
    const benchAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    benchAngles.forEach(ang => {
      const bx = 4 + Math.cos(ang) * 9.5;
      const bz = 110 + Math.sin(ang) * 9.5;
      const bench = new THREE.Group();
      bench.position.set(bx, 0, bz);
      bench.rotation.y = ang + Math.PI / 2;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.6), this.materials.woodPlank);
      seat.position.y = 0.5;
      bench.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.1), this.materials.woodPlank);
      back.position.set(0, 0.85, -0.28);
      bench.add(back);

      [-1.0, 1.0].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.5), this.materials.tractorMetal);
        leg.position.set(lx, 0.25, 0);
        bench.add(leg);
      });

      this.townGroup.add(bench);

      // Register interactive sit spot
      this.furnitureSpots.push({
        type: 'sit',
        name: 'Town Plaza Park Bench',
        x: bx,
        y: 0,
        z: bz,
        rot: ang + Math.PI / 2
      });
    });

    // 2. Gas & Repair Service Station (X: 28, Z: 78)
    const gasStation = new THREE.Group();
    gasStation.position.set(28, 0, 78);

    // Canopy Roof
    const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 9), this.materials.gasYellow);
    canopyRoof.position.set(0, 4.5, 0);
    canopyRoof.castShadow = true;
    gasStation.add(canopyRoof);

    // Canopy Support Pillars
    [[-5.5, -3], [5.5, -3], [-5.5, 3], [5.5, 3]].forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4.5, 8), this.materials.tractorMetal);
      pillar.position.set(px, 2.25, pz);
      pillar.castShadow = true;
      gasStation.add(pillar);
    });

    // 2 Fuel Pumps
    [-2.8, 2.8].forEach(fx => {
      const pump = new THREE.Group();
      pump.position.set(fx, 0, 0);

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.8, 0.7), this.materials.tractorRed);
      body.position.y = 0.9;
      pump.add(body);

      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.75), this.materials.glassMat);
      screen.position.set(0, 1.25, 0);
      pump.add(screen);

      gasStation.add(pump);
    });

    // Gas Station Store Building
    const storeBody = new THREE.Mesh(new THREE.BoxGeometry(10, 4.0, 6), this.materials.stonePath);
    storeBody.position.set(0, 2.0, -8.0);
    storeBody.castShadow = true;
    gasStation.add(storeBody);

    const storeRoof = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.4, 6.6), this.materials.roofRed);
    storeRoof.position.set(0, 4.2, -8.0);
    gasStation.add(storeRoof);

    this.townGroup.add(gasStation);

    // 3. Five Town Cottages & Houses
    const townHouses = [
      { x: -18, z: 92, rot: 0.2, wallMat: this.materials.houseWall, roofMat: this.materials.roofBlue, name: 'Blue Horizon Cottage' },
      { x: -22, z: 120, rot: -0.3, wallMat: this.materials.brickWall, roofMat: this.materials.roofRed, name: 'Red Brick Manor' },
      { x: 26, z: 118, rot: 0.4, wallMat: this.materials.woodLight, roofMat: this.materials.roofOrange, name: 'Sunny Timber Villa' },
      { x: -14, z: 66, rot: 0, wallMat: this.materials.woodPlank, roofMat: this.materials.roofWood, name: 'Maple Wood Cabin' },
      { x: 32, z: 96, rot: -0.5, wallMat: this.materials.houseWall, roofMat: this.materials.roofDark, name: 'Town General Store' }
    ];

    townHouses.forEach(h => {
      const house = new THREE.Group();
      house.position.set(h.x, 0, h.z);
      house.rotation.y = h.rot;

      // House Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.2, 5.5), h.wallMat);
      body.position.y = 2.1;
      body.castShadow = true;
      house.add(body);

      // Gabled Roof
      const roof = new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.6, 4), h.roofMat);
      roof.position.y = 5.2;
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1.1, 1.0, 0.9);
      roof.castShadow = true;
      house.add(roof);

      // Front Door
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.1), this.materials.woodDark);
      door.position.set(0, 1.1, 2.8);
      house.add(door);

      // Windows
      [-2.0, 2.0].forEach(wx => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.1), this.materials.glassMat);
        win.position.set(wx, 2.4, 2.8);
        house.add(win);
      });

      // Brick Chimney
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 0.8), this.materials.brickWall);
      chimney.position.set(2.2, 5.2, -1.2);
      house.add(chimney);

      // Front Porch Bench / Chair (Interactive Sit Spot!)
      const chair = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.6), this.materials.woodPlank);
      chair.position.set(-2.2, 0.4, 3.4);
      house.add(chair);

      this.furnitureSpots.push({
        type: 'sit',
        name: h.name + ' Porch Chair',
        x: h.x - Math.cos(h.rot) * 2.2,
        y: 0,
        z: h.z + Math.sin(h.rot) * 3.4,
        rot: h.rot
      });

      this.townGroup.add(house);
    });

    this.scene.add(this.townGroup);
  }

  // ----------------------------------------------------
  // MASSIVE EXPANDED WORLD: 1. DENSE NORTH-WEST FOREST & CAMP
  // ----------------------------------------------------
  buildForestArea() {
    this.forestGroup = new THREE.Group();

    // Forest floor patches (dark mossy grass)
    const forestFloorGeo = new THREE.CylinderGeometry(55, 58, 0.1, 28);
    const forestFloor = new THREE.Mesh(forestFloorGeo, this.materials.grassDark);
    forestFloor.position.set(-60, 0.01, -65);
    this.forestGroup.add(forestFloor);

    // 50+ Forest Trees (Tall Conifer Pines, Spreading Oaks, Birch Trees)
    const treeCoords = [
      [-35, -45], [-42, -48], [-38, -58], [-48, -52], [-55, -45], [-62, -50],
      [-30, -65], [-45, -68], [-52, -72], [-65, -62], [-72, -55], [-78, -68],
      [-36, -80], [-48, -84], [-58, -82], [-68, -78], [-80, -82], [-88, -70],
      [-28, -52], [-50, -60], [-64, -68], [-74, -75], [-40, -92], [-54, -96],
      [-65, -90], [-76, -88], [-85, -85], [-92, -78], [-32, -74], [-44, -76],
      [-58, -55], [-70, -48], [-82, -58], [-48, -40], [-60, -38], [-72, -42],
      [-25, -60], [-35, -70], [-85, -62], [-90, -52], [-60, -75], [-75, -65],
      [-100, -60], [-105, -75], [-95, -90], [-80, -100], [-65, -105], [-50, -108]
    ];

    treeCoords.forEach(([x, z], idx) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      if (idx % 3 === 0) {
        // Tall Conifer Pine Tree
        const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 3.2, 6);
        const trunk = new THREE.Mesh(trunkGeo, this.materials.trunk);
        trunk.position.y = 1.6;
        trunk.castShadow = true;
        tree.add(trunk);

        // 3 Layered Pine Needles Cones
        [
          { r: 2.2, h: 2.6, y: 3.2 },
          { r: 1.7, h: 2.2, y: 4.8 },
          { r: 1.2, h: 1.8, y: 6.2 }
        ].forEach(layer => {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(layer.r, layer.h, 7), this.materials.pineGreen);
          cone.position.y = layer.y;
          cone.castShadow = true;
          tree.add(cone);
        });

      } else if (idx % 3 === 1) {
        // Lush Spreading Oak Tree
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 2.4, 7);
        const trunk = new THREE.Mesh(trunkGeo, this.materials.trunk);
        trunk.position.y = 1.2;
        trunk.castShadow = true;
        tree.add(trunk);

        const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 1), this.materials.leaves);
        crown.position.y = 3.6;
        crown.scale.set(1.2, 1.0, 1.2);
        crown.castShadow = true;
        tree.add(crown);

      } else {
        // Birch / Blossom Grove Tree
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.28, 2.8, 6);
        const trunk = new THREE.Mesh(trunkGeo, this.materials.woodLight);
        trunk.position.y = 1.4;
        tree.add(trunk);

        const crown = new THREE.Mesh(new THREE.SphereGeometry(1.8, 7, 7), this.materials.leavesLight);
        crown.position.y = 3.4;
        tree.add(crown);
      }

      this.forestGroup.add(tree);
    });

    // Forest Campfire Clearing with Tents & Log Seats
    const campGroup = new THREE.Group();
    campGroup.position.set(-56, 0, -62);

    // Stone fire ring
    for (let a = 0; a < 8; a++) {
      const angle = (a / 8) * Math.PI * 2;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), this.materials.rockGrey);
      rock.position.set(Math.cos(angle) * 0.9, 0.15, Math.sin(angle) * 0.9);
      campGroup.add(rock);
    }

    // Fire logs & glowing flame
    const log1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 5), this.materials.campfireWood);
    log1.rotation.set(0.3, 0.4, 0.8);
    log1.position.y = 0.2;
    campGroup.add(log1);

    const log2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 5), this.materials.campfireWood);
    log2.rotation.set(-0.3, -0.4, -0.8);
    log2.position.y = 0.2;
    campGroup.add(log2);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.85, 6), this.materials.campfireGlow);
    flame.position.y = 0.55;
    campGroup.add(flame);

    const fireLight = new THREE.PointLight(0xff7043, 2.5, 18);
    fireLight.position.set(0, 1.2, 0);
    campGroup.add(fireLight);
    this.nightLights.push({ light: fireLight, intensity: 3.2 });

    // Wooden Log Benches for sitting around the campfire (Interactive Sit Spots!)
    [-2.2, 2.2].forEach((bz, bidx) => {
      const bench = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.4, 6), this.materials.woodPlank);
      bench.rotation.z = Math.PI / 2;
      bench.position.set(0, 0.25, bz);
      campGroup.add(bench);

      this.furnitureSpots.push({
        type: 'sit',
        name: 'Campfire Log Seat ' + (bidx + 1),
        x: -56,
        y: 0,
        z: -62 + bz,
        rot: 0
      });
    });

    // 2 Camping Canvas A-Frame Tents (with sleeping mats - Interactive Lie Down Spots!)
    [
      { x: -5.5, z: 3.5, rot: 0.6 },
      { x: 5.5, z: 3.5, rot: -0.6 }
    ].forEach((t, tidx) => {
      const tent = new THREE.Group();
      tent.position.set(t.x, 0, t.z);
      tent.rotation.y = t.rot;

      const tentMesh = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.4, 4), this.materials.tentCloth);
      tentMesh.position.y = 1.2;
      tentMesh.rotation.y = Math.PI / 4;
      tentMesh.scale.set(1.2, 1.0, 1.6);
      tentMesh.castShadow = true;
      tent.add(tentMesh);

      // Sleeping Mat inside tent (Interactive Lie Down spot!)
      const mat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 2.2), this.materials.wheatSeed);
      mat.position.set(0, 0.04, 0);
      tent.add(mat);

      campGroup.add(tent);

      this.furnitureSpots.push({
        type: 'lie',
        name: 'Tent ' + (tidx + 1) + ' Sleeping Bed',
        x: -56 + t.x,
        y: 0,
        z: -62 + t.z,
        rot: t.rot
      });
    });

    this.forestGroup.add(campGroup);
    this.scene.add(this.forestGroup);
  }

  // ----------------------------------------------------
  // MASSIVE EXPANDED WORLD: 2. ROCKY EASTERN MOUNTAIN RANGE & MINE
  // ----------------------------------------------------
  buildMountainRange() {
    this.mountainGroup = new THREE.Group();

    // 10 Mountain Peaks
    const peaks = [
      { x: 55, z: -25, r: 18, h: 22 },
      { x: 75, z: -45, r: 24, h: 32 },
      { x: 88, z: -15, r: 22, h: 28 },
      { x: 68, z: 5, r: 20, h: 26 },
      { x: 92, z: 25, r: 26, h: 34 },
      { x: 58, z: 35, r: 16, h: 18 },
      { x: 80, z: 55, r: 22, h: 25 },
      { x: 105, z: -55, r: 30, h: 42 },
      { x: 115, z: 10, r: 32, h: 46 },
      { x: 100, z: 75, r: 28, h: 36 }
    ];

    peaks.forEach(p => {
      const peakGroup = new THREE.Group();
      peakGroup.position.set(p.x, 0, p.z);

      // Rocky base cone
      const baseMesh = new THREE.Mesh(
        new THREE.ConeGeometry(p.r, p.h, 7),
        this.materials.mountainRock
      );
      baseMesh.position.y = p.h / 2;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      peakGroup.add(baseMesh);

      // Snow-capped summit
      const snowHeight = p.h * 0.32;
      const snowMesh = new THREE.Mesh(
        new THREE.ConeGeometry(p.r * 0.35, snowHeight, 7),
        this.materials.mountainSnow
      );
      snowMesh.position.y = p.h - (snowHeight / 2);
      peakGroup.add(snowMesh);

      // Mountain foot boulders & glowing crystal ore nodes
      for (let b = 0; b < 4; b++) {
        const angle = (b / 4) * Math.PI * 2 + Math.random() * 0.5;
        const dist = p.r * 0.85;
        const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + Math.random() * 1.5, 0), this.materials.rockGrey);
        boulder.position.set(Math.cos(angle) * dist, 0.8, Math.sin(angle) * dist);
        peakGroup.add(boulder);

        // Shiny blue / gold crystal ore nodes
        const crystalMat = (b % 2 === 0) ? this.materials.crystalOre : this.materials.goldOre;
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), crystalMat);
        crystal.position.set(Math.cos(angle) * (dist - 1.2), 0.7, Math.sin(angle) * (dist - 1.2));
        crystal.rotation.set(0.4, 0.5, 0.2);
        peakGroup.add(crystal);
      }

      this.mountainGroup.add(peakGroup);
    });

    // Mountain Overlook Wooden Vista Deck (X: 46, Z: -14)
    const vistaDeck = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.4, 8.0), this.materials.woodPlank);
    vistaDeck.position.set(46, 3.5, -14);
    this.mountainGroup.add(vistaDeck);

    // Vista fence railing & telescope
    const vistaRailing = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.8, 0.1), this.materials.fence);
    vistaRailing.position.set(46, 4.0, -18.0);
    this.mountainGroup.add(vistaRailing);

    // Observation Bench on Vista Deck (Interactive Sit Spot!)
    const vistaBench = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.45, 0.7), this.materials.woodPlank);
    vistaBench.position.set(46, 3.85, -12);
    this.mountainGroup.add(vistaBench);

    this.furnitureSpots.push({
      type: 'sit',
      name: 'Mountain Summit Vista Bench',
      x: 46,
      y: 3.5,
      z: -12,
      rot: Math.PI
    });

    // Alpine Mountain Chalet (X: 62, Z: -36)
    const chalet = new THREE.Group();
    chalet.position.set(62, 0, -36);

    const chBody = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 6), this.materials.woodDark);
    chBody.position.y = 2.25;
    chalet.add(chBody);

    const chRoof = new THREE.Mesh(new THREE.ConeGeometry(6.2, 3.2, 4), this.materials.roofWood);
    chRoof.position.y = 5.8;
    chRoof.rotation.y = Math.PI / 4;
    chalet.add(chRoof);

    this.mountainGroup.add(chalet);

    this.scene.add(this.mountainGroup);
  }

  // ----------------------------------------------------
  // MASSIVE EXPANDED WORLD: 3. FLOWING RIVER, LAKE & WATERMILL
  // ----------------------------------------------------
  buildRiverAndLakes() {
    this.riverGroup = new THREE.Group();

    // Curving River Segments spanning from North-West to South-West
    const riverSegments = [
      { x: -28, z: -35, w: 9.0, l: 30, rot: -0.4 },
      { x: -22, z: -10, w: 9.5, l: 28, rot: 0.1 },
      { x: -20, z: 15, w: 10.0, l: 30, rot: 0.35 },
      { x: -25, z: 42, w: 11.0, l: 32, rot: -0.2 },
      { x: -38, z: 68, w: 14.0, l: 36, rot: -0.5 },
      { x: -58, z: 95, w: 34.0, l: 50, rot: -0.6 } // Vast Sunset Lake
    ];

    riverSegments.forEach(seg => {
      const waterMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(seg.w, seg.l),
        this.materials.water
      );
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.rotation.z = seg.rot;
      waterMesh.position.set(seg.x, 0.05, seg.z);
      this.riverGroup.add(waterMesh);

      // Register water collision zone for swimming & fishing
      this.waterZones.push({
        x: seg.x,
        z: seg.z,
        radius: Math.max(seg.w, seg.l) * 0.55
      });
    });

    // 2 Wooden Footbridges crossing the river
    [
      { x: -21, z: -5, rot: 1.65 },
      { x: -22, z: 28, rot: 1.95 }
    ].forEach(br => {
      const bridge = new THREE.Group();
      bridge.position.set(br.x, 0, br.z);
      bridge.rotation.y = br.rot;

      // Bridge Arch Deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 11.5), this.materials.bridgeWood);
      deck.position.y = 0.45;
      bridge.add(deck);

      // Bridge Side Railings
      [-1.7, 1.7].forEach(rx => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 11.5), this.materials.woodDark);
        rail.position.set(rx, 0.95, 0);
        bridge.add(rail);

        [-4.5, 0, 4.5].forEach(sz => {
          const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 6), this.materials.woodDark);
          stilt.position.set(rx, -0.2, sz);
          bridge.add(stilt);
        });
      });

      this.riverGroup.add(bridge);
    });

    // 2 Wooden Fishing Docks (Pier 1 on Main River, Pier 2 on South Lake)
    const docks = [
      { x: -16.5, z: 12.0, rot: 0.4, name: 'Meadow River Pier' },
      { x: -48.0, z: 82.0, rot: -0.7, name: 'Sunset Lake Dock' }
    ];

    docks.forEach(d => {
      const dockGroup = new THREE.Group();
      dockGroup.position.set(d.x, 0, d.z);
      dockGroup.rotation.y = d.rot;

      const plank = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.22, 6.5), this.materials.woodPlank);
      plank.position.set(0, 0.25, 2.2);
      dockGroup.add(plank);

      [[-1.5, 5.2], [1.5, 5.2], [-1.5, -0.5], [1.5, -0.5]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.3, 6), this.materials.woodDark);
        post.position.set(px, 0.6, pz);
        dockGroup.add(post);
      });

      // Fishing Dock Bench (Interactive Sit Spot!)
      const dBench = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 0.5), this.materials.woodPlank);
      dBench.position.set(0, 0.5, 0.5);
      dockGroup.add(dBench);

      this.furnitureSpots.push({
        type: 'sit',
        name: d.name + ' Bench',
        x: d.x,
        y: 0,
        z: d.z,
        rot: d.rot
      });

      this.riverGroup.add(dockGroup);

      // Register official fishing interaction hot-spot
      this.fishingSpots.push({
        x: d.x + Math.sin(d.rot) * 3.5,
        z: d.z + Math.cos(d.rot) * 3.5,
        name: d.name
      });
    });

    // Lakeside Watermill Building with Spinning Waterwheel (X: -32, Z: 50)
    const watermill = new THREE.Group();
    watermill.position.set(-32, 0, 50);

    const wmBody = new THREE.Mesh(new THREE.BoxGeometry(6.5, 5.0, 5.5), this.materials.stonePath);
    wmBody.position.y = 2.5;
    watermill.add(wmBody);

    const wmRoof = new THREE.Mesh(new THREE.ConeGeometry(5.0, 2.8, 4), this.materials.roofDark);
    wmRoof.position.y = 6.4;
    wmRoof.rotation.y = Math.PI / 4;
    watermill.add(wmRoof);

    // Water Wheel Mesh
    this.waterWheel = new THREE.Group();
    this.waterWheel.position.set(3.6, 2.0, 0);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12), this.materials.woodDark);
    hub.rotation.z = Math.PI / 2;
    this.waterWheel.add(hub);

    for (let p = 0; p < 8; p++) {
      const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 3.2), this.materials.woodPlank);
      paddle.rotation.x = (p / 8) * Math.PI * 2;
      this.waterWheel.add(paddle);
    }
    watermill.add(this.waterWheel);

    this.riverGroup.add(watermill);
    this.scene.add(this.riverGroup);
  }

  // ----------------------------------------------------
  // GTA-STYLE WORLD VEHICLES FLEET & INTERACTION SYSTEM
  // ----------------------------------------------------
  buildWorldVehicles() {
    this.worldVehiclesGroup = new THREE.Group();

    // 14 Vehicles Stationed Across the Massive Open World
    const vehicleSpawns = [
      { id: 'farm_bike', type: 'bike', x: -3.5, z: -2.5, rot: 0.6, name: 'Farm Cruiser Bike' },
      { id: 'farm_tractor', type: 'tractor', x: 11.0, z: -2.5, rot: -0.2, name: 'Farm Field Tractor' },
      { id: 'market_pickup', type: 'pickup', x: 9.5, z: 16.0, rot: -Math.PI / 2, name: 'Roadside Pickup Truck' },
      { id: 'paddock_cart', type: 'cart', x: 19.5, z: -4.5, rot: 0.4, name: 'Pony Cargo Cart' },
      { id: 'gas_buggy', type: 'buggy', x: 22.0, z: 78.0, rot: 1.5, name: 'Gas Station Dune Buggy' },
      { id: 'town_sedan', type: 'sedan', x: -12.0, z: 92.0, rot: 0.1, name: 'Town Blue Sedan' },
      { id: 'mountain_quad', type: 'quad', x: 46.0, z: -14.0, rot: 2.2, name: 'Summit Quad ATV' },
      { id: 'forest_buggy', type: 'buggy', x: -58.0, z: -58.0, rot: -0.8, name: 'Campground Sand Buggy' },
      { id: 'lake_bike', type: 'bike', x: -44.0, z: 76.0, rot: 0.7, name: 'Sunset Lake Cruiser Bike' },
      { id: 'mine_pickup', type: 'pickup', x: 72.0, z: 22.0, rot: -1.2, name: 'Crystal Quarry 4x4 Pickup' },
      { id: 'plaza_sedan', type: 'sedan', x: 5.0, z: 112.0, rot: 0, name: 'Town Plaza Executive Sedan' },
      { id: 'trail_quad', type: 'quad', x: -18.0, z: -38.0, rot: 0.5, name: 'Pine Trail Quad ATV' },
      { id: 'mill_bike', type: 'bike', x: -32.0, z: 48.0, rot: -1.5, name: 'Watermill Commuter Bike' },
      { id: 'town_cart', type: 'cart', x: 35.0, z: 95.0, rot: 0.8, name: 'Town General Store Wagon' }
    ];

    vehicleSpawns.forEach(sp => {
      this.spawnWorldVehicle(sp.id, sp.type, sp.x, sp.z, sp.rot, sp.name);
    });

    this.scene.add(this.worldVehiclesGroup);
  }

  spawnWorldVehicle(id, type, x, z, rot, name) {
    const mesh = this.createVehicle3DMesh(type);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = rot || 0;
    this.worldVehiclesGroup.add(mesh);

    const vehObj = {
      id: id || ('veh_' + Date.now()),
      type: type,
      name: name || (type.toUpperCase() + ' Vehicle'),
      x: x,
      z: z,
      rot: rot || 0,
      mesh: mesh,
      active: true
    };

    this.worldVehicles.push(vehObj);
    return vehObj;
  }

  createVehicle3DMesh(type) {
    const group = new THREE.Group();

    if (type === 'bike') {
      const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), this.materials.bikeRed);
      frame.rotation.z = Math.PI / 2;
      frame.position.y = 0.55;
      group.add(frame);

      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6), this.materials.tractorMetal);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 0.95, 0.65);
      group.add(bar);

      [-0.65, 0.65].forEach(z => {
        const tire = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.045, 8, 16), this.materials.tractorTire);
        tire.rotation.y = Math.PI / 2;
        tire.position.set(0, 0.38, z);
        group.add(tire);
      });

    } else if (type === 'buggy') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 2.8), this.materials.buggyOrange);
      frame.position.y = 0.45;
      group.add(frame);

      const cage = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.5), this.materials.tractorMetal);
      cage.position.set(0, 1.05, -0.2);
      group.add(cage);

      [[-0.9, 1.0], [0.9, 1.0], [-0.9, -1.0], [0.9, -1.0]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 12), this.materials.tractorTire);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.42, wz);
        group.add(w);
      });

    } else if (type === 'sedan') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 3.4), this.materials.sedanTeal);
      body.position.y = 0.55;
      group.add(body);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.65, 1.8), this.materials.glassMat);
      cabin.position.set(0, 1.15, -0.2);
      group.add(cabin);

      [[-0.92, 1.1], [0.92, 1.1], [-0.92, -1.1], [0.92, -1.1]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.22, 12), this.materials.tractorTire);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.35, wz);
        group.add(w);
      });

    } else if (type === 'quad') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.8), this.materials.quadGreen);
      body.position.y = 0.55;
      group.add(body);

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), this.materials.tractorMetal);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(0, 0.95, 0.6);
      group.add(handle);

      [[-0.7, 0.65], [0.7, 0.65], [-0.7, -0.65], [0.7, -0.65]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12), this.materials.tractorTire);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.38, wz);
        group.add(w);
      });

    } else if (type === 'tractor') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 2.4), this.materials.tractorGreen);
      body.position.y = 1.0;
      group.add(body);

      const hood = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.4), this.materials.tractorGreen);
      hood.position.set(0, 0.9, 1.1);
      group.add(hood);

      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), this.materials.tractorMetal);
      pipe.position.set(0.45, 1.8, 1.3);
      group.add(pipe);

      // Big rear wheels, smaller front wheels
      [[-0.9, -0.6], [0.9, -0.6]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.35, 14), this.materials.tractorTire);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.7, wz);
        group.add(w);
      });
      [[-0.75, 1.1], [0.75, 1.1]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.25, 12), this.materials.tractorTire);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.45, wz);
        group.add(w);
      });

    } else if (type === 'pickup') {
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.3), this.materials.pickupBlue);
      cab.position.set(0, 0.85, 0.4);
      group.add(cab);

      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 1.4), this.materials.pickupBlue);
      bed.position.set(0, 0.65, -0.9);
      group.add(bed);

      [[-0.78, 0.75], [0.78, 0.75], [-0.78, -0.95], [0.78, -0.95]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 12), this.materials.tractorTire);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.34, wz);
        group.add(w);
      });

    } else if (type === 'cart') {
      const wagon = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1.7), this.materials.woodPlank);
      wagon.position.set(0, 0.65, 0);
      group.add(wagon);

      [[-0.72, 0], [0.72, 0]].forEach(([wx, wz]) => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 14), this.materials.woodDark);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.5, wz);
        group.add(w);
      });
    }

    return group;
  }

  // --- Proximity detection for GTA-Style vehicle entry ---
  getNearbyWorldVehicle(px, pz, maxDist = 4.5) {
    let closest = null;
    let minD = maxDist;

    for (let i = 0; i < this.worldVehicles.length; i++) {
      const v = this.worldVehicles[i];
      if (!v.active || !v.mesh.visible) continue;

      const dx = px - v.mesh.position.x;
      const dz = pz - v.mesh.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minD) {
        minD = dist;
        closest = v;
      }
    }

    return closest ? { vehicle: closest, dist: minD } : null;
  }

  enterWorldVehicle(vehObj) {
    if (!vehObj) return;
    vehObj.active = false;
    vehObj.mesh.visible = false;
  }

  leaveWorldVehicle(type, px, pz, rot) {
    // Spawn a world vehicle mesh right at the player's dismount position
    this.spawnWorldVehicle('veh_' + Date.now(), type, px, pz, rot, type.toUpperCase());
  }

  // --- Proximity detection for Interactive Sit / Lie furniture ---
  getNearbyFurniture(px, pz, maxDist = 3.5) {
    let closest = null;
    let minD = maxDist;

    for (let i = 0; i < this.furnitureSpots.length; i++) {
      const f = this.furnitureSpots[i];
      const dx = px - f.x;
      const dz = pz - f.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minD) {
        minD = dist;
        closest = f;
      }
    }

    return closest ? { spot: closest, dist: minD } : null;
  }

  // ----------------------------------------------------
  // WATER & FISHING DETECTION HELPERS
  // ----------------------------------------------------
  isPointInWater(x, z) {
    for (let i = 0; i < this.waterZones.length; i++) {
      const wz = this.waterZones[i];
      const dx = x - wz.x;
      const dz = z - wz.z;
      if (dx * dx + dz * dz < wz.radius * wz.radius) {
        return true;
      }
    }
    return false;
  }

  isNearFishingSpot(x, z) {
    for (let i = 0; i < this.fishingSpots.length; i++) {
      const spot = this.fishingSpots[i];
      const dx = x - spot.x;
      const dz = z - spot.z;
      if (dx * dx + dz * dz < 20.0) { // within 4.5m of fishing dock
        return { near: true, spot: spot };
      }
    }
    // Also check if standing along river bank
    if (this.isPointInWater(x - 2.5, z) || this.isPointInWater(x + 2.5, z) || this.isPointInWater(x, z - 2.5) || this.isPointInWater(x, z + 2.5)) {
      return { near: true, spot: { name: 'River Bank', x: x, z: z } };
    }
    return { near: false, spot: null };
  }

  buildCropFences() {
    this.cropFencesGroup = new THREE.Group();

    // Perimeter wooden fences around crop plots zone to strictly protect crops from animals!
    // Crop Zone spans X: 2.5 to 19.5, Z: -16.5 to -5.5
    const fencePosts = [
      [2.5, -5.5], [8.0, -5.5], [14.0, -5.5], [19.5, -5.5],
      [19.5, -11.0], [19.5, -16.5],
      [14.0, -16.5], [8.0, -16.5], [2.5, -16.5],
      [2.5, -11.0]
    ];

    fencePosts.forEach(([fx, fz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.1, 6), this.materials.woodDark);
      post.position.set(fx, 0.55, fz);
      this.cropFencesGroup.add(post);
    });

    // Horizontal rails
    const rails = [
      { x: 11.0, z: -5.5, w: 17.0, d: 0.08 },
      { x: 11.0, z: -16.5, w: 17.0, d: 0.08 },
      { x: 2.5, z: -11.0, w: 0.08, d: 11.0 },
      { x: 19.5, z: -11.0, w: 0.08, d: 11.0 }
    ];

    rails.forEach(r => {
      [0.4, 0.8].forEach(ry => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.08, r.d), this.materials.fence);
        rail.position.set(r.x, ry, r.z);
        this.cropFencesGroup.add(rail);
      });
    });

    this.scene.add(this.cropFencesGroup);
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

      // Spawn Multi-Stage Plant Models in a 4x4 Grid
      const cropsArray = [];
      for (let row = -1.3; row <= 1.3; row += 0.85) {
        for (let col = -1.3; col <= 1.3; col += 0.85) {
          const plantSlot = new THREE.Group();
          plantSlot.position.set(col, 0.25, row);

          // ----------------------------------------------------
          // STAGE 0: Tiny Seed Mound & Early Dual-Leaf Sprout
          // ----------------------------------------------------
          const stage0 = new THREE.Group();
          const seedMound = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.06, 6), this.materials.dirt);
          seedMound.position.y = 0.03;
          stage0.add(seedMound);

          const sproutStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.18, 5), this.materials.sproutGreen);
          sproutStem.position.y = 0.1;
          stage0.add(sproutStem);

          const leaf1 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 4), this.materials.sproutGreen);
          leaf1.rotation.z = -0.6;
          leaf1.position.set(0.04, 0.16, 0);
          stage0.add(leaf1);

          const leaf2 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 4), this.materials.sproutGreen);
          leaf2.rotation.z = 0.6;
          leaf2.position.set(-0.04, 0.16, 0);
          stage0.add(leaf2);
          plantSlot.add(stage0);

          // ----------------------------------------------------
          // STAGE 1: Growing Green Stalk / Shoot with Bushy Leaves
          // ----------------------------------------------------
          const stage1 = new THREE.Group();
          const midStalk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.42, 6), this.materials.leavesLight);
          midStalk.position.y = 0.21;
          stage1.add(midStalk);

          for (let l = 0; l < 4; l++) {
            const sideLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.12), this.materials.leaves);
            sideLeaf.position.set((l % 2 === 0 ? 0.08 : -0.08), 0.15 + l * 0.07, 0);
            sideLeaf.rotation.z = (l % 2 === 0 ? -0.5 : 0.5);
            stage1.add(sideLeaf);
          }
          stage1.visible = false;
          plantSlot.add(stage1);

          // ----------------------------------------------------
          // STAGE 2: Full Harvestable Ripe Crop
          // ----------------------------------------------------
          const stage2 = new THREE.Group();

          if (cfg.type === 'wheat') {
            const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.72, 5), this.materials.wheat);
            stalk.position.y = 0.36;
            stage2.add(stalk);

            const head = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 6), this.materials.wheat);
            head.position.y = 0.72;
            stage2.add(head);

            // Side golden awns
            for (let a = 0; a < 3; a++) {
              const awn = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 3), this.materials.wheat);
              awn.position.set((a % 2 === 0 ? 0.08 : -0.08), 0.65 + a * 0.06, 0);
              awn.rotation.z = (a % 2 === 0 ? -0.6 : 0.6);
              stage2.add(awn);
            }

          } else if (cfg.type === 'corn') {
            const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.1, 6), this.materials.corn);
            stalk.position.y = 0.55;
            stage2.add(stalk);

            const cob1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 6), this.materials.cornCob);
            cob1.position.set(0.12, 0.72, 0.05);
            cob1.rotation.z = -0.35;
            stage2.add(cob1);

            const cob2 = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 6), this.materials.cornCob);
            cob2.position.set(-0.12, 0.52, -0.05);
            cob2.rotation.z = 0.35;
            stage2.add(cob2);

          } else if (cfg.type === 'carrot') {
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.65, 6), this.materials.leavesLight);
            leaves.position.y = 0.35;
            stage2.add(leaves);

            const root = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.02, 0.42, 6), this.materials.carrot);
            root.position.y = 0.12;
            stage2.add(root);

          } else if (cfg.type === 'strawberry') {
            const bush = new THREE.Mesh(new THREE.SphereGeometry(0.34, 7, 7), this.materials.leaves);
            bush.position.y = 0.25;
            stage2.add(bush);

            [
              [0.18, 0.25, 0.18],
              [-0.18, 0.25, 0.18],
              [0.0, 0.28, -0.22]
            ].forEach(([bx, by, bz]) => {
              const berry = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 5), this.materials.strawberry);
              berry.position.set(bx, by, bz);
              stage2.add(berry);
            });

          } else if (cfg.type === 'pumpkin') {
            const pumpkin = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 6), this.materials.pumpkin);
            pumpkin.scale.set(1.25, 0.85, 1.25);
            pumpkin.position.y = 0.26;
            stage2.add(pumpkin);

            const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 4), this.materials.woodDark);
            vine.position.y = 0.52;
            stage2.add(vine);

            const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.2), this.materials.leavesLight);
            leaf.position.set(0.15, 0.48, 0.15);
            stage2.add(leaf);
          }

          stage2.visible = false;
          plantSlot.add(stage2);

          plotGroup.add(plantSlot);
          cropsArray.push({
            group: plantSlot,
            stage0: stage0,
            stage1: stage1,
            stage2: stage2
          });
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
    // 5 Distinct Animal Areas near the crop fields
    const penConfigs = [
      {
        type: 'cow_buffalo',
        name: 'Cows & Buffaloes Big Pen',
        x: 8.0,
        z: -20.5,
        w: 9.0,
        d: 6.6,
        shelterX: 0,
        shelterZ: -1.8,
        count: 4,
        unlocked: true
      },
      {
        type: 'goat',
        name: 'Meadow Goats Pen',
        x: 18.0,
        z: -20.5,
        w: 6.0,
        d: 6.0,
        shelterX: 0,
        shelterZ: -1.6,
        count: 2,
        unlocked: true
      },
      {
        type: 'chicken',
        name: 'Cluck Chickens Scratch Area',
        x: -4.0,
        z: -14.0,
        w: 4.6,
        d: 4.6,
        shelterX: 0,
        shelterZ: -1.0,
        count: 3,
        unlocked: true
      },
      {
        type: 'horse',
        name: 'Horses Equestrian Paddock',
        x: 23.5,
        z: -10.0,
        w: 6.5,
        d: 5.5,
        shelterX: 0,
        shelterZ: -1.4,
        count: 2,
        unlocked: true
      },
      {
        type: 'dog',
        name: 'Loyal Dog Kennel',
        x: -2.4,
        z: -5.8,
        w: 2.4,
        d: 2.4,
        shelterX: 0,
        shelterZ: 0,
        count: 1,
        unlocked: true
      }
    ];

    penConfigs.forEach(pen => {
      const penGroup = new THREE.Group();
      penGroup.position.set(pen.x, 0, pen.z);

      const hw = pen.w / 2;
      const hd = pen.d / 2;

      // 1. Fencing Tailored to Pen Type
      if (pen.type === 'chicken') {
        // Chicken Area: Low chicken-wire mesh fence with corner posts
        const wireMat = this.materials.chickenWire;
        const postMat = this.materials.woodDark;

        // 4 Border Wire Rails
        const r1 = new THREE.Mesh(new THREE.BoxGeometry(pen.w, 0.45, 0.04), wireMat);
        r1.position.set(0, 0.28, hd);
        penGroup.add(r1);

        const r2 = new THREE.Mesh(new THREE.BoxGeometry(pen.w, 0.45, 0.04), wireMat);
        r2.position.set(0, 0.28, -hd);
        penGroup.add(r2);

        const r3 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, pen.d), wireMat);
        r3.position.set(hw, 0.28, 0);
        penGroup.add(r3);

        const r4 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, pen.d), wireMat);
        r4.position.set(-hw, 0.28, 0);
        penGroup.add(r4);

        // Corner Posts
        [[-hw, -hd], [hw, -hd], [-hw, hd], [hw, hd]].forEach(pt => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.65, 6), postMat);
          post.position.set(pt[0], 0.32, pt[1]);
          penGroup.add(post);
        });

        // Scratch Dirt Ground
        const dirt = new THREE.Mesh(new THREE.PlaneGeometry(pen.w - 0.2, pen.d - 0.2), this.materials.soilTilled);
        dirt.rotation.x = -Math.PI / 2;
        dirt.position.y = 0.01;
        penGroup.add(dirt);

        // Scattered Corn Grain Bites
        for (let g = 0; g < 16; g++) {
          const grain = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.08), this.materials.cornCob);
          grain.position.set((Math.random() - 0.5) * (pen.w - 1.2), 0.03, (Math.random() - 0.5) * (pen.d - 1.2));
          penGroup.add(grain);
        }

      } else if (pen.type === 'horse') {
        // Equestrian Paddock: High White Post-and-Rail Fencing
        const eqMat = this.materials.equestrianWhite;
        [-hd, hd].forEach(pz => {
          const railTop = new THREE.Mesh(new THREE.BoxGeometry(pen.w, 0.08, 0.06), eqMat);
          railTop.position.set(0, 0.9, pz);
          penGroup.add(railTop);
          const railMid = new THREE.Mesh(new THREE.BoxGeometry(pen.w, 0.08, 0.06), eqMat);
          railMid.position.set(0, 0.5, pz);
          penGroup.add(railMid);
        });
        [-hw, hw].forEach(px => {
          const railTop = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, pen.d), eqMat);
          railTop.position.set(px, 0.9, 0);
          penGroup.add(railTop);
          const railMid = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, pen.d), eqMat);
          railMid.position.set(px, 0.5, 0);
          penGroup.add(railMid);
        });
        // Posts along perimeter
        for (let x = -hw; x <= hw + 0.1; x += pen.w / 3) {
          [-hd, hd].forEach(z => {
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), eqMat);
            post.position.set(x, 0.55, z);
            penGroup.add(post);
          });
        }

        // Paddock Jumping Hurdle
        const hurdle = new THREE.Group();
        hurdle.position.set(0.8, 0, 0.8);
        const hBar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.0, 8), this.materials.roofRed);
        hBar.rotation.z = Math.PI / 2;
        hBar.position.y = 0.55;
        hurdle.add(hBar);
        [-0.95, 0.95].forEach(hx => {
          const hPost = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.2), eqMat);
          hPost.position.set(hx, 0.4, 0);
          hurdle.add(hPost);
        });
        penGroup.add(hurdle);

      } else if (pen.type !== 'dog') {
        // Standard Wooden Post & Rail Fencing
        const fenceMat = this.materials.fence;
        const f1 = new THREE.Mesh(new THREE.BoxGeometry(pen.w, 0.8, 0.1), fenceMat);
        f1.position.set(0, 0.4, hd);
        penGroup.add(f1);
        const f2 = new THREE.Mesh(new THREE.BoxGeometry(pen.w, 0.8, 0.1), fenceMat);
        f2.position.set(0, 0.4, -hd);
        penGroup.add(f2);
        const f3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, pen.d), fenceMat);
        f3.position.set(hw, 0.4, 0);
        penGroup.add(f3);
        const f4 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, pen.d), fenceMat);
        f4.position.set(-hw, 0.4, 0);
        penGroup.add(f4);
      }

      // 2. Specific Shelter for Each Animal Type
      let shelterMesh = null;
      let coopDoor = null;

      if (pen.type === 'cow_buffalo') {
        // Big Shaded Shed for Cows & Buffaloes
        const shedGroup = new THREE.Group();
        shedGroup.position.set(pen.shelterX, 0, pen.shelterZ);

        // 4 Heavy Timber Support Posts
        [[-2.8, -1.2], [2.8, -1.2], [-2.8, 1.2], [2.8, 1.2]].forEach(pos => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.6, 0.24), this.materials.trunk);
          post.position.set(pos[0], 1.3, pos[1]);
          shedGroup.add(post);
        });

        // Wooden Back Plank Wall
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.4, 0.14), this.materials.woodDark);
        backWall.position.set(0, 1.2, -1.2);
        shedGroup.add(backWall);

        // Side Walls
        [-2.8, 2.8].forEach(wx => {
          const sideW = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.4, 2.4), this.materials.woodDark);
          sideW.position.set(wx, 1.2, 0);
          shedGroup.add(sideW);
        });

        // Big Shaded Roof (Corrugated Red/Brown overhang)
        const roofGeo = new THREE.BoxGeometry(6.4, 0.18, 3.2);
        const roofMesh = new THREE.Mesh(roofGeo, this.materials.roofRed);
        roofMesh.position.set(0, 2.6, 0.1);
        roofMesh.rotation.x = 0.12;
        shedGroup.add(roofMesh);

        // Shaded Ground Straw Bedding
        const strawGround = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.4), this.materials.strawBed);
        strawGround.rotation.x = -Math.PI / 2;
        strawGround.position.set(0, 0.02, 0);
        shedGroup.add(strawGround);

        // Stacked Hay Bales inside shade
        [[-1.8, -0.8], [-1.0, -0.8], [-1.4, -0.8]].forEach((hp, idx) => {
          const bale = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.65), this.materials.strawGolden);
          bale.position.set(hp[0], 0.28 + (idx === 2 ? 0.48 : 0), hp[1]);
          shedGroup.add(bale);
        });

        // Large Feed Trough in front of shed
        const trough = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.7), this.materials.woodPlank);
        trough.position.set(1.2, 0.25, 0.2);
        shedGroup.add(trough);

        penGroup.add(shedGroup);
        shelterMesh = shedGroup;

      } else if (pen.type === 'goat') {
        // Goats Pen: Rock climbing boulders + Small Covered Shelter
        // 1. Natural Climbing Mound & Rock Boulders
        const rockMound = new THREE.Group();
        rockMound.position.set(0, 0, 0.6);

        const boulder1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), this.materials.rockGrey);
        boulder1.position.set(0, 0.45, 0);
        boulder1.scale.set(1.1, 0.8, 1.0);
        rockMound.add(boulder1);

        const boulder2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 1), this.materials.rockGrey);
        boulder2.position.set(0.65, 0.3, 0.4);
        rockMound.add(boulder2);

        // Wooden Climbing Ramp for Goats
        const ramp = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 1.4), this.materials.woodPlank);
        ramp.position.set(-0.6, 0.35, 0.2);
        ramp.rotation.x = -0.35;
        ramp.rotation.y = 0.2;
        rockMound.add(ramp);
        penGroup.add(rockMound);

        // 2. Small Covered Area (Lean-to Wooden Shelter)
        const goatShelter = new THREE.Group();
        goatShelter.position.set(pen.shelterX, 0, pen.shelterZ);

        const sWallBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.9, 0.12), this.materials.woodDark);
        sWallBack.position.set(0, 0.95, -1.0);
        goatShelter.add(sWallBack);

        [-1.75, 1.75].forEach(sx => {
          const sSide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.9, 2.0), this.materials.woodDark);
          sSide.position.set(sx, 0.95, 0);
          goatShelter.add(sSide);
        });

        const sRoof = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.12, 2.3), this.materials.roofRed);
        sRoof.position.set(0, 2.0, 0.1);
        sRoof.rotation.x = 0.15;
        goatShelter.add(sRoof);

        const sBed = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.8), this.materials.strawBed);
        sBed.rotation.x = -Math.PI / 2;
        sBed.position.set(0, 0.02, 0);
        goatShelter.add(sBed);

        penGroup.add(goatShelter);
        shelterMesh = goatShelter;

      } else if (pen.type === 'chicken') {
        // Proper Chicken Coop: Elevated on Stilts + Ramp + Nesting Boxes + Animated Door
        const coopGroup = new THREE.Group();
        coopGroup.position.set(pen.shelterX, 0, pen.shelterZ);

        // 4 Stilts
        [[-0.95, -0.8], [0.95, -0.8], [-0.95, 0.8], [0.95, 0.8]].forEach(sp => {
          const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6), this.materials.woodDark);
          stilt.position.set(sp[0], 0.3, sp[1]);
          coopGroup.add(stilt);
        });

        // Coop House Body
        const coopBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.4, 1.7), this.materials.coopWood);
        coopBody.position.set(0, 1.3, 0);
        coopGroup.add(coopBody);

        // Red Gable Roof
        const coopRoof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.0, 4), this.materials.roofRed);
        coopRoof.rotation.y = Math.PI / 4;
        coopRoof.position.set(0, 2.45, 0);
        coopRoof.scale.set(1.2, 0.9, 1.0);
        coopGroup.add(coopRoof);

        // Rooster Weather Vane on Roof Peak
        const vanePole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), this.materials.coinGold);
        vanePole.position.set(0, 3.05, 0);
        coopGroup.add(vanePole);
        const vaneRooster = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.04), this.materials.roofRed);
        vaneRooster.position.set(0, 3.25, 0);
        coopGroup.add(vaneRooster);

        // Side Nesting Box with eggs
        const nestBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1.1), this.materials.woodDark);
        nestBox.position.set(1.25, 1.1, 0);
        coopGroup.add(nestBox);

        // Wooden Chicken Ramp / Ladder leading up to doorway
        const rampGroup = new THREE.Group();
        rampGroup.position.set(0, 0, 0.85);
        const rampPlank = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 1.4), this.materials.woodPlank);
        rampPlank.position.set(0, 0.3, 0.65);
        rampPlank.rotation.x = 0.42;
        rampGroup.add(rampPlank);

        // Cleats on ramp
        for (let c = 0; c < 4; c++) {
          const cleat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.04), this.materials.woodDark);
          cleat.position.set(0, 0.15 + c * 0.1, 0.3 + c * 0.25);
          cleat.rotation.x = 0.42;
          rampGroup.add(cleat);
        }
        coopGroup.add(rampGroup);

        // Animated Hinged Coop Door
        const doorPivot = new THREE.Group();
        doorPivot.position.set(-0.35, 0.6, 0.86);

        const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.06), this.materials.woodDark);
        doorMesh.position.set(0.35, 0.4, 0);
        doorPivot.add(doorMesh);

        // Wooden Latch Bar
        const latchBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.08), this.materials.roofRed);
        latchBar.position.set(0.35, 0.4, 0.04);
        doorPivot.add(latchBar);

        // Open initially in daytime
        doorPivot.rotation.y = Math.PI * 0.45;
        coopGroup.add(doorPivot);
        coopDoor = doorPivot;

        penGroup.add(coopGroup);
        shelterMesh = coopGroup;

      } else if (pen.type === 'horse') {
        // Horse Stable Covered Stall
        const horseStable = new THREE.Group();
        horseStable.position.set(pen.shelterX, 0, pen.shelterZ);

        [[-1.9, -1.0], [1.9, -1.0], [-1.9, 1.0], [1.9, 1.0]].forEach(pp => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.7, 0.2), this.materials.woodDark);
          post.position.set(pp[0], 1.35, pp[1]);
          horseStable.add(post);
        });

        const sBack = new THREE.Mesh(new THREE.BoxGeometry(3.9, 2.5, 0.12), this.materials.woodPlank);
        sBack.position.set(0, 1.25, -1.0);
        horseStable.add(sBack);

        const sRoof = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.18, 2.4), this.materials.roofRed);
        sRoof.position.set(0, 2.75, 0.1);
        sRoof.rotation.x = 0.12;
        horseStable.add(sRoof);

        // Water Trough
        const trough = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.8), this.materials.stonePath);
        trough.position.set(1.0, 0.25, 0.4);
        horseStable.add(trough);

        penGroup.add(horseStable);
        shelterMesh = horseStable;

      } else if (pen.type === 'dog') {
        // Dog Kennel (Doghouse)
        const kennelGroup = new THREE.Group();
        kennelGroup.position.set(0, 0, 0);

        // Wooden Cabin Body
        const kBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.9, 1.3), this.materials.woodPlank);
        kBody.position.y = 0.45;
        kennelGroup.add(kBody);

        // Peaked Roof
        const kRoof = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.75, 4), this.materials.roofRed);
        kRoof.rotation.y = Math.PI / 4;
        kRoof.position.y = 1.25;
        kennelGroup.add(kRoof);

        // Arched Door Opening
        const kDoor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.1), this.materials.woodDark);
        kDoor.position.set(0, 0.35, 0.66);
        kennelGroup.add(kDoor);

        // "DOG" Sign
        const kSign = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 0.04), this.materials.woodLight);
        kSign.position.set(0, 0.75, 0.68);
        kennelGroup.add(kSign);

        // Water Dish & Bone in front
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.1, 10), this.materials.equestrianWhite);
        dish.position.set(0.65, 0.05, 0.85);
        kennelGroup.add(dish);

        const bone = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.06), this.materials.equestrianWhite);
        bone.position.set(-0.65, 0.03, 0.85);
        kennelGroup.add(bone);

        penGroup.add(kennelGroup);
        shelterMesh = kennelGroup;
      }

      // 3. Nursery Nest / Cradle for active breeding & newborn babies
      const nurseryGroup = new THREE.Group();
      nurseryGroup.position.set(-hw + 1.2, 0.05, -hd + 1.2);

      const nestBase = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 0.16, 12), this.materials.strawBed);
      nurseryGroup.add(nestBase);

      const heartMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), this.materials.heartPink);
      heartMesh.position.set(0, 0.55, 0);
      nurseryGroup.add(heartMesh);

      nurseryGroup.visible = false;
      penGroup.add(nurseryGroup);

      this.scene.add(penGroup);

      this.animals.push({
        ...pen,
        group: penGroup,
        shelterMesh: shelterMesh,
        coopDoor: coopDoor,
        nurseryGroup: nurseryGroup,
        nurseryHeart: heartMesh,
        animals: [],
        productTimer: 0,
        productInterval: pen.type === 'chicken' ? 6 : pen.type === 'goat' ? 8 : pen.type === 'horse' ? 14 : 10
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
      const penAnimals = animalsData.filter(a => {
        if (pen.type === 'cow_buffalo') return a.penType === 'cow_buffalo' || a.penType === 'cow';
        return a.penType === pen.type;
      });
      pen.animals = [];

      penAnimals.forEach((anim, idx) => {
        let animalMesh;
        if (anim.type === 'buffalo') {
          animalMesh = this.createBuffalo(anim.breed || 'murrah', anim.isBaby);
        } else if (anim.type === 'cow' || pen.type === 'cow_buffalo') {
          animalMesh = this.createCow(anim.breed || 'holstein', anim.isBaby);
        } else if (anim.type === 'goat') {
          animalMesh = this.createGoat(anim.breed || 'alpine', anim.isBaby);
        } else if (anim.type === 'chicken') {
          animalMesh = this.createChicken(anim.breed || 'leghorn', anim.isBaby);
        } else if (anim.type === 'horse') {
          animalMesh = this.createHorse(anim.breed || 'mustang', anim.isBaby);
        } else if (anim.type === 'dog') {
          animalMesh = this.createDog(anim.breed || 'shepherd', anim.isBaby);
        } else {
          animalMesh = this.createCow('holstein', anim.isBaby);
        }

        animalMesh.userData = { isAnimalMesh: true, id: anim.id, data: anim, penType: pen.type };

        // Position spread across pen ground
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        let posX = (col - 0.5) * (pen.w * 0.45);
        let posZ = 0.5 + (row - 0.5) * (pen.d * 0.35);

        if (pen.type === 'dog') {
          posX = 0.8;
          posZ = 0.8;
        }

        animalMesh.position.set(posX, 0, posZ);
        pen.group.add(animalMesh);

        // Sleep bubble
        const zBubble = this.createSleepBubble();
        zBubble.position.set(0, anim.isBaby ? 0.9 : 1.8, 0);
        zBubble.visible = false;
        animalMesh.add(zBubble);

        // Heat sweat indicator for hot weather neglect
        const heatBubble = this.createHeatSweatBubble();
        heatBubble.position.set(0, anim.isBaby ? 0.85 : 1.6, 0);
        heatBubble.visible = false;
        animalMesh.add(heatBubble);

        pen.animals.push({
          data: anim,
          mesh: animalMesh,
          bubble: zBubble,
          heatBubble: heatBubble,
          basePosY: 0,
          basePosX: posX,
          basePosZ: posZ,
          targetX: posX,
          targetZ: posZ,
          actionTimer: Math.random() * 5.0,
          behaviorState: 'idle'
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

    // Head Group for smooth grazing animation
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.0, 0.75);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.7), bodyMat);
    head.position.set(0, 0.2, 0.2);
    headGroup.add(head);

    // Snout / Nose
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.3), snoutMat);
    snout.position.set(0, 0.05, 0.6);
    headGroup.add(snout);

    // Horns
    [-0.25, 0.25].forEach(hx => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 6), isCelestial ? this.materials.coinGold : this.materials.woodDark);
      horn.position.set(hx, 0.55, 0.1);
      horn.rotation.z = hx > 0 ? -0.4 : 0.4;
      headGroup.add(horn);
    });

    if (isCelestial) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), this.materials.lampGlow);
      star.position.set(0, 0.8, 0.2);
      headGroup.add(star);
    }
    cow.add(headGroup);
    cow.userData.headGroup = headGroup;

    // Tail
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 4), patchMat);
    tail.position.set(0, 0.7, -0.85);
    tail.rotation.x = 0.2;
    cow.add(tail);
    cow.userData.tail = tail;

    // 4 Legs
    [[-0.4, -0.5], [0.4, -0.5], [-0.4, 0.5], [0.4, 0.5]].forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), bodyMat);
      leg.position.set(pos[0], 0.3, pos[1]);
      leg.castShadow = true;
      cow.add(leg);
    });

    return cow;
  }

  createBuffalo(breed = 'murrah', isBaby = false) {
    const buffalo = new THREE.Group();
    if (isBaby) {
      buffalo.scale.set(0.52, 0.52, 0.52);
    }

    const isGolden = breed === 'golden_horn';
    const isRare = breed === 'nili_ravi';

    const hideMat = isGolden ? this.materials.cowGold : this.materials.buffaloHide;
    const hornMat = isGolden ? this.materials.coinGold : this.materials.buffaloHorn;

    // Muscular Sturdy Torso
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.0, 1.75), hideMat);
    body.position.y = 0.88;
    body.castShadow = true;
    buffalo.add(body);

    // Flank muscle ridge
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.3, 0.8), hideMat);
    ridge.position.set(0, 1.35, -0.1);
    buffalo.add(ridge);

    // Head Group for Grazing
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.05, 0.85);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.65, 0.75), hideMat);
    head.position.set(0, 0.15, 0.2);
    headGroup.add(head);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.32, 0.35), this.materials.buffaloHorn);
    snout.position.set(0, 0.02, 0.62);
    headGroup.add(snout);

    // Sweeping Water Buffalo Horns (Curved back and outwards)
    [-0.38, 0.38].forEach(hx => {
      const hornBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.05, 0.5, 6), hornMat);
      hornBase.position.set(hx, 0.45, 0.05);
      hornBase.rotation.z = hx > 0 ? -1.1 : 1.1;
      hornBase.rotation.x = -0.4;
      headGroup.add(hornBase);

      const hornTip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 6), hornMat);
      hornTip.position.set(hx > 0 ? hx + 0.35 : hx - 0.35, 0.58, -0.15);
      hornTip.rotation.z = hx > 0 ? -0.3 : 0.3;
      headGroup.add(hornTip);
    });

    if (isGolden) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), this.materials.lampGlow);
      star.position.set(0, 0.8, 0.2);
      headGroup.add(star);
    }

    buffalo.add(headGroup);
    buffalo.userData.headGroup = headGroup;

    // Tail
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 4), hornMat);
    tail.position.set(0, 0.72, -0.92);
    tail.rotation.x = 0.2;
    buffalo.add(tail);
    buffalo.userData.tail = tail;

    // 4 Stout Legs
    [[-0.45, -0.55], [0.45, -0.55], [-0.45, 0.55], [0.45, 0.55]].forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.6, 8), hideMat);
      leg.position.set(pos[0], 0.3, pos[1]);
      leg.castShadow = true;
      buffalo.add(leg);
    });

    return buffalo;
  }

  createGoat(breed = 'alpine', isBaby = false) {
    const goat = new THREE.Group();
    const scale = isBaby ? 0.42 : 0.75;
    goat.scale.set(scale, scale, scale);

    const isBoer = breed === 'boer';
    const isNebula = breed === 'nebula_goat';

    const bodyMat = isNebula ? this.materials.sheepRainbow : isBoer ? this.materials.goatBrown : this.materials.goatWhite;
    const hornMat = isNebula ? this.materials.coinGold : this.materials.goatHorn;

    // Slender Agile Torso
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 1.15), bodyMat);
    body.position.y = 0.75;
    body.castShadow = true;
    goat.add(body);

    // Head Group for Agility & Hopping
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.0, 0.55);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.55), bodyMat);
    head.position.set(0, 0.18, 0.15);
    headGroup.add(head);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.25), this.materials.woodLight);
    snout.position.set(0, 0.08, 0.45);
    headGroup.add(snout);

    // Chin Beard
    const beard = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 5), this.materials.goatWhite);
    beard.position.set(0, -0.12, 0.42);
    beard.rotation.x = -0.2;
    headGroup.add(beard);

    // Backward Arching Horns
    [-0.15, 0.15].forEach(hx => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 6), hornMat);
      horn.position.set(hx, 0.5, 0.05);
      horn.rotation.x = -0.6;
      horn.rotation.z = hx > 0 ? 0.15 : -0.15;
      headGroup.add(horn);
    });

    // Floppy/Perky Ears
    [-0.24, 0.24].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.1), bodyMat);
      ear.position.set(ex, 0.28, 0.12);
      ear.rotation.z = ex > 0 ? -0.4 : 0.4;
      headGroup.add(ear);
    });

    goat.add(headGroup);
    goat.userData.headGroup = headGroup;

    // Perky Upright Little Tail
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.25, 4), bodyMat);
    tail.position.set(0, 0.95, -0.6);
    tail.rotation.x = -0.6;
    goat.add(tail);
    goat.userData.tail = tail;

    // 4 Slender Legs
    [[-0.28, -0.4], [0.28, -0.4], [-0.28, 0.4], [0.28, 0.4]].forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.55, 6), this.materials.woodDark);
      leg.position.set(pos[0], 0.28, pos[1]);
      leg.castShadow = true;
      goat.add(leg);
    });

    return goat;
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

    // Head Group for Pecking Animation
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.72, 0.18);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), bodyMat);
    head.position.set(0, 0.12, 0.08);
    headGroup.add(head);

    const comb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.22), combMat);
    comb.position.set(0, 0.32, 0.08);
    headGroup.add(comb);

    // Beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 6), this.materials.chickenBeak);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.12, 0.28);
    headGroup.add(beak);

    chicken.add(headGroup);
    chicken.userData.headGroup = headGroup;

    // Wings on sides for flapping
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.4), bodyMat);
    leftWing.position.set(-0.38, 0.5, 0);
    chicken.add(leftWing);
    chicken.userData.leftWing = leftWing;

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.4), bodyMat);
    rightWing.position.set(0.38, 0.5, 0);
    chicken.add(rightWing);
    chicken.userData.rightWing = rightWing;

    // Tail Feathers for Phoenix
    if (isPhoenix) {
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 4), this.materials.coinGold);
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

  createHorse(breed = 'mustang', isBaby = false) {
    const horse = new THREE.Group();
    const scale = isBaby ? 0.45 : 0.82;
    horse.scale.set(scale, scale, scale);

    const isAppaloosa = breed === 'appaloosa';
    const isPegasus = breed === 'pegasus_flame';

    const bodyMat = isPegasus ? this.materials.horseGold : isAppaloosa ? this.materials.horseWhite : this.materials.horseBrown;
    const maneMat = isPegasus ? this.materials.chickenPhoenix : isAppaloosa ? this.materials.horseBlack : this.materials.horseMane;

    // Graceful Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.95, 1.8), bodyMat);
    body.position.y = 1.15;
    body.castShadow = true;
    horse.add(body);

    // Neck & Head Group
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 1.4, 0.75);

    // Angled Neck
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.9, 0.55), bodyMat);
    neck.position.set(0, 0.45, 0.15);
    neck.rotation.x = 0.45;
    neckGroup.add(neck);

    // Mane along neck
    const mane = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.2), maneMat);
    mane.position.set(0, 0.55, -0.1);
    neckGroup.add(mane);

    // Head & Muzzle
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.5, 0.75), bodyMat);
    head.position.set(0, 0.85, 0.55);
    neckGroup.add(head);

    const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.35), this.materials.woodDark);
    muzzle.position.set(0, 0.75, 0.95);
    neckGroup.add(muzzle);

    // Pointy Ears
    [-0.16, 0.16].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 5), bodyMat);
      ear.position.set(ex, 1.18, 0.4);
      neckGroup.add(ear);
    });

    horse.add(neckGroup);
    horse.userData.neckGroup = neckGroup;

    // Flowing Tail
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.9, 6), maneMat);
    tail.position.set(0, 1.15, -0.98);
    tail.rotation.x = 0.25;
    horse.add(tail);
    horse.userData.tail = tail;

    // 4 Stately Legs
    [[-0.38, -0.6], [0.38, -0.6], [-0.38, 0.6], [0.38, 0.6]].forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 8), bodyMat);
      leg.position.set(pos[0], 0.4, pos[1]);
      leg.castShadow = true;
      horse.add(leg);

      // Hoof
      const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.15, 8), this.materials.cowBlack);
      hoof.position.set(pos[0], 0.07, pos[1]);
      horse.add(hoof);
    });

    return horse;
  }

  createDog(breed = 'shepherd', isBaby = false) {
    const dog = new THREE.Group();
    const scale = isBaby ? 0.42 : 0.68;
    dog.scale.set(scale, scale, scale);

    const furMat = this.materials.dogGolden;

    // Torso
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.55, 0.95), furMat);
    body.position.y = 0.6;
    body.castShadow = true;
    dog.add(body);

    // Collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 8), this.materials.dogCollar);
    collar.position.set(0, 0.78, 0.42);
    collar.rotation.x = 0.4;
    dog.add(collar);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.85, 0.5);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.48), furMat);
    head.position.set(0, 0.16, 0.1);
    headGroup.add(head);

    // Snout with black nose
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.32), this.materials.woodLight);
    snout.position.set(0, 0.08, 0.35);
    headGroup.add(snout);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.08), this.materials.dogNose);
    nose.position.set(0, 0.14, 0.52);
    headGroup.add(nose);

    // Ears
    [-0.2, 0.2].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.14), this.materials.woodDark);
      ear.position.set(ex, 0.28, 0.05);
      ear.rotation.z = ex > 0 ? -0.35 : 0.35;
      headGroup.add(ear);
    });

    dog.add(headGroup);
    dog.userData.headGroup = headGroup;

    // Wagging Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.72, -0.48);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.45, 6), furMat);
    tail.position.set(0, 0.2, -0.1);
    tail.rotation.x = -0.55;
    tailGroup.add(tail);
    dog.add(tailGroup);
    dog.userData.tailGroup = tailGroup;

    // 4 Paws/Legs
    [[-0.22, -0.3], [0.22, -0.3], [-0.22, 0.3], [0.22, 0.3]].forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.45, 6), furMat);
      leg.position.set(pos[0], 0.22, pos[1]);
      leg.castShadow = true;
      dog.add(leg);
    });

    return dog;
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

  // Hot Weather sweat droplet indicator
  createHeatSweatBubble() {
    const bubble = new THREE.Group();
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00bcd4';
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💦', 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.88 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.1, 1.1, 1.1);
    bubble.add(sprite);
    return bubble;
  }

  updateChickenCoopState(isLocked, isInCoop) {
    const chkPen = this.animals.find(p => p.type === 'chicken');
    if (chkPen && chkPen.coopDoor) {
      if (isLocked || isInCoop) {
        // Door closed & latched shut
        chkPen.coopDoor.rotation.y = 0;
      } else {
        // Door open for morning/daytime
        chkPen.coopDoor.rotation.y = Math.PI * 0.45;
      }
    }
  }

  updateAnimalShelterPositions(isSheltered) {
    this.animals.forEach(pen => {
      pen.animals.forEach((item, idx) => {
        if (isSheltered) {
          // Move under shelter
          if (pen.type === 'chicken') {
            item.targetX = (idx - 1) * 0.45;
            item.targetZ = pen.shelterZ;
          } else if (pen.type === 'dog') {
            item.targetX = 0;
            item.targetZ = 0;
          } else {
            item.targetX = (idx - 1) * 1.3;
            item.targetZ = pen.shelterZ;
          }
        } else {
          // Return to pasture base positions
          item.targetX = item.basePosX;
          item.targetZ = item.basePosZ;
        }
      });
    });
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
        const isHotWeather = gameState && gameState.isHotWeather;
        const animalsSheltered = gameState && gameState.animalsSheltered;
        const chickensInCoop = isNight || (gameState && gameState.chickensInCoop);
        const chickenCoopLocked = gameState && gameState.chickenCoopLocked;

        // Keep chicken coop door updated
        this.updateChickenCoopState(chickenCoopLocked, chickensInCoop);

        pen.animals.forEach((item, idx) => {
          const t = Date.now() * 0.002 + idx * 2.3;
          const isBaby = item.data && item.data.isBaby;
          const animType = item.data ? item.data.type : pen.type;

          // Determine target shelter vs roaming position
          let targetX = item.basePosX;
          let targetZ = item.basePosZ;
          let targetY = 0;

          if (isNight) {
            if (pen.type === 'chicken') {
              // Chickens go inside the elevated coop at night
              targetX = (idx - 1) * 0.45;
              targetZ = pen.shelterZ;
              targetY = 0.55;
            } else if (pen.type === 'dog') {
              targetX = 0;
              targetZ = 0;
            } else {
              targetX = item.basePosX;
              targetZ = item.basePosZ;
            }
          } else if (isHotWeather && animalsSheltered) {
            // Animals moved into their respective shaded shelters
            if (pen.type === 'cow_buffalo') {
              targetX = (idx - 1.5) * 1.5;
              targetZ = pen.shelterZ;
            } else if (pen.type === 'goat') {
              targetX = (idx - 0.5) * 1.4;
              targetZ = pen.shelterZ;
            } else if (pen.type === 'chicken') {
              targetX = (idx - 1) * 0.45;
              targetZ = pen.shelterZ;
              targetY = 0.55;
            } else if (pen.type === 'horse') {
              targetX = (idx - 0.5) * 1.6;
              targetZ = pen.shelterZ;
            } else if (pen.type === 'dog') {
              targetX = 0;
              targetZ = 0;
            }
          }

          // Smoothly interpolate position towards target
          item.mesh.position.x += (targetX - item.mesh.position.x) * Math.min(1.0, delta * 2.0);
          item.mesh.position.z += (targetZ - item.mesh.position.z) * Math.min(1.0, delta * 2.0);

          // Hot Weather distress indicator (sweat bubble) if left out in hot sun
          if (item.heatBubble) {
            if (isHotWeather && !animalsSheltered && !isNight) {
              item.heatBubble.visible = true;
              item.heatBubble.position.y = (isBaby ? 0.95 : 1.75) + Math.sin(t * 3.0) * 0.08;
            } else {
              item.heatBubble.visible = false;
            }
          }

          // Night Sleep Routine vs Daytime Natural Species Behaviors
          if (isNight) {
            // Sleep mode
            item.mesh.position.y = targetY + (pen.type === 'chicken' ? 0 : -0.22);
            item.mesh.rotation.z = Math.sin(t * 0.3) * 0.04 + 0.08;
            item.mesh.rotation.x = 0.08;
            if (item.bubble) {
              item.bubble.visible = true;
              item.bubble.position.y = (isBaby ? 1.0 : 1.6) + Math.sin(t * 1.5) * 0.12;
            }
          } else {
            // Wake mode: reset sleep bubble
            if (item.bubble) item.bubble.visible = false;
            item.mesh.rotation.z = 0;

            // --- 5. Species-Specific Looping Natural Behaviors ---
            if (animType === 'cow' || animType === 'buffalo') {
              // Cows and Buffaloes: Slowly graze and rest
              const cycle = (t * 0.45) % (Math.PI * 2);
              if (cycle < Math.PI * 1.25) {
                // Grazing: head dips down, chewing, slow tail swish
                if (item.mesh.userData.headGroup) {
                  item.mesh.userData.headGroup.rotation.x = 0.36 + Math.sin(t * 1.8) * 0.06;
                  item.mesh.userData.headGroup.rotation.y = Math.sin(t * 0.7) * 0.12;
                }
                if (item.mesh.userData.tail) {
                  item.mesh.userData.tail.rotation.z = Math.sin(t * 2.2) * 0.35;
                }
                item.mesh.position.y = targetY;
                item.mesh.rotation.x = 0.05;
                item.mesh.rotation.y = Math.sin(t * 0.25) * 0.25;
              } else {
                // Resting: stands peacefully, slow contented breathing
                if (item.mesh.userData.headGroup) {
                  item.mesh.userData.headGroup.rotation.x = Math.sin(t * 0.6) * 0.06;
                  item.mesh.userData.headGroup.rotation.y = 0;
                }
                if (item.mesh.userData.tail) {
                  item.mesh.userData.tail.rotation.z = Math.sin(t * 0.8) * 0.12;
                }
                item.mesh.position.y = targetY + Math.sin(t * 1.2) * 0.03;
                item.mesh.rotation.x = 0;
              }

            } else if (animType === 'goat') {
              // Goats: Jump and move more, energetic hops & perky tail wiggles
              const goatT = t * 1.7;
              const hop = Math.max(0, Math.sin(goatT * 2.4));
              item.mesh.position.y = targetY + hop * 0.36;
              item.mesh.rotation.x = Math.sin(goatT * 2.4) * 0.12;

              if (item.mesh.userData.headGroup) {
                item.mesh.userData.headGroup.rotation.y = Math.sin(goatT * 1.8) * 0.45;
                item.mesh.userData.headGroup.rotation.x = Math.sin(goatT * 1.2) * 0.18;
              }
              if (item.mesh.userData.tail) {
                item.mesh.userData.tail.rotation.z = Math.sin(goatT * 8.0) * 0.45;
              }
              item.mesh.rotation.y = Math.sin(goatT * 0.6) * 0.7;

            } else if (animType === 'chicken') {
              // Chickens: Peck the ground, walk around, flap wings
              if (chickensInCoop) {
                // Calm inside coop
                item.mesh.position.y = targetY;
                item.mesh.rotation.x = 0;
                if (item.mesh.userData.headGroup) {
                  item.mesh.userData.headGroup.rotation.x = Math.sin(t * 1.2) * 0.1;
                }
              } else {
                const chkT = t * 2.4;
                const chkCycle = (t * 0.8) % 6.0;

                if (chkCycle < 2.8) {
                  // Walking bob
                  item.mesh.position.y = targetY + Math.abs(Math.sin(chkT * 3.5)) * 0.08;
                  item.mesh.rotation.y = (chkT * 0.35) % (Math.PI * 2);
                  if (item.mesh.userData.headGroup) {
                    item.mesh.userData.headGroup.rotation.x = 0.1;
                  }
                } else if (chkCycle < 4.8) {
                  // Pecking ground sharply
                  const peck = Math.max(0, Math.sin(chkT * 4.5)) * 0.75;
                  if (item.mesh.userData.headGroup) {
                    item.mesh.userData.headGroup.rotation.x = 0.2 + peck;
                  }
                  item.mesh.position.y = targetY;
                } else {
                  // Flapping wings
                  const flap = Math.sin(chkT * 14.0) * 0.4;
                  if (item.mesh.userData.leftWing) item.mesh.userData.leftWing.rotation.z = -0.3 + flap;
                  if (item.mesh.userData.rightWing) item.mesh.userData.rightWing.rotation.z = 0.3 - flap;
                  item.mesh.position.y = targetY + Math.abs(Math.sin(chkT * 6.0)) * 0.12;
                }
              }

            } else if (animType === 'horse') {
              // Horses: Stand tall or walk calmly
              const horseCycle = (t * 0.4) % 10.0;
              if (horseCycle < 5.5) {
                // Calm standing posture
                item.mesh.position.y = targetY;
                item.mesh.rotation.x = 0;
                if (item.mesh.userData.neckGroup) {
                  item.mesh.userData.neckGroup.rotation.x = Math.sin(t * 0.7) * 0.08;
                }
                if (item.mesh.userData.tail) {
                  item.mesh.userData.tail.rotation.z = Math.sin(t * 1.4) * 0.25;
                }
              } else {
                // Calm walk around paddock
                item.mesh.position.y = targetY + Math.abs(Math.sin(t * 2.2)) * 0.05;
                item.mesh.rotation.y = Math.sin(t * 0.45) * 0.35;
                if (item.mesh.userData.neckGroup) {
                  item.mesh.userData.neckGroup.rotation.x = 0.15 + Math.sin(t * 2.2) * 0.06;
                }
                if (item.mesh.userData.tail) {
                  item.mesh.userData.tail.rotation.z = Math.sin(t * 2.2) * 0.35;
                }
              }

            } else if (animType === 'dog') {
              // Dogs: Walk around and sometimes sit
              const dogCycle = (t * 0.45) % 9.0;
              if (dogCycle < 4.8) {
                // Trotting patrol
                item.mesh.position.y = targetY + Math.abs(Math.sin(t * 5.0)) * 0.07;
                item.mesh.rotation.x = 0;
                item.mesh.rotation.y = Math.sin(t * 0.65) * 0.65;
                if (item.mesh.userData.tailGroup) {
                  item.mesh.userData.tailGroup.rotation.y = Math.sin(t * 12.0) * 0.55;
                }
                if (item.mesh.userData.headGroup) {
                  item.mesh.userData.headGroup.rotation.y = Math.sin(t * 1.5) * 0.25;
                }
              } else {
                // Sitting down contentedly
                item.mesh.position.y = targetY - 0.12;
                item.mesh.rotation.x = -0.26;
                if (item.mesh.userData.tailGroup) {
                  item.mesh.userData.tailGroup.rotation.y = Math.sin(t * 4.0) * 0.25;
                }
                if (item.mesh.userData.headGroup) {
                  item.mesh.userData.headGroup.rotation.y = Math.sin(t * 0.8) * 0.35;
                }
              }
            } else {
              // Fallback (e.g. Sheep)
              item.mesh.position.y = targetY + (isBaby ? Math.abs(Math.sin(t * 3.5)) * 0.16 : 0);
              item.mesh.rotation.y = Math.sin(t * 0.7) * 0.35;
            }
          }
        });
      }
    });

    // 4. Crop Growth & Multi-Stage 3D Animation (Influenced by Weather System)
    const weatherMult = (weatherSystem && weatherSystem.getGrowthMultiplier) ? weatherSystem.getGrowthMultiplier() : 1.0;
    const breeze = Math.sin(t * 2.5) * 0.06;

    this.plots.forEach(plot => {
      if (plot.unlocked && plot.growth < 1.0) {
        plot.growth = Math.min(1.0, plot.growth + delta * plot.growthSpeed * weatherMult);
        if (plot.growth >= 1.0) {
          plot.ready = true;
        }
      }

      // Update 3D Stage meshes for all crop slots in this plot
      const g = plot.growth;
      plot.crops.forEach(cropItem => {
        if (!cropItem.stage0) return;

        if (g < 0.35) {
          // STAGE 0: Seed Mound & Tiny Sprout shoot
          cropItem.stage0.visible = true;
          cropItem.stage1.visible = false;
          cropItem.stage2.visible = false;

          const s0 = 0.4 + (g / 0.35) * 0.6;
          cropItem.stage0.scale.set(s0, s0, s0);

        } else if (g < 0.80) {
          // STAGE 1: Young Leafy Green Stalk
          cropItem.stage0.visible = false;
          cropItem.stage1.visible = true;
          cropItem.stage2.visible = false;

          const s1 = 0.5 + ((g - 0.35) / 0.45) * 0.5;
          cropItem.stage1.scale.set(s1, s1, s1);
          cropItem.stage1.rotation.z = breeze * 0.5;

        } else {
          // STAGE 2: Full Harvestable Ripe Crop
          cropItem.stage0.visible = false;
          cropItem.stage1.visible = false;
          cropItem.stage2.visible = true;

          const s2 = 0.85 + ((g - 0.80) / 0.20) * 0.15;
          cropItem.stage2.scale.set(s2, s2, s2);
          cropItem.stage2.rotation.z = breeze; // swaying wind animation
          cropItem.stage2.rotation.x = Math.cos(t * 2.0) * 0.03;
        }
      });
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
