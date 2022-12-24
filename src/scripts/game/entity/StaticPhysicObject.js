import GameView from "../core/GameView";
import Layer from "../core/Layer";
import PhysicsEntity from "../modules/PhysicsEntity";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.view = new PIXI.Sprite.from('small-no-pattern-white')
    }
    build(x, y, width, height) {
        super.build()
        this.buildRect(x, y, width, height, true);

        //console.log(width)
        this.gameView.view.width = width
        this.gameView.view.height = height*2

        this.gameView.viewOffset.y = -height/2

        this.gameView.view.pivot.x = width/2
        this.gameView.view.pivot.y = height/2
        //this.gameView.view.anchor.set(0.5)

        this.layerCategory = Layer.Environment
        this.layerMask = Layer.EnvironmentCollision
    }
    update(delta) {
        super.update(delta);

        this.gameView.update(delta)

        //this.view.x = this.transform.position.x
        //this.view.y = this.transform.position.y
    }
    onRender() {
    }
}