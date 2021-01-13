export const vert = `
precision highp float;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_view;

void main() {

    vec4 transformed = modelViewMatrix * vec4(position, 1.0);

    v_view = normalize(-transformed.xyz);

    v_uv = uv;
    v_position = position;
    v_normal = normal;

    gl_Position = projectionMatrix * transformed;
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
varying vec3 v_view;
varying vec3 v_normal;

float PI = 3.141592653589;

void main() {

    vec3 viewDir = normalize( v_view );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
    vec2 uv = vec2( dot( x, v_normal ), dot( y, v_normal ) ) * 0.495 + 0.5;
    // uv.x /= 2.;

    vec4 txt = texture2D(u_texture, uv);

    gl_FragColor = txt;
}
`
