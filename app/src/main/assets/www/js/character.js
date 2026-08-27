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
    this.speed = 4.8;
    this.state = 'idle'; // 'idle', 'walk', 'harvest', 'cheer'
    this.animTime = 0;
    this.harvestTimer = 0;

    // Materials Palette matching the character
    this.materials = {
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
      goldAura: new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    };

    this.buildCharacter();
    this.buildLevelUpFX();
    this.scene.add(this.group);

    // Initial position on farm
    this.group.position.set(0, 0, 2);
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

  triggerCheer() {
    this.state = 'cheer';
    this.harvestTimer = 1.2;
    if (window.soundEngine) window.soundEngine.playLevelUp();
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

    // Movement toward target
    if (this.targetPos) {
      const dir = new THREE.Vector3().subVectors(this.targetPos, this.group.position);
      dir.y = 0;
      const dist = dir.length();

      if (dist > 0.15) {
        dir.normalize();
        this.group.position.addScaledVector(dir, this.speed * delta);

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
    }

    if (this.harvestTimer > 0) {
      this.harvestTimer -= delta;
      if (this.harvestTimer <= 0) {
        this.state = this.targetPos ? 'walk' : 'idle';
      }
    }

    // Procedural Animation States
    if (this.state === 'walk') {
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
