import Layer from "../core/Layer";
import PhysicsEntity from "../modules/PhysicsEntity";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor() {
        super();

        this.view = new PIXI.Sprite.from('small-no-pattern-white')
    }
    build(x, y, width, height) {
        super.build()
        this.buildRect(x, y, width, height, true);

        this.layerCategory = Layer.Environment
        this.layerMask = 1 | Layer.Bullet
    }
    update(delta) {
        super.update(delta);
        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y
    }
    onRender() {
    }
}