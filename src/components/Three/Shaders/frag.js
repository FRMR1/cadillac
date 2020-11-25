export const frag = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_ratio;
uniform vec2 u_mouse;


void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    gl_FragColor = vec4(1.0, 0., 0., 1.);

}
`
