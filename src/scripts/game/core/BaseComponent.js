import * as signals from 'signals';

export default class BaseComponent {
    constructor() {
        this.enabled
        this.gameObject = null;
    }
    reset() { }
    disable() { this.enabled = false;}
    enable() { this.enabled = true;}
    update() { }
    build() { }
    start() { }
    onRender() { }
    destroy() { }
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