export const vert = `
precision highp float;

varying vec2 v_uv;
varying vec2 v_n;
varying vec3 v_position;

void main() {

    v_position = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const frag = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_ratio;
uniform float u_active;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_view;
varying vec3 v_normal;
varying vec2 v_n;

float PI = 3.141592653589;

void main() {
    vec3 a = vec3(0.6, 0.6, 0.6);
    vec3 b = vec3(.4, .4, .4);
    vec3 c = vec3(.5, .5, .5);
    vec3 d = vec3(0., .33, .67);
    
    vec3 animatedColor = a + b * cos(2. * PI * (c * v_n.y + d + u_time /3.));

    vec4 txt = vec4(animatedColor, 1.);

    gl_FragColor = txt;
}
`
