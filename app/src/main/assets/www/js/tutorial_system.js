// Step-by-Step Tutorial System for 3D Idle Farm Empire

class TutorialSystem {
  constructor(gameState, farmWorld, player, uiController) {
    this.gameState = gameState;
    this.farmWorld = farmWorld;
    this.player = player;
    this.uiController = uiController;

    this.steps = [
      {
        id: 'controls',
        stepNumber: 1,
        title: 'Explore Your Farm',
        icon: '🕹️',
        shortDesc: 'Move around using the joystick or tap the ground!',
        fullDesc: 'Welcome to your farm! Use the virtual joystick on the bottom-left or tap anywhere on the green grass to walk your farmer.',
        targetType: 'movement',
        targetPos: new THREE.Vector3(2, 0, 3),
        targetDomId: 'joystick-zone',
        reward: { coins: 50, xp: 15, text: '+50 🪙 Movement Mastered!' }
      },
      {
        id: 'harvest',
        stepNumber: 2,
        title: 'Harvest Ripe Crops',
        icon: '🌾',
        shortDesc: 'Walk up to Golden Wheat Field #1 to harvest it!',
        fullDesc: 'Your crops are ripe for picking! Walk up close to Wheat Field #1 (or tap on it directly) to automatically harvest golden wheat for coins.',
        targetType: 'plot_harvest',
        plotId: 0,
        targetPos: new THREE.Vector3(5, 0, -8),
        reward: { coins: 100, xp: 20, text: '+100 🪙 Golden Wheat Harvested!' }
      },
      {
        id: 'plant',
        stepNumber: 3,
        title: 'Sow Fresh Seeds',
        icon: '🌱',
        shortDesc: 'Step onto empty tilled soil to plant wheat seeds!',
        fullDesc: 'Keep your farm producing! Step onto the empty tilled soil (or tap it) to sow fresh seeds and watch them grow.',
        targetType: 'plot_plant',
        plotId: 0,
        targetPos: new THREE.Vector3(5, 0, -8),
        reward: { coins: 100, xp: 25, text: '+100 🪙 Fresh Seeds Sown!' }
      },
      {
        id: 'hire_worker',
        stepNumber: 4,
        title: 'Hire First Worker',
        icon: '👥',
        shortDesc: 'Open Staff menu and hire Farmer Jack!',
        fullDesc: 'Automate your empire! Tap the "Staff" icon on the bottom menu and hire "Farmer Jack" to plant and harvest crops automatically.',
        targetType: 'hire_farmer',
        targetDomId: 'nav-btn-workers',
        modalHighlightId: 'hire-worker-farmer',
        reward: { coins: 350, xp: 35, text: '+350 🪙 Auto-Harvest Activated!' }
      },
      {
        id: 'upgrade_house',
        stepNumber: 5,
        title: 'Upgrade Farmhouse',
        icon: '🏡',
        shortDesc: 'Tap "UPGRADE" and expand your Country House!',
        fullDesc: 'Expand your headquarters! Tap the big glowing "UPGRADE" button and upgrade your Small Cabin to Stage 2 Country House for a +25% income boost!',
        targetType: 'upgrade_house',
        targetPos: new THREE.Vector3(-4.5, 0, -4.5),
        targetDomId: 'nav-btn-upgrade',
        modalHighlightId: 'up-btn-house',
        reward: { coins: 500, gems: 15, xp: 50, text: '🎉 Farmhouse Upgraded! +500 🪙 +15 💎' }
      }
    ];

    this.currentStepIdx = this.gameState.tutorialStep || 0;
    this.isActive = !this.gameState.tutorialCompleted && this.gameState.tutorialActive;
    this.initialPlayerPos = null;
    this.beaconGroup = null;

    this.createBeacon();
    this.createDomOverlay();

    if (this.isActive) {
      this.startStep(this.currentStepIdx);
    }
  }

