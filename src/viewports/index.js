import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'

import vert from './shaders/shader.vert'
import frag from './shaders/shader.frag'
import pass1 from './shaders/pass1.frag'

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
        // removeEventListener('resize', resize)
    })
}

// Three Scene
var cameraRTT, camera, sceneRTT, sceneScreen, scene, renderer, zmesh1, zmesh2;

let controls

let animationId

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var rtTexture, material, quad;

var delta = 0.01;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 100;

    controls = new OrbitControls( camera )

    cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 10000, 10000 );
    cameraRTT.position.z = 100;

    //

    scene = new THREE.Scene();
    sceneRTT = new THREE.Scene();
    sceneScreen = new THREE.Scene();

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 ).normalize();
    sceneRTT.add( light );

    light = new THREE.DirectionalLight( 0xffaaaa, 1.5 );
    light.position.set( 0, 0, - 1 ).normalize();
    sceneRTT.add( light );

    rtTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );

    material = new THREE.ShaderMaterial( {
        uniforms: { time: { value: 0.0 } },
        vertexShader: vert,
        fragmentShader: pass1
    } );

    var materialScreen = new THREE.ShaderMaterial( {
        uniforms: { tDiffuse: { value: rtTexture.texture } },
        vertexShader: vert,
        fragmentShader: frag,
        depthWrite: false
    } );

    var plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );

    quad = new THREE.Mesh( plane, material );
    quad.position.z = - 100;
    sceneRTT.add( quad );

    var geometry = new THREE.TorusBufferGeometry( 100, 25, 15, 30 );

    var mat1 = new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0xffaa00, shininess: 5 } );

    zmesh1 = new THREE.Mesh( geometry, mat1 );
    zmesh1.position.set( 0, 0, 100 );
    zmesh1.scale.set( 1.5, 1.5, 1.5 );
    sceneRTT.add( zmesh1 );

    quad = new THREE.Mesh( plane, materialScreen );
    quad.position.z = - 100;
    sceneScreen.add( quad );

    var n = 2,
        geometry = new THREE.PlaneBufferGeometry( 15, 15 ),
        material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: rtTexture.texture } );

    for ( var j = 0; j < n; j ++ ) {

        for ( var i = 0; i < n; i ++ ) {

            var mesh = new THREE.Mesh( geometry, material2 );

            mesh.position.x = ( i - ( n - 1 ) / 2 ) * 20;
            mesh.position.y = ( j - ( n - 1 ) / 2 ) * 20;
            mesh.position.z = 0;

            scene.add( mesh );

        }

    }

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;

    document.body.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}

//

function animate() {

    animationId = requestAnimationFrame( animate );

    render();

}

function render() {

    var time = Date.now() * 0.0015;

    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    if ( zmesh1 ) {

        zmesh1.rotation.y = - time;

    }

    if ( material.uniforms[ "time" ].value > 1 || material.uniforms[ "time" ].value < 0 ) {

        delta *= - 1;

    }

    material.uniforms[ "time" ].value += delta;

    renderer.clear();

    // Render first scene into texture

    renderer.render( sceneRTT, cameraRTT, rtTexture, true );

    // Render full screen quad with generated texture

    renderer.render( sceneScreen, cameraRTT );

    // Render second scene to screen
    // (using first scene as regular texture)

    renderer.render( scene, camera );

}
