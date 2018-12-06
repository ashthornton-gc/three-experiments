// varying vec2 vUv;
varying float noise;
varying vec3 _position;

uniform float time;
uniform vec2 resolution;
uniform sampler2D tGrad;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

	// lookup vertically in the texture, using noise and offset
	// to get the right RGB colour
	vec2 tPos = vec2( noise * sin(5.), noise * 5. );
	vec4 color = texture2D( tGrad, tPos );
	
	gl_FragColor = vec4( color.rgb, 1.0 );

}