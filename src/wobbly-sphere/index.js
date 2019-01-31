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

var THREEx		= THREEx || {};

THREEx.GeometryWobble	= {};

THREEx.GeometryWobble.init	= function(geometry)
{
	for(var i = 0; i < geometry.vertices.length; i++){
        var vertex	= geometry.vertices[i];
        
		vertex.originalPosition	= vertex.clone();
		vertex.dirVector	= vertex.clone().normalize();
	}
	geometry.dynamic	= true;
    
    
	this.cpuAxis(geometry, 'y')
	// this.cpuAxis(geometry, 'z')
}

THREEx.GeometryWobble.cpuAxis = function(geometry, type, factor)
{
	if( type === undefined )	type	= 'x';
	if( factor === undefined )	factor	= 1;
	
	for(var i = 0; i < geometry.vertices.length; i++) {
		var vertex	= geometry.vertices[i];

		vertex.axisValueX	= vertex.originalPosition.x * factor;
		vertex.axisValueY	= vertex.originalPosition.y * factor;
		vertex.axisValueZ	= vertex.originalPosition.z * factor;
	}
}

THREEx.GeometryWobble.Animate = function(geometry, phase, magnitude)
{
	if( phase === undefined )	phase		= 0;
    if( magnitude === undefined )	magnitude	= 0.8;
    	
	if( typeof magnitude === "number" )	magnitude	= new THREE.Vector3(magnitude, magnitude, magnitude)

	for(var i = 0; i < geometry.vertices.length; i++) {
        var vertex	= geometry.vertices[i];
		var vertexPhaseX	= Math.sin(phase + vertex.axisValueX);        
		var vertexPhaseY	= Math.cos(phase + vertex.axisValueY);
		// var vertexPhaseZ	= Math.cos(phase * 0.1 + vertex.axisValueZ);
		
		vertex.x = vertex.originalPosition.x + vertexPhaseX * vertex.dirVector.x * magnitude.x;
		vertex.y = vertex.originalPosition.y + vertexPhaseY * vertex.dirVector.y * magnitude.y;
		// vertex.z = vertex.originalPosition.z + vertexPhaseZ * vertex.dirVector.z * magnitude.z;
	}
	
    geometry._dirtyVertices = true;
    geometry.verticesNeedUpdate = true;
}

// Three Scene
let scene, camera, renderer, animationId, controls
let uniforms, geometry, material, mesh
let startTime = Date.now()

function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x000000 )

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100
    )
    camera.position.z = 50

    controls = new OrbitControls( camera )

    uniforms = {
        time: { type: 'f', value: 1.0 },
        resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight )}
    }

    geometry = new THREE.SphereGeometry(15, 100, 100)
    // material = new THREE.ShaderMaterial({
    //     uniforms: uniforms,
    //     fragmentShader: frag,
    //     vertexShader: vert
    // })
    material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF
    })

    THREEx.GeometryWobble.init( geometry );

    mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh)

    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    lights[ 1 ] = new THREE.PointLight( 0x87ff, 1, 0, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0, 0 );
    lights[ 3 ] = new THREE.AmbientLight( 0xffffff, 0.1);

    lights[ 0 ].position.set( 0, 100, 0 );
    lights[ 1 ].position.set( 100, 100, 100 );
    lights[ 2 ].position.set( - 100, - 100, 0 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
    scene.add( lights[ 3 ] );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)
}

function animate() {
    animationId = requestAnimationFrame(animate)

    let elapsedMilliseconds = Date.now() - startTime
    uniforms.time.value = elapsedMilliseconds / 1000

    THREEx.GeometryWobble.Animate( geometry, elapsedMilliseconds / 100 );

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