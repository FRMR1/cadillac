export const vert = `
precision highp float;

varying vec2 v_uv;
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
uniform float u_ratio;
uniform float u_speed;
uniform float u_slider;
uniform sampler2D u_texture;

varying vec2 v_uv;
varying vec3 v_position;

void main()
{

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    float dist = length(uv - vec2(.5));

    vec3 bg = mix(vec3(0.2), vec3(0.12), dist);

    gl_FragColor = vec4(.125, .125, .125, 1.);

}
`
