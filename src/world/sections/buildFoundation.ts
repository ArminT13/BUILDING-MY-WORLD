import * as THREE from 'three'
import {
  PALETTE,
  type SharedMaterials,
  addEdgesOverlay,
  createGlowSprite,
} from '../materials'

export interface FoundationConstruct {
  group: THREE.Group
  update: (elapsed: number, buildProgress: number, globalProgress: number) => void
}

export function buildFoundation(materials: SharedMaterials): FoundationConstruct {
  const group = new THREE.Group()
  group.name = 'foundation-sector'

  // Subtle architectural datum grid at base elevation
  const grid = new THREE.GridHelper(60, 40, PALETTE.cyanSecondary, 0x0f1a2c)
  grid.position.y = -0.35
  const gridMaterials = Array.isArray(grid.material)
    ? grid.material
    : [grid.material]
  for (const mat of gridMaterials) {
    mat.transparent = true
    mat.opacity = 0.28
  }
  group.add(grid)

  // Three stepped octagonal foundation plinths
  const plinthRadii = [6.4, 4.4, 2.7]
  const plinthHeights = [0.22, 0.24, 0.28]
  const plinthMeshes: THREE.Mesh[] = []

  plinthRadii.forEach((radius, index) => {
    const geo = new THREE.CylinderGeometry(
      radius,
      radius * 1.04,
      plinthHeights[index],
      8,
    )
    const mat = index === 1 ? materials.glassCyan : materials.glassDark
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.y = index * 0.28
    mesh.rotation.y = Math.PI / 8
    addEdgesOverlay(
      mesh,
      index === 2 ? materials.edgeCyan : materials.edgeCyanDim,
    )
    group.add(mesh)
    plinthMeshes.push(mesh)
  })

  // 4 corner anchor pylons framing the foundation
  const pylons: THREE.Group[] = []
  const pylonAngles = [
    Math.PI * 0.25,
    Math.PI * 0.75,
    Math.PI * 1.25,
    Math.PI * 1.75,
  ]
  const pylonGeo = new THREE.BoxGeometry(0.38, 3.2, 0.38)

  pylonAngles.forEach((angle) => {
    const holder = new THREE.Group()
    holder.position.set(Math.cos(angle) * 5.2, 0, Math.sin(angle) * 5.2)

    const mesh = new THREE.Mesh(pylonGeo, materials.structureMetal)
    mesh.position.y = 1.6
    addEdgesOverlay(mesh, materials.edgeCyan)
    holder.add(mesh)

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.08, 0.46),
      materials.cyanEmissive,
    )
    cap.position.y = 3.25
    holder.add(cap)

    group.add(holder)
    pylons.push(holder)
  })

  // Central origin crystal beacon + glow
  const originBeacon = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.58, 0),
    materials.glassCyan,
  )
  originBeacon.position.y = 1.55
  addEdgesOverlay(originBeacon, materials.edgeCyan)
  group.add(originBeacon)

  const beaconGlow = createGlowSprite(materials.glowTexture, 4.4, 0.72)
  beaconGlow.position.set(0, 1.55, 0)
  group.add(beaconGlow)

  // Central rising structural spine (extends up through all 5 sectors as visitor scrolls)
  const spineGeo = new THREE.CylinderGeometry(0.11, 0.14, 1, 6)
  spineGeo.translate(0, 0.5, 0)
  const centralSpine = new THREE.Mesh(spineGeo, materials.glassCyan)
  addEdgesOverlay(centralSpine, materials.edgeCyan)
  group.add(centralSpine)

  // Outer rotating datum ring
  const datumRing = new THREE.Mesh(
    new THREE.TorusGeometry(6.9, 0.025, 6, 64),
    materials.cyanEmissive,
  )
  datumRing.rotation.x = Math.PI / 2
  datumRing.position.y = 0.04
  group.add(datumRing)

  return {
    group,
    update: (elapsed, buildProgress, globalProgress) => {
      const eased = Math.min(1, Math.max(0.15, buildProgress))

      plinthMeshes.forEach((plinth, idx) => {
        const local = Math.min(1, Math.max(0.05, (eased - idx * 0.12) / 0.7))
        plinth.scale.set(local, 1, local)
      })

      pylons.forEach((pylon, idx) => {
        const local = Math.min(1, Math.max(0.04, (eased - idx * 0.08) / 0.65))
        pylon.scale.y = local
      })

      originBeacon.rotation.y = elapsed * 0.65
      originBeacon.position.y = 1.55 + Math.sin(elapsed * 1.4) * 0.14
      beaconGlow.position.y = originBeacon.position.y

      // Central structural conduit grows continuously with world progress
      const spineHeight = 3.2 + Math.max(0, Math.min(1, globalProgress)) * 53.5
      centralSpine.scale.set(1, spineHeight, 1)

      datumRing.rotation.z = elapsed * 0.12
    },
  }
}
