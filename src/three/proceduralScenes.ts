import * as THREE from 'three';
import {
  buildHorseSculpture,
  HorseFinishId,
} from './HorseModel';

export type ExhibitId = 'cavalo' | 'trofeu' | 'ferradura' | 'nucleo';

export interface ExhibitMetadata {
  id: ExhibitId;
  title: string;
  subtitle: string;
  partsCount: number;
}

export const EXHIBITS: ExhibitMetadata[] = [
  {
    id: 'cavalo',
    title: 'Cavalo Mangalarga Marchador',
    subtitle: 'Escultura 3D · Haras GMF',
    partsCount: 6,
  },
  {
    id: 'trofeu',
    title: 'Troféu Campeão Nacional',
    subtitle: 'Haras GMF · O Cavaleiro',
    partsCount: 10,
  },
  {
    id: 'ferradura',
    title: 'Ferradura de Honra & Sela',
    subtitle: 'Mangalarga Marchador',
    partsCount: 8,
  },
  {
    id: 'nucleo',
    title: 'Núcleo Dev & Engenharia',
    subtitle: 'Sistemas de Informação · PUC',
    partsCount: 9,
  },
];

function createTextPlaqueTexture(
  title: string,
  subtitle: string,
  bgHex: string,
  fgHex: string,
  borderHex: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

  ctx.strokeStyle = borderHex;
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);

  ctx.fillStyle = fgHex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillText(title, canvas.width / 2, 78);

  ctx.font = '600 19px monospace';
  ctx.globalAlpha = 0.88;
  ctx.fillText(subtitle, canvas.width / 2, 126);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0c1222';
  ctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 3;
  for (let r = 80; r <= 230; r += 45) {
    ctx.globalAlpha = r === 215 ? 0.85 : 0.35;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = '#818cf8';
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const inner = i % 3 === 0 ? 190 : 204;
    ctx.lineWidth = i % 3 === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * 222, cy + Math.sin(a) * 222);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 26px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('C# · NODE · TS', cx, cy - 18);
  ctx.fillStyle = '#a5b4fc';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('PUC MINAS · SI', cx, cy + 20);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createLeatherTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#5a3118';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1400; i++) {
    const x = (i * 73) % 256;
    const y = (i * 137) % 256;
    ctx.fillStyle =
      i % 2 === 0 ? 'rgba(30, 14, 5, 0.25)' : 'rgba(130, 78, 40, 0.18)';
    ctx.fillRect(x, y, 3, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}


export function createContactShadowTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function registerPart(
  parent: THREE.Group,
  obj: THREE.Object3D,
  explodeVec: THREE.Vector3
): void {
  obj.userData.restPos = obj.position.clone();
  obj.userData.explodeOffset = explodeVec.clone();
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  parent.add(obj);
}

