import * as THREE from 'three'
import { PALETTE } from '../materials'

export interface ParticleField {
  mesh: THREE.InstancedMesh
  update: (elapsed: number, globalProgress: number, reducedMotion: boolean) => void
  dispose: () => void
}

interface ParticleSeed {
  x: number
  y: number
  z: number
  speed: number
  phase: number
  scale: number
}

export function buildParticles(count: number): ParticleField {
  const geo = new THREE.BoxGeometry(0.085, 0.085, 0.085)
  const mat = new THREE.MeshBasicMaterial({
    color: PALETTE.cyanElectric,
    transparent: true,
    opacity: 0.58,
  })

  const mesh = new THREE.InstancedMesh(geo, mat, count)
  mesh.name = 'architectural-particles'
  mesh.raycast = () => {}
  mesh.frustumCulled = false

  const seeds: ParticleSeed[] = []
  for (let i = 0; i < count; i += 1) {
    // Deterministic golden-ratio distribution so particles look balanced
    const ratio = i / Math.max(1, count)
    const angle = i * 2.3999632
    const radius = 3.2 + ((i * 7) % 19) * 0.72
    seeds.push({
      x: Math.cos(angle) * radius,
      y: ratio * 60 - 2,
      z: Math.sin(angle) * radius,
      speed: 0.35 + (i % 5) * 0.14,
      phase: (i * 0.37) % (Math.PI * 2),
      scale: 0.55 + (i % 4) * 0.28,
    })
  }

  const dummy = new THREE.Object3D()

  return {
    mesh,
    update: (elapsed, globalProgress, reducedMotion) => {
      const time = reducedMotion ? 0 : elapsed
      for (let i = 0; i < count; i += 1) {
        const s = seeds[i]
        const driftY = (s.y + time * s.speed) % 62
        const activeHeightCap = 12 + globalProgress * 52
        const visibleScale = driftY <= activeHeightCap ? s.scale : 0.001

        dummy.position.set(
          s.x + Math.sin(time * 0.4 + s.phase) * 0.25,
          driftY - 2,
          s.z + Math.cos(time * 0.35 + s.phase) * 0.25,
        )
        dummy.rotation.set(time * 0.3 + s.phase, time * 0.4, 0)
        dummy.scale.setScalar(visibleScale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    },
    dispose: () => {
      geo.dispose()
      mat.dispose()
    },
  }
}
