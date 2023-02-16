import signals from 'signals';

export default class SpriteSheetAnimation {
    constructor() {
        this.currentLayer = null;
        this.currentState = null;
        this.init = false;
        this.currentLayerID = 0;
        this.animationState = {}
        this.animationFinish = new signals.Signal();
    }
    reset() {
        this.currentLayer = null;
        this.currentState = null;
        this.init = false;
        this.currentLayerID = 0;
        this.animationState = {}
    }
    addLayer(state, spriteName, param = { totalFramesRange: { min: 0, max: 1 }, time: 0.1, loop: true, addZero: false, anchor: { x: 0.5, y: 0.5 } }) {
        let animLayer = {
            currentAnimationTime: 0,
            currentFrame: 0,
            animationFrames: [],
            frameTime: param.time,
            loop: param.loop,
            anchor: param.anchor || {x:0.5, y:1}
        }
        for (let index = param.totalFramesRange.min; index <= param.totalFramesRange.max; index++) {
            let id = index;
            if (param.addZero && id < 10) {
                id = '0' + id;
            }
            animLayer.animationFrames.push(spriteName + id);
        }

        if (!this.animationState[state] || !this.animationState[state].layers) {
            this.animationState[state] = {}
            this.animationState[state].layers = []
        }
        this.animationState[state].layers.push(animLayer)

        this.currentAnimation = animLayer;

        this.currentAnimation.currentAnimationTime = Math.random() * param.time

        this.updateAnimation(0)

        this.init = true;

        this.currentState = state;
    }
    play(state) {
        if (this.currentState == state) return;
        this.currentState = state;
        this.setLayer(this.currentLayerID)
        if (!this.currentAnimation.loop) {
            this.currentAnimation.currentFrame = 0
            this.currentAnimation.currentAnimationTime = this.currentAnimation.frameTime
        }
    }
    setLayer(id) {
        if (id >= 0) {
            this.currentLayerID = id;
        }
        this.currentAnimation = this.animationState[this.currentState].layers[this.currentLayerID];

    }
    randomStartFrame() {
        this.currentAnimation.currentFrame = Math.floor(Math.random() * this.currentAnimation.animationFrames.length);
    }
    updateAnimation(delta) {

        if (this.currentAnimation.currentAnimationTime >= 0) {
            this.currentAnimation.currentAnimationTime -= delta;
            if (this.currentAnimation.currentAnimationTime < 0) {
                this.currentAnimation.currentFrame++;

                this.currentAnimation.currentFrame %= this.currentAnimation.animationFrames.length;
                this.currentAnimation.currentAnimationTime = this.currentAnimation.frameTime;
            }
        }

        if (!this.currentAnimation.loop && this.currentAnimation.currentFrame >= this.currentAnimation.animationFrames.length - 1) {
            this.animationFinish.dispatch(this.currentAnimation, this.currentState);
        }
        this.currentAnimation.currentFrame %= this.currentAnimation.animationFrames.length;
    }


    update(delta) {
        if (!this.currentAnimation) {
            return;
        }
        this.updateAnimation(delta);
    }
    get anchor() {
        return this.currentAnimation.anchor 
    }
    get currentFrame() {
        return this.currentAnimation.animationFrames[this.currentAnimation.currentFrame];
    }
}