export default class Shaders {
    static ENTITY_SPRITE_SHADER = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform float intensity;
    
    void main(void) {
  vec4 color = texture2D(uSampler, vTextureCoord);
  if(color.a < 0.999){
    discard;
  }
  color.r = color.r + intensity;
  color.g = color.g + intensity;
  color.b = color.b + intensity;
  color.a = color.a;
  gl_FragColor = color;
}`;

    static get ENTITY_SPRITE_UNIFORMS() {
        return {
            intensity: 1
        }
    };

    constructor() {
    }
}