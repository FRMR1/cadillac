export const vert = `
precision highp float;

uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    vUv = uv;
    vPosition = position;
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`

export const frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform sampler2D uImage;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {

    vec2 uv = gl_FragCoord.xy/uResolution.xy;
    vec2 dispUV = vec2(uv.x, uv.y);
    uv.y = 1. - uv.y;

    // dispUV = vec2(1.) - dispUV;
    dispUV = vUv;

    dispUV = (dispUV - vec2(0.5)) * .9 + vec2(.5);
    
    vec4 disp = texture2D(uTexture, dispUV);
    
    dispUV.y = mix(dispUV.y, disp.r - .2, sin(uTime / 1.5) / 40.);
    dispUV.x = mix(dispUV.x, disp.g - .3, sin(uTime / 1.6) / 40.);

    dispUV.y += sin(uTime / 1.5) / 100.;
    dispUV.x += cos(uTime / 1.6) / 100.;
    
    vec4 img = texture2D(uImage, vUv);
    
    vec4 col = img;

    col.r = texture2D(uImage, dispUV + vec2(0.005, 0.005) * sin(uTime / 1.5)).r;
    col.g = texture2D(uImage, dispUV + vec2(0., 0.007) * sin(uTime / 2.0)).g;
    col.b = texture2D(uImage, dispUV + vec2(0.007, 0.) * sin(uTime / 2.5)).b;
    
    gl_FragColor = img;
    // gl_FragColor = vec4(1.0);

}
`
