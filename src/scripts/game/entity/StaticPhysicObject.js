import GameView from "../core/GameView";
import Layer from "../core/Layer";
import PhysicsEntity from "../modules/PhysicsEntity";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this);

        let textures = ['grave (1)','grave (2)','grave (3)','grave (4)','grave (5)','grave (6)']
        this.gameView.view = new PIXI.Sprite.from(textures[Math.floor(Math.random()* textures.length)])
    }
    build(x, y, width, height) {
        super.build()
        this.buildRect(x, y, width, height, true);

        //console.log(width)
        this.gameView.view.scale.set(width / this.gameView.view.width )

        //this.gameView.viewOffset.y = -height/2

        this.gameView.view.anchor.set(0.5, 1)
        //this.gameView.view.pivot.y = height
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