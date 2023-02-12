import BaseComponent from '../../core/gameObject/BaseComponent';
import Shaders from '../../shader/Shaders';
import Utils from '../../core/utils/Utils';

export default class FlashOnDamage extends BaseComponent {
    constructor() {
        super();
        this.intensity = 0;

        //this.filter = new PIXI.filters.ColorMatrixFilter();

        this.flashTime = 0.3;
        this.flashCurrentTime = 0;

        this.currentRGB = { r: 0, g: 0, b: 0 }


        this.startValue = this.toRGB(0xFFFFFF);
        this.endValue = this.toRGB(0xFF0000);
    }
    setMatrix() {
        this.filter.matrix = [
            1, this.intensity, this.intensity, this.intensity, this.intensity,
            this.intensity, 1, this.intensity, this.intensity, this.intensity,
            this.intensity, this.intensity, 1, this.intensity, this.intensity,
            0, 0, 0, 1, 0]
    }
    enable() {
        super.enable();
        this.intensity = 0;
        this.flashCurrentTime = 0;

        // this.setMatrix();
        if(this.gameObject.health){
            this.gameObject.health.gotDamaged.add(this.startFlash.bind(this))
        }

        if (this.gameObject.gameView && this.gameObject.gameView.view) {
            this.gameObject.gameView.view.tint = this.rgbToColor(this.startValue);
            //this.gameObject.gameView.view.skew.set(0.65, -0.3);

            //this.gameObject.gameView.view.filters = []
        }
        // if (this.gameObject.gameView && this.gameObject.gameView.view) {
        //     this.uniforms = Shaders.ENTITY_SPRITE_UNIFORMS;
        //     this.uniforms.intensity = 0.5;
        //     this.gameObject.gameView.view.filters = [new PIXI.Filter('',Shaders.ENTITY_SPRITE_SHADER,this.uniforms)]
        //     console.log(this.gameObject.gameView.view)
        // }


    }
    destroy(){
        super.destroy();
        this.gameObject.health.gotDamaged.remove(this.startFlash.bind(this))
    }
    startFlash() {
        this.intensity = 1;
        this.flashCurrentTime = this.flashTime;
        if (this.gameObject.gameView && this.gameObject.gameView.view) {
            this.gameObject.gameView.view.tint = this.rgbToColor(this.endValue);
        }
    }
    update(delta) {

        if (this.flashCurrentTime > 0) {
            this.flashCurrentTime -= delta;

            this.intensity = this.easeOutBack(this.flashCurrentTime / this.flashTime)

            this.intensity = Math.max(0, this.intensity)

            this.currentRGB.r = Math.floor(this.intensity * (this.endValue.r - this.startValue.r) + this.startValue.r);
            this.currentRGB.g = Math.floor(this.intensity * (this.endValue.g - this.startValue.g) + this.startValue.g);
            this.currentRGB.b = Math.floor(this.intensity * (this.endValue.b - this.startValue.b) + this.startValue.b);
    
            this.currentValue = this.rgbToColor(this.currentRGB);

            if (this.flashCurrentTime <= 0) {
                if (this.gameObject.gameView && this.gameObject.gameView.view) {
                    this.gameObject.gameView.view.tint = this.rgbToColor(this.startValue);
                }
            }else{
                if (this.gameObject.gameView && this.gameObject.gameView.view) {
                    this.gameObject.gameView.view.tint = this.currentValue;
                }
            }
        }
    }


    toRGB(rgb) {
        var r = rgb >> 16 & 0xFF;
        var g = rgb >> 8 & 0xFF;
        var b = rgb & 0xFF;
        return {
            r: r,
            g: g,
            b: b
        };
    }
    rgbToColor(color) {
        return color.r << 16 | color.g << 8 | color.b;
    }
    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
}