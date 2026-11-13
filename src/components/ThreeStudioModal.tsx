import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  X,
  RotateCw,
  Layers,
  ChevronDown,
  ChevronUp,
  Sun,
  Camera,
  Box,
} from 'lucide-react';
import {
  EXHIBITS,
  ExhibitId,
  buildExhibitGroup,
  createContactShadowTexture,
} from '../three/proceduralScenes';
import { HORSE_FINISHES, HorseFinishId } from '../three/HorseModel';

interface ThreeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExhibit?: ExhibitId;
}

type CameraPresetId = 'hero' | 'lateral' | 'top' | 'detail';

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  hero: { label: 'Frontal', pos: [2.85, 2.15, 3.6], target: [0, 1.15, 0] },
  lateral: { label: 'Lateral', pos: [0.05, 1.55, 3.85], target: [0.1, 1.22, 0] },
  top: { label: 'Superior', pos: [0.01, 4.4, 1.9], target: [0, 1.1, 0] },
  detail: { label: 'Detalhe', pos: [1.55, 1.45, 2.05], target: [0, 1.35, 0] },
};

const FINISH_SWATCH_CLASSES: Record<HorseFinishId, string> = {
  castanho: 'bg-[#7a371b]',
  bronze: 'bg-[#b89242]',
  ebano: 'bg-[#221f1e]',
};

// Pre-allocated scratch vectors for zero per-frame allocations
const _targetPos = new THREE.Vector3();
const _presetGoalPos = new THREE.Vector3();
const _presetGoalTarget = new THREE.Vector3();

function disposeObjectTree(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const std = m as THREE.MeshStandardMaterial;
        std.map?.dispose();
        std.normalMap?.dispose();
        std.roughnessMap?.dispose();
        std.metalnessMap?.dispose();
        std.emissiveMap?.dispose();
        std.aoMap?.dispose();
        std.alphaMap?.dispose();
        std.dispose();
      });
    }
  });
}

