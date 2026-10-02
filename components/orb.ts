// The hero orb in plain three.js: a wobbling glass core with sparkles and three rings of glowing nodes, lit by the "city"
// environment and bloomed. It leans toward the pointer, spins like a trackball when dragged, and a tap nudges it.
import {
  AmbientLight, BufferAttribute, BufferGeometry, Color, DataTexture, EquirectangularReflectionMapping, Euler, Group, HalfFloatType,
  InstancedMesh, LinearFilter, LinearSRGBColorSpace, MathUtils, Mesh, MeshPhysicalMaterial, Object3D, PerspectiveCamera,
  PointLight, Points, Quaternion, RGBAFormat, Scene, ShaderMaterial, SphereGeometry, TorusGeometry, Vector3, WebGLRenderer,
} from "three"
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js"
import { BlendFunction, BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing"

export interface Orb { setTheme(dark: boolean): void; dispose(): void }

const THEMES = {
  dark: {
    colors: ["#6d28d9", "#8b5cf6", "#a855f7"], ambient: 0.4, light: { color: "#8b5cf6", intensity: 0.8 }, bloom: { intensity: 0.8, threshold: 0.2 },
    core: { transmission: 0.95, opacity: 0.6, envMapIntensity: 1.6 }, ring: { glow: 1.2, emissiveIntensity: 0.6, opacity: 0.7 },
    node: { glow: 0.7, pulse: 0.6, opacity: 0.9 }, sparkles: { count: 80, size: 0.4, opacity: 0.7 },
  },
  light: {
    colors: ["#38008d", "#6928d9", "#9333ea"], ambient: 0.3, light: { color: "#7c3aed", intensity: 0.6 }, bloom: { intensity: 0.5, threshold: 0.35 },
    core: { transmission: 0.85, opacity: 0.7, envMapIntensity: 1.2 }, ring: { glow: 1, emissiveIntensity: 0.4, opacity: 0.6 },
    node: { glow: 0.5, pulse: 0.4, opacity: 0.8 }, sparkles: { count: 60, size: 0.35, opacity: 0.5 },
  },
}
const RINGS = [
  { radius: 2.1, tilt: [Math.PI / 2, 0, 0], speed: 0.6 },
  { radius: 2.3, tilt: [0, Math.PI / 2, 0], speed: 0.5 },
  { radius: 2.2, tilt: [Math.PI / 4, Math.PI / 4, 0], speed: 0.4 },
]
const NODES = 4
// Rings, nodes and core share a centre, so three.js' depth sort kept flipping them and ring arcs behind the core popped
// in front of it; drawing rings and nodes first keeps the order stable
const BEFORE_CORE = -1

// The core's organic wobble, displaced on the GPU with exact normals (the deformation's Jacobian is diagonal)
const WOBBLE = /* glsl */ `
uniform float uTime;
vec3 wobble(vec3 p) { return p + 0.15 * vec3(sin(p.x * 2.0 + uTime * 0.7), cos(p.y * 2.2 + uTime * 0.6), sin(p.z * 1.8 + uTime * 0.5)); }
vec3 wobbleNormal(vec3 p, vec3 n) {
  return normalize(n / vec3(1.0 + 0.30 * cos(p.x * 2.0 + uTime * 0.7), 1.0 - 0.33 * sin(p.y * 2.2 + uTime * 0.6), 1.0 + 0.27 * cos(p.z * 1.8 + uTime * 0.5)));
}
`
// drei's <Sparkles>, minus its divide-by-zero (an infinite pixel the bloom smeared over the whole canvas: the flash)
const SPARKLES_VERTEX = /* glsl */ `
uniform float uTime, uSize, uPixelRatio;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  float phase = uTime * 0.4 + world.x * 100.0;
  world.xyz += vec3(cos(phase), sin(phase), cos(phase)) * 0.2;
  vec4 view = viewMatrix * world;
  gl_Position = projectionMatrix * view;
  gl_PointSize = uSize * 25.0 * uPixelRatio / -view.z;
}`
const SPARKLES_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float strength = max(0.05 / max(distance(gl_PointCoord, vec2(0.5)), 0.02) - 0.1, 0.0);
  gl_FragColor = vec4(uColor, min(strength * uOpacity, 1.0));
}`

const { clamp, degToRad, mapLinear, randFloatSpread, smoothstep } = MathUtils

// Critically damped spring: keeps its velocity between frames, so motion starts and stops smoothly
function damp(cur: number, to: number, s: { v: number }, smoothTime: number, dt: number) {
  if (dt <= 0) return cur
  const w = 2 / smoothTime, x = w * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  const d = cur - to, tmp = (s.v + w * d) * dt
  s.v = (s.v - w * tmp) * e
  return to + (d + tmp) * e
}

export function createOrb(container: HTMLElement, options: { dark: boolean; hdr: ArrayBuffer | null; onReady: () => void }): Orb | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: "default" })
  } catch {
    return null // no WebGL: the hero simply shows no orb
  }
  // The glass only refracts a flat backdrop, so a tiny refraction buffer looks identical and costs far less
  renderer.transmissionResolutionScale = 0.125
  const canvas = renderer.domElement
  // Touch: the orb's own circle (the grip) takes every gesture, so drags never turn into a scroll; the rest scrolls
  canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y pinch-zoom"
  const grip = document.createElement("div")
  grip.style.cssText = "position:absolute;left:50%;top:50%;height:80%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;touch-action:none"
  container.append(canvas, grip)

  const disposables: { dispose(): void }[] = []
  const own = <T extends { dispose(): void }>(resource: T) => (disposables.push(resource), resource)

  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 0.1, 1000)
  camera.position.set(0, 0, 10)
  const ambient = new AmbientLight()
  const light = new PointLight(0xffffff, 1, 12)
  const tilt = new Group() // leans toward the pointer
  const turn = new Group() // spun by dragging; inside the lean, so the lean always follows the pointer
  tilt.add(turn)
  scene.add(ambient, light, tilt)

  // Core: a wobbling glass sphere, sparkles drifting around it
  const time = { value: 0 }
  const coreMaterial = own(new MeshPhysicalMaterial({ roughness: 0.05, metalness: 0.3, transparent: true, clearcoat: 0.7, clearcoatRoughness: 0.05, ior: 1.8, thickness: 1.5 }))
  coreMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${WOBBLE}`)
      .replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\nobjectNormal = wobbleNormal( position, objectNormal );")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed = wobble( position );")
  }
  const coreMesh = new Mesh(own(new SphereGeometry(1, 128, 128)), coreMaterial)
  coreMesh.frustumCulled = false
  const sparklesGeometry = own(new BufferGeometry())
  sparklesGeometry.setAttribute("position", new BufferAttribute(new Float32Array(THEMES.dark.sparkles.count * 3).map(() => randFloatSpread(1.8)), 3))
  const sparklesMaterial = own(new ShaderMaterial({
    uniforms: { uTime: time, uSize: { value: 0 }, uPixelRatio: { value: 1 }, uColor: { value: new Color() }, uOpacity: { value: 0 } },
    vertexShader: SPARKLES_VERTEX, fragmentShader: SPARKLES_FRAGMENT, transparent: true, depthWrite: false,
  }))
  const core = new Group()
  core.add(coreMesh, new Points(sparklesGeometry, sparklesMaterial))
  turn.add(core)

  // Rings, each carrying four glowing nodes
  const nodeGeometry = own(new SphereGeometry(0.1, 32, 32))
  const rings = RINGS.map(({ radius, tilt: [rx, ry, rz], speed }) => {
    const material = own(new MeshPhysicalMaterial({ metalness: 0.8, roughness: 0.15, transparent: true, clearcoat: 0.4, clearcoatRoughness: 0.2, transmission: 0.1 }))
    // transmission 0.001 is visually nothing: it puts the nodes in the rings' draw pass (see BEFORE_CORE)
    const nodeMaterial = own(new MeshPhysicalMaterial({ roughness: 0, metalness: 1, transparent: true, transmission: 0.001 }))
    const ring = new Mesh(own(new TorusGeometry(radius, 0.025, 32, 100)), material)
    const nodes = new InstancedMesh(nodeGeometry, nodeMaterial, NODES)
    ring.renderOrder = nodes.renderOrder = BEFORE_CORE
    nodes.frustumCulled = false
    const spin = new Group(), float = new Group()
    spin.add(ring, nodes)
    float.add(spin)
    turn.add(float)
    return {
      radius, rx, ry, rz, speed, material, nodeMaterial, nodes, spin, float,
      offset: Math.random() * 10000,
      orbits: Array.from({ length: NODES }, () => ({ speed: 0.15 + Math.random() * 0.1, phase: Math.random() * Math.PI * 2 })),
    }
  })

  // HDR buffers and a mipmap bloom. 5 blur levels keep the glow around the orb; 8 left a faint "box" at the canvas edge
  const composer = own(new EffectComposer(renderer, { frameBufferType: HalfFloatType, multisampling: devicePixelRatio > 1.5 ? 4 : 8 }))
  const bloom = new BloomEffect({ blendFunction: BlendFunction.SCREEN, luminanceSmoothing: 0.9, levels: 5 })
  // White glints (the sky mirrored in the glass) bloom at a fifth of their strength, so the glow stays purple
  bloom.luminanceMaterial.fragmentShader = bloom.luminanceMaterial.fragmentShader.replace(
    /gl_FragColor\s*=\s*texel\s*\*\s*mask\s*;/,
    "float peak=max(texel.r,max(texel.g,texel.b));mask*=mix(0.2,1.0,smoothstep(0.15,0.6,(peak-min(texel.r,min(texel.g,texel.b)))/max(peak,1e-4)));gl_FragColor=texel*mask;",
  )
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new EffectPass(camera, bloom))

  let nodeGlow = THEMES.dark.node
  const applyTheme = (dark: boolean) => {
    const theme = dark ? THEMES.dark : THEMES.light
    ambient.intensity = theme.ambient
    light.color.set(theme.light.color)
    light.intensity = theme.light.intensity
    bloom.intensity = theme.bloom.intensity
    bloom.luminanceMaterial.threshold = theme.bloom.threshold
    coreMaterial.color.set(theme.colors[0])
    Object.assign(coreMaterial, theme.core)
    sparklesGeometry.setDrawRange(0, theme.sparkles.count)
    const u = sparklesMaterial.uniforms
    u.uColor.value.set(theme.colors[0])
    u.uSize.value = theme.sparkles.size
    u.uOpacity.value = theme.sparkles.opacity
    nodeGlow = theme.node
    rings.forEach(({ material, nodeMaterial }, i) => {
      const color = theme.colors[i]
      material.color.set(color)
      material.emissive.set(color).multiplyScalar(theme.ring.glow)
      material.emissiveIntensity = theme.ring.emissiveIntensity
      material.opacity = theme.ring.opacity
      nodeMaterial.color.set(color)
      nodeMaterial.emissive.set(color)
      nodeMaterial.opacity = theme.node.opacity
    })
  }
  applyTheme(options.dark)

  // The "city" lighting, in place before the first frame so the orb never appears unlit
  if (options.hdr)
    try {
      const { data, width, height, type } = new HDRLoader().parse(options.hdr)
      const env = own(new DataTexture(data, width, height, RGBAFormat, type, EquirectangularReflectionMapping))
      Object.assign(env, { colorSpace: LinearSRGBColorSpace, minFilter: LinearFilter, magFilter: LinearFilter, flipY: true, needsUpdate: true })
      scene.environment = coreMaterial.envMap = env // its own handle, so the core's reflection strength applies
    } catch {} // without it the orb still renders, just darker

  // Pointer: the orb leans toward the cursor, more the closer it gets (a finger on the orb too). Dragging spins it like
  // a trackball that coasts on, the lighting turning along so reflections sweep the glass. A tap nudges it.
  const mouse = new Vector3(), axis = new Vector3(), q = new Quaternion(), lighting = new Euler()
  let nx = 0, ny = 0, influence = 0
  let velocity = 0 // rad/s around `axis`, coasting whenever the pointer isn't moving
  let moved = false // the pointer already turned the orb this frame
  let drag: { id: number; x: number; y: number; t: number; moved: number } | null = null
  const rotate = (angle: number) => {
    turn.quaternion.premultiply(q.setFromAxisAngle(axis, angle)).normalize()
    // three negates these angles to sample the environment, so XYZ angles relabelled ZYX give its exact inverse turn
    lighting.setFromQuaternion(turn.quaternion, "XYZ").order = "ZYX"
    coreMaterial.envMapRotation.copy(lighting)
    scene.environmentRotation.copy(lighting)
  }
  const aim = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    nx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
    ny = (r.top + r.height / 2 - e.clientY) / (r.height / 2)
    influence = 1 - smoothstep(Math.hypot(nx, ny), 0.9, 2.4)
  }
  const onDown = (e: PointerEvent) => {
    if (e.button || drag || (e.pointerType !== "mouse" && e.target !== grip)) return
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, moved: 0 }
    grip.setPointerCapture(e.pointerId) // keeps the drag going outside the orb, or the window
    aim(e)
    requestFrame()
  }
  const onMove = (e: PointerEvent) => {
    const mine = drag?.id === e.pointerId
    if (e.pointerType === "mouse" || mine) aim(e)
    if (!drag || !mine) return
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y
    const angle = (Math.hypot(dx, dy) / Math.max(canvas.clientWidth / 2, 1)) * 1.5 // half the width turns it 1.5 rad
    if (angle) {
      axis.set(dy, dx, 0).normalize()
      rotate(angle)
      velocity = Math.min(angle / Math.max((e.timeStamp - drag.t) / 1000, 1 / 120), 25)
      moved = true
      drag.moved += angle
    }
    Object.assign(drag, { x: e.clientX, y: e.clientY, t: e.timeStamp })
    requestFrame()
  }
  const onUp = (e: PointerEvent) => {
    if (!drag || drag.id !== e.pointerId) return
    if (e.type === "pointerup" && drag.moved < 0.03 && (nx || ny)) {
      axis.set(-ny, nx, 0).normalize() // a tap or click pushes the orb toward that spot
      velocity = Math.max(velocity, 2.5)
    }
    if (e.pointerType !== "mouse") influence = 0
    drag = null
  }
  const off = new AbortController(), signal = off.signal
  container.addEventListener("pointerdown", onDown, { signal })
  addEventListener("pointermove", onMove, { passive: true, signal })
  addEventListener("pointerup", onUp, { signal })
  addEventListener("pointercancel", onUp, { signal })
  document.documentElement.addEventListener("pointerleave", () => { if (!drag) influence = 0 }, { signal })

  const dummy = new Object3D(), node = new Vector3()
  const viewHeight = 2 * Math.tan(degToRad(camera.fov / 2)) * camera.position.length()
  const sx = { v: 0 }, sy = { v: 0 }, se = { v: 0 }
  let px = 0, py = 0, engage = 0, lastT = -1

  const update = (t: number) => {
    time.value = t
    // Time-based motion: the orb reacts the same way on a 60 Hz and a 144 Hz screen
    const dt = lastT < 0 ? 0 : Math.min(t - lastT, 0.05)
    lastT = t
    if (moved) moved = false
    else if (velocity > 0.005) {
      rotate(velocity * dt)
      velocity *= Math.exp(-1.54 * dt) // TrackballControls' damping (0.05 per frame at 60 fps)
    }

    px = damp(px, clamp(nx, -1, 1) * influence, sx, 0.5, dt)
    py = damp(py, clamp(ny, -1, 1) * influence, sy, 0.5, dt)
    engage = damp(engage, influence, se, 0.5, dt)
    mouse.set((px * viewHeight * camera.aspect) / 2, (py * viewHeight) / 2, 0)
    tilt.rotation.set(-py * 0.28, px * 0.28, 0)

    core.position.set(Math.sin(t * 0.3) * 0.2 + px * 0.15, Math.cos(t * 0.4) * 0.2 + py * 0.12, Math.sin(t * 0.2) * 0.15)
    core.rotation.set(Math.sin(t * 0.3) * 0.2, t * 0.2 + Math.sin(t * 0.4) * 0.1, Math.sin(t * 0.2) * 0.15)

    const glow = nodeGlow.glow + ((Math.sin(t * 0.7) + 1) / 2) * nodeGlow.pulse
    const sway = Math.max(0, 1 - mouse.length() / 6) * 0.35 * engage
    for (const ring of rings) {
      const f = ((ring.offset + t) / 4) * 0.3 // drei <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
      ring.float.rotation.set((Math.cos(f) / 8) * 0.1, (Math.sin(f) / 8) * 0.1, (Math.sin(f) / 20) * 0.1)
      ring.float.position.y = mapLinear(Math.sin(f) / 10, -0.1, 0.1, -0.05, 0.05) * 0.2

      const s = t * ring.speed
      ring.spin.rotation.set(ring.rx + Math.sin(s * 0.4) * 0.1 + mouse.y * sway, ring.ry + s * 0.3 + mouse.x * sway, ring.rz + Math.cos(s * 0.6) * 0.08)

      ring.orbits.forEach(({ speed, phase }, i) => {
        const nodeT = t * speed + phase
        const angle = (i / NODES) * Math.PI * 2 + nodeT * 0.4
        node.set(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0)
        const pull = Math.max(0, 1 - node.distanceTo(mouse) / 3) ** 2 * 0.6 * engage
        // Dots lean toward the pointer by sliding along their own ring, so they can never leave it
        let toward = Math.atan2(mouse.y, mouse.x) - angle
        toward = Math.atan2(Math.sin(toward), Math.cos(toward))
        const slid = angle + toward * pull * 0.3
        dummy.position.set(Math.cos(slid) * ring.radius, Math.sin(slid) * ring.radius, 0)
        dummy.scale.setScalar((0.8 + (Math.sin(nodeT * (0.6 + i * 0.1)) + 1) * 0.3) * (1 + pull * 0.3))
        dummy.updateMatrix()
        ring.nodes.setMatrixAt(i, dummy.matrix)
      })
      ring.nodes.instanceMatrix.needsUpdate = true
      ring.nodeMaterial.emissiveIntensity = glow
    }
  }

  // Rendering runs only while the orb is on screen and motion is allowed; otherwise single frames on demand
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)")
  let ready = false, visible = false, running = false, disposed = false
  let pending = 0, elapsed = 0, last = 0
  const draw = () => { update(elapsed); composer.render() }
  const loop = (now: number) => {
    elapsed += Math.min(now - last, 100) / 1000 // resumes where it paused instead of jumping ahead
    last = now
    draw()
  }
  function requestFrame() {
    if (ready && !running && !pending) pending = requestAnimationFrame(() => ((pending = 0), draw()))
  }
  const sync = () => {
    const run = ready && visible && !reducedMotion.matches
    if (run !== running) {
      running = run
      last = performance.now()
      renderer.setAnimationLoop(run ? loop : null)
    }
    requestFrame()
  }
  const resize = () => {
    const { width, height } = container.getBoundingClientRect()
    if (!width || !height) return
    renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio, 1), 2))
    composer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    sparklesMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio()
    requestFrame()
  }
  const resizeObserver = new ResizeObserver(resize)
  const visibilityObserver = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; sync() }, { rootMargin: "100px" })
  resize()
  resizeObserver.observe(container)
  visibilityObserver.observe(container)
  reducedMotion.addEventListener("change", sync, { signal })

  void (async () => {
    // Where supported, compile the shaders in the background (for the HDR buffer they render into)
    if (renderer.extensions.has("KHR_parallel_shader_compile")) {
      renderer.setRenderTarget(composer.inputBuffer)
      await renderer.compileAsync(scene, camera).catch(() => {})
      renderer.setRenderTarget(null)
    }
    if (disposed) return
    ready = true
    sync()
    requestAnimationFrame(() => options.onReady())
  })()

  return {
    setTheme(dark) {
      applyTheme(dark)
      requestFrame()
    },
    dispose() {
      disposed = true
      renderer.setAnimationLoop(null)
      cancelAnimationFrame(pending)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      off.abort()
      for (const resource of disposables) resource.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
      grip.remove()
    },
  }
}
