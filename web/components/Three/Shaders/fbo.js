export const vert = `
precision highp float;

uniform float u_time;
varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;

void main() {

    v_uv = uv;
    v_position = position;
    v_normal = normal;

    v_position.y += sin(3.1415926 * uv.x * 5.) / 4.;
    v_position.x += sin(3.1415926 * uv.y * 3.) / 4.;

    v_position.y += sin(u_time) * .2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
}
`

export const frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture;

varying vec3 v_position;
varying vec2 v_uv;

void main() {

    vec2 uv = v_uv;

    vec4 col = texture2D(u_texture, uv);
    
    //final color
    gl_FragColor = col;

}
`
