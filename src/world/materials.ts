import * as THREE from 'three'

export const PALETTE = {
  void: 0x07090e,
  slate: 0x0d1422,
  offWhite: 0xf8fafc,
  cyanElectric: 0x00e5ff,
  cyanSecondary: 0x06b6d4,
} as const

export interface SharedMaterials {
  glassDark: THREE.MeshPhysicalMaterial
  glassCyan: THREE.MeshPhysicalMaterial
  structureMetal: THREE.MeshStandardMaterial
  cyanEmissive: THREE.MeshBasicMaterial
  edgeCyan: THREE.LineBasicMaterial
  edgeCyanDim: THREE.LineBasicMaterial
  edgeWhite: THREE.LineBasicMaterial
  glowTexture: THREE.CanvasTexture
  dispose: () => void
}

export function createRadialGlowTexture(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    gradient.addColorStop(0, 'rgba(248, 250, 252, 1)')
    gradient.addColorStop(0.25, 'rgba(0, 229, 255, 0.78)')
    gradient.addColorStop(0.6, 'rgba(6, 182, 212, 0.2)')
    gradient.addColorStop(1, 'rgba(7, 9, 14, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function createSharedMaterials(): SharedMaterials {
  const glowTexture = createRadialGlowTexture()

  const glassDark = new THREE.MeshPhysicalMaterial({
    color: PALETTE.slate,
    metalness: 0.15,
    roughness: 0.16,
    transparent: true,
    opacity: 0.56,
    transmission: 0.12,
    side: THREE.DoubleSide,
  })

  const glassCyan = new THREE.MeshPhysicalMaterial({
    color: PALETTE.cyanSecondary,
    emissive: PALETTE.cyanElectric,
    emissiveIntensity: 0.08,
    metalness: 0.1,
    roughness: 0.18,
    transparent: true,
    opacity: 0.24,
    side: THREE.DoubleSide,
  })

  const structureMetal = new THREE.MeshStandardMaterial({
    color: 0x101827,
    metalness: 0.62,
    roughness: 0.34,
  })

  const cyanEmissive = new THREE.MeshBasicMaterial({
    color: PALETTE.cyanElectric,
    transparent: true,
    opacity: 0.9,
  })

  const edgeCyan = new THREE.LineBasicMaterial({
    color: PALETTE.cyanElectric,
    transparent: true,
    opacity: 0.78,
  })

  const edgeCyanDim = new THREE.LineBasicMaterial({
    color: PALETTE.cyanSecondary,
    transparent: true,
    opacity: 0.36,
  })

  const edgeWhite = new THREE.LineBasicMaterial({
    color: PALETTE.offWhite,
    transparent: true,
    opacity: 0.32,
  })

  return {
    glassDark,
    glassCyan,
    structureMetal,
    cyanEmissive,
    edgeCyan,
    edgeCyanDim,
    edgeWhite,
    glowTexture,
    dispose: () => {
      glassDark.dispose()
      glassCyan.dispose()
      structureMetal.dispose()
      cyanEmissive.dispose()
      edgeCyan.dispose()
      edgeCyanDim.dispose()
      edgeWhite.dispose()
      glowTexture.dispose()
    },
  }
}

export function addEdgesOverlay(
  mesh: THREE.Mesh,
  material: THREE.LineBasicMaterial,
  thresholdAngle = 22,
): THREE.LineSegments {
  const edges = new THREE.EdgesGeometry(mesh.geometry, thresholdAngle)
  const line = new THREE.LineSegments(edges, material)
  line.raycast = () => {}
  mesh.add(line)
  return line
}

export function createConduitPulseMaterial(opacity = 0.92): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 1 },
      uOpacity: { value: opacity },
      uColorBase: { value: new THREE.Color(PALETTE.cyanSecondary) },
      uColorPulse: { value: new THREE.Color(PALETTE.cyanElectric) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uProgress;
      uniform float uOpacity;
      uniform vec3 uColorBase;
      uniform vec3 uColorPulse;
      varying vec2 vUv;

      void main() {
        if (vUv.x > uProgress) discard;
        float wave = sin((vUv.x * 18.0) - (uTime * 3.2)) * 0.5 + 0.5;
        float pulse = pow(wave, 5.0);
        float tip = smoothstep(uProgress - 0.08, uProgress, vUv.x);
        vec3 col = mix(uColorBase, uColorPulse, pulse + tip * 0.65);
        float alpha = (0.28 + pulse * 0.72 + tip * 0.5) * uOpacity;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
  })
}

export function createGlowSprite(
  texture: THREE.Texture,
  scale: number,
  opacity = 0.7,
): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: texture,
    color: PALETTE.cyanElectric,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(scale, scale, 1)
  sprite.raycast = () => {}
  return sprite
}
