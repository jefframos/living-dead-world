import GameView from "../core/GameView";
import Layer from "../core/Layer";
import StaticPhysicObject from "./StaticPhysicObject";

export default class Trees extends StaticPhysicObject {
    constructor() {
        super();

        //this.gameView = new GameView(this);
        let textures = ['tree (1)', 'tree (2)', 'tree (3)']
        this.gameView.view.texture = new PIXI.Texture.from(textures[Math.floor(Math.random() * textures.length)])
    }
    build(x, y, width, height) {
        super.build(x, y, width, height)
        //this.buildRect(x, y, width, height, true);

        console.log(width)
        this.gameView.view.scale.set(width / this.gameView.view.width* 2)
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