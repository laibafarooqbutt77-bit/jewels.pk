import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Check, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { MetalColor } from '../types/jewellery';

interface ThreeDShowcaseProps {
  initialModelType?: 'ring' | 'cuff' | 'necklace' | 'earring';
  initialColor?: MetalColor;
  className?: string;
  isCompact?: boolean;
}

export const ThreeDShowcase: React.FC<ThreeDShowcaseProps> = ({
  initialModelType = 'ring',
  initialColor = 'Gold',
  className = '',
  isCompact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<'ring' | 'cuff' | 'necklace' | 'earring'>(initialModelType);
  const [color, setColor] = useState<MetalColor>(initialColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Three.js internal references stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);

  // Update color and metalness when color state changes
  useEffect(() => {
    const isGold = color === 'Gold';
    const baseColor = isGold ? 0xDFC17B : 0xE0E4E8;
    const accentColor = isGold ? 0xF3DFA2 : 0xF5F7FA;

    materialsRef.current.forEach((mat) => {
      mat.color.setHex(baseColor);
      mat.metalness = 0.96;
      mat.roughness = isGold ? 0.16 : 0.12;
      mat.needsUpdate = true;
    });

    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [color]);

  // Rebuild the 3D model whenever modelType changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove previous model group
    if (currentModelGroupRef.current) {
      sceneRef.current.remove(currentModelGroupRef.current);
      currentModelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      currentModelGroupRef.current = null;
    }

    materialsRef.current = [];
    const isGold = color === 'Gold';
    const mainMetalMaterial = new THREE.MeshStandardMaterial({
      color: isGold ? 0xDFC17B : 0xE0E4E8,
      metalness: 0.96,
      roughness: isGold ? 0.16 : 0.12,
    });
    materialsRef.current.push(mainMetalMaterial);

    const accentMetalMaterial = new THREE.MeshStandardMaterial({
      color: isGold ? 0xF4E0A6 : 0xF2F5F8,
      metalness: 0.98,
      roughness: 0.08,
    });
    materialsRef.current.push(accentMetalMaterial);

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      metalness: 0.1,
      roughness: 0.05,
    });

    const modelGroup = new THREE.Group();

    if (modelType === 'ring') {
      // Procedural Composite Ring: Outer dome + inner shank band + bevel ring + faceted zirconia star
      // 1. Primary shank (outer toroidal contour)
      const shankGeom = new THREE.TorusGeometry(1.4, 0.28, 36, 72);
      const shank = new THREE.Mesh(shankGeom, mainMetalMaterial);
      shank.rotation.x = Math.PI / 2;
      shank.castShadow = true;
      shank.receiveShadow = true;
      modelGroup.add(shank);

      // 2. Sculpted signet/dome head
      const domeGeom = new THREE.CylinderGeometry(0.85, 0.6, 0.45, 48);
      const dome = new THREE.Mesh(domeGeom, mainMetalMaterial);
      dome.position.set(0, 1.48, 0);
      dome.castShadow = true;
      modelGroup.add(dome);

      // 3. Top signet plate with beveled rim
      const plateGeom = new THREE.CylinderGeometry(0.86, 0.86, 0.08, 48);
      const plate = new THREE.Mesh(plateGeom, accentMetalMaterial);
      plate.position.set(0, 1.72, 0);
      modelGroup.add(plate);

      // 4. Center radiant sparkling diamond-cut zircon
      const gemGeom = new THREE.OctahedronGeometry(0.18, 2);
      const gem = new THREE.Mesh(gemGeom, stoneMaterial);
      gem.position.set(0, 1.77, 0);
      gem.scale.set(1, 0.4, 1);
      modelGroup.add(gem);

      // 5. Four micro prong beads
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const prongGeom = new THREE.SphereGeometry(0.045, 16, 16);
        const prong = new THREE.Mesh(prongGeom, accentMetalMaterial);
        prong.position.set(Math.cos(angle) * 0.25, 1.76, Math.sin(angle) * 0.25);
        modelGroup.add(prong);
      }

      modelGroup.position.y = 0.3;
      modelGroup.scale.set(1.1, 1.1, 1.1);
    } else if (modelType === 'cuff') {
      // Procedural Open Hand Cuff: Curved architectural dual rails + end finials
      // 1. Main curved cuff body
      const cuffCurve = new THREE.EllipseCurve(0, 0, 1.8, 1.4, 0.35, Math.PI * 2 - 0.35, false, 0);
      const points = cuffCurve.getPoints(64).map(p => new THREE.Vector3(p.x, 0, p.y));
      const catmullSpline = new THREE.CatmullRomCurve3(points);
      
      const cuffGeom = new THREE.TubeGeometry(catmullSpline, 64, 0.22, 24, false);
      const cuffMesh = new THREE.Mesh(cuffGeom, mainMetalMaterial);
      cuffMesh.castShadow = true;
      modelGroup.add(cuffMesh);

      // 2. Parallel secondary accent rib
      const innerCurve = new THREE.EllipseCurve(0, 0, 1.6, 1.25, 0.45, Math.PI * 2 - 0.45, false, 0);
      const innerPoints = innerCurve.getPoints(64).map(p => new THREE.Vector3(p.x, 0.2, p.y));
      const innerSpline = new THREE.CatmullRomCurve3(innerPoints);
      const innerGeom = new THREE.TubeGeometry(innerSpline, 64, 0.12, 20, false);
      const innerMesh = new THREE.Mesh(innerGeom, accentMetalMaterial);
      innerMesh.castShadow = true;
      modelGroup.add(innerMesh);

      // 3. Two solid polished sphere finials at the open gap
      const p1 = points[0];
      const p2 = points[points.length - 1];
      const finialGeom = new THREE.SphereGeometry(0.32, 28, 28);
      
      const f1 = new THREE.Mesh(finialGeom, accentMetalMaterial);
      f1.position.copy(p1);
      modelGroup.add(f1);

      const f2 = new THREE.Mesh(finialGeom, accentMetalMaterial);
      f2.position.copy(p2);
      modelGroup.add(f2);

      modelGroup.rotation.x = Math.PI / 4;
      modelGroup.position.y = 0.2;
      modelGroup.scale.set(0.9, 0.9, 0.9);
    } else if (modelType === 'necklace') {
      // Procedural Necklace: Smooth catenary curve chain + bail loop + etched sun medallion
      const curvePoints: THREE.Vector3[] = [];
      const segments = 48;
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * 2 - 1; // -1 to 1
        const x = t * 1.6;
        const y = Math.cosh(t * 1.5) * 0.9 - 1.6;
        const z = -Math.sin((i / segments) * Math.PI) * 0.4;
        curvePoints.push(new THREE.Vector3(x, -y + 0.5, z));
      }
      const neckSpline = new THREE.CatmullRomCurve3(curvePoints);
      const chainGeom = new THREE.TubeGeometry(neckSpline, 64, 0.075, 16, false);
      const chainMesh = new THREE.Mesh(chainGeom, mainMetalMaterial);
      chainMesh.castShadow = true;
      modelGroup.add(chainMesh);

      // Pendant Bail / Connector loop
      const bailGeom = new THREE.TorusGeometry(0.16, 0.045, 16, 32);
      const bail = new THREE.Mesh(bailGeom, accentMetalMaterial);
      bail.position.set(0, -0.28, 0);
      modelGroup.add(bail);

      // Pendant Medallion Disc
      const discGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.06, 48);
      const disc = new THREE.Mesh(discGeom, mainMetalMaterial);
      disc.rotation.x = Math.PI / 2;
      disc.position.set(0, -0.85, 0);
      disc.castShadow = true;
      modelGroup.add(disc);

      // Raised rim border
      const rimGeom = new THREE.TorusGeometry(0.52, 0.04, 16, 48);
      const rim = new THREE.Mesh(rimGeom, accentMetalMaterial);
      rim.position.set(0, -0.85, 0.04);
      modelGroup.add(rim);

      // Center sun rays (8 micro cylinders)
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const rayGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8);
        const ray = new THREE.Mesh(rayGeom, accentMetalMaterial);
        ray.position.set(Math.cos(angle) * 0.24, -0.85 + Math.sin(angle) * 0.24, 0.04);
        ray.rotation.z = angle + Math.PI / 2;
        modelGroup.add(ray);
      }

      // Center sparkling gem
      const sunCenter = new THREE.SphereGeometry(0.09, 16, 16);
      const sunGem = new THREE.Mesh(sunCenter, stoneMaterial);
      sunGem.position.set(0, -0.85, 0.05);
      modelGroup.add(sunGem);

      modelGroup.position.y = 0.5;
    } else {
      // Procedural Earring: Croissant tapered bold hoop + click hinge clasp
      const hoopCurve = new THREE.EllipseCurve(0, 0, 1.2, 1.25, 0.2, Math.PI * 2 - 0.2, false, 0);
      const hPoints = hoopCurve.getPoints(48).map(p => new THREE.Vector3(p.x, p.y, 0));
      const hSpline = new THREE.CatmullRomCurve3(hPoints);
      
      const hoopGeom = new THREE.TubeGeometry(hSpline, 48, 0.26, 24, false);
      const hoopMesh = new THREE.Mesh(hoopGeom, mainMetalMaterial);
      hoopMesh.castShadow = true;
      modelGroup.add(hoopMesh);

      // Croissant ridges across the hoop
      for (let i = 0; i < 6; i++) {
        const progress = 0.3 + (i / 5) * 0.4;
        const pt = hSpline.getPoint(progress);
        const tangent = hSpline.getTangent(progress);
        
        const ribGeom = new THREE.TorusGeometry(0.32, 0.05, 16, 24);
        const rib = new THREE.Mesh(ribGeom, accentMetalMaterial);
        rib.position.copy(pt);
        rib.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
        modelGroup.add(rib);
      }

      // Top earring post latch pin
      const pinGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 16);
      const pin = new THREE.Mesh(pinGeom, accentMetalMaterial);
      pin.rotation.z = Math.PI / 2;
      pin.position.set(0, 1.26, 0);
      modelGroup.add(pin);

      modelGroup.position.y = 0.2;
      modelGroup.scale.set(1.1, 1.1, 1.1);
    }

    sceneRef.current.add(modelGroup);
    currentModelGroupRef.current = modelGroup;

    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [modelType, color]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL to pace loops appropriately
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : (gl as WebGLRenderingContext).RENDERER;
      const gpu = String((gl as WebGLRenderingContext).getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    // 3. Renderer with SRGB color space & ACES Filmic tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio PMREM Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 8.0;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 6. Lighting Rig: Warm Key Light + Cool Fill Light + Specular Rim
    const warmKeyLight = new THREE.DirectionalLight(0xFFF2DC, 2.4);
    warmKeyLight.position.set(4, 5, 4);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (warmKeyLight.castShadow) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
      warmKeyLight.shadow.normalBias = 0.02;
    }
    scene.add(warmKeyLight);

    const coolFillLight = new THREE.DirectionalLight(0xDEE7F0, 1.2);
    coolFillLight.position.set(-4, 3, -3);
    scene.add(coolFillLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF9EE, 0xD4C4B5, 0.8);
    scene.add(hemiLight);

    // 7. Ground Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    // Create soft radial shadow texture via canvas
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(30, 24, 20, 0.45)');
      gradient.addColorStop(0.5, 'rgba(30, 24, 20, 0.15)');
      gradient.addColorStop(1, 'rgba(30, 24, 20, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.25;
    scene.add(shadowPlane);

    // 8. Render loop & on-demand pacing
    let lastTime = performance.now();
    const renderLoop = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (autoRotate && currentModelGroupRef.current) {
        currentModelGroupRef.current.rotation.y += 0.01;
      }

      controls.update();
      renderer.render(scene, camera);

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    requestRenderRef.current = () => {
      if (currentModelGroupRef.current) {
        controls.update();
        renderer.render(scene, camera);
      }
    };

    // Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      if (requestRenderRef.current) requestRenderRef.current();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  const handleZoom = (delta: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const newDist = camera.position.length() + delta;
    if (newDist >= 2.5 && newDist <= 8.0) {
      camera.position.setLength(newDist);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current || !currentModelGroupRef.current) return;
    cameraRef.current.position.set(0, 1.2, 5.2);
    currentModelGroupRef.current.rotation.set(0, 0, 0);
    controlsRef.current.reset();
  };

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#F7F3EE] via-[#FDFBF7] to-[#F3EDE5] border border-[#EBE4D8] select-none ${className}`}>
      {/* 3D Viewport Title & Quality Seal */}
      <div className="absolute top-4 left-5 z-10 flex items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-[#E5DACD] text-xs font-medium text-[#4A3E38] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span>Interactive 3D Studio</span>
        </div>
        <span className="hidden sm:inline text-xs text-[#8A796F]">Drag to rotate · Scroll to zoom</span>
      </div>

      {/* Model Selector Bar (Top Right) */}
      <div className="absolute top-4 right-5 z-10 flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-xl border border-[#E5DACD] shadow-sm">
        {(['ring', 'necklace', 'earring', 'cuff'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setModelType(type)}
            className={`px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-all ${
              modelType === type
                ? 'bg-[#2A231F] text-white shadow-sm'
                : 'text-[#6B5E55] hover:text-[#2A231F] hover:bg-[#F4EFEB]'
            }`}
          >
            {type === 'cuff' ? 'Hand Cuff' : type}
          </button>
        ))}
      </div>

      {/* Dedicated WebGL Container */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[360px] md:min-h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Bottom Collapsible Control Dock (Per Three.js & Zero-Occlusion Guideline) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#7A6B62] hover:text-[#2A231F] transition-colors"
          >
            {showControls ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Controls</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-[#9A8B82] uppercase tracking-wider">316L Surgical Grade</span>
        </div>

        {showControls && (
          <div className="flex items-center justify-between gap-3 p-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5DACD] shadow-lg">
            {/* Metal Finish Selector */}
            <div className="flex items-center gap-2 pl-1">
              <span className="text-xs font-medium text-[#6B5E55] hidden sm:inline">Finish:</span>
              <button
                onClick={() => setColor('Gold')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  color === 'Gold'
                    ? 'bg-[#EBDDBF] text-[#4A3B18] ring-1 ring-[#D8B96E]'
                    : 'bg-[#F9F6F1] text-[#6B5E55] hover:bg-[#F2ECE3]'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F6E7B0] border border-[#B8942E]" />
                <span>18k PVD Gold</span>
              </button>

              <button
                onClick={() => setColor('Silver')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  color === 'Silver'
                    ? 'bg-[#E8EDF2] text-[#243342] ring-1 ring-[#B8C8D6]'
                    : 'bg-[#F9F6F1] text-[#6B5E55] hover:bg-[#F2ECE3]'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#CBD5E1] to-[#F1F5F9] border border-[#94A3B8]" />
                <span>Silver Steel</span>
              </button>
            </div>

            {/* Quick Actions (Auto-Rotate, Zoom In/Out, Reset) */}
            <div className="flex items-center gap-1 border-l border-[#EBE4D8] pl-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  autoRotate ? 'bg-[#2A231F] text-white' : 'text-[#6B5E55] hover:bg-[#F4EFEB]'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleZoom(-0.6)}
                title="Zoom In"
                className="p-2 text-[#6B5E55] hover:bg-[#F4EFEB] rounded-lg transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleZoom(0.6)}
                title="Zoom Out"
                className="p-2 text-[#6B5E55] hover:bg-[#F4EFEB] rounded-lg transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetCamera}
                title="Reset View"
                className="px-2.5 py-1 text-xs text-[#6B5E55] hover:text-[#2A231F] hover:bg-[#F4EFEB] rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
