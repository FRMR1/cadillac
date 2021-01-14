export const vert = `
precision highp float;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_view;
varying vec2 v_n;

void main() {

    vec4 p = vec4( position, 1. );

    vec4 transformed = modelViewMatrix * p;
    v_view = normalize(-transformed.xyz);

    vec3 e = normalize( vec3( transformed ) );
    vec3 n = normalize( normalMatrix * normal );

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    v_n = r.xy / m + .5;

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
uniform vec2 u_mouse;
uniform float u_ratio;
uniform float u_speed;
uniform float u_slider;
uniform sampler2D u_texture;
uniform sampler2D u_texture2;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_view;
varying vec3 v_normal;
varying vec2 v_n;

float PI = 3.141592653589;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

vec2 getmatcap(vec3 eye, vec3 normal) {
    vec3 reflected = reflect(eye, normal);
    float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
    return reflected.xy / m + 0.5;
  }

void main() {

    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(0.5, 0.5, 0.5);
    vec3 d = vec3(0.00, 0.33, 0.67);

    vec3 viewDir = normalize( v_view );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
    vec2 uv = vec2( dot( x, v_normal ), dot( y, v_normal ) ) * 0.495 + 0.5;
    
    float diff = abs(dot(v_normal, normalize(vec3(1., 1., 0.)))) + abs(dot(v_normal, normalize(vec3(1., -1., 0.))));
    diff *= .5;
    
    float noise = cnoise(v_position) + sin(u_time / 5.) / 1.7 + 1.;
    float step = smoothstep(0.4, 0.39, noise);
    vec4 col = vec4(diff, diff, diff, 1.);
    
    vec3 animatedColor = a + b * cos(2. * PI * (c * v_n.y + d + u_time /3.));
    vec4 txt = texture2D(u_texture, v_n);
    vec4 txt2 = vec4(animatedColor, 1.);
    
    vec4 color = mix(txt, txt2, step);
    vec4 bg = vec4(0.02, 0.02, 0.02, 1.);

    float fresnel = pow(1. + dot(normalize(vec3(u_mouse.x * -.6, 1., u_mouse.y * -.6)), v_normal), (sin(u_time*20.) + 1.) / 30. + .8);


    vec4 final = mix(color, bg, fresnel);

    gl_FragColor = final;
    // gl_FragColor = vec4(step, step, step, 1.);
    // gl_FragColor = txt;
}
`
