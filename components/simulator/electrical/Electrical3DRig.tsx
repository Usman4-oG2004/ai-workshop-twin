'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type ElectricalFaultMode = 'none' | 'short-ln' | 'open-neutral' | 'no-earth';

export interface Electrical3DState {
  mainIsolatorOn: boolean;
  mcb6AOn: boolean;
  wallSwitchOn: boolean;
  wiredSteps: number; // 0 to 4
  faultMode: ElectricalFaultMode;
  safeIsolated: boolean;
  cameraPreset: '3/4' | 'front' | 'cu' | 'switch';
  labelsVisible: boolean;
}

interface Electrical3DRigProps {
  state: Electrical3DState;
  onToggleMainIsolator: () => void;
  onToggleMcb: () => void;
  onToggleWallSwitch: () => void;
  onSelectPart?: (partName: string) => void;
}

export default function Electrical3DRig({
  state,
  onToggleMainIsolator,
  onToggleMcb,
  onToggleWallSwitch,
  onSelectPart,
}: Electrical3DRigProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const partsRef = useRef<{
    mainToggle?: THREE.Mesh;
    mcbToggle?: THREE.Mesh;
    rockerMesh?: THREE.Mesh;
    bulbMat?: THREE.MeshStandardMaterial;
    bulbLight?: THREE.PointLight;
    wireGroups: THREE.Group[];
    interactiveMeshes: { mesh: THREE.Object3D; action: string; label: string }[];
  }>({ wireGroups: [], interactiveMeshes: [] });

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#E8E3D9');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.4, 1.8, 4.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.6;
    controls.maxDistance = 7.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 0.95, 0);
    controlsRef.current = controls;

    // Studio / Workshop Lighting
    const ambient = new THREE.AmbientLight('#FFFDF8', 0.75);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight('#FFF7ED', 1.35);
    keyLight.position.set(3.5, 5.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#E0F2FE', 0.45);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    // ─── Oak Workbench Top ───
    const benchGeo = new THREE.BoxGeometry(5.2, 0.14, 2.2);
    const benchMat = new THREE.MeshStandardMaterial({ color: '#B08968', roughness: 0.72, metalness: 0.05 });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, -0.07, 0.4);
    bench.receiveShadow = true;
    scene.add(bench);

    // Cutting / Test Mat on Bench
    const matGeo = new THREE.BoxGeometry(2.6, 0.012, 1.1);
    const matMat = new THREE.MeshStandardMaterial({ color: '#273036', roughness: 0.85 });
    const mat = new THREE.Mesh(matGeo, matMat);
    mat.position.set(0, 0.006, 0.55);
    mat.receiveShadow = true;
    scene.add(mat);

    // ─── Timber & Plasterboard Training Bay Wall ───
    const wallGeo = new THREE.BoxGeometry(4.4, 2.4, 0.12);
    const wallMat = new THREE.MeshStandardMaterial({ color: '#D6D1C7', roughness: 0.9 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 1.2, -0.25);
    wall.receiveShadow = true;
    scene.add(wall);

    // Timber Stud Frame border
    const studMat = new THREE.MeshStandardMaterial({ color: '#8C6239', roughness: 0.8 });
    const leftStud = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.16), studMat);
    leftStud.position.set(-2.2, 1.2, -0.24);
    const rightStud = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.16), studMat);
    rightStud.position.set(2.2, 1.2, -0.24);
    const topStud = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 0.16), studMat);
    topStud.position.set(0, 2.4, -0.24);
    scene.add(leftStud, rightStud, topStud);

    // ─── 1. 4-Way Metal Consumer Unit (BS 7671) ───
    const cuGroup = new THREE.Group();
    cuGroup.position.set(-1.05, 1.45, -0.14);

    const cuBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.56, 0.16),
      new THREE.MeshStandardMaterial({ color: '#E4E4E7', roughness: 0.4, metalness: 0.35 })
    );
    cuBox.castShadow = true;
    cuGroup.add(cuBox);

    // Dark DIN rail recess
    const recess = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.34, 0.02),
      new THREE.MeshStandardMaterial({ color: '#27272A', roughness: 0.6 })
    );
    recess.position.set(0, -0.02, 0.08);
    cuGroup.add(recess);

    // Main Isolator Switch (100A DP - Red)
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.24, 0.08),
      new THREE.MeshStandardMaterial({ color: '#F4F4F5', roughness: 0.35 })
    );
    mainBody.position.set(-0.28, -0.02, 0.11);
    cuGroup.add(mainBody);

    const mainToggle = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.04, 0.06),
      new THREE.MeshStandardMaterial({ color: '#B91C1C', roughness: 0.3 })
    );
    mainToggle.position.set(-0.28, -0.02, 0.16);
    cuGroup.add(mainToggle);
    partsRef.current.mainToggle = mainToggle;
    partsRef.current.interactiveMeshes.push({ mesh: mainToggle, action: 'main', label: '100A Main Isolator Switch' });
    partsRef.current.interactiveMeshes.push({ mesh: mainBody, action: 'main', label: '100A Main Isolator Switch' });

    // 30mA RCD
    const rcdBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.24, 0.08),
      new THREE.MeshStandardMaterial({ color: '#F4F4F5', roughness: 0.35 })
    );
    rcdBody.position.set(-0.11, -0.02, 0.11);
    cuGroup.add(rcdBody);
    const rcdTestBtn = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.03, 0.02),
      new THREE.MeshStandardMaterial({ color: '#1D4ED8' })
    );
    rcdTestBtn.position.set(-0.11, 0.05, 0.155);
    cuGroup.add(rcdTestBtn);

    // 6A Lighting MCB
    const mcbBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.24, 0.08),
      new THREE.MeshStandardMaterial({ color: '#F4F4F5', roughness: 0.35 })
    );
    mcbBody.position.set(0.06, -0.02, 0.11);
    cuGroup.add(mcbBody);

    const mcbToggle = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.035, 0.06),
      new THREE.MeshStandardMaterial({ color: '#B45309', roughness: 0.3 })
    );
    mcbToggle.position.set(0.06, -0.02, 0.16);
    cuGroup.add(mcbToggle);
    partsRef.current.mcbToggle = mcbToggle;
    partsRef.current.interactiveMeshes.push({ mesh: mcbToggle, action: 'mcb', label: '6A Type B Lighting MCB' });
    partsRef.current.interactiveMeshes.push({ mesh: mcbBody, action: 'mcb', label: '6A Type B Lighting MCB' });

    // Neutral & Earth Brass Busbars
    const neutralBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.04, 0.03),
      new THREE.MeshStandardMaterial({ color: '#D97706', metalness: 0.7, roughness: 0.25 })
    );
    neutralBar.position.set(0.26, 0.08, 0.1);
    cuGroup.add(neutralBar);

    const earthBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.04, 0.03),
      new THREE.MeshStandardMaterial({ color: '#CA8A04', metalness: 0.7, roughness: 0.25 })
    );
    earthBar.position.set(0.26, -0.1, 0.1);
    cuGroup.add(earthBar);

    scene.add(cuGroup);

    // ─── 2. 1-Gang Wall Switch (Galvanized Backbox + White Faceplate) ───
    const swGroup = new THREE.Group();
    swGroup.position.set(-0.2, 0.72, -0.15);

    const swBackbox = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.26, 0.08),
      new THREE.MeshStandardMaterial({ color: '#94A3B8', metalness: 0.6, roughness: 0.4 })
    );
    swBackbox.castShadow = true;
    swGroup.add(swBackbox);

    const swPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.28, 0.02),
      new THREE.MeshStandardMaterial({ color: '#FAF8F3', roughness: 0.3 })
    );
    swPlate.position.set(0, 0, 0.045);
    swGroup.add(swPlate);

    const rockerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.12, 0.03),
      new THREE.MeshStandardMaterial({ color: '#F4F4F5', roughness: 0.25 })
    );
    rockerMesh.position.set(0, 0, 0.06);
    swGroup.add(rockerMesh);
    partsRef.current.rockerMesh = rockerMesh;
    partsRef.current.interactiveMeshes.push({ mesh: rockerMesh, action: 'switch', label: '1-Gang 10AX Wall Switch' });
    partsRef.current.interactiveMeshes.push({ mesh: swPlate, action: 'switch', label: '1-Gang 10AX Wall Switch' });

    scene.add(swGroup);

    // ─── 3. Ceiling Rose / Bulkhead Luminaire ───
    const lightGroup = new THREE.Group();
    lightGroup.position.set(0.95, 1.65, -0.14);

    const baseHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.26, 0.07, 32),
      new THREE.MeshStandardMaterial({ color: '#F4F4F5', roughness: 0.4 })
    );
    baseHousing.rotation.x = Math.PI / 2;
    baseHousing.castShadow = true;
    lightGroup.add(baseHousing);

    const bulbMat = new THREE.MeshStandardMaterial({
      color: '#E4E4E7',
      emissive: '#F59E0B',
      emissiveIntensity: 0,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    const diffuser = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), bulbMat);
    diffuser.rotation.x = Math.PI / 2;
    diffuser.position.set(0, 0, 0.03);
    lightGroup.add(diffuser);
    partsRef.current.bulbMat = bulbMat;

    const bulbLight = new THREE.PointLight('#FCD34D', 0, 4.5);
    bulbLight.position.set(0, 0, 0.35);
    lightGroup.add(bulbLight);
    partsRef.current.bulbLight = bulbLight;
    partsRef.current.interactiveMeshes.push({ mesh: diffuser, action: 'info', label: '230V LED Bulkhead Luminaire (6W)' });

    scene.add(lightGroup);

    // ─── 4. Digital Multifunction Tester (MFT) on Bench ───
    const mftGroup = new THREE.Group();
    mftGroup.position.set(0.8, 0.06, 0.55);
    mftGroup.rotation.y = -0.25;

    const mftBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.1, 0.48),
      new THREE.MeshStandardMaterial({ color: '#D97706', roughness: 0.5 })
    );
    mftBody.castShadow = true;
    mftGroup.add(mftBody);

    const mftScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.01, 0.16),
      new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.2 })
    );
    mftScreen.position.set(0, 0.052, -0.1);
    mftGroup.add(mftScreen);

    const mftDial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.025, 24),
      new THREE.MeshStandardMaterial({ color: '#18181B', roughness: 0.4 })
    );
    mftDial.position.set(0, 0.055, 0.08);
    mftGroup.add(mftDial);
    partsRef.current.interactiveMeshes.push({ mesh: mftBody, action: 'info', label: 'BS 7671 Multifunction Loop Tester' });
    scene.add(mftGroup);

    // ─── 5. BS 6004 Twin & Earth 3D Cable Paths (4 Wiring Stages) ───
    const makeCable = (points: THREE.Vector3[], color: string) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 32, 0.014, 8, false);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.45 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      return mesh;
    };

    // Stage 1: Brown Live Feed (6A MCB -> Switch COM)
    const stage1 = new THREE.Group();
    stage1.add(
      makeCable(
        [
          new THREE.Vector3(-0.99, 1.3, -0.06),
          new THREE.Vector3(-0.99, 0.95, -0.08),
          new THREE.Vector3(-0.22, 0.95, -0.08),
          new THREE.Vector3(-0.22, 0.76, -0.11),
        ],
        '#7C2D12' // Brown Line
      )
    );
    scene.add(stage1);

    // Stage 2: Brown Switched Live (Switch L1 -> Luminaire L)
    const stage2 = new THREE.Group();
    stage2.add(
      makeCable(
        [
          new THREE.Vector3(-0.16, 0.76, -0.11),
          new THREE.Vector3(0.35, 0.76, -0.12),
          new THREE.Vector3(0.35, 1.65, -0.12),
          new THREE.Vector3(0.88, 1.65, -0.11),
        ],
        '#9A3412' // Switched Line
      )
    );
    scene.add(stage2);

    // Stage 3: Blue Neutral Return (Luminaire N -> CU Neutral Bar)
    const stage3 = new THREE.Group();
    stage3.add(
      makeCable(
        [
          new THREE.Vector3(0.95, 1.72, -0.11),
          new THREE.Vector3(0.95, 1.92, -0.12),
          new THREE.Vector3(-0.79, 1.92, -0.12),
          new THREE.Vector3(-0.79, 1.54, -0.06),
        ],
        '#1D4ED8' // Blue Neutral
      )
    );
    scene.add(stage3);

    // Stage 4: Green/Yellow CPC Earth (CU Earth Bar -> Switch Backbox & Luminaire)
    const stage4 = new THREE.Group();
    stage4.add(
      makeCable(
        [
          new THREE.Vector3(-0.79, 1.35, -0.06),
          new THREE.Vector3(-0.6, 1.05, -0.12),
          new THREE.Vector3(-0.28, 0.65, -0.12),
        ],
        '#15803D' // Green/Yellow CPC
      )
    );
    stage4.add(
      makeCable(
        [
          new THREE.Vector3(-0.79, 1.35, -0.06),
          new THREE.Vector3(0.45, 1.82, -0.14),
          new THREE.Vector3(0.92, 1.78, -0.12),
        ],
        '#15803D'
      )
    );
    scene.add(stage4);

    partsRef.current.wireGroups = [stage1, stage2, stage3, stage4];

    // Raycaster for direct 3D clicking on breakers & switches
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const targets = partsRef.current.interactiveMeshes.map((i) => i.mesh);
      const hits = raycaster.intersectObjects(targets, false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const found = partsRef.current.interactiveMeshes.find((i) => i.mesh === hitObj);
        renderer.domElement.style.cursor = 'pointer';
        setHoveredLabel(found?.label || null);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredLabel(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const targets = partsRef.current.interactiveMeshes.map((i) => i.mesh);
      const hits = raycaster.intersectObjects(targets, false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const found = partsRef.current.interactiveMeshes.find((i) => i.mesh === hitObj);
        if (found?.action === 'main') onToggleMainIsolator();
        else if (found?.action === 'mcb') onToggleMcb();
        else if (found?.action === 'switch') onToggleWallSwitch();
        if (found && onSelectPart) onSelectPart(found.label);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update 3D State (Switches, Cables, Luminaire Glow, Camera Presets)
  useEffect(() => {
    const { mainToggle, mcbToggle, rockerMesh, bulbMat, bulbLight, wireGroups } = partsRef.current;

    if (mainToggle) {
      mainToggle.rotation.x = state.mainIsolatorOn ? -0.45 : 0.45;
      mainToggle.position.y = state.mainIsolatorOn ? 0.01 : -0.05;
    }
    if (mcbToggle) {
      const mcbLive = state.mcb6AOn && state.faultMode !== 'short-ln';
      mcbToggle.rotation.x = mcbLive ? -0.45 : 0.45;
      mcbToggle.position.y = mcbLive ? 0.01 : -0.05;
    }
    if (rockerMesh) {
      rockerMesh.rotation.x = state.wallSwitchOn ? -0.22 : 0.22;
    }

    wireGroups.forEach((grp, idx) => {
      grp.visible = idx < state.wiredSteps;
    });

    const fullyWired = state.wiredSteps >= 3; // L, Switched L, N connected
    const circuitEnergized =
      fullyWired &&
      state.mainIsolatorOn &&
      state.mcb6AOn &&
      state.wallSwitchOn &&
      state.faultMode === 'none';

    if (bulbMat && bulbLight) {
      bulbMat.emissiveIntensity = circuitEnergized ? 1.8 : 0;
      bulbLight.intensity = circuitEnergized ? 2.6 : 0;
    }
  }, [state]);

  // Camera presets
  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    if (state.cameraPreset === '3/4') {
      cam.position.set(2.4, 1.8, 4.4);
      ctrl.target.set(0, 0.95, 0);
    } else if (state.cameraPreset === 'front') {
      cam.position.set(0, 1.2, 4.3);
      ctrl.target.set(0, 1.1, -0.1);
    } else if (state.cameraPreset === 'cu') {
      cam.position.set(-0.9, 1.5, 1.8);
      ctrl.target.set(-1.05, 1.45, -0.14);
    } else if (state.cameraPreset === 'switch') {
      cam.position.set(0.1, 0.85, 1.6);
      ctrl.target.set(-0.2, 0.72, -0.15);
    }
    ctrl.update();
  }, [state.cameraPreset]);

  return (
    <div className="relative w-full h-[540px] rounded-workshop border border-workshop-border overflow-hidden bg-[#E8E3D9]">
      <div ref={containerRef} className="w-full h-full" />

      {/* Hovered Component Callout */}
      {hoveredLabel && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 frost-panel text-xs font-mono text-ink">
          {hoveredLabel} &mdash; Click to toggle
        </div>
      )}

      {/* Drag Hint */}
      <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 frost-panel text-[10px] font-mono text-ink-muted">
        Drag to orbit 3D bay &bull; Scroll to zoom &bull; Click breakers or switch directly
      </div>
    </div>
  );
}
