#version 100
precision highp float;

uniform float uDofScale;
uniform float uFrameModTaaSS;
uniform float uQuality;
uniform float uRGBMRange;
uniform sampler2D TextureDofColor;
uniform sampler2D TextureInput;
uniform vec2 uTextureDofColorRatio;
uniform vec2 uTextureDofColorSize;
uniform vec2 uTextureOutputRatio;
uniform vec2 uTextureOutputSize;
uniform vec3 uDofBlurNearFarFocal;
#define SHADER_NAME TextureDofBlurCircular

vec2 gTexCoord;

float linearTosRGB(const in float color) { return  color < 0.0031308 ? color * 12.92 : 1.055 * pow(color, 1.0/2.4) - 0.055; }
vec3 linearTosRGB(const in vec3 color) { return vec3( color.r < 0.0031308 ? color.r * 12.92 : 1.055 * pow(color.r, 1.0/2.4) - 0.055,  color.g < 0.0031308 ? color.g * 12.92 : 1.055 * pow(color.g, 1.0/2.4) - 0.055,  color.b < 0.0031308 ? color.b * 12.92 : 1.055 * pow(color.b, 1.0/2.4) - 0.055); }
vec4 linearTosRGB(const in vec4 color) { return vec4( color.r < 0.0031308 ? color.r * 12.92 : 1.055 * pow(color.r, 1.0/2.4) - 0.055,  color.g < 0.0031308 ? color.g * 12.92 : 1.055 * pow(color.g, 1.0/2.4) - 0.055,  color.b < 0.0031308 ? color.b * 12.92 : 1.055 * pow(color.b, 1.0/2.4) - 0.055, color.a); }

float sRGBToLinear(const in float color) { return  color < 0.04045 ? color * (1.0 / 12.92) : pow((color + 0.055) * (1.0 / 1.055), 2.4); }
vec3 sRGBToLinear(const in vec3 color) { return vec3( color.r < 0.04045 ? color.r * (1.0 / 12.92) : pow((color.r + 0.055) * (1.0 / 1.055), 2.4),  color.g < 0.04045 ? color.g * (1.0 / 12.92) : pow((color.g + 0.055) * (1.0 / 1.055), 2.4),  color.b < 0.04045 ? color.b * (1.0 / 12.92) : pow((color.b + 0.055) * (1.0 / 1.055), 2.4)); }
vec4 sRGBToLinear(const in vec4 color) { return vec4( color.r < 0.04045 ? color.r * (1.0 / 12.92) : pow((color.r + 0.055) * (1.0 / 1.055), 2.4),  color.g < 0.04045 ? color.g * (1.0 / 12.92) : pow((color.g + 0.055) * (1.0 / 1.055), 2.4),  color.b < 0.04045 ? color.b * (1.0 / 12.92) : pow((color.b + 0.055) * (1.0 / 1.055), 2.4), color.a); }

vec3 RGBMToRGB( const in vec4 rgba ) {
    const float maxRange = 8.0;
    return rgba.rgb * maxRange * rgba.a;
}

const mat3 LUVInverse = mat3( 6.0013, -2.700, -1.7995, -1.332, 3.1029, -5.7720, 0.3007, -1.088, 5.6268 );

vec3 LUVToRGB( const in vec4 vLogLuv ) {
    float Le = vLogLuv.z * 255.0 + vLogLuv.w;
    vec3 Xp_Y_XYZp;
    Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);
    Xp_Y_XYZp.z = Xp_Y_XYZp.y / vLogLuv.y;
    Xp_Y_XYZp.x = vLogLuv.x * Xp_Y_XYZp.z;
    vec3 vRGB = LUVInverse * Xp_Y_XYZp;
    return max(vRGB, 0.0);
}

vec4 encodeRGBM(const in vec3 color, const in float range) {
    if(range <= 0.0) return vec4(color, 1.0);
    vec4 rgbm;
    vec3 col = color / range;
    rgbm.a = clamp( max( max( col.r, col.g ), max( col.b, 1e-6 ) ), 0.0, 1.0 );
    rgbm.a = ceil( rgbm.a * 255.0 ) / 255.0;
    rgbm.rgb = col / rgbm.a;
    return rgbm;
}

vec3 decodeRGBM(const in vec4 color, const in float range) {
    if(range <= 0.0) return color.rgb;
    return range * color.rgb * color.a;
}