  createBeacon() {
    // 3D Waypoint Visual Cue: Floating bouncing golden beacon arrow + ground halo
    this.beaconGroup = new THREE.Group();
    this.beaconGroup.visible = false;

    // Glowing Arrow
    const arrowGeo = new THREE.ConeGeometry(0.5, 1.2, 5);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b, wireframe: false });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMesh.rotation.x = Math.PI; // point down
    arrowMesh.position.y = 2.4;
    this.beaconGroup.add(arrowMesh);
    this.beaconArrow = arrowMesh;

    // Diamond Crown on arrow
    const crownGeo = new THREE.OctahedronGeometry(0.3, 0);
    const crownMat = new THREE.MeshBasicMaterial({ color: 0x76ff03 });
    const crownMesh = new THREE.Mesh(crownGeo, crownMat);
    crownMesh.position.y = 3.2;
    this.beaconGroup.add(crownMesh);
    this.beaconCrown = crownMesh;

    // Ground Target Ring
    const ringGeo = new THREE.RingGeometry(1.2, 1.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd54f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.08;
    this.beaconGroup.add(ringMesh);
    this.beaconRing = ringMesh;

    // Outer Pulsing Ring
    const outerRingGeo = new THREE.RingGeometry(1.8, 2.0, 24);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x76ff03,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = -Math.PI / 2;
    outerRingMesh.position.y = 0.06;
    this.beaconGroup.add(outerRingMesh);
    this.beaconOuterRing = outerRingMesh;

    if (this.farmWorld && this.farmWorld.scene) {
      this.farmWorld.scene.add(this.beaconGroup);
    }
  }

  createDomOverlay() {
    let overlay = document.getElementById('tutorial-card');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tutorial-card';
      overlay.className = 'tutorial-card';
      overlay.innerHTML = `
        <div class="tutorial-header">
          <div class="tutorial-step-tag">
            <span class="tutorial-badge" id="tut-step-badge">STEP 1/5</span>
            <div class="tutorial-dots" id="tut-dots">
              <span class="dot active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <button class="tutorial-skip-btn" id="tut-skip-btn" title="Skip Tutorial">Skip ✕</button>
        </div>
        <div class="tutorial-content">
          <div class="tutorial-icon-box" id="tut-icon">🕹️</div>
          <div class="tutorial-text-wrap">
            <h3 class="tutorial-title" id="tut-title">Explore Your Farm</h3>
            <p class="tutorial-desc" id="tut-desc">Use the joystick on the left or tap the ground to walk around!</p>
          </div>
        </div>
        <div class="tutorial-footer">
          <div class="tutorial-progress-bar">
            <div class="tutorial-progress-fill" id="tut-progress-fill"></div>
          </div>
          <div class="tutorial-hint" id="tut-hint">👉 Move your character to proceed</div>
        </div>
      `;

      const gameContainer = document.getElementById('game-container');
      if (gameContainer) {
        gameContainer.appendChild(overlay);
      } else {
        document.body.appendChild(overlay);
      }

      const skipBtn = document.getElementById('tut-skip-btn');
      if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.skipTutorial();
        });
      }
    }
    this.overlayEl = overlay;
  }

  startStep(stepIdx) {
    if (stepIdx >= this.steps.length) {
      this.completeTutorial();
      return;
    }

    this.currentStepIdx = stepIdx;
    this.gameState.tutorialStep = stepIdx;
    this.gameState.save();

    const step = this.steps[stepIdx];

    // Update UI elements
    const badge = document.getElementById('tut-step-badge');
    const title = document.getElementById('tut-title');
    const desc = document.getElementById('tut-desc');
    const icon = document.getElementById('tut-icon');
    const hint = document.getElementById('tut-hint');
    const fill = document.getElementById('tut-progress-fill');
    const dots = document.getElementById('tut-dots');

    if (badge) badge.textContent = `STEP ${step.stepNumber}/${this.steps.length}`;
    if (title) title.textContent = step.title;
    if (desc) desc.textContent = step.fullDesc;
    if (icon) icon.textContent = step.icon;
    if (hint) hint.textContent = `🎯 ${step.shortDesc}`;
    if (fill) fill.style.width = `${((stepIdx + 1) / this.steps.length) * 100}%`;

    if (dots) {
      const dotEls = dots.querySelectorAll('.dot');
      dotEls.forEach((d, i) => {
        d.classList.toggle('active', i === stepIdx);
        d.classList.toggle('done', i < stepIdx);
      });
    }

    if (this.overlayEl) {
      this.overlayEl.style.display = 'block';
      this.overlayEl.classList.remove('pulse-celebrate');
      void this.overlayEl.offsetWidth;
      this.overlayEl.classList.add('step-enter');
    }

    // Clear previous DOM highlights
    this.clearDomHighlights();

    // Setup visual cues based on step type
    if (step.targetPos) {
      this.beaconGroup.position.copy(step.targetPos);
      this.beaconGroup.visible = true;
    } else {
      this.beaconGroup.visible = false;
    }

    // Highlight DOM elements
    if (step.targetDomId) {
      const el = document.getElementById(step.targetDomId);
      if (el) {
        el.classList.add('tutorial-pulse-target');
      }
    }

    // Setup tracking variables
    if (step.id === 'controls') {
      if (this.player && this.player.group) {
        this.initialPlayerPos = this.player.group.position.clone();
      }
      this.movementDistance = 0;
    } else if (step.id === 'harvest') {
      // Ensure Plot 0 is unlocked and ready for harvesting!
      if (this.farmWorld && this.farmWorld.plots[0]) {
        const p0 = this.farmWorld.plots[0];
        p0.unlocked = true;
        p0.growth = 1.0;
        p0.ready = true;
        p0.state = 'ready';
        if (p0.crops) {
          p0.crops.forEach(c => {
            c.scale.set(1.0, 1.0, 1.0);
            c.position.y = 0.18;
          });
        }
      }
    } else if (step.id === 'plant') {
      // If Plot 0 is still ready or growing, wait for harvest; or ensure plot 0 is empty
      if (this.farmWorld && this.farmWorld.plots[0]) {
        const p0 = this.farmWorld.plots[0];
        if (p0.ready) {
          // If not harvested yet, player harvests first
        }
      }
    } else if (step.id === 'hire_worker') {
      // Ensure player has sufficient funds to hire Farmer Jack without grinding
      if (this.gameState.coins < 250) {
        this.gameState.coins = 250;
        if (this.uiController) this.uiController.updateTopBar();
      }
    } else if (step.id === 'upgrade_house') {
      // Ensure player has sufficient funds to upgrade farmhouse (500 coins)
      if (this.gameState.coins < 520) {
        this.gameState.coins = 520;
        if (this.uiController) this.uiController.updateTopBar();
      }
    }
  }

  clearDomHighlights() {
    document.querySelectorAll('.tutorial-pulse-target').forEach(el => {
      el.classList.remove('tutorial-pulse-target');
    });
  }

  onPlayerMove(deltaDistance) {
    if (!this.isActive) return;
    const currentStep = this.steps[this.currentStepIdx];
    if (currentStep && currentStep.id === 'controls') {
      this.movementDistance = (this.movementDistance || 0) + deltaDistance;
      if (this.movementDistance > 2.5) {
        this.completeCurrentStep();
      }
    }
  }

  onPlotHarvested(plotId) {
    if (!this.isActive) return;
    const currentStep = this.steps[this.currentStepIdx];
    if (currentStep && currentStep.id === 'harvest') {
      this.completeCurrentStep();
    }
  }

  onPlotPlanted(plotId) {
    if (!this.isActive) return;
    const currentStep = this.steps[this.currentStepIdx];
    if (currentStep && currentStep.id === 'plant') {
      this.completeCurrentStep();
    }
  }

  onWorkerHired(workerKey) {
    if (!this.isActive) return;
    const currentStep = this.steps[this.currentStepIdx];
    if (currentStep && currentStep.id === 'hire_worker' && workerKey === 'farmer') {
      this.completeCurrentStep();
    }
  }

  onFarmhouseUpgraded(newLevel) {
    if (!this.isActive) return;
    const currentStep = this.steps[this.currentStepIdx];
    if (currentStep && currentStep.id === 'upgrade_house' && newLevel >= 2) {
      this.completeCurrentStep();
    }
  }

  completeCurrentStep() {
    const step = this.steps[this.currentStepIdx];
    if (!step) return;

    // Step completion rewards
    if (step.reward) {
      if (step.reward.coins) this.gameState.coins += step.reward.coins;
      if (step.reward.gems) this.gameState.gems += step.reward.gems;
      if (step.reward.xp) this.gameState.addXP(step.reward.xp);
      this.gameState.save();

      if (this.uiController) {
        this.uiController.updateTopBar();
        this.uiController.showFloatingText(`✨ ${step.reward.text}`, window.innerWidth / 2, window.innerHeight / 2 - 50);
      }
    }

    if (window.soundEngine && window.soundEngine.playTutorialStep) {
      window.soundEngine.playTutorialStep();
    } else if (window.soundEngine && window.soundEngine.playLevelUp) {
      window.soundEngine.playLevelUp();
    }

    // Celebration visual on tutorial card
    if (this.overlayEl) {
      this.overlayEl.classList.add('pulse-celebrate');
    }

    // Advance to next step after brief delay
    setTimeout(() => {
      this.startStep(this.currentStepIdx + 1);
    }, 1200);
  }

  completeTutorial() {
    this.isActive = false;
    this.gameState.tutorialCompleted = true;
    this.gameState.tutorialActive = false;
    this.gameState.save();

    this.clearDomHighlights();
    if (this.beaconGroup) {
      this.beaconGroup.visible = false;
    }

    if (this.overlayEl) {
      this.overlayEl.style.display = 'none';
    }

    // Celebration Popup
    this.showCompletionModal();
  }

  showCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'popup-modal tutorial-complete-modal';
    modal.innerHTML = `
      <div class="popup-card tutorial-complete-card">
        <div class="popup-icon">🌾🎉👑</div>
        <h2 class="popup-title">Tutorial Complete!</h2>
        <p class="popup-desc">You've mastered the fundamentals of running your farm empire! Your automated staff and expanded farmhouse are now thriving.</p>
        <div class="tutorial-reward-summary">
          <div class="tut-reward-item">
            <span class="tut-reward-icon">🪙</span>
            <span class="tut-reward-num">+500 Coins</span>
          </div>
          <div class="tut-reward-item">
            <span class="tut-reward-icon">💎</span>
            <span class="tut-reward-num">+15 Gems</span>
          </div>
          <div class="tut-reward-item">
            <span class="tut-reward-icon">🐄</span>
            <span class="tut-reward-num">Breeding Unlocked</span>
          </div>
        </div>
        <button class="claim-btn" id="tut-finish-btn">Build My Empire! 🚀</button>
      </div>
    `;

    document.body.appendChild(modal);

    const finishBtn = modal.querySelector('#tut-finish-btn');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        if (window.soundEngine && window.soundEngine.playCoin) {
          window.soundEngine.playCoin();
        }
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
        if (this.uiController) {
          this.uiController.showFloatingText('🌟 Farm Empire is in Your Hands!', window.innerWidth / 2, window.innerHeight / 2 - 50);
        }
      });
    }
  }

  skipTutorial() {
    this.isActive = false;
    this.gameState.tutorialCompleted = true;
    this.gameState.tutorialActive = false;
    this.gameState.save();

    this.clearDomHighlights();
    if (this.beaconGroup) {
      this.beaconGroup.visible = false;
    }
    if (this.overlayEl) {
      this.overlayEl.style.display = 'none';
    }

    if (this.uiController) {
      this.uiController.showFloatingText('Tutorial Skipped. Have fun farming! 🌾', window.innerWidth / 2, window.innerHeight / 2 - 50);
    }
  }

  restartTutorial() {
    this.isActive = true;
    this.gameState.tutorialCompleted = false;
    this.gameState.tutorialActive = true;
    this.currentStepIdx = 0;
    this.startStep(0);
  }

  update(delta) {
    // Animate 3D Waypoint Beacon
    if (this.beaconGroup && this.beaconGroup.visible) {
      const t = Date.now() * 0.003;
      if (this.beaconArrow) {
        this.beaconArrow.position.y = 2.4 + Math.sin(t * 2) * 0.35;
        this.beaconArrow.rotation.y += delta * 1.5;
      }
      if (this.beaconCrown) {
        this.beaconCrown.position.y = 3.2 + Math.sin(t * 2) * 0.35;
        this.beaconCrown.rotation.y -= delta * 2.0;
      }
      if (this.beaconRing) {
        this.beaconRing.rotation.z += delta * 0.8;
      }
      if (this.beaconOuterRing) {
        this.beaconOuterRing.rotation.z -= delta * 0.5;
        const scale = 1.0 + Math.sin(t * 2) * 0.15;
        this.beaconOuterRing.scale.set(scale, scale, 1);
      }
    }
  }
}

window.TutorialSystem = TutorialSystem;
