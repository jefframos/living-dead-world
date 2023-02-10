import BaseComponent from '../../core/gameObject/BaseComponent';
import Utils from '../../core/utils/Utils';

export default class FlashOnDamage extends BaseComponent {
    constructor() {
        super();
        this.intensity = 0;

        this.filter = new PIXI.filters.ColorMatrixFilter();

        this.flashTime = 0.3;
        this.flashCurrentTime = 0;
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

        this.setMatrix();

        if (this.gameObject.gameView && this.gameObject.gameView.view) {
            this.gameObject.gameView.view.filters = [this.filter]
        }
    }
    startFlash() {
        this.intensity = 1;
        this.flashCurrentTime = this.flashTime;
    }
    update(delta) {

        if (this.flashCurrentTime > 0) {
            this.flashCurrentTime -= delta;

            this.intensity = this.easeOutBack(this.flashCurrentTime / this.flashTime)

            this.intensity = Math.max(0, this.intensity)
            this.setMatrix();
        }
    }

    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
}