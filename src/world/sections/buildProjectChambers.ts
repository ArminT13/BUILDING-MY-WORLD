import * as THREE from 'three'
import { PROJECT_CHAMBERS, type ProjectChamber } from '../../data/portfolio'
import {
  PALETTE,
  type SharedMaterials,
  addEdgesOverlay,
  createGlowSprite,
} from '../materials'

export interface ProjectChambersConstruct {
  group: THREE.Group
  interactiveMeshes: THREE.Mesh[]
  update: (
    elapsed: number,
    buildProgress: number,
    activeChamberIndex: number,
    hoveredChamberId: string | null,
  ) => void
  dispose: () => void
}

interface ChamberVisual {
  id: string
  index: number
  pod: THREE.Group
  hitShell: THREE.Mesh
  innerArtifact: THREE.Group
  frameMat: THREE.LineBasicMaterial
  glow: THREE.Sprite
  basePos: THREE.Vector3
}

function createChamberInnerGeometry(
  kind: ProjectChamber['geometryKind'],
  materials: SharedMaterials,
): THREE.Group {
  const artifact = new THREE.Group()

  if (kind === 'prism') {
    // StudyMate: twin interlocking hexagonal core
    const outer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 1.4, 6),
      materials.glassCyan,
    )
    addEdgesOverlay(outer, materials.edgeCyan)
    artifact.add(outer)

    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42, 0),
      materials.cyanEmissive,
    )
    artifact.add(inner)
  } else if (kind === 'terrain') {
    // California House Price Prediction: stepped regression terraced bars
    const heights = [0.55, 0.95, 1.4, 0.8]
    const offsets: Array<[number, number]> = [
      [-0.36, -0.36],
      [0.36, -0.36],
      [0.36, 0.36],
      [-0.36, 0.36],
    ]
    heights.forEach((h, i) => {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, h, 0.48),
        i === 2 ? materials.glassCyan : materials.structureMetal,
      )
      bar.position.set(offsets[i][0], h / 2 - 0.6, offsets[i][1])
      addEdgesOverlay(bar, materials.edgeCyan)
      artifact.add(bar)
    })
  } else if (kind === 'conduit') {
    // FreelanceFlow: three stacked financial pipeline planes
    ;[-0.48, 0, 0.48].forEach((y, idx) => {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.14, 0.9),
        idx === 1 ? materials.glassCyan : materials.glassDark,
      )
      slab.position.y = y
      addEdgesOverlay(slab, materials.edgeCyan)
      artifact.add(slab)
    })
  } else if (kind === 'beacon') {
    // Predict & Bet: broadcast spire + concentric signal rings
    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(0.36, 1.4, 4),
      materials.glassCyan,
    )
    addEdgesOverlay(spire, materials.edgeCyan)
    artifact.add(spire)
    ;[0.35, 0.62].forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.025, 6, 24),
        materials.cyanEmissive,
      )
      ring.rotation.x = Math.PI / 2
      ring.position.y = idx * 0.34 - 0.15
      artifact.add(ring)
    })
  } else {
    // Warehouse Management System: modular DAO grid vault cubes
    for (let x = -0.35; x <= 0.36; x += 0.7) {
      for (let y = -0.35; y <= 0.36; y += 0.7) {
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(0.52, 0.52, 0.52),
          x > 0 && y > 0 ? materials.glassCyan : materials.structureMetal,
        )
        cube.position.set(x, y, 0)
        addEdgesOverlay(cube, materials.edgeCyan)
        artifact.add(cube)
      }
    }
  }

  return artifact
}

