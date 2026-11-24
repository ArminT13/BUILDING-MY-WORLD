import * as THREE from 'three'
import {
  PALETTE,
  type SharedMaterials,
  addEdgesOverlay,
  createGlowSprite,
} from '../materials'

export interface HorizonConstruct {
  group: THREE.Group
  update: (elapsed: number, buildProgress: number) => void
  dispose: () => void
}

export function buildHorizon(materials: SharedMaterials): HorizonConstruct {
  const group = new THREE.Group()
  group.name = 'horizon-sector'
  group.position.set(0, 52.5, 0)

  // Floating open-ended apex diamond crown (continuous construction motif)
  const apexCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.7, 0),
    materials.glassCyan,
  )
  apexCore.position.y = 2.6
  addEdgesOverlay(apexCore, materials.edgeCyan)
  group.add(apexCore)

  // Expanding skyward rings suggesting infinite growth
  const rings: THREE.Mesh[] = []
  const ringGeos: THREE.TorusGeometry[] = []
  ;[2.4, 3.6, 4.9].forEach((radius, idx) => {
    const geo = new THREE.TorusGeometry(radius, 0.025, 6, 48)
    ringGeos.push(geo)
    const ringMat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? PALETTE.cyanElectric : PALETTE.cyanSecondary,
      transparent: true,
      opacity: idx === 0 ? 0.72 : 0.35,
    })
    const ring = new THREE.Mesh(geo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = idx * 1.4
    group.add(ring)
    rings.push(ring)
  })

  // Unfinished ascending wireframe needle extending beyond the apex
  const spireBeamGeo = new THREE.CylinderGeometry(0.02, 0.06, 8.5, 6)
  const spireBeam = new THREE.Mesh(spireBeamGeo, materials.cyanEmissive)
  spireBeam.position.y = 6.8
  group.add(spireBeam)

  const apexGlow = createGlowSprite(materials.glowTexture, 7.2, 0.65)
  apexGlow.position.y = 2.6
  group.add(apexGlow)

  return {
    group,
    update: (elapsed, buildProgress) => {
      const clamped = Math.max(0.1, Math.min(1, buildProgress))
      group.scale.setScalar(0.45 + clamped * 0.55)

      apexCore.rotation.y = elapsed * 0.45
      apexCore.position.y = 2.6 + Math.sin(elapsed * 1.1) * 0.22
      apexGlow.position.y = apexCore.position.y

      rings.forEach((ring, idx) => {
        const phase = (elapsed * 0.22 + idx * 0.33) % 1
        ring.position.y = phase * 5.2
        const mat = ring.material as THREE.MeshBasicMaterial
        mat.opacity = (1 - phase) * 0.55 * clamped
        ring.rotation.z = elapsed * (idx % 2 === 0 ? 0.2 : -0.15)
      })

      spireBeam.scale.y = 0.3 + clamped * 0.85 + Math.sin(elapsed * 2) * 0.05
    },
    dispose: () => {
      spireBeamGeo.dispose()
      ringGeos.forEach((g) => g.dispose())
      rings.forEach((r) => (r.material as THREE.Material).dispose())
      apexGlow.material.dispose()
    },
  }
}
