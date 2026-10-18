import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { UniverseItem } from '../data/universes';
import { cosmicAudio } from '../utils/audio';

interface GalaxyStage3DProps {
  universes: UniverseItem[];
  onSelectUniverse: (universe: UniverseItem) => void;
  isIntroActive: boolean;
}

export const GalaxyStage3D: React.FC<GalaxyStage3DProps> = ({
  universes,
  onSelectUniverse,
  isIntroActive,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const starMeshesRef = useRef<{
    mesh: THREE.Group;
    coreMesh: THREE.Mesh;
    haloSprite: THREE.Sprite;
    flareMesh: THREE.Mesh;
    labelSprite: THREE.Sprite;
    baseLabelY: number;
    baseLabelScale: { x: number; y: number };
    universe: UniverseItem;
    baseScale: number;
    orbitAngle: number;
    orbitRadiusX: number;
    orbitRadiusZ: number;
    orbitSpeed: number;
  }[]>([]);

  // Camera animation targets (Free 3D rotation in all directions)
  const targetDistRef = useRef<number>(260); // Starts far in deep space for the intro zoom
  const currentDistRef = useRef<number>(260);
  const targetRotXRef = useRef<number>(0.45);
  const targetRotYRef = useRef<number>(0);
  const rotXRef = useRef<number>(0.45);
  const rotYRef = useRef<number>(0);

  // Trigger 3D camera fly-in zoom when intro completes
  useEffect(() => {
    if (!isIntroActive) {
      targetDistRef.current = 58;
      targetRotXRef.current = 0.38;
    } else {
      targetDistRef.current = 260;
      targetRotXRef.current = 0.85;
    }
  }, [isIntroActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010006);
    scene.fog = new THREE.FogExp2(0x010006, 0.001);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 4500);
    camera.position.set(0, 120, 260);
    camera.lookAt(0, 0, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Subtle, delicate starlight textures (Refined and elegant, not exaggerated)
    // Texture 1: Delicate 4-Point Diamond Sparkle
    const makeFineDiamondTexture = () => {
      const size = 96;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d')!;
      const mid = size / 2;
      ctx.clearRect(0, 0, size, size);

      const grad = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid * 0.7);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,225,245,0.75)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(mid, 12);
      ctx.quadraticCurveTo(mid, mid, size - 12, mid);
      ctx.quadraticCurveTo(mid, mid, mid, size - 12);
      ctx.quadraticCurveTo(mid, mid, 12, mid);
      ctx.quadraticCurveTo(mid, mid, mid, 12);
      ctx.fill();

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const fineDiamondTexture = makeFineDiamondTexture();

    // Texture 2: Subtle Crystal Glint
    const makeDelicateCrystalTexture = () => {
      const size = 96;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d')!;
      const mid = size / 2;
      ctx.clearRect(0, 0, size, size);

      const grad = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid * 0.55);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(225,200,255,0.65)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(mid, 10);
      ctx.lineTo(mid, size - 10);
      ctx.moveTo(10, mid);
      ctx.lineTo(size - 10, mid);
      ctx.moveTo(mid * 0.4, mid * 0.4);
      ctx.lineTo(size - mid * 0.4, size - mid * 0.4);
      ctx.moveTo(size - mid * 0.4, mid * 0.4);
      ctx.lineTo(mid * 0.4, size - mid * 0.4);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const delicateCrystalTexture = makeDelicateCrystalTexture();

    // Texture 3: Soft Circular Starlight
    const makeDotTexture = () => {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d')!;
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(255,225,245,0.85)');
      grad.addColorStop(0.7, 'rgba(200,160,255,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const dotTexture = makeDotTexture();

    // Texture 4: Tiny Romantic Heart Spark
    const makeDelicateHeartTexture = () => {
      const size = 80;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d')!;
      const mid = size / 2;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      ctx.translate(mid, mid);
      ctx.beginPath();
      const s = 1.0;
      ctx.moveTo(0, -4 * s);
      ctx.bezierCurveTo(7 * s, -14 * s, 18 * s, -2 * s, 0, 14 * s);
      ctx.bezierCurveTo(-18 * s, -2 * s, -7 * s, -14 * s, 0, -4 * s);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 18 * s);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, 'rgba(255, 140, 200, 0.85)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const delicateHeartTexture = makeDelicateHeartTexture();

    const makeStarFlareTexture = (colorHex: string) => {
      const size = 256;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d')!;
      const center = size / 2;

      const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(0.2, colorHex);
      grad.addColorStop(0.6, `${colorHex}33`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(center, 16);
      ctx.lineTo(center, size - 16);
      ctx.moveTo(16, center);
      ctx.lineTo(size - 16, center);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const makeNebulaTexture = (c1: string, c2: string) => {
      const size = 512;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d')!;
      const r = size / 2;
      const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, c1);
      grad.addColorStop(0.45, c2);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // PROMINENT 3D BILLBOARD LABELS (Optimized for mobile: prominent, elegant, readable)
    const createProminentStarLabelSprite = (starNum: string, starTitle: string, emoji: string, colorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 200;
      const ctx = canvas.getContext('2d')!;

      // Dark obsidian capsule background
      ctx.fillStyle = 'rgba(7, 3, 20, 0.94)';
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 26;
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(18, 16, 684, 168, 84);
      ctx.fill();
      ctx.stroke();

      // Reset shadow for crisp text
      ctx.shadowBlur = 0;

      // Inner subtle rim highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(22, 20, 676, 160, 80);
      ctx.stroke();

      // Emoji on left with glowing aura
      const gradEmoji = ctx.createRadialGradient(92, 100, 0, 92, 100, 52);
      gradEmoji.addColorStop(0, `${colorHex}44`);
      gradEmoji.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradEmoji;
      ctx.beginPath();
      ctx.arc(92, 100, 52, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '58px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 92, 102);

      // Star Number / Kicker
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = colorHex;
      ctx.textAlign = 'left';
      ctx.fillText(`${starNum.toUpperCase()} ✦`, 165, 74);

      // Star Title (Clear, prominent, readable)
      ctx.font = 'bold 38px "Outfit", "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      let title = starTitle;
      if (title.length > 20) title = title.substring(0, 19) + '…';
      ctx.fillText(title, 165, 126);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(12.0, 3.4, 1);
      return sprite;
    };

    // 5. EXTENDED 360° MULTIVERSE BACKGROUND: 64 DISTANT BACKGROUND GALAXIES SURROUNDING THE ENTIRE SPHERE
    // (Requested: "el fondo de las galaxias de la principal ponlos en todos lados")
    const backgroundUniversesGroup = new THREE.Group();
    scene.add(backgroundUniversesGroup);

    const romanticColorPairs = [
      { c1: '#a855f7', c2: '#3b82f6' },
      { c1: '#ec4899', c2: '#fbbf24' },
      { c1: '#06b6d4', c2: '#8b5cf6' },
      { c1: '#f43f5e', c2: '#a855f7' },
      { c1: '#10b981', c2: '#06b6d4' },
      { c1: '#f59e0b', c2: '#ef4444' },
      { c1: '#c084fc', c2: '#f472b6' },
      { c1: '#38bdf8', c2: '#818cf8' },
      { c1: '#f43f5e', c2: '#fb923c' },
      { c1: '#d946ef', c2: '#60a5fa' },
      { c1: '#2dd4bf', c2: '#38bdf8' },
      { c1: '#fbbf24', c2: '#f472b6' },
      { c1: '#a78bfa', c2: '#f43f5e' },
      { c1: '#fbcfe8', c2: '#a855f7' },
    ];

    const bgGalaxiesList: { group: THREE.Group; speed: number; phase: number }[] = [];
    const BG_GALAXIES_COUNT = 64;

    for (let g = 0; g < BG_GALAXIES_COUNT; g++) {
      // Uniform spherical 360-degree distribution across all directions (top, bottom, front, back, sides)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI; // Azimuth: 0 to 360°
      const phi = Math.acos(2.0 * v - 1.0); // Polar angle: 0 (top zenith) to PI (bottom nadir)
      const dist = 180 + Math.random() * 220; // 180 to 400 deep space distance

      const x = dist * Math.sin(phi) * Math.cos(theta);
      const y = dist * Math.cos(phi);
      const z = dist * Math.sin(phi) * Math.sin(theta);

      const scale = 24 + Math.random() * 24;
      const colCfg = romanticColorPairs[g % romanticColorPairs.length];

      const miniGalaxy = new THREE.Group();
      miniGalaxy.position.set(x, y, z);
      miniGalaxy.lookAt(0, 0, 0);
      miniGalaxy.rotateZ((Math.random() - 0.5) * Math.PI);
      miniGalaxy.rotateX((Math.random() - 0.5) * 0.8);

      const miniCount = 380;
      const miniPos = new Float32Array(miniCount * 3);
      const miniCol = new Float32Array(miniCount * 3);
      const c1 = new THREE.Color(colCfg.c1);
      const c2 = new THREE.Color(colCfg.c2);

      for (let j = 0; j < miniCount; j++) {
        const r = Math.pow(Math.random(), 1.2) * scale;
        const arm = j % 3;
        const th = (arm * Math.PI * 2) / 3 + r * 0.25;
        miniPos[j * 3] = Math.cos(th) * r;
        miniPos[j * 3 + 1] = (Math.random() - 0.5) * (scale * 0.2);
        miniPos[j * 3 + 2] = Math.sin(th) * r;

        const mixCol = Math.random() > 0.5 ? c1 : c2;
        miniCol[j * 3] = mixCol.r;
        miniCol[j * 3 + 1] = mixCol.g;
        miniCol[j * 3 + 2] = mixCol.b;
      }

      const miniGeom = new THREE.BufferGeometry();
      miniGeom.setAttribute('position', new THREE.BufferAttribute(miniPos, 3));
      miniGeom.setAttribute('color', new THREE.BufferAttribute(miniCol, 3));

      const miniMat = new THREE.PointsMaterial({
        size: 1.25,
        map: dotTexture,
        transparent: true,
        alphaTest: 0.01,
        depthWrite: false,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });
      const miniPoints = new THREE.Points(miniGeom, miniMat);
      miniGalaxy.add(miniPoints);

      const miniNebulaTex = makeNebulaTexture(`${colCfg.c1}55`, `${colCfg.c2}22`);
      const miniCoreSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: miniNebulaTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      miniCoreSprite.scale.set(scale * 1.6, scale * 1.6, 1);
      miniGalaxy.add(miniCoreSprite);

      backgroundUniversesGroup.add(miniGalaxy);
      bgGalaxiesList.push({
        group: miniGalaxy,
        speed: (Math.random() > 0.5 ? 1 : -1) * (0.0015 + Math.random() * 0.002),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 5b. FULL 360° DEEP-SPACE CELESTIAL STARFIELD DOME (4,200 STARS IN ALL DIRECTIONS)
    const domeStarCount = 4200;
    const domePositions = new Float32Array(domeStarCount * 3);
    const domeColors = new Float32Array(domeStarCount * 3);
    const starPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffe8b2'),
      new THREE.Color('#ff91d2'),
      new THREE.Color('#bba2ff'),
      new THREE.Color('#78e5ce'),
      new THREE.Color('#7da7ff'),
    ];

    for (let k = 0; k < domeStarCount; k++) {
      const u = Math.random();
      const v = Math.random();
      const th = u * 2.0 * Math.PI;
      const ph = Math.acos(2.0 * v - 1.0);
      const d = 220 + Math.random() * 260; // sphere shell radius 220 to 480

      domePositions[k * 3] = d * Math.sin(ph) * Math.cos(th);
      domePositions[k * 3 + 1] = d * Math.cos(ph);
      domePositions[k * 3 + 2] = d * Math.sin(ph) * Math.sin(th);

      const cl = starPalette[Math.floor(Math.random() * starPalette.length)];
      domeColors[k * 3] = cl.r;
      domeColors[k * 3 + 1] = cl.g;
      domeColors[k * 3 + 2] = cl.b;
    }

    const domeGeom = new THREE.BufferGeometry();
    domeGeom.setAttribute('position', new THREE.BufferAttribute(domePositions, 3));
    domeGeom.setAttribute('color', new THREE.BufferAttribute(domeColors, 3));
    const domeMat = new THREE.PointsMaterial({
      size: 1.1,
      map: dotTexture,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    const domePoints = new THREE.Points(domeGeom, domeMat);
    scene.add(domePoints);

    // 6. TASTEFUL, DELICATE STELLAR TWINKLES (Requested: "no exageres las formas de las luces... pusiste demasiadas jajaj")
    // Balanced, tasteful amount: 140 subtle, delicate sparkling lights
    const multiShapedStarsGroup = new THREE.Group();
    scene.add(multiShapedStarsGroup);

    const extraStellarCount = 140;
    const shapeTextures = [fineDiamondTexture, delicateCrystalTexture, delicateHeartTexture, dotTexture];
    const shapeColors = ['#ffe8b2', '#ff91d2', '#bba2ff', '#ffffff', '#78e5ce'];
    const animatedExtraStars: { sprite: THREE.Sprite; baseSize: number; pulseSpeed: number; phase: number }[] = [];

    for (let s = 0; s < extraStellarCount; s++) {
      const tex = shapeTextures[s % shapeTextures.length];
      const colorHex = shapeColors[s % shapeColors.length];

      const starSpriteMat = new THREE.SpriteMaterial({
        map: tex,
        color: new THREE.Color(colorHex),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.5 + Math.random() * 0.3,
      });

      const sprite = new THREE.Sprite(starSpriteMat);

      // Subtle distribution around the galaxy arms and perimeter
      const orbitR = 16 + Math.random() * 32;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 10;
      sprite.position.set(Math.cos(theta) * orbitR, y, Math.sin(theta) * orbitR);

      // Delicate, fine size (not exaggerated!)
      const baseSize = 0.9 + Math.random() * 1.2;
      sprite.scale.set(baseSize, baseSize, 1);

      multiShapedStarsGroup.add(sprite);
      animatedExtraStars.push({
        sprite,
        baseSize,
        pulseSpeed: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 7. MAIN 3D GALAXY (STARS & PULSATING SPIRAL STARDUST)
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    const arms = 4;
    const spiralRadius = 45;
    const SPIRAL_STARS_COUNT = 6400;

    const baseSpiralPositions = new Float32Array(SPIRAL_STARS_COUNT * 3);
    const spiralPositions = new Float32Array(SPIRAL_STARS_COUNT * 3);
    const spiralColors = new Float32Array(SPIRAL_STARS_COUNT * 3);

    const paletteColors = [
      new THREE.Color('#ff91d2'),
      new THREE.Color('#bba2ff'),
      new THREE.Color('#ffe8b2'),
      new THREE.Color('#78e5ce'),
      new THREE.Color('#7da7ff'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < SPIRAL_STARS_COUNT; i++) {
      const r = Math.pow(Math.random(), 1.25) * spiralRadius;
      const armIndex = i % arms;
      const theta = (armIndex * Math.PI * 2) / arms + r * 0.16 + (Math.random() - 0.5) * 0.35;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const thickness = Math.pow(1 - Math.min(r, spiralRadius) / spiralRadius, 1.8);
      const y = (Math.random() - 0.5) * 7 * thickness;

      baseSpiralPositions[i * 3] = x;
      baseSpiralPositions[i * 3 + 1] = y;
      baseSpiralPositions[i * 3 + 2] = z;

      spiralPositions[i * 3] = x;
      spiralPositions[i * 3 + 1] = y;
      spiralPositions[i * 3 + 2] = z;

      const col = paletteColors[Math.floor(Math.random() * paletteColors.length)];
      spiralColors[i * 3] = col.r;
      spiralColors[i * 3 + 1] = col.g;
      spiralColors[i * 3 + 2] = col.b;
    }

    const spiralGeom = new THREE.BufferGeometry();
    spiralGeom.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3));
    spiralGeom.setAttribute('color', new THREE.BufferAttribute(spiralColors, 3));
    const spiralMat = new THREE.PointsMaterial({
      size: 1.15,
      map: dotTexture,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    const spiralPoints = new THREE.Points(spiralGeom, spiralMat);
    galaxyGroup.add(spiralPoints);

    // Glowing Galactic Volumetric Photon Ring
    const photonRing = new THREE.Mesh(
      new THREE.RingGeometry(18, 25, 96),
      new THREE.MeshBasicMaterial({
        color: 0xffa0e8,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    photonRing.rotation.x = -Math.PI / 2;
    galaxyGroup.add(photonRing);

    // 8. REAL 3D SCULPTED HEART NUCLEUS
    const heartGroup = new THREE.Group();

    const heartShape = new THREE.Shape();
    const heartPointsCount = 60;
    for (let i = 0; i <= heartPointsCount; i++) {
      const t = (i / heartPointsCount) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      if (i === 0) heartShape.moveTo(hx * 0.12, hy * 0.12);
      else heartShape.lineTo(hx * 0.12, hy * 0.12);
    }

    const heartExtrudeSettings = {
      depth: 0.7,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.22,
      bevelThickness: 0.22,
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, heartExtrudeSettings);
    heartGeo.center();

    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xff2a85,
      emissive: 0xff1493,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.15,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.rotation.x = -Math.PI / 6;
    heartGroup.add(heartMesh);

    const heartFlareTex = makeStarFlareTexture('#ff2a85');
    const heartFlareMat = new THREE.SpriteMaterial({
      map: heartFlareTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });
    const heartFlare = new THREE.Sprite(heartFlareMat);
    heartFlare.scale.set(16, 16, 1);
    heartGroup.add(heartFlare);

    galaxyGroup.add(heartGroup);

    const pointLight = new THREE.PointLight(0xff4da6, 1.8, 75, 2);
    pointLight.position.set(0, 0.5, 0);
    galaxyGroup.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffe8f8, 0.85);
    scene.add(ambientLight);

    // 9. THE 10 RADIANT 3D STARS WITH ENLARGED PROMINENT BILLBOARD LABELS
    const starsList = universes.slice(0, 10);
    const starMeshes: typeof starMeshesRef.current = [];

    const layoutAngles = [
      Math.PI / 2,
      Math.PI / 3.2,
      Math.PI / 10,
      -Math.PI / 5.2,
      -Math.PI / 2.5,
      -Math.PI / 1.65,
      -Math.PI / 1.15,
      Math.PI / 1.05,
      Math.PI / 1.45,
      0.15,
    ];

    starsList.forEach((u, i) => {
      const starGroup = new THREE.Group();
      const isSpecial10 = i === 9;

      const rx = isSpecial10 ? 8.5 : 22.5;
      const rz = isSpecial10 ? 6.5 : 17.5;
      const angle = layoutAngles[i];
      const x = Math.cos(angle) * rx;
      const z = -Math.sin(angle) * rz;
      const y = (Math.random() - 0.5) * 2;
      starGroup.position.set(x, y, z);

      // Core: Luminous crystalline sphere
      const starRadius = isSpecial10 ? 1.4 : 1.15;
      const coreGeo = new THREE.SphereGeometry(starRadius, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(u.color.primary),
        emissive: new THREE.Color(u.color.primary),
        emissiveIntensity: 0.65,
        roughness: 0.2,
        metalness: 0.15,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.userData = { universeId: u.id, index: i };
      starGroup.add(core);

      // Radiant Corona
      const flareTex = makeStarFlareTexture(u.color.primary);
      const flareMat = new THREE.SpriteMaterial({
        map: flareTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.9,
      });
      const haloSprite = new THREE.Sprite(flareMat);
      const flareBaseSize = starRadius * 7.2;
      haloSprite.scale.set(flareBaseSize, flareBaseSize, 1);
      starGroup.add(haloSprite);

      // Rotating Stardust Ring
      const starRingGeo = new THREE.RingGeometry(starRadius * 1.35, starRadius * 1.95, 32);
      const starRingMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(u.color.secondary),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const starRingMesh = new THREE.Mesh(starRingGeo, starRingMat);
      starRingMesh.rotation.x = Math.PI / 2.3 + (i % 3) * 0.2;
      starRingMesh.rotation.y = (i % 4) * 0.3;
      starGroup.add(starRingMesh);

      // PROMINENT LARGE 3D BILLBOARD LABEL (Prominent, elevated, clear)
      const starNumText = isSpecial10 ? 'Estrella 10' : `Estrella ${String(u.id).padStart(2, '0')}`;
      const starLabel = createProminentStarLabelSprite(starNumText, u.name, u.emoji, u.color.primary);
      const baseLabelY = starRadius * 2.5 + 2.0;
      starLabel.position.set(0, baseLabelY, 0);
      starLabel.userData = { universeId: u.id, index: i };
      starGroup.add(starLabel);

      galaxyGroup.add(starGroup);

      starMeshes.push({
        mesh: starGroup,
        coreMesh: core,
        haloSprite: haloSprite,
        flareMesh: starRingMesh,
        labelSprite: starLabel,
        baseLabelY,
        baseLabelScale: { x: 12.0, y: 3.4 },
        universe: u,
        baseScale: 1,
        orbitAngle: angle,
        orbitRadiusX: rx,
        orbitRadiusZ: rz,
        orbitSpeed: 0.0003 + (i % 3) * 0.0001,
      });
    });

    starMeshesRef.current = starMeshes;

    // Constellation Lines
    const constellationGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    for (let i = 0; i < starMeshes.length; i++) {
      const nextIdx = (i + 1) % starMeshes.length;
      const p1 = starMeshes[i].mesh.position;
      const p2 = starMeshes[nextIdx].mesh.position;
      linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
    const constellationGeoAttr = new THREE.Float32BufferAttribute(linePositions, 3);
    constellationGeo.setAttribute('position', constellationGeoAttr);
    const constellationMat = new THREE.LineBasicMaterial({
      color: 0xd8b4fe,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const constellationLines = new THREE.LineSegments(constellationGeo, constellationMat);
    galaxyGroup.add(constellationLines);

    // 10. MULTI-DIRECTIONAL MOBILE & DESKTOP CONTROLS
    // (Requested: "es como más para celular entonces me gustaría que lo pueda mover en varias direcciones")
    let isPointerDown = false;
    let startX = 0, startY = 0;
    let lastX = 0, lastY = 0;
    let velX = 0, velY = 0;
    let touchStartTime = 0;
    let touchTotalMove = 0;
    let isPinching = false;
    let initialPinchDist = 0;
    let initialCameraDist = 58;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let hoveredIndex: number | null = null;

    const getClickableObjects = () => {
      const list: THREE.Object3D[] = [];
      starMeshesRef.current.forEach((s) => {
        list.push(s.coreMesh);
        list.push(s.labelSprite);
      });
      return list;
    };

    // Helper: trigger selection when tapping/clicking a star
    const trySelectAtPosition = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const clickable = getClickableObjects();
      const intersects = raycaster.intersectObjects(clickable);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const idx = hit.userData.index;
        if (idx !== undefined) {
          const u = starMeshesRef.current[idx].universe;
          cosmicAudio.playUniverseChime(u.soundPitch);
          onSelectUniverse(u);
          return true;
        }
      }
      return false;
    };

    // Touch and mouse down handler
    const onDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown = true;
      velX = 0;
      velY = 0;
      touchStartTime = Date.now();
      touchTotalMove = 0;

      if ('touches' in e) {
        if (e.touches.length === 2) {
          // Two-finger pinch-to-zoom mode
          isPinching = true;
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          initialPinchDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
          initialCameraDist = targetDistRef.current;
          return;
        }
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        lastX = t.clientX;
        lastY = t.clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    // Touch and mouse move handler
    const onMove = (e: MouseEvent | TouchEvent) => {
      // Handle 2-finger mobile pinch zoom
      if ('touches' in e && e.touches.length === 2) {
        isPinching = true;
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const curDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        if (initialPinchDist > 5 && curDist > 5) {
          const pinchFactor = initialPinchDist / curDist;
          targetDistRef.current = Math.max(20, Math.min(125, initialCameraDist * pinchFactor));
        }
        return;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // When hovering on desktop without dragging
      if (!isPointerDown) {
        raycaster.setFromCamera(mouse, camera);
        const clickable = getClickableObjects();
        const intersects = raycaster.intersectObjects(clickable);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          container.style.cursor = 'pointer';
          const idx = hit.userData.index;
          hoveredIndex = idx !== undefined ? idx : null;
        } else {
          container.style.cursor = 'default';
          hoveredIndex = null;
        }
        return;
      }

      // Dragging / swiping in all directions (horizontal, vertical, diagonal)
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      touchTotalMove += Math.hypot(dx, dy);

      // Calibrated mobile sensitivity for easy 360° rotation and vertical tilt
      const sensX = 2.4 / Math.min(window.innerWidth, window.innerHeight);
      const sensY = 1.9 / Math.min(window.innerWidth, window.innerHeight);

      velY = -dx * sensX;
      velX = dy * sensY;

      // Free multi-directional orbit:
      // Horizontal (yaw): completely unconstrained 360° spin
      targetRotYRef.current += velY;
      // Vertical (pitch): generous angle range (-81° to +81°) so she can look from underneath, above, or sides
      targetRotXRef.current = Math.max(-1.42, Math.min(1.42, targetRotXRef.current + velX));

      lastX = clientX;
      lastY = clientY;
    };

    // Touch and mouse up handler
    const onUp = (e: MouseEvent | TouchEvent) => {
      isPointerDown = false;
      if (isPinching) {
        isPinching = false;
        return;
      }

      // If finger/mouse barely moved and was a quick tap, trigger selection directly
      const duration = Date.now() - touchStartTime;
      if (touchTotalMove < 10 && duration < 350) {
        trySelectAtPosition(startX, startY);
      }
    };

    // Mouse click fallback
    const onClick = (e: MouseEvent) => {
      if (touchTotalMove < 10) {
        trySelectAtPosition(e.clientX, e.clientY);
      }
    };

    // Mouse wheel zoom
    const onWheel = (e: WheelEvent) => {
      targetDistRef.current += e.deltaY * 0.05;
      targetDistRef.current = Math.max(20, Math.min(125, targetDistRef.current));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onDown);
    dom.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    dom.addEventListener('click', onClick);
    dom.addEventListener('wheel', onWheel, { passive: true });

    dom.addEventListener('touchstart', onDown, { passive: true });
    dom.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp, { passive: true });

    // 11. Main Animation Tick Loop
    let animId: number;
    const clock = new THREE.Clock();
    const INERTIA_DECAY = 0.92;

    const posArray = spiralGeom.attributes.position.array as Float32Array;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();

      // Main Galaxy subtle auto-rotation
      galaxyGroup.rotation.y = elapsed * 0.028;
      photonRing.rotation.z = elapsed * 0.1;

      // Rotate 360° celestial dome starfield very slowly
      domePoints.rotation.y = elapsed * 0.002;
      domePoints.rotation.x = elapsed * 0.0008;

      // Animate 64 Distant Background Galaxies in all directions
      bgGalaxiesList.forEach((bgGal, idx) => {
        bgGal.group.rotation.z += bgGal.speed;
        bgGal.group.position.y += Math.sin(elapsed * 0.6 + bgGal.phase) * 0.02;
      });

      // Animate subtle starlight twinkles
      multiShapedStarsGroup.rotation.y = -elapsed * 0.012;
      animatedExtraStars.forEach((star) => {
        const pulse = Math.sin(elapsed * star.pulseSpeed + star.phase);
        const curScale = star.baseSize * (0.8 + 0.35 * Math.abs(pulse));
        star.sprite.scale.set(curScale, curScale, 1);
      });

      // REAL 3D ANATOMICAL HEARTBEAT PULSE (Lub-Dub rhythm)
      const heartCycle = (elapsed * 2.3) % (Math.PI * 2);
      let heartBeatScale = 1.0;
      if (heartCycle < 0.28) {
        heartBeatScale = 1.0 + Math.sin((heartCycle / 0.28) * Math.PI) * 0.22;
      } else if (heartCycle >= 0.38 && heartCycle < 0.65) {
        heartBeatScale = 1.0 + Math.sin(((heartCycle - 0.38) / 0.27) * Math.PI) * 0.15;
      }
      heartGroup.scale.set(heartBeatScale, heartBeatScale, heartBeatScale);

      // PULSATING STARDUST PARTICLES in the spiral arms
      const ripplePhase = elapsed * 3.5;
      for (let i = 0; i < SPIRAL_STARS_COUNT; i++) {
        const i3 = i * 3;
        const bx = baseSpiralPositions[i3];
        const by = baseSpiralPositions[i3 + 1];
        const bz = baseSpiralPositions[i3 + 2];
        const dist = Math.sqrt(bx * bx + bz * bz);

        const wave = Math.sin(ripplePhase - dist * 0.18) * 0.07;
        const pulseFactor = 1.0 + wave;

        posArray[i3] = bx * pulseFactor;
        posArray[i3 + 1] = by * (1.0 + wave * 1.4);
        posArray[i3 + 2] = bz * pulseFactor;
      }
      spiralGeom.attributes.position.needsUpdate = true;
      spiralMat.size = 1.15 * (1.0 + 0.18 * Math.sin(elapsed * 4));

      // Star pulsation, gentle label floating bob, and hover responsiveness
      starMeshesRef.current.forEach((item, idx) => {
        const twinkle = 1 + Math.sin(elapsed * 2.8 + idx * 1.4) * 0.06;
        const isHovered = hoveredIndex === idx;
        const targetScale = isHovered ? 1.3 : twinkle;

        item.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
        item.flareMesh.rotation.z += 0.015;
        item.coreMesh.rotation.y += 0.02;

        // Dynamic floating bob for billboard labels
        const labelBob = Math.sin(elapsed * 2.2 + idx * 0.7) * 0.3;
        item.labelSprite.position.y = item.baseLabelY + labelBob;

        // Label hover zoom
        const labelTargetScale = isHovered ? 1.2 : 1.0;
        item.labelSprite.scale.lerp(
          new THREE.Vector3(
            item.baseLabelScale.x * labelTargetScale,
            item.baseLabelScale.y * labelTargetScale,
            1
          ),
          0.15
        );

        const mat = item.coreMesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isHovered ? 1.2 : 0.65;
      });

      // Smooth inertia drag decay in all directions
      if (!isPointerDown) {
        velX *= INERTIA_DECAY;
        velY *= INERTIA_DECAY;
        targetRotXRef.current = Math.max(-1.42, Math.min(1.42, targetRotXRef.current + velX));
        targetRotYRef.current += velY;
      }

      // 3D smooth spherical camera interpolation
      rotXRef.current += (targetRotXRef.current - rotXRef.current) * 0.06;
      rotYRef.current += (targetRotYRef.current - rotYRef.current) * 0.06;
      currentDistRef.current += (targetDistRef.current - currentDistRef.current) * 0.05;

      const cDist = currentDistRef.current;
      const rX = rotXRef.current;
      const rY = rotYRef.current;

      const camX = cDist * Math.cos(rX) * Math.sin(rY);
      const camY = cDist * Math.sin(rX);
      const camZ = cDist * Math.cos(rX) * Math.cos(rY);
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    tick();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onDown);
      dom.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onDown);
      dom.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      spiralGeom.dispose();
      spiralMat.dispose();
      heartGeo.dispose();
      heartMat.dispose();
      constellationGeo.dispose();
      constellationMat.dispose();
      domeGeom.dispose();
      domeMat.dispose();
    };
  }, [universes, onSelectUniverse]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden select-none z-0">
      {/* 100% Full-Screen Edge-to-Edge WebGL Canvas (Pure, Uncluttered, Multi-Directional Mobile Touch) */}
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full block bg-black touch-none"
      />
    </div>
  );
};
