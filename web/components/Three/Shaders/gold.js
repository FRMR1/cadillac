export const vert = `
varying vec2 vN;

void main() {

    vec4 p = vec4( position, 1. );

    vec4 transformed = modelViewMatrix * p;

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
uniform sampler2D uTexture;

varying vec2 vN;

float PI = 3.141592653589;

void main() {

    vec4 txt = texture2D(uTexture, vN);

    gl_FragColor = txt;
}
`
