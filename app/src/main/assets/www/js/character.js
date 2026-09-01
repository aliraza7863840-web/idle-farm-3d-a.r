// 3D Articulated Main Character Model
// Recreating the boy in the grey hoodie with high-fidelity geometry, level upgrades & visual FX

class PlayerCharacter {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "PlayerCharacter";

    // Movement & state variables
    this.position = this.group.position;
    this.targetPos = null;
    this.moveVector = new THREE.Vector3();
    this.speed = 4.8;
    this.state = 'idle'; // 'idle', 'walk', 'jump', 'swim', 'ride', 'harvest', 'plant', 'cheer', 'fish'
    this.animTime = 0;
    this.harvestTimer = 0;

    // Jump Physics
    this.isJumping = false;
    this.velocityY = 0;
    this.groundY = 0;
    this.gravity = 22.0;
    this.jumpForce = 7.2;

    // Swimming State
    this.inWater = false;
    this.isSwimming = false;
    this.swimSplashTimer = 0;

    // Vehicle Mounting
    this.mountedVehicle = null; // 'bike', 'tractor', 'pickup', 'cart'
    this.vehicleHeading = 0;
    this.vehicleSpeed = 0;
    this.wheelRotation = 0;

    // Fishing State
    this.isFishing = false;
    this.fishingStage = 'none'; // 'casting', 'waiting', 'bite', 'reel'
    this.fishingTimer = 0;

