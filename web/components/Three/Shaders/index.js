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
uniform sampler2D u_trail;

varying vec2 v_uv;
varying vec3 v_position;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 102.0 * (u_slider + 100.) / 150. * dot(m, g);
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    uv = uv * vec2(1.5, 1.5);

    vec4 col2 = texture2D(u_trail, uv);
    vec4 col = texture2D(u_trail, uv);
    
    uv.x *= u_ratio;
    
    vec2 pos = vec2(uv*2.);

    float DF = 0.0;
    
    // Add a random position
    float a = 0.0;
    vec2 vel = vec2(u_time*.01);
    DF += snoise(pos+vel)*.25+.25;
    
    // Add a random position
    a = snoise(pos*vec2(cos(u_time*0.15),sin(u_time*0.1))*0.1)*3.1415;
    vel = vec2(cos(a),sin(a));
    DF += snoise(pos+vel)*.55+.25;
    
    col.xyz = vec3( smoothstep(.7,.75,fract(DF)) );

    vec3 hsbCol = hsb2rgb(col.rgb);

    col.r -= .8;
    col.b -= 1.;

	vec3 col1 = mix(vec3(143. / 255., 0., 255. / 255.), vec3(95. / 255., 46. / 255., 210. / 255.), gl_FragCoord.y / u_resolution.y);
	
	if (col.r != 1.0 && col.g != 1.0 && col.b != 1.0) col.rgb += vec3(1.8, 0., 2.);
	if ((col.r != 1.0 && col.g != 0.0 && col.b != 1.0) && (col.r != 0.8 && col.g != 1.0 && col.b != 0.0)) col.rgb += vec3(-1.5, 0.5, -1.5);
	if ((col.r != 1.0 && col.g != 0.0 && col.b != 1.0) && (col.r != 0.8 && col.g != 1.0 && col.b != 0.0)) col.rgb += vec3(.1, 0., .1);

	if (col.r <= 1.0 && col.g <= 0.5) col.rgb = col1;
    
    gl_FragColor = vec4(col.rgb ,1.0);
}
`
