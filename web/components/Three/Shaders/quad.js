export const vert = `
precision highp float;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;

void main() {

    v_position = position;
    v_normal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const frag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
varying vec2 v_uv;

void main() {

    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    
    //final color
    gl_FragColor = vec4(uv, 1., 1. );

}
`
