import * as THREE from 'three'
import { CORE_SKILLS } from '../../data/portfolio'
import {
  PALETTE,
  type SharedMaterials,
  addEdgesOverlay,
  createGlowSprite,
} from '../materials'

export interface CoreSystemsConstruct {
  group: THREE.Group
  interactiveMeshes: THREE.Mesh[]
  update: (elapsed: number, buildProgress: number, selectedSkillId: string) => void
  dispose: () => void
}

interface SkillNodeVisual {
  id: string
  anchor: THREE.Group
  hitMesh: THREE.Mesh
  haloRing: THREE.Mesh
  glow: THREE.Sprite
  baseAngle: number
  radius: number
  yOffset: number
}

export function buildCoreSystems(
  materials: SharedMaterials,
): CoreSystemsConstruct {
  const group = new THREE.Group()
  group.name = 'core-systems-sector'
  group.position.set(0, 26, 0)

  const ringLevels: Array<{ y: number; radius: number; dir: number }> = [
    { y: -2.6, radius: 5.2, dir: 1 },
    { y: 0.0, radius: 4.3, dir: -1 },
    { y: 2.6, radius: 3.4, dir: 1 },
  ]

  const tierRings: THREE.Group[] = []

  ringLevels.forEach((level, idx) => {
    const tierGroup = new THREE.Group()
    tierGroup.position.y = level.y

    const ringMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(level.radius, level.radius, 0.16, 24, 1, true),
      idx === 1 ? materials.glassCyan : materials.glassDark,
    )
    addEdgesOverlay(
      ringMesh,
      idx === 1 ? materials.edgeCyan : materials.edgeCyanDim,
      15,
    )
    tierGroup.add(ringMesh)

    const thinTrack = new THREE.Mesh(
      new THREE.TorusGeometry(level.radius + 0.35, 0.025, 6, 48),
      materials.cyanEmissive,
    )
    thinTrack.rotation.x = Math.PI / 2
    tierGroup.add(thinTrack)

    group.add(tierGroup)
    tierRings.push(tierGroup)
  })

  // Vertical structural ribs linking the 3 levels
  const ribGeo = new THREE.BoxGeometry(0.14, 5.6, 0.14)
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2
    const rib = new THREE.Mesh(ribGeo, materials.structureMetal)
    rib.position.set(Math.cos(angle) * 3.1, 0, Math.sin(angle) * 3.1)
    addEdgesOverlay(rib, materials.edgeWhite)
    group.add(rib)
  }

  // Interactive 3D Skill Nodes mapped onto the 3 interconnected architectural tiers
  const skillVisuals: SkillNodeVisual[] = []
  const interactiveMeshes: THREE.Mesh[] = []

  const ringIndicesCount: Record<number, number> = { 1: 0, 2: 0, 3: 0 }
  const ringTotals: Record<number, number> = { 1: 0, 2: 0, 3: 0 }
  CORE_SKILLS.forEach((s) => {
    ringTotals[s.levelRing] += 1
  })

  const nodeGeo = new THREE.OctahedronGeometry(0.46, 0)
  const haloGeo = new THREE.TorusGeometry(0.72, 0.022, 6, 32)

  CORE_SKILLS.forEach((skill) => {
    const levelCfg = ringLevels[skill.levelRing - 1]
    const slot = ringIndicesCount[skill.levelRing]
    ringIndicesCount[skill.levelRing] += 1
    const totalInRing = ringTotals[skill.levelRing]

    const angleOffset = (skill.levelRing - 1) * 0.75
    const baseAngle = angleOffset + (slot / totalInRing) * Math.PI * 2
    const radius = levelCfg.radius + 0.35

    const anchor = new THREE.Group()
    anchor.position.set(
      Math.cos(baseAngle) * radius,
      levelCfg.y,
      Math.sin(baseAngle) * radius,
    )

    const nodeMat = materials.glassCyan.clone()
    const hitMesh = new THREE.Mesh(nodeGeo, nodeMat)
    hitMesh.userData = {
      interactiveType: 'skill',
      id: skill.id,
      label: skill.name,
    }
    addEdgesOverlay(hitMesh, materials.edgeCyan)
    anchor.add(hitMesh)
    interactiveMeshes.push(hitMesh)

    const haloRing = new THREE.Mesh(haloGeo, materials.cyanEmissive.clone())
    haloRing.rotation.x = Math.PI / 2.4
    anchor.add(haloRing)

    const glow = createGlowSprite(materials.glowTexture, 2.1, 0.48)
    anchor.add(glow)

    group.add(anchor)
    skillVisuals.push({
      id: skill.id,
      anchor,
      hitMesh,
      haloRing,
      glow,
      baseAngle,
      radius,
      yOffset: levelCfg.y,
    })
  })

  return {
    group,
    interactiveMeshes,
    update: (elapsed, buildProgress, selectedSkillId) => {
      const clamped = Math.max(0.05, Math.min(1, buildProgress))

      tierRings.forEach((ring, idx) => {
        const local = Math.max(0.1, Math.min(1, (clamped - idx * 0.1) / 0.7))
        ring.scale.setScalar(local)
        ring.rotation.y = elapsed * 0.1 * ringLevels[idx].dir
      })

      skillVisuals.forEach((node, idx) => {
        const isSelected = node.id === selectedSkillId
        const orbitAngle = node.baseAngle + elapsed * 0.08 * (idx % 2 === 0 ? 1 : -1)
        const scale = (0.35 + clamped * 0.65) * (isSelected ? 1.38 : 1)

        node.anchor.position.set(
          Math.cos(orbitAngle) * node.radius * (0.4 + clamped * 0.6),
          node.yOffset + Math.sin(elapsed * 1.4 + idx) * 0.16,
          Math.sin(orbitAngle) * node.radius * (0.4 + clamped * 0.6),
        )
        node.anchor.scale.setScalar(scale)

        node.hitMesh.rotation.y = elapsed * (isSelected ? 1.7 : 0.75)
        node.haloRing.rotation.z = elapsed * (isSelected ? 1.4 : 0.4)

        const mat = node.hitMesh.material as THREE.MeshPhysicalMaterial
        mat.emissiveIntensity = isSelected ? 0.55 : 0.12
        mat.color.setHex(isSelected ? PALETTE.cyanElectric : PALETTE.cyanSecondary)
        node.glow.scale.setScalar(isSelected ? 3.2 : 1.8)
      })
    },
    dispose: () => {
      nodeGeo.dispose()
      haloGeo.dispose()
      for (const node of skillVisuals) {
        ;(node.hitMesh.material as THREE.Material).dispose()
        ;(node.haloRing.material as THREE.Material).dispose()
        node.glow.material.dispose()
      }
    },
  }
}
