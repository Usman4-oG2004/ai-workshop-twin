'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type PlumbingFaultMode = 'none' | 'loose-olive' | 'no-trap';

export interface Plumbing3DState {
  valveOpen: boolean;
  pressureBar: number; // 0 to 6.0 Bar
  assembledSteps: number; // 0 to 4
  jointsTorqued: boolean;
  faultMode: PlumbingFaultMode;
  cameraPreset: '3/4' | 'front' | 'valve' | 'trap';
}

interface Plumbing3DRigProps {
  state: Plumbing3DState;
  onToggleValve: () => void;
  onTorqueJoints: () => void;
}

export default function Plumbing3DRig({
  state,
  onToggleValve,
  onTorqueJoints,
}: Plumbing3DRigProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const partsRef = useRef<{
    valveLever?: THREE.Mesh;
    gaugeNeedle?: THREE.Mesh;
    stageGroups: THREE.Group[];
    leakDrops: THREE.Mesh[];
    interactiveMeshes: { mesh: THREE.Object3D; action: string; label: string }[];
  }>({ stageGroups: [], leakDrops: [], interactiveMeshes: [] });

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#E8E3D9');

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.2, 1.5, 4.1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.4;
    controls.maxDistance = 7;
    controls.target.set(0, 0.95, 0);
    controlsRef.current = controls;

    // Workshop Lighting
    scene.add(new THREE.AmbientLight('#FFFDF8', 0.8));
    const key = new THREE.DirectionalLight('#FFFFFF', 1.25);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    scene.add(key);

    // Timber Floor & Ceramic Tiled Utility Wall
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 0.14, 2.2),
      new THREE.MeshStandardMaterial({ color: '#9CA3AF', roughness: 0.7 })
    );
    floor.position.set(0, -0.07, 0.4);
    floor.receiveShadow = true;
    scene.add(floor);

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.4, 0.12),
      new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.45 })
    );
    wall.position.set(0, 1.2, -0.25);
    wall.receiveShadow = true;
    scene.add(wall);

    // Tile grid lines on wall
    const gridHelper = new THREE.GridHelper(4.0, 16, '#CBD5E1', '#CBD5E1');
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 1.2, -0.188);
    scene.add(gridHelper);

    // Materials: Brushed Copper, Brass, Chrome, White Polypropylene
    const copperMat = new THREE.MeshStandardMaterial({ color: '#B87333', metalness: 0.75, roughness: 0.28 });
    const brassMat = new THREE.MeshStandardMaterial({ color: '#C59B27', metalness: 0.8, roughness: 0.25 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: '#E2E8F0', metalness: 0.9, roughness: 0.15 });
    const pvcMat = new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.35 });

    // ─── Ceramic Basin Rim (Top Right) ───
    const basin = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.24, 0.65),
      new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.2 })
    );
    basin.position.set(0.55, 1.65, 0.1);
    basin.castShadow = true;
    scene.add(basin);

    // Chrome Basin Mixer Tap
    const tapBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 20), chromeMat);
    tapBase.position.set(0.55, 1.88, -0.08);
    scene.add(tapBase);
    const tapSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 16), chromeMat);
    tapSpout.rotation.x = Math.PI / 2;
    tapSpout.position.set(0.55, 1.96, 0.02);
    scene.add(tapSpout);
    partsRef.current.interactiveMeshes.push({ mesh: tapBase, action: 'info', label: 'WRAS Chrome Basin Mixer Tap' });

    // ─── Stage 1: 15mm Copper Incoming Main + Brass Isolation Ball Valve ───
    const stage1 = new THREE.Group();
    const riserPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 16), copperMat);
    riserPipe.position.set(-0.95, 0.45, -0.1);
    riserPipe.castShadow = true;
    stage1.add(riserPipe);

    const valveBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16), brassMat);
    valveBody.position.set(-0.95, 0.92, -0.1);
    stage1.add(valveBody);

    const valveLever = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.025, 0.03),
      new THREE.MeshStandardMaterial({ color: '#0F766E', roughness: 0.4 })
    );
    valveLever.position.set(-0.88, 0.92, -0.03);
    stage1.add(valveLever);
    partsRef.current.valveLever = valveLever;
    partsRef.current.interactiveMeshes.push({ mesh: valveBody, action: 'valve', label: '15mm Brass Isolation Ball Valve' });
    partsRef.current.interactiveMeshes.push({ mesh: valveLever, action: 'valve', label: '15mm Brass Isolation Ball Valve' });
    scene.add(stage1);

    // ─── Stage 2: Brass Compression Elbow + Horizontal 15mm Copper Run + Feed to Tap ───
    const stage2 = new THREE.Group();
    const elbow1 = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), brassMat);
    elbow1.position.set(-0.95, 1.25, -0.1);
    stage2.add(elbow1);

    const vertPipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 16), copperMat);
    vertPipe2.position.set(-0.95, 1.11, -0.1);
    stage2.add(vertPipe2);

    const horizSupply = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 16), copperMat);
    horizSupply.rotation.z = Math.PI / 2;
    horizSupply.position.set(-0.2, 1.25, -0.1);
    horizSupply.castShadow = true;
    stage2.add(horizSupply);

    // Compression Hex Nuts
    const nut1 = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.04, 6), brassMat);
    nut1.rotation.z = Math.PI / 2;
    nut1.position.set(-0.88, 1.25, -0.1);
    stage2.add(nut1);
    partsRef.current.interactiveMeshes.push({ mesh: nut1, action: 'torque', label: '15mm Brass Compression Nut (Click to Torque)' });

    const flexRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 16), copperMat);
    flexRiser.position.set(0.55, 1.52, -0.1);
    stage2.add(flexRiser);
    scene.add(stage2);

    // ─── Stage 3: 32mm Polypropylene P-Trap (50mm Water Seal) + Waste Arm ───
    const stage3 = new THREE.Group();
    const wasteTail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.35, 16), pvcMat);
    wasteTail.position.set(0.55, 1.38, 0.08);
    stage3.add(wasteTail);

    const uBend = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.036, 12, 24, Math.PI),
      pvcMat
    );
    uBend.rotation.z = Math.PI;
    uBend.position.set(0.66, 1.2, 0.08);
    stage3.add(uBend);

    const wasteOut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 16), pvcMat);
    wasteOut.rotation.z = Math.PI / 2 - 0.04; // 1:40 gradient fall!
    wasteOut.position.set(1.12, 1.22, 0.08);
    stage3.add(wasteOut);
    partsRef.current.interactiveMeshes.push({ mesh: uBend, action: 'info', label: '32mm P-Trap (50mm BS EN 274 Water Seal)' });
    scene.add(stage3);

    // ─── Stage 4: Analog Bourdon Tube Pressure Gauge (0–6 Bar) ───
    const stage4 = new THREE.Group();
    const tee = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 16), brassMat);
    tee.rotation.z = Math.PI / 2;
    tee.position.set(-0.25, 1.25, -0.1);
    stage4.add(tee);

    const gaugeStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.14, 12), brassMat);
    gaugeStem.position.set(-0.25, 1.34, -0.1);
    stage4.add(gaugeStem);

    const gaugeFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.05, 32),
      new THREE.MeshStandardMaterial({ color: '#FAF8F3', roughness: 0.25 })
    );
    gaugeFace.rotation.x = Math.PI / 2;
    gaugeFace.position.set(-0.25, 1.52, -0.1);
    stage4.add(gaugeFace);

    const gaugeRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.015, 12, 32),
      brassMat
    );
    gaugeRim.position.set(-0.25, 1.52, -0.075);
    stage4.add(gaugeRim);

    // Needle pivot
    const needle = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.12, 0.01),
      new THREE.MeshStandardMaterial({ color: '#B91C1C' })
    );
    needle.position.set(-0.25, 1.52, -0.068);
    stage4.add(needle);
    partsRef.current.gaugeNeedle = needle;
    partsRef.current.interactiveMeshes.push({ mesh: gaugeFace, action: 'info', label: 'Bourdon Hydrostatic Test Gauge (0–6 Bar)' });
    scene.add(stage4);

    partsRef.current.stageGroups = [stage1, stage2, stage3, stage4];

    // Animated Leak Droplets (when loose-olive or un-torqued under pressure)
    const drops: THREE.Mesh[] = [];
    const dropMat = new THREE.MeshStandardMaterial({ color: '#38BDF8', transparent: true, opacity: 0.85 });
    for (let i = 0; i < 4; i++) {
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), dropMat);
      drop.position.set(-0.88, 1.2 - i * 0.25, -0.05);
      drop.visible = false;
      scene.add(drop);
      drops.push(drop);
    }
    partsRef.current.leakDrops = drops;

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(partsRef.current.interactiveMeshes.map((i) => i.mesh), false);
      if (hits.length > 0) {
        const found = partsRef.current.interactiveMeshes.find((i) => i.mesh === hits[0].object);
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
      const hits = raycaster.intersectObjects(partsRef.current.interactiveMeshes.map((i) => i.mesh), false);
      if (hits.length > 0) {
        const found = partsRef.current.interactiveMeshes.find((i) => i.mesh === hits[0].object);
        if (found?.action === 'valve') onToggleValve();
        else if (found?.action === 'torque') onTorqueJoints();
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
      const st = stateRef.current;
      const leaking = st.valveOpen && st.assembledSteps >= 2 && (!st.jointsTorqued || st.faultMode === 'loose-olive');
      partsRef.current.leakDrops.forEach((d, idx) => {
        d.visible = leaking;
        if (leaking) {
          d.position.y -= 0.015;
          if (d.position.y < 0.05) d.position.y = 1.2 - idx * 0.05;
        }
      });
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

  useEffect(() => {
    const { valveLever, gaugeNeedle, stageGroups } = partsRef.current;
    stageGroups.forEach((g, idx) => {
      if (idx === 2 && state.faultMode === 'no-trap') {
        g.visible = false;
      } else {
        g.visible = idx < state.assembledSteps;
      }
    });

    if (valveLever) {
      valveLever.rotation.z = state.valveOpen ? Math.PI / 2 : 0;
    }
    if (gaugeNeedle) {
      const effectivePressure = state.valveOpen && state.assembledSteps >= 2 ? state.pressureBar : 0;
      const angle = 2.0 - (effectivePressure / 6.0) * 4.0;
      gaugeNeedle.rotation.z = angle;
    }
  }, [state]);

  useEffect(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    if (state.cameraPreset === '3/4') {
      cam.position.set(2.2, 1.5, 4.1);
      ctrl.target.set(0, 0.95, 0);
    } else if (state.cameraPreset === 'front') {
      cam.position.set(0, 1.2, 4.2);
      ctrl.target.set(0, 1.15, -0.05);
    } else if (state.cameraPreset === 'valve') {
      cam.position.set(-0.6, 1.1, 1.6);
      ctrl.target.set(-0.9, 1.05, -0.1);
    } else if (state.cameraPreset === 'trap') {
      cam.position.set(0.9, 1.25, 1.6);
      ctrl.target.set(0.7, 1.25, 0.08);
    }
    ctrl.update();
  }, [state.cameraPreset]);

  return (
    <div className="relative w-full h-[540px] rounded-workshop border border-workshop-border overflow-hidden bg-[#E8E3D9]">
      <div ref={containerRef} className="w-full h-full" />

      {hoveredLabel && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 frost-panel text-xs font-mono text-ink">
          {hoveredLabel}
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 frost-panel text-[10px] font-mono text-ink-muted">
        Drag to orbit 3D rig &bull; Click brass valve or compression nut directly
      </div>
    </div>
  );
}
