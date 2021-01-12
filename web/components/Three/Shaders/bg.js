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

float sdPyramid( vec3 p, float h)
{
  float m2 = h*h + 0.25;
    
  p.xz = abs(p.xz);
  p.xz = (p.z>p.x) ? p.zx : p.xz;
  p.xz -= 0.5;

  vec3 q = vec3( p.z, h*p.y - 0.5*p.x, h*p.x + 0.5*p.y);
   
  float s = max(-q.x,0.0);
  float t = clamp( (q.y-0.5*p.z)/(m2+0.25), 0.0, 1.0 );
    
  float a = m2*(q.x+s)*(q.x+s) + q.y*q.y;
  float b = m2*(q.x+0.5*t)*(q.x+0.5*t) + (q.y-m2*t)*(q.y-m2*t);
    
  float d2 = min(q.y,-q.x*m2-q.y*0.5) > 0.0 ? 0.0 : min(a,b);
    
  return sqrt( (d2+q.z*q.z)/m2 ) * sign(max(q.z,-p.y));
}


#define AA_QUALITY 0
#define ENABLE_POST_PROCESSING 1
#define ENABLE_CAMERA_MOVEMENT 0
#define ENABLE_SHADOWS 0
#define SHADOW_FALLOFF 0.05
#define SHADOW_OPACITY 0.8

float sdPlane(vec3 p, vec4 n)
{
    return dot(p, n.xyz) + n.w;
}

//------------------------------------------------------------------


float opS(float d1, float d2)
{
    return max(-d2, d1);
}

vec2 opU(vec2 d1, vec2 d2)
{
	return (d1.x < d2.x) ? d1 : d2;
}

//------------------------------------------------------------------

// polynomial smooth min (k = 0.1);
float sminCubic(float a, float b, float k)
{
    float h = max(k-abs(a-b), 0.0);
    return min(a, b) - h*h*h/(6.0*k*k);
}

vec2 opBlend(vec2 d1, vec2 d2)
{
    float k = 2.0;
    float d = sminCubic(d1.x, d2.x, k);
    float m = mix(d1.y, d2.y, clamp(d1.x-d,0.0,1.0));
    return vec2(d, m);
}


//------------------------------------------------------------------

vec2 SDF(vec3 pos)
{
    vec2 res =         vec2(sdPyramid(pos-vec3(0.,3.+sin(u_time)/2.,0), 2.5),    0.1);
    res = opU(res, vec2(sdPlane(pos, vec4(0, 1.4, 0, 10)),           -0.5));

    return res;
}

vec3 calcNormal(vec3 pos)
{
	// Center sample
    float c = SDF(pos).x;
	// Use offset samples to compute gradient / normal
    vec2 eps_zero = vec2(0.001, 0.0);
    return normalize(vec3(
        SDF(pos + eps_zero.xyy).x,
        SDF(pos + eps_zero.yxy).x,
        SDF(pos + eps_zero.yyx).x) - c);
}

struct IntersectionResult
{
    float minDist;
    float mat;
    int steps;
};

IntersectionResult castRay(vec3 rayOrigin, vec3 rayDir)
{
    float tmax = 100.0;
    float t = 0.0;
    
    IntersectionResult result;
    result.mat = -1.0;
    
    for (result.steps = 0; result.steps < 128; result.steps++)
    {
        vec2 res = SDF(rayOrigin + rayDir * t);
        if (res.x < (0.0001*t))
        {
            result.minDist = t;
            return result;
        }
        else if (res.x > tmax)
        {
            result.mat = -1.0;
            result.minDist = -1.0;
            return result;
        }
        t += res.x;
        result.mat = res.y;
    }
    
    result.minDist = t;
    return result;
}

// http://iquilezles.org/www/articles/checkerfiltering/checkerfiltering.htm
float checkersGradBox(vec2 p)
{
    vec2 w = fwidth(p) + 0.001;
    vec2 i = 2.0*(abs(fract((p-0.5*w)*0.5)-0.5)-abs(fract((p+0.5*w)*0.5)-0.5))/w;
    return clamp(0.5 - 0.5*i.x*i.y,0.0,1.0);
}

vec3 fogColor = vec3(0., 0., 0.);

vec3 applyFog(vec3 rgb, float dist)
{
    float startDist = 80.0;
    float fogAmount = 1.0 - exp(-(dist-8.0) * (1.0/startDist));
    return mix(rgb, fogColor, fogAmount);
}