export function buildExhibitGroup(
  id: ExhibitId,
  options: {
    isSoftwareGl: boolean;
    maxAnisotropy: number;
    horseFinish?: HorseFinishId;
  }
): THREE.Group {
  const { isSoftwareGl, maxAnisotropy, horseFinish } = options;

  if (id === 'cavalo') {
    const plaqueTex = createTextPlaqueTexture(
      'HARAS GMF',
      'MANGALARGA MARCHADOR · MG',
      '#b8891f',
      '#1a1106',
      '#f5da81',
      maxAnisotropy
    );
    const leatherTex = createLeatherTexture(maxAnisotropy);
    return buildHorseSculpture({
      finish: horseFinish || 'castanho',
      maxAnisotropy,
      plaqueTexture: plaqueTex,
      leatherTexture: leatherTex,
    });
  }

  const root = new THREE.Group();
  root.name = `exhibit-${id}`;

  if (id === 'trofeu') {
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.2,
    });
    const darkBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x6b4d1d,
      metalness: 0.85,
      roughness: 0.34,
    });
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x2c1b10,
      metalness: 0.04,
      roughness: 0.64,
    });
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x18100b,
      metalness: 0.0,
      roughness: 0.94,
    });

    const feltPad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.98, 0.04, 32),
      velvetMat
    );
    feltPad.position.set(0, 0.02, 0);
    registerPart(root, feltPad, new THREE.Vector3(0, -0.18, 0));

    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.84, 0.92, 0.4, 8),
      walnutMat
    );
    plinth.position.set(0, 0.24, 0);
    plinth.rotation.y = Math.PI / 8;
    registerPart(root, plinth, new THREE.Vector3(0, -0.06, 0));

    const plaqueTex = createTextPlaqueTexture(
      'HARAS GMF',
      'CAMPEÃO NACIONAL · MM',
      '#b8891f',
      '#1a1106',
      '#f5da81',
      maxAnisotropy
    );
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: plaqueTex,
      metalness: 0.78,
      roughness: 0.28,
    });
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.24, 0.04),
      plaqueMat
    );
    plaque.position.set(0, 0.24, 0.83);
    registerPart(root, plaque, new THREE.Vector3(0, 0, 0.45));

    const riser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.68, 0.14, 24),
      walnutMat
    );
    riser.position.set(0, 0.51, 0);
    registerPart(root, riser, new THREE.Vector3(0, 0.14, 0));

    const baseCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.055, 16, 40),
      darkBronzeMat
    );
    baseCollar.rotation.x = Math.PI / 2;
    baseCollar.position.set(0, 0.6, 0);
    registerPart(root, baseCollar, new THREE.Vector3(0, 0.26, 0));

    const stemPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.42, 0.0),
      new THREE.Vector2(0.32, 0.12),
      new THREE.Vector2(0.14, 0.28),
      new THREE.Vector2(0.22, 0.45),
      new THREE.Vector2(0.12, 0.62),
      new THREE.Vector2(0.26, 0.75),
      new THREE.Vector2(0.0, 0.75),
    ];
    const stem = new THREE.Mesh(new THREE.LatheGeometry(stemPoints, 36), goldMat);
    stem.position.set(0, 0.6, 0);
    registerPart(root, stem, new THREE.Vector3(0, 0.44, 0));

    const midRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.23, 0.035, 14, 36),
      darkBronzeMat
    );
    midRing.rotation.x = Math.PI / 2;
    midRing.position.set(0, 1.05, 0);
    registerPart(root, midRing, new THREE.Vector3(0, 0.55, 0));

    const bowlPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.24, 0.0),
      new THREE.Vector2(0.36, 0.15),
      new THREE.Vector2(0.56, 0.48),
      new THREE.Vector2(0.66, 0.85),
      new THREE.Vector2(0.72, 0.92),
      new THREE.Vector2(0.64, 0.94),
      new THREE.Vector2(0.54, 0.75),
      new THREE.Vector2(0.36, 0.32),
      new THREE.Vector2(0.0, 0.16),
    ];
    const chaliceBowl = new THREE.Mesh(
      new THREE.LatheGeometry(bowlPoints, 48),
      goldMat
    );
    chaliceBowl.position.set(0, 1.35, 0);
    registerPart(root, chaliceBowl, new THREE.Vector3(0, 0.82, 0));

    const createHandle = (dir: 1 | -1) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(dir * 0.55, 1.98, 0),
        new THREE.Vector3(dir * 0.94, 2.08, 0),
        new THREE.Vector3(dir * 1.02, 1.72, 0),
        new THREE.Vector3(dir * 0.72, 1.48, 0),
        new THREE.Vector3(dir * 0.36, 1.42, 0),
      ]);
      return new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.048, 14, false),
        goldMat
      );
    };
    const leftHandle = createHandle(-1);
    const rightHandle = createHandle(1);
    registerPart(root, leftHandle, new THREE.Vector3(-0.55, 0.82, 0));
    registerPart(root, rightHandle, new THREE.Vector3(0.55, 0.82, 0));

    const crestShape = new THREE.Shape();
    crestShape.moveTo(0, 0.24);
    crestShape.bezierCurveTo(0.2, 0.24, 0.24, 0.06, 0.18, -0.1);
    crestShape.quadraticCurveTo(0.08, -0.22, 0, -0.28);
    crestShape.quadraticCurveTo(-0.08, -0.22, -0.18, -0.1);
    crestShape.bezierCurveTo(-0.24, 0.06, -0.2, 0.24, 0, 0.24);

    const crestGeo = new THREE.ExtrudeGeometry(crestShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
    crestGeo.center();
    const crestMesh = new THREE.Mesh(crestGeo, goldMat);
    crestMesh.position.set(0, 2.52, 0);
    registerPart(root, crestMesh, new THREE.Vector3(0, 1.25, 0));

    return root;
  }

  if (id === 'ferradura') {
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x331f12,
      metalness: 0.05,
      roughness: 0.62,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.21,
    });
    const antiqueBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x5c421a,
      metalness: 0.78,
      roughness: 0.4,
    });
    const leatherTex = createLeatherTexture(maxAnisotropy);
    const leatherMat = new THREE.MeshStandardMaterial({
      map: leatherTex,
      color: 0x703e1d,
      metalness: 0.0,
      roughness: 0.76,
    });

    const basePlinth = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.26, 1.1),
      walnutMat
    );
    basePlinth.position.set(0, 0.13, 0);
    registerPart(root, basePlinth, new THREE.Vector3(0, -0.12, 0));

    const plaqueTex = createTextPlaqueTexture(
      'FERRADURA DE OURO',
      'MANGALARGA MARCHADOR · MG',
      '#b8891f',
      '#1a1106',
      '#f5da81',
      maxAnisotropy
    );
    const standPlaque = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.17, 0.03),
      new THREE.MeshStandardMaterial({
        map: plaqueTex,
        metalness: 0.75,
        roughness: 0.28,
      })
    );
    standPlaque.position.set(0, 0.13, 0.56);
    registerPart(root, standPlaque, new THREE.Vector3(0, -0.05, 0.42));

    const cradleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.24, -0.18),
      new THREE.Vector3(0, 0.65, -0.22),
      new THREE.Vector3(0, 1.08, -0.12),
    ]);
    const cradle = new THREE.Mesh(
      new THREE.TubeGeometry(cradleCurve, 24, 0.05, 12, false),
      antiqueBronzeMat
    );
    registerPart(root, cradle, new THREE.Vector3(0, 0.15, -0.35));

    const outerRadius = 0.74;
    const innerRadius = 0.47;
    const shoeShape = new THREE.Shape();
    shoeShape.absarc(0, 0, outerRadius, -Math.PI * 0.18, Math.PI * 1.18, false);
    shoeShape.lineTo(
      Math.cos(Math.PI * 1.18) * innerRadius,
      Math.sin(Math.PI * 1.18) * innerRadius
    );
    shoeShape.absarc(0, 0, innerRadius, Math.PI * 1.18, -Math.PI * 0.18, true);
    shoeShape.closePath();

    const shoeGeo = new THREE.ExtrudeGeometry(shoeShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025,
    });
    shoeGeo.center();
    const shoeMesh = new THREE.Mesh(shoeGeo, goldMat);
    shoeMesh.position.set(0, 1.24, 0.02);
    shoeMesh.rotation.z = Math.PI;
    shoeMesh.rotation.x = -0.14;
    registerPart(root, shoeMesh, new THREE.Vector3(0, 0.55, 0.22));

    const fullerPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      const angle = -Math.PI * 0.14 + t * (Math.PI * 1.28);
      fullerPoints.push(
        new THREE.Vector3(Math.cos(angle) * 0.61, Math.sin(angle) * 0.61, 0.085)
      );
    }
    const fullerCurve = new THREE.CatmullRomCurve3(fullerPoints);
    const fullerMesh = new THREE.Mesh(
      new THREE.TubeGeometry(fullerCurve, 36, 0.018, 8, false),
      antiqueBronzeMat
    );
    fullerMesh.position.set(0, 1.24, 0.02);
    fullerMesh.rotation.z = Math.PI;
    fullerMesh.rotation.x = -0.14;
    registerPart(root, fullerMesh, new THREE.Vector3(0, 0.55, 0.45));

    const nailsGroup = new THREE.Group();
    const nailGeo = new THREE.CylinderGeometry(0.024, 0.016, 0.06, 4);
    const nailAngles = [
      0.05,
      0.42,
      0.82,
      Math.PI - 0.82,
      Math.PI - 0.42,
      Math.PI - 0.05,
    ];
    nailAngles.forEach((a) => {
      const nail = new THREE.Mesh(nailGeo, antiqueBronzeMat);
      nail.position.set(Math.cos(a) * 0.6, -Math.sin(a) * 0.6, 0.09);
      nail.rotation.x = Math.PI / 2;
      nailsGroup.add(nail);
    });
    nailsGroup.position.set(0, 1.24, 0.02);
    nailsGroup.rotation.x = -0.14;
    registerPart(root, nailsGroup, new THREE.Vector3(0, 0.68, 0.65));

    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.32, 1.78, -0.02),
      new THREE.Vector3(-0.36, 2.22, -0.08),
      new THREE.Vector3(0.0, 2.38, -0.08),
      new THREE.Vector3(0.36, 2.22, -0.08),
      new THREE.Vector3(0.32, 1.78, -0.02),
    ]);
    const leatherStrap = new THREE.Mesh(
      new THREE.TubeGeometry(strapCurve, 32, 0.048, 12, false),
      leatherMat
    );
    registerPart(root, leatherStrap, new THREE.Vector3(0, 0.95, -0.25));

    const medallion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32),
      goldMat
    );
    medallion.rotation.x = Math.PI / 2;
    medallion.position.set(0, 1.88, 0.02);
    registerPart(root, medallion, new THREE.Vector3(0, 0.92, 0.38));

    return root;
  }

  // Exhibit 4: 'nucleo' — Núcleo Dev & Engenharia
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.88,
    roughness: 0.24,
  });
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x161b26,
    metalness: 0.16,
    roughness: 0.78,
  });
  const indigoAlloyMat = new THREE.MeshStandardMaterial({
    color: 0x4f46e5,
    metalness: 0.82,
    roughness: 0.26,
  });
  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.22,
  });

  const chassisBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 1.0, 0.22, 6),
    chassisMat
  );
  chassisBase.position.set(0, 0.11, 0);
  registerPart(root, chassisBase, new THREE.Vector3(0, -0.18, 0));

  const finGroup = new THREE.Group();
  const finGeo = new THREE.BoxGeometry(0.06, 0.18, 0.34);
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const fin = new THREE.Mesh(finGeo, titaniumMat);
    fin.position.set(Math.cos(angle) * 0.72, 0.31, Math.sin(angle) * 0.72);
    fin.rotation.y = -angle;
    finGroup.add(fin);
  }
  registerPart(root, finGroup, new THREE.Vector3(0, -0.02, 0));

  const dialTex = createDialTexture(maxAnisotropy);
  const dialCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.62, 0.06, 40),
    new THREE.MeshStandardMaterial({
      map: dialTex,
      metalness: 0.25,
      roughness: 0.42,
    })
  );
  dialCap.position.set(0, 0.26, 0);
  registerPart(root, dialCap, new THREE.Vector3(0, 0.14, 0));

  const lowerGimbal = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.045, 16, 48),
    titaniumMat
  );
  lowerGimbal.rotation.x = Math.PI / 2;
  lowerGimbal.position.set(0, 0.46, 0);
  registerPart(root, lowerGimbal, new THREE.Vector3(0, 0.28, 0));

  const orbitRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.032, 16, 64),
    indigoAlloyMat
  );
  orbitRing1.position.set(0, 1.38, 0);
  orbitRing1.rotation.set(Math.PI / 3.2, 0.35, 0);
  orbitRing1.name = 'animated-orbit-1';
  registerPart(root, orbitRing1, new THREE.Vector3(-0.48, 0.55, 0.32));

  const orbitRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.026, 16, 64),
    goldAccentMat
  );
  orbitRing2.position.set(0, 1.38, 0);
  orbitRing2.rotation.set(-Math.PI / 3.5, -0.4, 0.25);
  orbitRing2.name = 'animated-orbit-2';
  registerPart(root, orbitRing2, new THREE.Vector3(0.48, 0.55, -0.32));

  const crystalMat = isSoftwareGl
    ? new THREE.MeshPhysicalMaterial({
        color: 0x818cf8,
        metalness: 0.18,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: 0.86,
      })
    : new THREE.MeshPhysicalMaterial({
        color: 0xc7d2fe,
        metalness: 0.0,
        roughness: 0.06,
        transmission: 0.88,
        ior: 1.52,
        thickness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      });
  const crystalCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.52, 0),
    crystalMat
  );
  crystalCore.position.set(0, 1.38, 0);
  crystalCore.name = 'animated-core';
  registerPart(root, crystalCore, new THREE.Vector3(0, 0.72, 0));

  const filamentMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    emissive: 0x6366f1,
    emissiveIntensity: 1.6,
    roughness: 0.3,
    metalness: 0.2,
  });
  const innerCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.18, 0),
    filamentMat
  );
  innerCore.position.set(0, 1.38, 0);
  innerCore.name = 'animated-inner-core';
  registerPart(root, innerCore, new THREE.Vector3(0, 1.1, 0));

  const crownCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.28, 6),
    titaniumMat
  );
  crownCap.position.set(0, 2.26, 0);
  registerPart(root, crownCap, new THREE.Vector3(0, 1.35, 0));

  return root;
}
