varying vec2 vUv;

uniform float time;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {

	vec2 uv = vUv;
	gl_FragColor = vec4( vUv, 1, 1 );

	#ifdef USE_FOG
		#ifdef USE_LOGDEPTHBUF_EXT
			float depth = gl_FragDepthEXT / gl_FragCoord.w;
		#else
			float depth = gl_FragCoord.z / gl_FragCoord.w;
		#endif
		float fogFactor = smoothstep( fogNear, fogFar, depth );
		gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
	#endif

}