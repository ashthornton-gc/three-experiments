varying vec2 vUv;
uniform float time;

void main() {

    gl_FragColor = vec4( vUv.x, vUv.y, 1.0, 1.0 );

}