import Transform from "./Transform";

export default class GameObject {
    constructor() {
        this.transform = new Transform();
        this.children = []
        this.enabled = true;
        this.parent = null;

    }
    addChild(gameObject) {
        gameObject.setParent(this)
        this.children.push(gameObject);
    }
    start() {

    }
    onRender() {

    }
    update(delta) {
        this.children.forEach(element => {
            if (element.enabled) {
                element.update(delta);
            }
        });
    }
    enable() {
        this.enabled = true;

    }
    disable() {
        this.enabled = false;

    }
    removeChild(child) {
        for (let index = 0; index < this.children.length; index++) {
            if (this.children[index] == child) {
                this.children.splice(index, 1);
            }
        }
    }
    setParent(newParent) {
        if (this.parent && this.parent != newParent) {
            this.parent.removeChild(this)
        }
        this.parent = newParent;

    }
}