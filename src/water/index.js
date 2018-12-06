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
let pointLight
let startTime = Date.now()

function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x444444 )

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100
    )
    camera.position.z = 25
    camera.position.y = 10;

    controls = new OrbitControls( camera )

    uniforms = THREE.UniformsUtils.merge( [
        {
            tex: { type: 't', value: new THREE.TextureLoader().load( 'images/lat.jpg' ) },
            time: { type: 'f', value: 1.0 }
        },
        // THREE.UniformsLib.lights
    ])

    geometry = new THREE.SphereGeometry(1, 250, 250)
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: frag,
        vertexShader: vert,
        // lights: true
    })

    mesh = new THREE.Mesh(geometry, material)
    // mesh.castShadow = true
    // mesh.receiveShadow = true
    scene.add(mesh)

    pointLight = new THREE.PointLight( 0xFFFFFF, 1, 1, )
    pointLight.position.set( 0, 20, 0 )
    pointLight.lookAt( mesh )
    pointLight.castShadow = true
    scene.add( pointLight )
    // scene.add( new THREE.PointLightHelper( pointLight ) )

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)
}

function animate() {
    animationId = requestAnimationFrame(animate)

    let elapsedMilliseconds = Date.now() - startTime
    uniforms.time.value = elapsedMilliseconds / 1000

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
