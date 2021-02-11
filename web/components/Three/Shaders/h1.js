export const vert = `
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vN;

void main() {
    vec4 p = vec4( position, 1. );

    vec4 transformed = modelViewMatrix * p;
    vView = normalize(-transformed.xyz);

    vec3 e = normalize( vec3( transformed ) );
    vec3 n = normalize( normalMatrix * normal );

    vec3 r = reflect( e, n );

    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );

    vN = r.xy / m + .5;

    gl_Position = projectionMatrix * transformed;
}
`

export const frag = `
precision highp float;

uniform float uTime;

varying vec2 vN;

float PI = 3.141592653589;

void main() {
    vec3 a = vec3(0.6, 0.6, 0.6);
    vec3 b = vec3(.4, .4, .4);
    vec3 c = vec3(.5, .5, .5);
    vec3 d = vec3(0., .33, .67);
    
    vec3 animatedColor = a + b * cos(2. * PI * (c * vN.y + d + uTime /3.));

    vec4 txt = vec4(animatedColor, 1.);

    gl_FragColor = txt;
}
`
