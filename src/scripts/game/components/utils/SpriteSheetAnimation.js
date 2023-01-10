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
    addLayer(state, spriteName, totalFramesRange = { min: 0, max: 1 }, time = 0.1, loop = true) {
        let animLayer = {
            currentAnimationTime: 0,
            currentFrame: 0,
            animationFrames: [],
            frameTime: time,
            loop: loop,
        }

        for (let index = totalFramesRange.min; index <= totalFramesRange.max; index++) {
            let id = index;
            if(id < 10){
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

        this.currentAnimation.currentAnimationTime = Math.random() * time

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
        this.updateAnimation(delta);
    }
    get currentFrame() {
        return this.currentAnimation.animationFrames[this.currentAnimation.currentFrame];
    }
}