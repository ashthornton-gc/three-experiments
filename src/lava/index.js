import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'

import vert from './shaders/shader.vert'
import frag from './shaders/shader.frag'

// Initial HMR Setup
if (module.hot) {
    module.hot.accept()

    module.hot.dispose(() => {
        document.querySelector('canvas').remove()
        renderer.forceContextLoss()
        renderer.context = null
        renderer.domElement = null
        renderer = null
        cancelAnimationFrame(animationId)
        removeEventListener('resize', resize)
    })
}

// Three Scene
let scene, camera, renderer, animationId, controls
let uniforms, geometry, material, mesh
let startTime = Date.now()

function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x180a1a )

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100
    )
    camera.position.z = 70

    controls = new OrbitControls( camera )

    uniforms = {
        tGrad: { type: 't', value: new THREE.TextureLoader().load('images/grad-sq.jpg') },
        time: { type: 'f', value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() }
    }

    geometry = new THREE.SphereGeometry(15, 250, 250)
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: frag,
        vertexShader: vert
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)
}

function animate() {
    animationId = requestAnimationFrame(animate)

    let elapsedMilliseconds = Date.now() - startTime
    uniforms.time.value = elapsedMilliseconds / 1000.

    renderer.render(scene, camera)
}

init()
animate()

// Event listeners
function resize() {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}

addEventListener('resize', resize)
