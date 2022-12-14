import Layer from "../core/Layer";
import PhysicsEntity from "../modules/PhysicsEntity";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor(x,y,width,height) {
        super();
        this.buildRect(x,y,width,height, true);
        this.view = new PIXI.Sprite.from('small-no-pattern-white')

        this.layerCategory = Layer.Environment
        this.layerMask = Layer.Player | Layer.Enemy
    }
    update(delta){
        super.update(delta);
        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y
    }
    onRender(){
    }
}