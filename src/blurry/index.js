import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'
import dat from 'dat.gui'

import vert from './shaders/shader.vert'
import frag from './shaders/shader.frag'

// Initial HMR Setup
if (module.hot) {
    module.hot.accept()

    module.hot.dispose(() => {
        document.querySelector('canvas').remove()
        gui.destroy()
        renderer.forceContextLoss()
        renderer.context = null
        renderer.domElement = null
        renderer = null
        cancelAnimationFrame(animationId)
        removeEventListener('resize', resize)
    })
}

// Three Scene
let scene, camera, renderer, animationId
let uniforms, geometry, material, mesh
let gui
let lights
let startTime = Date.now()

function init() {

    gui = new dat.GUI()

    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x000000 )

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.z = 100

    geometry = new THREE.PlaneGeometry(100, 100)
    material = new THREE.MeshPhongMaterial({ color: 0xb068c, specular: 0xFFFFFF, shininess: 7 })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    planeControls( material )

    let ambientLight = new THREE.AmbientLight( 0xFFFFFF )
    scene.add( ambientLight )

    lights = []
    lights[0] = new THREE.PointLight( 0xF9CDB8, 0.96, 123, 0.38 )
    lights[0].position.set(-3, 4, 47)
    lights[1] = new THREE.PointLight( 0xF9CDB8, 0.25, 150, 0.4 )
    lights[1].position.set(-16, 5, 33)
    lights[2] = new THREE.PointLight( 0xa0fdff, 1.5, 200, 0 )
    lights[2].position.set(-76, 23, 40)
    lights[3] = new THREE.PointLight( 0xf5cfbc, 1.8, 93, 1.04 )
    lights[3].position.set(66, -56, 50)

    lights.forEach( (light, key) => {
        scene.add( light )
        lightControls( light, key )
    })

    // scene.add( new THREE.PointLightHelper( lights[0] ))

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)
}

function lightControls( light, key ) {

    let controller = new function() {
        this.color = light.color.getHex()
        this.positionX = light.position.x
        this.positionY = light.position.y
        this.positionZ = light.position.z
        this.intensity = light.intensity
        this.decay = light.decay
        this.distance = light.distance
    }()

    let f = gui.addFolder('Light ' + key)
    f.addColor(controller, 'color').onChange( function() {
        light.color.set(controller.color)
    })
    f.add(controller, 'positionX', -150, 150).onChange( function() {
        light.position.x = (controller.positionX)
    })
    f.add(controller, 'positionY', -150, 150).onChange( function() {
        light.position.y = (controller.positionY)
    })
    f.add(controller, 'positionZ', -150, 150).onChange( function() {
        light.position.z = (controller.positionZ)
    })
    f.add(controller, 'intensity', 0, 2).onChange( function() {
        light.intensity = (controller.intensity)
    })
    f.add(controller, 'decay', 0, 10).onChange( function() {
        light.decay = (controller.decay)
    })
    f.add(controller, 'distance', 0, 150).onChange( function() {
        light.distance = (controller.distance)
    })

}

function planeControls( plane ) {

    let controller = new function() {
        this.color = plane.color.getHex()
        this.shininess = plane.shininess
        this.specular = plane.specular.getHex()
    }()

    let f = gui.addFolder('Plane')
    f.addColor(controller, 'color').onChange( function() {
        plane.color.set(controller.color)
    })
    f.add(controller, 'shininess', 0, 50).onChange( function() {
        plane.shininess = (controller.shininess)
    })
    f.addColor(controller, 'specular', 0, 10).onChange( function() {
        plane.specular.set(controller.specular)
    })

}

function animate() {
    animationId = requestAnimationFrame(animate)

    if( lights[2].position.x === 80 ) {
        lights[2].position.x = -76
        lights[2].position.y = 23
        lights[2].intensity = 1.3
    }
    lights[2].position.x += 1
    lights[2].position.y -= 0.1
    lights[2].intensity -= 0.001

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