float pseudoRandom(const in vec2 fragCoord) {
    vec3 p3  = fract(vec3(fragCoord.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float interleavedGradientNoise(const in vec2 fragCoord, const in float frameMod) {
    vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(fragCoord.xy + frameMod * vec2(47.0, 17.0) * 0.695, magic.xy)));
}

float ditheringNoise(const in vec2 fragCoord, const in float frameMod) {
    
    float fm = frameMod;
    float dither5 = fract((fragCoord.x + fragCoord.y * 2.0 - 1.5 + fm) / 5.0);
    float noise = fract(dot(vec2(171.0, 231.0) / 71.0, fragCoord.xy));
    return (dither5 * 5.0 + noise) * (1.2 / 6.0);
}

void ditheringMaskingDiscard(
const in vec4 fragCoord,
const in int dithering,
const in float alpha,
const in float factor,

const in float thinLayer,

const in float frameMod,
const in vec2 nearFar,

const in vec4 halton) {
    
    float rnd;
    
    if (thinLayer == 0.0) {
        float linZ = (1.0 / fragCoord.w - nearFar.x) / (nearFar.y - nearFar.x);
        float sliceZ = floor(linZ * 500.0) / 500.0;
        rnd = interleavedGradientNoise(fragCoord.xy + sliceZ, frameMod);
        } else {
        rnd = pseudoRandom(fragCoord.xy + halton.xy * 1000.0 + fragCoord.z * (abs(halton.z) == 2.0 ? 1000.0 : 1.0));
    }
    
    if ((alpha * factor) < rnd) discard;
}

int decodeProfile(const in vec4 pack) {
    float packValue = floor(pack.b * 255.0 + 0.5);
    
    float profile = mod(packValue, 2.0);
    profile += mod(packValue - profile, 4.0);
    return int(profile);
}

float decodeDepth(const in vec4 pack) {
    if(decodeProfile(pack) == 0){
        const vec3 decode = 1.0 / vec3(1.0, 255.0, 65025.0);
        return dot(pack.rgb, decode);
    }
    
    return pack.r + pack.g / 255.0;
}

float decodeScatter(const in vec4 pack) {
    
    float scatter = (4.0 / 255.0) * floor(pack.b * 255.0 * 0.25);
    
    return scatter * 1.0119047619;
}

float decodeAlpha(const in vec4 pack) {
    return pack.a;
}

float distanceToDepth(const in sampler2D depth, const in vec2 uv, const in vec4 viewPos, const vec2 nearFar) {
    float fragDepth = clamp( (-viewPos.z * viewPos.w - nearFar.x) / (nearFar.y - nearFar.x), 0.0, 1.0);
    return fragDepth - decodeDepth(texture2D(depth, uv));
}

const float MAX_BLUR = 16.0;
const float EPS_EARLY_OUT = 0.01;

float texDepthToCoC(const in vec4 fetch) {
    
    if(fetch.x == 1.0) return max(uDofBlurNearFarFocal.x, uDofBlurNearFarFocal.y);
    
    float coc = decodeDepth(fetch);
    coc = clamp((coc - uDofBlurNearFarFocal.z) / coc, -1.0, 1.0);
    return (coc < 0.0 ? coc * uDofBlurNearFarFocal.x : coc * uDofBlurNearFarFocal.y);
}

vec4 dofBlur16(const in vec2 blurDist, const in float ntime) {
    float rnd = 6.28 * ditheringNoise(gl_FragCoord.xy, uFrameModTaaSS + ntime);
    
    float cosa = cos(rnd);
    float sina = sin(rnd);
    vec4 basis = vec4(cosa, -sina, sina, cosa);
    
    vec4 sumcol = vec4(0.0);
    
    float total = 0.0;
    
    vec2 fTaps_Poisson[17];
    
    fTaps_Poisson[0] = vec2(0.343280198355, 0.921191856785);
    fTaps_Poisson[1] = vec2(-0.116859107262, 0.873056831344);
    fTaps_Poisson[2] = vec2(-0.646421287853, 0.760425284853);
    fTaps_Poisson[3] = vec2(-0.0437332058416, 0.47196719804);
    fTaps_Poisson[4] = vec2(0.48240473891, 0.464894594736);
    fTaps_Poisson[5] = vec2(-0.718897237297, 0.352191304304);
    fTaps_Poisson[6] = vec2(-0.939061387886, -0.0387376698953);
    fTaps_Poisson[7] = vec2(0.546569494557, -0.0169516524446);
    fTaps_Poisson[8] = vec2(-0.182644095652, -0.0702667761349);
    fTaps_Poisson[9] = vec2(-0.576191305396, -0.252368997099);
    fTaps_Poisson[10] = vec2(0.921914032366, -0.366530187909);
    fTaps_Poisson[11] = vec2(-0.0582053944545, -0.510617206206);
    fTaps_Poisson[12] = vec2(-0.783101528934, -0.601411360136);
    fTaps_Poisson[13] = vec2(0.430604354377, -0.729559481383);
    fTaps_Poisson[14] = vec2(-0.350716524868, -0.809522919973);
    fTaps_Poisson[15] = vec2(0.0600898835968, -0.952568587297);
    fTaps_Poisson[16] = vec2(0.0, 0.0);
    
    vec2 ofs;
    vec4 sampleTex;
    float cocWeight;
    
    ofs = fTaps_Poisson[0];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[1];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[2];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[3];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[4];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[5];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[6];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[7];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[8];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[9];                     ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[10];                    ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[11];                    ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[12];                    ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[13];                    ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[14];                    ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    ofs = fTaps_Poisson[15];                    ofs = gTexCoord + blurDist * vec2(dot(ofs, basis.xy), dot(ofs, basis.zw) );                     sumcol +=  (texture2D(TextureDofColor, (min(ofs, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio));;
    
    return sumcol;
}

vec4 dofBlurCircular() {
    if(uDofBlurNearFarFocal.x < EPS_EARLY_OUT && uDofBlurNearFarFocal.y < EPS_EARLY_OUT) {
        return vec4(0.0);
    }
    
    float factor = MAX_BLUR * uDofScale;
    
    vec2 blurDist = factor * pow( (texture2D(TextureDofColor, (min(gTexCoord, 1.0 - 1e+0 / uTextureDofColorSize.xy)) * uTextureDofColorRatio)).a, 0.333) / uTextureDofColorSize;
    
    vec4 sumcol = dofBlur16(blurDist, 0.0);
    if (uQuality > 0.33) sumcol += dofBlur16(blurDist, 3.0);
    if (uQuality > 0.66) sumcol += dofBlur16(blurDist, 5.0);
    
    return vec4(sumcol.rgb / sumcol.a, 1.0);
}

void main(void) {
    gTexCoord = gl_FragCoord.xy / uTextureOutputSize.xy;
    vec4 color = dofBlurCircular();
    
    color = encodeRGBM(color.rgb, uRGBMRange);
    gl_FragColor = color;
}

