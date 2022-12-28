
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
}