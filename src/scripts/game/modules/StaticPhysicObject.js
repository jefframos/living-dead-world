import Matter from "matter-js";
import GameObject from "../core/GameObject";
import PhysicsEntity from "./PhysicsEntity";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor(x,y,width,height) {
        super();
        this.buildRect(x,y,width,height, true);
        this.view = new PIXI.Sprite.from('small-no-pattern-white')
    }
    update(delta){
        super.update(delta);
        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y
    }
    onRender(){
    }
}