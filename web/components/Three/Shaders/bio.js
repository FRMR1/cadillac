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
uniform sampler2D u_image;
uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {

    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    vec2 dispUV = vec2(uv.x, uv.y);

    dispUV = vec2(1.) - dispUV;
    
    vec4 disp = texture2D(u_texture, dispUV);
    
    dispUV.y = mix(dispUV.y, disp.r - .2, u_mouse.y);
    
    vec4 img = texture2D(u_image, dispUV);
    
    vec4 col = img;
    
    gl_FragColor = col;

}
`
