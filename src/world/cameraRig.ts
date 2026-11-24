import * as THREE from 'three'

export interface CameraSample {
  position: THREE.Vector3
  lookAt: THREE.Vector3
}

/**
 * Smooth 5-stage architectural spline rig.
 * Keeps key constructs framed in open space beside stabilized reading zones.
 */
export class CameraSplineRig {
  private readonly positionCurve: THREE.CatmullRomCurve3
  private readonly targetCurve: THREE.CatmullRomCurve3

  constructor() {
    this.positionCurve = new THREE.CatmullRomCurve3(
      [
        // 01 Foundation (low majestic perspective, structure offset right)
        new THREE.Vector3(7.2, 3.0, 13.8),
        // Transition into Blueprint
        new THREE.Vector3(-4.0, 9.8, 15.5),
        // 02 Blueprint (three-quarter drafting deck overview)
        new THREE.Vector3(-8.8, 16.5, 14.2),
        // Transition into Core Systems
        new THREE.Vector3(1.8, 22.8, 15.2),
        // 03 Core Systems (intimate look into interlocking skill rings)
        new THREE.Vector3(8.6, 28.4, 13.0),
        // Transition into Project Chambers
        new THREE.Vector3(4.5, 36.6, 18.5),
        // 04 Project Chambers (gallery sweep framing all 5 suspended chambers in upper viewport)
        new THREE.Vector3(0.0, 42.2, 21.2),
        // Transition to Horizon pull-back
        new THREE.Vector3(6.5, 49.0, 25.5),
        // 05 Horizon (panoramic full-structure reveal)
        new THREE.Vector3(14.5, 55.5, 33.0),
      ],
      false,
      'catmullrom',
      0.5,
    )

    this.targetCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.8, 1.3, 0.0),
        new THREE.Vector3(0.5, 6.8, 0.0),
        new THREE.Vector3(2.4, 12.2, 0.0),
        new THREE.Vector3(0.8, 19.2, 0.0),
        new THREE.Vector3(-1.2, 26.2, 0.0),
        new THREE.Vector3(-0.4, 33.4, -0.5),
        new THREE.Vector3(0.0, 38.1, -0.8),
        new THREE.Vector3(0.0, 33.0, 0.0),
        new THREE.Vector3(0.0, 26.5, 0.0),
      ],
      false,
      'catmullrom',
      0.5,
    )
  }

  sample(
    progress: number,
    aspect: number,
    chamberPanOffset = 0,
    outPosition = new THREE.Vector3(),
    outLookAt = new THREE.Vector3(),
  ): CameraSample {
    const t = Math.max(0, Math.min(1, progress))
    this.positionCurve.getPointAt(t, outPosition)
    this.targetCurve.getPointAt(t, outLookAt)

    // Subtle lateral focus when inspecting Project Chambers (section 04)
    const chamberWeight =
      Math.max(0, 1 - Math.abs(t - 0.71) / 0.18) * (aspect >= 1 ? 1 : 0.65)
    outPosition.x += chamberPanOffset * 2.2 * chamberWeight
    outLookAt.x += chamberPanOffset * 3.1 * chamberWeight

    // Narrow viewports pull back gently so horizontal structures never clip
    if (aspect < 1.0) {
      const pullBack = (1.0 - aspect) * 9.5
      outPosition.z += pullBack
      outPosition.x *= 0.55
      outLookAt.x *= 0.3
    }

    return { position: outPosition, lookAt: outLookAt }
  }
}