    // Materials Palette matching the character
    const rawMaterials = {
      skin: new THREE.MeshLambertMaterial({ color: 0xb88265 }),
      skinShadow: new THREE.MeshLambertMaterial({ color: 0x9e6b52 }),
      hair: new THREE.MeshLambertMaterial({ color: 0x181615 }),
      hairHighlight: new THREE.MeshLambertMaterial({ color: 0x272220 }),
      hoodie: new THREE.MeshLambertMaterial({ color: 0x3a3e42 }), // Charcoal heather grey
      hoodiePocket: new THREE.MeshLambertMaterial({ color: 0x323538 }),
      hoodieRib: new THREE.MeshLambertMaterial({ color: 0x2e3235 }),
      drawstring: new THREE.MeshLambertMaterial({ color: 0x90989f }),
      drawstringTip: new THREE.MeshLambertMaterial({ color: 0xcccccc }),
      cargoPants: new THREE.MeshLambertMaterial({ color: 0x1b1c1e }), // Black cargo pants
      cargoPocket: new THREE.MeshLambertMaterial({ color: 0x151618 }),
      shoes: new THREE.MeshLambertMaterial({ color: 0x141517 }), // Black sneakers
      shoeSole: new THREE.MeshLambertMaterial({ color: 0x222528 }),
      eyeWhite: new THREE.MeshBasicMaterial({ color: 0xf5f5f5 }),
      eyeIris: new THREE.MeshBasicMaterial({ color: 0x211713 }),
      eyePupil: new THREE.MeshBasicMaterial({ color: 0x050505 }),
      eyebrow: new THREE.MeshBasicMaterial({ color: 0x161311 }),
      lips: new THREE.MeshLambertMaterial({ color: 0xa46853 }),
      backpack: new THREE.MeshLambertMaterial({ color: 0x37474f }),
      backpackPocket: new THREE.MeshLambertMaterial({ color: 0x263238 }),
      goldAura: new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.8, side: THREE.DoubleSide }),
      fishingBamboo: new THREE.MeshLambertMaterial({ color: 0xd7ccc8 }),
      fishingLineMat: new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }),
      waterRippleMat: new THREE.MeshBasicMaterial({ color: 0x81d4fa, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
      bikeRed: new THREE.MeshLambertMaterial({ color: 0xe53935 }),
      bikeMetal: new THREE.MeshLambertMaterial({ color: 0xb0bec5 }),
      bikeTire: new THREE.MeshLambertMaterial({ color: 0x212121 }),
      tractorYellow: new THREE.MeshLambertMaterial({ color: 0xfbc02d }),
      tractorGreen: new THREE.MeshLambertMaterial({ color: 0x2e7d32 }),
      pickupBlue: new THREE.MeshLambertMaterial({ color: 0x1e88e5 }),
      buggyOrange: new THREE.MeshLambertMaterial({ color: 0xff6f00 }),
      sedanTeal: new THREE.MeshLambertMaterial({ color: 0x00838f }),
      quadGreen: new THREE.MeshLambertMaterial({ color: 0x33691e }),
      glassMat: new THREE.MeshLambertMaterial({ color: 0xb3e5fc, transparent: true, opacity: 0.65 }),
      cartWood: new THREE.MeshLambertMaterial({ color: 0x8d6e63 })
    };

    const defaultFallbackMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    this.materials = new Proxy(rawMaterials, {
      get: (target, prop) => {
        if (prop in target) return target[prop];
        return defaultFallbackMat;
      }
    });

    this.buildCharacter();
    this.buildFishingRod();
    this.buildMountedVehicles();
    this.buildLevelUpFX();
    this.scene.add(this.group);

    // Initial position on farm
    this.group.position.set(0, 0, 2);
  }

  buildFishingRod() {
    this.fishingRodGroup = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(0.015, 0.03, 1.8, 6);
    const rodMesh = new THREE.Mesh(rodGeo, this.materials.fishingBamboo);
    rodMesh.position.set(0, 0.8, 0.4);
    rodMesh.rotation.x = -Math.PI / 4;
    this.fishingRodGroup.add(rodMesh);

    // Fishing line with bobber
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.4, 1.0),
      new THREE.Vector3(0, 0.0, 3.2)
    ]);
    this.fishingLine = new THREE.Line(lineGeo, this.materials.fishingLineMat);
    this.fishingRodGroup.add(this.fishingLine);

    const bobberGeo = new THREE.SphereGeometry(0.08, 6, 6);
    this.bobber = new THREE.Mesh(bobberGeo, new THREE.MeshBasicMaterial({ color: 0xff1744 }));
    this.bobber.position.set(0, 0.0, 3.2);
    this.fishingRodGroup.add(this.bobber);

    this.fishingRodGroup.visible = false;
    this.group.add(this.fishingRodGroup);
  }

  buildMountedVehicles() {
    // 1. Mounted Bike Model
    this.bikeMountGroup = new THREE.Group();
    const bFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), this.materials.bikeRed);
    bFrame.rotation.z = Math.PI / 2;
    bFrame.position.y = 0.55;
    this.bikeMountGroup.add(bFrame);

    const bBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6), this.materials.bikeMetal);
    bBar.rotation.z = Math.PI / 2;
    bBar.position.set(0, 0.95, 0.65);
    this.bikeMountGroup.add(bBar);

    this.bikeWheels = [];
    [-0.65, 0.65].forEach(z => {
      const wGroup = new THREE.Group();
      wGroup.position.set(0, 0.38, z);
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.045, 8, 16), this.materials.bikeTire);
      tire.rotation.y = Math.PI / 2;
      wGroup.add(tire);
      const spoke1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.65, 4), this.materials.bikeMetal);
      wGroup.add(spoke1);
      const spoke2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.65, 4), this.materials.bikeMetal);
      spoke2.rotation.x = Math.PI / 2;
      wGroup.add(spoke2);
      this.bikeMountGroup.add(wGroup);
      this.bikeWheels.push(wGroup);
    });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.28), this.materials.shoes);
    seat.position.set(0, 0.75, -0.15);
    this.bikeMountGroup.add(seat);

    this.bikeMountGroup.visible = false;
    this.group.add(this.bikeMountGroup);

    // 2. Mounted Tractor Model
    this.tractorMountGroup = new THREE.Group();
    const trBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 1.8), this.materials.tractorGreen);
    trBody.position.set(0, 0.65, 0);
    this.tractorMountGroup.add(trBody);

    const trHood = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 1.0), this.materials.tractorYellow);
    trHood.position.set(0, 0.6, 0.9);
    this.tractorMountGroup.add(trHood);

    const trExhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6), this.materials.bikeMetal);
    trExhaust.position.set(0.35, 1.2, 0.9);
    this.tractorMountGroup.add(trExhaust);

    this.tractorWheels = [];
    [-0.7, 0.7].forEach(x => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.28, 14), this.materials.bikeTire);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.52, -0.45);
      this.tractorMountGroup.add(w);
      this.tractorWheels.push(w);
    });
    [-0.6, 0.6].forEach(x => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.2, 12), this.materials.bikeTire);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.34, 0.85);
      this.tractorMountGroup.add(w);
      this.tractorWheels.push(w);
    });

    this.tractorMountGroup.visible = false;
    this.group.add(this.tractorMountGroup);

    // 3. Mounted Pickup Truck Model
    this.pickupMountGroup = new THREE.Group();
    const pkCab = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.85, 1.2), this.materials.pickupBlue);
    pkCab.position.set(0, 0.8, 0.3);
    this.pickupMountGroup.add(pkCab);

    const pkBed = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 1.3), this.materials.pickupBlue);
    pkBed.position.set(0, 0.6, -0.85);
    this.pickupMountGroup.add(pkBed);

    const pkWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 0.1), this.materials.glassMat);
    pkWindshield.position.set(0, 0.9, 0.9);
    this.pickupMountGroup.add(pkWindshield);

    this.pickupWheels = [];
    [[-0.72, 0.7], [0.72, 0.7], [-0.72, -0.9], [0.72, -0.9]].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12), this.materials.bikeTire);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.32, z);
      this.pickupMountGroup.add(w);
      this.pickupWheels.push(w);
    });

    this.pickupMountGroup.visible = false;
    this.group.add(this.pickupMountGroup);

    // 4. Mounted Off-Road Dune Buggy Model
    this.buggyMountGroup = new THREE.Group();
    const bgChassis = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 1.9), this.materials.buggyOrange);
    bgChassis.position.set(0, 0.5, 0);
    this.buggyMountGroup.add(bgChassis);

    // Roll Cage Tubes
    const cageGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.1, 6);
    [[-0.6, 0.4], [0.6, 0.4], [-0.6, -0.5], [0.6, -0.5]].forEach(([cx, cz]) => {
      const tube = new THREE.Mesh(cageGeo, this.materials.bikeMetal);
      tube.position.set(cx, 1.05, cz);
      this.buggyMountGroup.add(tube);
    });
    const cageTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.9), this.materials.bikeMetal);
    cageTop.position.set(0, 1.6, -0.05);
    this.buggyMountGroup.add(cageTop);

    // Front spoiler / bull bar
    const bullBar = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.12, 0.15), this.materials.bikeMetal);
    bullBar.position.set(0, 0.45, 1.0);
    this.buggyMountGroup.add(bullBar);

    this.buggyWheels = [];
    [[-0.8, 0.75], [0.8, 0.75], [-0.8, -0.75], [0.8, -0.75]].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12), this.materials.bikeTire);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.38, z);
      this.buggyMountGroup.add(w);
      this.buggyWheels.push(w);
    });

    this.buggyMountGroup.visible = false;
    this.group.add(this.buggyMountGroup);

    // 5. Mounted Town Sedan Car Model
    this.sedanMountGroup = new THREE.Group();
    const sdBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 2.3), this.materials.sedanTeal);
    sdBody.position.set(0, 0.55, 0);
    this.sedanMountGroup.add(sdBody);

    const sdCabin = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.55, 1.3), this.materials.sedanTeal);
    sdCabin.position.set(0, 1.05, -0.15);
    this.sedanMountGroup.add(sdCabin);

    const sdGlassFront = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 0.1), this.materials.glassMat);
    sdGlassFront.position.set(0, 1.05, 0.52);
    this.sedanMountGroup.add(sdGlassFront);

    this.sedanWheels = [];
    [[-0.75, 0.8], [0.75, 0.8], [-0.75, -0.8], [0.75, -0.8]].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12), this.materials.bikeTire);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.32, z);
      this.sedanMountGroup.add(w);
      this.sedanWheels.push(w);
    });

    this.sedanMountGroup.visible = false;
    this.group.add(this.sedanMountGroup);

    // 6. Mounted Quad ATV Model
    this.quadMountGroup = new THREE.Group();
    const qdBody = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.45, 1.4), this.materials.quadGreen);
    qdBody.position.set(0, 0.55, 0);
    this.quadMountGroup.add(qdBody);

    const qdHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6), this.materials.bikeMetal);
    qdHandle.rotation.z = Math.PI / 2;
    qdHandle.position.set(0, 1.05, 0.45);
    this.quadMountGroup.add(qdHandle);

    this.quadWheels = [];
    [[-0.65, 0.55], [0.65, 0.55], [-0.65, -0.55], [0.65, -0.55]].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.26, 12), this.materials.bikeTire);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.35, z);
      this.quadMountGroup.add(w);
      this.quadWheels.push(w);
    });

    this.quadMountGroup.visible = false;
    this.group.add(this.quadMountGroup);

    // 7. Mounted Farm Cart Model
    this.cartMountGroup = new THREE.Group();
    const wagon = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.55, 1.6), this.materials.cartWood);
    wagon.position.set(0, 0.6, 0);
    this.cartMountGroup.add(wagon);

    this.cartWheels = [];
    [[-0.68, -0.3], [0.68, -0.3]].forEach(([x, z]) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.12, 14), this.materials.cartWood);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.48, z);
      this.cartMountGroup.add(w);
      this.cartWheels.push(w);
    });

    this.cartMountGroup.visible = false;
    this.group.add(this.cartMountGroup);
  }

  buildCharacter() {
    const s = 1.0;

    // --- ROOT / HIPS ---
    this.hips = new THREE.Group();
    this.hips.position.y = 0.95 * s;
    this.group.add(this.hips);

    // Pelvis
    const pelvisGeo = new THREE.BoxGeometry(0.34 * s, 0.18 * s, 0.22 * s);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, this.materials.cargoPants);
    pelvisMesh.castShadow = true;
    this.hips.add(pelvisMesh);

    // --- TORSO & GREY HOODIE ---
    this.torso = new THREE.Group();
    this.torso.position.y = 0.1 * s;
    this.hips.add(this.torso);

    const torsoGeo = new THREE.BoxGeometry(0.38 * s, 0.44 * s, 0.25 * s);
    const torsoMesh = new THREE.Mesh(torsoGeo, this.materials.hoodie);
    torsoMesh.position.y = 0.22 * s;
    torsoMesh.castShadow = true;
    this.torso.add(torsoMesh);

    // Bottom Ribbed Hem
    const hemGeo = new THREE.BoxGeometry(0.385 * s, 0.08 * s, 0.255 * s);
    const hemMesh = new THREE.Mesh(hemGeo, this.materials.hoodieRib);
    hemMesh.position.y = 0.02 * s;
    this.torso.add(hemMesh);

    // Kangaroo Front Pouch Pocket
    const pocketGeo = new THREE.BoxGeometry(0.26 * s, 0.16 * s, 0.05 * s);
    const pocketMesh = new THREE.Mesh(pocketGeo, this.materials.hoodiePocket);
    pocketMesh.position.set(0, 0.14 * s, 0.135 * s);
    this.torso.add(pocketMesh);

    // Drawstrings
    [-0.05 * s, 0.05 * s].forEach((dx) => {
      const stringGeo = new THREE.CylinderGeometry(0.007 * s, 0.007 * s, 0.18 * s, 6);
      const stringMesh = new THREE.Mesh(stringGeo, this.materials.drawstring);
      stringMesh.position.set(dx, 0.32 * s, 0.14 * s);
      this.torso.add(stringMesh);

      const tipGeo = new THREE.CylinderGeometry(0.009 * s, 0.009 * s, 0.03 * s, 6);
      const tipMesh = new THREE.Mesh(tipGeo, this.materials.drawstringTip);
      tipMesh.position.set(dx, 0.22 * s, 0.14 * s);
      this.torso.add(tipMesh);
    });

    // Folded Hood
    const hoodFoldGeo = new THREE.SphereGeometry(0.18 * s, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const hoodFoldMesh = new THREE.Mesh(hoodFoldGeo, this.materials.hoodie);
    hoodFoldMesh.rotation.x = Math.PI * 0.9;
    hoodFoldMesh.position.set(0, 0.44 * s, -0.06 * s);
    hoodFoldMesh.scale.set(1.0, 0.7, 0.8);
    this.torso.add(hoodFoldMesh);

    // Carry Capacity Backpack on back
    this.backpackGroup = new THREE.Group();
    const packBody = new THREE.Mesh(new THREE.BoxGeometry(0.28 * s, 0.32 * s, 0.14 * s), this.materials.backpack);
    packBody.position.set(0, 0.24 * s, -0.18 * s);
    packBody.castShadow = true;
    this.backpackGroup.add(packBody);

    const packFlap = new THREE.Mesh(new THREE.BoxGeometry(0.24 * s, 0.18 * s, 0.06 * s), this.materials.backpackPocket);
    packFlap.position.set(0, 0.20 * s, -0.26 * s);
    this.backpackGroup.add(packFlap);
    this.torso.add(this.backpackGroup);

    // Collar
    const collarGeo = new THREE.TorusGeometry(0.11 * s, 0.035 * s, 8, 16);
    const collarMesh = new THREE.Mesh(collarGeo, this.materials.hoodieRib);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 0.44 * s, 0);
    this.torso.add(collarMesh);

    // --- NECK & HEAD ---
    this.neck = new THREE.Group();
    this.neck.position.y = 0.45 * s;
    this.torso.add(this.neck);

    const neckGeo = new THREE.CylinderGeometry(0.07 * s, 0.08 * s, 0.1 * s, 12);
    const neckMesh = new THREE.Mesh(neckGeo, this.materials.skin);
    neckMesh.position.y = 0.05 * s;
    this.neck.add(neckMesh);

    this.head = new THREE.Group();
    this.head.position.y = 0.1 * s;
    this.neck.add(this.head);

    // Cranium
    const headGeo = new THREE.SphereGeometry(0.16 * s, 18, 16);
    const headMesh = new THREE.Mesh(headGeo, this.materials.skin);
    headMesh.position.y = 0.14 * s;
    headMesh.scale.set(0.9, 1.05, 0.95);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Jaw / Chin
    const jawGeo = new THREE.CylinderGeometry(0.12 * s, 0.08 * s, 0.12 * s, 12);
    const jawMesh = new THREE.Mesh(jawGeo, this.materials.skin);
    jawMesh.position.set(0, 0.08 * s, 0.03 * s);
    jawMesh.scale.set(1.0, 0.8, 1.1);
    this.head.add(jawMesh);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.024 * s, 0.055 * s, 6);
    const noseMesh = new THREE.Mesh(noseGeo, this.materials.skin);
    noseMesh.rotation.x = Math.PI * 0.45;
    noseMesh.position.set(0, 0.13 * s, 0.165 * s);
    this.head.add(noseMesh);

    // Eyes
    [-0.052 * s, 0.052 * s].forEach((ex) => {
      const eyeWhiteGeo = new THREE.SphereGeometry(0.025 * s, 8, 8);
      const eyeWhite = new THREE.Mesh(eyeWhiteGeo, this.materials.eyeWhite);
      eyeWhite.scale.set(1.1, 0.85, 0.5);
      eyeWhite.position.set(ex, 0.16 * s, 0.142 * s);
      this.head.add(eyeWhite);

      const irisGeo = new THREE.SphereGeometry(0.016 * s, 8, 8);
      const iris = new THREE.Mesh(irisGeo, this.materials.eyeIris);
      iris.position.set(ex, 0.16 * s, 0.155 * s);
      this.head.add(iris);
    });

    // Dark Hair / Side-part haircut
    const hairCapGeo = new THREE.SphereGeometry(0.168 * s, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const hairCap = new THREE.Mesh(hairCapGeo, this.materials.hair);
    hairCap.position.set(0, 0.16 * s, -0.01 * s);
    hairCap.scale.set(0.96, 1.06, 1.0);
    this.head.add(hairCap);

    // --- ARMS & LEGS ---
    this.leftArm = this.buildArm(s, -1);
    this.rightArm = this.buildArm(s, 1);
    this.torso.add(this.leftArm.shoulder);
    this.torso.add(this.rightArm.shoulder);

    this.leftLeg = this.buildLeg(s, -1);
    this.rightLeg = this.buildLeg(s, 1);
    this.hips.add(this.leftLeg.hip);
    this.hips.add(this.rightLeg.hip);
  }

  buildArm(s, side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.24 * s, 0.38 * s, 0);

    const upperGeo = new THREE.CylinderGeometry(0.065 * s, 0.055 * s, 0.28 * s, 10);
    const upperMesh = new THREE.Mesh(upperGeo, this.materials.hoodie);
    upperMesh.position.y = -0.14 * s;
    upperMesh.castShadow = true;
    shoulder.add(upperMesh);

    const elbow = new THREE.Group();
    elbow.position.y = -0.28 * s;
    shoulder.add(elbow);

    const foreGeo = new THREE.CylinderGeometry(0.055 * s, 0.048 * s, 0.26 * s, 10);
    const foreMesh = new THREE.Mesh(foreGeo, this.materials.hoodie);
    foreMesh.position.y = -0.13 * s;
    foreMesh.castShadow = true;
    elbow.add(foreMesh);

    const handGeo = new THREE.SphereGeometry(0.045 * s, 8, 8);
    const handMesh = new THREE.Mesh(handGeo, this.materials.skin);
    handMesh.position.set(0, -0.29 * s, 0);
    handMesh.castShadow = true;
    elbow.add(handMesh);

    return { shoulder, elbow, upperMesh, foreMesh, handMesh };
  }

  buildLeg(s, side) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.1 * s, 0, 0);

    const thighGeo = new THREE.CylinderGeometry(0.082 * s, 0.072 * s, 0.38 * s, 12);
    const thighMesh = new THREE.Mesh(thighGeo, this.materials.cargoPants);
    thighMesh.position.y = -0.19 * s;
    thighMesh.castShadow = true;
    hip.add(thighMesh);

    // Cargo Pouch
    const cargoGeo = new THREE.BoxGeometry(0.05 * s, 0.14 * s, 0.11 * s);
    const cargoMesh = new THREE.Mesh(cargoGeo, this.materials.cargoPocket);
    cargoMesh.position.set(side * 0.075 * s, -0.18 * s, 0);
    hip.add(cargoMesh);

    const knee = new THREE.Group();
    knee.position.y = -0.38 * s;
    hip.add(knee);

    const calfGeo = new THREE.CylinderGeometry(0.07 * s, 0.055 * s, 0.38 * s, 12);
    const calfMesh = new THREE.Mesh(calfGeo, this.materials.cargoPants);
    calfMesh.position.y = -0.19 * s;
    calfMesh.castShadow = true;
    knee.add(calfMesh);

    const foot = new THREE.Group();
    foot.position.y = -0.40 * s;
    knee.add(foot);

    const shoeGeo = new THREE.BoxGeometry(0.10 * s, 0.08 * s, 0.22 * s);
    const shoeMesh = new THREE.Mesh(shoeGeo, this.materials.shoes);
    shoeMesh.position.set(0, 0.02 * s, 0.04 * s);
    shoeMesh.castShadow = true;
    foot.add(shoeMesh);

    return { hip, knee, foot, thighMesh, calfMesh, shoeMesh };
  }

  // --- 3D LEVEL UP PARTICLES & GOLDEN SHOCKWAVE ---
  buildLevelUpFX() {
    this.lvlRing = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.5, 32),
      this.materials.goldAura
    );
    this.lvlRing.rotation.x = -Math.PI / 2;
    this.lvlRing.position.y = 0.05;
    this.lvlRing.visible = false;
    this.group.add(this.lvlRing);
    this.ringScale = 1.0;
  }

  triggerLevelUp() {
    this.state = 'cheer';
    this.harvestTimer = 2.0;
    this.ringScale = 0.5;
    this.lvlRing.visible = true;
    if (window.soundEngine) window.soundEngine.playLevelUp();
  }

  moveTo(x, z) {
    this.targetPos = new THREE.Vector3(x, 0, z);
    this.state = 'walk';
  }

  triggerHarvest() {
    this.state = 'harvest';
    this.harvestTimer = 0.6;
    if (window.soundEngine) window.soundEngine.playHarvest();
  }

  triggerPlant() {
    this.state = 'plant';
    this.harvestTimer = 0.55;
    if (window.soundEngine) window.soundEngine.playPlant();
  }

  jump() {
    if (this.state === 'sit' || this.state === 'lie') {
      this.standUp();
    }
    if (this.isJumping || this.inWater) return;
    this.isJumping = true;
    this.velocityY = this.jumpForce;
    if (window.soundEngine) window.soundEngine.playJump();
  }

  sit(benchPos = null) {
    if (this.mountedVehicle || this.inWater) return;
    if (this.state === 'sit') {
      this.standUp();
      return;
    }
    this.state = 'sit';
    this.targetPos = null;
    this.moveVector.set(0, 0, 0);
    if (benchPos) {
      this.group.position.set(benchPos.x, benchPos.y || 0, benchPos.z);
      if (benchPos.rot !== undefined) this.group.rotation.y = benchPos.rot;
    }
    if (window.soundEngine && window.soundEngine.playStep) window.soundEngine.playStep();
  }

  lieDown(bedPos = null) {
    if (this.mountedVehicle || this.inWater) return;
    if (this.state === 'lie') {
      this.standUp();
      return;
    }
    this.state = 'lie';
    this.targetPos = null;
    this.moveVector.set(0, 0, 0);
    if (bedPos) {
      this.group.position.set(bedPos.x, bedPos.y || 0, bedPos.z);
      if (bedPos.rot !== undefined) this.group.rotation.y = bedPos.rot;
    }
    if (window.soundEngine && window.soundEngine.playStep) window.soundEngine.playStep();
  }

  standUp() {
    if (this.state === 'sit' || this.state === 'lie') {
      this.state = 'idle';
      this.hips.position.y = 0.95;
      this.torso.rotation.set(0, 0, 0);
      this.head.rotation.set(0, 0, 0);
      this.leftLeg.hip.rotation.set(0, 0, 0);
      this.rightLeg.hip.rotation.set(0, 0, 0);
      this.leftLeg.knee.rotation.set(0, 0, 0);
      this.rightLeg.knee.rotation.set(0, 0, 0);
      this.leftArm.shoulder.rotation.set(0, 0, 0);
      this.rightArm.shoulder.rotation.set(0, 0, 0);
    }
  }

  mount(vehicleType) {
    this.standUp();
    this.mountedVehicle = vehicleType;
    if (this.bikeMountGroup) this.bikeMountGroup.visible = (vehicleType === 'bike');
    if (this.tractorMountGroup) this.tractorMountGroup.visible = (vehicleType === 'tractor');
    if (this.pickupMountGroup) this.pickupMountGroup.visible = (vehicleType === 'pickup');
    if (this.buggyMountGroup) this.buggyMountGroup.visible = (vehicleType === 'buggy');
    if (this.sedanMountGroup) this.sedanMountGroup.visible = (vehicleType === 'sedan');
    if (this.quadMountGroup) this.quadMountGroup.visible = (vehicleType === 'quad');
    if (this.cartMountGroup) this.cartMountGroup.visible = (vehicleType === 'cart');
  }

  dismount() {
    this.mountedVehicle = null;
    if (this.bikeMountGroup) this.bikeMountGroup.visible = false;
    if (this.tractorMountGroup) this.tractorMountGroup.visible = false;
    if (this.pickupMountGroup) this.pickupMountGroup.visible = false;
    if (this.buggyMountGroup) this.buggyMountGroup.visible = false;
    if (this.sedanMountGroup) this.sedanMountGroup.visible = false;
    if (this.quadMountGroup) this.quadMountGroup.visible = false;
    if (this.cartMountGroup) this.cartMountGroup.visible = false;
    this.standUp();
  }

  startFishing(onCatchCallback) {
    this.standUp();
    this.isFishing = true;
    this.fishingStage = 'casting';
    this.fishingTimer = 0;
    this.fishingRodGroup.visible = true;
    this.onFishCaught = onCatchCallback;
    if (window.soundEngine) window.soundEngine.playFishingCast();
  }

  stopFishing() {
    this.isFishing = false;
    this.fishingStage = 'none';
    this.fishingRodGroup.visible = false;
  }

  update(delta) {
    this.animTime += delta * 6.0;

    // Expand Level Up Shockwave Ring
    if (this.lvlRing && this.lvlRing.visible) {
      this.ringScale += delta * 4.0;
      this.lvlRing.scale.set(this.ringScale, this.ringScale, this.ringScale);
      this.lvlRing.material.opacity = Math.max(0, 1.0 - (this.ringScale / 4.0));
      if (this.ringScale >= 4.0) {
        this.lvlRing.visible = false;
      }
    }

    // --- Jump Physics ---
    if (this.isJumping) {
      this.velocityY -= this.gravity * delta;
      this.group.position.y += this.velocityY * delta;

      if (this.group.position.y <= this.groundY) {
        this.group.position.y = this.groundY;
        this.isJumping = false;
        this.velocityY = 0;
        if (window.soundEngine) window.soundEngine.playLand();
      }
    }

    // --- Water / Swimming Detection ---
    if (this.inWater) {
      this.isSwimming = true;
      this.group.position.y = -0.45; // submerged in river
      this.swimSplashTimer += delta;
      if (this.swimSplashTimer > 0.4 && (this.state === 'walk' || this.moveVector.lengthSq() > 0)) {
        this.swimSplashTimer = 0;
        if (window.soundEngine) window.soundEngine.playWaterSplash();
      }
    } else {
      this.isSwimming = false;
      if (!this.isJumping) {
        this.group.position.y = this.groundY;
      }
    }

    // --- Vehicle Speed Modifier ---
    let currentSpeed = this.speed;
    if (this.mountedVehicle === 'buggy') currentSpeed = 19.5;
    else if (this.mountedVehicle === 'sedan') currentSpeed = 16.0;
    else if (this.mountedVehicle === 'pickup') currentSpeed = 15.5;
    else if (this.mountedVehicle === 'quad') currentSpeed = 14.0;
    else if (this.mountedVehicle === 'bike') currentSpeed = 12.0;
    else if (this.mountedVehicle === 'cart') currentSpeed = 9.0;
    else if (this.mountedVehicle === 'tractor') currentSpeed = 7.5;
    else if (this.isSwimming) currentSpeed = 3.2;

    // --- Direct Move Vector & Target Movement ---
    let isMoving = false;
    if (this.moveVector && this.moveVector.lengthSq() > 0.01) {
      if (this.state === 'sit' || this.state === 'lie') this.standUp();
      isMoving = true;
      const move = this.moveVector.clone().normalize().multiplyScalar(currentSpeed * delta);
      this.group.position.add(move);

      const targetRot = Math.atan2(this.moveVector.x, this.moveVector.z);
      let diff = targetRot - this.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.group.rotation.y += diff * 12.0 * delta;
      this.state = 'walk';
    } else if (this.targetPos) {
      if (this.state === 'sit' || this.state === 'lie') this.standUp();
      const dir = new THREE.Vector3().subVectors(this.targetPos, this.group.position);
      dir.y = 0;
      const dist = dir.length();

      if (dist > 0.15) {
        isMoving = true;
        dir.normalize();
        this.group.position.addScaledVector(dir, currentSpeed * delta);

        const targetRot = Math.atan2(dir.x, dir.z);
        let diff = targetRot - this.group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.group.rotation.y += diff * 12.0 * delta;

        this.state = 'walk';
      } else {
        this.targetPos = null;
        if (this.state === 'walk') this.state = 'idle';
      }
    } else if (this.state === 'walk') {
      this.state = 'idle';
    }

    // --- Wheel Spin for Mounted Vehicles ---
    if (isMoving && this.mountedVehicle) {
      this.wheelRotation += delta * currentSpeed * 2.5;
      if (this.bikeWheels) this.bikeWheels.forEach(w => w.rotation.x = this.wheelRotation);
      if (this.tractorWheels) this.tractorWheels.forEach(w => w.rotation.x = this.wheelRotation);
      if (this.pickupWheels) this.pickupWheels.forEach(w => w.rotation.x = this.wheelRotation);
      if (this.buggyWheels) this.buggyWheels.forEach(w => w.rotation.x = this.wheelRotation);
      if (this.sedanWheels) this.sedanWheels.forEach(w => w.rotation.x = this.wheelRotation);
      if (this.quadWheels) this.quadWheels.forEach(w => w.rotation.x = this.wheelRotation);
      if (this.cartWheels) this.cartWheels.forEach(w => w.rotation.x = this.wheelRotation);
    }

    // --- Fishing State Machine ---
    if (this.isFishing) {
      this.fishingTimer += delta;
      if (this.fishingStage === 'casting' && this.fishingTimer > 0.6) {
        this.fishingStage = 'waiting';
        this.fishingTimer = 0;
      } else if (this.fishingStage === 'waiting' && this.fishingTimer > 2.2 + Math.random() * 1.5) {
        this.fishingStage = 'bite';
        this.fishingTimer = 0;
        if (window.soundEngine) window.soundEngine.playFishingBite();
        if (window.uiController) window.uiController.showFloatingText('🎣 Fish on the line! Reeling in!', window.innerWidth / 2, window.innerHeight / 2);
      } else if (this.fishingStage === 'bite' && this.fishingTimer > 1.2) {
        this.fishingStage = 'none';
        this.isFishing = false;
        this.fishingRodGroup.visible = false;
        if (window.soundEngine) window.soundEngine.playFishingCatch();
        if (this.onFishCaught) this.onFishCaught();
      }

      if (this.bobber) {
        this.bobber.position.y = Math.sin(Date.now() * 0.005) * 0.05 + (this.fishingStage === 'bite' ? -0.15 : 0);
      }
    }

    if (this.harvestTimer > 0) {
      this.harvestTimer -= delta;
      if (this.harvestTimer <= 0) {
        this.state = this.targetPos ? 'walk' : 'idle';
      }
    }

    // --- Procedural Animation Rigging ---
    if (this.mountedVehicle) {
      // Driving / Riding Sitting Pose
      const isBikeOrQuad = (this.mountedVehicle === 'bike' || this.mountedVehicle === 'quad');
      this.hips.position.y = isBikeOrQuad ? 1.02 : 0.72;
      this.torso.rotation.x = isBikeOrQuad ? 0.35 : 0.08;
      this.torso.rotation.y = 0;
      this.head.rotation.x = isBikeOrQuad ? -0.25 : 0;

      // Arms gripping handlebars / steering wheel
      this.leftArm.shoulder.rotation.set(-0.85, 0, -0.3);
      this.rightArm.shoulder.rotation.set(-0.85, 0, 0.3);
      this.leftArm.elbow.rotation.set(-0.4, 0, 0);
      this.rightArm.elbow.rotation.set(-0.4, 0, 0);

      if (this.mountedVehicle === 'bike' && isMoving) {
        // Pedaling motion
        const pedal = this.wheelRotation * 1.5;
        this.leftLeg.hip.rotation.set(0.6 + Math.sin(pedal) * 0.45, 0, 0);
        this.rightLeg.hip.rotation.set(0.6 - Math.sin(pedal) * 0.45, 0, 0);
        this.leftLeg.knee.rotation.set(0.8 - Math.sin(pedal) * 0.4, 0, 0);
        this.rightLeg.knee.rotation.set(0.8 + Math.sin(pedal) * 0.4, 0, 0);
      } else {
        // Seated feet forward
        this.leftLeg.hip.rotation.set(1.2, 0, -0.1);
        this.rightLeg.hip.rotation.set(1.2, 0, 0.1);
        this.leftLeg.knee.rotation.set(0.9, 0, 0);
        this.rightLeg.knee.rotation.set(0.9, 0, 0);
      }

    } else if (this.state === 'sit') {
      // Sitting down on chair / bench / ground
      this.hips.position.y = 0.55;
      this.torso.rotation.set(0.05, 0, 0);
      this.head.rotation.set(0, 0, 0);

      // Hands comfortably on lap
      this.leftArm.shoulder.rotation.set(-0.6, 0, -0.2);
      this.rightArm.shoulder.rotation.set(-0.6, 0, 0.2);
      this.leftArm.elbow.rotation.set(-0.8, 0, 0);
      this.rightArm.elbow.rotation.set(-0.8, 0, 0);

      // Legs bent forward 90 deg
      this.leftLeg.hip.rotation.set(1.4, 0, -0.1);
      this.rightLeg.hip.rotation.set(1.4, 0, 0.1);
      this.leftLeg.knee.rotation.set(1.45, 0, 0);
      this.rightLeg.knee.rotation.set(1.45, 0, 0);

    } else if (this.state === 'lie') {
      // Lying down flat on ground / bed
      this.hips.position.y = 0.16;
      this.torso.rotation.set(1.52, 0, 0);
      this.head.rotation.set(-0.4, 0, 0);

      // Arms relaxed to the side / chest
      this.leftArm.shoulder.rotation.set(-0.2, 0, -0.4);
      this.rightArm.shoulder.rotation.set(-0.2, 0, 0.4);
      this.leftArm.elbow.rotation.set(-0.3, 0, 0);
      this.rightArm.elbow.rotation.set(-0.3, 0, 0);

      // Legs straight
      this.leftLeg.hip.rotation.set(0.05, 0, -0.1);
      this.rightLeg.hip.rotation.set(0.05, 0, 0.1);
      this.leftLeg.knee.rotation.set(0.05, 0, 0);
      this.rightLeg.knee.rotation.set(0.05, 0, 0);

    } else if (this.isSwimming) {
      // Swimming Stroke Animation
      const strokeCycle = this.animTime * 1.8;
      this.hips.position.y = 0.45;
      this.torso.rotation.x = 1.1; // prone swimming angle
      this.head.rotation.x = -0.7;  // head looking up out of water

      // Crawl arm stroke
      const armSwing = Math.sin(strokeCycle);
      this.leftArm.shoulder.rotation.set(-1.8 + armSwing * 0.8, 0, -0.6);
      this.rightArm.shoulder.rotation.set(-1.8 - armSwing * 0.8, 0, 0.6);
      this.leftArm.elbow.rotation.set(-0.6, 0, 0);
      this.rightArm.elbow.rotation.set(-0.6, 0, 0);

      // Flutter kicking legs
      const legKick = Math.sin(strokeCycle * 2.5);
      this.leftLeg.hip.rotation.set(0.2 + legKick * 0.35, 0, 0);
      this.rightLeg.hip.rotation.set(0.2 - legKick * 0.35, 0, 0);
      this.leftLeg.knee.rotation.set(0.3, 0, 0);
      this.rightLeg.knee.rotation.set(0.3, 0, 0);

    } else if (this.isJumping) {
      // Airborne Jump Pose
      this.hips.position.y = 0.95;
      this.torso.rotation.x = 0.15;
      this.head.rotation.x = -0.15;

      // Arms raised outward
      this.leftArm.shoulder.rotation.set(-1.4, 0, -0.6);
      this.rightArm.shoulder.rotation.set(-1.4, 0, 0.6);
      this.leftArm.elbow.rotation.set(-0.3, 0, 0);
      this.rightArm.elbow.rotation.set(-0.3, 0, 0);

      // Legs bent back
      this.leftLeg.hip.rotation.set(0.4, 0, -0.15);
      this.rightLeg.hip.rotation.set(0.4, 0, 0.15);
      this.leftLeg.knee.rotation.set(0.85, 0, 0);
      this.rightLeg.knee.rotation.set(0.85, 0, 0);

    } else if (this.isFishing) {
      // Fishing Casting & Holding Pose
      this.hips.position.y = 0.95;
      this.torso.rotation.x = 0.1;
      this.head.rotation.x = -0.2;

      // Holding rod with two hands
      this.leftArm.shoulder.rotation.set(-0.9, 0, -0.2);
      this.rightArm.shoulder.rotation.set(-1.1, 0, 0.2);
      this.leftArm.elbow.rotation.set(-0.5, 0, 0);
      this.rightArm.elbow.rotation.set(-0.7, 0, 0);

      this.leftLeg.hip.rotation.set(0, 0, -0.1);
      this.rightLeg.hip.rotation.set(0, 0, 0.1);
      this.leftLeg.knee.rotation.set(0, 0, 0);
      this.rightLeg.knee.rotation.set(0, 0, 0);

    } else if (this.state === 'walk') {
      const walkCycle = this.animTime * 1.5;
      const swing = Math.sin(walkCycle);

      this.leftLeg.hip.rotation.x = swing * 0.65;
      this.rightLeg.hip.rotation.x = -swing * 0.65;
      this.leftLeg.knee.rotation.x = Math.max(0, -swing * 0.85);
      this.rightLeg.knee.rotation.x = Math.max(0, swing * 0.85);

      this.leftArm.shoulder.rotation.x = -swing * 0.6;
      this.rightArm.shoulder.rotation.x = swing * 0.6;
      this.leftArm.elbow.rotation.x = -Math.abs(swing) * 0.4;
      this.rightArm.elbow.rotation.x = -Math.abs(swing) * 0.4;

      this.hips.position.y = (0.95 + Math.abs(Math.sin(walkCycle * 2)) * 0.05);
      this.torso.rotation.y = swing * 0.12;
      this.head.rotation.y = -swing * 0.08;

      if (Math.abs(Math.sin(walkCycle)) > 0.95 && Math.random() < 0.25) {
        if (window.soundEngine) window.soundEngine.playStep();
      }

    } else if (this.state === 'harvest') {
      this.leftLeg.hip.rotation.set(0, 0, 0);
      this.rightLeg.hip.rotation.set(0, 0, 0);
      this.leftLeg.knee.rotation.set(0.15, 0, 0);
      this.rightLeg.knee.rotation.set(0.15, 0, 0);

      this.torso.rotation.x = 0.45;
      this.head.rotation.x = -0.3;
      this.leftArm.shoulder.rotation.set(-0.8, 0, -0.3);
      this.rightArm.shoulder.rotation.set(-0.8, 0, 0.3);
      this.leftArm.elbow.rotation.set(-0.6, 0, 0);
      this.rightArm.elbow.rotation.set(-0.6, 0, 0);

    } else if (this.state === 'plant') {
      this.hips.position.y = 0.78;
      this.leftLeg.hip.rotation.set(-0.3, 0, 0);
      this.rightLeg.hip.rotation.set(0.3, 0, 0);
      this.leftLeg.knee.rotation.set(0.6, 0, 0);
      this.rightLeg.knee.rotation.set(0.6, 0, 0);

      this.torso.rotation.x = 0.55;
      this.head.rotation.x = -0.4;
      this.leftArm.shoulder.rotation.set(-0.4, 0, -0.2);
      this.rightArm.shoulder.rotation.set(-0.7, 0, 0.3);
      this.leftArm.elbow.rotation.set(-0.5, 0, 0);
      this.rightArm.elbow.rotation.set(-0.8, 0, 0);

    } else if (this.state === 'cheer') {
      const cheerCycle = this.animTime * 2.0;
      this.hips.position.y = 0.95 + Math.abs(Math.sin(cheerCycle)) * 0.25;
      this.leftArm.shoulder.rotation.set(-2.6, 0, -0.4);
      this.rightArm.shoulder.rotation.set(-2.6, 0, 0.4);
      this.leftArm.elbow.rotation.set(-0.2, 0, 0);
      this.rightArm.elbow.rotation.set(-0.2, 0, 0);
      this.head.rotation.x = -0.4;

    } else {
      const breathCycle = this.animTime * 0.35;
      const breath = Math.sin(breathCycle);

      this.hips.position.y = 0.95 + breath * 0.015;
      this.torso.rotation.x = breath * 0.02;
      this.torso.rotation.y = Math.sin(breathCycle * 0.5) * 0.03;
      this.head.rotation.y = Math.sin(breathCycle * 0.4) * 0.05;

      this.leftArm.shoulder.rotation.set(0.05 + breath * 0.03, 0, -0.05);
      this.rightArm.shoulder.rotation.set(0.05 + breath * 0.03, 0, 0.05);
      this.leftArm.elbow.rotation.set(-0.1, 0, 0);
      this.rightArm.elbow.rotation.set(-0.1, 0, 0);

      this.leftLeg.hip.rotation.set(0, 0, -0.03);
      this.rightLeg.hip.rotation.set(0, 0, 0.03);
    }
  }
}

window.PlayerCharacter = PlayerCharacter;
