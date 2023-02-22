import * as signals from 'signals';

export default class BaseComponent {
    constructor() {
        this.enabled
        this.buildFrame = 0;
        this.gameObject = null;
    }
    reset() { }
    disable() { this.enabled = false; }
    enable() { this.enabled = true; }
    update() {
        if(this.buildFrame == 0){
            this.buildFrame ++;
            this.afterBuild();
        }
     }
    build() {
        this.buildFrame = 0;
    }
    afterBuild() { }
    start() { }
    onRender() { }
    destroy() { }
    afterDestroy() { }
    removeAllSignals() {
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                const element = this[key];
                if (element instanceof signals.Signal) {
                    element.removeAll();
                }
            }
        }
    }
}