varying vec2 vUv;

uniform float time;
uniform vec2 resolution;

void main() {

	vec2 uv = vUv;
	
	gl_FragColor = vec4( vUv, 1, 1 );

}