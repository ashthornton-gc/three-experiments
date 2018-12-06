varying vec2 vUv;

uniform float time;

void main() {
	
	vec2 uv = vUv;
	gl_FragColor = vec4( vUv, 1, 1 );

}