export const vert = `
precision highp float;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

attribute float aRandom;

void main() {

    vUv = uv;
    vPosition = position;
    vNormal = normal;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    modelPosition.y += sin(uTime + modelPosition.x * 3.) / 20.;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
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

    dispUV = vUv;
    
    vec4 disp = texture2D(uTexture, dispUV);
    
    // dispUV.y = mix(dispUV.y, disp.r - .2, sin(uTime / 1.5) / 140.);
    // dispUV.x = mix(dispUV.x, disp.g - .3, sin(uTime / 1.6) / 140.);

    // dispUV.y += sin(uTime / 1.5) / 1000.;
    // dispUV.x += cos(uTime / 1.6) / 1000.;
    
    vec4 img = texture2D(uImage, dispUV);
    
    vec4 col = img;

    // img.r = texture2D(uTexture, dispUV + vec2(0.005, 0.005) * sin(uTime / 1.5)).r;
    // img.g = texture2D(uTexture, dispUV + vec2(0.005, 0.005) * sin(uTime / 1.5)).g;
    // img.b = texture2D(uTexture, dispUV + vec2(0.005, 0.005) * sin(uTime / 1.5)).b;
    
    gl_FragColor = img;


}
`
