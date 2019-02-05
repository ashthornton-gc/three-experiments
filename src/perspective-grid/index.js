import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'
import { TweenMax } from 'gsap'

import vert from './shaders/shader.vert'
import frag from './shaders/shader.frag'

// Initial HMR Setup
if (module.hot) {
    module.hot.accept()

    module.hot.dispose(() => {
        grid.renderer.domElement.removeEventListener('wheel', grid.scroll)
        document.querySelector('canvas').remove()
        grid.renderer.forceContextLoss()
        grid.renderer.context = null
        grid.renderer.domElement = null
        grid.renderer = null
        cancelAnimationFrame(grid.animationId)
        removeEventListener('resize', grid.resize)
        removeEventListener('mousemove', grid.mouseMove)
        removeEventListener('mousedown', grid.mouseDown)
    })
}

class PerspectiveGrid {

    constructor() {

        this.setConfig()
        this.init()
        this.animate()

        this.resize = this.resize.bind( this )
        this.mouseMove = this.mouseMove.bind( this )
        this.scroll = this.scroll.bind( this )
        this.mouseDown = this.mouseDown.bind( this )
        addEventListener( 'resize', this.resize )
        addEventListener( 'mousemove', this.mouseMove )
        addEventListener( 'mousedown', this.mouseMove )
        this.renderer.domElement.addEventListener( 'wheel', this.scroll )

    }

    setConfig() {

        this.c = {
            dpr: window.devicePixelRatio >= 2 ? 2 : 1,
            startTime: Date.now(),
            size: {
                w: window.innerWidth,
                h: window.innerHeight
            }
        }

    }

    init() {

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
        // this.renderer.setPixelRatio( this.c.dpr )
        this.renderer.setSize( this.c.size.w, this.c.size.h )
        document.body.appendChild( this.renderer.domElement )

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0x000000 )
        this.scene.fog = new THREE.Fog( 0x000000, 1700, 2000);

        let cameraPosition = 900;

        const fov = 180 * ( 2 * Math.atan( this.c.size.h / 2 / cameraPosition ) ) / Math.PI
        this.camera = new THREE.PerspectiveCamera( fov, this.c.size.w / this.c.size.h, 1, 2000 )
        this.camera.lookAt( this.scene.position )
        this.camera.position.z = cameraPosition

        // this.controls = new OrbitControls( this.camera )
        // this.controls.enableZoom = false

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        this.grid = new THREE.Group()
        this.scene.add( this.grid )

        this.items = []

        for( let i = 0; i < 30; i++ ) {

            this.items[i] = {}

            this.items[i].uniforms = {
                time: { type: 'f', value: 1.0 },
                fogColor: { type: "c", value: this.scene.fog.color },
                fogNear: { type: "f", value: this.scene.fog.near },
                fogFar: { type: "f", value: this.scene.fog.far }
            }

            this.items[i].geometry = new THREE.PlaneGeometry( 1, 1 )
            this.items[i].material = new THREE.ShaderMaterial({
                uniforms: this.items[i].uniforms,
                fragmentShader: frag,
                vertexShader: vert,
                fog: true
            })

            this.items[i].mesh = new THREE.Mesh( this.items[i].geometry, this.items[i].material )

            this.items[i].mesh.scale.set( 300, 300, 1 )
            this.items[i].mesh.position.set( i % 2 ? 300 : - 300, i % 2 ? 300 : - 300, i * -500 )

            this.grid.add( this.items[i].mesh )

        }

        // this.items[0].mesh.scale.set( 300, 500, 1 )
        // this.items[0].mesh.position.set( -300, -100, 100 )

        // this.items[1].mesh.scale.set( 400, 300, 1 )
        // this.items[1].mesh.position.set( 100, 0, -400 )

        // this.items[2].mesh.scale.set( 370, 250, 1 )
        // this.items[2].mesh.position.set( 200, 100, 0 )

    }

    scroll( e ) {

        TweenMax.to( this.grid.position, 2, {
            z: '+=' + e.deltaY * 2,
            ease: 'Power4.easeOut'
        })

    }

    mouseDown( e ) {



    }

    mouseMove( e ) {

        this.mouse.x = e.clientX / window.innerWidth - 0.5
        this.mouse.y = e.clientY / window.innerHeight - 0.5
        this.updatingPerspective = true

    }

    updatePerspective() {

        this.items.forEach( item => {

            // TweenMax.to( item.mesh.rotation, 3, {
            //     x: this.mouseY * 0.5,
            //     y: this.mouseX * 0.5,
            //     ease: 'Power4.easeOut',
            // })

            // TweenMax.to( item.mesh.position, 3, {
            //     x: -this.mouseX * 15,
            //     y: -this.mouseY * 15,
            //     ease: 'Power4.easeOut',
            // });

        })

        TweenMax.to( this.camera.rotation, 3, {
            x: -this.mouse.y * 0.5,
            y: -this.mouse.x * 0.5,
            ease: 'Power4.easeOut',
        })

        this.updatingPerspective = false

    }

    animate() {

        this.animationId = requestAnimationFrame( this.animate.bind(this) )

        let elapsedMilliseconds = Date.now() - this.c.startTime
        this.items[0].uniforms.time.value = elapsedMilliseconds / 1000

        if( this.updatingPerspective ) {
            this.updatePerspective()
            this.updatingPerspective = false
        }

        this.renderer.render(this.scene, this.camera)

    }

    resize() {

        this.c.size = {
            w: window.innerWidth,
            h: window.innerHeight
        }
        this.camera.fov = 180 * ( 2 * Math.atan( this.c.size.h / 2 / this.camera.position.z ) ) / Math.PI
        this.camera.aspect = this.c.size.w / this.c.size.h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( this.c.size.w, this.c.size.h )

    }

}

const grid = new PerspectiveGrid();