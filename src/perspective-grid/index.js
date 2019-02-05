import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'

import vert from './shaders/shader.vert'
import frag from './shaders/shader.frag'

// Initial HMR Setup
if (module.hot) {
    module.hot.accept()

    module.hot.dispose(() => {
        document.querySelector('canvas').remove()
        grid.renderer.forceContextLoss()
        grid.renderer.context = null
        grid.renderer.domElement = null
        grid.renderer = null
        cancelAnimationFrame(grid.animationId)
        removeEventListener('resize', grid.resize)
    })
}

class PerspectiveGrid {

    constructor() {

        this.setConfig()
        this.init()
        this.animate()

        this.resize = this.resize.bind( this )
        addEventListener( 'resize', this.resize )

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

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        // this.renderer.setPixelRatio( this.c.dpr )
        this.renderer.setSize( this.c.size.w, this.c.size.h )
        document.body.appendChild( this.renderer.domElement )

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0x000000 )

        let cameraPosition = 900;

        const fov = 180 * ( 2 * Math.atan( this.c.size.h / 2 / cameraPosition ) ) / Math.PI
        this.camera = new THREE.PerspectiveCamera( fov, this.c.size.w / this.c.size.h, 1, 2000 )
        this.camera.lookAt( this.scene.position )
        this.camera.position.z = cameraPosition

        this.controls = new OrbitControls( this.camera )

        this.grid = new THREE.Group()
        this.scene.add( this.grid )

        this.items = []

        for( let i = 0; i < 3; i++ ) {

            this.items[i] = {}

            this.items[i].uniforms = {
                time: { type: 'f', value: 1.0 }
            }

            this.items[i].geometry = new THREE.PlaneGeometry(1, 1)
            this.items[i].material = new THREE.ShaderMaterial({
                uniforms: this.items[i].uniforms,
                fragmentShader: frag,
                vertexShader: vert
            })

            this.items[i].mesh = new THREE.Mesh( this.items[i].geometry, this.items[i].material )

            this.grid.add( this.items[i].mesh )

        }

        this.items[0].mesh.scale.set( 300, 500, 1 )
        this.items[0].mesh.position.set( -300, -100, 0 )

        this.items[1].mesh.scale.set( 300, 500, 1 )
        this.items[1].mesh.position.set( 300, 100, 0 )

        this.items[2].mesh.scale.set( 200, 100, 1 )
        this.items[2].mesh.position.set( 0, 0, 0 )

    }

    mousePosHandler( e ) {

        this.mouseX = e.clientX / window.innerWidth - 0.5;
        this.mouseY = e.clientY / window.innerHeight - 0.5;
        this.updatingPerspective = true;

    }

    updatePerspective() {

        TweenMax.to( this.mesh.rotation, 3, {
            x: this.mouseY * 0.1,
            y: this.mouseX * 0.1,
            ease: 'Power4.easeOut',
        });

        // TweenMax.to( this.mesh.position, 3, {
        //     x: -this.mouseX * 15,
        //     y: -this.mouseY * 15,
        //     ease: 'Power4.easeOut',
        // });

        this.updatingPerspective = false;

    }

    animate() {

        this.animationId = requestAnimationFrame( this.animate.bind(this) )

        let elapsedMilliseconds = Date.now() - this.c.startTime
        // uniforms.time.value = elapsedMilliseconds / 1000

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