import * as THREE from 'three'

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
let uniforms, geometry, material, mesh, mesh2, mesh3, texture
let scrollPos = 0, scrolling = false
let startTime = Date.now()

function init() {
    scene = new THREE.Scene()

    camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 2 )
    camera.position.z = 1
    scene.add( camera )

    new THREE.TextureLoader().load('images/nic.jpg', texture => {

        console.log(texture);
        

        uniforms = {
            time: { type: 'f', value: 1.0 },
            texture: { type: 't', value: texture },
            size: { type: 'v2', value: new THREE.Vector2(texture.width, texture.height)}
        }
    
        geometry = new THREE.PlaneGeometry(texture.image.width,texture.image.height)
        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: frag,
            vertexShader: vert
        })
    
        mesh = new THREE.Mesh(geometry, material)
        mesh2 = new THREE.Mesh(geometry, material)
        mesh3 = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        scene.add(mesh2)
        scene.add(mesh3)

        // mesh2.position.y = 40
        // mesh3.position.y = 80
    
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio( window.devicePixelRatio )
        renderer.setSize(window.innerWidth, window.innerHeight)
    
        document.body.appendChild(renderer.domElement)

        renderer.domElement.addEventListener( 'wheel', scroll, false )

        animate()

    })

}

function animate() {
    animationId = requestAnimationFrame(animate)

    let elapsedMilliseconds = Date.now() - startTime
    uniforms.time.value = elapsedMilliseconds / 100

    if( scrolling ) {

        let delta = ( scrollPos - mesh.position.y ) / 12
        let delta2 = ( scrollPos - mesh2.position.y ) / 10
        let delta3 = ( scrollPos - mesh3.position.y ) / 8

        mesh.position.y += delta
        mesh2.position.y += delta2
        mesh3.position.y += delta3

        // if( Math.abs( delta ) > 0.1 ) {
        //     scrolling = true
        // } else {
        //     scrolling = false
        // }

    }

    renderer.render(scene, camera)
}

init()

function scroll( e ) {

    let delta = normalizeWheelDelta(e)

    scrollPos += -delta * 60
    scrolling = true
    
    function normalizeWheelDelta( e ) {
        if(e.detail && e.wheelDelta)
            return e.wheelDelta/e.detail/40 * (e.detail>0 ? 1 : -1) // Opera
        else if( e.deltaY )
            return -e.deltaY / 60 // Firefox
        else
            return e.wheelDelta/120 // IE,Safari,Chrome
    }

}

// Event listeners
function resize() {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}

addEventListener('resize', resize)
