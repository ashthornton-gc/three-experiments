#define PI 3.14159265359
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 objectNormal;

uniform float u_delta;
uniform float u_time;

void main () {

    // vec3 pos = position.xyz;

    vUv = uv;

    vec3 transformed = vec3(position);
    float freq = u_delta * 0.01;
    float amp = 10.;
    float angle = (u_time * 0.2 + position.x)*clamp(freq, 0.0, 0.05);
    // float angleY = (u_time * 0.2 + position.x)*clamp(freq, 0.0, 0.05);
    transformed.y += cos(angle)*amp;
    // transformed.x += sin(angle)*amp*5.;
    // transformed.z += sin(angle)*amp*2.;
    objectNormal = normalize(vec3(0.0,-amp * freq * cos(angle),1.0));
    vNormal = normalMatrix * objectNormal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1 );

}