import * as THREE from 'three';

export type HorseFinishId = 'castanho' | 'bronze' | 'ebano';

export interface HorseFinishOption {
  id: HorseFinishId;
  label: string;
  swatchHex: string;
}

export const HORSE_FINISHES: HorseFinishOption[] = [
  { id: 'castanho', label: 'Castanho', swatchHex: '#7a371b' },
  { id: 'bronze', label: 'Bronze', swatchHex: '#b89242' },
  { id: 'ebano', label: 'Ébano', swatchHex: '#221f1e' },
];

export interface HorseSculptureOptions {
  finish?: HorseFinishId;
  maxAnisotropy?: number;
  plaqueTexture?: THREE.Texture;
  leatherTexture?: THREE.Texture;
}

const _worldZ = new THREE.Vector3(0, 0, 1);
const _tangent = new THREE.Vector3();
const _lateral = new THREE.Vector3();
const _dorsoVentral = new THREE.Vector3();
const _point = new THREE.Vector3();
const _vert = new THREE.Vector3();

/**
 * Generates a twist-free anatomical loft along a 3D spline anchored to bilateral symmetry (world Z).
 * Supports independent dorsal (top), ventral (bottom), and lateral (width) radii so the torso,
 * ribcage, tucked flank, arched neck, and jointed limbs sculpt naturally without Frenet twisting.
 */
function createAnatomicalLoft(
  curve: THREE.Curve<THREE.Vector3>,
  profileFn: (t: number) => { dorsal: number; ventral: number; width: number },
  tubularSegments = 32,
  radialSegments = 20,
  superPower = 2.0
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    curve.getPointAt(t, _point);
    curve.getTangentAt(t, _tangent).normalize();

    // Orthogonalize lateral axis against tangent so bilateral symmetry never twists
    _lateral.copy(_worldZ).addScaledVector(_tangent, -_worldZ.dot(_tangent));
    if (_lateral.lengthSq() < 1e-6) {
      _lateral.set(0, 0, 1);
    } else {
      _lateral.normalize();
    }

    // L x T points upward/dorsal in the equine symmetry plane
    _dorsoVentral.crossVectors(_lateral, _tangent).normalize();

    const { dorsal, ventral, width } = profileFn(t);

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      let c = cosA;
      let s = sinA;
      if (superPower !== 2.0) {
        const exp = 2.0 / superPower;
        c = Math.sign(cosA) * Math.pow(Math.abs(cosA), exp);
        s = Math.sign(sinA) * Math.pow(Math.abs(sinA), exp);
      }

      const hRadius = s >= 0 ? dorsal : ventral;

      _vert
        .copy(_point)
        .addScaledVector(_lateral, c * width)
        .addScaledVector(_dorsoVentral, s * hRadius);

      positions.push(_vert.x, _vert.y, _vert.z);
      uvs.push(t, j / radialSegments);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = (radialSegments + 1) * i + j;
      const b = (radialSegments + 1) * (i + 1) + j;
      const c = (radialSegments + 1) * (i + 1) + (j + 1);
      const d = (radialSegments + 1) * i + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Cap start (outward normal = -T)
  const startCenterIdx = positions.length / 3;
  curve.getPointAt(0, _point);
  positions.push(_point.x, _point.y, _point.z);
  uvs.push(0, 0.5);
  for (let j = 0; j < radialSegments; j++) {
    indices.push(startCenterIdx, j, j + 1);
  }

  // Cap end (outward normal = +T)
  const endCenterIdx = positions.length / 3;
  curve.getPointAt(1, _point);
  positions.push(_point.x, _point.y, _point.z);
  uvs.push(1, 0.5);
  const lastRowOffset = tubularSegments * (radialSegments + 1);
  for (let j = 0; j < radialSegments; j++) {
    indices.push(endCenterIdx, lastRowOffset + j + 1, lastRowOffset + j);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Generates a subtle organic satin coat roughness texture so specular highlights break naturally across muscle groups.
 */
function createCoatRoughnessTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9c9c9c';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1800; i++) {
    const x = (i * 59) % 256;
    const y = (i * 97) % 256;
    const v = 135 + ((i * 23) % 46);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 5, 1.5);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 3);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createSculptedHoofGeometry(): THREE.LatheGeometry {
  // Grounded at y = 0 (sole), rising to coronet at y = 0.072
  const pts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.056, 0.0),
    new THREE.Vector2(0.058, 0.008),
    new THREE.Vector2(0.049, 0.046),
    new THREE.Vector2(0.042, 0.072),
    new THREE.Vector2(0.0, 0.072),
  ];
  return new THREE.LatheGeometry(pts, 18);
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

