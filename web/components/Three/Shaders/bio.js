export const vert = `
precision highp float;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;

void main() {

    v_uv = uv;
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
uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {

    vec2 uv = gl_FragCoord.xy/u_resolution.xy;

    vec4 col = texture2D(u_texture, v_uv);
    
    //final color
    gl_FragColor = col;

}
`
