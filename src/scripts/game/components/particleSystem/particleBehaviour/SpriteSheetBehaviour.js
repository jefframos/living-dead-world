import ParticleBehaviour from "./ParticleBehaviour";

export default class SpriteSheetBehaviour extends ParticleBehaviour {
    constructor() {
        super();
        this.property = ['texture', 'anchor'];
        this.frames = [];
        this.currentValue = [null,null]
        this.currentFrame = 0;
    }

    build(params) {
        super.build(params);
        this.time = ParticleBehaviour.findValue(params.time) || 1;
        this.frameTime = ParticleBehaviour.findValue(params.frameTime) || this.time;
        this.startFrame = ParticleBehaviour.findValue(params.startFrame) || 1;
        this.endFrame = ParticleBehaviour.findValue(params.endFrame) || 1;
        this.spriteName = ParticleBehaviour.findValue(params.spriteName);
        this.addZero = params.addZero;
        this.anchor = params.anchor ? params.anchor : {x:0.5,y:0.5}
        
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
        let frameCalc  = ParticleBehaviour[this.tween](this.currentTime / this.frameTime, 0, 1, 1) % 1;
        this.currentFrame = Math.floor(frameCalc * this.frames.length)
        this.currentValue[0] = PIXI.Texture.from(this.frames[this.currentFrame]);
        this.currentValue[1] = this.anchor;
    }
}