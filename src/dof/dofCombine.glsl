#version 100
precision highp float;

uniform float uDofScale;
uniform float uRGBMRange;
uniform float uToneBrightness;
uniform float uToneContrast;
uniform float uToneExposure;
uniform float uToneSaturation;
uniform int uToneMethod;
uniform sampler2D TextureDepth;
uniform sampler2D TextureDofBlurCircular;
uniform sampler2D TextureDofNearDilateV;
uniform sampler2D TextureInput;
uniform vec2 uTextureDepthRatio;
uniform vec2 uTextureDepthSize;
uniform vec2 uTextureDofBlurCircularRatio;
uniform vec2 uTextureDofBlurCircularSize;
uniform vec2 uTextureDofNearDilateVRatio;
uniform vec2 uTextureDofNearDilateVSize;
uniform vec2 uTextureInputRatio;
uniform vec2 uTextureInputSize;
uniform vec2 uTextureOutputRatio;
uniform vec2 uTextureOutputSize;
uniform vec3 uDofBlurNearFarFocal;
#define SHADER_NAME dofCombine_toneMapping

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

vec4 dofCombine() {
    vec2 uv = gTexCoord;
    vec3 color =  (vec4(decodeRGBM(texture2D(TextureInput, (min(uv, 1.0 - 1e+0 / uTextureInputSize.xy)) * uTextureInputRatio), uRGBMRange), 1.0)).rgb;
    
    if(uDofBlurNearFarFocal.x < EPS_EARLY_OUT && uDofBlurNearFarFocal.y < EPS_EARLY_OUT){
        return vec4(color, 1.0);
    }
    
    vec4 depthPacked =  (texture2D(TextureDepth, (min(uv, 1.0 - 1e+0 / uTextureDepthSize.xy)) * uTextureDepthRatio));
    
    vec3 blur;
    
    if (depthPacked.x == 1.0) {
        blur =  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (floor((min(uv, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularSize) + 0.5) * uTextureDofBlurCircularRatio / uTextureDofBlurCircularSize, -99999.0), uRGBMRange), 1.0)).rgb;
        vec2 off = vec2(1.0, -1.0) * uDofScale;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (floor((min(uv + off.xx / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularSize) + 0.5) * uTextureDofBlurCircularRatio / uTextureDofBlurCircularSize, -99999.0), uRGBMRange), 1.0)).rgb;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (floor((min(uv + off.yy / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularSize) + 0.5) * uTextureDofBlurCircularRatio / uTextureDofBlurCircularSize, -99999.0), uRGBMRange), 1.0)).rgb;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (floor((min(uv + off.xy / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularSize) + 0.5) * uTextureDofBlurCircularRatio / uTextureDofBlurCircularSize, -99999.0), uRGBMRange), 1.0)).rgb;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (floor((min(uv + off.yx / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularSize) + 0.5) * uTextureDofBlurCircularRatio / uTextureDofBlurCircularSize, -99999.0), uRGBMRange), 1.0)).rgb;
        blur /= 5.0;
        } else {
        blur =  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (min(uv, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularRatio), uRGBMRange), 1.0)).rgb;
        vec2 off = vec2(1.0, -1.0) * uDofScale;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (min(uv + off.xx / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularRatio), uRGBMRange), 1.0)).rgb;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (min(uv + off.yy / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularRatio), uRGBMRange), 1.0)).rgb;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (min(uv + off.xy / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularRatio), uRGBMRange), 1.0)).rgb;
        blur +=  (vec4(decodeRGBM(texture2D(TextureDofBlurCircular, (min(uv + off.yx / uTextureDofBlurCircularSize, 1.0 - 1e+0 / uTextureDofBlurCircularSize.xy)) * uTextureDofBlurCircularRatio), uRGBMRange), 1.0)).rgb;
        blur /= 5.0;
    }
    
    vec2 uvNearest = (floor(uv * uTextureDofNearDilateVSize) + 0.5) / uTextureDofNearDilateVSize;
    float coc = abs(min( (texture2D(TextureDofNearDilateV, (min(uvNearest, 1.0 - 1e+0 / uTextureDofNearDilateVSize.xy)) * uTextureDofNearDilateVRatio)).a * 2.0 - 1.0, texDepthToCoC(depthPacked)));
    
    float cocLower = 0.05;
    float cocHigher = 0.3;
    
    return vec4(mix(color, blur, smoothstep(cocLower, cocHigher, coc)), 1.0);
}

float getLuminance(const in vec3 color) {
    
    const vec3 colorBright = vec3(0.2126, 0.7152, 0.0722);
    return dot(color, colorBright);
}

vec3 toneMapping(const in vec3 color) {
    vec3 col = color * uToneExposure;
    float luminance = dot(col * (1.0 + uToneBrightness), vec3(0.2126, 0.7152, 0.0722));
    col = mix(vec3(luminance), col * (1.0 + uToneBrightness), vec3(uToneSaturation));
    
    float toneContrast = uToneContrast;
    col = max(vec3(0.0), col * (1.0 + toneContrast) - 0.5 * toneContrast);
    
    if(uToneMethod == 1) {
        col /= 1.0 + getLuminance(col);
        } else if( uToneMethod == 2) {
        vec3 x = max(vec3(0.0), col - 0.004);
        col = (x * (6.2 * x + 0.5) ) / ( x * (6.2 * x + 1.7) + 0.06);
        col = pow(col, vec3(2.2));
    }
    
    return col;
}

vec4 toneMapping(const in vec4 color) {
    return vec4(toneMapping(color.rgb), 1.0);
}

void main(void) {
    gTexCoord = gl_FragCoord.xy / uTextureOutputSize.xy;
    vec4 color = dofCombine();
    color = toneMapping(color);
    
    color.rgb = linearTosRGB(color.rgb);
    
    gl_FragColor = color;
}
