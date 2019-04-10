varying vec2 vUv;

uniform float time;
uniform sampler2D texture;
uniform vec2 size;

void main() {
	
	vec2 uv = vUv;

	// const float PI = 3.141592;

    // uv.x += (
    //   sin(uv.x * 10.0 + ((time * 2.0 *(PI / 3.0)) * 0.031))
    //   + sin(uv.y * 10.0 + ((time * 2.0 * (PI / 2.489)) * 0.017))
    //   ) * 0.0075;

    // uv.y += (
    //   sin(uv.y * 20.0 + ((time * 2.0 * (PI / 2.023)) * 0.023))
    //   + sin(uv.x * 20.0 + ((time * 2.0 * (PI / 3.1254)) * 0.037))
    //   ) * 0.0125;
	
	gl_FragColor = texture2D( texture, uv );

}