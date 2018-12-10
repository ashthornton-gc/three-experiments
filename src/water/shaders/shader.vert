varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

varying vec3 vRefract;

uniform float time;

void main() {

	vUv = uv;

	float distFromCenter = -sqrt( position.x * position.x + position.y * position.y );

	vec3 newPos = vec3( 
		position.x,
		position.y,
		abs( sin( distFromCenter * 2. + time * 1.8 ) )
	);
	vPos = ( modelMatrix * vec4( newPos, 1.0 ) ).xyz;

	// float refractionRatio = 1.05;

	// vec3 worldPosition = ( modelMatrix * vec4( position, 1.0 )).xyz;
    // vec3 cameraToVertex = normalize( worldPosition - cameraPosition );
    // vec3 worldNormal = normalize(
    //     mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * normal
    // );
    // vRefract = refract( cameraToVertex, worldNormal, refractionRatio );

	// vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );


}