export const ThreeStudioModal: React.FC<ThreeStudioModalProps> = ({
  isOpen,
  onClose,
  initialExhibit = 'cavalo',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeExhibit, setActiveExhibit] = useState<ExhibitId>(initialExhibit);
  const [horseFinish, setHorseFinish] = useState<HorseFinishId>('castanho');
  const [exploded, setExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [studioWarmth, setStudioWarmth] = useState<'warm' | 'cool'>('warm');
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const prevExhibitRef = useRef<ExhibitId>(initialExhibit);

  const stateRef = useRef({
    activeExhibit,
    horseFinish,
    exploded,
    autoRotate,
    studioWarmth,
    presetLerpActive: false,
    explodeAnimating: false,
  });

  stateRef.current.activeExhibit = activeExhibit;
  stateRef.current.horseFinish = horseFinish;
  stateRef.current.exploded = exploded;
  stateRef.current.autoRotate = autoRotate;
  stateRef.current.studioWarmth = studioWarmth;

  const sceneRefs = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    exhibitContainer: THREE.Group;
    currentGroup: THREE.Group | null;
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    requestRender: () => void;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveExhibit(initialExhibit);
      prevExhibitRef.current = initialExhibit;
      setExploded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialExhibit]);

  // Trigger Escape key close & 'H' cinema mode toggle
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'h') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Flag explode transition whenever toggled so on-demand loop animates smoothly until settled
  useEffect(() => {
    stateRef.current.explodeAnimating = true;
    sceneRefs.current?.requestRender();
  }, [exploded]);

  // Main Three.js WebGL initialization & cleanup
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const mount = containerRef.current;

    // 1. Software WebGL probe
    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const glProbe =
        probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (glProbe) {
        const dbg = glProbe.getExtension('WEBGL_debug_renderer_info');
        const unmasked = dbg
          ? String(glProbe.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
          : '';
        if (
          /SwiftShader|llvmpipe|Software|Microsoft Basic Render|Apple Software/i.test(
            unmasked
          )
        ) {
          isSoftwareGl = true;
        }
        glProbe.getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch {
      isSoftwareGl = false;
    }

    if (isSoftwareGl) {
      setAutoRotate(false);
      stateRef.current.autoRotate = false;
    }

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    const dpr = isSoftwareGl
      ? Math.min(window.devicePixelRatio || 1, 1)
      : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(
      mount.clientWidth || window.innerWidth,
      mount.clientHeight || window.innerHeight
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const maxAnisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

    // 3. Scene, Fog & IBL RoomEnvironment
    const scene = new THREE.Scene();
    const bgHex = 0x110e0b;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.055);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.72;
    roomEnv.dispose();

    // 4. Camera & OrbitControls
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(...CAMERA_PRESETS.hero.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.hero.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.5;
    controls.enablePan = true;
    controls.update();

    // 5. Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xcbe2ff, 0x2c2016, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff0d6, 2.3);
    keyLight.position.set(3.8, 5.6, 3.4);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 16;
      keyLight.shadow.camera.left = -2.4;
      keyLight.shadow.camera.right = 2.4;
      keyLight.shadow.camera.top = 3.2;
      keyLight.shadow.camera.bottom = -1.6;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.15);
    rimLight.position.set(-4.2, 3.2, -3.5);
    scene.add(rimLight);

    // 6. Matte Studio Floor + Contact Shadow Disc
    const floorGeo = new THREE.PlaneGeometry(32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x17130f,
      metalness: 0.04,
      roughness: 0.88,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    const shadowTex = createContactShadowTexture(maxAnisotropy);
    const contactShadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.9, 2.9),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    contactShadowPlane.rotation.x = -Math.PI / 2;
    contactShadowPlane.position.y = 0.002;
    scene.add(contactShadowPlane);

    const floorRing = new THREE.Mesh(
      new THREE.RingGeometry(1.12, 1.16, 64),
      new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
      })
    );
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = 0.004;
    scene.add(floorRing);

    // 7. Exhibit Mount Group
    const exhibitContainer = new THREE.Group();
    scene.add(exhibitContainer);

    const initialGroup = buildExhibitGroup(stateRef.current.activeExhibit, {
      isSoftwareGl,
      maxAnisotropy,
      horseFinish: stateRef.current.horseFinish,
    });
    exhibitContainer.add(initialGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Paced On-Demand + Visibility-Aware Render Loop
    const clock = new THREE.Clock();
    let rafId = 0;
    let timerId = 0;
    let disposed = false;
    let loopScheduled = false;

    const afterDraw = (onReady: () => void) => {
      if (isSoftwareGl) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (typeof gl.fenceSync === 'function') {
          const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
          gl.flush();
          const poll = () => {
            if (disposed) {
              if (sync) gl.deleteSync(sync);
              return;
            }
            if (!sync || gl.getSyncParameter(sync, gl.SYNC_STATUS) === gl.SIGNALED) {
              if (sync) gl.deleteSync(sync);
              timerId = window.setTimeout(onReady, 80);
            } else {
              timerId = window.setTimeout(poll, 6);
            }
          };
          poll();
          return;
        }
        timerId = window.setTimeout(onReady, 80);
        return;
      }
      rafId = window.requestAnimationFrame(onReady);
    };

    const tick = () => {
      loopScheduled = false;
      if (disposed || document.hidden) return;

      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.elapsedTime;
      const {
        exploded: isExploded,
        autoRotate: shouldRotate,
        presetLerpActive,
        explodeAnimating,
      } = stateRef.current;

      let stillAnimating = shouldRotate || presetLerpActive || explodeAnimating;

      // Damped exploded view interpolation
      const activeGroup = sceneRefs.current?.currentGroup;
      if (activeGroup) {
        let maxExplodeDistSq = 0;
        const factor = 1 - Math.exp(-8 * dt);
        activeGroup.children.forEach((part) => {
          const rest = part.userData.restPos as THREE.Vector3 | undefined;
          const offset = part.userData.explodeOffset as THREE.Vector3 | undefined;
          if (rest && offset) {
            _targetPos.copy(rest);
            if (isExploded) _targetPos.add(offset);
            const distSq = part.position.distanceToSquared(_targetPos);
            if (distSq > maxExplodeDistSq) maxExplodeDistSq = distSq;
            part.position.lerp(_targetPos, factor);
          }

          if (shouldRotate || !isSoftwareGl) {
            if (part.name === 'animated-orbit-1') {
              part.rotation.z += dt * 0.55;
              stillAnimating = true;
            } else if (part.name === 'animated-orbit-2') {
              part.rotation.z -= dt * 0.45;
              stillAnimating = true;
            } else if (part.name === 'animated-core') {
              part.rotation.y += dt * 0.6;
              part.position.y = (isExploded ? 2.1 : 1.38) + Math.sin(elapsed * 2.0) * 0.04;
              stillAnimating = true;
            } else if (part.name === 'animated-inner-core') {
              part.rotation.y -= dt * 1.1;
              part.rotation.x += dt * 0.5;
              stillAnimating = true;
            } else if (part.name === 'cavalo-head' && shouldRotate) {
              part.rotation.z = Math.sin(elapsed * 1.35) * 0.02;
            }

            const tailChild = part.getObjectByName('cavalo-tail');
            if (tailChild && shouldRotate) {
              tailChild.rotation.y = Math.sin(elapsed * 2.2) * 0.065;
              tailChild.rotation.z = Math.cos(elapsed * 1.6) * 0.025;
            }
          }
        });

        if (explodeAnimating && maxExplodeDistSq < 1e-6) {
          stateRef.current.explodeAnimating = false;
        }

        if (shouldRotate) {
          exhibitContainer.rotation.y += dt * 0.34;
        }
      }

      if (presetLerpActive) {
        const camFactor = 1 - Math.exp(-6 * dt);
        camera.position.lerp(_presetGoalPos, camFactor);
        controls.target.lerp(_presetGoalTarget, camFactor);
        if (camera.position.distanceTo(_presetGoalPos) < 0.02) {
          camera.position.copy(_presetGoalPos);
          controls.target.copy(_presetGoalTarget);
          stateRef.current.presetLerpActive = false;
        }
      }

      const controlsChanged = controls.update();
      renderer.render(scene, camera);

      if (stillAnimating || controlsChanged) {
        loopScheduled = true;
        afterDraw(tick);
      }
    };

    const requestRender = () => {
      if (disposed || document.hidden || loopScheduled) return;
      loopScheduled = true;
      if (isSoftwareGl) {
        timerId = window.setTimeout(tick, 16);
      } else {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    sceneRefs.current = {
      scene,
      camera,
      controls,
      keyLight,
      rimLight,
      exhibitContainer,
      currentGroup: initialGroup,
      isSoftwareGl,
      maxAnisotropy,
      requestRender,
    };

    controls.addEventListener('start', () => {
      stateRef.current.presetLerpActive = false;
      requestRender();
    });
    controls.addEventListener('change', requestRender);

    // Pause when tab/window hidden, resume cleanly on visibility
    const handleVisibility = () => {
      if (document.hidden) {
        if (rafId) window.cancelAnimationFrame(rafId);
        if (timerId) window.clearTimeout(timerId);
        loopScheduled = false;
      } else {
        clock.getDelta();
        requestRender();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Resize handling
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // Initial draw
    tick();

    // Complete disposal on unmount
    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (timerId) window.clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
      controls.dispose();

      disposeObjectTree(scene);

      envRT.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      sceneRefs.current = null;
    };
  }, [isOpen]);

  // Swap 3D exhibit or horse finish cleanly with full GPU resource disposal
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;

    const exhibitChanged = prevExhibitRef.current !== activeExhibit;
    prevExhibitRef.current = activeExhibit;

    if (refs.currentGroup) {
      disposeObjectTree(refs.currentGroup);
      refs.exhibitContainer.remove(refs.currentGroup);
    }

    const nextGroup = buildExhibitGroup(activeExhibit, {
      isSoftwareGl: refs.isSoftwareGl,
      maxAnisotropy: refs.maxAnisotropy,
      horseFinish,
    });
    refs.exhibitContainer.add(nextGroup);
    if (exhibitChanged) {
      refs.exhibitContainer.rotation.y = 0;
    }
    refs.currentGroup = nextGroup;
    refs.requestRender();
  }, [activeExhibit, horseFinish]);

  // Update studio lighting warmth when toggled
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;
    if (studioWarmth === 'warm') {
      refs.keyLight.color.setHex(0xfff0d6);
      refs.rimLight.color.setHex(0xd4af37);
    } else {
      refs.keyLight.color.setHex(0xe0f2fe);
      refs.rimLight.color.setHex(0x818cf8);
    }
    refs.requestRender();
  }, [studioWarmth]);

  const applyCameraPreset = (presetId: CameraPresetId) => {
    const p = CAMERA_PRESETS[presetId];
    _presetGoalPos.set(...p.pos);
    _presetGoalTarget.set(...p.target);
    stateRef.current.presetLerpActive = true;
    sceneRefs.current?.requestRender();
  };

  if (!isOpen) return null;

  const currentMeta = EXHIBITS.find((e) => e.id === activeExhibit) || EXHIBITS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Estúdio 3D Interativo"
      className="fixed inset-0 z-50 bg-[#110e0b] text-white select-none overflow-hidden"
    >
      {/* Full-bleed WebGL Viewport */}
      <div ref={containerRef} className="w-screen h-screen cursor-grab active:cursor-grabbing" />

      {/* Minimal Top-Left Title + Top-Right Close Button */}
      <div className="fixed top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="pointer-events-auto px-3.5 py-2 rounded-xl border border-[#d4af37]/30 bg-[#110e0b]/95 text-xs shadow-lg">
          <span className="font-semibold text-[#f3dfb0] tracking-wide flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{currentMeta.title}</span>
          </span>
          <span className="text-[11px] text-neutral-400 block mt-0.5">
            {currentMeta.subtitle} · Arraste para girar, role para zoom
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar Estúdio 3D"
          className="pointer-events-auto p-2.5 rounded-full border border-white/15 bg-[#110e0b]/95 text-white hover:text-[#d4af37] hover:border-[#d4af37]/60 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Single Compact Collapsible Bottom Control Dock (no backdrop-filter over WebGL) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 rounded-2xl border border-[#d4af37]/35 bg-[#110e0b]/95 shadow-2xl px-3.5 py-2.5 text-xs max-w-[min(960px,94vw)] w-max">
        <div className="flex items-center justify-between gap-3">
          {/* Exhibit Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {EXHIBITS.map((ex) => {
              const active = ex.id === activeExhibit;
              return (
                <button
                  key={ex.id}
                  onClick={() => {
                    setActiveExhibit(ex.id);
                    setExploded(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                    active
                      ? 'bg-[#d4af37] text-black border-[#d4af37] font-semibold'
                      : 'bg-black/40 text-neutral-300 border-white/10 hover:text-white'
                  }`}
                >
                  {ex.title}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setDockCollapsed((v) => !v)}
            aria-label={dockCollapsed ? 'Expandir controles' : 'Recolher controles'}
            title={dockCollapsed ? 'Expandir controles (H)' : 'Modo Cinema / Recolher (H)'}
            className="p-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white shrink-0"
          >
            {dockCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {!dockCollapsed && (
          <div className="mt-2.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            {/* Interaction Toggles + Horse Material Swatches */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setExploded((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  exploded
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5da81]'
                    : 'bg-black/40 border-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{exploded ? 'Vista Montada' : 'Vista Explodida'}</span>
              </button>

              <button
                onClick={() => {
                  setAutoRotate((v) => {
                    const next = !v;
                    stateRef.current.autoRotate = next;
                    if (next) sceneRefs.current?.requestRender();
                    return next;
                  });
                }}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  autoRotate
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                    : 'bg-black/40 border-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Girar</span>
              </button>

              <button
                onClick={() =>
                  setStudioWarmth((w) => (w === 'warm' ? 'cool' : 'warm'))
                }
                className="px-2.5 py-1 rounded-lg border bg-black/40 border-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Sun className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{studioWarmth === 'warm' ? 'Luz Quente' : 'Luz Fria'}</span>
              </button>

              {activeExhibit === 'cavalo' && (
                <div className="flex items-center gap-1 pl-2 ml-1 border-l border-white/15">
                  <span className="text-[11px] text-neutral-400 mr-0.5 hidden sm:inline">
                    Pelagem:
                  </span>
                  {HORSE_FINISHES.map((fin) => {
                    const isSelected = horseFinish === fin.id;
                    return (
                      <button
                        key={fin.id}
                        onClick={() => setHorseFinish(fin.id)}
                        title={`Acabamento ${fin.label}`}
                        className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                          isSelected
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5da81] font-semibold'
                            : 'bg-black/40 border-white/10 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full border border-white/40 ${FINISH_SWATCH_CLASSES[fin.id]}`}
                        />
                        <span>{fin.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Camera Presets */}
            <div className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-neutral-400 mr-1" />
              {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((presetKey) => (
                <button
                  key={presetKey}
                  onClick={() => applyCameraPreset(presetKey)}
                  className="px-2.5 py-1 rounded-lg border border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:border-[#d4af37]/50 transition-colors"
                >
                  {CAMERA_PRESETS[presetKey].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
