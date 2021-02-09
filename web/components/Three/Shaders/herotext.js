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
uniform float uTime;

varying vec2 vN;

float PI = 3.141592653589;

void main() {

    // red, orange, yellow
    // vec3 a = vec3(1., 0.5, .3);
    // vec3 b = vec3(0., 0.35, 0.0);
    // vec3 c = vec3(1.5, 1.5, 1.5);
    // vec3 d = vec3(0.698, 0.333, 0.667);

    // pink, aqua blue
    vec3 a = vec3(0.4, 0.4, 1.);
    vec3 b = vec3(0.35, 0.35, 0.);
    vec3 c = vec3(1., 1., 1.);
    vec3 d = vec3(0.698, 0.145, 0.667);

    // black, purple
    // vec3 a = vec3(.306, 0.156, .496);
    // vec3 b = vec3(.15, 0., .34);
    // vec3 c = vec3(1., 1., 1.);
    // vec3 d = vec3(0., 0.333, 0.);
    
    vec3 animatedColor = a + b * sin(2. * PI * (c * vN.y + d + uTime / 10.));

    vec4 color = vec4(animatedColor, 1.);

    gl_FragColor = color;
}
`