float rand(vec2 co)
{
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

//https://www.shadertoy.com/view/ll2GD3
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 render(vec3 rayOrigin, vec3 rayDir)
{
    vec3 col = fogColor - rayDir.y * 0.4;
    IntersectionResult res = castRay(rayOrigin, rayDir);
    float t = res.minDist;
    float m = res.mat;
    float steps = float(res.steps);

#define SHOW_STEP_COUNT 0
#if SHOW_STEP_COUNT
    return vec3(steps/350., 0.0, 0.0);
#endif
    
    vec3 N = vec3(0.0, 1.0, 0.0);
    vec3 L = normalize(vec3(sin(u_time), 0.9, -0.5));

    if (m > -1.0)
    {
        vec3 pos = rayOrigin + rayDir * t;
        
        if (m > -0.5)
        {
            N = calcNormal(pos);
            
            //col = pal(m*0.05, vec3(0.05,0.2,0.2),vec3(0.2,0.4,0.5),vec3(0.39,0.6,0.7),vec3(0.1,0.3,0.90));
            col = vec3(1.*m, 0.*m, 0.2*N.y);
			
        	// L is vector from surface point to light, N is surface normal. N and L must be normalized!
            float NoL = max(dot(N, L), 0.0);
            vec3 LDirectional = vec3(.8, 0.0, .6) * NoL;
            vec3 LAmbient = vec3(0.2, 0.2, 0.2);
            vec3 diffuse = col * (LDirectional);
            
            // Visualize normals:
          	//col = N * vec3(0.5) + vec3(0.5);
        }
        else
        {
            float grid = checkersGradBox(pos.xz*0.2) * .1 - .08;
            col = vec3(grid, grid, grid);
            
#if ENABLE_SHADOWS
            float shadow = 0.0;
            float shadowRayCount = 2.0;
            for (float s = 0.0; s < shadowRayCount; s++)
            {
                vec3 shadowRayOrigin = pos + N * 0.01;
                float r = rand(vec2(rayDir.xy)) * 2.0 - 1.0;
                vec3 shadowRayDir = L + vec3(1.0 * SHADOW_FALLOFF) * r;
                IntersectionResult shadowRayIntersection = castRay(shadowRayOrigin, shadowRayDir);
                if (shadowRayIntersection.mat != -1.0)
                {
                    shadow += 1.0;
                }
            }
            
    		vec3 cshadow = pow(vec3(shadow), vec3(1.0, 1.2, 1.5));
            col = mix(col, col*cshadow*(1.0-SHADOW_OPACITY), shadow/shadowRayCount);
#endif
        }

        col = applyFog(col, pos.z);
    }
    
    return col;
}

vec3 getCameraRayDir(vec2 uv, vec3 camPos, vec3 camTarget)
{
	vec3 camForward = normalize(camTarget - camPos);
	vec3 camRight = normalize(cross(vec3(0.0, 1.0, 0.0), camForward));
	vec3 camUp = normalize(cross(camForward, camRight));
							  
    float fPersp = 2.0;
	vec3 vDir = normalize(uv.x * camRight + uv.y * camUp + camForward * fPersp);

	return vDir;
}

vec2 normalizeScreenCoords(vec2 screenCoord)
{
    vec2 result = 2.0 * (screenCoord/u_resolution.xy - 0.5);
    result.x *= u_resolution.x/u_resolution.y; // Correct for aspect ratio
    return result;
}

vec4 getSceneColor(vec2 fragCoord)
{ 
    vec3 camPos = vec3(0, 0, -7);
#if ENABLE_CAMERA_MOVEMENT
    camPos += vec3(sin(u_time*0.5)*0.5, cos(u_time*0.5)*0.1, 0.0);
#endif
    vec3 at = vec3(0, 0, 0);
    
    vec2 uv = normalizeScreenCoords(gl_FragCoord.xy);
    uv.y *= u_ratio;
    vec3 rayDir = getCameraRayDir(uv, camPos, at);
    
    vec3 col = render(camPos, rayDir);
    
    return vec4(col, 1.0);
}

void main()
{
    gl_FragColor = vec4(0.0);
    
#if AA_QUALITY > 1
    float AA_size = float(AA_QUALITY);
    float count = 0.0;
    for (float aaY = 0.0; aaY < AA_size; aaY++)
    {
        for (float aaX = 0.0; aaX < AA_size; aaX++)
        {
            gl_FragColor += getSceneColor(gl_FragCoord + vec2(aaX, aaY) / AA_size);
            count += 1.0;
        }
    }
    gl_FragColor /= count;
#else
    gl_FragColor = getSceneColor(gl_FragCoord.xy);
#endif
    
    
#if ENABLE_POST_PROCESSING
    // Normalized pixel coordinates (from 0 to 1)
    vec2 screenCoord = gl_FragCoord.xy/u_resolution.xy;

    // Vignette
    float radius = 0.2;
    float d = smoothstep(radius, radius-0.5, length(screenCoord-vec2(0.5)));
    gl_FragColor = mix(gl_FragColor, vec4(0.), .1);
    
    // Contrast
    float constrast = 1.;
    gl_FragColor = mix(gl_FragColor, smoothstep(0.0, 1.0, gl_FragColor), constrast);
    
    // Colour mapping
    // gl_FragColor *= vec4(0.90,0.96,1.1,1.0);
#endif
    
    gl_FragColor = pow(gl_FragColor, vec4(0.4545)); // Gamma correction (1.0 / 2.2)
    gl_FragColor = max(vec4(0.), gl_FragColor);
    gl_FragColor = min(vec4(1.), gl_FragColor);
    gl_FragColor += vec4(.15, .15, .15, 0.);
}
`
