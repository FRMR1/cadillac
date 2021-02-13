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

uniform float uPercent;
uniform vec2 uMouse;
uniform float uTime;
uniform sampler2D uTexture;

varying vec3 vPosition;
varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    uv.y = 1. - uv.y;

    vec4 col = texture2D(uTexture, uv);

    gl_FragColor = col;

}
`