/**
 * Builds an aesthetic, minimalist yet anatomically authentic 3D Mangalarga Marchador Horse sculpture.
 * Pivot is bottom-center (y = 0) sitting flush on the studio floor.
 */
export function buildHorseSculpture(
  options: HorseSculptureOptions = {}
): THREE.Group {
  const {
    finish = 'castanho',
    maxAnisotropy = 4,
    plaqueTexture,
    leatherTexture,
  } = options;

  const root = new THREE.Group();
  root.name = 'exhibit-cavalo';

  const coatRoughTex = createCoatRoughnessTexture(maxAnisotropy);

  // Material palette tuned to the chosen finish
  const isBronze = finish === 'bronze';
  const isEbony = finish === 'ebano';

  const coatMat = isBronze
    ? new THREE.MeshPhysicalMaterial({
        color: 0xa67c37,
        metalness: 0.88,
        roughness: 0.28,
        roughnessMap: coatRoughTex,
        clearcoat: 0.18,
        clearcoatRoughness: 0.35,
      })
    : isEbony
    ? new THREE.MeshPhysicalMaterial({
        color: 0x1b1918,
        metalness: 0.08,
        roughness: 0.36,
        roughnessMap: coatRoughTex,
        clearcoat: 0.42,
        clearcoatRoughness: 0.3,
      })
    : new THREE.MeshPhysicalMaterial({
        color: 0x6d3017, // Castanho nobre Mangalarga
        metalness: 0.06,
        roughness: 0.42,
        roughnessMap: coatRoughTex,
        clearcoat: 0.32,
        clearcoatRoughness: 0.38,
      });

  const darkHairMat = isBronze
    ? new THREE.MeshStandardMaterial({
        color: 0x4f3918,
        metalness: 0.72,
        roughness: 0.48,
      })
    : new THREE.MeshStandardMaterial({
        color: 0x140d09,
        metalness: 0.02,
        roughness: 0.78,
      });

  const hoofMat = isBronze
    ? new THREE.MeshStandardMaterial({
        color: 0x3b2a12,
        metalness: 0.78,
        roughness: 0.36,
      })
    : new THREE.MeshStandardMaterial({
        color: 0x181513,
        metalness: 0.1,
        roughness: 0.34,
      });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.2,
  });

  const saddleLeatherMat = isBronze
    ? new THREE.MeshStandardMaterial({
        color: 0x61471d,
        metalness: 0.68,
        roughness: 0.42,
      })
    : new THREE.MeshStandardMaterial({
        map: leatherTexture || null,
        color: 0x5c2e14,
        metalness: 0.04,
        roughness: 0.56,
      });

  const crimsonPadMat = isBronze
    ? new THREE.MeshStandardMaterial({
        color: 0x3a2914,
        metalness: 0.52,
        roughness: 0.55,
      })
    : new THREE.MeshStandardMaterial({
        color: 0x7c1d18,
        metalness: 0.0,
        roughness: 0.86,
      });

  const blazeMat = new THREE.MeshStandardMaterial({
    color: 0xf4ead8,
    metalness: 0.0,
    roughness: 0.56,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const eyeMat = new THREE.MeshPhysicalMaterial({
    color: isBronze ? 0x261a0a : 0x0a0706,
    metalness: isBronze ? 0.6 : 0.06,
    roughness: 0.06,
    clearcoat: 1.0,
  });

  const walnutMat = new THREE.MeshStandardMaterial({
    color: isBronze ? 0x16181d : 0x28180e,
    metalness: 0.05,
    roughness: 0.62,
  });

  // ---------------------------------------------------------------------------
  // 1. Minimalist Museum Plinth (y = 0 -> 0.24)
  // ---------------------------------------------------------------------------
  const plinthGroup = new THREE.Group();

  const feltBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.22, 0.036, 56),
    darkHairMat
  );
  feltBase.scale.set(1.24, 1, 0.74);
  feltBase.position.y = 0.018;
  plinthGroup.add(feltBase);

  const walnutBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.11, 1.16, 0.204, 56),
    walnutMat
  );
  walnutBase.scale.set(1.24, 1, 0.74);
  walnutBase.position.y = 0.138;
  plinthGroup.add(walnutBase);

  const brassTrim = new THREE.Mesh(
    new THREE.TorusGeometry(1.11, 0.018, 12, 72),
    goldMat
  );
  brassTrim.rotation.x = Math.PI / 2;
  brassTrim.scale.set(1.24, 0.74, 1);
  brassTrim.position.y = 0.238;
  plinthGroup.add(brassTrim);

  if (plaqueTexture) {
    const horsePlaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.15, 0.028),
      new THREE.MeshStandardMaterial({
        map: plaqueTexture,
        metalness: 0.78,
        roughness: 0.26,
      })
    );
    horsePlaque.position.set(0, 0.135, 0.85);
    plinthGroup.add(horsePlaque);
  }

  registerPart(root, plinthGroup, new THREE.Vector3(0, -0.22, 0));

  // ---------------------------------------------------------------------------
  // 2. Anatomical Torso, Deep Chest, Withers & Muscular Haunches
  // ---------------------------------------------------------------------------
  const torsoGroup = new THREE.Group();

  const torsoCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.62, 1.37, 0), // Tailhead / Croup
    new THREE.Vector3(-0.34, 1.40, 0), // Loins
    new THREE.Vector3(0.02, 1.33, 0),  // Mid-barrel
    new THREE.Vector3(0.35, 1.33, 0),  // Heart girth / Withers
    new THREE.Vector3(0.58, 1.31, 0),  // Point of shoulder / Pectorals
  ]);

  const torsoGeo = createAnatomicalLoft(
    torsoCurve,
    (t) => {
      // Rounded croup tapering gracefully at tailhead
      if (t < 0.14) {
        const u = Math.sin((t / 0.14) * Math.PI * 0.5);
        return {
          dorsal: 0.05 + 0.12 * u,
          ventral: 0.05 + 0.17 * u,
          width: 0.05 + 0.16 * u,
        };
      }
      // Flank tuck & loin
      if (t < 0.45) {
        const u = (t - 0.14) / 0.31;
        return {
          dorsal: 0.165 - 0.015 * Math.sin(u * Math.PI),
          ventral: 0.20 + 0.08 * u,
          width: 0.21 + 0.025 * u,
        };
      }
      // Deep barrel & full ribcage + withers rise
      if (t < 0.82) {
        const u = (t - 0.45) / 0.37;
        return {
          dorsal: 0.155 + 0.04 * Math.sin(u * Math.PI),
          ventral: 0.28 + 0.03 * Math.sin(u * Math.PI * 0.85),
          width: 0.235 - 0.015 * u,
        };
      }
      // Tapered pectoral breast
      const u = Math.max(0, (1 - t) / 0.18);
      const s = Math.sin(u * Math.PI * 0.5);
      return {
        dorsal: 0.04 + 0.13 * s,
        ventral: 0.05 + 0.22 * s,
        width: 0.05 + 0.16 * s,
      };
    },
    36,
    24,
    2.15
  );
  torsoGroup.add(new THREE.Mesh(torsoGeo, coatMat));

  // Blended shoulder blades, pectorals & muscular haunches
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 16), coatMat);
    shoulder.scale.set(0.92, 1.24, 0.68);
    shoulder.position.set(0.39, 1.26, side * 0.135);
    shoulder.rotation.z = -0.22;
    torsoGroup.add(shoulder);

    const pectoral = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 14), coatMat);
    pectoral.scale.set(0.9, 1.15, 0.72);
    pectoral.position.set(0.51, 1.19, side * 0.085);
    torsoGroup.add(pectoral);

    const haunch = new THREE.Mesh(new THREE.SphereGeometry(0.225, 20, 16), coatMat);
    haunch.scale.set(1.08, 1.2, 0.72);
    haunch.position.set(-0.44, 1.29, side * 0.125);
    haunch.rotation.z = 0.15;
    torsoGroup.add(haunch);
  });

  registerPart(root, torsoGroup, new THREE.Vector3(0, 0.18, 0));

  // ---------------------------------------------------------------------------
  // 3. Arched Mangalarga Neck, Noble Head & Minimalist Bridle
  // ---------------------------------------------------------------------------
  const headNeckGroup = new THREE.Group();
  headNeckGroup.name = 'cavalo-head';

  const neckCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.42, 1.30, 0),
    new THREE.Vector3(0.57, 1.58, 0),
    new THREE.Vector3(0.73, 1.92, 0),
    new THREE.Vector3(0.87, 2.20, 0),
  ]);
  const neckGeo = createAnatomicalLoft(
    neckCurve,
    (t) => ({
      dorsal: 0.21 - t * 0.115,
      ventral: 0.23 - t * 0.125,
      width: 0.165 - t * 0.075,
    }),
    28,
    20,
    2.1
  );
  headNeckGroup.add(new THREE.Mesh(neckGeo, coatMat));

  // Sculpted equine cranium, nasal bridge & muzzle
  const headCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.84, 2.24, 0), // Poll
    new THREE.Vector3(0.99, 2.13, 0), // Forehead / Orbital zone
    new THREE.Vector3(1.13, 1.97, 0), // Nasal bridge
    new THREE.Vector3(1.25, 1.84, 0), // Muzzle / Lips
  ]);
  const headGeo = createAnatomicalLoft(
    headCurve,
    (t) => {
      if (t < 0.35) {
        const u = t / 0.35;
        return {
          dorsal: 0.095 + 0.015 * Math.sin(u * Math.PI),
          ventral: 0.115 + 0.025 * Math.sin(u * Math.PI),
          width: 0.092 - 0.012 * u,
        };
      }
      const u = (t - 0.35) / 0.65;
      return {
        dorsal: 0.088 - u * 0.042,
        ventral: 0.118 - u * 0.068,
        width: 0.080 - u * 0.036,
      };
    },
    22,
    18,
    2.05
  );
  headNeckGroup.add(new THREE.Mesh(headGeo, coatMat));

  // Rounded muzzle tip + subtle nostril & jaw details
  const muzzleTip = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 14), coatMat);
  muzzleTip.scale.set(1.15, 0.92, 0.92);
  muzzleTip.position.set(1.245, 1.845, 0);
  headNeckGroup.add(muzzleTip);

  [-1, 1].forEach((side) => {
    // Cheek / jawbone (ganacha)
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.086, 16, 14), coatMat);
    cheek.scale.set(1.18, 1.02, 0.58);
    cheek.position.set(0.92, 2.14, side * 0.046);
    headNeckGroup.add(cheek);

    // Subtle supraorbital brow arch
    const brow = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 10), coatMat);
    brow.scale.set(1.3, 0.7, 0.85);
    brow.position.set(0.99, 2.215, side * 0.068);
    headNeckGroup.add(brow);

    // Expressive glossy eye
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.019, 12, 10), eyeMat);
    eye.position.set(1.005, 2.185, side * 0.078);
    headNeckGroup.add(eye);

    // Flared nostril contour
    const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 8), darkHairMat);
    nostril.scale.set(1.2, 0.8, 0.6);
    nostril.position.set(1.24, 1.875, side * 0.038);
    headNeckGroup.add(nostril);

    // Alert forward-angled ear
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.033, 0.145, 12), coatMat);
    ear.position.set(0.86, 2.35, side * 0.054);
    ear.rotation.z = -0.32;
    ear.rotation.x = side * 0.16;
    headNeckGroup.add(ear);

    // Minimalist brass bit ring
    const bitRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.023, 0.0055, 8, 18),
      goldMat
    );
    bitRing.position.set(1.19, 1.895, side * 0.052);
    headNeckGroup.add(bitRing);

    // Bridle cheekpiece strap
    const cheekStrapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.88, 2.26, side * 0.065),
      new THREE.Vector3(1.03, 2.09, side * 0.074),
      new THREE.Vector3(1.18, 1.91, side * 0.052),
    ]);
    headNeckGroup.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(cheekStrapCurve, 14, 0.0055, 6, false),
        goldMat
      )
    );
  });

  // White Mangalarga facial blaze (omitted on pure bronze sculpture for uniform patina)
  if (!isBronze) {
    const blazeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.955, 2.255, 0),
      new THREE.Vector3(1.08, 2.135, 0),
      new THREE.Vector3(1.205, 1.97, 0),
    ]);
    const blaze = new THREE.Mesh(
      new THREE.TubeGeometry(blazeCurve, 14, 0.017, 8, false),
      blazeMat
    );
    blaze.scale.set(1, 1, 0.55);
    headNeckGroup.add(blaze);
  }

  // Minimalist brass noseband (anatomical clearance around nasal bridge)
  const noseband = new THREE.Mesh(
    new THREE.TorusGeometry(0.088, 0.0065, 8, 24),
    goldMat
  );
  noseband.position.set(1.13, 1.975, 0);
  noseband.rotation.y = Math.PI / 2;
  noseband.rotation.x = 0.68;
  noseband.scale.set(0.76, 1.06, 1.0);
  headNeckGroup.add(noseband);

  registerPart(root, headNeckGroup, new THREE.Vector3(0.45, 0.62, 0));

  // ---------------------------------------------------------------------------
  // 4. Sculpted Flowing Mane, Forelock & Dynamic 3-Strand Tail
  // ---------------------------------------------------------------------------
  const hairGroup = new THREE.Group();

  // Forelock between the ears
  const forelockCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.88, 2.31, 0),
    new THREE.Vector3(0.95, 2.27, 0.03),
    new THREE.Vector3(0.99, 2.18, 0.045),
  ]);
  const forelockGeo = createAnatomicalLoft(
    forelockCurve,
    (t) => ({
      dorsal: 0.025 * (1 - t * 0.7),
      ventral: 0.02 * (1 - t * 0.7),
      width: 0.034 * (1 - t * 0.75),
    }),
    10,
    10
  );
  hairGroup.add(new THREE.Mesh(forelockGeo, darkHairMat));

  // Cascading mane locks along arched neck crest
  for (let i = 0; i < 7; i++) {
    const f = i / 6;
    const startX = 0.85 - f * 0.42;
    const startY = 2.26 - f * 0.82;
    const maneCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, startY, 0.015),
      new THREE.Vector3(startX - 0.045, startY - 0.13, 0.115 + f * 0.035),
      new THREE.Vector3(startX - 0.10, startY - 0.27, 0.155 + f * 0.02),
    ]);
    const lockGeo = createAnatomicalLoft(
      maneCurve,
      (t) => ({
        dorsal: 0.036 * (1 - t * 0.75),
        ventral: 0.032 * (1 - t * 0.75),
        width: 0.02 * (1 - t * 0.65),
      }),
      12,
      10
    );
    hairGroup.add(new THREE.Mesh(lockGeo, darkHairMat));
  }

  // Flowing 3-strand tail with gentle idle motion
  const tailSubGroup = new THREE.Group();
  tailSubGroup.name = 'cavalo-tail';
  tailSubGroup.position.set(-0.62, 1.40, 0);

  [
    { dz: 0, dx: -0.42, dy: -0.70, w: 0.072 },
    { dz: 0.042, dx: -0.37, dy: -0.63, w: 0.052 },
    { dz: -0.042, dx: -0.37, dy: -0.63, w: 0.052 },
  ].forEach((strand) => {
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.18, 0.04, strand.dz * 0.65),
      new THREE.Vector3(strand.dx * 0.78, strand.dy * 0.45, strand.dz),
      new THREE.Vector3(strand.dx, strand.dy, strand.dz * 1.15),
    ]);
    const tailGeo = createAnatomicalLoft(
      tailCurve,
      (t) => {
        const s = Math.sin(Math.min(1, t * 1.12) * Math.PI * 0.78 + 0.3);
        return {
          dorsal: strand.w * s,
          ventral: strand.w * s,
          width: strand.w * 0.72 * (1 - t * 0.45),
        };
      },
      18,
      12
    );
    tailSubGroup.add(new THREE.Mesh(tailGeo, darkHairMat));
  });
  hairGroup.add(tailSubGroup);

  registerPart(root, hairGroup, new THREE.Vector3(-0.35, 0.52, 0.24));

  // ---------------------------------------------------------------------------
  // 5. Four Articulated Skeletal Legs in Classic Marcha Cadence
  //    Plinth top = y 0.240; grounded hooves sit flush at y = 0.240
  // ---------------------------------------------------------------------------
  const legsGroup = new THREE.Group();
  const hoofGeo = createSculptedHoofGeometry();

  const buildArticulatedLeg = (
    points: [number, number, number][],
    radii: [number, number][],
    hoofPos: [number, number, number],
    hoofTiltZ = 0
  ) => {
    const legSub = new THREE.Group();
    const legCurve = new THREE.CatmullRomCurve3(
      points.map((pt) => new THREE.Vector3(pt[0], pt[1], pt[2]))
    );
    const legGeo = createAnatomicalLoft(
      legCurve,
      (t) => {
        const scaled = t * (radii.length - 1);
        const idx = Math.min(radii.length - 1, Math.floor(scaled));
        const next = Math.min(radii.length - 1, idx + 1);
        const frac = scaled - idx;
        const rA = radii[idx][0] + (radii[next][0] - radii[idx][0]) * frac;
        const rW = radii[idx][1] + (radii[next][1] - radii[idx][1]) * frac;
        return { dorsal: rA, ventral: rA, width: rW };
      },
      26,
      14
    );
    legSub.add(new THREE.Mesh(legGeo, coatMat));

    const hoof = new THREE.Mesh(hoofGeo, hoofMat);
    hoof.position.set(hoofPos[0], hoofPos[1], hoofPos[2]);
    hoof.rotation.z = hoofTiltZ;
    legSub.add(hoof);

    const shoe = new THREE.Mesh(
      new THREE.TorusGeometry(0.052, 0.0085, 8, 18, Math.PI * 1.45),
      goldMat
    );
    shoe.position.set(hoofPos[0], hoofPos[1] + 0.006, hoofPos[2]);
    shoe.rotation.x = Math.PI / 2;
    shoe.rotation.z = -Math.PI * 0.22 + hoofTiltZ;
    legSub.add(shoe);

    return legSub;
  };

  // Front-Left: Elevated forward Marcha stride (knee bent, pastern poised)
  legsGroup.add(
    buildArticulatedLeg(
      [
        [0.41, 1.18, 0.135], // Elbow/Forearm top
        [0.57, 0.82, 0.145], // Flexed Knee (Carpo)
        [0.73, 0.62, 0.145], // Cannon bone
        [0.79, 0.50, 0.145], // Fetlock -> Pastern
        [0.83, 0.43, 0.145], // Coronet
      ],
      [
        [0.098, 0.082],
        [0.052, 0.048],
        [0.037, 0.035],
        [0.042, 0.038],
        [0.034, 0.032],
      ],
      [0.84, 0.37, 0.145],
      -0.38
    )
  );

  // Front-Right: Grounded support column flush on plinth top (y = 0.24)
  legsGroup.add(
    buildArticulatedLeg(
      [
        [0.39, 1.18, -0.135], // Forearm
        [0.39, 0.78, -0.135], // Knee (Carpo)
        [0.39, 0.48, -0.135], // Cannon
        [0.40, 0.36, -0.135], // Fetlock
        [0.43, 0.295, -0.135], // Coronet
      ],
      [
        [0.098, 0.082],
        [0.052, 0.048],
        [0.036, 0.034],
        [0.042, 0.038],
        [0.034, 0.032],
      ],
      [0.44, 0.24, -0.135],
      0
    )
  );

  // Hind-Right: Engaged driving leg with sculpted hock (jarrete), flush at y = 0.24
  legsGroup.add(
    buildArticulatedLeg(
      [
        [-0.44, 1.24, -0.135], // Thigh / Stifle
        [-0.40, 0.96, -0.135], // Gaskin
        [-0.50, 0.72, -0.135], // Backward-pointing Hock (Jarrete)
        [-0.36, 0.42, -0.135], // Hind cannon / Fetlock
        [-0.31, 0.295, -0.135], // Coronet
      ],
      [
        [0.132, 0.098],
        [0.086, 0.068],
        [0.056, 0.046],
        [0.040, 0.038],
        [0.034, 0.032],
      ],
      [-0.30, 0.24, -0.135],
      0
    )
  );

  // Hind-Left: Sweeping rear push with clear hock angle, flush at y = 0.24
  legsGroup.add(
    buildArticulatedLeg(
      [
        [-0.47, 1.24, 0.135], // Thigh
        [-0.56, 0.94, 0.135], // Gaskin
        [-0.70, 0.70, 0.135], // Hock (Jarrete)
        [-0.68, 0.42, 0.135], // Cannon / Fetlock
        [-0.65, 0.295, 0.135], // Coronet
      ],
      [
        [0.132, 0.098],
        [0.086, 0.068],
        [0.056, 0.046],
        [0.040, 0.038],
        [0.034, 0.032],
      ],
      [-0.64, 0.24, 0.135],
      0
    )
  );

  registerPart(root, legsGroup, new THREE.Vector3(0, -0.08, 0));

  // ---------------------------------------------------------------------------
  // 6. Minimalist Saddle Pad, Contoured Saddle, Brass Stirrups & Reins
  // ---------------------------------------------------------------------------
  const tackGroup = new THREE.Group();

  const saddlePad = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.248,
      0.248,
      0.44,
      24,
      1,
      false,
      -Math.PI * 0.46,
      Math.PI * 0.92
    ),
    crimsonPadMat
  );
  saddlePad.rotation.z = Math.PI / 2;
  saddlePad.rotation.x = Math.PI / 2;
  saddlePad.position.set(0.02, 1.325, 0);
  saddlePad.scale.set(1.0, 1.0, 1.08);
  tackGroup.add(saddlePad);

  const saddleSeat = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.258,
      0.258,
      0.32,
      24,
      1,
      false,
      -Math.PI * 0.36,
      Math.PI * 0.72
    ),
    saddleLeatherMat
  );
  saddleSeat.rotation.z = Math.PI / 2;
  saddleSeat.rotation.x = Math.PI / 2;
  saddleSeat.position.set(0.03, 1.345, 0);
  saddleSeat.scale.set(1.0, 1.0, 1.04);
  tackGroup.add(saddleSeat);

  const cantle = new THREE.Mesh(
    new THREE.TorusGeometry(0.145, 0.026, 10, 20, Math.PI),
    saddleLeatherMat
  );
  cantle.rotation.y = Math.PI / 2;
  cantle.position.set(-0.11, 1.495, 0);
  tackGroup.add(cantle);

  [-1, 1].forEach((side) => {
    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.34, 0.013),
      saddleLeatherMat
    );
    strap.position.set(0.05, 1.24, side * 0.248);
    tackGroup.add(strap);

    const stirrup = new THREE.Mesh(
      new THREE.TorusGeometry(0.044, 0.0085, 8, 20),
      goldMat
    );
    stirrup.rotation.y = Math.PI / 2;
    stirrup.position.set(0.05, 1.04, side * 0.252);
    tackGroup.add(stirrup);

    const reinCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.19, 1.895, side * 0.055),
      new THREE.Vector3(0.68, 1.70, side * 0.155),
      new THREE.Vector3(0.16, 1.54, side * 0.04),
    ]);
    tackGroup.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(reinCurve, 18, 0.008, 6, false),
        saddleLeatherMat
      )
    );
  });

  registerPart(root, tackGroup, new THREE.Vector3(0, 0.85, 0));

  return root;
}
