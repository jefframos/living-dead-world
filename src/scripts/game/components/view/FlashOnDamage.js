import BaseComponent from '../../core/gameObject/BaseComponent';
import Color from '../../core/utils/Color';
import Shaders from '../../shader/Shaders';
import Utils from '../../core/utils/Utils';

export default class FlashOnDamage extends BaseComponent {
    constructor() {
        super();
        this.intensity = 0;

        //this.filter = new PIXI.filters.ColorMatrixFilter();

        this.flashTime = 0.2;
        this.flashCurrentTime = 0;

        this.currentRGB = { r: 0, g: 0, b: 0 }


        this.startValue = Color.toRGB(0xFFFFFF);
        this.endValue = Color.toRGB(0xFF0000);

        this.uniformGroup = {
            intensity:0
        }
        this.shader =   new PIXI.Filter(null, Shaders.ENTITY_SPRITE_SHADER, this.uniformGroup)

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
            this.gameObject.gameView.view.tint = Color.rgbToColor(this.startValue);
            //this.gameObject.gameView.view.skew.set(0.65, -0.3);
            this.intensity = 1;
            //this.gameObject.gameView.view.filters = [this.shader]
        }

    }
    destroy(){
        super.destroy();
        this.gameObject.health.gotDamaged.remove(this.startFlash.bind(this))
    }
    startFlash() {
        if(this.gameObject.health.isDead) return;
        this.intensity = 1;
        this.flashCurrentTime = this.flashTime;
        if (this.gameObject.gameView && this.gameObject.gameView.view) {
            this.gameObject.gameView.view.tint = Color.rgbToColor(this.endValue);
        }
    }
    update(delta) {

        if (this.flashCurrentTime > 0) {
            this.flashCurrentTime -= delta;

            this.intensity = this.easeOutBack(this.flashCurrentTime / this.flashTime)

            this.intensity = Math.max(0, this.intensity)

            if(this.uniformGroup){
                this.uniformGroup.intensity = this.intensity;
            }

            this.currentRGB.r = Math.floor(this.intensity * (this.endValue.r - this.startValue.r) + this.startValue.r);
            this.currentRGB.g = Math.floor(this.intensity * (this.endValue.g - this.startValue.g) + this.startValue.g);
            this.currentRGB.b = Math.floor(this.intensity * (this.endValue.b - this.startValue.b) + this.startValue.b);
    
            this.currentValue = Color.rgbToColor(this.currentRGB);

            if (this.flashCurrentTime <= 0) {
                if (this.gameObject.gameView && this.gameObject.gameView.view) {
                    this.gameObject.gameView.view.tint = Color.rgbToColor(this.startValue);
                }
            }else{
                if (this.gameObject.gameView && this.gameObject.gameView.view) {
                    this.gameObject.gameView.view.tint = this.currentValue;
                }
            }
        }
    }


    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
}