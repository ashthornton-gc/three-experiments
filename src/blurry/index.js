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
let lights
let startTime = Date.now()

function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x000000 )

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.z = 100

    controls = new OrbitControls( camera )

    uniforms = {
        time: { type: 'f', value: 1.0 }
    }

    geometry = new THREE.PlaneGeometry(100, 100)
    material = new THREE.MeshPhongMaterial({ color: 0x2B23F9, specular: 0xFFFFFF, shininess: 10 })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let ambientLight = new THREE.AmbientLight( 0xFFFFFF );
    scene.add( ambientLight );

    lights = []
    lights[0] = new THREE.PointLight( 0xF9CDB8, 1, 150, 1 )
    lights[0].position.set(0, 0, 50)
    lights[1] = new THREE.PointLight( 0xF9CDB8, 0.5, 150, 1 )
    lights[1].position.set(-30, 5, 50)
    lights[2] = new THREE.PointLight( 0xa0fdff, 1, 200, 1 )
    lights[2].position.set(0, -35, 50)

    lights.forEach( light => {
        scene.add( light )
    })

    // scene.add( new THREE.PointLightHelper( lights[0] ))

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)
}

function animate() {
    animationId = requestAnimationFrame(animate)

    let elapsedMilliseconds = Date.now() - startTime
    uniforms.time.value = elapsedMilliseconds / 1000

    if( lights[2].position.x === 100 ) {
        lights[2].position.x = -100
        lights[2].position.y = -100
    }
    lights[2].position.x += 1
    lights[2].position.y += 1

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
