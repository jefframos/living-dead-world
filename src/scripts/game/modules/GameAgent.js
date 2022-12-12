import Matter from "matter-js";
import GameObject from "../core/GameObject";
import PhysicsEntity from "./PhysicsEntity";

export default class GameAgent extends PhysicsEntity {
    constructor() {
        super();
        this.buildCircle(0,0,10);
        this.view = new PIXI.Sprite.from('icon_increase')
    }
    update(delta){
        super.update(delta);
        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y
    }
    onRender(){
    }
}