export function buildProjectChambers(
  materials: SharedMaterials,
): ProjectChambersConstruct {
  const group = new THREE.Group()
  group.name = 'project-chambers-sector'
  group.position.set(0, 39.5, 0)

  // Curved cantilevered gallery bridge connecting all 5 chambers
  const bridgeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-11.2, -1.6, 1.2),
    new THREE.Vector3(-5.6, -1.6, -0.4),
    new THREE.Vector3(0.0, -1.6, -1.0),
    new THREE.Vector3(5.6, -1.6, -0.4),
    new THREE.Vector3(11.2, -1.6, 1.2),
  ])
  const bridgeGeo = new THREE.TubeGeometry(bridgeCurve, 48, 0.12, 6, false)
  const bridgeMesh = new THREE.Mesh(bridgeGeo, materials.glassCyan)
  addEdgesOverlay(bridgeMesh, materials.edgeCyanDim)
  group.add(bridgeMesh)

  const chamberShellGeo = new THREE.BoxGeometry(2.6, 3.1, 2.2)
  const interactiveMeshes: THREE.Mesh[] = []
  const chambers: ChamberVisual[] = []

  PROJECT_CHAMBERS.forEach((project, index) => {
    const ratio = index / (PROJECT_CHAMBERS.length - 1)
    const x = -10.8 + ratio * 21.6
    const z = Math.cos((ratio - 0.5) * Math.PI) * -1.4 + 0.4
    const basePos = new THREE.Vector3(x, 0.25, z)

    const pod = new THREE.Group()
    pod.position.copy(basePos)

    const shellMat = materials.glassDark.clone()
    const hitShell = new THREE.Mesh(chamberShellGeo, shellMat)
    hitShell.userData = {
      interactiveType: 'chamber',
      id: project.id,
      index,
      label: project.name,
    }
    pod.add(hitShell)
    interactiveMeshes.push(hitShell)

    const frameMat = materials.edgeCyan.clone()
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(chamberShellGeo, 20),
      frameMat,
    )
    frame.raycast = () => {}
    pod.add(frame)

    const innerArtifact = createChamberInnerGeometry(
      project.geometryKind,
      materials,
    )
    pod.add(innerArtifact)

    // Pedestal tie connecting pod down to skybridge
    const tie = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.45, 0.28),
      materials.structureMetal,
    )
    tie.position.y = -1.75
    addEdgesOverlay(tie, materials.edgeCyanDim)
    pod.add(tie)

    const glow = createGlowSprite(materials.glowTexture, 4.2, 0.38)
    pod.add(glow)

    group.add(pod)
    chambers.push({
      id: project.id,
      index,
      pod,
      hitShell,
      innerArtifact,
      frameMat,
      glow,
      basePos,
    })
  })

  return {
    group,
    interactiveMeshes,
    update: (elapsed, buildProgress, activeChamberIndex, hoveredChamberId) => {
      const clamped = Math.max(0.05, Math.min(1, buildProgress))
      bridgeMesh.scale.set(0.3 + clamped * 0.7, 1, 1)

      chambers.forEach((ch, idx) => {
        const threshold = idx * 0.08
        const local = Math.max(0.04, Math.min(1, (clamped - threshold) / 0.65))
        const isActive = idx === activeChamberIndex
        const isHovered = ch.id === hoveredChamberId

        const hoverLift = isHovered ? 0.45 : isActive ? 0.22 : 0
        ch.pod.position.set(
          ch.basePos.x,
          ch.basePos.y +
            Math.sin(elapsed * 1.2 + idx * 0.9) * 0.14 +
            hoverLift,
          ch.basePos.z + (isActive || isHovered ? 0.45 : 0),
        )
        ch.pod.scale.setScalar(local * (isHovered ? 1.08 : isActive ? 1.04 : 0.96))

        ch.innerArtifact.rotation.y =
          elapsed * (isHovered || isActive ? 0.9 : 0.35) + idx * 0.4

        ch.frameMat.opacity = isHovered ? 1 : isActive ? 0.92 : 0.45
        ch.frameMat.color.setHex(
          isHovered ? PALETTE.offWhite : PALETTE.cyanElectric,
        )
        ch.glow.scale.setScalar(isHovered ? 5.6 : isActive ? 4.8 : 3.2)
        ch.glow.material.opacity = isHovered ? 0.65 : isActive ? 0.48 : 0.22
      })
    },
    dispose: () => {
      chamberShellGeo.dispose()
      bridgeGeo.dispose()
      for (const ch of chambers) {
        ;(ch.hitShell.material as THREE.Material).dispose()
        ch.frameMat.dispose()
        ch.glow.material.dispose()
      }
    },
  }
}
