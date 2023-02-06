import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import PhysicsEntity from "../core/physics/PhysicsEntity";
import Shadow from "../components/view/Shadow";
import TagManager from "../core/TagManager";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this);

        let textures = ['grave (1)','grave (2)','grave (3)','grave (4)','grave (5)','grave (6)']
        this.gameView.view = new PIXI.Sprite.from(textures[Math.floor(Math.random()* textures.length)])
        this.gameView.tag = TagManager.Tags.Occlusion;
    }
    build(params) {
        super.build()
        this.buildRect(params.x, params.y, params.width, params.height, true);
        this.gameView.view.scale.set(params.width / this.gameView.view.width )

        this.gameView.view.anchor.set(0.5, 1)

        this.layerCategory = Layer.Environment
        this.layerMask = Layer.EnvironmentCollision

        let shadow = this.engine.poolGameObject(Shadow)
        this.addChild(shadow)
    }
    update(delta) {
        super.update(delta);
        this.gameView.update(delta)
    }
    onRender() {
    }
}