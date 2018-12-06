// varying vec2 vUv;
// varying vec3 vPos;
// varying vec3 vNormal;

varying vec3 vRefract;

uniform float time;

void main() {

	// vUv = uv;
	
	// vNormal = normalMatrix * normal;

	// vec3 newPos = vec3( position.x, max( 0.5, sin( abs( position.y ) * 2. + time * 2. ) ), position.z );
	// vPos = ( modelMatrix * vec4( position, 1.0 ) ).xyz;

	// gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );

	float refractionRatio = 0.9;

	vec3 worldPosition = ( modelMatrix * vec4( position, 1.0 )).xyz;
    vec3 cameraToVertex = normalize( worldPosition - cameraPosition );
    vec3 worldNormal = normalize(
        mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * normal
    );
    vRefract = refract( cameraToVertex, worldNormal, refractionRatio );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);


}