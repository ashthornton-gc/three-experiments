varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vRefract;

// uniform float time;
uniform sampler2D tWater;

void main() {

	vec2 uv = vUv;

	// gl_FragColor = vec4( 0, 0, vPos.y, 1. );


	// vec2 uv = normalize( vNormal ).xy * 0.5 + 0.5;
	// vec4 uv2 = vec4( uv, vRefract );
	
	// float aberration = 0.99;
	// float mirrorRefraction = 1.;

	// float x = mirrorRefraction * vRefract.x;
	// float y = mirrorRefraction * vRefract.y;
	// float z = mirrorRefraction * vRefract.z;
    // vec4 cubeColor = vec4(
    // 	texture2D( tWater, vec2( x, vRefract.yz ) ).r,
    // 	texture2D( tWater, vec2( x, vRefract.yz * 0.98 * aberration ) ).g,
    // 	texture2D( tWater, vec2( x, vRefract.yz * 0.99 * aberration ) ).b,
    // 	1.0
	// );

	// cubeColor.w = 1.0;
    	
    // cubeColor.a = texture2D( tWater, uv).a;

    // gl_FragColor = cubeColor;
	gl_FragColor = vec4( texture2D( tWater, uv ).rgb, 1. );

}