// varying vec2 vUv;
// varying vec3 vPos;
// varying vec3 vNormal;
varying vec3 vRefract;

struct PointLight {
  vec3 position;
  vec3 color;
};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

uniform float time;
uniform sampler2D tex;

void main() {
	
	// vec2 uv = vUv;

	// vec4 addedLights = vec4(0.1, 0.1, 0.1, 1.);

	// for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
	// 	vec3 adjustedLight = pointLights[l].position + cameraPosition;
	// 	vec3 lightDirection = normalize(vPos - adjustedLight);
	// 	addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[l].color;
	// }

	// gl_FragColor = vec4( 0, 0, vPos.y, 1. );

	float aberration = 1.1;
	float mirrorRefraction = 1.;

	float x = mirrorRefraction * vRefract.x;
    vec4 cubeColor = vec4(
    	texture2D( tex, vec2( x, vRefract.yz ) ).r,
    	texture2D( tex, vec2( x, vRefract.yz * 0.98 * aberration ) ).g,
    	texture2D( tex, vec2( x, vRefract.yz * 0.99 * aberration ) ).b,
    	1.0
	);
    	
    cubeColor.w = 1.0;
    gl_FragColor = cubeColor;

}