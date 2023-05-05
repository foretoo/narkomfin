#version 100
precision highp float;

uniform float uDofScale;
uniform float uRGBMRange;
uniform sampler2D TextureDepth;
uniform sampler2D TextureDofCoC;
uniform sampler2D TextureInput;
uniform vec2 uTextureDepthRatio;
uniform vec2 uTextureDepthSize;
uniform vec2 uTextureDofCoCRatio;
uniform vec2 uTextureDofCoCSize;
uniform vec2 uTextureOutputRatio;
uniform vec2 uTextureOutputSize;
uniform vec3 uDofBlurNearFarFocal;
#define SHADER_NAME TextureDofNearDilateH

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

vec4 dilateNear(const in vec2 offset) {
    if(uDofBlurNearFarFocal.x < EPS_EARLY_OUT && uDofBlurNearFarFocal.y < EPS_EARLY_OUT){
        return vec4(0.0);
    }
    
    vec2 uv = gTexCoord;
    bool isBG =  (texture2D(TextureDepth, (min(uv, 1.0 - 1e+0 / uTextureDepthSize.xy)) * uTextureDepthRatio)).x == 1.0;
    
    float coc = 0.0;
    vec2 ofs = MAX_BLUR * offset / 5.0;
    
    float coc0 =  (texture2D(TextureDofCoC, (min(uv, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc1 =  (texture2D(TextureDofCoC, (min(uv - 5.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc2 =  (texture2D(TextureDofCoC, (min(uv - 4.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc3 =  (texture2D(TextureDofCoC, (min(uv - 3.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc4 =  (texture2D(TextureDofCoC, (min(uv - 2.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc5 =  (texture2D(TextureDofCoC, (min(uv - 1.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc6 =  (texture2D(TextureDofCoC, (min(uv + 1.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc7 =  (texture2D(TextureDofCoC, (min(uv + 2.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc8 =  (texture2D(TextureDofCoC, (min(uv + 3.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc9 =  (texture2D(TextureDofCoC, (min(uv + 4.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    float coc10 =  (texture2D(TextureDofCoC, (min(uv + 5.0 * ofs, 1.0 - 1e+0 / uTextureDofCoCSize.xy)) * uTextureDofCoCRatio)).a * 2.0 - 1.0;
    
    if(isBG == true){
        
        coc = abs(coc0) * 0.095474 +
        (abs(coc1) + abs(coc10)) * 0.084264 +
        (abs(coc2) + abs(coc9)) * 0.088139 +
        (abs(coc3) + abs(coc8)) * 0.091276 +
        (abs(coc4) + abs(coc7)) * 0.093585 +
        (abs(coc5) + abs(coc6)) * 0.094998;
        } else {
        
        coc = min(coc0, 0.0);
        coc = min(coc1 * 0.3, coc);
        coc = min(coc2 * 0.5, coc);
        coc = min(coc3 * 0.75, coc);
        coc = min(coc4 * 0.8, coc);
        coc = min(coc5 * 0.95, coc);
        coc = min(coc6 * 0.95, coc);
        coc = min(coc7 * 0.8, coc);
        coc = min(coc8 * 0.75, coc);
        coc = min(coc9 * 0.5, coc);
        coc = min(coc10 * 0.3, coc);
        if(abs(coc0) > abs(coc)) coc = coc0;
    }
    
    return vec4(0.0, 0.0, 0.0, coc * 0.5 + 0.5);
}

vec4 dofNearDilateH() {
    vec2 offset = vec2(uDofScale / uTextureDofCoCSize.x, 0.0);
    return dilateNear(offset);
}

vec4 dofNearDilateV() {
    vec2 offset = vec2(0.0, uDofScale / uTextureDofCoCSize.y);
    return dilateNear(offset);
}

void main(void) {
    gTexCoord = gl_FragCoord.xy / uTextureOutputSize.xy;
    vec4 color = dofNearDilateH();
    
    gl_FragColor = color;
}
