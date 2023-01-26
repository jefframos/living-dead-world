import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import StaticPhysicObject from "./StaticPhysicObject";
import TagManager from "../core/TagManager";

export default class Trees extends StaticPhysicObject {
    constructor() {
        super();

        //this.gameView = new GameView(this);
        let textures = ['tree (1)', 'tree (2)','tree (3)']
        this.gameView.view.texture = new PIXI.Texture.from(textures[Math.floor(Math.random() * textures.length)])
        this.gameView.tag = TagManager.Tags.Occlusion;
    }
    build(x, y, width, height) {
        super.build(x, y, width, height)
        
        this.gameView.view.scale.set(1)
        this.gameView.view.anchor.set(0.5, 1)

        this.layerCategory = Layer.Environment
        this.layerMask = Layer.EnvironmentCollision
    }
    update(delta) {
        super.update(delta);

        this.gameView.update(delta)

    }
    onRender() {
    }
}