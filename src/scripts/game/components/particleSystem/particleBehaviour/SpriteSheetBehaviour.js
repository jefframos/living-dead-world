import ParticleBehaviour from "./ParticleBehaviour";
import SpriteSheetAnimation from "../../utils/SpriteSheetAnimation";

export default class SpriteSheetBehaviour extends ParticleBehaviour {
    constructor() {
        super();
        this.property = 'texture';
        this.frames = [];
        this.currentFrame = 0;
    }

    build(params) {
        super.build(params);
        this.time = ParticleBehaviour.findValue(params.time) || 1;
        this.startFrame = ParticleBehaviour.findValue(params.startFrame) || 1;
        this.endFrame = ParticleBehaviour.findValue(params.endFrame) || 1;
        this.spriteName = ParticleBehaviour.findValue(params.spriteName);
        this.addZero = params.addZero;


        this.frames = [];
        for (let index = this.startFrame; index <= this.endFrame; index++) {
            let id = index;
            if (this.addZero && id < 10) {
                id = '0' + id;
            }
            this.frames.push(this.spriteName + id);
        }
    }

    reset() {
        super.reset();
        this.currentFrame = 0;

        if(this.frames.length){
            this.currentValue = PIXI.Texture.from(this.frames[this.currentFrame]);
        }
        this.autoKill = true;
        this.tween = 'linearTween';
    }

    update(delta) {
        super.update(delta)
        this.currentFrame = Math.floor(this.normalValue * this.frames.length)
        this.currentValue = PIXI.Texture.from(this.frames[this.currentFrame]);
    }
}