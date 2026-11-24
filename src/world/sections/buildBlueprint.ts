import * as THREE from 'three'
import { BLUEPRINT_MILESTONES } from '../../data/portfolio'
import {
  PALETTE,
  type SharedMaterials,
  addEdgesOverlay,
  createConduitPulseMaterial,
  createGlowSprite,
} from '../materials'

export interface BlueprintConstruct {
  group: THREE.Group
  update: (
    elapsed: number,
    buildProgress: number,
    selectedMilestoneId: string,
  ) => void
  dispose: () => void
}

export function buildBlueprint(materials: SharedMaterials): BlueprintConstruct {
  const group = new THREE.Group()
  group.name = 'blueprint-sector'
  group.position.set(0, 12, 0)

  // Blueprint horizontal drafting plane
  const deckGeo = new THREE.BoxGeometry(11.8, 0.14, 8.6)
  const deck = new THREE.Mesh(deckGeo, materials.glassDark)
  addEdgesOverlay(deck, materials.edgeCyanDim)
  group.add(deck)

  const blueprintGrid = new THREE.GridHelper(
    11.4,
    18,
    PALETTE.cyanElectric,
    PALETTE.cyanSecondary,
  )
  blueprintGrid.position.y = 0.09
  const gridMats = Array.isArray(blueprintGrid.material)
    ? blueprintGrid.material
    : [blueprintGrid.material]
  for (const m of gridMats) {
    m.transparent = true
    m.opacity = 0.32
  }
  group.add(blueprintGrid)

  // Vertical wireframe drafting arches
  const frameArches: THREE.LineSegments[] = []
  const archGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(11.8, 4.6, 0.08))
  ;[-3.4, 0, 3.4].forEach((zOffset) => {
    const arch = new THREE.LineSegments(archGeo, materials.edgeWhite)
    arch.position.set(0, 2.35, zOffset)
    group.add(arch)
    frameArches.push(arch)
  })

  // 5 ascending Blueprint Milestone Pylons along a gentle spatial arc
  const pylonPoints: THREE.Vector3[] = []
  const milestoneNodes = new Map<
    string,
    { pillar: THREE.Mesh; beacon: THREE.Mesh; glow: THREE.Sprite; baseY: number }
  >()

  const pillarGeo = new THREE.BoxGeometry(0.45, 1, 0.45)
  pillarGeo.translate(0, 0.5, 0)

  BLUEPRINT_MILESTONES.forEach((milestone, index) => {
    const ratio = index / (BLUEPRINT_MILESTONES.length - 1)
    const x = -4.2 + ratio * 8.4
    const z = Math.sin(ratio * Math.PI) * 2.1 - 0.5
    const height = 1.4 + index * 0.65

    const pillar = new THREE.Mesh(pillarGeo, materials.glassCyan)
    pillar.position.set(x, 0.1, z)
    pillar.scale.y = height
    addEdgesOverlay(pillar, materials.edgeCyan)
    group.add(pillar)

    const beacon = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.28, 0),
      materials.cyanEmissive.clone(),
    )
    beacon.position.set(x, 0.45 + height, z)
    group.add(beacon)

    const glow = createGlowSprite(materials.glowTexture, 1.8, 0.55)
    glow.position.copy(beacon.position)
    group.add(glow)

    pylonPoints.push(new THREE.Vector3(x, 0.45 + height, z))
    milestoneNodes.set(milestone.id, {
      pillar,
      beacon,
      glow,
      baseY: 0.45 + height,
    })
  })

  // Curved cyan energy conduit tracing through all 5 milestone beacons
  const curve = new THREE.CatmullRomCurve3(pylonPoints)
  const conduitGeo = new THREE.TubeGeometry(curve, 64, 0.045, 6, false)
  const conduitMat = createConduitPulseMaterial(0.95)
  const conduitMesh = new THREE.Mesh(conduitGeo, conduitMat)
  group.add(conduitMesh)

  return {
    group,
    update: (elapsed, buildProgress, selectedMilestoneId) => {
      const clamped = Math.max(0.05, Math.min(1, buildProgress))
      deck.scale.set(0.4 + clamped * 0.6, 1, 0.4 + clamped * 0.6)

      frameArches.forEach((arch, idx) => {
        const local = Math.max(0.02, Math.min(1, (clamped - idx * 0.1) / 0.7))
        arch.scale.y = local
      })

      conduitMat.uniforms.uTime.value = elapsed
      conduitMat.uniforms.uProgress.value = Math.min(1, clamped * 1.15)

      let index = 0
      for (const [id, node] of milestoneNodes.entries()) {
        const isActive = id === selectedMilestoneId
        const threshold = index * 0.12
        const localBuild = Math.max(
          0.08,
          Math.min(1, (clamped - threshold) / 0.55),
        )
        const targetHeight = (1.4 + index * 0.65) * localBuild
        node.pillar.scale.y = targetHeight
        node.beacon.position.y = 0.4 + targetHeight + Math.sin(elapsed * 2 + index) * 0.08
        node.glow.position.y = node.beacon.position.y

        const scale = isActive ? 1.55 : 0.95
        node.beacon.scale.setScalar(scale)
        node.beacon.rotation.y = elapsed * (isActive ? 1.8 : 0.7)
        node.glow.scale.setScalar(isActive ? 3.1 : 1.55)
        ;(node.beacon.material as THREE.MeshBasicMaterial).color.setHex(
          isActive ? PALETTE.offWhite : PALETTE.cyanElectric,
        )
        index += 1
      }
    },
    dispose: () => {
      archGeo.dispose()
      conduitGeo.dispose()
      conduitMat.dispose()
      for (const node of milestoneNodes.values()) {
        ;(node.beacon.material as THREE.Material).dispose()
        node.glow.material.dispose()
      }
    },
  }
}
